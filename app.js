const express = require("express")
const cors = require('cors')
const cookieParser = require("cookie-parser")
const productRouter = require('./routes/products')
const userRouter = require('./routes/users')
const port = process.env.PORT || 4000


const app = express()

app.use(cookieParser())
app.use(cors({origin: true, credentials: true}));
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/',(req, res)=>{
    console.log(req.query)
    res.send(`Hello, i am running on port ${port}...`)
})

app.use(productRouter)
app.use(userRouter)

app.all("*",(req,res)=>{
   // return res.sendStatus(404)
})


app.listen(port,console.log(`Running on port ${port}...`))