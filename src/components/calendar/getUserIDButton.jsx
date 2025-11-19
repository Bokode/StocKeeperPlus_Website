import { useState } from "react";
import ExpiryCalendar from "./ExpiryCalendar";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

export default function GetUserIDCalendar() {
  const [userID, setUserID] = useState("");   // valeur validée avec ENTER
  const [inputValue, setInputValue] = useState(""); // valeur tapée en live

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@\.]+$/; // 1er : ^ vzut dire dès le début de la chaine, [^\s@]+ toutes liste (le +) de chars ne comprenant ni espace ni @, @ il faut un @, 
// \. veut un . (\ car . veut dire de base n'importe quel char), $ toute la string dois répondre à la REGEX

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!emailRegex.test(inputValue)) return;

      setUserID(inputValue); // -> ceci déclenche l’affichage du calendrier
      setInputValue("");
    }
  };

  return (
    <Box>
      <TextField
        label="Id du client cherché"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{width:"200px"}}
      />

      {userID !== "" && (
        <ExpiryCalendar UserID={userID} />
      )}
    </Box>
  );
}

