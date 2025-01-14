import { useState } from 'react';
import axios from 'axios'
import '../App.css'
import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function EnregistrementPage() {
       
         const[user,setUser]=useState({
            Username:'',
            email:'',
            Password:'',
            confirmPassword:'',
            accountType:'user'

         })
         const [error,setError]=useState('');
         const [success,setSuccess]=useState('');
         const navigate = useNavigate();
       
       const handlechnage=(e)=>{
        console.log(e.target)
        const name=e.target.name;
        const value=e.target.value;
        setUser(values=>({...values,[name]:value}))
       }
       const handlesubmit=( event)=>{
        event.preventDefault();
          console.log(user)
          if (user.Password !== user.confirmPassword) {
            setError('Passwords do not match');
            return;
          }
          else{
          setError('');
          var endpoint;
          if(user.accountType==='user')
            endpoint='register/user'
          else 
            endpoint='register/supplier'
          console.log(endpoint)
          axios.post(`http://localhost:5000/${endpoint}`,{user})
          .then(res=>{
            console.log(res)
            if (res.data.message === 'User created successfully') {
              setError('');
              setSuccess('You have been registered successfully');
              setTimeout(()=> {navigate('/ConnexionPage')},2000)
            }
          })
          .catch(err => {
            if (err.response) {
              setError(err.response.data.message);
            } else {
              console.error(err);
            }
          })}
       }

    return (
      <>
      <div className='connexion-container'>
      <form onSubmit={handlesubmit}>
        <h1>Sign Up</h1>
      <div className='input-box'>
          <select name="accountType" onChange={handlechnage}  required>
            <option value="user">User</option>
            <option value="supplier">Supplier</option>
          </select>
      </div>
      <div className='input-box'>
        <input type="text" placeholder='Username' name='Username' onChange={handlechnage} required/>
        <FaUserAlt className='icon'/>
        </div>
        <div className='input-box'>
        <input type="email" placeholder='email' name='email' onChange={handlechnage} required/>
        <MdEmail className='icon' />
      </div>
      <div className='input-box'>
        <input type="password" placeholder='Password' name='Password' onChange={handlechnage} required/>
        
      </div>
      <div className='input-box'>
        <input type="password" placeholder=' confirm Password' name='confirmPassword' onChange={handlechnage} required/>
       
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{color:'green'}}>{success}</div>}
      <button type="submit">sign Up</button>
      
      
      
      </form>
      
      </div>
      </>
    );
  }