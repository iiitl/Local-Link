const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const {
  createDemand,
  listDemands,
  getMyDemands,
  fulfillDemand,
  cancelDemand,
} = require('../../controllers/resources/demandController');

router.get('/', listDemands);
router.get('/my-demands', protect, getMyDemands);
router.post('/', protect, createDemand);
router.put('/:id/fulfill', protect, fulfillDemand);
router.delete('/:id', protect, cancelDemand);

module.exports = router;
