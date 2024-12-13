const {addProductdb, getProductsdb, editProductdb, grtProductdb, deleteProductdb} = require("../models/products/products")
const {addTransactiondb} = require("../models/transactions")

const addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      price, 
      quantity,
      userId
    } = req.body;

    if (!name.trim() || !category.trim() || !description.trim() || !price || !quantity) {
      return res.status(400).send('Missing fields');
    }
    if (!userId) {
      return res.status(401).send('You are not authorized');
    }
    if (price <=0 || quantity<=0 || isNaN(price) || isNaN(quantity)) {
      return res.status(400).send('Invalid data for quantity or price' );
    }
    const products = await getProductsdb(userId)

    const existingProduct = products.find(product=>product.name===name)
    
    if(existingProduct) {
      const transaction = {
        userId,
        productId:existingProduct.productId,
        addedQuantity:Number(quantity),
        subtractedQuantity:0,
        soldQuantity:0,
        createdAt: Date.now()
      }
      const newQuantity = parseInt(existingProduct.quantity) + parseInt(quantity)
      const update = await editProductdb(existingProduct.productId,{quantity:newQuantity,price,category,description})
      await addTransactiondb(transaction)
      return res.status(201).send(update)
    }
    
    
    const product = {
      userId,
      name,
      description,
      category,
      price: Number(price),
      quantity: parseInt(quantity),
      createdAt: Date.now()
    };

    const response = await addProductdb(product)
    const transaction = {
        userId,
        productId:response.productId,
        addedQuantity:Number(quantity),
        subtractedQuantity:0,
        soldQuantity:0,
        createdAt: Date.now()
      }
    await addTransactiondb(transaction)
    return res.status(201).json(response.status);
  } catch (error) {
    return res.status(500).send(err.message)
  }
}
const getProducts = async (req, res) =>{
  const {userId} = req.params
  if(!userId.trim()) return res.status(401).send('You are not authenticated')
  try{
    const products = await getProductsdb(userId)
    res.json(products)
    return 
  } catch(err){
    return res.status(500).send(err.message)
  }
}
const deleteProduct = async (req, res) =>{
  try{
    const {productId,userId} = req.query
    if(!productId || !userId) return res.status(400).send('Missing fields')
    const productToDelete = await grtProductdb(productId)
    if(!productToDelete) return res.status((404)).send("product not found")
    if(productToDelete?.userId !== userId) return res.status((401)).send("You are not authorized to delete the product")
    const deleteStatus = await deleteProductdb(productId)
    res.json(deleteStatus)
    return
  } catch(err){
    return res.status(500).send(err.message)
  }
}
const updateProduct = async (req, res) =>{
  try{
    const { 
      name, 
      description, 
      category, 
      price, 
      quantity,
      productId,
      userId 
    } = req.body;
    if (!name.trim() || !category.trim() || !description.trim() || !price || !quantity || !productId.trim()) {
      return res.status(400).send('Missing fields' 
      );
    }
    if (!userId ) {
      return res.status(401).send('You are not authorized');
    }
    if (price <=0 || quantity<=0 || isNaN(price) || isNaN(quantity)) {
      return res.status(400).send('Invalid data for quantity or price');
    }
    
    const productToUpdate = await grtProductdb(productId)
    if(!productToUpdate) return res.status((404)).send("product not found")
    if(productToUpdate?.userId !== userId) return res.status((401)).send("You are not authorized to update the product")
    const product = {
      name,
      description,
      category,
      price: Number(price),
      quantity: parseInt(quantity),
      updatedAt: Date.now().toString()
    };
    
    if(Number(quantity) < Number(productToUpdate.quantity)) {
      const newQuantity = Number(productToUpdate.quantity) - Number(quantity)
      const transaction = {
        userId,
        productId:productToUpdate.productId,
        addedQuantity:0,
        subtractedQuantity:newQuantity,
        soldQuantity:0,
        createdAt: Date.now()
      }
    await addTransactiondb(transaction)
    }
    if(Number(quantity) > Number(productToUpdate.quantity)) {
      const newQuantity = Number(quantity) - Number(productToUpdate.quantity)
      const transaction = {
        userId,
        productId:productToUpdate.productId,
        addedQuantity:newQuantity,
        subtractedQuantity:0,
        soldQuantity:0,
        createdAt: Date.now()
      }
      await addTransactiondb(transaction)
    }
    const updateStatus = await editProductdb(productId,product)
    return res.status(200).json(updateStatus)
  } catch(err){
    return res.status(500).send(err.message)
  }
}
const sellProduct = async (req, res) =>{
  try{
    const {productId,userId, quantity} = req.body
    if(!productId.trim() || !userId.trim() || !quantity.trim()) return res.status(400).send('Missing fields')

    if(Number(quantity) <=0 || isNaN(quantity)) return res.status(400).send('Invalid Quantity')
    
    const productToSell = await grtProductdb(productId)

    if(!productToSell) return res.status((404)).send("product not found")
    if(productToSell?.userId !== userId) return res.status((401)).send("You are not authorized to delete the product")
    const newQuantity = Number(productToSell.quantity) - Number(quantity)
    if(newQuantity<0) return res.status(400).send('You cannot sell more than you have.')
    const updateStatus = await editProductdb(productId,{quantity:newQuantity})
    const transaction = {
        userId,
        productId:productToSell.productId,
        addedQuantity:0,
        subtractedQuantity:Number(quantity),
        soldQuantity:Number(quantity),
        createdAt: Date.now()
      }
    await addTransactiondb(transaction)
    return res.status(200).send(`${quantity} ${productToSell.name} sold successfully!!!`)
  } catch(err){
    return res.status(500).send(err.message)
  }
}
module.exports = {addProduct,getProducts,deleteProduct,updateProduct,sellProduct}