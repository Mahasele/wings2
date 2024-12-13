const express = require("express")
const cors = require('cors')
const cookieParser = require("cookie-parser")
const productRouter = require('../routes/products')
const userRouter = require('../routes/users')
const Serverless = require("serverless-http")
const port = process.env.PORT || 4000


const app = express()

app.use(cookieParser())
app.use(cors({origin: true, credentials: true}));
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(productRouter)
app.use(userRouter)


app.get('/.netlify/functions/app/',(req, res)=>{
    res.send(`Hello, i am running on port ${port}...`)
})

app.use("/.netlify/functions/app", productRouter);
app.use("/.netlify/functions/app", userRouter);
app.all("*",(req,res)=>{
    res.sendStatus(404)
})

app.listen(port,console.log(`Running on port ${port}...`))
module.exports.handler = Serverless(app);