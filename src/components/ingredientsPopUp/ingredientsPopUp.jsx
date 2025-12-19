import { authFetch } from '../../utils/request';
import './ingredientsPopUp.css';
import { useState, useEffect } from 'react';

function IngredientsPopUp({ setShowIngredientsPopUp, ingredients, setIngredients, onConfirm }) {
  const [allFoods, setAllFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState(ingredients);

  useEffect(() => {
    authFetch('http://localhost:3001/v1/Food/all')
      .then(res => res.json())
      .then(json => setAllFoods(json))
      .catch(error => console.error('Error loading foods:', error));
  }, []);

  const filteredFoods = allFoods.filter(food =>
    food.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = (food) => {
    if (!selectedIngredients.find(ing => ing.label === food.label)) {
      setSelectedIngredients([...selectedIngredients, { 
        label: food.label, 
        foodId: food.id,
        quantity: 1,
        measuringunit: food.measuringunit 
      }]);
    }
  };

  const handleQuantityChange = (label, quantity) => {
    setSelectedIngredients(
      selectedIngredients.map(ing =>
        ing.label === label ? { ...ing, quantity: Number(quantity) } : ing
      )
    );
  };

  const handleRemoveIngredient = (label) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing.label !== label));
  };

  const handleConfirm = () => {
    setIngredients(selectedIngredients);
    setShowIngredientsPopUp(false);
    if (onConfirm) onConfirm();
  };

  return (
    <div className="backgroundPopUp" onClick={() => setShowIngredientsPopUp(false)}>
      <div className="containerIngredientsPopUp" onClick={(e) => e.stopPropagation()}>
        <h2>Select ingredients</h2>

        <div className="selectedIngredientsSection">
          <h3>Selected ingredients ({selectedIngredients.length})</h3>
          {selectedIngredients.length === 0 ? (
            <p className="emptyMessage">No ingredients selected</p>
          ) : (
            <div className="selectedIngredientsList">
              {selectedIngredients.map(ing => (
                <div key={ing.label} className="selectedIngredientItem">
                  <span className="ingredientLabel">{ing.label}</span>
                  <input
                    type="number"
                    min="1"
                    value={ing.quantity}
                    onChange={(e) => handleQuantityChange(ing.label, e.target.value)}
                    className="quantityInput"
                  />
                  <span className="unitLabel">
                    {ing.measuringunit ? ing.measuringunit : 'unit'}
                  </span>
                  <button
                    onClick={() => handleRemoveIngredient(ing.label)}
                    className="removeButton"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="foodsSection">
          <h3>Add ingredients</h3>
          <input
            type="text"
            placeholder="Search for a food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
          />
          <div className="foodsList">
            {filteredFoods.length === 0 ? (
              <p className="emptyMessage">No food found</p>
            ) : (
              filteredFoods.map(food => {
                const isSelected = selectedIngredients.find(ing => ing.label === food.label);
                return (
                  <div
                    key={food.id}
                    className={`foodItem ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isSelected && handleAddIngredient(food)}
                  >
                    <span className="foodLabel">{food.label}</span>
                    {food.measuringunit && (
                      <span className="foodUnit">{food.measuringunit}</span>
                    )}
                    {food.diet && <span className="foodDiet">{food.diet}</span>}
                    {food.nutriscore && (
                      <span className={`foodNutriscore nutriscore-${food.nutriscore.toLowerCase()}`}>
                        {food.nutriscore}
                      </span>
                    )}
                    {isSelected && <span className="checkmark">✓</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="containerButtonPopUp">
          <button className="buttonPopUp" onClick={() => setShowIngredientsPopUp(false)}>
            Back
          </button>
          <button
            className="buttonPopUp"
            onClick={handleConfirm}
            disabled={selectedIngredients.length === 0}
          >
            Confirm ({selectedIngredients.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default IngredientsPopUp;