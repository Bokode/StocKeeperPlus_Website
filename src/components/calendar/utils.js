import dayjs from 'dayjs';

export const capitalize = (str) => 
{
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export function getUrgencyColor(expirationDate) 
{
    const expiry = dayjs(expirationDate).startOf('day');
    const today = dayjs().startOf('day');
    const daysUntilExpiry = expiry.diff(today, 'day');
  
    if (daysUntilExpiry < 0) return '#9a2222ff'; // Périmé
    if (daysUntilExpiry === 0) return '#f44336'; // Aujourd'hui
    if (daysUntilExpiry <= 3) return '#ff9800'; // 1-3 jours
    if (daysUntilExpiry <= 7) return '#ffc107'; // 4-7 jours
    return '#4caf50'; // > 7 jours
}

export function getUrgencyLabel(expirationDate) 
{
    const expiry = dayjs(expirationDate).startOf('day');
    const today = dayjs().startOf('day');
    const daysUntilExpiry = expiry.diff(today, 'day');
    if (daysUntilExpiry === 0) return 'Aujourd\'hui';
    return `${daysUntilExpiry}j`;
}

export function deleteProduct(user_mail, item, setItems) 
{
  
    setItems(prev => prev.filter(i => i.id !== item.id));

    fetch('http://localhost:3001/foodUser/', 
    {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
        {
            user_mail,
            food_id: item.id
        }),
    }).catch(err => console.error(err));
}


export default getUrgencyColor;
