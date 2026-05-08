const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrderStatus, getMyOrders } = require('../controllers/ordersController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/', verifyAdmin, getOrders);
router.put('/:id/status', verifyAdmin, updateOrderStatus);

module.exports = router;
