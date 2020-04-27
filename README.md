# express-mongo

A basic implementation of E-commerce Store using Express Framework with MongoDB as database

The goal is Building a RESTful APIs from scratch using Express - Node.js. The Entities are a “Categories” and “Products”.
Category can have multiple child categories.
Child category can have further child categories.
Category can have multiple products and product can be assigned to a category.

The Entities are saved in MongoDb and be retrieved via POST and GET Methods respectively.The API's are the following:
  1. Add a category
  2. Add Product mapped to a category
  3. Get all categories with all its child categories mapped to it.
  4. Get all products by a category.
  


