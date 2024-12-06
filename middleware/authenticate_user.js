
const { auth } = require("../firebase")
module.exports = async(req,res,next)=>{
    const headToken = req.headers.authorization || req.headers.Authorization

    if(!headToken && !headToken?.startWith("Bearer")) return res.sendStatus(401)

    const token = headToken.split(" ")[1]

    if(!token) return res.sendStatus(401)
    
    try {
        const to = auth.currentUser?.stsTokenManager?.accessToken
        if (to !== token) return res.sendStatus(403)
        next()
    } catch (error) {
        console.log("auth",error)
        return res.sendStatus(401)
    }
    
}