var express = require('express');
var model = require('../models/index');
var { mongoConn } = require('../config/index');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', { title: 'Express' });

});



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

router.put('/updateProduct', function (req, res, next) {
  const db_name = "nodetest1";
  const db = client.db(db_name);

  const col = db.collection('usercollection');
  col.find({ "username": "testuser1" }).toArray().then(results => {
    console.log(results);

  }).catch(
    error => console.log(error)
  )
});







module.exports = router;
