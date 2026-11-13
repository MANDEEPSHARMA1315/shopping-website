const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add category name'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Category', categorySchema);
