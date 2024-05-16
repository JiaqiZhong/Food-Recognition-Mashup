import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Recipes.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from 'react-bootstrap';
import data from '../JSON/predictionsWithNutritionFacts';

function Recipes() {  
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const hasLoadedBefore = useRef(true)

    useEffect(() => {
        if(hasLoadedBefore.current) {
          console.log("Effect ran")
          hasLoadedBefore.current = false;
        }
        else {
          console.log('component rendered');
          getRecipes("http://localhost:4000/recipes/chicken");
        }
      }, []);

    function getRecipes(url) {
        axios.get(url)
        .then((response) => {
            console.log(response.data);
            setRecipes(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }

    return (
        <div className="recipes">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Row>
                        {recipes.map((recipe, index) => (
                            <Col xs={12} sm={6} md={4} lg={4} key={index}>
                                {/* <Link to={`/Modules/${module.ModuleID}`} className="card-link"> */}
                                    <Card className="recipe-card">
                                        <Card.Img className="card-img-top w-100" src={recipe.image} alt="recipe" />
                                        <Card.Body className="card-body">
                                            <Card.Text className='card-title'>{recipe.title}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                {/* </Link> */}
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </div>
    )
}

export default Recipes;