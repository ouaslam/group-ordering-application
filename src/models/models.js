const { Sequelize, Model, DataTypes, INTEGER } = require('sequelize');
const sequelize = require("../config/database");
//utilisateurs
const User=sequelize.define('user',{
    user_id:{type:DataTypes.INTEGER,
             primaryKey:true,
             autoIncrement:true,
    },
    Username:DataTypes.STRING,
    Email:DataTypes.STRING,
    Password:DataTypes.STRING,
    },
    {
        timestamps: false,
        tableName: 'users',
    }
)

//produits
const Produit=sequelize.define('produit',{
    produit_id:{type:DataTypes.INTEGER,
                primaryKey:true
    },
    supplier_id:DataTypes.INTEGER,
    nom:DataTypes.STRING,
    prix_unitaire:DataTypes.FLOAT

},{
    timestamps:false,
})
//fournisseurs
const Supplier=sequelize.define('supplier',{
    supplier_id:{type:DataTypes.INTEGER,
                     primaryKey:true
    },
    Username:DataTypes.STRING,
    Email:DataTypes.STRING,
    Password:DataTypes.STRING
},{
    timestamps:false

})
//groupes
const Groupe=sequelize.define("groupe",{
   groupe_id:{type:DataTypes.INTEGER,
             primaryKey:true

   },
   nom:DataTypes.STRING
},{
    timestamps:false
})
//commandes
const   Commande=sequelize.define("commande",{
    commande_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    groupe_id:DataTypes.INTEGER,
    fournisseur_id:DataTypes.INTEGER,
    date_debut:DataTypes.DATEONLY,
    date_fin:DataTypes.DATEONLY


},{timestamps:false})
//orderline
const   orderline=sequelize.define('orderline',{
    
    orderline_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    commande_id:{
        type: DataTypes.INTEGER,
        references:{
            model:'Commande',
            key:'commande_id'
        }
                 
    },
    produit_id:DataTypes.INTEGER,
    objectif:DataTypes.INTEGER,
    prix:DataTypes.FLOAT,
    quantité_totale:DataTypes.INTEGER


},{timestamps:false,
    tableName:'ligne_de_commande'
})

const demande=sequelize.define('demande',{
    demande_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:DataTypes.INTEGER,
    orderline_id:DataTypes.INTEGER,
    quantité:DataTypes.INTEGER
},{
    timestamps:false,
    tableName:'demandes'
})
module.exports={
    User,
    Produit,
    Supplier,
    Groupe,
    Commande,
    orderline,
    demande
    
};
Commande.hasMany(orderline, { foreignKey: 'commande_id', as: 'orderlines' });
orderline.belongsTo(Commande, { foreignKey: 'commande_id', as: 'commande' });
orderline.belongsTo(Produit,{foreignKey:'produit_id',as:'produit' })
Produit.hasMany(orderline,{foreignKey:'produit_id'})
demande.belongsTo(orderline,{foreignKey:'orderline_id'})
orderline.hasMany(demande,{foreignKey:'orderline_id'})
Commande.belongsTo(Supplier,{foreignKey:'fournisseur_id'})
demande.belongsTo(User,{foreignKey:'user_id'})
// Ajout des hooks dans le modèle demande

  /*demande.afterDestroy(async (demandeInstance, options) => {
    const totalQuantite = await demande.sum('quantité', {
      where: { orderline_id: demandeInstance.orderline_id }
    });
  
    await orderline.update(
      { quantité_totale: totalQuantite },
      { where: { orderline_id: demandeInstance.orderline_id } }
    );
  });
  demande.afterSave(async (demandeInstance, options) => {
    const totalQuantite = await demande.sum('quantité', {
      where: { orderline_id: demandeInstance.orderline_id }
    });
  
    await orderline.update(
      { quantité_totale: totalQuantite },
      { where: { orderline_id: demandeInstance.orderline_id } }
    );
  });
  
 */
  demande.beforeDestroy(async (demandeInstance, options) => {
    // Calculer la somme des quantités avant la suppression
    const totalQuantite = await demande.sum('quantité', {
      where: { orderline_id: demandeInstance.orderline_id }
    });
  
    // Mettre à jour la quantité totale de l'orderline
    await orderline.update(
      { quantité_totale: totalQuantite - demandeInstance.quantité },
      { where: { orderline_id: demandeInstance.orderline_id } }
    );
  });
  
  demande.afterSave(async (demandeInstance, options) => {
    const totalQuantite = await demande.sum('quantité', {
      where: { orderline_id: demandeInstance.orderline_id }
    });
  
    await orderline.update(
      { quantité_totale: totalQuantite },
      { where: { orderline_id: demandeInstance.orderline_id } }
    );
  });
  
  