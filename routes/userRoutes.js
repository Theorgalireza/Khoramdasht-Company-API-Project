const {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword} = require('../controller/userController')

const express = require('express')
const { auth, authorizePermission } = require('../middleware/authentication')
const routers = express.Router()

routers.route('/').get(authorizePermission('admin','owner'),getAllUsers)
routers.route('/showMe').get(showCurrentUser)
routers.route('/updateUser').patch(updateUser)
routers.route('/updateUserPassword').patch(updateUserPassword)

routers.route('/:id').get(getSingleUser)//this because have a parameter should be in the above of all of this urls
module.exports = routers