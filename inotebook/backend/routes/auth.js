const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var fetchuser = require('../middleware/fetchUser')
const JWT_SECRET = "PrathamDhiman"

// Route : 1 Create a User using : POST "/api/auth/". Doesnt require auth 
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter the valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    // If there are errors return bad request and the errors s
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    // Check whether the user with this email exists already 
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success,error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        //  Create a new user 
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id
            }
        }
        success=true
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({ success,authtoken })
    }
    // Catching errors and console logging it .
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server error occured!")
    }

})

// Route 2 Authenticate a User using : "/api/auth/login" No login required.
router.post('/login', [
    body('email', 'Enter the valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success=false;
    // If there are errors return bad request and the errors s
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success=false;
            return res.status(400).json({ error: "Please enter correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            success=false;
            return res.status(400).json(success,{ error: "Please enter correct credentials" })
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(payload, JWT_SECRET)
        success = true;
        res.json({ success,authtoken })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server error occured!")
    }

})
// Route 3 Get logging user details using "POST" "/api/auth/getuser : login required"
router.post('/getUser',fetchuser,async (req,res) => {
        

try{
    const userId=req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
}
catch(error){
    console.log(error.message)
    res.status(500).send("Internal server error!")
}
})
module.exports = router 