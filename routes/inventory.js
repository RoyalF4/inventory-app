const express = require('express');
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

const router = express.Router();

// get home page

router.get('/', categoryController.index);

// categories
router.get('/category/:id', categoryController.category_detail);

router.get('/categories', categoryController.category_list);

// items
router.get('/item/:id', itemController.item_detail);

router.get('/items', itemController.item_list);

// router.get('/category/create', categoryController.category_create_get);

// router.post('/category/create', categoryController.category_create_post);

// router.get('/category/:id', categoryController.category_list);

module.exports = router;
