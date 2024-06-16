import React, {useState} from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Preview.css';
import ButtonGroup from '../Component/ButtonGroup';
import { PrimaryButton } from '../Component/Buttons';

function Preview() {
    const location = useLocation();
    //const searchParams = new URLSearchParams(location.search);
    //const image = searchParams.get('image');
    const navigate = useNavigate();
    const imageFile = location.state.image;
    const [loading, setLoading] = useState(false);
    const [nutritionFacts, setNutritionFacts] = useState([]);

    const handleConfirm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("food_image", imageFile);
        //getPredictions("http://localhost:4000/recognition/upload", formData);
        //getNutritionFacts("apple");
        navigate(`/Recognition`, { state: { image: imageFile } });
    }

    const handleCancel = (e) => {
        e.preventDefault();
        navigate("/");
    }

    function getNutritionFacts(ingredient) {
        axios.get(`http://localhost:4000/nutrition-facts/${ingredient}`)
        .then((res) => {
            console.log(res.data);
            setNutritionFacts(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        })
    }

    function getPredictions(url, option) {
        axios.post(url, option)
        .then(res => {
            //console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <div className="flex flex-col text-center items-center justify-center bg-original bg-cover bg-center bg-no-repeat h-[calc(100vh-20px)]">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="m-4">
                    {imageFile && <img className="w-80 shadow-custom" src={URL.createObjectURL(imageFile)} alt="uploaded" />}
                    <ButtonGroup>
                        <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
                        <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
                        {/* {nutritionFacts && (
                            <ul>
                                <li>Energy: {nutritionFacts.energy.quantity}</li>
                                <li>Protein: {nutritionFacts.protein.quantity}</li>
                                <li>Fat: {nutritionFacts.fat.quantity}</li>
                                <li>Carbohydrates: {nutritionFacts.c.quantity}</li>
                            </ul>
                        )} */}
                    </ButtonGroup>
                </div>
            )}
        </div>
    );
}

export default Preview;