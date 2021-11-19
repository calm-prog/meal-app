const express = require("express");
const { parse } = require("superagent");
const router = express.Router();

const meals = require("../data/meals.json");

router.get("/", async(request, response) => {
    try {
        const { maxPrice, title, createdAfter, limit } = request.query;

        //maxPrice
        if (maxPrice) {
            if (parseInt(maxPrice) > 0) {
                const mealsWithMaxprice = meals.filter(meal => meal.price < parseInt(maxPrice));
                response.json(mealsWithMaxprice);
            } else {
                response.statusCode = 400;
                response.send("Oops! wrong query!");
            }

            //searchTitle
        } else if (title) {
            if (encodeURI(title)) {
                const mealsWithTitle = meals.filter(meal => encodeURI(meal.title).toLowerCase().includes(encodeURI(title).toLowerCase()));
                response.json(mealsWithTitle);
            } else {
                response.statusCode = 400;
                response.send("Oops! wrong query!");
            }

            //createdAfter
        } else if (createdAfter) {
            if (Date.parse(createdAfter)) {
                const mealsCreatedAfter = meals.filter(meal => Date.parse(meal.createdAt) > Date.parse(createdAfter));
                response.json(mealsCreatedAfter);
            } else {
                response.statusCode = 400;
                response.send("Oops! wrong query!");
            }

            //limit
        } else if (limit) {
            if (parseInt(limit) <= meals.length) {
                const expectedNumberOfMeals = meals.slice(0, parseInt(limit));
                response.json(expectedNumberOfMeals);
            } else if (parseInt(limit) > meals.length) {
                response.send("Number of meals are fewer than given limit!")
            } else {
                response.statusCode = 400;
                response.send("Oops! wrong query!");
            }
            //meals
        } else {

            console.log("in /api/meals");
            response.json(meals);
        }
    } catch (error) {
        throw error;
    }
});

router.get('/:id', async(request, response) => {
    try {
        let id = parseInt(request.params.id, 10);
        console.log(id);
        const mealWithId = meals.find(meal => meal.id === id);
        const mealWithoutId = {};
        if (mealWithId) {

            response.json(mealWithId);
        } else if (id > meals.length) {

            response.json(mealWithoutId);
        } else {
            response.statusCode = 400;
            response.json({});
        }
    } catch (error) {
        throw error;
    }
});

module.exports = router;