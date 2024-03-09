//models/Team.js 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  school: { type: String, required: true },
  league: { type: Schema.Types.ObjectId, ref: 'League'} //might not need
});

module.exports = mongoose.model('Team', teamSchema);
