const captainModel = require('../models/captain.models') ;
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const { subscribeToQueue } = require('../service/rabbit');

const pendingRequests = [];


module.exports.register = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // Check if captain already exists
        const captain = await captainModel.findOne({ email });
        if (captain) {
            return res.status(400).json({ message: 'captain already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new captain
        const newcaptain = await captainModel.create({
            name,
            email,
            password: hashedPassword
        });

        await newcaptain.save();
        const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //set the token in the cookie 

        res.cookie('token' , token) ;
        res.send({token ,newcaptain}) ;
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const captain = await captainModel
            .findOne({ email })
            .select('+password');

        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete captain._doc.password;

        res.cookie('token', token);

        res.send({ token, captain });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }

}

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        await blacklisttokenModel.create({ token });
        res.clearCookie('token');
        res.send({ message: 'captain logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.profile = async (req, res) => {
    try {
        res.send(req.captain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports.toggleAvailability = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id);
        captain.isAvailable = !captain.isAvailable;
        await captain.save();
        res.send(captain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.waitForNewRide = async (req, res) => {
    // Set timeout for long polling (e.g., 30 seconds)
    req.setTimeout(30000, () => {
        res.status(204).end(); // No Content
    });

    // Add the response object to the pendingRequests array
    pendingRequests.push(res);
};

subscribeToQueue("new-ride", (data) => {
    const rideData = JSON.parse(data);

    // Send the new ride data to all pending requests
    pendingRequests.forEach(res => {
        res.json(rideData);
    });

    // Clear the pending requests
    pendingRequests.length = 0;
}); 