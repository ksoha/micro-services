const express = require('express') ;
const router = express.Router() ;
const captainController = require('../controllers/captain.controller') ;
const { captainAuth } = require('../middleware/authMiddleware');


//captain should register , login and logout 

router.post('/register', captainController.register) ;
router.post('/login', captainController.login) ;
router.get('/logout', captainController.logout) ;
router.get('/profile', captainAuth, captainController.profile);
router.patch('/toggle-availability', captainAuth, captainController.toggleAvailability) ;
router.get('/new-ride', captainAuth, captainController.waitForNewRide);


module.exports = router ;