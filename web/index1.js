const express = require("express");

// Initialize Router
const router = express.Router();

// Import Html Pages


router.get("/newUser", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

module.exports = router;
