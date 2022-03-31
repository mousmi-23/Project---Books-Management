const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://sonu517825:m0ww1dng9uqrz0ge@cluster0.wgtiy.mongodb.net/group8Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})                                                   //argument=pass, connection name ki key hai//MONGODB IS CONNECTION //SUCCESS RESPONSE ka data return kar rha hai
.then( (path) => console.log(`MongoDb is connected, Database Name ${path.connections[0].name}`))//success jo b argument pass kar rhe hoge uske connection name ki chiz hoti hai usse 0 index pe gye phir uske name pe gye database ke
.catch ( err => console.log(err.message))


app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
