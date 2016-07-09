'use strict';

let express = require('express');

let router = express.Router();
let request = require('request');


router.post('/', (req, res) => {
  console.log('the word:',req.body)
	request(`http://api.giphy.com/v1/gifs/search?q=${req.body.word}&api_key=dc6zaTOxFJmzC`, function(err, response, body) {
		if(err) return res.status(400).send(err);
		res.send(body);
	})
})

module.exports = router;