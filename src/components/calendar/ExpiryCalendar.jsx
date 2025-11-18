/**
 * ExpiryCalendar.jsx
 * 
 * Composant React affichant un calendrier interactif avec visualisation des produits 
 * arrivant à expiration. Utilise l'API moderne de MUI X Date Pickers avec slots.
 */

import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

/**
 * Données d'exemple des produits en stock
 * TODO: Remplacer par des données provenant du backend via props ou context
 * 
 * Structure attendue pour chaque item:
 * - id: identifiant unique du produit
 * - name: nom du produit
 * - expiryDate: date de péremption au format ISO (YYYY-MM-DD)
 * - category: catégorie du produit (Laitier, Viande, etc.)
 */
const MOCK_ITEMS = [
  { id: 1, name: "Yaourt Nature", expiryDate: "2025-11-26", category: "Laitier" },
  { id: 2, name: "Saumon fumé tranché", expiryDate: "2025-11-21", category: "Poisson" },
  { id: 3, name: "Légumes grillés", expiryDate: "2025-11-21", category: "Légumes" },
  { id: 4, name: "Fromage Kamboutcha", expiryDate: "2025-11-16", category: "Fromage" },
  { id: 5, name: "Steak haché", expiryDate: "2025-11-15", category: "Viande" },
  { id: 6, name: "Lait demi-écrémé", expiryDate: "2025-11-20", category: "Laitier" },
  { id: 7, name: "Poulet rôti", expiryDate: "2025-11-18", category: "Viande" },
  { id: 8, name: "Beurre doux", expiryDate: "2025-11-17", category: "Laitier" },

  // Ajouts variés
  { id: 9, name: "Tomates cerises", expiryDate: "2025-11-19", category: "Légumes" },
  { id: 10, name: "Pâtes fraîches", expiryDate: "2025-11-14", category: "Épicerie" },
  { id: 11, name: "Riz basmati", expiryDate: "2026-01-10", category: "Épicerie" },
  { id: 12, name: "Coca-Cola 1L", expiryDate: "2026-04-02", category: "Boissons" },
  { id: 13, name: "Jambon cuit", expiryDate: "2025-11-15", category: "Charcuterie" },
  { id: 14, name: "Tortillas de blé", expiryDate: "2025-12-10", category: "Épicerie" },
  { id: 15, name: "Brocoli frais", expiryDate: "2025-11-13", category: "Légumes" },
  { id: 16, name: "Cœur de laitue", expiryDate: "2025-11-14", category: "Légumes" },
  { id: 17, name: "Fraises", expiryDate: "2025-11-13", category: "Fruits" },
  { id: 18, name: "Pommes Golden", expiryDate: "2025-12-02", category: "Fruits" },
  { id: 19, name: "Oeufs de poule plein air", expiryDate: "2025-12-01", category: "Œufs" },
  { id: 20, name: "Crème fraîche", expiryDate: "2025-11-16", category: "Laitier" },
  { id: 21, name: "Haricots verts surgelés", expiryDate: "2026-02-22", category: "Surgelés" },
  { id: 22, name: "Pizza surgelée 4 fromages", expiryDate: "2026-03-15", category: "Surgelé" },
  { id: 23, name: "Pain complet", expiryDate: "2025-11-14", category: "Boulangerie" },
  { id: 24, name: "Brie crémeux", expiryDate: "2025-11-26", category: "Fromage" },
  { id: 25, name: "Quiche lorraine", expiryDate: "2025-11-19", category: "Traiteur" },
  { id: 26, name: "Saucisson sec", expiryDate: "2026-05-05", category: "Charcuterie" },
  { id: 27, name: "Chocolat noir 70%", expiryDate: "2026-06-12", category: "Épicerie" },
  { id: 28, name: "Chips paprika", expiryDate: "2025-12-25", category: "Snacks" },
  { id: 29, name: "Houmous", expiryDate: "2025-11-17", category: "Traiteur" },
  { id: 30, name: "Bananes", expiryDate: "2025-11-26", category: "Fruits" },
  { id: 31, name: "Café moulu", expiryDate: "2026-07-01", category: "Boissons" },
  { id: 32, name: "Eau gazeuse 1.5L", expiryDate: "2026-03-01", category: "Boissons" },
  { id: 33, name: "Mozzarella", expiryDate: "2025-11-26", category: "Fromage" },
  { id: 34, name: "Dinde émincée", expiryDate: "2025-11-26", category: "Viande" },
  { id: 35, name: "Purée surgelée", expiryDate: "2026-01-26", category: "Surgelé" }
];


/**
 * Détermine la couleur d'urgence en fonction de la proximité de la date de péremption
 * 
 * @param {string} expiryDate - La date de péremption (format YYYY-MM-DD)
 * @returns {string} Code couleur hexadécimal selon l'urgence
 * 
 * Échelle de couleurs:
 * - Rouge foncé (#d32f2f): déjà périmé (date passée)
 * - Rouge (#f44336): expire aujourd'hui
 * - Orange (#ff9800): expire dans 1-3 jours
 * - Jaune (#ffc107): expire dans 4-7 jours
 * - Vert (#4caf50): expire dans plus de 7 jours
 */
function getUrgencyColor(expiryDate) {
  const expiry = dayjs(expiryDate).startOf('day');
  const today = dayjs().startOf('day');
  const daysUntilExpiry = expiry.diff(today, 'day');
  
  if (daysUntilExpiry < 0) return '#9a2222ff'; // Périmé
  if (daysUntilExpiry === 0) return '#f44336'; // Aujourd'hui
  if (daysUntilExpiry <= 3) return '#ff9800'; // 1-3 jours
  if (daysUntilExpiry <= 7) return '#ffc107'; // 4-7 jours
  return '#4caf50'; // > 7 jours
}

/**
 * Calcule le label d'urgence pour un produit
 * 
 * @param {string} expiryDate - La date de péremption
 * @returns {string} Label affichable (ex: "Aujourd'hui", "2j", "-3j")
 */
function getUrgencyLabel(expiryDate) {
  const expiry = dayjs(expiryDate).startOf('day');
  const today = dayjs().startOf('day');
  const daysUntilExpiry = expiry.diff(today, 'day');
  
  if (daysUntilExpiry === 0) return 'Aujourd\'hui';
  //if (daysUntilExpiry < 0) return `${daysUntilExpiry}j`; // Négatif pour périmé
  return `${daysUntilExpiry}j`;
}

/**
 * Composant personnalisé pour afficher chaque jour du calendrier avec des badges
 * Affiche un badge coloré avec le nombre de produits expirant ce jour
 * 
 * @param {Object} props - Props du composant
 * @param {Map} props.itemsByDate - Map de dates vers items
 * @param {dayjs.Dayjs} props.day - Le jour à rendre
 * @param {boolean} props.outsideCurrentMonth - Si le jour est hors du mois affiché
 */
function ServerDay(props) {
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
    ? getUrgencyColor(dayItems[0].expiryDate)
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
export default function ExpiryCalendar({ items = MOCK_ITEMS }) {
  // État: jour actuellement sélectionné (par défaut = aujourd'hui)
  const [selectedDay, setSelectedDay] = React.useState(dayjs());

  /**
   * Construit une Map de date -> items pour optimiser les performances
   * La Map est recalculée uniquement si 'items' change
   */
  const itemsByDate = React.useMemo(() => {
    const map = new Map();
    
    items.forEach((item) => {
      const dateKey = dayjs(item.expiryDate).format('YYYY-MM-DD');
      
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Grid container spacing={3} sx={{ p: 2 }}>
          
          {/* ========== COLONNE GAUCHE: CALENDRIER ========== */}
          <Grid item xs={12} lg={6}>
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
          <Grid item xs={12} lg={6}>
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
                <Chip 
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
                  {selectedDayItems.map((item) => {
                    const urgencyColor = getUrgencyColor(item.expiryDate);
                    const urgencyLabel = getUrgencyLabel(item.expiryDate);
                    
                    return (
                      <ListItem 
                        key={item.id}
                        sx={{ 
                          mb: 1.5,
                          p: 0,
                        }}
                      >
                        <Paper 
                          variant="outlined"
                          sx={{ 
                            width: '100%', 
                            p: 2,
                            display: 'flex', 
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: 2,
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          {/* Indicateur coloré d'urgence (barre verticale) */}
                          <Box
                            sx={{
                              width: 6,
                              height: 48,
                              borderRadius: 1,
                              backgroundColor: urgencyColor,
                              mr: 2,
                              flexShrink: 0,
                            }}
                          />
                          
                          {/* Informations du produit */}
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={600}>
                                {item.name}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {item.category}
                              </Typography>
                            }
                            sx={{ flexGrow: 1 }}
                          />
                          
                          {/* Badge de jours restants */}
                          <Chip
                            label={urgencyLabel}
                            size="small"
                            sx={{
                              bgcolor: urgencyColor,
                              color: 'white',
                              fontWeight: 600,
                              minWidth: 70,
                            }}
                          />
                        </Paper>
                      </ListItem>
                    );
                  })}
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