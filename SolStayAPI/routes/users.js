
module.exports = app => {
    const users = require("../controllers/userController");
    const router = require("express").Router();

    router.post("/", users.create);
    //router.get("/:pubkey", users.getUser);
    //router.update("/:pubkey", users.update);
}