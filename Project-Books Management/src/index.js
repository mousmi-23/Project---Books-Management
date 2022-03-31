const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const app = express();
const mongoose=require("mongoose")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://sonu517825:m0ww1dng9uqrz0ge@cluster0.wgtiy.mongodb.net/group8Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( (pass) => console.log(`MongoDb is connected , Database Name "${pass.connections[0].name}"`))
.catch ( err => console.log(err.message))


app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
