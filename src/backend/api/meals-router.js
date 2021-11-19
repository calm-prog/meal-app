const express = require("express");
const { parse } = require("superagent");
const router = express.Router();

const meals = require("../data/meals.json");

router.get("/", async(request, response) => {
    try {
        const { maxPrice, title, createdAfter, limit } = request.query;

        let data = meals; 
        //maxPrice
        if (maxPrice) {
            if (parseInt(maxPrice) > 0) {
                const mealsWithMaxprice = data.filter(meal => meal.price < parseInt(maxPrice));
                data = mealsWithMaxprice
            } else {
                response.statusCode = 400;
                response.send("Oops! wrong query!");
                return
            }

            //searchTitle
        } else if (title) {
            if (encodeURI(title)) {
                const mealsWithTitle = data.filter(meal => encodeURI(meal.title).toLowerCase().includes(encodeURI(title).toLowerCase()));
                data = mealsWithTitle
            } else {
                response.statusCode = 400;
                response.send("Oops! wrong query!");
                return
            }

            //createdAfter
        } else if (createdAfter) {
            if (Date.parse(createdAfter)) {
                const mealsCreatedAfter = data.filter(meal => Date.parse(meal.createdAt) > Date.parse(createdAfter));
                data = mealsCreatedAfter
            } else {
                response.statusCode = 400;
                response.send("Oops! wrong query!");
                return
            }

            //limit
        } else if (limit) {
            if (parseInt(limit) <= meals.length) {
                const expectedNumberOfMeals = data.slice(0, parseInt(limit));
                data = expectedNumberOfMeals
            } else if (parseInt(limit) > meals.length) {
                response.send("Number of meals are fewer than given limit!")
                return
            } else {
                response.statusCode = 400;
                response.send("Oops! wrong query!");
                return
            }
            //meals
        } else {
            console.log("in /api/meals");
            response.json(meals);
            return
        }

        response.json(data)
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