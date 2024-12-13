const express = require("express")
const { addProduct, getProducts, deleteProduct, updateProduct, sellProduct } = require("../controllers/products")
const authenticate = require('../middleware/authenticate_user')
const { getTransactions, deleteTransaction } = require("../controllers/transactions")
const router = express.Router()

router.route('/product')
    .post(authenticate,addProduct)
    .delete(authenticate,deleteProduct)
    .put(authenticate,updateProduct)
router.route('/products/:userId').get(authenticate,getProducts)
router.route('/selling').post(authenticate,sellProduct)
router.route('/transactions/:userId').get(authenticate,getTransactions)
router.route('/transaction').delete(authenticate,deleteTransaction)

module.exports = router