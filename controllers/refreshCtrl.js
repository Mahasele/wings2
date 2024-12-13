
const refreshTokenCtrl = async(req,res) =>{
    try {
      const token = req.token

      if(!token) return res.status(401).send('You are not authenticated')

      res.send(token)
  } catch (error) {
    return res.status(500).send(err)
  }  
}

module.exports = refreshTokenCtrl