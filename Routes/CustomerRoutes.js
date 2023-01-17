const express=require("express");
const router = express.Router();

const { createUser,getUserById,getUsers,updateUser,deleteUser } = require('../Controllers/CustomerController');



router.post('/',createUser);
router.get('/',getUsers);
router.get('/:id',getUserById);
router.patch('/',updateUser);
router.delete('/',deleteUser);

  
module.exports= router;