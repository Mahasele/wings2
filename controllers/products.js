const {addProductdb, getProductsdb, editProductdb, grtProductdb, deleteProductdb} = require("../models/products/products")
const {addTransactiondb,getTransactiondb,getTransactionsdb,updateTransactiondb,deleteTransactiondb} = require("../models/transactions")

const addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      price, 
      quantity 
    } = req.body;

    if (!name || !category || !description || !price || !quantity) {
      return res.status(400).json({ 
        error: 'Missing fields' 
      });
    }
    if (price <=0 || quantity<=0 || isNaN(price) || isNaN(quantity)) {
      return res.status(400).json({ 
        error: 'Invalid data for quantity or price' 
      });
    }
    const products = await getProductsdb('00')

    const existingProduct = products.find(product=>product.name===name)
    
    if(existingProduct) {
      const transaction = {
        productId:existingProduct.productId,
        addedQuantity:quantity,
        subtractedQuantity:0,
        soldQuantity:0
      }
      const newQuantity = parseInt(existingProduct.quantity) + parseInt(quantity)
      const update = await editProductdb(existingProduct.productId,{quantity:newQuantity,price,category,description})
      await addTransactiondb(transaction)
      return res.status(201).send(update)
    }
    
    
    const product = {
      name,
      description,
      category,
      price: Number(price),
      quantity: parseInt(quantity),
      createdAt: Date.now()
    };

    const response = await addProductdb(product)
    const transaction = {
        productId:response.productId,
        addedQuantity:quantity,
        subtractedQuantity:0,
        soldQuantity:0
      }
    await addTransactiondb(transaction)
    res.status(201).json(response.status);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create product', 
      details: error.message 
    });
  }
}
const getProducts = async (req, res) =>{
  try{
    const products = await getProductsdb('oo')
    res.json(products)
  } catch(err){
    console.log(err)
  }
}
const deleteProduct = async (req, res) =>{
  try{
    const {productId} = req.query
    const productToDelete = await grtProductdb(productId)
    if(!productToDelete) return res.status((404)).send("product not found")
    const deleteStatus = await deleteProductdb(productId)
    res.json(deleteStatus)
  } catch(err){
    console.log(err)
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
      productId 
    } = req.body;
    if (!name || !category || !description || !price || !quantity) {
      return res.status(400).json({ 
        error: 'Missing fields' 
      });
    }
    if (price <=0 || quantity<=0 || isNaN(price) || isNaN(quantity)) {
      return res.status(400).json({ 
        error: 'Invalid data for quantity or price' 
      });
    }
    
    const productToUpdate = await grtProductdb(productId)
    if(!productToUpdate) return res.status((404)).send("product not found")
    const product = {
      name,
      description,
      category,
      price: Number(price),
      quantity: parseInt(quantity),
      updatedAt: Date.now().toString()
    };
    const updateStatus = await editProductdb(productId,product)
    res.json(updateStatus)
  } catch(err){
    console.log(err)
  }
}
module.exports = {addProduct,getProducts,deleteProduct,updateProduct}