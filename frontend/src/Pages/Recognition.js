import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import data from '../JSON/predictionsWithNutritionFacts';
import UploadOrSnap from '../Component/UploadOrSnap';
import Recipes from './Recipes';
import { SecondaryButton } from '../Component/Buttons';

function Recognition() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [predictedResults, setPredictedResults] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [manuallyEnteredIngredients, setManuallyEnteredIngredients] = useState('');
  const [isSearchRecipes, setIsSearchRecipes] = useState(false);
  const checkBoxRef = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const imageFile = location.state.image;
  const base64 = location.state.base64;

  //Get predicted results from the given image
  useEffect(() => {
    const storedImage = localStorage.getItem('storedImage');
    const newImage = localStorage.getItem('newImage');
    const storedData = localStorage.getItem('result');

    if (storedImage === null) {
      console.log("First time uploading an image, fetch new data")
      getPredictions("http://localhost:4000/recognition/upload", imageFile);
    }
    else if (storedData && storedImage === newImage) {
      console.log("Same image, using cached data");
      setPredictedResults(JSON.parse(storedData)); 
    } 
    else {
      console.log("Different image, fetch new data");
      getPredictions("http://localhost:4000/recognition/upload", imageFile);
    }
  }, [imageFile]);

  function getPredictions(url, image) {
    const formData = new FormData();
    formData.append("food_image", image);
    axios.post(url, formData)
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
            localStorage.setItem('result', JSON.stringify(results));
            localStorage.setItem('storedImage', base64);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
            setErrorMessage("Something went wrong, please try again later.");
        });
    })
    .catch(err => {
        console.log(err);
        setLoading(false);
        setErrorMessage("Something went wrong, please try again later.");
    });
  }

  // Get user-selected ingredients from predicted results
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    console.log(`${value} is ${checked}`);
    
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
    navigate(`/Recipes`, { state: { ingredients: selectedIngredients } });
    //setIsSearchRecipes(true);
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

  return (
    <div>
      {loading ? (
        <div className="flex flex-col text-center items-center justify-center text-white min-h-screen font-serif text-xl">Loading predicted results...</div>
      ) : (
        errorMessage ? (
          <div className="flex flex-col text-center items-center justify-center text-white min-h-screen font-serif text-xl">{errorMessage}</div>
        ) : (
          <div className="flex flex-col text-center items-center justify-center text-white p-6 space-y-2">
              {/* Switch buttons for "Nutrition Facts" and "Find Recipes"*/}
              <div className="flex flex-row items-center justify-center border border-secondaryButtonColor rounded p-1 mx-4 w-full sm:w-2/3">
                <SecondaryButton onClick={handleNutritionFacts} isActive={!isSearchRecipes}>Nutrition Facts</SecondaryButton>
                <SecondaryButton onClick={handleSearch} isActive={isSearchRecipes}>Find Recipes</SecondaryButton>
              </div>
              {/* Display nutrition facts */}
              
                <div className="flex flex-col text-center items-center justify-center w-full space-y-2">
                  <p className="font-serif text-xl">Which one did I guess right? Select them to find your favourite recipes!</p>
                  {/* Manually add ingredients */}
                  <div className="space-x-3">
                    <input className="bg-transparent rounded h-8 border border-white w-80 font-serif text-lg p-1" id="textarea" value={manuallyEnteredIngredients} placeholder="Add more ingredients here, one at a time" onChange={handleTextAreaChange}></input>
                    <button className="bg-white text-gray-800 font-georgia font-bold px-2 h-8 rounded shadow-custom transition-transform transform hover:scale-105" onClick={handleAddIngredient}>Add</button>
                  </div>
                  {/* Display each manually added ingredient on a sticky note*/}
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
                              // Split into chunks of up to 9 characters if the word is too long and there is no space
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
                </div>
                {!isSearchRecipes ? (
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    {/* Display the uploaded image */}
                    <div className="flex flex-col text-center items-center">
                      <div className="max-w-80">
                        {imageFile && <img className="w-80 shadow-custom" src={URL.createObjectURL(imageFile)} alt="food image" />}
                        <UploadOrSnap />
                      </div>
                    </div>
                    {/* Table for displaying the nutrition facts data */}
                    <div className="font-serif text-lg text-black bg-paper bg-100 bg-center bg-no-repeatrounded p-10">
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
                          <tbody>
                            {predictedResults.map((result) => (
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
                      </table>
                    </div>
                  </div>
              ) : (
                // Search for recipes with selected ingredients
                <Recipes ingredients={selectedIngredients}/>
              )}
          </div>
        )
      )}
    </div>
  );
}

export default Recognition;