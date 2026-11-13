const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add product description']
    },
    brand: {
      type: String,
      required: [true, 'Please add product brand'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category']
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Kids', 'Unisex'],
      default: 'Unisex'
    },
    price: {
      type: Number,
      required: [true, 'Please add product price'],
      min: [0, 'Price must be positive']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    finalPrice: {
      type: Number,
      default: function () {
        return this.price - (this.price * (this.discount || 0)) / 100;
      }
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    availableColors: {
      type: [String],
      default: ['Black', 'White', 'Blue']
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL']
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock amount'],
      min: [0, 'Stock cannot be negative'],
      default: 10
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to automatically compute finalPrice
productSchema.pre('save', function (next) {
  if (this.price !== undefined) {
    const discountVal = this.discount || 0;
    this.finalPrice = Math.round(this.price - (this.price * discountVal) / 100);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
