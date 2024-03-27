const asyncHandler = require('express-async-handler');
// eslint-disable-next-line import/no-extraneous-dependencies
const { body, validationResult } = require('express-validator');

const Item = require('../models/item');
const Category = require('../models/category');

exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({}).sort({ name: 1 });

  res.render('item_list', { items });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category');

  res.render('item_detail', { item });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().exec();
  res.render('item_form', { categories });
});

exports.item_create_post = [
  body('name', 'Item must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Must select a Category.').notEmpty().escape(),
  body('price', 'Price must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .isInt({ min: 1 })
    .withMessage('Price must be an integer value.')
    .escape(),
  body('number_in_stock')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Stock must be a integer value greater then 0')
    .escape(),
  body('members').escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = await Category.findOne({ name: req.body.category });

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category,
      price: req.body.price,
      number_in_stock: req.body.stock,
      members: req.body.members === 'on',
    });
    console.log(item);
    if (!errors.isEmpty()) {
      const categories = await Category.find({}).exec();
      res.render('item_form', {
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        stock: item.stock,
        members: item.members,
        categories,
        errors: errors.array(),
      });
    } else {
      const itemExist = await Item.findOne({ name: item.name }).exec();

      if (itemExist) {
        res.redirect(itemExist.url);
      } else {
        await item.save();
        res.redirect(item.url);
      }
    }
  }),
];
