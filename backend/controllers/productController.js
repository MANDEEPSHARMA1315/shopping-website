const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with dynamic filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      brand,
      category,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      minRating,
      search,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // 1. Brand filter
    if (brand) {
      const brandsArray = brand.split(',').map((b) => b.trim());
      query.brand = { $in: brandsArray.map((b) => new RegExp(b, 'i')) };
    }

    // 2. Gender filter
    if (gender) {
      query.gender = new RegExp(`^${gender}$`, 'i');
    }

    // 3. Size filter
    if (size) {
      const sizesArray = size.split(',').map((s) => s.trim().toUpperCase());
      query.sizes = { $in: sizesArray };
    }

    // 4. Color filter
    if (color) {
      const colorsArray = color.split(',').map((c) => c.trim());
      query.availableColors = { $in: colorsArray.map((c) => new RegExp(c, 'i')) };
    }

    // 5. Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // 6. Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // 7. Category filter (ID or Name)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ name: new RegExp(`^${category}$`, 'i') });
        if (cat) {
          query.category = cat._id;
        } else {
          // If category name doesn't match any category, return empty result
          return res.status(200).json({
            success: true,
            count: 0,
            totalProducts: 0,
            totalPages: 0,
            currentPage: Number(page),
            data: []
          });
        }
      }
    }

    // 8. Search query (by product name or description or brand)
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex }
      ];
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 }; // Default: newest
    if (sort === 'price-asc' || sort === 'low-to-high') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc' || sort === 'high-to-low') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name image description')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      currentPage: pageNum,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name image');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      gender,
      price,
      discount,
      sizes,
      availableColors,
      image,
      stock,
      rating
    } = req.body;

    if (!name || !description || !brand || !category || price === undefined || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, brand, category, price, image'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Product price must be a non-negative number'
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const discountVal = Number(discount) || 0;
    const computedFinalPrice = Math.round(price - (price * discountVal) / 100);

    const product = await Product.create({
      name,
      description,
      brand,
      category,
      gender: gender || 'Unisex',
      price: Number(price),
      discount: discountVal,
      finalPrice: computedFinalPrice,
      sizes: Array.isArray(sizes) ? sizes : ['S', 'M', 'L', 'XL'],
      availableColors: Array.isArray(availableColors) ? availableColors : ['Black', 'White'],
      image,
      stock: stock !== undefined ? Number(stock) : 10,
      rating: rating !== undefined ? Number(rating) : 4.5
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      brand,
      category,
      gender,
      price,
      discount,
      sizes,
      availableColors,
      image,
      stock,
      rating
    } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      product.category = category;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (brand) product.brand = brand;
    if (gender) product.gender = gender;
    if (price !== undefined) product.price = Number(price);
    if (discount !== undefined) product.discount = Number(discount);
    if (sizes) product.sizes = Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim());
    if (availableColors) product.availableColors = Array.isArray(availableColors) ? availableColors : availableColors.split(',').map(c => c.trim());
    if (image) product.image = image;
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);

    product.finalPrice = Math.round(product.price - (product.price * (product.discount || 0)) / 100);

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id).populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
