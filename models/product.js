const mongoose = require('mongoose')
const { stringify } = require('querystring')
const productSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true

    },
    description : {
        type: String,
        required : true
    },
    category : {
        type: String,
        required : true
    },
    location : {
        type: String,
        required : true
    },
    images : {
        type: String,
        required : true
    },
    asking_price : {
        type: String,
        required : true
    },
    date : {
        type : Date,
        default: Date.now

    },
    delivery_type : {
        type: String,
        required : true
    },
    name : {
        type: String,
        required: true
    },
    phone_number : {
        type: String,
        required : true
    }


});
const user = mongoose.model('Product', productSchema);