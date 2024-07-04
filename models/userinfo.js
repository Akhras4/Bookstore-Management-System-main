const mongoose = require('mongoose');

const userinfoSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    aboutyou: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }
   
});

const userinfo = mongoose.model('userinf', userinfoSchema);

module.exports = userinfo