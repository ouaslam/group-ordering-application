import { useState } from 'react';
import '../App.css'
import '../styles/ConnexionPage.css'
import { FaUserAlt} from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function ConnexionPage() {

      const [user,setUser]=useState({
        Username:'',
        Password:'',
        accountType:'user'
      })

      const[error,setError]=useState('')
      const navigate = useNavigate();

      const handlechange=(e)=>{
        const name=e.target.name;
        const value =e.target.value;
        setUser(values=>({...values,[name]:value}))
      }


      const handlesubmit=(e)=>{
          e.preventDefault();
          var endpoint;
          if(user.accountType==='user')
            endpoint='login/user'
          else 
            endpoint='login/supplier'
          console.log(endpoint)
          axios.post(`http://localhost:5000/${endpoint}`,{user})
         .then(res=>{
          if (res.data.message === 'Login successful') {
            setError('');
            console.log(res.data.token)
            localStorage.setItem('token', res.data.token);
            if(user.accountType==='user')
                  navigate('/AccueilUser')
            else 
                  navigate('/AccueilSupplier')
          }
         })
        .catch(err => {
          if (err.response) {
            setError(err.response.data.message);
          } else {
            console.error(err);
          }
        })
      }

    return (
      <>
      <div className='connexion-container'>
      <form onSubmit={handlesubmit}>
        <h1>Login</h1>
      <div className='input-box'>
          <select name="accountType" onChange={handlechange}  required>
            <option value="user">User</option>
            <option value="supplier">Supplier</option>
          </select>
      </div>
      <div className='input-box'>
      
        <input type="text" placeholder='Username' name='Username' onChange={handlechange} required/>
        <FaUserAlt className='icon'/>
        </div>
      <div className='input-box'>
        
        <input type="password" placeholder='Password' name='Password' onChange={handlechange} required/>
        
      </div>
      {error && <div style={{'color':'red'}}>{error}</div>}
      <button type="submit" >Login</button>
     
      
      
      </form>
      
      </div>
      </>
    );
  }