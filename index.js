var express = require('express');
var app = express();
const cors=require('cors');
const { Produit } = require('./src/models/models');
const bodyParser=require('body-parser');
const {addUser,loginUser }=require('./src/controllers/userController');
const {addSupplier,loginSupplier}=require('./src/controllers/supplierContoller')
const {addProduct,getallproducts,updateproduct,deleteproduct}=require('./src/controllers/produitController');
const {addorder,getallorders,updateorder,deleteorder,getmyorders}=require('./src/controllers/commandeController');
const {verifytoken}=require('./src/middlewares/verifytoken');
const {addOrderLines}=require('./src/controllers/orderligneController');
const { adddemand,getdemands,updatedemand, deletedemand,getsupplierdemands,download} = require('./src/controllers/demandController');
const port=5000
app.use(cors()) 
app.use(bodyParser.json())
app.get('/', function(req, res) {
  res.send('hello');
});
app.listen(port)
app.post('/register/user', (req, res) => {
  const newuser=req.body.user
  addUser(newuser,res)
  console.log(req.body.user)
});
app.post('/register/supplier', (req, res) => {
  const newsupplier=req.body.user
  addSupplier(newsupplier,res)
  console.log(req.body.user)
});
app.post('/login/user',(req,res)=>{
   const user=req.body.user
   console.log(user)
   loginUser(user,res)
})
app.post('/login/supplier',(req,res)=>{
  const user=req.body.user
  console.log(user)
  loginSupplier(user,res)
})
app.post('/addproduct',verifytoken,(req,res)=>{
    const produit=req.body.produit
    addProduct(produit,req,res)
})

app.get('/supplier/products',verifytoken,(req,res)=>{
  getallproducts(req,res)});

app.post('/addorder',verifytoken,(req,res)=>{
    const commande=req.body.dates
    console.log('commande',commande);
  addorder(req,res,commande)});

app.post('/addorderlines',(req,res)=>{
     addOrderLines(req,res)
})
app.put('/products/:id', async (req, res) => {
  updateproduct(req,res)
  
})
app.get('/orders-with-details',(req,res)=>{
  getallorders(req,res)})
 
app.delete('/deleteproduct/:id',(req,res)=>{
  deleteproduct(req,res)
})
app.put('/updateorder/:id',(req,res)=>{
  updateorder(req,res)
})
app.delete('/deleteorder/:commandeid/:orderlineid',(req,res)=>{
  deleteorder(req,res)
})
app.post('/adddemand',verifytoken,(req,res)=>{
  adddemand(req,res)

})
app.get('/user-demands',verifytoken,(req,res)=>{
  getdemands(req,res)
})
app.get('/demands',verifytoken,(req,res)=>{
  getsupplierdemands(req,res)
})
app.put('/updatedemand',(req,res)=>{
  updatedemand(req,res)
})
app.delete('/deletedemand/:id/:orderline_id',(req,res)=>{
    deletedemand(req,res)
})
app.get('/supplier-orders',verifytoken,(req,res)=>{
  getmyorders(req,res)})

 app.get('/generate-pdf/:id',verifytoken,async (req, res) => {
      download(req,res)});

