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

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateRecipe = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!formData.label || !formData.label.trim()) {
      alert("Le nom de la recette est obligatoire");
      return;
    }

    // Vérifier qu'au moins un ingrédient est sélectionné
    if (ingredients.length === 0) {
      alert("Veuillez sélectionner au moins un ingrédient");
      return;
    }

    // Préparer les données pour l'envoi
    const recipeData = {
      label: formData.label,
      description: formData.description || null,
      caloricintake: formData.caloricintake ? Number(formData.caloricintake) : null,
      nbeaters: formData.nbeaters ? Number(formData.nbeaters) : null,
      timetomake: formData.timetomake ? Number(formData.timetomake) : null,
      ingredients: ingredients
    };

    createInstanceFromDB(recipeData);
    setShowCreatePopUp(false);
  };

  const handleCreate = () => {
    if (table === "Recipe") {
      handleCreateRecipe();
    } else {
      createInstanceFromDB(formData);
      setShowCreatePopUp(false);
    }
  };

  return (
    <div className="backgroundPopUp" onClick={() => setShowCreatePopUp(false)}>
      <div className="containerContentPopUp" onClick={(e) => e.stopPropagation()}>
        <h2>Créer {table}</h2>
        
        {filteredColumns.map(col => {
          const value = formData[col];
          const isBoolean = col === "isadmin";
          return (
            <div key={col} className="containerReadInstance">
              <p className="textReadInstance">{col} :</p>
              {isBoolean ? (
                <input 
                  type="checkbox" 
                  checked={value} 
                  onChange={(e) => handleChange(col, e.target.checked)}
                />
              ) : (
                <input 
                  className="inputReadInstance" 
                  value={value} 
                  onChange={(e) => handleChange(col, e.target.value)}
                  type={col === "caloricintake" || col === "nbeaters" || col === "timetomake" ? "number" : "text"}
                />
              )}
            </div>
          );
        })}

        {/* Afficher les ingrédients sélectionnés pour les recettes */}
        {table === "Recipe" && (
          <div className="ingredientsPreview">
            <p className="textReadInstance">
              Ingrédients : {ingredients.length} sélectionné(s)
            </p>
            {ingredients.length > 0 && (
              <div className="ingredientsList">
                {ingredients.map(ing => (
                  <span key={ing.label} className="ingredientBadge">
                    {ing.label} ({ing.quantity})
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="containerButtonPopUp">
          <button className="buttonPopUp" onClick={() => setShowCreatePopUp(false)}>
            Cancel
          </button>
          {table === "Recipe" ? (
            <>
              <button 
                className="buttonPopUp buttonIngredients" 
                onClick={() => setShowIngredientsPopUp(true)}
              >
                {ingredients.length > 0 ? `Modifier ingrédients (${ingredients.length})` : "Ajouter ingrédients"}
              </button>
              <button 
                className="buttonPopUp buttonCreate" 
                onClick={handleCreate}
                disabled={ingredients.length === 0}
              >
                Create
              </button>
            </>
          ) : (
            <button className="buttonPopUp" onClick={handleCreate}>
              Create
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