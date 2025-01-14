const {User}=require("../models/models")
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');

//ajouter un utilisateur
async function addUser(user,res){
    const { Username, email, Password} = user;
    const existingUser = await User.findOne({ where: { Username:Username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
  const existingEmail = await User.findOne({ where: { Email:email } });
  if (existingEmail) {
    return res.status(400).json({ message: 'Email is already registered' });
  }
  
  const hashedPassword= await bcrypt.hash(Password,10)
 const user2= await User.create({
    Username:Username,
    Email:email,
    Password:hashedPassword,
 
    
})
 res.status(201).json({ message: 'User created successfully'});
}
 async function loginUser(user,res){
     const{Username,Password}=user;
     try {
      const existingUser = await User.findOne({ where: { Username: Username } });
      if (!existingUser) {
        return res.status(400).json({ message: 'Invalid username' });
      }
  
      const isPasswordValid = await bcrypt.compare(Password, existingUser.Password);
      console.log('password',Password)
      console.log('pass ofexistinguser',existingUser.Password)
      console.log(isPasswordValid)
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ id: existingUser.user_id }, 'secret_key');
      console.log('token',token)
      return res.json({ message: 'Login successful', token });
     
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
      
}

module.exports={addUser, loginUser}