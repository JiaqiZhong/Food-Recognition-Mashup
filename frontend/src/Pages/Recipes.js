import React, { useState, useEffect, useRef, useMemo } from 'react';
import Pagination from '../Component/Pagination'
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import recipes from '../JSON/recipeContent.json';
import cookingTimeIcon from '../Icons/cooking-time-icon.png';
import caloriesIcon from '../Icons/calories-icon.png';
import SwitchBar from '../Component/SwitchBar';
import recipePlaceholderImage from '../Images/recipe-placeholder-image.png';

function Recipes() {  
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const hasLoadedBefore = useRef(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const navigate = useNavigate();
    const [selectedIngredients, setSelectedIngredients] = useState(() => {
        // Initialize state from localStorage
        const storedSelectedIngredients = localStorage.getItem('selectedIngredients');
        return storedSelectedIngredients ? JSON.parse(storedSelectedIngredients) : [];
    });
    const [manuallyEnteredIngredients, setManuallyEnteredIngredients] = useState('');

    // Recipes on the current page
    const currentRecipeData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return recipes.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, recipes]);

    useEffect(() => {
        const storedSelectedIngredients = localStorage.getItem('storedSelectedIngredients');
        const storedRecipes = localStorage.getItem('recipes');
        console.log(storedSelectedIngredients);
        console.log(JSON.stringify(selectedIngredients));

        if (selectedIngredients.length === 0) {
            console.log("Ingredient(s) required")
            setLoading(false);
            setErrorMessage("Please select at least one ingredient");
        }
        else if (storedRecipes && storedSelectedIngredients === JSON.stringify(selectedIngredients)) {
            console.log("Same ingredients, using cached data")
            setRecipes(JSON.parse(storedRecipes));
            setLoading(false);
        }
        else {
            console.log("Modified ingredients, fetch new data")
            getRecipes('http://localhost:4000/recipes/find-recipes/', selectedIngredients)
            localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients))
        }
    }, [selectedIngredients]);

    function getRecipes(url, ingredients) {
        axios.get(url + ingredients.join())
        .then((res) => {
            let recipes = res.data.map(({ id, title, image }) => ({ id, title, image }))
            const promises = recipes.map(async (recipe) => {
                try {
                    const res = await axios.get(`http://localhost:4000/recipes/${recipe.id}`);
                    recipe.prepTime = res.data.readyInMinutes;
                    recipe.servings = res.data.servings;
                    recipe.cuisineType = res.data.cuisines;
                    recipe.diets = res.data.diets;
                    recipe.calories = res.data.nutrition.nutrients[1].amount;
                    recipe.ingredients = res.data.extendedIngredients.map(ingredient => ingredient.original);
                    recipe.instructions = res.data.analyzedInstructions.map((instruction) => ({
                        name: instruction.name,
                        steps: instruction.steps.map(step => ({
                            number: step.number,
                            step: step.step
                        }))
                    }));
                    recipe.sourceUrl = res.data.sourceUrl;
                } catch (err) {
                    console.log(err);
                    setLoading(false);
                    setErrorMessage("Something went wrong, please try again later.");
                }                  
            });
            Promise.all(promises)
            .then(() => {
              console.log(recipes);
              setRecipes(recipes);
              setLoading(false);
              localStorage.setItem('recipes', JSON.stringify(recipes));
              localStorage.setItem('storedSelectedIngredients', JSON.stringify(ingredients))
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
              setErrorMessage("Something went wrong, please try again later.");
          });
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
            setErrorMessage("Something went wrong, please try again later.");
        })
    }

    // Navigate to the recipe details page of the clicked recipe
    const handleClick = (e, recipeID) => {
        e.preventDefault();
        const recipeDetails = recipes.find(recipe => recipe.id === recipeID);
        navigate(`/Recipes/${recipeID}`, { state: { recipeDetails: recipeDetails } });
    };

    // Get a manually entered ingredient
  const handleTextAreaChange = (e) => {
    setManuallyEnteredIngredients(e.target.value);
  }

  // Add the manually entered ingredients to selected ingredients
  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (manuallyEnteredIngredients !== '') {
      setSelectedIngredients([...selectedIngredients, manuallyEnteredIngredients]);
    }
      // Empty the textarea
    setManuallyEnteredIngredients('');
  }

    // Delete a selected ingredient
    const handleDeleteIngredient = (e, ingredient) => {
        e.preventDefault();
        setSelectedIngredients(selectedIngredients.filter(selectedIngredient => selectedIngredient !== ingredient));
    }

    return (
        <div className="p-4">
            <SwitchBar 
                selectedIngredients={selectedIngredients}
                manuallyEnteredIngredients={manuallyEnteredIngredients}
                handleTextAreaChange={handleTextAreaChange}
                handleAddIngredient={handleAddIngredient}
                handleDeleteIngredient={handleDeleteIngredient}
            />
            {loading ? (
                <div className="flex flex-col text-center items-center justify-center text-white font-serif text-xl">Loading predicted results...</div>
            ) : ( 
                errorMessage ? (
                    <div className="flex flex-col text-white justify-center items-center font-serif text-xl">{errorMessage}</div>
                ) : (
                    <div className="flex flex-col text-center items-center justify-center text-white h-full">
                        <div>
                            <div className="flex flex-wrap mx-10 justify-center">
                                {currentRecipeData.map((recipe, index) => (
                                    <div className="w-full sm:w-1/2 lg:w-1/4 p-3" key={index}>
                                        {/* Recipe cards */}
                                        <button onClick={(e) => handleClick(e, recipe.id)} className="w-full text-left h-full flex-grow transition-transform transform hover:scale-105">
                                            <div className="relative pb-10 bg-white shadow-lg rounded-lg h-full overflow-hidden">
                                                <img className="w-full object-cover" src={`https://img.spoonacular.com/recipes/${recipe.id}-636x393.jpg`} alt="recipe" onError={(e) => {e.target.onerror = null; e.target.src = recipePlaceholderImage;}}/>
                                                <div className="flex flex-col mx-6 my-4 text-black space-y-2">
                                                    <h3 className="text-lg font-bold font-georgia text-black">{recipe.title}</h3>
                                                    <div className="font-serif absolute pb-3 bottom-0 left-0 right-0 mx-6 flex flex-row items-center justify-between">
                                                        <div className="flex flex-row items-center space-x-1">
                                                            <img src={cookingTimeIcon} className="w-8"></img>
                                                            <p>{recipe.prepTime} minutes</p>
                                                        </div>
                                                        <div className="flex flex-row items-center space-x-1">
                                                            <img src={caloriesIcon} className="w-8"></img>
                                                            <p>{recipe.calories} kcal</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                className="flex justify-center w-full font-serif"
                                currentPage={currentPage}
                                totalCount={recipes.length}
                                pageSize={pageSize}
                                onPageChange={page => setCurrentPage(page)}
                            />
                        </div>
                    </div>
                )
            )}
        </div>         
    )
}

export default Recipes;