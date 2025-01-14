
import { Link } from 'react-router-dom';
import React, { useState } from 'react';


import '../App.css'
export default function Home() {
  
  return (
    <div className='home-container'>
    <header>
      <h1>Bienvenue dans notre application de gestion de commandes groupées</h1>
      <p>Gérez vos achats en toute simplicité, rejoignez et créez des commandes groupées avec facilité.</p>
    </header>
    <div className='action-buttons'>
      <Link to="/ConnexionPage" className="btn-connect">Se connecter</Link>
      <Link to="/EnregistrementPage" className="btn-register">S'enregistrer</Link>
    </div>
  </div>
  );
  
  
}



