const express = require("express")
const { addProduct, getProducts, deleteProduct, updateProduct } = require("../controllers/products")
const authenticate = require('../middleware/authenticate_user')
const router = express.Router()

router.route('/product')
    .post(authenticate,addProduct)
    .delete(authenticate,deleteProduct)
    .put(authenticate,updateProduct)
router.route('/products').get(authenticate,getProducts)

module.exports = router