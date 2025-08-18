const express = require('express') ;
const router = express.Router() ;
const userController = require('../controllers/user.controller') ;
const { userAuth } = require('../middleware/authMiddleware');


//user should register , login and logout 

router.post('/register', userController.register) ;
router.post('/login', userController.login) ;
router.get('/logout', userController.logout) ;
router.get('/profile', userAuth, userController.profile);
router.get('/accepted-ride', userAuth, userController.acceptedRide);


module.exports = router ;