import './readPopUp.css';
import ReadIngredientsIntegration from './readIngredientsIntegration';
import { formatValue } from '../../utils/tableFormatters';
import { extractIngredients } from '../../utils/ingredientsUtils';
import { useState, useEffect } from 'react';

function ReadPopUp({ setShowReadPopUp, instanceAction, dataLabel, table }) {
  const [formattedInstance, setFormattedInstance] = useState(null);
  
  // Formater les valeurs au chargement
  useEffect(() => {
    const formatData = async () => {
      if (!instanceAction) return;
      
      const formatted = { ...instanceAction };
      for (const key of dataLabel) {
        if (instanceAction[key] != null) {
          formatted[key] = await formatValue(table, key, instanceAction[key]);
        }
      }
      setFormattedInstance(formatted);
    };
    
    formatData();
  }, [instanceAction, dataLabel, table]);
  
  // Utiliser extractIngredients pour récupérer les ingrédients avec l'unité
  const ingredients = table === "Recipe" ? extractIngredients(instanceAction) : [];

  if (!formattedInstance) {
    return <div>Chargement...</div>;
  }

  return (
    <div className='backgroundPopUp' onClick={() => setShowReadPopUp(false)}>
      <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
        <h2>Détails {table}</h2>
        
        {dataLabel.map((key) => {
          let value = formattedInstance[key];
          if (typeof value === "boolean") value = value ? "Oui" : "Non";

          return (
            <p className='textReadInstance' key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong> : {value || "N/A"}
            </p>
          );
        })}

        {table === "Recipe" && ingredients.length > 0 && (
          <ReadIngredientsIntegration ingredients={ingredients} />
        )}

        <div className='containerReadButtonPopUp'>
          <button className='buttonPopUp' onClick={() => setShowReadPopUp(false)}>Quit</button>
        </div>
      </div>
    </div>
  );
}

export default ReadPopUp;