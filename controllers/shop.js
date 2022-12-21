const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart  => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: products
          })
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  let fecthedCart
  req.user.getCart()
    .then(cart => {
      fecthedCart = cart
      return cart.getProducts({where: { id: prodId } })
    })
    .then(products => {
      let product
      if (products.length > 0) {
        product = products[0]
      }
      let newQuantity = 1
      if (product) {
        const oldQuantity = product.cartItem.quantity
        newQuantity = oldQuantity + 1
        return fecthedCart.addProduct(product, {
          through: {
            quantity: newQuantity
          }
        })
      }
      return Product.findByPk(prodId)
        .then(product => {
          return fecthedCart.addProduct(product, { 
            through: { 
              quantity: newQuantity 
            } 
          })
        })
        .catch(err => console.log(err))
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0]
      return product.cartItem.destroy()
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  let fecthedCart
  req.user.getCart()
    .then(cart => {
      fecthedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product
          }))
        })
        .catch(err => console.log(err))
    })
    .then(result => {
      return fecthedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders
      })
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    'pageTitle': 'Checkout',
    'path': '/checkout'
  })
}