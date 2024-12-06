const { addUserdb, login } = require("../models/users/users")

const createUser = async (req,res) =>{
    
    const {email,name, password} = req.body

    if(!email || !password || !name) {
        return res.status(400).send("Please Fill All Required Fields!")
    }
    
    if(password.length<8) return res.status(400).send("Password must be atleast 8 characters")

    try {
        const status = await addUserdb({email,name, password})
        res.status(201).json(status)
    } catch (err) {
        res.json({error:err})
    }
    
}
const signIn = async (req,res) =>{
    
    const {email,password} = req.body

    if(!email || !password) {
        return res.status(400).send("Please Fill All Required Fields!")
    }
    try {
        const status = await login({email, password})
        res.cookie('token',status.user.stsTokenManager.refreshToken,{httpOnly:true,secure:true,sameSite:"None",maxAge:24*60*60*1000})
        
        res.status(201).json(status.user.stsTokenManager.accessToken)
    } catch (err) {
        if(err.message.slice(err.message.indexOf('(')+1,err.message.indexOf(')'))==="auth/invalid-credential") return res.status(401).send("Wrong password or username")
        res.json({ero:err.message})
    }
    
}

module.exports = {createUser,signIn}