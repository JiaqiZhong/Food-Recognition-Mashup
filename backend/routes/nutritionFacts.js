const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

router.get('/:ingr', async (req, res) => {
    const options = createNutritionOptions(req.params.ingr)
    const url = `https://${options.hostname}${options.path}${options.parameters}`;

    await axios.get(url)
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

function createNutritionOptions(ingr) {
    const options = {
        hostname: 'api.edamam.com',
        path: '/api/nutrition-data',
        parameters: 
            '?app_id=' + process.env.NUTRITION_APP_ID +
            '&app_key=' + process.env.NUTRITION_KEY+
            '&nutrition-type=logging' +
            '&ingr=' + ingr
    }
    return options;
}

module.exports = router;