const asyncHandler = require('express-async-handler');
// eslint-disable-next-line import/no-extraneous-dependencies
const { body, validationResult } = require('express-validator');

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

exports.category_create_get = (req, res, next) => {
  res.render('category_form');
};

exports.category_create_post = [
  body('name', 'Category name must contain at least 3 characters.')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render('category_form', {
        category,
        errors: errors.array(),
      });
    } else {
      const categoryExist = await Category.findOne({
        name: category.name,
      }).exec();
      if (categoryExist) {
        res.redirect(categoryExist.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];
