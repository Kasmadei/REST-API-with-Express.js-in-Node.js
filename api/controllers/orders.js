const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("quantity _id product")
    .populate('product', 'name')
    .exec()
    .then(result => {
      res.status(200).json({
        count: result.length,
        orders: result.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders' + doc._id
            }
          }
        })

      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Not found'
        })
      }
      res.status(200).json({
        order: order
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
};

exports.orders_delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};



