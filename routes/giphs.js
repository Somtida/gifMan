'use strict';

let express = require('express');

let router = express.Router();
let request = require('request');


router.get('/', (req, res) => {
	request(`http://api.giphy.com/v1/gifs/search?q=cat&api_key=dc6zaTOxFJmzC`, function(err, response, body) {
		if(err) return res.status(400).send(err);
		res.send(body);
	})
})

module.exports = router;