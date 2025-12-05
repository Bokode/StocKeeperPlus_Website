
import * as React from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { CircularProgress } from '@mui/material';

import ProductList from './productList';
import customDay from './customDay';

export default function ExpiryCalendar({UserID}) 
{
  const [selectedDay, setSelectedDay] = React.useState(dayjs());
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => 
  {
    async function fetchData() 
    {
      try {
        console.log(UserID);
        const encoded = encodeURIComponent(UserID);

        const res = await fetch(
          `http://localhost:3001/foodUser/calendar/${encoded}/foods`
        );
        if (!res.ok) 
        {
          console.error("Erreur API :", res.status);
          setError(res.status);
          return;
        }
        setError(null);
        const data = await res.json();
        setItems(data);
      } catch (err) 
      {
        console.error("Erreur fetch :", err);
      } finally 
      {
        setLoading(false);
      }
    }

    fetchData();
  }, [UserID]);

  const itemsByDate = React.useMemo(() => 
  {
    const map = new Map();
    
    items.forEach((item) => 
    {
      const dateKey = dayjs(item.expirationDate).format('YYYY-MM-DD');
      
      if (!map.has(dateKey)) 
      {
        map.set(dateKey, []);
      }
      
      map.get(dateKey).push(item);
    });
    
    return map;
  }, [items]);

  const handleDateChange = React.useCallback((newDate) => 
  {
    if (newDate && dayjs(newDate).isValid()) 
    {
      setSelectedDay(dayjs(newDate));
    }
  }, []);

  // Récupère les items pour le jour actuellement sélectionné
  const selectedDayKey = selectedDay.format('YYYY-MM-DD');
  const selectedDayItems = itemsByDate.get(selectedDayKey) || [];

  
  if (loading) 
  {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}>
        <CircularProgress/>
      </div>
    );
  }
  
  if (error) 
  {
    return (
      <Box sx={{ width: '100%', height: '100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Paper sx={{color:"red", p:2, mt:2}}>{error === 404 ? `Client ${UserID} introuvable ` : `Erreur API: ${error}`}</Paper>
      </Box>
    );
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Grid container spacing={3} sx={{ p: 2 }}>
          
          {/* ========== COLONNE GAUCHE: CALENDRIER ========== */}
          <Grid>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Calendrier d'expiration
              </Typography>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                de {UserID}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Calendrier avec badges personnalisés via slots */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <DateCalendar
                  value={selectedDay}
                  onChange={handleDateChange}
                  slots={{
                    day: customDay,
                  }}
                  slotProps={{
                    day: {
                      itemsByDate,
                    },
                  }}
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    '& .MuiPickersDay-root': {
                      fontSize: '0.9rem',
                    },
                  }}
                  showDaysOutsideCurrentMonth
                />
              </Box>
              
              {/* Légende des couleurs d'urgence */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Légende:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip 
                    label="Périmé" 
                    size="small" 
                    sx={{ bgcolor: '#9a2222ff', color: 'white' }} 
                  />
                  <Chip 
                    label="Aujourd'hui" 
                    size="small" 
                    sx={{ bgcolor: '#f44336', color: 'white' }} 
                  />
                  <Chip 
                    label="1-3 jours" 
                    size="small" 
                    sx={{ bgcolor: '#ff9800', color: 'white' }} 
                  />
                  <Chip 
                    label="4-7 jours" 
                    size="small" 
                    sx={{ bgcolor: '#ffc107', color: 'white' }} 
                  />
                  <Chip 
                    label="> 7 jours" 
                    size="small" 
                    sx={{ bgcolor: '#4caf50', color: 'white' }} 
                  />
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* ========== COLONNE DROITE: LISTE DES PRODUITS ========== */}
          <Grid>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* En-tête avec titre et compteur */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Produits du {selectedDay.format('DD/MM/YYYY')}
                </Typography>
                <Chip sx={{marginLeft:'5px'}}
                  label={`${selectedDayItems.length} produit${selectedDayItems.length > 1 ? 's' : ''}`}
                  color="primary"
                  size="small"
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height:'400px',
                overflow:'hidden',
              }}
              >

              {/* Affichage conditionnel: message si aucun produit, sinon liste */}
              {selectedDayItems.length === 0 ? (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 6,
                    color: 'text.secondary',
                   
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Aucun produit
                  </Typography>
                  <Typography variant="body2">
                    Rien n'expire ce jour-là
                  </Typography>
                </Box>
              ) : (
                <ProductList selectedDayItems={selectedDayItems} setItems={setItems} UserID={UserID}/>
              )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}