import './updatePopUp.css';
import IngredientsPopUp from '../ingredientsPopUp/ingredientsPopUp';
import { useState } from 'react';

const getRecipeChanges = (initialIngredients, currentIngredients) => {
  const ingredientsToAddOrUpdate = [];
  const ingredientsToRemove = [];
  const currentLabels = currentIngredients.map(i => i.label);

  currentIngredients.forEach(ing => {
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

const IngredientsPreview = ({ ingredients }) => {
  if (!ingredients || ingredients.length === 0) return null;
  return (
    <div className="ingredientsPreview">
      <p className="textReadInstance">Actual ingredients : {ingredients.length}</p>
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

const FormField = ({ name, value, isLocked, isLoading, onChange }) => {
  const labelDisplay = name.charAt(0).toUpperCase() + name.slice(1);
  const isNumberField = ['caloricintake', 'nbeaters', 'timetomake'].includes(name);

  return (
    <div className='containerReadInstance'>
      <p className='textReadInstance'>{labelDisplay} : </p>

      {typeof value === 'boolean' ? (
        <input
          type="checkbox"
          checked={value}
          disabled={isLocked || isLoading}
          onChange={(e) => onChange(name, e.target.checked)}
        />
      ) : name === 'measuringunit' ? (
        <select
          className={`inputReadInstance ${isLocked ? 'inputDisabled' : ''}`}
          value={value || ''}
          disabled={isLocked || isLoading}
          onChange={(e) => onChange(name, e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="">Select unit</option>
          <option value="gram">gram</option>
          <option value="centiliter">centiliter</option>
          <option value="unit">unit</option>
        </select>
      ) : name === 'description' ? (  
        <textarea
          className="inputReadInstance"
          value={value}
          disabled={isLoading}
          onChange={(e) => onChange(name, e.target.value)}
          style={{ 
            height: '100px', 
            minWidth: '250px', 
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      ) : (
        <input
          className={`inputReadInstance ${isLocked ? 'inputDisabled' : ''}`}
          value={value}
          disabled={isLocked || isLoading}
          onChange={(e) => onChange(name, e.target.value)}
          type={isNumberField ? 'number' : 'text'}
        />
      )}
    </div>
  );
};

function UpdatePopUp({setShowUpdatePopUp, instanceAction = {}, dataLabel = [], updateInstanceFromDB, lockedFields = [], table}) {
  // State Formulaire
  const [formData, setFormData] = useState(() => {
    const data = {};
    dataLabel.forEach(key => {
        const val = instanceAction?.[key];
        data[key] = (typeof val === 'boolean') ? val : (val ?? '');
    });
    return data;
  });

  // State Ingrédients
  const [initialIngredients] = useState(() => {
    if (table === 'Recipe' && instanceAction?.ingredientamount_ingredientamount_recipeTorecipe) {
      return instanceAction.ingredientamount_ingredientamount_recipeTorecipe.map(ing => ({
        label: ing.food_ingredientamount_foodTofood?.label ?? '',
        foodId: ing.food_ingredientamount_foodTofood?.id,
        quantity: ing.quantity,
        measuringunit: ing.food_ingredientamount_foodTofood?.measuringunit
      }));
    }
    return [];
  });

  const [ingredients, setIngredients] = useState(initialIngredients);
  const [showIngredientsPopUp, setShowIngredientsPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Gestionnaire de changement générique
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);

     if (formData.measuringunit === "") {
      alert("Please select a measuring unit.");
      setIsLoading(false);
      return;
    }

    try {
      let dataToSend = { ...formData };

      if (table === 'Recipe') {
         dataToSend.caloricintake = formData.caloricintake ? Number(formData.caloricintake) : null;
         dataToSend.nbeaters = formData.nbeaters ? Number(formData.nbeaters) : null;
         dataToSend.timetomake = formData.timetomake ? Number(formData.timetomake) : null;
         dataToSend.description = formData.description || null;

         const { ingredientsToAddOrUpdate, ingredientsToRemove } = getRecipeChanges(initialIngredients, ingredients);
         if (ingredientsToAddOrUpdate.length > 0) dataToSend.ingredientsToAddOrUpdate = ingredientsToAddOrUpdate;
         if (ingredientsToRemove.length > 0) dataToSend.ingredientsToRemove = ingredientsToRemove;
      }

      const success = await updateInstanceFromDB(dataToSend);
      if (success) setShowUpdatePopUp(false);
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='backgroundPopUp' onClick={() => setShowUpdatePopUp(false)}>
      <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
        <h2>Update {table}</h2>

        {dataLabel.map((key) => (
          <FormField
            key={key}
            name={key}
            value={formData[key]}
            isLocked={Array.isArray(lockedFields) && lockedFields.includes(key)}
            isLoading={isLoading}
            onChange={handleChange}
          />
        ))}

        {table === 'Recipe' && <IngredientsPreview ingredients={ingredients} />}

        <div className='containerButtonPopUp'>
          <button className='buttonPopUp' onClick={() => setShowUpdatePopUp(false)} disabled={isLoading}>
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