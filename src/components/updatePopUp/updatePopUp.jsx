import './updatePopUp.css';
import IngredientsPopUp from '../ingredientsPopUp/ingredientsPopUp';
import { useState } from 'react';

function UpdatePopUp({ setShowUpdatePopUp, instanceAction, dataLabel, updateInstanceFromDB, lockedFields, table }) {
  
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    dataLabel.forEach(key => initialData[key] = instanceAction[key]);
    return initialData;
  });

  // État pour les ingrédients (seulement pour Recipe)
  const [ingredients, setIngredients] = useState(() => {
    // Extraire les ingrédients existants de l'instance
    if (table === "Recipe" && instanceAction.ingredientamount_ingredientamount_recipeTorecipe) {
      return instanceAction.ingredientamount_ingredientamount_recipeTorecipe.map(ing => ({
        label: ing.food_ingredientamount_foodTofood.label,
        foodId: ing.food_ingredientamount_foodTofood.id,
        quantity: ing.quantity
      }));
    }
    return [];
  });

  const [initialIngredients] = useState(ingredients); // Pour comparer et détecter les changements
  const [showIngredientsPopUp, setShowIngredientsPopUp] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateRecipe = () => {
    // Détecter les ingrédients ajoutés/modifiés et supprimés
    const ingredientsToAddOrUpdate = [];
    const ingredientsToRemove = [];

    // Comparer avec les ingrédients initiaux
    const initialLabels = initialIngredients.map(ing => ing.label);
    const currentLabels = ingredients.map(ing => ing.label);

    // Trouver les ingrédients à ajouter ou modifier
    ingredients.forEach(ing => {
      const initial = initialIngredients.find(i => i.label === ing.label);
      // Ajouter si nouveau ou si la quantité a changé
      if (!initial || initial.quantity !== ing.quantity) {
        ingredientsToAddOrUpdate.push({ label: ing.label, quantity: ing.quantity });
      }
    });

    // Trouver les ingrédients à supprimer
    initialIngredients.forEach(ing => {
      if (!currentLabels.includes(ing.label)) {
        ingredientsToRemove.push({ foodId: ing.foodId });
      }
    });

    // Préparer les données pour l'envoi
    const recipeData = {
      id: formData.id,
      label: formData.label,
      description: formData.description || null,
      caloricintake: formData.caloricintake ? Number(formData.caloricintake) : null,
      nbeaters: formData.nbeaters ? Number(formData.nbeaters) : null,
      timetomake: formData.timetomake ? Number(formData.timetomake) : null,
    };

    // Ajouter les listes d'ingrédients seulement si elles ne sont pas vides
    if (ingredientsToAddOrUpdate.length > 0) {
      recipeData.ingredientsToAddOrUpdate = ingredientsToAddOrUpdate;
    }
    if (ingredientsToRemove.length > 0) {
      recipeData.ingredientsToRemove = ingredientsToRemove;
    }

    updateInstanceFromDB(recipeData);
    setShowUpdatePopUp(false);
  };

  const handleUpdate = () => {
    if (table === "Recipe") {
      handleUpdateRecipe();
    } else {
      updateInstanceFromDB(formData);
      setShowUpdatePopUp(false);
    }
  };

  return (
    <div className='backgroundPopUp' onClick={() => setShowUpdatePopUp(false)}>
      <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
        <h2>Update {table}</h2>
        
        {dataLabel.map((key) => {
          const isLocked = lockedFields.includes(key);
          const value = formData[key];

          return (
            <div key={key} className='containerReadInstance'>
              <p className='textReadInstance'>{key.charAt(0).toUpperCase() + key.slice(1)} : </p>
              {typeof value === "boolean" ? (
                <input 
                  type="checkbox" 
                  checked={value} 
                  disabled={isLocked} 
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
              ) : (
                <input 
                  className={`inputReadInstance ${isLocked ? "inputDisabled" : ""}`} 
                  value={value || ''} 
                  disabled={isLocked} 
                  onChange={(e) => handleChange(key, e.target.value)}
                  type={key === "caloricintake" || key === "nbeaters" || key === "timetomake" ? "number" : "text"}
                />
              )}
            </div>
          );
        })}

        {/* Afficher les ingrédients pour les recettes */}
        {table === "Recipe" && (
          <div className="ingredientsPreview">
            <p className="textReadInstance">
              Actual ingredients : {ingredients.length}
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

        <div className='containerButtonPopUp'>
          <button className='buttonPopUp' onClick={() => setShowUpdatePopUp(false)}>
            Cancel
          </button>
          {table === "Recipe" && (
            <button 
              className='buttonPopUp buttonIngredients' 
              onClick={() => setShowIngredientsPopUp(true)}
            >
              Manage ingredients
            </button>
          )}
          <button className='buttonPopUp buttonUpdate' onClick={handleUpdate}>
            Update
          </button>
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

export default UpdatePopUp;