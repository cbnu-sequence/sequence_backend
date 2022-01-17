const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
   path: path.join(__dirname, '.env')
})

const app = require('./app');
const {
   PORT,
   DATABASE_CONNECTION_STRINGS
} = require('./configs')

mongoose.connect(DATABASE_CONNECTION_STRINGS, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(()=> {
   console.log('Database Connected!');
});

app.listen(PORT, ()=>{
   console.log(`server started listening on port ${PORT}...`)
})
