const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');

exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({}).sort({ name: 1 });

  res.render('item_list', { items });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category');

  res.render('item_detail', { item });
});
