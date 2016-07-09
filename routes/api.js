'use strict';


const express = require('express');



let router = express.Router();


router.use('/users', require('./users'));
router.use('/giphs', require('./giphs'));



module.exports = router;  