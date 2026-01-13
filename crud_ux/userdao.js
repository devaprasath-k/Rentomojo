const { User } = require('./model');
const bcrypt = require('bcryptjs');

const registerUser = async (data)=>{
  const exists = await User.findOne({username: data.username});
  if(exists) return null;
  const allowed = ['user','vendors','admin'];
  data.role = allowed.includes(data.role) ? data.role : 'user';
  return await new User(data).save();
};

const logginIn = async ({username,password})=>{
  const user = await User.findOne({username});
  if(!user) return null;
  const ok = await bcrypt.compare(password,user.password);
  return ok?user:null;
};

module.exports={registerUser,logginIn};
