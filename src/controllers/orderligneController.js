const {orderline}=require('../models/models')
const addOrderLines = async (req, res)=>{
    try {
      const {id_commande,commandeProduits} = req.body

    
      const lignes = commandeProduits.map(produit => ({
        commande_id: id_commande,
        produit_id: produit.produit_id,
        objectif: produit.objectif,
        prix: produit.prix

      }));
  
      const lignesCommande = await orderline.bulkCreate(lignes);
  
      res.status(201).json({
        message: 'Lignes de commande ajoutées avec succès',
        lignes: lignesCommande
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout des lignes de commande:', error);
      res.status(500).json({ message: 'Erreur lors de l\'ajout des lignes de commande' });
    }
  };
  
  module.exports = {
    addOrderLines,
  };