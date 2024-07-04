const mongoose = require('mongoose');
const moment = require("moment");
const book=require("./book")



const usersSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: [true, "Please enter your name!"],
        maxLength: [15, "Name must be less than 15 characters"],
    },
    Password: {
        type: String,
        validate: {
            validator: function (v) {
                const specialCharacter = /[!@#$%^&*()\-_=+{};:'",<.>/?[\]\\]/;
                const uppercase = /[A-Z]/;
                const lowercase = /[a-z]/;
                const numbercase = /[0-9]/;
                return (
                    specialCharacter.test(v) &&
                    uppercase.test(v) &&
                    lowercase.test(v) &&
                    numbercase.test(v)
                );  
            },
            message: props =>{
              if (props.value.length < 8) {
                return(  `Password must be at least 8 characters long`);
            } else { 
              return(`${props.value} does not meet the password requirements`)
            }
        },
    },
  },
    email: {
        type: String,
        required: [true, "Please enter your email!"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Please enter a phone number!"],
        trim: true,
        validate: {
            validator: function (v) {
                return /^(?:\+31|0)(?:\d[\s-]?){8,10}\d$/.test(v); 
            },
            message: props => `${props.value} is not a valid Dutch phone number!`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: function (createdAt) {
            return moment(createdAt).format("MMMM Do YYYY ");
        },
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        get: function (createdAt) {
            return moment(createdAt).format("MMMM Do YYYY ");
        },
    },
    IPAddress: {
        type: [String],
        /*validate: {
            validator: function (v) {
                const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}$|:^:(:[0-9a-fA-F]{1,4}){1,7}$|^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$|localhost$|localhost\.localdomain$|localhost\.local$|loc$^/;
                return ipAddressRegex.test(v);
            },
            message: props => `${props.value} is not a valid IP address!`
          }*/
    },
    isValid: { type: Boolean, default: false },
    emailtoken: { type: String },
    books:[{ type: mongoose.Schema.Types.ObjectId, ref: 'books' }],
    userinfo:[{ type: mongoose.Schema.Types.ObjectId, ref: 'userinfo' }]
});

const users = mongoose.model('users', usersSchema);

module.exports = users;