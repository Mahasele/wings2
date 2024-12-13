module.exports = (res,err)=>{
    if(err.message.slice(err.message?.indexOf('(')+1,err.message?.indexOf(')'))==="auth/invalid-credential") return res.status(401).send("Wrong password or username")

    if(err.message.slice(err.message?.indexOf('(')+1,err.message?.indexOf(')'))==="auth/network-request-failed") return res.status(401).send("Sorry, our server is down at the moment, please try later.")

    if(err.message.slice(err.message?.indexOf('(')+1,err.message?.indexOf(')'))==="auth/user-not-found") return res.status(401).send("Wrong password or username.")

    if(err.message.slice(err.message?.indexOf('(')+1,err.message?.indexOf(')'))==="auth/wrong-password") return res.status(401).send("Wrong password or username.")

    if(err.message.slice(err.message?.indexOf('(')+1,err.message?.indexOf(')'))==="auth/requires-recent-login") return res.status(401).send("Please log in again to change your email.")

    if(err.message.slice(err.message?.indexOf('(')+1,err.message?.indexOf(')'))==="auth/operation-not-allowed") return res.status(401).send("Email verification is required before changing email.")

    return res.status(500).send(err.message)
}