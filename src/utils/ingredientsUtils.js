export const extractIngredients = (recipeData) => {
  if (!recipeData?.ingredientamount_ingredientamount_recipeTorecipe) {
    return [];
  }

  return recipeData.ingredientamount_ingredientamount_recipeTorecipe.map(ing => ({
    label: ing.food_ingredientamount_foodTofood.label,
    quantity: ing.quantity,
    diet: ing.food_ingredientamount_foodTofood.diet,
    nutriscore: ing.food_ingredientamount_foodTofood.nutriscore,
    measuringunit: ing.food_ingredientamount_foodTofood.measuringunit,
    foodId: ing.food_ingredientamount_foodTofood.id
  }));
};