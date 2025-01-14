import React, { useState } from 'react';
import axios from 'axios';

export default function AddProduct(){
     // ajouter un produit
     const [produit,setProduit]=useState({
        nom:'',
        prix:''
    })
    const [message2,setMessage2]=useState('');
                                                                           
    const handlechange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setProduit(values=>({...values,[name]:value}))
    }
    const handelesubmit=(e)=>{
              e.preventDefault()
         axios.post('http://localhost:5000/addproduct',{produit}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}` // Ajouter le token JWT
            }
            
          }).then(res=>{setMessage2(res.data.message)});
    }
   
    return(
        <>
        <div className='enregistrement-container'>
        
        <form onSubmit={handelesubmit}>
        <h1>ajouter un produit</h1>
        <div className='input-box'>
        <label>nom produit</label>
        <input type="text" name='nom' onChange={handlechange} required/>
        </div>
        <div className='input-box'> 
        <label>prix unitaire</label>
        <input type="number" min={0} name='prix' onChange={handlechange} required/>
        </div>
        {message2 && <div>{message2}</div>}
        <button type='submit' >ajouter produit</button>
        </form>
        </div>
        </>
    )
}