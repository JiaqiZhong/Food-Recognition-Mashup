import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Recognition.css';
import axios from 'axios';
import NutritionFacts from '../Component/NutritionFacts';
import data from '../JSON/predictionsWithNutritionFacts';

function Recognition() {
  const [isNutritionFacs, setIsNutritionFacts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [predictedResults, setPredictedResults] = useState([]);
  const [userSelectedIngredients, setUserSelectedIngredients] = useState({ingredients: []});
  const hasLoadedBefore = useRef(true);
  const navigate = useNavigate();
  
  const location = useLocation();
  const imageFile = location.state.image;

  const toggleComponent = () => {
    setIsNutritionFacts(!isNutritionFacs);
  };

  useEffect(() => {
    if(hasLoadedBefore.current) {
      console.log("Effect ran")
      hasLoadedBefore.current = false;
    }
    else {
      console.log('component rendered');
      const formData = new FormData();
      formData.append("food_image", imageFile);
      //getPredictions("http://localhost:4000/recognition/upload", formData);
    }
  }, []);

  function getPredictions(url, option) {
    axios.post(url, option)
    .then((res) => {
        let results = res.data.results;
        const promises = results.map(async (result) => {
          try {
            const res = await axios.get(`http://localhost:4000/nutrition-facts/${result.name}`);
            result.energy = res.data.energy.quantity;
            result.protein = res.data.protein.quantity;
            result.fat = res.data.fat.quantity;
            result.carb = res.data.carbohydrates.quantity;
          } catch (err) {
            console.log(err);
          }
        });
        Promise.all(promises)
          .then(() => {
            console.log(results);
            setPredictedResults(results);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
        });
    })
    .catch(err => {
        console.log(err);
        setLoading(false);
    });
  }

  // Get user-selected ingredients from predicted results
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const { ingredients } = userSelectedIngredients;

    // console.log(`${value} is ${checked}`);
    
    // Case 1: The user checks the box
    if (checked) {
      setUserSelectedIngredients({
          ingredients: [...ingredients, value]
      });
    }

    // Case 2: The user unchecks the box
    else {
      setUserSelectedIngredients({
          ingredients: ingredients.filter(
              (ingr) => ingr !== value
          )
      });
    };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(userSelectedIngredients);
    navigate(`/Recipes`, { state: { ingredients: userSelectedIngredients.ingredients } });
  }

  return (
    <div className="main">
        {loading ? (
            <div>Loading...</div>
        ) : (
        <div>
          <div className="button-panel">
              {/* <NutritionFacts/>
              <Recipes/> */}
          </div>
          <p>Which one did I guess right? Select them to find your favourite recipes ^_^</p>
          <textarea value={userSelectedIngredients.ingredients} placeholder="Add more here..." onChange={handleCheckboxChange}></textarea>
          <button onClick={handleSearch}>Search</button>
          <table>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Food</th>
                <th>Probability(%)</th>
                <th>Energy(kcal)</th>
                <th>Protein(kcal)</th>
                <th>Fat(kcal)</th>
                <th>Carbohydrates(kcal)</th>
              </tr>
            </thead>
            {//predictedResults && (
              <tbody>
                {data.map(result => (
                  <tr key={result.name}>
                    <td><input id="checkbox" value={result.name} type="checkbox" onChange={handleCheckboxChange}/></td>
                    <td>{result.name}</td>
                    <td>{+(Math.round(result.value * 100 + "e+2") + "e-2")}</td>
                    <td>{result.energy}</td>
                    <td>{result.protein}</td>
                    <td>{result.fat}</td>
                    <td>{result.carb}</td>
                  </tr>
                ))}
              </tbody>
            //)}
            }
          </table>
        </div>
      )}
    </div>
  );
}

export default Recognition;