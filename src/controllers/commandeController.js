const { where } = require('sequelize');
const {Commande,orderline, Produit,Supplier}=require('../models/models');

const addorder=async (req,res,commande)=>{
  try{
  const {date_debut,date_fin}=commande;
 const neworder= await Commande.create({
    fournisseur_id:req.supplierId,
    date_fin:date_fin,
    date_debut:date_debut
  })
  res.status(201).json({ message: 'Commande créée avec succès', id_commande: neworder.commande_id});
} catch (error) {
  console.error('Erreur lors de la création de la commande:', error);
  res.status(500).json({ message: 'Erreur lors de la création de la commande' });
}
};
const getallorders=async (req, res) => {
    const orders = await Commande.findAll({
      include: [

        {model: orderline,
        as: 'orderlines', // alias pour les lignes de commande
        include:[
          {
            model:Produit,
            as: 'produit',
            attributes: ['nom']
          }
        ]},
        {
          model:Supplier,
          as:'supplier'
    
         }
        
        ]
    
    });
    console.log(orders.orderlines)
    res.json(orders);
  
};
const updateorder=async (req,res)=>{
   const id=req.params
   const selectedorder=req.body.selectedorder
   
  await Commande.update({
     date_debut:selectedorder.date_debut,
     date_fin:selectedorder.date_fin
    
   },
   { where:{
      commande_id:selectedorder.commande_id
   }}
  )
  for (let line of selectedorder.orderlines){
    await orderline.update({
       produit_id:line.produit_id,
       objectif:line.objectif,
       prix:line.prix
    },{where:{
      orderline_id:line.orderline_id
    }})
  }
   
  res.json({message:'order updated'})
}
const deleteorder=async(req,res)=>{
  const  commandeId=req.params.commandeid
  const orderlineId=req.params.orderlineid
  console.log(commandeId)
  console.log(orderlineId)
  const orderlinesCount = await orderline.count({
    where: {
      commande_id: commandeId,
    },
  });
  if (orderlinesCount === 1) {
    await orderline.destroy({
      where: {
        orderline_id: orderlineId, 
      },
    });
    await Commande.destroy({
      where: {
        commande_id: commandeId, // supprimer la commande
      },
    });
    res.json({ message: 'Commande et dernière ligne supprimées avec succès' });
  } else {
    // S'il y a plusieurs lignes, ne supprimer que la ligne spécifiée
    await orderline.destroy({
      where: {
        orderline_id: orderlineId, // supprimer la ligne spécifique
      },
    });
    res.json({ message: 'Ligne supprimée avec succès' });
  }
}
const getmyorders=async (req,res) => {
  const orders = await Commande.findAll({
    where:{
      fournisseur_id:req.supplierId
    },
    include: [

      {model: orderline,
      as: 'orderlines', // alias pour les lignes de commande
      include:[
        {
          model:Produit,
          as: 'produit',
          attributes: ['nom']
        }
      ]},
      {
        model:Supplier,
        as:'supplier'
  
       }
      
      ]
  
  });
  console.log(orders.orderlines)
  res.json(orders);

};


module.exports={addorder, getallorders,updateorder,deleteorder,getmyorders}

