const Demand = require('../../models/resources/Demand');
const Resource = require('../../models/resources/Resource');

const VALID_CATEGORIES = ['drill', 'ladder', 'projector', 'tent', 'tool', 'appliance', 'sports', 'other'];

// ─────────────────────────────────────────────
// POST /api/v1/demands
// Create a demand + instant match check
// ─────────────────────────────────────────────
exports.createDemand = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, error: 'Not authorized' });

    const { title, category, fromDate, toDate, maxBudgetPerDay } = req.body;

    // ── Validation ──────────────────────────────
    if (!title || !category || !fromDate || !toDate || !maxBudgetPerDay) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ success: false, error: 'Invalid dates' });
    }
    if (from < today) {
      return res.status(400).json({ success: false, error: 'Start date cannot be in the past' });
    }
    if (to <= from) {
      return res.status(400).json({ success: false, error: 'End date must be after start date' });
    }
    if (Number(maxBudgetPerDay) < 1) {
      return res.status(400).json({ success: false, error: 'Budget must be at least ₹1/day' });
    }

    // ── Duplicate check: same user, same category, overlapping dates ──
    const overlap = await Demand.findOne({
      postedBy: userId,
      category,
      status: 'open',
      fromDate: { $lte: to },
      toDate: { $gte: from },
    });
    if (overlap) {
      return res.status(400).json({
        success: false,
        error: 'You already have an open demand for this category in that date range',
      });
    }

    // ── Instant match: find available resources in category + date range + budget ──
    const Booking = require('../../models/resources/Booking');
    const candidates = await Resource.find({
      category,
      isActive: true,
      pricePerDay: { $lte: Number(maxBudgetPerDay) },
      availableFrom: { $lte: from },
      availableTo: { $gte: to },
    }).populate('owner', 'fullName rating');

    // Filter out resources with conflicting active bookings
    const matches = [];
    for (const r of candidates) {
      const conflict = await Booking.countDocuments({
        resource: r._id,
        status: { $in: ['confirmed', 'active'] },
        fromDate: { $lt: to },
        toDate: { $gt: from },
      });
      if (conflict === 0) matches.push(r);
    }

    if (matches.length > 0) {
      // Matches found — return suggestions WITHOUT saving the demand
      return res.status(200).json({
        success: true,
        matched: true,
        matches: matches.slice(0, 5).map((r) => ({
          _id: r._id,
          title: r.title,
          category: r.category,
          condition: r.condition,
          pricePerDay: r.pricePerDay,
          depositAmount: r.depositAmount,
          owner: r.owner,
        })),
        message: `${matches.length} item(s) already available for your request! Book directly.`,
      });
    }

    // ── No match — save demand publicly ──────────────────────────────
    const demand = await Demand.create({
      title,
      category,
      fromDate: from,
      toDate: to,
      maxBudgetPerDay: Number(maxBudgetPerDay),
      postedBy: userId,
    });

    await demand.populate('postedBy', 'fullName');

    res.status(201).json({
      success: true,
      matched: false,
      data: demand,
      message: 'No items found right now. Your demand has been posted publicly — other members will be notified.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/v1/demands
// List all open public demands (for other users to fulfill)
// ─────────────────────────────────────────────
exports.listDemands = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: 'open', toDate: { $gte: new Date() } };
    if (category && VALID_CATEGORIES.includes(category)) filter.category = category;

    const demands = await Demand.find(filter)
      .populate('postedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, count: demands.length, data: demands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/v1/demands/my-demands
// My posted demands
// ─────────────────────────────────────────────
exports.getMyDemands = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, error: 'Not authorized' });

    const demands = await Demand.find({ postedBy: userId })
      .populate('fulfilledBy', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: demands.length, data: demands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/v1/demands/:id/fulfill
// Owner lists/links their resource to fulfill a demand
// ─────────────────────────────────────────────
exports.fulfillDemand = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, error: 'Not authorized' });

    const demand = await Demand.findById(req.params.id);
    if (!demand || demand.status !== 'open') {
      return res.status(404).json({ success: false, error: 'Demand not found or already fulfilled' });
    }
    if (demand.postedBy.toString() === userId.toString()) {
      return res.status(400).json({ success: false, error: 'You cannot fulfill your own demand' });
    }

    const { resourceId } = req.body;
    if (!resourceId) {
      return res.status(400).json({ success: false, error: 'Please provide resourceId' });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource || !resource.isActive) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    if (resource.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: 'You can only fulfill with your own items' });
    }
    if (resource.category !== demand.category) {
      return res.status(400).json({
        success: false,
        error: `Your item category "${resource.category}" does not match demand category "${demand.category}"`,
      });
    }

    demand.status = 'fulfilled';
    demand.fulfilledBy = resource._id;
    demand.fulfilledAt = new Date();
    await demand.save();

    res.status(200).json({
      success: true,
      message: 'Demand fulfilled! The requester can now book your item.',
      data: { demandId: demand._id, resourceId: resource._id, resourceTitle: resource.title },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/v1/demands/:id
// Cancel own open demand
// ─────────────────────────────────────────────
exports.cancelDemand = async (req, res) => {
  try {
    const userId = req.user?._id;
    const demand = await Demand.findById(req.params.id);
    if (!demand) return res.status(404).json({ success: false, error: 'Demand not found' });
    if (demand.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: 'Not your demand' });
    }
    await demand.deleteOne();
    res.status(200).json({ success: true, message: 'Demand cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
