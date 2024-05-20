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
        <div className="recipes">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h1>{recipeDetails.title}</h1>
                </div>
            )}
        </div>
    )
}

export default Recipe;