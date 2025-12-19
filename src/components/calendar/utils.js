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
  
    if (daysUntilExpiry < 0) return '#9a2222ff';
    if (daysUntilExpiry === 0) return '#f44336';
    if (daysUntilExpiry <= 3) return '#ff9800';
    if (daysUntilExpiry <= 7) return '#ffc107';
    return '#4caf50';
}

export function getUrgencyLabel(expirationDate) 
{
    const expiry = dayjs(expirationDate).startOf('day');
    const today = dayjs().startOf('day');
    const daysUntilExpiry = expiry.diff(today, 'day');
    if (daysUntilExpiry === 0) return 'Aujourd\'hui';
    return `${daysUntilExpiry}j`;
}


export default getUrgencyColor;
