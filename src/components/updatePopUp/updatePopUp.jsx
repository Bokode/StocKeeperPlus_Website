// UpdatePopUp.jsx
import './updatePopUp.css';
import IngredientsPopUp from '../ingredientsPopUp/ingredientsPopUp';
import { useState } from 'react';

function UpdatePopUp({
  setShowUpdatePopUp,
  instanceAction = {},
  dataLabel = [],
  updateInstanceFromDB,
  lockedFields = [],
  table
}) {
  // Initialisation du formData à partir de instanceAction et dataLabel
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    dataLabel.forEach(key => {
      // On prend la valeur existante ou '' (ou false pour les booléens)
      const val = instanceAction?.[key];
      initialData[key] = typeof val === 'boolean' ? val : (val ?? '');
    });
    return initialData;
  });

  // Ingrédients (pour Recipe) — on mappe la structure telle qu'elle vient de l'API
  const [ingredients, setIngredients] = useState(() => {
    if (table === 'Recipe' && instanceAction?.ingredientamount_ingredientamount_recipeTorecipe) {
      return instanceAction.ingredientamount_ingredientamount_recipeTorecipe.map(ing => ({
        label: ing.food_ingredientamount_foodTofood?.label ?? '',
        foodId: ing.food_ingredientamount_foodTofood?.id,
        quantity: ing.quantity
      }));
    }
    return [];
  });

  // snapshot des ingrédients initiaux pour comparaison
  const [initialIngredients] = useState(ingredients);

  const [showIngredientsPopUp, setShowIngredientsPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const buildIngredientDiffs = () => {
    const ingredientsToAddOrUpdate = [];
    const ingredientsToRemove = [];

    const initialLabels = initialIngredients.map(i => i.label);
    const currentLabels = ingredients.map(i => i.label);

    ingredients.forEach(ing => {
      const initial = initialIngredients.find(i => i.label === ing.label);
      if (!initial || initial.quantity !== ing.quantity) {
        ingredientsToAddOrUpdate.push({ label: ing.label, quantity: ing.quantity });
      }
    });

    initialIngredients.forEach(ing => {
      if (!currentLabels.includes(ing.label)) {
        ingredientsToRemove.push({ foodId: ing.foodId });
      }
    });

    return { ingredientsToAddOrUpdate, ingredientsToRemove };
  };

  const handleUpdateRecipe = async () => {
    setIsLoading(true);

    try {
      const { ingredientsToAddOrUpdate, ingredientsToRemove } = buildIngredientDiffs();

      const recipeData = {
        id: formData.id,
        label: formData.label,
        description: formData.description || null,
        caloricintake: formData.caloricintake ? Number(formData.caloricintake) : null,
        nbeaters: formData.nbeaters ? Number(formData.nbeaters) : null,
        timetomake: formData.timetomake ? Number(formData.timetomake) : null,

        ...(ingredientsToAddOrUpdate.length > 0 && { ingredientsToAddOrUpdate }),
        ...(ingredientsToRemove.length > 0 && { ingredientsToRemove })
      };

      const success = await updateInstanceFromDB(recipeData);

      setIsLoading(false);

      if (success) {
        setShowUpdatePopUp(false);
      }
    } catch (err) {
      console.error('Update recipe failed', err);
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);

     if (formData.measuringunit === "") {
      alert("Please select a measuring unit.");
      setIsLoading(false);
      return;
    }

    try {
      if (table === 'Recipe') {
        
        await handleUpdateRecipe();
        return;
      }

      // pour les autres tables, on envoie simplement formData
      const success = await updateInstanceFromDB(formData);

      setIsLoading(false);

      if (success) {
        setShowUpdatePopUp(false);
      }
    } catch (err) {
      console.error('Update failed', err);
      setIsLoading(false);
    }
  };

  return (
    <div className='backgroundPopUp' onClick={() => setShowUpdatePopUp(false)}>
      <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
        <h2>Update {table}</h2>

        {dataLabel.map((key) => {
          const isLocked = Array.isArray(lockedFields) && lockedFields.includes(key);
          const value = formData[key];

          return (
            <div key={key} className='containerReadInstance'>
              <p className='textReadInstance'>{key.charAt(0).toUpperCase() + key.slice(1)} : </p>

              {typeof value === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={value}
                  disabled={isLocked || isLoading}
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
              ) : key === 'measuringunit' ? (
                <select
                  className={`inputReadInstance ${isLocked ? 'inputDisabled' : ''}`}
                  value={value || ''}
                  disabled={isLocked || isLoading}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{ width: '200px' }}
                >
                  <option value="">Select unit</option>
                  <option value="gram">gram</option>
                  <option value="liter">liter</option>
                  <option value="unit">unit</option>
                </select>
              ) : (
                <input
                  className={`inputReadInstance ${isLocked ? 'inputDisabled' : ''}`}
                  value={value ?? ''}
                  disabled={isLocked || isLoading}
                  onChange={(e) => handleChange(key, e.target.value)}
                  type={key === 'caloricintake' || key === 'nbeaters' || key === 'timetomake' ? 'number' : 'text'}
                />
              )}
            </div>
          );
        })}

        {/* Afficher les ingrédients pour Recipe */}
        {table === 'Recipe' && (
          <div className="ingredientsPreview">
            <p className="textReadInstance">Actual ingredients : {ingredients.length}</p>
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
          <button
            className='buttonPopUp'
            onClick={() => setShowUpdatePopUp(false)}
            disabled={isLoading}
          >
            Cancel
          </button>

          {table === 'Recipe' && (
            <button
              className='buttonPopUp buttonIngredients'
              onClick={() => setShowIngredientsPopUp(true)}
              disabled={isLoading}
            >
              Manage ingredients
            </button>
          )}

          <button
            className='buttonPopUp buttonUpdate'
            onClick={handleUpdate}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
          >
            {isLoading ? 'Updating...' : 'Update'}
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
