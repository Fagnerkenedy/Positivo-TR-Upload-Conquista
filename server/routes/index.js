const express = require("express");
const router = express.Router();

// Controllers
const indexController = require("../controller/indexController.js"),
  uploadController = require("../controller/uploadController"),
  registryController = require("../controller/registryController.js"),
  overviewController = require("../controller/overviewController.js");

// Define routes
router.get("/", indexController.index);

// Modules
// router.get("/module/accounts/:id", accountsController.show);
// router.get("/module/deals/:id", dealsController.show);

// Registry
router.get("/registry/:dealsId", registryController.show);

// Overview
router.get("/overview/:dealsId", overviewController.show);

// Upload file
router.post("/upload/", uploadController.uploadFile);
router.put("/upload/", uploadController.put);

module.exports = router;
