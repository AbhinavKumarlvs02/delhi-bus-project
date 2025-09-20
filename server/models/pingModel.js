const mongoose = require("mongoose");

const PingSchema = new mongoose.Schema({
    busId: {type: mongoose.Schema.Types.ObjectId, ref: 'Bus' , index : true},
    busNumber: { type: String , index:true },
    ts: { type: Date , index: true },
    loc: { 
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    speed: { type:Number , default: 0 },
    from: String,
    seq: Number,
    raw: String
} , {timestamps: true});

PingSchema.index({loc : "2dsphere"});

module.exports = mongoose.model("Ping" , PingSchema);