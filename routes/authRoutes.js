const {login,logout,register} = require('../controller/authController')

const express = require('express')
const routers = express.Router()

routers.route('/login').post(login)
routers.route('/logout').get(logout)
routers.route('/register').post(register)

module.exports = routers