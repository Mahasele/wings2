const {getProductsdb } = require("../models/products/products")
const {getTransactiondb,getTransactionsdb,deleteTransactiondb} = require("../models/transactions")

const getTransactions = async (req, res) =>{
  const {userId} = req.params
  if(!userId) return res.status(401).send('You are not authenticated')
  try{
    const transactions = await getTransactionsdb(userId)
    const products = await getProductsdb(userId)

    const transactionsToSend = transactions.map((transaction)=>{
        
        const product = products.find(pro=>pro.productId===transaction.productId)
        
        const newTransaction = {
            ...transaction,product
        }
        
        return newTransaction
    })

    res.json(transactionsToSend)
    return 
  } catch(err){
    return res.status(500).send(err.message)
  }
}
const deleteTransaction = async (req, res) =>{
  try{
    const {transactionId,userId} = req.query
    if(!transactionId || !userId) return res.status(400).send('Missing fields')
    const transactionToDelete = await getTransactiondb(transactionId)
    if(!transactionToDelete) return res.status((404)).send("product not found")
    if(transactionToDelete?.userId !== userId) return res.status((401)).send("You are not authorized to delete the product")
    const status = await deleteTransactiondb(transactionId)
    res.status(200).json(status)
    return
  } catch(err){
   return res.status(500).send(err.message)
  }
}
module.exports = {getTransactions,deleteTransaction}