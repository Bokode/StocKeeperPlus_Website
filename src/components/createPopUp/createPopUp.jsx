import './createPopUp.css';
import IngredientsPopUp from "../ingredientsPopUp/ingredientsPopUp";
import { useState } from "react";

function CreatePopUp({ setShowCreatePopUp, columns, table, createInstanceFromDB }) {
  const filteredColumns = columns.filter(c => c !== "id");

  const initialForm = {};
  filteredColumns.forEach(c => {
    initialForm[c] = (c === "isadmin") ? false : "";
  });

  const [formData, setFormData] = useState(initialForm);
  const [ingredients, setIngredients] = useState([]);
  const [showIngredientsPopUp, setShowIngredientsPopUp] = useState(false);
  
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  
  const handleCreate = async () => {
    setIsLoading(true); 
    let success = false;

    // Préparation des données
    let dataToSend = formData;
    
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

    console.log("CREATE IngredientAmount payload:", dataToSend);

    
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
        
        {filteredColumns.map(col => {
          const value = formData[col];
          const isBoolean = col === "isadmin";
          const isComboBox = col === "measuringunit";
          return (
            <div key={col} className="containerReadInstance">
              <p className="textReadInstance">{col} :</p>
              {isBoolean ? (
                <input 
                  type="checkbox" 
                  checked={value} 
                  onChange={(e) => handleChange(col, e.target.checked)}
                  disabled={isLoading} 
                />
              ) : isComboBox ? (
                <select
                  className="inputReadInstance"
                  value={value}
                  onChange={(e) => handleChange(col, e.target.value)}
                  style={{ width: "180px" }}
                  disabled={isLoading}
                >
                  <option value="">Select unit</option>
                  <option value="gram">gram</option>
                  <option value="liter">liter</option>
                  <option value="unit">unit</option>
                </select>
              ) : (
                <input 
                  className="inputReadInstance" 
                  value={value} 
                  onChange={(e) => handleChange(col, e.target.value)}
                  type={col === "caloricintake" || col === "nbeaters" || col === "timetomake" ? "number" : "text"}
                  disabled={isLoading}
                />
              )}
            </div>
          );
        })}

        {/* ... (Affichage des ingrédients inchangé) ... */}
        {table === "Recipe" && (
            <div className="ingredientsPreview">
              <p className="textReadInstance">Selected ingredients : {ingredients.length}</p>
               {/* ... liste ingrédients ... */}
            </div>
        )}


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
                // 💡 Feedback visuel : on change le texte et on désactive
                disabled={ingredients.length === 0 || isLoading}
                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
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