const jwt = require('jsonwebtoken');
const { User } = require('./model');

const tokenVerify = async (req,res,next)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({error:'Token missing'});

  try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded._id);
    if(!req.user || !req.user.isActive) return res.status(403).json({error:'Blocked'});
    next();
  } catch(err){
    return res.status(403).json({error:'Invalid token'});
  }
};

const roleVerify = (roles)=>(req,res,next)=>{
  if(!roles.includes(req.user.role)) return res.status(401).json({error:'Unauthorized'});
  next();
};

module.exports={tokenVerify,roleVerify};
