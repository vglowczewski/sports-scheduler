//models/Event.js 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  type: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  location: { 
    type: String, 
    required: false },
  league: { 
      type: Schema.Types.ObjectId, 
      required: true,
      ref: 'League' },
  opponent: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: false,
    },
  notes: { 
    type: String, 
    required: false}
});

module.exports = mongoose.model('Event', eventSchema);
