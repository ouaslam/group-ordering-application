import axios from "axios";
import { useEffect, useState} from "react";

export default function DefaultSupplierContent() {
    
    return (
      <div className="img">
        <h2>Bienvenue dans l’espace fournisseur</h2>
        
        <p>
       Ici, vous pouvez suivre vos commandes, consulter vos produits, 
        et voir les écarts entre les objectifs et les réalisations. Utilisez les options de la barre latérale 
        pour naviguer à travers les différentes fonctionnalités.
      </p>

      <p>Sélectionnez une option dans la barre latérale pour commencer.</p>
      </div>
    );
  }
   export  function Demands(){
     const[ demands,setdemands]=useState([])
     useEffect(()=>{
         async function fetchdata(){
         const response= await axios.get('http://localhost:5000/demands',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
       console.log('res',response.data)
       setdemands(response.data)
       
    }
    fetchdata();
    },[])
    console.log('dem',demands)
    
    const groupeddemands = demands.reduce((acc, application) => {
      const commandeId = application.orderline.commande_id;
      if (!acc[commandeId]) {
        acc[commandeId] = [];
      }
      acc[commandeId].push(application);
      return acc;
    }, {});
    console.log('groupedapp',groupeddemands)
    const handleclick=async(commandeId)=>{
      console.log('hi')
      try {
        const response = await axios.get(`http://localhost:5000/generate-pdf/${commandeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob' // Important pour traiter le téléchargement des fichiers
        });
  
        // Créer un lien de téléchargement temporaire
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `demandes.pdf`); // Nom du fichier téléchargé
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error('Erreur lors du téléchargement du fichier', error);
      }
    }
    return(
    <>
        <div className="demands">
        <div className="demand-header">
        <h2>les demandes disponibles</h2>
       
       </div>
        {Object.entries(groupeddemands).map(([commandeId, applicationsGroup]) => (
  <div key={commandeId} className="application-card">
    <div className='commande-header'>
      <h3>Commande: {commandeId}</h3>
      <h2><button onClick={()=>{handleclick(commandeId)}} style={{'fontSize':'18px'}}>télécharger pdf </button></h2>
    </div>

    <table>
      <thead>
        <tr>

          <th>Produit</th>
          <th>User</th>
          <th>Quantité</th>
          <th>Total commandé</th>
          
        </tr>
      </thead>
      <tbody>
        {applicationsGroup.map((application, index) => (
          <tr key={index}>
            <td>{application.orderline.produit.nom}</td>
            <td>{application.user.Username}</td>
            <td>{application.quantité}</td>
            <td>{application.orderline.quantité_totale}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}

    
  </div>


        
    </>
    )
   }
  