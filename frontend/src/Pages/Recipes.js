import React, { useState, useEffect, useRef, useMemo } from 'react';
import Pagination from '../Component/Pagination'
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Recipes.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from 'react-bootstrap';
import recipesData from '../JSON/recipeContent.json';

function Recipes() {  
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const hasLoadedBefore = useRef(true)
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return recipesData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage]);

    const location = useLocation();
    const ingredients = location.state.ingredients;
    const navigate = useNavigate();

    useEffect(() => {
        if(hasLoadedBefore.current) {
          console.log("Effect ran")
          hasLoadedBefore.current = false;
        }
        else {
          console.log('component rendered');
          //getRecipes(`http://localhost:4000/recipes/find-recipes/${ingredients.join()}`);
        }
    }, []);

    function getRecipes(url) {
        axios.get(url)
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
                }                  
            });
            Promise.all(promises)
            .then(() => {
              console.log(recipes);
              setRecipes(recipes);
              setLoading(false);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
          });
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }

    const handleClick = (e, recipeID) => {
        e.preventDefault();
        const recipeDetails = recipesData.find(recipe => recipe.id === recipeID);
        navigate(`/Recipes/${recipeID}`, { state: { recipeDetails: recipeDetails } });
    };

    return (
        <div className="recipes">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Row>
                        {currentTableData.map((recipe, index) => (
                            <Col xs={12} sm={6} md={4} lg={4} key={index}>
                                <button key={index} onClick={(e) => handleClick(e, recipe.id)} className="card-link">
                                    <Card className="recipe-card">
                                        <Card.Img className="card-img-top w-100" src={recipe.image} alt="recipe" />
                                        <Card.Body className="card-body">
                                            <Card.Text className='card-title'>{recipe.title}</Card.Text>
                                            <Card.Text>Calories (per serving): {recipe.calories} kcal</Card.Text>
                                            <Card.Text>Servings: {recipe.servings}</Card.Text>
                                            <Card.Text>Cooking Time: {recipe.prepTime}</Card.Text>
                                            <Card.Text>Cuisine Type: {recipe.cuisineType.join(', ')}</Card.Text>
                                            <Card.Text>Diets: {recipe.diets.join(', ')}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </button>
                            </Col>
                        ))}
                    </Row>
                    <Pagination
                      className="pagination-bar"
                      currentPage={currentPage}
                      totalCount={recipesData.length}
                      pageSize={pageSize}
                      onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    )
}

export default Recipes;