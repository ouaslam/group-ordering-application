const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("commande groupée", "root", "",{
    dialect: "mysql",
     host: "localhost"
    });
(async()=>{ try { sequelize.authenticate();   
    console.log('Connecté à la base de données MySQL!'); 
   
}catch (error) {  
console.error('Impossible de se connecter, erreur suivante :', error); 
}})()


module.exports=sequelize;