const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');

exports.index = asyncHandler(async (req, res, next) => {
  const [categoryCount, itemCount] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render('index', {
    categoryCount,
    itemCount,
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).sort({ name: 1 });

  res.render('category_list', { categories });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const [category, items] = await Promise.all([
    Category.findById(id).exec(),
    Item.find({ category: id }).sort({ name: 1 }),
  ]);

  res.render('category_detail', { category, items });
});
