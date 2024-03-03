//models/Event.js 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  type: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: false },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  league: { type: Schema.Types.ObjectId, ref: 'League' },
  notes: { type: String, required: false}
});

module.exports = mongoose.model('Event', eventSchema);
