const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cryptoSchema = new Schema({
    name: { type: String, required: true },
    sign: { type: String, required: false },
    icon: { type: String, required: false },
    amount: { type: Number, required: false },
    creator: { type:mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Crypto', cryptoSchema);