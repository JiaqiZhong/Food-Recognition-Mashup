const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

router.get('/:ingredients', async (req, res) => {
    const options = createRecipesOptions(req.params.ingredients)
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

function createRecipesOptions(ingredients) {
    const options = {
        hostname: 'api.spoonacular.com',
        path: '/recipes/findByIngredients',
        parameters: 
            '?apiKey=' + process.env.SPOONACULAR_KEY +
            '&ingredients=' + ingredients +
            '&number=9'
    }
    return options;
}

module.exports = router;
    