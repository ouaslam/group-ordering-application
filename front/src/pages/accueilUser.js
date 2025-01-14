import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";


export default function AccueilUser() {
  const [orders, setOrders] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [view, setView] = useState(''); // 'orders', 'applications', or ''

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders-with-details', {
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

    const fetchUserApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-demands', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        console.log(response.data)
        setUserApplications(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
   fetchUserApplications();
  }, [view]);

  return (
    <div className="accueil-user-container">
      <h1>Bienvenue sur votre application de commande groupée</h1>
      <div className="options-container">
        <div
          className={`option-card ${view === 'orders' ? 'active' : ''}`}
          onClick={() => setView(view === 'orders' ? '' : 'orders')}
        >
          <h2>Voir les commandes</h2>
          <p>Visualisez et postulez aux commandes disponibles.</p>
        </div>
        <div
          className={`option-card ${view === 'applications' ? 'active' : ''}`}
          onClick={() => setView(view === 'applications' ? '' : 'applications')}
        >
          <h2>Voir vos demandes</h2>
          <p>Consultez vos demandes en cours et le total des commandes.</p>
        </div>
      </div>
     
      {view === 'orders' && <OrderList orders={orders} />}
      {view === 'applications' && <UserApplications applications={userApplications} setapplication={setUserApplications}/>}
    </div>
  );
}

function OrderList({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = (orderline) => {
    setSelectedOrder(orderline);
    console.log(selectedOrder)
    setIsModalOpen(true);
  };

  const handleConfirm =async () => {
    console.log(`Commande confirmée : ${selectedOrder.commande_id} avec quantité : ${quantity}`);
    const orderline_id=selectedOrder.orderline_id;
       await axios.post('http://localhost:5000/adddemand',{orderline_id,quantity},{
        headers:
          {
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
          
       }).then(res=>{console.log(res.data.message)})
          setIsModalOpen(false);
          setQuantity(0)
  };
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }; 
  return (
    <div className="orders-list">
      <h2>Commandes disponibles</h2>
      {orders.map(order => (
        <div key={order.commande_id} className="order-card">
          <h3>Commande N°: {order.commande_id}</h3>
           <div className='order-details'>
            <div className='date-info'>
            <p>Date début: {formatDate(order.date_debut)}</p>
            <p>Date fin: {formatDate(order.date_fin)}</p>
            </div>
            <div className='supplier-info'>
            <p>fournisseur:{order.supplier.Username}</p>
             <p>Email:{order.supplier.Email}</p>
            
            </div>
           </div>
          
          
          
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Objectif</th>
                <th>Prix</th>
                <th>Total commandé</th>
                <th>Postuler</th>

              </tr>
            </thead>
            <tbody>
              {order.orderlines.map((line, index) => (
                <tr key={index}>
                  <td>{line.produit.nom}</td>
                  <td>{line.objectif}</td>
                  <td>{line.prix}</td>
                  <td>{line.quantité_totale}</td>
                  <td><button className="apply-button" onClick={() => handleApplyClick(line)}>Postuler</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Postuler pour la commande {selectedOrder.commande_id}</h3>
            <label>
              Quantité:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </label>
            <button onClick={handleConfirm}>Confirmer</button>
            <button onClick={() => setIsModalOpen(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

function UserApplications({ applications ,setapplication}) {
     const [selectedapplication,setselectedapplication]=useState()
     const[isopen,setisopen]=useState(false)
    
  const handleedit=(application)=>{
         setselectedapplication(application);
         console.log(application)
         setisopen(true)

  }
  const handlchange=(e)=>{
    const {name,value}=e.target
    setselectedapplication(prvs=>({...prvs,[name]:value}))
    
  }
  const handlesave=async()=>{
    await axios.put('http://localhost:5000/updatedemand',{selectedapplication})
    setisopen(false)
    setapplication(prevs=>
      prevs.map(app=>(app.demande_id===selectedapplication.demande_id?selectedapplication:app)))
   
     
  }
  const handledelit=async(id,orderline_id)=>{
    console.log(id,orderline_id)
    await axios.delete(`http://localhost:5000/deletedemand/${id}/${orderline_id}`)
    setapplication(prvs=>prvs.filter(app=>app.demande_id!==id))
  }
  const groupedApplications = applications.reduce((acc, application) => {
    const commandeId = application.orderline.commande_id;
    if (!acc[commandeId]) {
      acc[commandeId] = [];
    }
    acc[commandeId].push(application);
    return acc;
  }, {});
  console.log('groupedapp',groupedApplications)
  return (
    <div className="user-applications">
      <h2>Vos demandes</h2>
{Object.entries(groupedApplications).map(([commandeId, applicationsGroup]) => (
  <div key={commandeId} className="application-card">
    <div className='commande-header'>
      <h3>Commande: {commandeId}</h3>
    </div>

    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th>Objectif</th>
          <th>Prix</th>
          <th>Ma commande</th>
          <th>Total commandé</th>
          <th>Modifier</th>
          <th>Annuler ma demande</th>
        </tr>
      </thead>
      <tbody>
        {applicationsGroup.map((application, index) => (
          <tr key={index}>
            <td>{application.orderline.produit.nom}</td>
            <td>{application.orderline.objectif}</td>
            <td>{application.orderline.prix}</td>
            <td>{application.quantité}</td>
            <td>{application.orderline.quantité_totale}</td>
            <td>
            <CiEdit className='apply-icon' onClick={() => handleedit(applicationsGroup[0])}/>
            </td>
            <td>
            <RiDeleteBinLine className='apply-icon' onClick={() => handledelit(application.demande_id, application.orderline.orderline_id)}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}

      
      {isopen && (
        <div className="modal">
          <div className="modal-content">
            <h3>modifier ma demande </h3>
            <label>
              Quantité:
              <input type="number"  name='quantité' value={selectedapplication.quantité} onChange={handlchange}/>
            </label>
            <button onClick={handlesave} >Confirmer</button>
            <button onClick={() => setisopen(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
/*{applications.map((application, index) => (
        <div key={index} className="application-card">
          <div className='commande-header'> 
          <h3>Commande:{application.orderline.commande_id}</h3>
          <button className='apply-button'  onClick={()=>handleedit(application)}>modifier</button>
          <button className='apply-button' onClick={()=>handledelit(application.demande_id,application.orderline.orderline_id)}>Annuler ma demande</button>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Objectif</th>
                <th>Prix</th>
                <th>Ma commande</th>
                <th>Total commandé</th>
               
              </tr>
            </thead>
            <tbody>
              
                <tr>
                  <td>{application.orderline.produit.nom}</td>
                  <td>{application.orderline.objectif}</td>
                  <td>{application.orderline.prix}</td>
                  <td>{application.quantité}</td>
                  <td>{application.orderline.quantité_totale}</td>
                </tr>
              
            </tbody>
          </table>
        </div>
      ))} */