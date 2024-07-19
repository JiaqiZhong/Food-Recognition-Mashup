import React from 'react';
import { useLocation } from 'react-router-dom';
import cookingTimeIcon from '../Icons/cooking-time-icon.png';
import caloriesIcon from '../Icons/calories-icon.png';
import servingSizeIcon from '../Icons/serving-size-icon.png';
import recipePlaceholderImage from '../Images/recipe-placeholder-image.png';

// Individual recipe page that shows the details of the recipe
function Recipe() {
    // Get recipe details from parent page
    const location = useLocation();
    const recipeDetails = location.state.recipeDetails;

    return (
        <div className="flex flex-col items-center justify-center text-black h-full">
            <div className="flex flex-row items-center justify-center m-6">
                {/* Left margin */}
                <div className="w-96"></div>
                {/* Recipe book page */}
                <div className="flex flex-row bg-recipe-book bg-100 bg-center bg-no-repeat rounded p-6 space-x-8">
                    {/* Left page */}
                    <div className="flex-1 flex flex-col space-y-4 m-4">
                        {/* Recipe title */}
                        <h1 className="font-georgia font-bold text-xl">{recipeDetails.title}</h1>
                        {/* Diet label */}
                        <div className="flex flex-wrap text-center items-center">
                            {recipeDetails.diets.map((diet, index) => {
                                return (
                                    <label className="bg-white bg-opacity-75 text-gray-800 rounded font-serif font-bold px-2 py-1 m-1" key={index}>{diet}</label>
                                )
                            })}
                        </div>
                        {/* Cooking information */}
                        <div className="font-serif text-lg flex flex-row items-center justify-between">
                            {/* Cooking time */}
                            <div className="flex flex-row items-center space-x-1">
                                <img src={cookingTimeIcon} className="w-8"></img>
                                <p>{recipeDetails.prepTime} minutes</p>
                            </div>
                            {/* Servings */}
                            <div className="flex flex-row items-center space-x-1">
                                <img src={servingSizeIcon} className="w-8"></img>
                                <p>{recipeDetails.servings} servings</p>
                            </div>
                            {/* Calories */}
                            <div className="flex flex-row items-center space-x-1">
                                <img src={caloriesIcon} className="w-8"></img>
                                <p>{recipeDetails.calories} kcal</p>
                            </div>
                        </div>
                        {/* Recipe image */}
                        <div className="flex">
                            <img className="w-full" src={`https://img.spoonacular.com/recipes/${recipeDetails.id}-636x393.jpg`} alt="recipe" onError={(e) => {e.target.onerror = null; e.target.src = recipePlaceholderImage;}}></img>
                        </div>
                    </div>
                    {/* Right page */}
                    <div className="flex-1 flex flex-col space-y-6 m-4 pt-2 pr-8">
                        {/* Ingredients */}
                        <div className="relative text-black bg-white bg-opacity-25 p-4 rounded">
                            <h5 className="absolute top-0 left-20 transform -translate-x-1/2 -translate-y-1/2 font-georgia font-bold italic text-lg">Ingredients</h5>
                            <ul className="font-serif list-disc list-inside">
                                {recipeDetails.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
                            </ul>
                        </div>
                        {/* Instructions */}
                        <div className="relative text-black bg-white bg-opacity-25 p-4 rounded">
                            <h5 className="absolute top-0 left-20 transform -translate-x-1/2 -translate-y-1/2 font-georgia font-bold italic text-lg">Instructions</h5>
                            {recipeDetails.instructions.map((instruction, instructionIndex) => (
                                <div key={instructionIndex}>
                                    <h3 className="font-serif text-lg">{instruction.name}</h3>
                                    {instruction.steps.map((step, stepIndex) => (
                                        <p className="font-serif" key={stepIndex}>{step.number}. {step.step}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right margin */}
                <div className="w-96"></div>
            </div>
        </div>
    )
}

export default Recipe;