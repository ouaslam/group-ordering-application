import { Link, Outlet} from 'react-router-dom';
import '../../App.css'
export default function accueilSupplier(){
  return (
    <>
     <div className='container'>
      <div className='sidebar'>
      <div><Link to="accueil">Accueil </Link></div>
     <div><Link to="add-product">Ajouter un produit </Link></div>
     <div><Link to="view-products">Consulter mes produits</Link></div>
     <div><Link to="add-order">Ajouter une commande</Link></div>
     <div><Link to="view-orders">Consulter mes commandes</Link></div>
     <div><Link to="view-demands">Consulter les demandes</Link></div>
     <div><Link to='/'>Déconnexion</Link></div>
     </div>
    <div className='main-content'>
      <Outlet/>
    </div>
      
      </div>
    </>
  )
}