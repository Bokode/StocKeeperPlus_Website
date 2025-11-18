import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import { getUrgencyColor } from './utils';

export default function ServerDay(props) 
{
    const { itemsByDate = new Map(), day, outsideCurrentMonth, ...other } = props;

  
    const dateKey = day.format('YYYY-MM-DD');
    const dayItems = itemsByDate.get(dateKey) || [];
    const count = dayItems.length;

    if (count === 0) 
    {
        return <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />;
    }

    return (
        <Badge
            key={day.toString()}
            overlap="circular"
            badgeContent={count}
            sx={{
                '& .MuiBadge-badge': 
                {
                    backgroundColor: getUrgencyColor(dayItems[0].expirationDate),
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
