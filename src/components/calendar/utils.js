import dayjs from 'dayjs';

export const capitalize = (str) => {
  if (!str) return str; // sécurité si la string est vide
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function getUrgencyColor(expirationDate) {
  const expiry = dayjs(expirationDate).startOf('day');
  const today = dayjs().startOf('day');
  const daysUntilExpiry = expiry.diff(today, 'day');
  
  if (daysUntilExpiry < 0) return '#9a2222ff'; // Périmé
  if (daysUntilExpiry === 0) return '#f44336'; // Aujourd'hui
  if (daysUntilExpiry <= 3) return '#ff9800'; // 1-3 jours
  if (daysUntilExpiry <= 7) return '#ffc107'; // 4-7 jours
  return '#4caf50'; // > 7 jours
}

export function getUrgencyLabel(expirationDate) {
  const expiry = dayjs(expirationDate).startOf('day');
  const today = dayjs().startOf('day');
  const daysUntilExpiry = expiry.diff(today, 'day');
  
  if (daysUntilExpiry === 0) return 'Aujourd\'hui';
  //if (daysUntilExpiry < 0) return `${daysUntilExpiry}j`; // Négatif pour périmé
  return `${daysUntilExpiry}j`;
}

// Fonction générique pour modifier la quantité
export function alterQuantity(user_mail, item, delta, setItems) {

  const updatedItem = {
    user_mail,
    food_id: item.id,
    quantity: item.quantity + delta
  };

  // Mise à jour locale immédiate
  setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + delta } : i));

  // On envoie quand même la requête PATCH au serveur
  fetch('http://localhost:3001/foodUser/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem),
  })
    .catch(err => console.error(err));
}

export function deleteProduct(user_mail, item, setItems) {
  // Mise à jour locale immédiate : on retire l'item du state
  setItems(prev => prev.filter(i => i.id !== item.id));

  // Envoie la requête au backend
  fetch('http://localhost:3001/foodUser/', {
    method: 'DELETE', // ou PATCH si ton backend utilise PATCH pour delete
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_mail,
      food_id: item.id
    }),
  })
  .catch(err => console.error(err));
}



export default getUrgencyColor;
