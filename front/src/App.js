
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ConnexionPage from './pages/ConnexionPage';
import EnregistrementPage from './pages/EnregistrementPage';
import AccueilUser from './pages/accueilUser';
import AccueilSupplier from './pages/accueilSupplier/accueilSupplier';
import AddProduct from './pages/accueilSupplier/addProduct';
import AddOrder from './pages/accueilSupplier/addOrder';
import Viewproducts from './pages/accueilSupplier/viewproducts';
import Vieworders from './pages/accueilSupplier/vieworders';
import DefaultSupplierContent from './pages/accueilSupplier/DefaultSupplierContent';
import{ Demands} from './pages/accueilSupplier/DefaultSupplierContent'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ConnexionPage" element={<ConnexionPage />} />
        <Route path="/EnregistrementPage" element={<EnregistrementPage />} />
        <Route path="/AccueilUser" element={<AccueilUser/>} />
        <Route path='/AccueilSupplier' element={<AccueilSupplier/>}>
          <Route index element={<DefaultSupplierContent />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="view-products" element={<Viewproducts/>}/>
          <Route path='view-orders' element={<Vieworders/>}/>
          <Route path='view-demands' element={<Demands/>}/>
           <Route path='accueil' element={<DefaultSupplierContent/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;




