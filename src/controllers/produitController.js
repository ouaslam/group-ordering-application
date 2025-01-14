
const {Produit,orderline}=require("../models/models")
//ajouter un produit
const addProduct=async(produit,req,res)=>{
    console.log(produit)
 try{
  const { nom,prix}=produit;
    const newproduit=await Produit.create({
        nom:nom,
        supplier_id:req.supplierId,
        prix_unitaire:prix
       
    });

    res.status(201).json({ message: 'Product added successfully'});
   } catch (error) {
  console.error('Error adding product:', error);
  res.status(500).json({ message: 'Internal server error' });
}
}

const getallproducts=async (req, res) => {
    try {
      const produits = await Produit.findAll({ where: { supplier_id: req.supplierId } });
      res.json(produits);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des produits.' });
    }
  }

const updateproduct=async (req,res)=>{
  try{
  const id=req.params.id
  const {nom,prix_unitaire}=req.body.selectedProduct
  console.log(nom,prix_unitaire)
  await Produit.update(
    {
      nom:nom,
    prix_unitaire:prix_unitaire
    },{ where:
      {produit_id:id}
    }
  )
  res.status(201).json({ message: 'Product modified successfully'});
}catch{
  res.status(500).json({ message: 'Erreur lors de la modification  des produit.' });
  }
}

const deleteproduct=async(req,res)=>{
  const id=req.params.id
  const orderlinesCount = await orderline.count({ where: { produit_id: id } });

  if (orderlinesCount > 0) {
      return res.status(200).json({ message: "Impossible de supprimer ce produit car il est associé à des lignes de commande." });
    }
    else{
      await Produit.destroy({
        where:{
       produit_id:id
       }
    })
    res.status(200).json({ message: "Produit supprimé avec succès" });
    }
  
}
module.exports={addProduct,getallproducts,updateproduct,deleteproduct}