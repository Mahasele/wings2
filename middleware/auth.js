const { auth } = require("../firebase")
const { getUserdb } = require("../models/users/users")

module.exports = async (req,res,next) =>{
    try {
    auth.onAuthStateChanged(async(user)=>{
        if (user) {
            const token = await user?.getIdToken()
            const loggedUser = await getUserdb(user.uid)
            req.user = loggedUser
            req.token = token  
            next()
            return
        }
      req.token = ''
      req.user = {}
      next()
      return
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  } 
}