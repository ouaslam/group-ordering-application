
const {Supplier}=require("../models/models")
const {User}=require('../models/models')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
//ajouter un utilisateur
async function addSupplier(supplier,res){
    const { Username, email, Password} = supplier;
    const existingUser = await Supplier.findOne({ where: { Username:Username } });
    if (existingUser) {
      return res.status(400).json({ message: 'username is already taken' });
    }
  const existingEmail = await Supplier.findOne({ where: { Email:email } });
  if (existingEmail) {
    return res.status(400).json({ message: 'Email is already registered' });
  }
  
  const hashedPassword= await bcrypt.hash(Password,10);
  console.log(Password)
  console.log(hashedPassword)
 const user2= await Supplier.create({
    Username:Username,
    Email:email,
    Password:hashedPassword
 
    
})
 res.status(201).json({ message: 'User created successfully'});
}
 async function loginSupplier(supplier,res){
     const{Username,Password}=supplier;
     try {
      const existingSupplier = await Supplier.findOne({ where: { Username: Username } });
      if (!existingSupplier) {
        return res.status(400).json({ message: 'Invalid username' });
      }
  
      const isPasswordValid = await bcrypt.compare(Password, existingSupplier.Password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }else{
        console.log('log success')
        const token = jwt.sign({ id: existingSupplier.supplier_id }, 'secret_key');
    
      return res.json({ message: 'Login successful', token });
  }
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
      
}

module.exports={addSupplier,loginSupplier}