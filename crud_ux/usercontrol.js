const router = require('express').Router();
const { registerUser, logginIn } = require('./userdao');
const jwt = require('jsonwebtoken');
const { User } = require('./model');
const { tokenVerify, roleVerify } = require('./middleware');

// ---------------- SIGNUP ----------------
router.post('/signup', async (req,res)=>{
  let { role, adminSecret } = req.body;
  if(role==='admin'){
    if(adminSecret !== process.env.ADMIN_SECRET)
      return res.status(403).json({error:'Invalid admin secret'});
  }
  const user = await registerUser(req.body);
  if(!user) return res.status(400).json({error:'User exists'});
  const { password, ...safe } = user.toObject();
  res.json(safe);
});

// ---------------- LOGIN ----------------
router.post('/signin', async(req,res)=>{
  const user = await logginIn(req.body);
  if(!user) return res.status(401).json({error:'Invalid credentials'});
  const token = jwt.sign({_id:user._id,role:user.role,username:user.username},process.env.SECRET_KEY,{expiresIn:'1h'});
  res.json({token,role:user.role,username:user.username});
});

// ---------------- LIST USERS (ADMIN ONLY) ----------------
router.get('/users', tokenVerify, roleVerify(['admin']), async(req,res)=>{
  const users = await User.find().select('-password');
  res.json(users);
});

// ---------------- DEACTIVATE/REACTIVATE ----------------
router.patch('/deactivate/:id', tokenVerify, roleVerify(['admin']), async(req,res)=>{
  const u = await User.findByIdAndUpdate(req.params.id,{isActive:false},{new:true}).select('-password');
  if(!u) return res.status(404).json({error:'User not found'});
  res.json({message:'User deactivated',user:u});
});

router.patch('/reactivate/:id', tokenVerify, roleVerify(['admin']), async(req,res)=>{
  const u = await User.findByIdAndUpdate(req.params.id,{isActive:true},{new:true}).select('-password');
  if(!u) return res.status(404).json({error:'User not found'});
  res.json({message:'User reactivated',user:u});
});

module.exports = router;
