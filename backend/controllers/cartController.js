const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to format and calculate dynamic cart totals
const formatCartResponse = (cart) => {
  let subtotal = 0;
  let totalDiscount = 0;

  const items = cart.items.map((item) => {
    const itemSubtotal = item.price * item.quantity;
    let itemDiscount = 0;
    if (item.product && item.product.discount) {
      // Calculate discount amount from original price vs final discount
      const origPrice = item.product.price;
      const discountPercent = item.product.discount;
      itemDiscount = Math.round((origPrice * discountPercent / 100) * item.quantity);
    }

    subtotal += itemSubtotal;
    totalDiscount += itemDiscount;

    return {
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
      itemTotal: itemSubtotal
    };
  });

  const deliveryFee = subtotal > 0 ? (subtotal > 2000 ? 0 : 50) : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee);

  return {
    _id: cart._id,
    user: cart.user,
    items,
    subtotal,
    discount: totalDiscount,
    deliveryFee,
    totalAmount: grandTotal,
    totalItemsCount: items.reduce((acc, curr) => acc + curr.quantity, 0)
  };
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name brand price discount finalPrice image stock sizes availableColors category'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size = 'M', color = 'Black' } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} items available.`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product with exact same size & color already in cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qty;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Stock limit of ${product.stock} reached for this item.`
        });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.finalPrice || product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity: qty,
        price: product.finalPrice || product.price,
        size,
        color
      });
    }

    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name brand price discount finalPrice image stock sizes availableColors category'
    });

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      data: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity or selection in cart
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity, size, color } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity !== undefined) {
      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty < 0) {
        return res.status(400).json({ success: false, message: 'Invalid quantity' });
      }

      if (qty === 0) {
        // Remove item if quantity set to 0
        cart.items.pull(itemId);
      } else {
        const product = await Product.findById(item.product);
        if (product && qty > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} items in stock`
          });
        }
        item.quantity = qty;
      }
    }

    if (size) item.size = size;
    if (color) item.color = color;

    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name brand price discount finalPrice image stock sizes availableColors category'
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name brand price discount finalPrice image stock sizes availableColors category'
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
