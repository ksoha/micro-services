const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const rideController = require('../controllers/ride.controller');

//only user can create a ride , so we need to authenticate the user 
router.post('/create-ride', authMiddleware.userAuth, rideController.createRide)
//only captain can accept a ride, so we need to authenticate the captain 
router.put('/accept-ride',authMiddleware.captainAuth, rideController.acceptRide)


module.exports = router;