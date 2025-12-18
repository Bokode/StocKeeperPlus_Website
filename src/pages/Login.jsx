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

      if (!response.ok) {
        
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Identifiants invalides ou erreur serveur.');
        return;
      }

      
      navigate(redirectPath, { replace: true }); 
      
    } catch (err) {
      console.error("Erreur durant la connexion:", err);
      setError('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
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