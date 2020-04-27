var express = require('express');
var model = require('../models/index');
var { mongoConn } = require('../config/index');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', { title: 'Express' });

});


// used for adding categories
router.post('/addCategory', function (req, res, next) {

  mongoConn.then(db => {

    const categoryModel = model.Category;
    const category = new categoryModel(db);
    category.addCategory(req.body).then(response => {
      if (response.status) {
        res.status(200).send(response);
      }
      else if (!response.status) {
        res.status(400).send(response);
      }
    });
  }).catch(error => {
    res.status(400).send(`Error:${error}`);
  });

});

// used for adding categories with their child categories
router.get('/fetchAllCategories', function (req, res, next) {

  mongoConn.then(db => {

    const categoryModel = model.Category;
    const category = new categoryModel(db);
    category.fetchParentChildCategories(req.body).then(response => {
      if (response.status) {
        res.status(200).send(response);
      }
      else if (!response.status) {
        res.status(400).send(response);
      }
    });
  }).catch(error => {
    res.status(400).send(`Error:${error}`);
  });

});

// used for adding product by mapping it to category
router.post('/addProduct', function (req, res, next) {
  mongoConn.then(db => {

    const productModel = model.Product;
    const product = new productModel(db);
    product.addProduct(req.body).then(response => {
      if (response.status) {
        res.status(200).send(response);
      }
      else if (!response.status) {
        res.status(400).send(response);
      }
    });
  }).catch(error => {
    res.status(400).send(`Error:${error}`);
  });
});

// // used for fetching products by filter by category
router.get('/filterProductByCategory', function (req, res, next) {
  mongoConn.then(db => {

    const productModel = model.Product;
    const product = new productModel(db);
    product.getProductsByCategory(req.query).then(response => {
      if (response.status) {
        res.status(200).send(response);
      }
      else if (!response.status) {
        res.status(400).send(response);
      }
    });
  }).catch(error => {
    res.status(400).send(`Error:${error}`);
  });
});








module.exports = router;
