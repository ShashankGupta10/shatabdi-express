const express = require("express");
const router = express.Router();

// Importing routes
const authRoutes = require("./auth");
/* 
    Import all routes above this from the routes folder
    and use them as middleware
*/
router.use("/auth", authRoutes);
/*
    Use all routes above this from the routes folder
    and use them as middleware
*/

module.exports = router;