
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import { getUrgencyColor } from './utils';

export default function ServerDay(props) {
  const { itemsByDate = new Map(), day, outsideCurrentMonth, ...other } = props;

  // Récupère les items pour ce jour spécifique
  const dateKey = day.format('YYYY-MM-DD');
  const dayItems = itemsByDate.get(dateKey) || [];
  const count = dayItems.length;

  // Si aucun produit n'expire ce jour, affichage standard
  if (count === 0) {
    return <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />;
  }

  // Trouve la couleur la plus urgente parmi tous les items de ce jour
  const mostUrgentColor = dayItems.length > 0
    ? getUrgencyColor(dayItems[0].expirationDate)
    : '#4caf50';

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={count}
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: mostUrgentColor,
          color: 'white',
          fontSize: '0.65rem',
          minWidth: 16,
          height: 16,
          padding: '0 4px',
        },
      }}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}
