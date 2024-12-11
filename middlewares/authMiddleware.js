const jwt = require('jsonwebtoken');

const verifyToken = async (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){return res.status(403).json({message: "No token provided"})};

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.payload.id;
        req.userRole = decoded.payload.role;
        next();
    });
};

const isAdmin = async (req,res,next)=>{
    if (req.userRole !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
};

module.exports = {
    verifyToken,
    isAdmin
};