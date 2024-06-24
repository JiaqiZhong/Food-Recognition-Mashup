import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import data from '../JSON/predictionsWithNutritionFacts';
import cookingTimeIcon from '../Images/cooking-time-icon.png';
import caloriesIcon from '../Images/calories-icon.png';
import servingSizeIcon from '../Images/serving-size-icon.png';

function Recipe() {
    //const { recipeID } = useParams();  
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState([]);
    const hasLoadedBefore = useRef(true);

    const location = useLocation();
    const recipeDetails = location.state.recipeDetails;

    useEffect(() => {
        if(hasLoadedBefore.current) {
          console.log("Effect ran")
          hasLoadedBefore.current = false;
        }
        else {
          console.log('component rendered');
          setRecipe(recipeDetails);
        }
      }, []);

    // function getRecipe(url) {
    //     axios.get(`http://localhost:4000/modules/${recipeId}`)
    //     .then((res) => {
    //         let recipes = res.data;
    //         const promises = recipes.map(async (recipe) => {
    //             try {
    //                 const res = await axios.get(`http://localhost:4000/recipes/${recipe.id}`);
    //                 recipe.prepTime = res.data.readyInMinutes;
    //                 recipe.servings = res.data.servings;
    //                 recipe.cuisineType = res.data.cuisines;
    //                 recipe.diets = res.data.diets;
    //                 recipe.calories = res.data.nutrition.nutrients[1].amount;
    //             } catch (err) {
    //                 console.log(err);
    //             }                  
    //         });
    //         Promise.all(promises)
    //         .then(() => {
    //           console.log(recipes);
    //           setRecipes(recipes);
    //           setLoading(false);
    //         })
    //         .catch(err => {
    //           console.log(err);
    //           setLoading(false);
    //       });
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         setLoading(false);
    //     })
    // }

    return (
        <div className="flex flex-col items-center justify-center text-black h-full">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="flex flex-row items-center justify-center m-6">
                    <div className="w-96"></div>
                    <div className="flex flex-row bg-notebook bg-100 bg-center bg-no-repeat rounded p-6 space-x-8">
                        <div className="flex-1 flex flex-col space-y-4 m-4">
                            <h1 className="font-georgia font-bold text-xl">{recipeDetails.title}</h1>
                            <div className="font-serif text-lg flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center space-x-1">
                                    <img src={cookingTimeIcon} className="w-8"></img>
                                    <p>{recipeDetails.prepTime} minutes</p>
                                </div>
                                <div className="flex flex-row items-center space-x-1">
                                    <img src={servingSizeIcon} className="w-8"></img>
                                    <p>{recipeDetails.servings} servings</p>
                                </div>
                                <div className="flex flex-row items-center space-x-1">
                                    <img src={caloriesIcon} className="w-8"></img>
                                    <p>{recipeDetails.calories} kcal</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap text-center items-center space-x-3">
                                {recipeDetails.diets.map((diet, index) => {
                                    return (
                                        <label className="bg-white bg-opacity-75 text-gray-800 rounded font-serif font-bold px-2 py-1" key={index}>{diet}</label>
                                    )
                                })}
                            </div>
                            <div className="flex">
                                <img className="w-full" src={recipe.image} alt="recipe"></img>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col space-y-6 m-4 pt-2 pr-8">
                            <div className="relative text-black bg-white bg-opacity-25 p-4 rounded">
                                <h5 className="absolute top-0 left-20 transform -translate-x-1/2 -translate-y-1/2 font-georgia font-bold italic text-lg">Ingredients</h5>
                                <ul className="font-serif list-disc list-inside">
                                    {recipeDetails.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
                                </ul>
                            </div>
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
                    <div className="w-96"></div>
                </div>
            )}
        </div>
    )
}

export default Recipe;