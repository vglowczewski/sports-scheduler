
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    season: { type: String, required: true }
});

module.exports = mongoose.model('League', leagueSchema);
