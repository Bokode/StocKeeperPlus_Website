// ExpiryCalendar.jsx
import React from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";

const Dot = styled("span")(({ theme, color }) => ({
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color || theme.palette.grey[500],
  marginLeft: 6,
  boxShadow: "0 0 0 2px rgba(0,0,0,0.04)",
}));

// Exemple de données - à remplacer par celles de ton backend
const items = [
  { id: 1, name: "Yaourt Nature", expiryDate: "2025-11-26", category: "Laitier" },
  { id: 2, name: "Sliced smoked salmon", expiryDate: "2025-11-22", category: "Poisson" },
  { id: 3, name: "Légumes grillés", expiryDate: "2025-11-21", category: "Légumes" },
  { id: 4, name: "Fromage Kamboutcha", expiryDate: "2025-11-16", category: "Fromage" },
  { id: 5, name: "Steak haché", expiryDate: "2025-11-15", category: "Viande" },
  // ...
];

// utilitaire : retourne les items qui expirent exactement ce jour
const getItemsForDay = (date) =>
  items.filter((it) => dayjs(it.expiryDate).isSame(dayjs(date), "day"));

// utilitaire : nombre d'items expirant ce jour
const countForDay = (date) => getItemsForDay(date).length;

// utilitaire : détermination de la couleur d'urgence selon la proximité
const urgencyColor = (date) => {
  const d = dayjs(date).startOf("day");
  const today = dayjs().startOf("day");
  const diff = d.diff(today, "day"); // positive -> futur
  if (diff < 0) return "#8b0000"; // déjà périmé -> rouge foncé
  if (diff === 0) return "#ff1744"; // aujourd'hui -> rouge
  if (diff <= 3) return "#ff9100"; // 1-3 jours -> orange
  if (diff <= 10) return "#ffd54f"; // 4-10 jours -> jaune
  return "#66bb6a"; // plus loin -> vert
};

export default function ExpiryCalendar() {
  const [selectedDay, setSelectedDay] = React.useState(dayjs());

  // map de jours -> count (optimisation simple)
  const markers = React.useMemo(() => {
    const map = {};
    for (const it of items) {
      const key = dayjs(it.expiryDate).format("YYYY-MM-DD");
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, []);

  // rendu personnalisé d'un jour (pastilles + compteur)
  const renderDay = (date, _selectedDates, pickersDayProps) => {
    const key = dayjs(date).format("YYYY-MM-DD");
    const count = markers[key] || 0;

    // si pas d'items -> rendu standard
    if (!count) {
      return <PickersDay {...pickersDayProps} />;
    }

    // couleur d'urgence basée sur date
    const color = urgencyColor(date);

    return (
      <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <PickersDay {...pickersDayProps} />
        {/* pastille en bas-center */}
        <Box
          sx={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 0.4,
            alignItems: "center",
          }}
        >
          {/* si plusieurs éléments, affiche un petit cercle + nombre */}
          <Box
            sx={{
              px: 0.5,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: color,
              color: "common.white",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: (theme) => `0 2px 6px ${theme.palette.action.selected}`,
            }}
          >
            {count}
          </Box>
        </Box>
      </Box>
    );
  };

  const itemsForSelected = getItemsForDay(selectedDay);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* Calendrier gauche */}
        <Grid>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Calendar
            </Typography>

            <DateCalendar
              value={selectedDay}
              onChange={(newVal) => {
                if (newVal) setSelectedDay(dayjs(newVal));
              }}
              renderDay={renderDay}
              disableFuture={false}
//               sx={{
//               transform: "scale(1)",    // ← augmente la taille
//             transformOrigin: "top left", // ← évite qu'il décale
//   }}
            />
            <Box sx={{ mt: 1, display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="body2">Légende :</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Aujourd'hui" size="small" sx={{ bgcolor: "#ff1744", color: "white" }} />
                <Chip label="Proche" size="small" sx={{ bgcolor: "#ff9100", color: "white" }} />
                <Chip label="À venir" size="small" sx={{ bgcolor: "#66bb6a", color: "white" }} />
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Liste droite */}
        <Grid>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">
                Produits périmant le {selectedDay.format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {itemsForSelected.length} trouvés
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {itemsForSelected.length === 0 ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Aucun produit ne périme ce jour.
              </Typography>
            ) : (
              <List sx={{ mt: 1 }}>
                {itemsForSelected.map((it) => {
                  const color = urgencyColor(it.expiryDate);
                  return (
                    <ListItem key={it.id} sx={{ mb: 1, borderRadius: 2 }}>
                      <Paper sx={{ width: "100%", p: 1.2, display: "flex", alignItems: "center" }}>
                        <Box sx={{ mr: 2 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: color,
                            }}
                          />
                        </Box>
                        <ListItemText
                          primary={<Typography sx={{ fontWeight: 600 }}>{it.name}</Typography>}
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {it.category} — expire le {dayjs(it.expiryDate).format("DD/MM/YYYY")}
                            </Typography>
                          }
                        />
                        <Chip
                          label={dayjs(it.expiryDate).diff(dayjs(), "day") === 0 ? "Aujourd'hui" : `${dayjs(it.expiryDate).diff(dayjs(), "day")}j`}
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      </Paper>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
