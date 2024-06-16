import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Recognition.css';
import axios from 'axios';
import data from '../JSON/predictionsWithNutritionFacts';
import UploadOrSnap from '../Component/UploadOrSnap';
import Preview from './Preview';
import Recipes from './Recipes';
import ButtonGroup from '../Component/ButtonGroup';
import { SecondaryButton } from '../Component/Buttons';

function Recognition() {
  const [isNutritionFacs, setIsNutritionFacts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [predictedResults, setPredictedResults] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [manuallyEnteredIngredients, setManuallyEnteredIngredients] = useState('');
  const [isSearchRecipes, setIsSearchRecipes] = useState(false);
  const checkBoxRef = useRef({});
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

    //console.log(`${value} is ${checked}`);
    
    // Case 1: The user checks the box
    if (checked) {
      setSelectedIngredients(prevIngredients => [...prevIngredients, value])
    }

    // Case 2: The user unchecks the box
    else {
      setSelectedIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient !== value))
    };
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

  // Search for recipes based on the selected ingredients
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(selectedIngredients);
    //navigate(`/Recipes`, { state: { ingredients: selectedIngredients } });
    setIsSearchRecipes(true);
  }

  const handleNutritionFacts = (e) => {
    e.preventDefault();
    setIsSearchRecipes(false);
  }

  // Delete a selected ingredient
  const handleDeleteIngredient = (e, ingredient) => {
    e.preventDefault();
    setSelectedIngredients(selectedIngredients.filter(selectedIngredient => selectedIngredient !== ingredient));
    // See if the ingredient is from the list or manually entered
    if (checkBoxRef.current[ingredient]) {
      checkBoxRef.current[ingredient].checked = false;
    }
  }

  // ketogenic, lowFodmap, vegan, vegetarian, whole30

  return (
    <div className="flex flex-col text-center items-center justify-center bg-wooden-tray-only bg-cover bg-center bg-no-repeat text-white h-full">
        {loading ? (
            <div>Loading...</div>
        ) : (
        <div className="space-y-4">
          <ButtonGroup>
            <SecondaryButton onClick={handleNutritionFacts} isActive={!isSearchRecipes}>Nutrition Facts</SecondaryButton>
            <SecondaryButton onClick={handleSearch} isActive={isSearchRecipes}>Find Recipes</SecondaryButton>
          </ButtonGroup>
          <p>Which one did I guess right? Select them to find your favourite recipes ^_^</p>
          <div className="flex flex-row justify-center space-x-2">
            {selectedIngredients.map((selectedIngredient, index) => {
              return (
                <button className="bg-button bg-contain bg-center bg-no-repeat text-gray-800 font-georgia font-bold p-4 whitespace-break-spaces" key={index} onClick={(e) => handleDeleteIngredient(e, selectedIngredient)}>
                {
                  selectedIngredient.includes(" ") ?
                    // Split by spaces if there are spaces in selectedIngredient
                    selectedIngredient.split(" ").map((word, idx) => (
                      <div key={idx}>
                        {word}
                        <br />
                      </div>
                    ))
                  :
                    // Split into chunks of up to 9 characters using regex if no spaces
                    selectedIngredient.match(/.{1,9}/g).map((chunk, idx) => (
                      <div key={idx}>
                        {chunk}
                        <br />
                      </div>
                    ))
                }
                </button>
              );
            })}
            <input className="bg-black rounded h-8 border-1 border-white" id="textarea" value={manuallyEnteredIngredients} placeholder="Add more here..." onChange={handleTextAreaChange}></input>
            <button className="bg-white text-gray-800 font-georgia font-bold px-2 h-8 rounded shadow-custom" onClick={handleAddIngredient}>Add</button>
          </div>
          {!isSearchRecipes ? (
            <div className="flex flex-col lg:flex-row lg:space-x-4 mx-4">
              <div className="flex flex-col text-center items-center justify-center">
                {imageFile && <img className="w-80 shadow-custom" src={URL.createObjectURL(imageFile)} alt="food-image" />}
                <UploadOrSnap />
              </div>
              <div>
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
                      {data.map((result) => (
                        <tr key={result.name}>
                          <td><input id="checkbox" value={result.name} type="checkbox" 
                          ref={(ref) => (checkBoxRef.current[result.name] = ref)}
                          onChange={handleCheckboxChange}/></td>
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
            </div>
          ) : (
            <Recipes ingredients={selectedIngredients}/>
          )}
        </div>
      )}
    </div>
  );
}

export default Recognition;