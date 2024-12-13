
const { auth } = require("../firebase")
const { getUserdb } = require("../models/users/users")
module.exports = async(req,res,next)=>{
    const headToken = req.headers.authorization || req.headers.Authorization

    if(!headToken && !headToken?.startWith("Bearer")) return res.sendStatus(401)

    const token = headToken.split(" ")[1]

    if(!token) return res.sendStatus(401)
    
    try {
        const user = auth.currentUser
        const to = await auth.currentUser?.getIdToken()
        if (to !== token) return res.sendStatus(403)
        if (user) {
            const loggedUser = await getUserdb(user.uid)
            req.user = loggedUser
            req.token = to 
            next()
            return
        }
      req.token = ''
      req.user = {}
      next()
    } catch (error) {
        console.log("auth",error)
        return res.sendStatus(401)
    }
    
}