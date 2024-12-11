const jwt = require('jsonwebtoken');

const verifyToken = async (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){return res.status(403).json({message: "No token provided"})};

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

module.exports = verifyToken;