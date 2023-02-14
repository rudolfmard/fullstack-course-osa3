const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to ', url)
mongoose.connect(url)
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		required: true,
		minlength: 8,
		validate: {
			validator: v => {return(v.split('-').length === 2 && (v.split('-')[0].length === 2 || v.split('-')[0].length === 3))},
			message: props => `${props.value} is not a valid phone number`
		}
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)