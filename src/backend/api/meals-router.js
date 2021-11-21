const express = require("express");
const { parse } = require("superagent");
const router = express.Router();

const meals = require("../data/meals.json");

router.get("/", async(request, response) => {
    try {
        if(Object.keys(request.query).length) {
            let data = meals; 
            for(const property in request.query) {
                const currentValue = request.query[property]
                if (property === "maxPrice") {
                    if (parseInt(currentValue) > 0) {
                        const mealsWithMaxprice = data.filter(meal => meal.price < parseInt(currentValue));
                        data = mealsWithMaxprice
                    } else {
                        response.statusCode = 400;
                        response.send("Oops! wrong query!");
                        return
                    }
        
                    //searchTitle
                } else if (property === "title") {
                    if (encodeURI(currentValue)) {
                        const mealsWithTitle = data.filter(meal => encodeURI(meal.title).toLowerCase().includes(encodeURI(currentValue).toLowerCase()));
                        data = mealsWithTitle
                    } else {
                        response.statusCode = 400;
                        response.send("Oops! wrong query!");
                        return
                    }
        
                    //createdAfter
                } else if (property === "createdAfter") {
                    if (Date.parse(currentValue)) {
                        const mealsCreatedAfter = data.filter(meal => Date.parse(meal.createdAt) > Date.parse(currentValue));
                        data = mealsCreatedAfter
                    } else {
                        response.statusCode = 400;
                        response.send("Oops! wrong query!");
                        return
                    }
        
                    //limit
                } else if (property === "limit") {
                    if (parseInt(currentValue) <= meals.length) {
                        const expectedNumberOfMeals = data.slice(0, parseInt(currentValue));
                        data = expectedNumberOfMeals
                    } else if (parseInt(currentValue) > meals.length) {
                        response.send("Number of meals are fewer than given limit!")
                        return
                    } else {
                        response.statusCode = 400;
                        response.send("Oops! wrong query!");
                        return
                    }

                }
            }
            response.json(data)
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