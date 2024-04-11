//models/Team.js 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const teamSchema = new Schema({
  name: { type: String, required: true },
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League',
  }
});
module.exports = mongoose.model('Team', teamSchema);
