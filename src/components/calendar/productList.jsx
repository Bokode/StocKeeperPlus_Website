import React from 'react';
import { List, ListItem, ListItemText, Paper, Box, Typography, Button, Chip } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { capitalize, getUrgencyColor, getUrgencyLabel, alterQuantity, deleteProduct} from './utils';

export function renderProductList(selectedDayItems, setItems) {
  return (
    <List sx={{ overflow: 'auto' }}>
      {selectedDayItems.map((item) => {
        const urgencyColor = getUrgencyColor(item.expirationDate);
        const urgencyLabel = getUrgencyLabel(item.expirationDate);

        return (
          <ListItem key={item.id} sx={{ mb: 1.5, p: 0 }}>
            <Paper 
              variant="outlined"
              sx={{ 
                width: '100%', 
                p: 2,
                display: 'flex', 
                alignItems: 'center',
                transition: 'all 0.2s',
                '&:hover': { boxShadow: 2, transform: 'translateY(-2px)' },
              }}
            >
              {/* Barre colorée */}
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

              {/* Informations produit */}
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={600}>
                    {capitalize(item.label)} x{item.quantity}
                  </Typography>
                }
                secondary={
                  <Box component="span">
                    <Button sx={{ color: 'grey' }} onClick={() => alterQuantity("client@test.com", item, 1, setItems)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Button sx={{ color: 'grey' }} onClick={() => alterQuantity("client@test.com", item, -1, setItems)}>
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <Button sx={{ color: 'grey' }} onClick={() => deleteProduct("client@test.com", item, setItems)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                  </Box>
                }
                sx={{ flexGrow: 1 }}
              />

              {/* Badge jours restants */}
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
  );
}

export default renderProductList;