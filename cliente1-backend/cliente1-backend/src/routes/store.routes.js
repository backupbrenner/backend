const express = require("express");
const { getStoreByDomain } = require("../controllers/store.controller");

const router = express.Router();

router.get("/by-domain", getStoreByDomain);

module.exports = router;
