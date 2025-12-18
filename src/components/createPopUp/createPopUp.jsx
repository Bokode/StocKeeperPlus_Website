import './createPopUp.css';
import IngredientsPopUp from "../ingredientsPopUp/ingredientsPopUp";
import { useState } from "react";

const IngredientsPreview = ({ ingredients }) => {
  if (!ingredients || ingredients.length === 0) return null;
  return (
    <div className="ingredientsPreview">
      <p className="textReadInstance">Selected ingredients : {ingredients.length}</p>
      <div className="ingredientsList">
        {ingredients.map(ing => (
          <span key={ing.label} className="ingredientBadge">
            {ing.label} ({ing.quantity})
          </span>
        ))}
      </div>
    </div>
  );
};

const FormField = ({ name, value, isLoading, onChange }) => {
  const labelDisplay = name.charAt(0).toUpperCase() + name.slice(1);
  const isNumberField = ['caloricintake', 'nbeaters', 'timetomake'].includes(name);

  return (
    <div className='containerReadInstance'>
      <p className='textReadInstance'>{labelDisplay} : </p>

      {name === 'isadmin' ? (
        <input
          type="checkbox"
          checked={value}
          disabled={isLoading}
          onChange={(e) => onChange(name, e.target.checked)}
        />
      ) : name === 'measuringunit' ? (
        <select
          className="inputReadInstance"
          value={value}
          disabled={isLoading}
          onChange={(e) => onChange(name, e.target.value)}
          style={{ width: '180px' }}
        >
          <option value="">Select unit</option>
          <option value="gram">gram</option>
          <option value="centiliter">centiliter</option>
          <option value="unit">unit</option>
        </select>
      ) : name === 'description' ? (  
        /* --- NOUVEAU BLOC POUR TEXTAREA --- */
        <textarea
          className="inputReadInstance"
          value={value}
          disabled={isLoading}
          onChange={(e) => onChange(name, e.target.value)}
          style={{ 
            height: '100px', 
            minWidth: '250px', 
            resize: 'vertical',
            fontFamily: 'inherit' // Pour garder la même police que les inputs
          }}
        />
      ) : (
        <input
          className="inputReadInstance"
          value={value}
          disabled={isLoading}
          onChange={(e) => onChange(name, e.target.value)}
          type={isNumberField ? 'number' : 'text'}
        />
      )}
    </div>
  );
};

function CreatePopUp({ setShowCreatePopUp, columns, table, createInstanceFromDB, setErrorMessage, setShowErrorPopUp }) {
  const filteredColumns = columns.filter(c => c !== "id" && c !== "imagepath");

  // Initialisation propre (String vide "" pour le texte, false pour checkbox)
  const [formData, setFormData] = useState(() => {
    const initial = {};
    filteredColumns.forEach(c => {
      initial[c] = (c === "isadmin") ? false : "";
    });
    return initial;
  });

  const [ingredients, setIngredients] = useState([]);
  const [showIngredientsPopUp, setShowIngredientsPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleCreate = async () => {
    setIsLoading(true);
    let success = false;

    if (formData.measuringunit === "") {
      setErrorMessage({
        message: "Please select a measuring unit.",
        details: []
      });
      setShowErrorPopUp(true);
      setIsLoading(false);
      return;
    }

    // Préparation des données
    let dataToSend = { ...formData };
    
    // Logique spécifique pour les Recettes
    if (table === "Recipe") {
       dataToSend = {
        label: formData.label,
        description: formData.description || null,
        caloricintake: formData.caloricintake ? Number(formData.caloricintake) : null,
        nbeaters: formData.nbeaters ? Number(formData.nbeaters) : null,
        timetomake: formData.timetomake ? Number(formData.timetomake) : null,
        ingredients: ingredients
      };
    }
    
    success = await createInstanceFromDB(dataToSend);
    setIsLoading(false); 

    if (success) {
      setShowCreatePopUp(false);
    }
  };

  return (
    <div className="backgroundPopUp" onClick={() => setShowCreatePopUp(false)}>
      <div className="containerContentPopUp" onClick={(e) => e.stopPropagation()}>
        <h2>Create {table}</h2>
        
        {filteredColumns.map(col => (
          <FormField
            key={col}
            name={col}
            value={formData[col]}
            isLoading={isLoading}
            onChange={handleChange}
          />
        ))}

        {table === "Recipe" && <IngredientsPreview ingredients={ingredients} />}

        <div className="containerButtonPopUp">
          <button 
            className="buttonPopUp" 
            onClick={() => setShowCreatePopUp(false)}
            disabled={isLoading}
          >
            Cancel
          </button>

          {table === "Recipe" ? (
            <>
              <button 
                className="buttonPopUp buttonIngredients" 
                onClick={() => setShowIngredientsPopUp(true)}
                disabled={isLoading}
              >
                {ingredients.length > 0 ? `Modify ingredients (${ingredients.length})` : "Add ingredients"}
              </button>
              
              <button 
                className="buttonPopUp buttonCreate" 
                onClick={handleCreate}
                disabled={ingredients.length === 0 || isLoading}
                style={{ 
                  opacity: (ingredients.length === 0 || isLoading) ? 0.6 : 1, 
                  cursor: (ingredients.length === 0) ? 'not-allowed' : (isLoading ? 'wait' : 'pointer') 
                }}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </>
          ) : (
            <button 
                className="buttonPopUp" 
                onClick={handleCreate} 
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          )}
        </div>
      </div>

      {showIngredientsPopUp && (
        <IngredientsPopUp 
          setShowIngredientsPopUp={setShowIngredientsPopUp}
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
      )}
    </div>
  );
}

export default CreatePopUp;