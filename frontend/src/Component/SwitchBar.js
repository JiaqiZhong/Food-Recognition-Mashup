import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SecondaryButton } from './Buttons';

function SwitchBar(props) {
    const navigate = useNavigate();
    const location = useLocation();
    //const [isNutritionFacts, setIsNutritionFacts] = useState(true);
    const { selectedIngredients, manuallyEnteredIngredients, handleTextAreaChange, handleAddIngredient, handleDeleteIngredient } = props;
    const initialIsNutritionFacts = location.pathname === '/Recognition';
    const [isNutritionFacts, setIsNutritionFacts] = useState(initialIsNutritionFacts);

    const handleNutritionFacts = (e) => {
        e.preventDefault();
        setIsNutritionFacts(true);
        navigate(`/Recognition`, { state: { ingredients: selectedIngredients } });
        console.log("nutrition facts");
        console.log(isNutritionFacts);
    }

    // Search for recipes based on the selected ingredients
    const handleSearch = (e) => {
        e.preventDefault();
        setIsNutritionFacts(false);
        navigate(`/Recipes`, { state: { ingredients: selectedIngredients } });
        console.log("search recipes");
        console.log(isNutritionFacts);
    }

    return (
        <div className="flex flex-col text-center items-center justify-center text-white p-2 space-y-3">
            {/* Switch buttons for "Nutrition Facts" and "Find Recipes"*/}
            <div className="flex flex-row items-center justify-center border border-secondaryButtonColor rounded p-1 mx-4 w-full sm:w-2/3">
                <SecondaryButton onClick={handleNutritionFacts} isActive={isNutritionFacts}>Nutrition Facts</SecondaryButton>
                <SecondaryButton onClick={handleSearch} isActive={!isNutritionFacts}>Find Recipes</SecondaryButton>
            </div>
            {/* Display nutrition facts */}
            <div className="flex flex-col text-center items-center justify-center w-full space-y-3">
                <p className="font-serif text-xl">Which one did I guess right? Select them to find your favourite recipes!</p>
                {/* Manually add ingredients */}
                <div className="space-x-3">
                <input className="bg-transparent rounded h-8 border border-white w-80 font-serif text-lg p-1" id="textarea" value={manuallyEnteredIngredients} placeholder="Add more ingredients here, one at a time" onChange={handleTextAreaChange}></input>
                <button className="bg-white text-gray-800 font-georgia font-bold px-2 h-8 rounded shadow-custom transition-transform transform hover:scale-105" onClick={handleAddIngredient}>Add</button>
                </div>
                {/* Display each manually added ingredient on a sticky note*/}
                <div className="flex flex-wrap text-center items-center justify-center space-y-2">
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
        </div>
    )
}

export default SwitchBar;