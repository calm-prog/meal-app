const express = require("express");
const router = express.Router();

const reviews = require("../data/reviews.json");

router.get("/", async(request, response) => {
    try {
        response.statusCode = 200;
        response.json(reviews);
    } catch (error) {
        throw error;
    }
});

router.get('/:id', async(request, response) => {
    try {
        response.statusCode = 200;
        let id = parseInt(request.params.id, 10);
        console.log(id);
        let reviewWithId = reviews.find(review => review.id === id);
        response.json(reviewWithId);
    } catch (error) {
        throw error;
    }
});

module.exports = router;