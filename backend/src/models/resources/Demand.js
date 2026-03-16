const mongoose = require('mongoose');

const VALID_CATEGORIES = ['drill', 'ladder', 'projector', 'tent', 'tool', 'appliance', 'sports', 'other'];

const demandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please describe what you need'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      enum: { values: VALID_CATEGORIES, message: 'Invalid category' },
      required: [true, 'Please select a category'],
    },
    fromDate: {
      type: Date,
      required: [true, 'Please provide start date'],
    },
    toDate: {
      type: Date,
      required: [true, 'Please provide end date'],
    },
    maxBudgetPerDay: {
      type: Number,
      required: [true, 'Please provide your max budget per day'],
      min: [1, 'Budget must be at least ₹1'],
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'fulfilled', 'expired'],
      default: 'open',
    },
    fulfilledBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'Resource',
      default: null,
    },
    fulfilledAt: {
      type: Date,
      default: null,
    },
    // How many users need the same item in this period
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
    // All users who joined this demand (first poster + others who matched)
    interestedUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Auto-expire demands whose toDate has passed
demandSchema.index({ toDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Demand', demandSchema);
