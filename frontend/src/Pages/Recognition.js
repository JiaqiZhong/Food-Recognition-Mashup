import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
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
    <div>
      {loading ? (
          <div className="flex flex-col text-center items-center justify-center text-white min-h-screen font-serif text-xl">Loading predicted results...</div>
      ) : (
        <div className="flex flex-col text-center items-center justify-center text-white h-full">
          <div className="m-4 mx-8 space-y-2">
            <div className="flex flex-row border border-secondaryButtonColor rounded p-1 mx-8">
              <SecondaryButton onClick={handleNutritionFacts} isActive={!isSearchRecipes}>Nutrition Facts</SecondaryButton>
              <SecondaryButton onClick={handleSearch} isActive={isSearchRecipes}>Find Recipes</SecondaryButton>
            </div>
            {!isSearchRecipes ? (
              <div>
                <p className="m-2 font-serif text-xl">Which one did I guess right? Select them to find your favourite recipes!</p>
                <div className="space-x-3">
                  <input className="bg-transparent rounded h-8 border border-white w-80 font-serif text-lg" id="textarea" value={manuallyEnteredIngredients} placeholder="Add more ingredients here, one at a time" onChange={handleTextAreaChange}></input>
                  <button className="bg-white text-gray-800 font-georgia font-bold px-2 h-8 rounded shadow-custom" onClick={handleAddIngredient}>Add</button>
                </div>
                {/* <div className="flex flex-wrap text-center items-center justify-center space-x-2"> */}
                <div className="flex flex-wrap text-center items-center justify-center">
                  {selectedIngredients.map((selectedIngredient, index) => {
                    return (
                      <button className="bg-button bg-contain bg-center bg-no-repeat text-gray-800 font-georgia font-bold p-6 hover:bg-sticker" key={index} onClick={(e) => handleDeleteIngredient(e, selectedIngredient)}>
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
                </div>
              {/* </div> */}
              
                <div className="flex flex-col md:flex-row md:space-x-4 mx-4">
                  <div className="flex flex-col text-center items-center">
                    <div className="m-4 max-w-80">
                      {imageFile && <img className="w-80 shadow-custom" src={URL.createObjectURL(imageFile)} alt="food-image" />}
                      <UploadOrSnap />
                    </div>
                  </div>
                  <div className="font-serif text-lg text-black bg-paper bg-100 bg-center bg-no-repeatrounded p-10">
                    {/* <table className="table-auto bg-white bg-opacity-75 rounded"> */}
                    {/* <table className="table-auto bg-paper bg-cover bg-center bg-no-repeat"> */}
                        <table className="table-auto m-2">
                          <thead>
                            <tr className="w-auto">
                              <th>&nbsp;</th>
                              <th>Food</th>
                              <th class="whitespace-pre-line">Probability (%)</th>
                              <th class="whitespace-pre-line">Energy (kcal)</th>
                              <th class="whitespace-pre-line">Protein (kcal)</th>
                              <th class="whitespace-pre-line">Fat (kcal)</th>
                              <th class="whitespace-pre-line">Carbohydrates (kcal)</th>
                            </tr>
                          </thead>
                          {//predictedResults && (
                            <tbody>
                              {data.map((result) => (
                                <tr key={result.name}>
                                  <td className="border-b border-gridColor border-opacity-50"><input id="checkbox" value={result.name} type="checkbox" 
                                  ref={(ref) => (checkBoxRef.current[result.name] = ref)}
                                  onChange={handleCheckboxChange}/></td>
                                  <td className="border-b border-gridColor border-opacity-50">{result.name}</td>
                                  <td className="border-b border-gridColor border-opacity-50">{+(Math.round(result.value * 100 + "e+2") + "e-2")}</td>
                                  <td className="border-b border-gridColor border-opacity-50">{result.energy}</td>
                                  <td className="border-b border-gridColor border-opacity-50">{result.protein}</td>
                                  <td className="border-b border-gridColor border-opacity-50">{result.fat}</td>
                                  <td className="border-b border-gridColor border-opacity-50">{result.carb}</td>
                                </tr>
                              ))}
                            </tbody>
                          //)
                        }
                        </table>
                  </div>
                </div>
              </div>
            ) : (
              <Recipes ingredients={selectedIngredients}/>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recognition;