const mongoose = require('mongoose');

const PayementSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopProfile', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['review', 'accepted', 'rejected'], default: 'review' },
    invoicePath: String,
    periods : [
        {
            month : {type: Number, required: true },
            year : {type: Number, required: true}
        }
    ],
    
    charges: [
        {
            charge: { type: mongoose.Schema.Types.ObjectId, ref: 'Charge', required: true },
            amount: { type: Number, required: true },
            proofFiles: [
                {
                    filename: String,
                    originalName: String,
                    mimetype: String,
                    path: String,
                    uploadedAt: { type: Date, default: Date.now }
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Payement', PayementSchema);