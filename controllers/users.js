const { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider} = require("firebase/auth")
const { auth } = require("../firebase")
const { getProductsdb, deleteProductdb } = require("../models/products/products")
const { getTransactionsdb, deleteTransactiondb } = require("../models/transactions")
const { addUserdb, login, loginOut, getUsersdb, deleteUserdb, editUserdb } = require("../models/users/users")
const errors = require("../utils/errors")

const createUser = async (req,res) =>{
    
    const {email,name, password} = req.body

    if(!email.trim() || !password.trim() || !name.trim()) {
        return res.status(400).send("Please Fill All Required Fields!")
    }
    
    if(password.length<8) return res.status(400).send("Password must be atleast 8 characters")

    try {
        const status = await addUserdb({email,name, password})
        res.status(201).json(status)
    } catch (err) {
        if(err.message.slice(err.message?.indexOf('(')+1,err.message?.indexOf(')'))==="auth/email-already-in-use") return res.status(409).send("Email already exists")
        return res.status(500).send(err.message)
    }
    
}
const signIn = async (req,res) =>{
    
    const {email,password} = req.body

    if(!email.trim() || !password.trim()) {
        return res.status(400).send("Please Fill All Required Fields!")
    }
    try {
        // status.user.stsTokenManager.accessToken
        const status = await login({email, password})
        // res.cookie('token',status.user.stsTokenManager.refreshToken,{httpOnly:true,secure:true,sameSite:"None",maxAge:24*60*60*1000})
        const token = await status.user?.getIdToken()
        return res.status(201).json(token)
    } catch (err) {
        errors(res,err)
    }
    
}
const signOut = async (req,res) =>{
    try {
        
        await loginOut()
        return res.send('Logged out Successfully!!!')
    } catch (error) {
        errors(res,err)
    }
    
}
const getUser = async (req,res) =>{
    try {
        const user = req.user
        if(!user) return res.status(401).send('You are not authenticated')
        res.status(200).json(user)
    } catch (error) {
       errors(res,err)
    }
    
}
const getUsers = async (req,res) =>{
    try {
        const {userId} = req.params
        const user = req.user
        if(!user || !userId || user?.userId !==userId) return res.status(401).send('You are not authenticated')
        const users = await getUsersdb(user?.userId)
        return res.status(200).json(users)
    } catch (error) {
        errors(res,err)
    }
    
}
const updateUser = async (req,res) =>{
    try {
        const {userId,email,name,password} = req.body
        const user = req.user
        if(!email.trim() || !name.trim() || !password.trim()) {
            return res.status(400).send("Please Fill All Required Fields!")
        }
        if(!user || !userId || user?.userId !==userId) return res.status(401).send('You are not authenticated')
        if(email !== auth?.currentUser?.email) {
            const credential = EmailAuthProvider.credential(
                user.email,
                password
            );
            await reauthenticateWithCredential(auth?.currentUser,credential)
            await updateEmail(auth?.currentUser,email)
        }
        const status = await editUserdb(userId,{email,name})
        return res.status(200).send(status)
    } catch (err) {
        errors(res,err)
    }
    
}
const changePassword = async (req,res) =>{
    try {
        const {userId,password,newPassword} = req.body
        const user = req.user
        if(!password.trim() || !newPassword.trim()) {
            return res.status(400).send("Please Fill All Required Fields!")
        }
        if(newPassword.length<8) return res.status(400).send("Password must be atleast 8 characters")
        if(!user || !userId || user?.userId !==userId) return res.status(401).send('You are not authenticated')
        const credential = EmailAuthProvider.credential(
            user.email,
            password
        );
        await reauthenticateWithCredential(auth?.currentUser,credential)
        await updatePassword(auth?.currentUser,newPassword)
        
        return res.status(200).send('Password updated successfully')
    } catch (err) {
        errors(res,err)
    }
    
}
const deleteUser = async (req,res) =>{
    try {
        const {userId,password} = req.query
        const user = req.user
        if(!user || !userId.trim() || user?.userId !==userId || !password.trim()) return res.status(401).send('You are not authenticated')
        const credential = EmailAuthProvider.credential(
            user.email,
            password
        );
        await reauthenticateWithCredential(auth?.currentUser,credential)
        const transactions = await getTransactionsdb(userId)
        const products = await getProductsdb(userId)
        transactions.forEach(async(trans) => {
            await deleteTransactiondb(trans.transactionId)
        });
        products.forEach(async(product) => {
            await deleteProductdb(product.productId)
        });
        await deleteUserdb(userId)
        await auth.currentUser.delete()
        req.user = {}
        return res.status(200).send('Your account has been deleted successfully.')
    } catch (err) {
        errors(res,err)
    }
    
}

module.exports = {createUser,signIn,signOut,getUser,getUsers,updateUser,deleteUser,changePassword}