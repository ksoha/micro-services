const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');

const userAuth = async (req , res , next) =>{
    // try to get the token, only logged in users can access this route 
    // token can be in cookies or in headers (Authorization bearer token)
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        // verify the token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // find the user by id 
        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        // attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = { userAuth };