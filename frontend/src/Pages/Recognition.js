import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UploadOrSnap from '../Component/UploadOrSnap';
import SwitchBar from '../Component/SwitchBar';
import predictionsData from '../JSON/predictionsWithNutritionFacts.json';

// Food image recognition page that display the predicted ingredients and their nutrition facts
function Recognition() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [predictedResults, setPredictedResults] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState(() => {
    // Initialize state from localStorage
    const storedSelectedIngredients = localStorage.getItem('selectedIngredients');
    return storedSelectedIngredients ? JSON.parse(storedSelectedIngredients) : [];
  });
  const [manuallyEnteredIngredients, setManuallyEnteredIngredients] = useState('');
  const [image, setImage] = useState(null);
  const checkBoxRef = useRef({});

  const location = useLocation();
  const imageFile = location.state?.image;
  const base64 = location.state?.base64;

  // Set the initial state of the local storage of selected ingredients
  useEffect(() => {
    localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);

  // Set the initial state of the checkboxes based on selectedIngredients
  useEffect(() => {
    predictedResults.forEach(result => {
      if (selectedIngredients.includes(result.name) && checkBoxRef.current[result.name]) {
        checkBoxRef.current[result.name].checked = true;
      }
    });
  }, [predictedResults, selectedIngredients]);

  // Set the initial state of predicted results based on input image
  useEffect(() => {
    const storedImage = localStorage.getItem('storedImage');
    const newImage = localStorage.getItem('newImage');
    const storedResults = localStorage.getItem('result');

    // Case 1: First time uploading an image / taking a photo
    if (storedImage === null) {
      console.log("First time uploading an image, fetching new data")
      //getPredictions("http://localhost:4000/recognition/upload", imageFile);
      getPredictions("https://food-lens-server.vercel.app/recognition/upload", imageFile);
      setImage(newImage);
    }

    // Case 2: The predicted results and nutrition facts for the input image have been loaded and stored in the local storage,
    // and the input image hasn't been modified (prevent multiple unnecessary calls to api during
    // refresh and navigation)
    else if (storedResults && storedImage === newImage) {
      console.log("Same image, using cached data");
      setPredictedResults(JSON.parse(storedResults));
      setImage(storedImage);
      setLoading(false);
    }

    // Case 3: The input image has been modified
    else {
      console.log("Different image, fetching new data");
      //getPredictions("http://localhost:4000/recognition/upload", imageFile);
      getPredictions("https://food-lens-server.vercel.app/recognition/upload", imageFile);
      setImage(newImage);
    }
  }, [imageFile]);

  // Get predicted results from "clarifai" route
  function getPredictions(url, image) {
    // Get predicted results with uploaded image as input
    const formData = new FormData();
    formData.append("food_image", image);
    axios.post(url, formData)
    .then((res) => {
        let results = res.data.results;
        const promises = results.map(async (result) => {
          try {
            // Get nutrition facts of each result
            //const res = await axios.get(`http://localhost:4000/nutrition-facts/${result.name}`);
            const res = await axios.get(`https://food-lens-server.vercel.app/nutrition-facts/${result.name}`);
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
            setImage(base64);
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
      setSelectedIngredients(prevIngredients => {
        const updatedIngredients = [...prevIngredients, value];
        localStorage.setItem('selectedIngredients', JSON.stringify(updatedIngredients));
        return updatedIngredients;
      });
    }

    // Case 2: The user unchecks the box
    else {
      setSelectedIngredients(prevIngredients => {
        const updatedIngredients = prevIngredients.filter(ingredient => ingredient !== value);
        localStorage.setItem('selectedIngredients', JSON.stringify(updatedIngredients));
        return updatedIngredients;
      });
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
      setSelectedIngredients(prevIngredients => {
        const updatedIngredients = [...prevIngredients, manuallyEnteredIngredients];
        localStorage.setItem('selectedIngredients', JSON.stringify(updatedIngredients));
        return updatedIngredients;
      });
    }
    // Empty the textarea
    setManuallyEnteredIngredients('');
  }

  // Delete a selected ingredient
  const handleDeleteIngredient = (e, ingredient) => {
    e.preventDefault();
    setSelectedIngredients(prevIngredients => {
      const updatedIngredients = prevIngredients.filter(selectedIngredient => selectedIngredient !== ingredient);
      localStorage.setItem('selectedIngredients', JSON.stringify(updatedIngredients));
      return updatedIngredients;
    });
    // See if the ingredient is from the list or manually entered
    if (checkBoxRef.current[ingredient]) {
      checkBoxRef.current[ingredient].checked = false;
    }
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
          <div className="flex flex-col text-center items-center justify-center text-white font-serif text-xl">{errorMessage}</div>
        ) : (
          <div className="flex flex-col text-center items-center justify-center text-white px-4">
            <div className="flex flex-col md:flex-row md:space-x-4">
              {/* Display the uploaded image */}
              <div className="flex order-2 md:order-1 flex-col text-center items-center">
                <div className="max-w-80">
                  {image && <img className="w-80 shadow-custom" src={image} alt="food image" />}
                  <UploadOrSnap />
                </div>
              </div>
              {/* Table for displaying the nutrition facts data */}
              <div className="font-serif order-1 md:order-2 text-xs text-black bg-paper bg-100 bg-center bg-no-repeatrounded p-5 mb-5 sm:text-lg sm:p-10">
                <table className="table-auto m-2">
                    {/* Column name */}
                    <thead>
                      <tr className="w-auto">
                        <th>&nbsp;</th>
                        <th>Food</th>
                        <th className="whitespace-pre-line">Probability (%)</th>
                        <th className="whitespace-pre-line">Energy (kcal)</th>
                        <th className="whitespace-pre-line">Protein (kcal)</th>
                        <th className="whitespace-pre-line">Fat (kcal)</th>
                        <th className="whitespace-pre-line">Carbohydrates (kcal)</th>
                      </tr>
                    </thead>         
                    {/* Data entries */}
                    <tbody>
                      {predictedResults.map((result) => (
                        <tr key={result.name}>
                          {/* Checkbox */}
                          <td className="border-b border-gridColor border-opacity-50">
                            <input
                              id="checkbox" 
                              value={result.name}
                              type="checkbox" 
                              ref={(ref) => (checkBoxRef.current[result.name] = ref)}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                          {/* Ingredients and their nutrition facts */}
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
          </div>
        )
      )}
    </div>
  );
}

export default Recognition;