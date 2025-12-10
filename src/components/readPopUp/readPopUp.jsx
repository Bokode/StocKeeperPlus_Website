// import './readPopUp.css'

// function ReadPopUp({ setShowReadPopUp, instanceAction, dataLabel }) {
//   return (
//     <div className='backgroundPopUp' onClick={() => setShowReadPopUp(false)}>
//       <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
//           {dataLabel.map((key) => {
//             let value = instanceAction[key];
//             if (typeof value === "boolean") value = value ? "Oui" : "Non";

//           return (
//             <p className='textReadInstance' key={key}>{key.charAt(0).toUpperCase() + key.slice(1)} : {value}</p>
//           );
//           })}

//           <div className='containerReadButtonPopUp'>
//               <button className='buttonPopUp' onClick={() => setShowReadPopUp(false)}>Quit</button>
//           </div>
//       </div>
//     </div>
//   );
// }

// export default ReadPopUp;

import './readPopUp.css';

function ReadPopUp({ setShowReadPopUp, instanceAction, dataLabel, table }) {
  
  // Extraire les ingrédients si c'est une recette
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

        {/* Afficher les ingrédients pour les recettes */}
        {table === "Recipe" && ingredients.length > 0 && (
          <div className="ingredientsSection">
            <h3>Ingrédients ({ingredients.length})</h3>
            <div className="ingredientsReadList">
              {ingredients.map((ing, index) => (
                <div key={index} className="ingredientReadItem">
                  <span className="ingredientReadLabel">{ing.label}</span>
                  <span className="ingredientReadQuantity">{ing.quantity}</span>
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
        )}

        <div className='containerReadButtonPopUp'>
          <button className='buttonPopUp' onClick={() => setShowReadPopUp(false)}>Quit</button>
        </div>
      </div>
    </div>
  );
}

export default ReadPopUp;