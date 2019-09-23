const mongoose = require('mongoose');

const Product = require('../models/product');


exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        products: result.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`
            }
          }
        })
      }
      if (result.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(200).json({
          message: "No data found"
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
};

exports.products_create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
    .then(result => {
      const response = {
        message: 'Product was successfully created',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: req.file.path,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`
          }
        }
      }
      res.status(201).json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      if (doc) {
        const response = {
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products'
          }
        }
        res.status(200).json(response);
      } else {
        res.status(404).json({message: 'No valid entry found for provided ID'});
      }
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.update({_id: id}, {$set: updateOps})
    .exec()
    .then(doc => {
      res.status(200).json({
        message: 'product updated',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId
  Product.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
};

