const { collection, addDoc, setDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } = require('firebase/firestore');
const {db,auth }= require('../../firebase');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, browserSessionPersistence, setPersistence, browserLocalPersistence, signOut } = require('firebase/auth');
const addUserdb = async (data) => {
  try {
    if(!data) return "Missing info"
    const {password,email} = data
    const userCredential = await createUserWithEmailAndPassword(auth,email,password)
    const userId = userCredential?.user?.uid
    if(!userId) return "Unexpected error occurred"
    const ref = await setDoc(doc(db,'users',userId),{userId,name:data.name,email}) 
    return {status:"user added successfully"}
  } catch (error) {
    console.log(error)
    return 'Failed to add a user'
  }
}
const login = async (data) => {
  try {
    if(!data) return "Missing info"
    const {password,email} = data
    await setPersistence(auth, browserLocalPersistence)
    const userCredential = await signInWithEmailAndPassword(auth,email,password)
    const user = userCredential?.user
    console.log(user)
    return userCredential
  } catch (error) {
    console.log(error.message)
    throw new Error(error)
  }
}
const loginOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.log(error.message)
    throw new Error(error)
  }
}

const getUsersdb = async (userId) => {
  try {
    if(!userId) return "Missing info"

    const ref = await getDocs(collection(db,'users')) 

    return ref.docs.map(doc=>doc.data()) || []
  } catch (error) {
    console.log(error)
    return 'Failed to retrieve users'
  }
}
const editUserdb = async (userId,data) => {
  try {

    const ref = await updateDoc(doc(db,'users',userId),data) 

    return "user updated successfully"
  } catch (error) {
    console.log(error)
    return 'Failed to update user'
  }
}
const deleteUserdb = async (userId) => {
  try {

    const ref = await deleteDoc(doc(db,'users',userId)) 

    return "user deleted successfully"
  } catch (error) {
    console.log(error)
    return 'Failed to delete user'
  }
}
const getUserdb = async (userId) => {
  try {
    const ref = await getDoc(doc(db,'users',userId)) 
    return ref.data()
  } catch (error) {
    console.log(error)
    return 'Failed to retrieve a user'
  }
}

module.exports = {addUserdb,getUsersdb,editUserdb,deleteUserdb,getUserdb,login,loginOut}