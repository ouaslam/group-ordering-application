
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddOrder(){
  const [dates, setDates] = useState({ date_debut: '', date_fin: '' });
  const [commandeProduits, setCommandeProduits] = useState([{ produit_id: '', objectif: '', prix: '' }]);
  const [produits, setProduits] = useState([]);
  const [message, setMessage] = useState('');
     
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/supplier/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProduits(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDates((prevDates) => ({ ...prevDates, [name]: value }));
  };

  const handleProduitChange = (index, e) => {
    const { name, value } = e.target;
    const newCommandeProduits = [...commandeProduits];
    newCommandeProduits[index][name] = value;
    setCommandeProduits(newCommandeProduits);
    
  };

  const addProduit = () => {
    setCommandeProduits([...commandeProduits, { produit_id: '', objectif: '', prix: '' }]);
    
  };

  const removeProduit = (index) => {
    const newCommandeProduits = [...commandeProduits];
    newCommandeProduits.splice(index, 1);
    setCommandeProduits(newCommandeProduits);
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    
          console.log('dates',dates)
          console.log('commandeproduits',commandeProduits)
    try {
      // Créer la commande
      const orderResponse = await axios.post('http://localhost:5000/addorder',{dates}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const id_commande = orderResponse.data.id_commande;
       console.log('id de la commande ',id_commande);
      // Ajouter les lignes de commande
      await axios.post(`http://localhost:5000/addorderlines`,{id_commande,commandeProduits },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Commande et lignes de commande ajoutées avec succès.');
    } catch (error) {
      console.error(error);
      setMessage('Erreur lors de la création de la commande et des lignes de commande.');
    }
  };
    // ajouter un produit
   
 
  return (
    <>
      <div className='custom-commande-container'>
      <form onSubmit={handleSubmit}>
      <h1>Ajouter une commande</h1>
        <div className='input-box'>
          <label>Date début</label>
          <input type="date" name="date_debut" onChange={handleDateChange}  required/>
        </div>
        <div className='input-box'>
          <label>Date fin</label>
          <input type="date" name="date_fin" onChange={handleDateChange} required />
        </div>
        {commandeProduits.map((commande, index) => (
          <div key={index}>
            <div className='input-box'>
              <label>Choisir un produit</label>
              <select name="produit_id" value={commande.produit_id} onChange={(e) => handleProduitChange(index, e)} required>
                <option value="">Sélectionner un produit</option>
                {produits.map((produit) => (
                  <option key={produit.produit_id} value={produit.produit_id} >
                    {produit.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className='input-box'>
              <label>Objectif</label>
              <input
                type="number"
                name="objectif"
                min={1}
                value={commande.objectif}
                onChange={(e) => handleProduitChange(index, e)}
                required
              />
            </div>
            <div className='input-box'>
              <label>Prix</label>
              <input
                type="number"
                name="prix"
                step="0.01"
                min={0}
                value={commande.prix}
                onChange={(e) => handleProduitChange(index, e)}
                required
              />
            </div>
            <div  className='commande-button-group'>
            <button type="button" onClick={() => removeProduit(index)} className='btn-space'>
              Supprimer ce produit
            </button>
            <button type="button" onClick={addProduit}>
          Ajouter un autre produit
        </button>
            </div>
            
          </div>
        ))}
    
        <button type="submit" className='commande-submit-button'>Ajouter l'offre</button>
        {message && <div>{message}</div>}
      </form>
      </div>
    </>
  );
}
