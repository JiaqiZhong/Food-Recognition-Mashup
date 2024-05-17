const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

router.get('/find-recipes/:ingredients', async (req, res) => {
    const options = createFindRecipeByIngredientsOptions(req.params.ingredients)
    const url = `https://${options.hostname}${options.path}${options.parameters}`;

    await axios.get(url)
    .then((response) => {
        const results = response.data;
        res.send(results);
    })
    .catch((error) => {
        console.error(error);
    })
});

router.get('/:recipeID', async (req, res) => {
    const options = createRecipeDetailsOptions(req.params.recipeID)
    const url = `https://${options.hostname}${options.path}${options.parameters}`;

    await axios.get(url)
    .then((response) => {
        const results = response.data;
        res.send(results);
    })
    .catch((error) => {
        console.error(error);
    })
})

function createFindRecipeByIngredientsOptions(ingredients) {
    const options = {
        hostname: 'api.spoonacular.com',
        path: '/recipes/findByIngredients',
        parameters: 
            '?apiKey=' + process.env.SPOONACULAR_KEY +
            '&ingredients=' + ingredients +
            '&number=3'
    }
    return options;
}

function createRecipeDetailsOptions(recipeID) {
    const options = {
        hostname: 'api.spoonacular.com',
        path: '/recipes/' + recipeID + '/information',
        parameters: 
            '?apiKey=' + process.env.SPOONACULAR_KEY +
            '&includeNutrition=true'
    }
    return options;
}

module.exports = router;
    