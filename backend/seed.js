require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const categoriesData = [
  {
    name: 'Men',
    description: 'Trendy clothing, apparel and accessories for men',
    image: 'https://images.unsplash.com/photo-1490578474895-699bc4e2cf59?w=800',
    status: 'active'
  },
  {
    name: 'Women',
    description: 'Elegant dresses, tops, outerwear and fashion for women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    status: 'active'
  },
  {
    name: 'Kids',
    description: 'Cute, vibrant and comfortable fashion for children',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
    status: 'active'
  },
  {
    name: 'Shoes',
    description: 'Sneakers, boots, heels, and casual footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    status: 'active'
  },
  {
    name: 'Accessories',
    description: 'Watches, sunglasses, bags, belts and jewelry',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    status: 'active'
  },
  {
    name: 'T-Shirts',
    description: 'Casual, graphic, and oversized t-shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    status: 'active'
  },
  {
    name: 'Shirts',
    description: 'Formal, casual and linen button-down shirts',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
    status: 'active'
  },
  {
    name: 'Jeans',
    description: 'Denim jeans, skinny, slim fit and straight leg styles',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
    status: 'active'
  },
  {
    name: 'Dresses',
    description: 'Stunning evening dresses, casual dresses and gowns',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
    status: 'active'
  },
  {
    name: 'Jackets',
    description: 'Leather jackets, denim jackets, blazers and winter coats',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    status: 'active'
  }
];

const seedInline = async () => {
  try {
    console.log('Seeding initial categories, products, admin and demo user...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@fashion.com',
      password: adminPassword,
      phone: '9876543210',
      address: '101 Fashion Blvd, Suite 500, Mumbai, MH',
      role: 'admin'
    });

    const demoUser = await User.create({
      name: 'Manu Sharma',
      email: 'manusharma@gmail.com',
      password: userPassword,
      phone: '9123456789',
      address: '42 Regent Street, Indiranagar, Bengaluru, KA',
      role: 'user'
    });

    const standardUser = await User.create({
      name: 'John Doe',
      email: 'user@fashion.com',
      password: userPassword,
      phone: '9876543211',
      address: '12 Fashion St, Delhi, IN',
      role: 'user'
    });

    // Create Categories
    const categoriesMap = {};
    for (const cat of categoriesData) {
      const createdCat = await Category.create(cat);
      categoriesMap[createdCat.name] = createdCat._id;
    }

    // Sample Products Data
    const productsData = [
      {
        name: 'Nike Air Max Urban Sneakers',
        description: 'Premium lightweight sneakers with air cushioned sole for extreme comfort and modern street style.',
        brand: 'Nike',
        category: categoriesMap['Shoes'],
        gender: 'Unisex',
        price: 8999,
        discount: 15,
        sizes: ['7', '8', '9', '10', '11'],
        availableColors: ['Black', 'White', 'Red'],
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        stock: 25,
        rating: 4.8
      },
      {
        name: 'Adidas Ultraboost Running Shoes',
        description: 'High-performance running shoes with responsive boost midsole and breathable primeknit upper.',
        brand: 'Adidas',
        category: categoriesMap['Shoes'],
        gender: 'Men',
        price: 12999,
        discount: 20,
        sizes: ['8', '9', '10', '11'],
        availableColors: ['Black', 'Grey', 'Blue'],
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
        stock: 18,
        rating: 4.9
      },
      {
        name: 'Puma Retro Classic Leather Shoes',
        description: 'Timeless classic low-cut leather sneakers with iconic Puma stripe detailing.',
        brand: 'Puma',
        category: categoriesMap['Shoes'],
        gender: 'Women',
        price: 4999,
        discount: 10,
        sizes: ['6', '7', '8', '9'],
        availableColors: ['White', 'Pink', 'Beige'],
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
        stock: 30,
        rating: 4.6
      },
      {
        name: 'Zara Vintage Biker Leather Jacket',
        description: 'Authentic faux-leather jacket featuring asymmetrical zipper, lapel collar and zip pockets.',
        brand: 'Zara',
        category: categoriesMap['Jackets'],
        gender: 'Men',
        price: 6999,
        discount: 25,
        sizes: ['S', 'M', 'L', 'XL'],
        availableColors: ['Black', 'Dark Brown'],
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        stock: 15,
        rating: 4.7
      },
      {
        name: 'Levis 501 Original Fit Jeans',
        description: 'The world iconic straight fit blue jeans crafted from 100% heavy duty cotton denim.',
        brand: 'Levis',
        category: categoriesMap['Jeans'],
        gender: 'Men',
        price: 3999,
        discount: 10,
        sizes: ['30', '32', '34', '36'],
        availableColors: ['Dark Blue', 'Light Blue', 'Black'],
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
        stock: 40,
        rating: 4.8
      },
      {
        name: 'H&M Oversized Printed Graphic T-Shirt',
        description: 'Heavyweight cotton drop-shoulder oversized t-shirt with streetwear artwork print.',
        brand: 'H&M',
        category: categoriesMap['T-Shirts'],
        gender: 'Unisex',
        price: 1499,
        discount: 20,
        sizes: ['S', 'M', 'L', 'XL'],
        availableColors: ['Black', 'White', 'Olive Green'],
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        stock: 50,
        rating: 4.5
      },
      {
        name: 'Gucci Luxury Aviator Sunglasses',
        description: 'Designer aviator sunglasses with gold metal frame, UV400 protective polarized lenses.',
        brand: 'Gucci',
        category: categoriesMap['Accessories'],
        gender: 'Unisex',
        price: 18499,
        discount: 5,
        sizes: ['One Size'],
        availableColors: ['Gold', 'Black'],
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
        stock: 10,
        rating: 4.9
      },
      {
        name: 'Fossil Minimalist Chronograph Leather Watch',
        description: 'Sleek stainless steel case watch with genuine brown leather strap and quartz movement.',
        brand: 'Fossil',
        category: categoriesMap['Accessories'],
        gender: 'Men',
        price: 9999,
        discount: 30,
        sizes: ['One Size'],
        availableColors: ['Brown', 'Silver'],
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        stock: 20,
        rating: 4.7
      },
      {
        name: 'Forever 21 Floral Summer Wrap Dress',
        description: 'Lightweight V-neck floral print wrap midi dress ideal for sunny outings and dinner dates.',
        brand: 'Forever 21',
        category: categoriesMap['Dresses'],
        gender: 'Women',
        price: 2799,
        discount: 15,
        sizes: ['XS', 'S', 'M', 'L'],
        availableColors: ['Red Floral', 'Blue Floral', 'Yellow'],
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
        stock: 22,
        rating: 4.6
      },
      {
        name: 'Tommy Hilfiger Slim Fit Linen Casual Shirt',
        description: 'Breathable pure linen button-down shirt with flag logo embroidery on chest.',
        brand: 'Tommy Hilfiger',
        category: categoriesMap['Shirts'],
        gender: 'Men',
        price: 4499,
        discount: 12,
        sizes: ['M', 'L', 'XL'],
        availableColors: ['Sky Blue', 'White', 'Navy'],
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
        stock: 35,
        rating: 4.8
      },
      {
        name: 'Kids Playful Denim Overall & Cotton Tee Set',
        description: 'Soft cotton t-shirt paired with durable adjustable denim overalls for active kids.',
        brand: 'H&M',
        category: categoriesMap['Kids'],
        gender: 'Kids',
        price: 1999,
        discount: 10,
        sizes: ['2Y', '4Y', '6Y', '8Y'],
        availableColors: ['Blue Denim', 'Yellow'],
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
        stock: 25,
        rating: 4.7
      },
      {
        name: 'Zara Elegant Women Tailored Blazer',
        description: 'Structured double-breasted formal blazer with peak lapels and flap pockets.',
        brand: 'Zara',
        category: categoriesMap['Women'],
        gender: 'Women',
        price: 5999,
        discount: 18,
        sizes: ['S', 'M', 'L'],
        availableColors: ['Beige', 'Black', 'White'],
        image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800',
        stock: 14,
        rating: 4.8
      },
      {
        name: 'Calvin Klein Classic Cotton Crewneck T-Shirt',
        description: 'Ultra-soft premium cotton t-shirt with subtle chest logo branding for timeless everyday style.',
        brand: 'Calvin Klein',
        category: categoriesMap['T-Shirts'],
        gender: 'Men',
        price: 2999,
        discount: 15,
        sizes: ['S', 'M', 'L', 'XL'],
        availableColors: ['Black', 'White', 'Grey'],
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        stock: 40,
        rating: 4.7
      },
      {
        name: 'Mango Velvet Evening Cocktail Dress',
        description: 'Stunning bodycon velvet midi dress with deep V-neckline and elegant side slit.',
        brand: 'Mango',
        category: categoriesMap['Dresses'],
        gender: 'Women',
        price: 7499,
        discount: 20,
        sizes: ['XS', 'S', 'M', 'L'],
        availableColors: ['Emerald Green', 'Wine Red', 'Black'],
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
        stock: 18,
        rating: 4.9
      },
      {
        name: 'Ralph Lauren Classic Fit Polo Shirt',
        description: 'Signature breathable mesh cotton polo shirt featuring iconic pony player embroidery.',
        brand: 'Ralph Lauren',
        category: categoriesMap['Shirts'],
        gender: 'Men',
        price: 5499,
        discount: 10,
        sizes: ['M', 'L', 'XL', 'XXL'],
        availableColors: ['Navy Blue', 'White', 'Red'],
        image: 'https://images.unsplash.com/photo-1625910513413-7fc21e344675?w=800',
        stock: 30,
        rating: 4.8
      },
      {
        name: 'Levis High-Rise Wide Leg Vintage Jeans',
        description: 'Trendy high-waisted wide leg denim jeans crafted with organic cotton for relaxed chic look.',
        brand: 'Levis',
        category: categoriesMap['Jeans'],
        gender: 'Women',
        price: 4499,
        discount: 15,
        sizes: ['26', '28', '30', '32'],
        availableColors: ['Vintage Blue', 'Washed Black'],
        image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800',
        stock: 25,
        rating: 4.7
      },
      {
        name: 'The North Face Insulated Puffer Jacket',
        description: 'Water-resistant down filled puffer winter jacket engineered for ultimate warmth and modern aesthetic.',
        brand: 'The North Face',
        category: categoriesMap['Jackets'],
        gender: 'Unisex',
        price: 14999,
        discount: 10,
        sizes: ['S', 'M', 'L', 'XL'],
        availableColors: ['Matte Black', 'Yellow', 'Olive'],
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
        stock: 15,
        rating: 4.9
      },
      {
        name: 'Michael Kors Designer Leather Tote Bag',
        description: 'Spacious saffiano leather shoulder bag with gold-tone hardware and top zip closure.',
        brand: 'Michael Kors',
        category: categoriesMap['Accessories'],
        gender: 'Women',
        price: 16999,
        discount: 25,
        sizes: ['One Size'],
        availableColors: ['Tan Brown', 'Black', 'Soft Pink'],
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
        stock: 12,
        rating: 4.9
      },
      {
        name: 'Converse Chuck Taylor High-Top Sneakers',
        description: 'The world classic canvas high-top sneakers with vulcanized rubber sole and star ankle patch.',
        brand: 'Converse',
        category: categoriesMap['Shoes'],
        gender: 'Unisex',
        price: 4999,
        discount: 10,
        sizes: ['6', '7', '8', '9', '10'],
        availableColors: ['Black', 'White', 'Red'],
        image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800',
        stock: 35,
        rating: 4.8
      },
      {
        name: 'Zara Silk Floral Summer Kimono Top',
        description: 'Breezy lightweight silk wrap kimono top with vibrant tropical botanical prints.',
        brand: 'Zara',
        category: categoriesMap['Women'],
        gender: 'Women',
        price: 3499,
        discount: 15,
        sizes: ['S', 'M', 'L'],
        availableColors: ['Floral Multi', 'Pastel Green'],
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        stock: 20,
        rating: 4.6
      },
      {
        name: 'Gap Kids Fleece Hooded Sweatshirt',
        description: 'Cozy fleece lined pullover hoodie with kangaroo front pocket for kids.',
        brand: 'Gap',
        category: categoriesMap['Kids'],
        gender: 'Kids',
        price: 2299,
        discount: 20,
        sizes: ['4Y', '6Y', '8Y', '10Y'],
        availableColors: ['Navy Blue', 'Bright Red', 'Pink'],
        image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800',
        stock: 30,
        rating: 4.7
      },
      {
        name: 'Ray-Ban Classic Wayfarer Polarized Sunglasses',
        description: 'Iconic Wayfarer acetate sunglasses with G-15 green polarized lenses for 100% UV protection.',
        brand: 'Ray-Ban',
        category: categoriesMap['Accessories'],
        gender: 'Unisex',
        price: 8999,
        discount: 12,
        sizes: ['One Size'],
        availableColors: ['Tortoise', 'Black'],
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
        stock: 18,
        rating: 4.8
      }
    ];

    for (const prod of productsData) {
      prod.finalPrice = Math.round(prod.price - (prod.price * prod.discount) / 100);
      await Product.create(prod);
    }

    console.log(`Successfully seeded categories, products, admin and demo user!`);
  } catch (error) {
    console.error('Seeding Error:', error);
  }
};

module.exports = { seedInline };
