const mongoose = require('mongoose');

const url = `mongodb+srv://upwork:upwork@cluster0.wyevki8.mongodb.net/`;

mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB')).catch((e)=> console.log('Error', e))