const jwt=require('jsonwebtoken');
const verifytoken = (req, res, next) => {
 
    const token = req.headers['authorization'];
   
    if (!token) {
      return res.status(403).json({ message: 'Aucun token fourni' });
    }
     // Enlevez le préfixe 'Bearer ' du token si présent
     const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
     jwt.verify(tokenWithoutBearer, 'secret_key', (err, decoded) => {
      if (err) {
        console.log('err')
        return res.status(401).json({ message: 'Token invalide' });
        
      }
      
      req.supplierId = decoded.id; // Assign the supplier ID to the request
      next();
    });
  };
  
  module.exports={verifytoken}