const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    members: {
        type: Array,
        required: true,
    },
    name: {
        type: String
    },
    isSendProposal: {
        type: String
    },
    idJob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;