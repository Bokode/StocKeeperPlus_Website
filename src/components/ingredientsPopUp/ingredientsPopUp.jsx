import './ingredientsPopUp.css';
import { useState, useEffect } from 'react';

function IngredientsPopUp({ setShowIngredientsPopUp, ingredients, setIngredients, onConfirm }) {
  const [allFoods, setAllFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState(ingredients);

  // Charger toutes les foods au montage du composant
  useEffect(() => {
    fetch('http://localhost:3001/Food/all')
      .then(res => res.json())
      .then(json => setAllFoods(json))
      .catch(error => console.error('Error during ingredients loading:', error));
  }, []);

  // Filtrer les foods selon la recherche
  const filteredFoods = allFoods.filter(food =>
    food.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter un ingrédient à la liste
  const handleAddIngredient = (food) => {
    // Vérifier si l'ingrédient n'est pas déjà ajouté
    if (!selectedIngredients.find(ing => ing.label === food.label)) {
      setSelectedIngredients([...selectedIngredients, { 
        label: food.label, 
        foodId: food.id, // Garder l'ID pour la suppression dans update
        quantity: 1 
      }]);
    }
  };

  // Modifier la quantité d'un ingrédient
  const handleQuantityChange = (label, quantity) => {
    setSelectedIngredients(
      selectedIngredients.map(ing =>
        ing.label === label ? { ...ing, quantity: Number(quantity) } : ing
      )
    );
  };

  // Supprimer un ingrédient
  const handleRemoveIngredient = (label) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing.label !== label));
  };

  // Confirmer et fermer
  const handleConfirm = () => {
    setIngredients(selectedIngredients);
    setShowIngredientsPopUp(false);
    if (onConfirm) onConfirm();
  };

  return (
    <div className="backgroundPopUp" onClick={() => setShowIngredientsPopUp(false)}>
      <div className="containerIngredientsPopUp" onClick={(e) => e.stopPropagation()}>
        <h2>Select ingredients</h2>

        {/* Section des ingrédients sélectionnés */}
        <div className="selectedIngredientsSection">
          <h3>Selected ingredients ({selectedIngredients.length})</h3>
          {selectedIngredients.length === 0 ? (
            <p className="emptyMessage">No ingredients found</p>
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

        {/* Section de recherche et liste des foods */}
        <div className="foodsSection">
          <h3>Add ingredients</h3>
          <input
            type="text"
            placeholder="Search a food..."
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

        {/* Boutons d'action */}
        <div className="containerButtonPopUp">
          <button className="buttonPopUp" onClick={() => setShowIngredientsPopUp(false)}>
            Cancel
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