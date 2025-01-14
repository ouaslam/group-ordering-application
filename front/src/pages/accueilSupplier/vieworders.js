
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
export default function Vieworders() {
  const [orders, setOrders] = useState([]);
  const [selectedorder,setselectedorder]=useState(null)
  const [products,setProducts]=useState([])
  const [message,setmessage]=useState('')
  const [indice,setindice]=useState()
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/supplier-orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setOrders(response.data);
      console.log(response.data)
     
      
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(()=>{
     async function fetchProducts(){
      await axios.get('http://localhost:5000/supplier/products',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`,
        }
        
      }).then(res=>{
        console.log(res.data)
        setProducts(res.data)
      })
     }
     fetchProducts()
  },[])
  const handledatechange=(e)=>{
    const name=e.target.name
    const value=e.target.value
    console.log(name,value)
    setselectedorder(values=>({...values,[name]:value}))
    console.log(selectedorder)
  }
  const handlechange=(e,index)=>{
     const name=e.target.name
     const value=e.target.value
    const updatedOrderLines = selectedorder.orderlines.map((line, i) => {
      if (i === index && name === 'produit') {
        const Product ={nom:value}
        return { ...line, produit: Product };
      } else if (i === index) {
        return { ...line, [name]: value };
      }
      return line;
    });
    setselectedorder((prevOrder) => ({
      ...prevOrder,
      orderlines:updatedOrderLines,
    }));
    console.log('hi',selectedorder)
  }
  const handlesubmit=async(e)=>{
    e.preventDefault()
    await axios.put(`http://localhost:5000/updateorder/${selectedorder.commande_id}`,{selectedorder},{
      headers:  {
        Authorization:`Bearer ${localStorage.getItem('token')}`,
      }
    })
    setOrders(prevs=>prevs.map(line=>(
         line.commande_id=selectedorder.commande_id? selectedorder:line
    )

    ))
    setselectedorder(null)
  }
  const handledelite=async(commandeId,orderlineId)=>{
    await axios.delete(`http://localhost:5000/deleteorder/${commandeId}/${orderlineId}`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      }
    }).then(res=>setmessage(res.data.message))

    
    fetchOrders()
    console.log(orders)
  }
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }; 
  return (
    <>
    <div className="orders-container">
      {orders.map(order => (
        <div key={order.commande_id}  className="order-card">
          <h2>Commande N° {order.commande_id}</h2>
          
         
          <p>Date début: {formatDate(order.date_debut)}</p>
          <p>Date fin: {formatDate(order.date_fin)}</p>
          <table className="order-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Objectif</th>
                <th>Prix</th>
                <th>Modifier</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {(order.orderlines).map((line, index) => (
                <tr key={index}>
                  <td>{line.produit.nom}</td>
                  <td>{line.objectif}</td>
                  <td>{line.prix}</td>
                  <td ><CiEdit className='editbutton' onClick={()=>{
                    setselectedorder(order) 
                     setindice(index)
                    }} 
                     />
                 </td>
                  <td><RiDeleteBinLine className='editbutton' onClick={()=>handledelite(order.commande_id,line.orderline_id)}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>

    {selectedorder && <div className='modal'>
        <div>
        <form className='modal-content'>
          <div >
            <label>date début</label>
            <input name='date_debut' type='date' value={selectedorder.date_debut} onChange={handledatechange}></input>
          </div>
          <div>
          <label>date fin</label>
          <input name='date_fin' type='date' value={selectedorder.date_fin} onChange={handledatechange}></input>
          </div>
           <>
        <div>
           
        {selectedorder.orderlines.map((line, index) => (
              index === indice && ( // Afficher uniquement si l'index correspond à celui sélectionné
                <div key={index}>
                  <div>
                    <label>Produit</label>
                    <select name="produit" value={line.produit.nom} onChange={(e) => handlechange(e, index)}>
                      {products.map((p) => (
                        <option key={p.nom}>{p.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Objectif</label>
                    <input name="objectif" type="number" value={line.objectif} onChange={(e) => handlechange(e, index)} />
                  </div>

                  <div>
                    <label>Prix</label>
                    <input name="prix" type="number" value={line.prix} onChange={(e) => handlechange(e, index)} />
                  </div>
                </div>
              )
            ))}

            </div>
            </>
          
          <button onClick={()=>setselectedorder('')}>annuler</button>
          <button onClick={handlesubmit}>Sauvegarder</button>
        </form>
     </div>
      </div>
}
    </>
  );
  
 
}
