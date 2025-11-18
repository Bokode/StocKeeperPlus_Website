/**
 * ExpiryCalendar.jsx
 * 
 * Composant React affichant un calendrier interactif avec visualisation des produits 
 * arrivant à expiration. Utilise l'API moderne de MUI X Date Pickers avec slots.
 */

import * as React from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Button, CircularProgress } from '@mui/material';


import renderProductList from './productList';

import ServerDay from './serverDay';



/**
 * Composant principal ExpiryCalendar
 * 
 * Affiche un calendrier interactif avec des marqueurs visuels pour les dates de péremption
 * et une liste détaillée des produits pour le jour sélectionné.
 * 
 * @param {Object} props - Props du composant
 * @param {Array} [props.items=MOCK_ITEMS] - Liste de produits à afficher
 * @returns {JSX.Element} Interface calendrier + liste de produits
 */
export default function ExpiryCalendar() {
  // État: jour actuellement sélectionné (par défaut = aujourd'hui)
  const [selectedDay, setSelectedDay] = React.useState(dayjs());
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:3001/foodUser/calendar/client@test.com/foods`);
        if (!res.ok) {
          console.error("Erreur API :", res.status);
          return;
        }
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Erreur fetch :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /**
   * Construit une Map de date -> items pour optimiser les performances
   * La Map est recalculée uniquement si 'items' change
   */
  const itemsByDate = React.useMemo(() => {
    const map = new Map();
    
    items.forEach((item) => {
      const dateKey = dayjs(item.expirationDate).format('YYYY-MM-DD');
      
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      
      map.get(dateKey).push(item);
    });
    
    return map;
  }, [items]);

  /**
   * Gère le changement de date sélectionnée dans le calendrier
   */
  const handleDateChange = React.useCallback((newDate) => {
    if (newDate && dayjs(newDate).isValid()) {
      setSelectedDay(dayjs(newDate));
    }
  }, []);

  // Récupère les items pour le jour actuellement sélectionné
  const selectedDayKey = selectedDay.format('YYYY-MM-DD');
  const selectedDayItems = itemsByDate.get(selectedDayKey) || [];

  
if (loading) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <CircularProgress/>
    </div>
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

              <Divider sx={{ mb: 2 }} />

              {/* Calendrier avec badges personnalisés via slots */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <DateCalendar
                  value={selectedDay}
                  onChange={handleDateChange}
                  slots={{
                    day: ServerDay,
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
                <List sx={{overflow:'auto'}}>
                  
                    {selectedDayItems.length === 0 ? (
                      <Typography>Aucun produit ce jour-là</Typography>
                    ) : (
                      renderProductList(selectedDayItems, setItems)
                    )}
                

                </List>
              )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}