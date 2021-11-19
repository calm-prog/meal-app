const express = require("express");
const router = express.Router();

const reservations = require("../data/reservations.json");

router.get("/", async(request, response) => {
    try {
        response.statusCode = 200;
        response.json(reservations);
    } catch (error) {
        throw error;
    }
});

router.get('/:id', async(request, response) => {
    try {
        response.statusCode = 200;
        let id = parseInt(request.params.id, 10);
        console.log(id);
        let reservationWithId = reservations.find(reservation => reservation.id === id);
        response.json(reservationWithId);
    } catch (error) {
        throw error;
    }
});

module.exports = router;