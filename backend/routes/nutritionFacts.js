const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

router.get('/:ingr', async (req, res) => {
    const options = createNutritionOptions(req.params.ingr)
    const url = `https://${options.hostname}${options.path}${options.parameters}`;

    axios.get(url)
    .then((response) => {
        const nutritionFacts = response.data.totalNutrientsKCal;
        const result = {
            energy: nutritionFacts.ENERC_KCAL,
            protein: nutritionFacts.PROCNT_KCAL,
            fat: nutritionFacts.FAT_KCAL,
            carbohydrates: nutritionFacts.CHOCDF_KCAL
        }
        res.send(result);
    })
    .catch((error) => {
        console.error(error);
    })
});

const edamamNutrition = {
    nutrition_type: 'logging',
    app_id: process.env.NUTRITION_APP_ID,
    app_key: process.env.NUTRITION_KEY
}

function createNutritionOptions(ingr) {
    const options = {
        hostname: 'api.edamam.com',
        path: '/api/nutrition-data',
        parameters: 
            '?app_id=' + edamamNutrition.app_id +
            '&app_key=' + edamamNutrition.app_key +
            '&nutrition-type=' + edamamNutrition.nutrition_type +
            '&ingr=' + ingr
    }
    return options;
}

module.exports = router;