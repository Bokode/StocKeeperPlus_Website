import './readPopUp.css';

function ReadIngredientsIntegration({ ingredients }) {
  return (
    <div className="ingredientsSection">
      <h3>Ingredients ({ingredients.length})</h3>
      <div className="ingredientsReadList">
        {ingredients.map((ing, index) => (
          <div key={index} className="ingredientReadItem">
            <span className="ingredientReadLabel">{ing.label}</span>
            <span className="ingredientReadQuantity">
              {ing.quantity}{ing.measuringunit ? ` ${ing.measuringunit}` : ''}
            </span>
            {ing.diet && <span className="ingredientReadDiet">{ing.diet}</span>}
            {ing.nutriscore && (
              <span className={`ingredientReadNutriscore nutriscore-${ing.nutriscore.toLowerCase()}`}>
                {ing.nutriscore}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadIngredientsIntegration;