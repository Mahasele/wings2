const { collection, addDoc, setDoc, getDocs, updateDoc, doc, deleteDoc, getDoc, where, query } = require('firebase/firestore');
const {db} = require('../../firebase')
const addProductdb = async (data) => {
  try {
    if(!data) return "Missing info"
    const ref = await addDoc(collection(db,'products'),data) 

    await setDoc(ref,{...data,productId:ref.id});

    return {status:"Product added successfully",productId:ref.id}
  } catch (error) {
    console.log(error)
    return 'Failed to add a product'
  }
}

const getProductsdb = async (userId) => {
  try {
    if(!userId) return "Missing info"

    const ref = await getDocs(query(collection(db,'products'),where('userId','==',userId))) 

    return ref.docs.map(doc=>doc.data()) || []
  } catch (error) {
    console.log(error)
    return 'Failed to retrieve products'
  }
}
const editProductdb = async (productId,data) => {
  try {

    const ref = await updateDoc(doc(db,'products',productId),data) 

    return "Product updated successfully"
  } catch (error) {
    console.log(error)
    return 'Failed to update product'
  }
}
const deleteProductdb = async (productId) => {
  try {

    const ref = await deleteDoc(doc(db,'products',productId)) 

    return "Product deleted successfully"
  } catch (error) {
    console.log(error)
    return 'Failed to delete product'
  }
}
const grtProductdb = async (productId) => {
  try {
    const ref = await getDoc(doc(db,'products',productId)) 
    return ref.data()
  } catch (error) {
    console.log(error)
    return 'Failed to retrieve a product'
  }
}

module.exports = {addProductdb,getProductsdb,editProductdb,deleteProductdb,grtProductdb}