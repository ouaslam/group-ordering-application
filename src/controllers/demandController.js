const { Model } = require('sequelize');
const {demande, orderline, Produit, Commande, User}=require('../models/models')
const adddemand=async(req,res)=>{
    console.log('add')
    const id=req.supplierId;
    const newDemande =await demande.create({
        user_id:id,
        orderline_id:req.body.orderline_id,
        quantité:req.body.quantity
    })
     res.json({message:'added successfuly'})

}
const getdemands=async(req,res)=>{
    const demands=await demande.findAll({
        where:{
            user_id:req.supplierId
        },
       attributes:['quantité','demande_id'],
       include:{
        model:orderline,
        attributes:['orderline_id','commande_id','objectif','prix','quantité_totale'],
        include:{
            model:Produit,
            attributes:['nom'],
            as:'produit'
        }
        
       }
    })
   // console.log(demands)
    res.json(demands)
}
const getsupplierdemands= async(req,res)=>{
    
    
       const demands = await demande.findAll({
        attributes: ['quantité', 'demande_id','user_id'],
        include: [
          {
            model: orderline,
            attributes: ['orderline_id', 'commande_id', 'quantité_totale'],
            include: [
              {
                model: Produit,
                attributes: ['nom'],
                as: 'produit',
              },
              {
                model: Commande,
                attributes: ['fournisseur_id'],
                as: 'commande',
                where: {
                  fournisseur_id: req.supplierId, 
                },
              },
            ],
          },{
           
            model:User,
            attributes:['Username']
            
          }
        ],
        where: {
          '$orderline.commande.fournisseur_id$': req.supplierId, 
        },
        
      });
  
   // console.log(demands)
    res.json(demands)
}
const updatedemand=async(req,res)=>{
    const app=req.body.selectedapplication
    await demande.update({
        quantité:app.quantité
    },
    {where:
        {demande_id:app.demande_id}
    }
  )
  updateQuantiteTotale(app.orderline.orderline_id)
  res.json({message:'updated successfully'})

}
const deletedemand=async(req,res)=>{
    const id=req.params.id
    const orderline_id=req.params.orderline_id
    console.log(req.body)
   const newd=await demande.destroy({
    where:{
       demande_id:id 
    }
   
   })
  updateQuantiteTotale(orderline_id)
   res.json({message:'deleted successfuly'})
}
const updateQuantiteTotale = async (orderline_id) => {
   
      const totalQuantite = await demande.sum('quantité', {
        where: { orderline_id }
      });
      console.log(totalQuantite)
      await orderline.update(
        { quantité_totale: totalQuantite || 0 }, // On met 0 si aucune quantité n'existe
        { where: { orderline_id } }
      );
    
  };
  const PDFDocument = require('pdfkit');

const download=async(req,res)=>{
  const commandeId=req.params.id
  console.log('cid',commandeId)
  const doc = new PDFDocument();
      res.setHeader('Content-Disposition', 'attachment; filename=demandes.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);
     const demands = await demande.findAll({
        attributes: ['quantité', 'demande_id','user_id'],
        include: [
          {
            model: orderline,
            attributes: ['orderline_id', 'commande_id', 'quantité_totale'],
            where: {
              //commande_id: commandeId, // Ajoutez la condition ici
            },
            include: [
              {
                model: Produit,
                attributes: ['nom'],
                as: 'produit',
              },
              {
                model: Commande,
                attributes: ['fournisseur_id'],
                as: 'commande',
                where: {
                  //fournisseur_id: req.supplierId, 
                  commande_id:commandeId
                },
              },
            ],
          },{
           
            model:User,
            attributes:['Username']
            
          }
        ],
       
        /*where: {
          '$orderline.commande.fournisseur_id$': req.supplierId,
         
        
        },*/
        
      });
      console.log(demands)
      doc.fontSize(25).text(`Les demandes pour la commande N° ${commandeId}`, { align: 'center' });
      //doc.fontSize(12).text('Commande ID', 50, 150);
      doc.fontSize(12).text('Username', 50, 150);
      doc.fontSize(12).text('Produit', 150, 150);
      doc.fontSize(12).text('Quantité ', 250, 150);
      doc.fontSize(12).text('Quantité totale', 350, 150);
      
      // Position de départ pour les lignes de données
      let yPosition = 170;
      
      demands.forEach((demand, index) => {
        const orderline = demand.orderline;
        const commandeId = orderline.commande_id;
        const username = demand.user.Username;
        const quantiteDemandee = demand.quantité;
        const quantiteTotale = orderline.quantité_totale;
        const produit=demand.orderline.produit.nom
      
        // Insérer les données dans le tableau
        //doc.fontSize(12).text(commandeId, 50, yPosition);
        doc.fontSize(12).text(username, 50, yPosition);
        doc.fontSize(12).text(produit, 150, yPosition);
        doc.fontSize(12).text(quantiteDemandee, 250, yPosition);
        doc.fontSize(12).text(quantiteTotale, 350, yPosition);
      
        // Déplacer la position verticale pour la prochaine ligne
        yPosition += 20;
      });
      doc.end();
}
module.exports={adddemand,getdemands,updatedemand,deletedemand,getsupplierdemands,download}