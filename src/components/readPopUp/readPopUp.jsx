import './readPopUp.css';
import ReadIngredientsIntegration from './readIngredientsIntegration';

function ReadPopUp({ setShowReadPopUp, instanceAction, dataLabel, table }) {
  
  const ingredients = table === "Recipe" && instanceAction.ingredientamount_ingredientamount_recipeTorecipe
    ? instanceAction.ingredientamount_ingredientamount_recipeTorecipe.map(ing => ({
        label: ing.food_ingredientamount_foodTofood.label,
        quantity: ing.quantity,
        diet: ing.food_ingredientamount_foodTofood.diet,
        nutriscore: ing.food_ingredientamount_foodTofood.nutriscore
      }))
    : [];

  return (
    <div className='backgroundPopUp' onClick={() => setShowReadPopUp(false)}>
      <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
        <h2>Détails {table}</h2>
        
        {dataLabel.map((key) => {
          let value = instanceAction[key];
          if (typeof value === "boolean") value = value ? "Oui" : "Non";

          return (
            <p className='textReadInstance' key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong> : {value || "N/A"}
            </p>
          );
        })}

        {/* Condition dans le parent */}
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