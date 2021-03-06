'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes
app.get('/', function(req, res) {
	res.send("Stratified United <3")
})

let token = "EAAHoNadubg4BABBT1uq8p8ZCbdroRv8513kyqkyKwEdSXFX1Ri68FOrf088FrAZAh3E9MfxA37ukdv9ZBYyMy9VMo61ALGJ5aOClOBLHT0QEB3Lot1H2WzBmxO1O7LyjZBe3hlzB4sLkdutViZCOlUln7WdZBXUoIZADCYVaT0Oe9JBW90UREcR"

// Facebook 
app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "Stratified United <3") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.10/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("Server running at port: 5000")
})