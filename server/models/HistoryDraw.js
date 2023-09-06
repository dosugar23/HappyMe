const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    name: {
        type: String
    },
    date: {
        type: String
    },
    money: {
        type : String
    },
    idUser: {
        type : String
      },
    account: {
        type: String
    },
    bank: {
        type: String
    }
});

const HistoryDraw = mongoose.model('HistoryDraw', historySchema);

module.exports = HistoryDraw;