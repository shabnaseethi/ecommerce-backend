require("dotenv").config();
const express=require("express");
const router = express.Router();

const {userAuth} = require("../middlewares/UserAuth");

const{validateLogin} = require("../Validation/LoginValidation");
const {validationMiddleware} = require("../middlewares/ValidationMiddleware");
const {loginUser,dashboard,logout,getLogin} = require("../Controllers/Auth")


router.get('/dashboard',dashboard);
router.post('/login',loginUser);
router.get('/login',getLogin);
router.post('/logout',logout);



module.exports = router;
