const express = require("express")
const { createUser, signIn } = require("../controllers/users")
const { loginOut } = require("../models/users/users")
const router = express.Router()

router.route('/register').post(createUser)
router.route('/logout').post(loginOut)
router.route('/login').post(signIn)

module.exports = router