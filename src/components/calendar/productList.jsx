import React, { useState } from 'react';
import { 
  List, ListItem, ListItemText, Paper, Box, Typography, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { capitalize, getUrgencyColor, getUrgencyLabel } from './utils';

export default function ProductList({ selectedDayItems, setItems, UserID }) 
{
    const [confirmDialog, setConfirmDialog] = useState({ open: false, item: null, action: null });

    const openConfirm = (item, action) => 
    {
        setConfirmDialog({ open: true, item, action });
    };

    const closeConfirm = () => 
    {
        setConfirmDialog({ open: false, item: null, action: null });
    };


    const handleConfirm = () => 
    {
        if (confirmDialog.action) 
        {
            confirmDialog.action(confirmDialog.item);
        }
        closeConfirm();
    };

    const alterQuantity = async (item, delta) => 
    {
        const newQtt = item.quantity + delta;
    
    
        if (newQtt <= 0) 
        {
        
            openConfirm(item, () => deleteProduct(item));
            return;
        } 

        try 
        {
            const res = await fetch('http://localhost:3001/foodUser/', 
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_mail: `${UserID}`, food: item.id, quantity: newQtt, expirationdate: item.expirationDate }),
            });
        
            if (!res.ok) 
            {
                throw new Error(`Erreur API: ${res.status}`);
            }

            setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQtt } : i));
        
        } catch(err)
        {
            console.error("Erreur lors de la mise à jour de la quantité :", err);
        
        }
    };

    const deleteProduct = async (item) => { 
    
    setItems(prev => prev.filter(i => i.id !== item.id));

    try {
        const res = await fetch('http://localhost:3001/foodUser/', { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_mail: `${UserID}`, food: item.id }),
        });

        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }

    } catch (err) {
        console.error("Erreur lors de la suppression, restauration de l'item :", err);
        setItems(prev => [...prev, item]); 
    }
};

  return (
    <div>
        <List sx={{ overflow: 'auto', maxHeight:400}}>
            {selectedDayItems.map((item) => 
            {
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
                    {/*petite barre sympa*/}
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

                    <ListItemText
                        primary={
                            <Typography variant="body1" fontWeight={600}>
                            {capitalize(item.label)} x{item.quantity}
                            </Typography>
                        }
                        secondary={
                            <Box component="span">
                                <Button sx={{ color: 'grey' }} onClick={() => alterQuantity(item, 1)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                                <Button sx={{ color: 'grey' }} onClick={() => alterQuantity(item, -1)}>
                                    <FontAwesomeIcon icon={faMinus} />
                                </Button>
                                <Button sx={{ color: 'grey' }} onClick={() => openConfirm(item, () => deleteProduct(item))}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </Button>
                            </Box>
                        }
                        sx={{ flexGrow: 1 }}
                    />  

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

        {/* Dialog de confirmation*/}
        <Dialog open={confirmDialog.open} onClose={closeConfirm} disableRestoreFocus> {/*fix un warning*/}
            <DialogTitle>Supprimer le produit</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Voulez-vous vraiment supprimer "{confirmDialog.item?.label}" ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeConfirm}>Annuler</Button>
                <Button onClick={handleConfirm} sx={{backgroundColor:'#f44336', color:'white'}}>
                    Supprimer
                </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}