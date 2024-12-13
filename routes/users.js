const express = require("express")
const { createUser, signIn, signOut, getUser, getUsers, changePassword, deleteUser, updateUser } = require("../controllers/users")
const refreshTokenCtrl = require("../controllers/refreshCtrl")
const auth = require("../middleware/auth")
const authenticate_user = require("../middleware/authenticate_user")
const router = express.Router()

router.route('/register').post(createUser)
router.route('/logout').post(signOut)
router.route('/login').post(signIn)
router.route('/refresh').get(auth,refreshTokenCtrl)
router.route('/users/:userId').get(authenticate_user,getUsers)
router.route('/user')
    .get(authenticate_user,getUser)
    .delete(authenticate_user,deleteUser)
    .put(authenticate_user,updateUser)
router.route('/password').put(authenticate_user,changePassword)

module.exports = router