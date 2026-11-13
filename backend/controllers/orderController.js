const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order from user cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all shipping address fields (fullName, phone, address, city, state, pincode)'
      });
    }

    // Retrieve user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping cart is empty'
      });
    }

    let subtotal = 0;
    let totalDiscount = 0;
    const orderProducts = [];

    // Verify stock and prepare order items
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(404).json({
          success: false,
          message: 'One or more products in your cart no longer exist'
        });
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product "${item.product.name}". Only ${item.product.stock} left.`
        });
      }

      const itemPrice = item.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      if (item.product.discount) {
        const itemDiscount = Math.round((item.product.price * item.product.discount / 100) * item.quantity);
        totalDiscount += itemDiscount;
      }

      orderProducts.push({
        product: item.product._id,
        quantity: item.quantity,
        price: itemPrice,
        size: item.size,
        color: item.color
      });

      // Deduct product stock
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    const deliveryFee = subtotal > 2000 ? 0 : 50;
    const grandTotal = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      subtotal,
      discount: totalDiscount,
      deliveryFee,
      totalAmount: grandTotal,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      orderStatus: 'Pending'
    });

    // Clear cart after order is successfully placed
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name image brand category');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders (or all orders if admin)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({})
        .populate('user', 'name email phone')
        .populate('products.product', 'name image brand price')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: req.user._id })
        .populate('products.product', 'name image brand price')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('products.product', 'name image brand price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    const populated = await Order.findById(updatedOrder._id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name image brand');

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
