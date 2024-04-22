import React, {useState} from "react";
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './Preview.css';

function Preview() {
    const location = useLocation();
    //const searchParams = new URLSearchParams(location.search);
    //const image = searchParams.get('image');
    const imageFile = location.state.image;
    const [loading, setLoading] = useState(false);
    const [nutritionFacts, setNutritionFacts] = useState([]);

    const handleConfirm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("food_image", imageFile);
        //getPredictions("http://localhost:4000/recognition/upload", formData);
        getNutritionFacts("apple");
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

    async function getNutritionFacts(ingredient) {
        setLoading(true);
        try {
            axios.get(`http://localhost:4000/nutrition-facts/${ingredient}`)
            .then((res) => {
                console.log(res.data);
                setNutritionFacts(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    return (
        <div className="preview">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {imageFile && <img id="preview-img" src={URL.createObjectURL(imageFile)} alt="uploaded" />}
                    <div>
                        <Link to="/"><button>Cancel</button></Link>
                        <button onClick={handleConfirm}>Confirm</button>
                        {nutritionFacts && (
                            <ul>
                                <li>Energy: {nutritionFacts.energy.quantity}</li>
                                <li>Protein: {nutritionFacts.protein.quantity}</li>
                                <li>Fat: {nutritionFacts.fat.quantity}</li>
                                <li>Carbohydrates: {nutritionFacts.carbohydrates.quantity}</li>
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Preview;