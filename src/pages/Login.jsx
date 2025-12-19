import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FieldLog from '../components/loginPage/FieldLog';
import "../components/loginPage/loginPage.css";
import { authFetch } from '../utils/request';

const LOGIN_API_URL = 'http://localhost:3001/v1/auth/login'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/'; 


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);
    setIsLoading(true);

    try {
      const response = await authFetch(LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ email, password }), 
      });

      // 1. Gestion des erreurs HTTP (401, 404, 500...)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Identifiants invalides ou erreur serveur.');
        return;
      }

      // 2. Si la connexion est OK, on lit les données renvoyées par le backend
      const data = await response.json();

      console.log("Données de connexion reçues :", data);
      // 3. Vérification du rôle (Adaptez 'isadmin' ou 'role' selon votre backend)
      // Selon votre CreatePopUp.jsx, le champ semble être "isadmin" ou "role"
      // Modifiez la condition ci-dessous selon ce que votre API renvoie exactement :
      if (data.role !== "admin") { 
          setError("Accès refusé : ce compte n'est pas administrateur.");
          setIsLoading(false); // Important pour réactiver le bouton
          return; // ON ARRÊTE TOUT ICI -> Pas de redirection
      }

      // 4. Si c'est un admin, on continue
      localStorage.setItem('isAuthenticated', 'true');
      navigate(redirectPath, { replace: true }); 
      
    } catch (err) {
      console.error("Erreur durant la connexion:", err);
      setError('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
      // Note: Si on a redirigé, le composant sera démonté donc ce finally n'est pas grave
      // Si on est resté pour afficher l'erreur, ceci réactive le formulaire
      setIsLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Connexion Requise</h1>
        
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          
          <FieldLog 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={isLoading}
          />
          <FieldLog 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={isLoading}
          />

          <button 
            className="login-btn" 
            type="submit" 
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export { LoginPage };