import { useEffect,useState } from 'react'
import axios from 'axios'
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
export default function Viewproducts(){
  const [products,setProducts]=useState([])
  const [selectedProduct, setSelectedProduct] = useState(null);
  const[message,setMessage]=useState('')
  const[message2,setMessage2]=useState('')
  

 useEffect(()=>{
          const fetchProducts= async()=>{
            const response=await axios.get('http://localhost:5000/supplier/products',{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProducts(response.data);
            
          }
          fetchProducts();

  },[])
  const handleEditClick=(produit)=>{
    setSelectedProduct(produit)
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/products/${selectedProduct.produit_id}`, {selectedProduct}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res=>{setMessage(res.data.message)});
      setProducts(prevProducts => prevProducts.map(product => 
        product.produit_id === selectedProduct.produit_id ? selectedProduct : product
      ));
      setSelectedProduct(null); // Réinitialisez le produit sélectionné
      setInterval(()=>{setMessage('')}, 2000)
    } catch (err) {
      console.error(err);
    }
   
    
  };
  const handledelit=async(id)=>{
    try{
      console.log("hi")
      await axios.delete(`http://localhost:5000/deleteproduct/${id}`,{
        headers:{
         Authorization: `Bearer ${localStorage.getItem('token')}`,
       }
       
      }).then(res=>{
        setMessage2(res.data.message)
       console.log(message2)
        if(res.data.message==="Produit supprimé avec succès"){
          setProducts((prevProducts) =>
            prevProducts.filter((produit) => produit.produit_id !== id)
          );
        }

      })
      
    }catch(err){
      console.error(err)
    }
     
  }
    return(
        <>
        <div className="orders-container">
            {
            products.map((produit)=>(
             
              <div className='order-card'>
                 <h2>produit N°:{produit.produit_id}</h2>
              
              <table className="order-table">
              <thead>
                <tr>
               
               <th>Produit</th>
               <th>Prix</th>
               <th>Modifier</th>
               <th>Supprimer</th>
                
               </tr>
               </thead>
               <tbody>
                <tr key={produit.produit_id}>
                     
                    <td>{produit.nom}</td>
                    <td>{produit.prix_unitaire}</td>
                    <td>< CiEdit className='editbutton'  onClick={() => handleEditClick(produit)}/></td>
                    <td><RiDeleteBinLine className='editbutton' onClick={()=>handledelit(produit.produit_id)}/></td>
                </tr>
                </tbody>
                </table>
                </div>
            ))
            }           
      
        {message2 && <div>{message2}</div>}
        {selectedProduct && (
        <div className='modal'>
          <div className='modal-content'>
          <h2>Modifier le produit</h2>
          <form className="edit-product-form" onSubmit={e => e.preventDefault()}>
            <div>
              <label>Nom: </label>
              <input type="text" name="nom" value={selectedProduct.nom} onChange={handleInputChange}/>
            </div>
             <div>
              <label>Prix: </label>
              <input type="number" name="prix_unitaire" value={selectedProduct.prix_unitaire} onChange={handleInputChange}/>
            </div>
            <button onClick={handleSaveChanges}>Sauvegarder</button>
            <button onClick={() => setSelectedProduct(null)}>Annuler</button>
            
          </form>
          </div>
        </div>
         
      )}
      {message && <div>{message}</div>}
      </div>
        </>
    )
}