import Order from '../models/Order.js';
import Book from '../models/Book.js';

// @desc    Create new order or reservation
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    type, // 'purchase' or 'reservation'
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Double check stock and decrement
    for (const item of orderItems) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.title}` });
      }
      if (book.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for: ${item.title}` });
      }
      // Decrement stock
      book.stock -= item.qty;
      await book.save();
    }

    const expiryDate = type === 'reservation' 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      : null;

    const order = new Order({
      user: req.user._id,
      orderItems,
      type,
      shippingAddress: type === 'purchase' ? shippingAddress : undefined,
      paymentMethod,
      totalPrice,
      isPaid: type === 'purchase', // Default paid for purchases in mock checkout, false for reservations
      paidAt: type === 'purchase' ? new Date() : undefined,
      reservationExpiry: expiryDate,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');

    if (order) {
      // Check ownership
      if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id username').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid (Admin/Payment gateway)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered (Admin)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
};
