module.exports = app => {
    const reservations = require("../controllers/reservationController");
    const router = require("express").Router();

    router.post("/", reservations.create);
    router.get("/active/:renterId", reservations.getActive);
    router.get("/:renterId", reservations.getAllByUser);

}