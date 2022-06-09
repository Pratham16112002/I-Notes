var jwt = require('jsonwebtoken')
const JWT_SECRET = "PrathamDhiman"

const fetchuser = (req,res,next) =>{
        // Get the user from tokken and id to req object
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({error:"Please authenticate using a valid tokken"})
        }
        try {
            const data = jwt.verify(token,JWT_SECRET)
        req.user=data.user;
        next()
        } catch (error) {
            res.status(401).send({error:"Please authenticate using a valid tokken"})
        }
        
}

module.exports = fetchuser;