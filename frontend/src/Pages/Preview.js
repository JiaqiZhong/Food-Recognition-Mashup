import React from "react";
import { useLocation } from 'react-router-dom';

function Preview() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const image = searchParams.get('image');

    return (
        <div>
            <h1>Preview</h1>
            {image && <img src={decodeURIComponent(image)} alt="Uploaded" />}
        </div>
    );
}

export default Preview;