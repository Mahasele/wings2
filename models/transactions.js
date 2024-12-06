const { collection, addDoc, setDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } = require('firebase/firestore');
const {db} = require('../firebase')
const addTransactiondb = async (data) => {
  try {
    if(!data) return "Missing info"
    const ref = await addDoc(collection(db,'transactions'),data) 

    await setDoc(ref,{...data,transactionId:ref.id});

    return "Transaction added successfully"
  } catch (error) {
    console.log(error)
    return 'Failed to add a transaction'
  }
}

const getTransactionsdb = async (userId) => {
  try {
    if(!userId) return "Missing info"

    const ref = await getDocs(collection(db,'transaction')) 

    return ref.docs.map(doc=>doc.data()) || []
  } catch (error) {
    console.log(error)
    return 'Failed to retrieve transactions'
  }
}
const updateTransactiondb = async (transactionId,data) => {
  try {

    const ref = await updateDoc(doc(db,'transactions',transactionId),data) 

    return "Transaction updated successfully"
  } catch (error) {
    console.log(error)
    return 'Failed to update transaction'
  }
}
const deleteTransactiondb = async (transactionId) => {
  try {

    const ref = await deleteDoc(doc(db,'transactions',transactionId)) 

    return "Transaction deleted successfully"
  } catch (error) {
    console.log(error)
    return 'Failed to delete transaction'
  }
}
const getTransactiondb = async (transactionId) => {
  try {
    const ref = await getDoc(doc(db,'transactions',transactionId)) 
    return ref.data()
  } catch (error) {
    console.log(error)
    return 'Failed to retrieve a transaction'
  }
}

module.exports = {addTransactiondb,getTransactiondb,getTransactionsdb,updateTransactiondb,deleteTransactiondb}