import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Recipe.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from 'react-bootstrap';
import data from '../JSON/predictionsWithNutritionFacts';

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
        <div className="recipe">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div className="recipe-general-info">
                        <img src={recipe.image} alt="recipe"></img>
                        <div>
                            <h1>{recipeDetails.title}</h1>
                            <h2>Time Serving Calories</h2>
                            <h3>{recipeDetails.prepTime}min {recipeDetails.servings} {recipeDetails.calories}kcal</h3>
                            <h3>Diets: {recipeDetails.diets.join(", ")}</h3>
                        </div>
                    </div>
                    <div className="ingredients-and-instructions">
                        <div className="ingredients">
                            <h4>Ingredients</h4>
                            <ul>
                                {recipeDetails.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h5>Instructions</h5>
                            {recipeDetails.instructions.map((instruction, instructionIndex) => (
                                <div key={instructionIndex}>
                                    <h5>{instruction.name}</h5>
                                    {instruction.steps.map((step, stepIndex) => (
                                        <p key={stepIndex}>{step.number}. {step.step}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Recipe;