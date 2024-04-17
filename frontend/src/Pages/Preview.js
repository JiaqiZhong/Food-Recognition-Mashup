import React from "react";
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './Preview.css';

function Preview() {
    const location = useLocation();
    //const searchParams = new URLSearchParams(location.search);
    //const image = searchParams.get('image');
    const imageFile = location.state.image;

    const handleConfirm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("food_image", imageFile);
        getPredictions("http://localhost:4000/recognition/upload", formData);
    }

    function getPredictions(url, option) {
        axios.post(url, option)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <div className="preview">
            {imageFile && <img id="preview-img" src={URL.createObjectURL(imageFile)} alt="uploaded" />}
            <div>
                <Link to="/"><button>Cancel</button></Link>
                <button onClick={handleConfirm}>Confirm</button>
            </div>
        </div>
    );
}

export default Preview;