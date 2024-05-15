import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Recognition.css';
import axios from 'axios';
import NutritionFacts from '../Component/NutritionFacts';
import Recipes from '../Component/Recipes';
import data from '../JSON/predictionsWithNutritionFacts';

function Recognition() {
  const [isNutritionFacs, setIsNutritionFacts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [predictedResults, setPredictedResults] = useState([]);
  const hasLoadedBefore = useRef(true)
  
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

  // function getNutritionFacts(ingredient) {
  //   axios.get(`http://localhost:4000/nutrition-facts/${ingredient}`)
  //   .then((res) => {
  //       console.log(res.data);
  //       setNutritionFacts(res.data);
  //       setLoading(false);
  //   })
  //   .catch(err => {
  //       console.log(err);
  //       setLoading(false);
  //   })
  // }

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
          <p>Which one did I guess right? Select them to fiind your favourite recipes ^_^</p>
          <input type="text" placeholder="Add more here..."></input>
          {/* {nutritionFacts && (
            <table>
              <tr>
                <td><input id="checkbox" type="checkbox"/></td>
                <td>Apple</td>
                <td>{+(Math.round(0.9866 * 100 + "e+2") + "e-2")}</td>
                <td>{nutritionFacts.energy.quantity}</td>
                <td>{nutritionFacts.protein.quantity}</td>
                <td>{nutritionFacts.fat.quantity}</td>
                <td>{nutritionFacts.carbohydrates.quantity}</td>
              </tr>
            </table>
          )} */}
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
                    <td><input id="checkbox" type="checkbox"/></td>
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