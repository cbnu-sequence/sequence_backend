const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const { notFound, errorHandler } = require("./errors/handler");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require("cors");
const MongoDBStore = require('express-mongodb-session')(session);
const {
   SESSION_SECRET, DATABASE_CONNECTION_STRINGS,
} = require('./configs')

app.use(
   process.env.NODE_ENV === "dev" ? morgan("dev") : morgan("combined")
);
app.use(cors({
    origin:"*",
    credential: true
}));

const store = new MongoDBStore({
    uri: DATABASE_CONNECTION_STRINGS,
    collection: 'mySessions'
});

app.use(
   session({
      name: "session.sid",
      resave: false,
      saveUninitialized: false,
      secret: SESSION_SECRET,
       store: store,
      cookie: {
         secure: false,
         maxAge: 10 * 1000 * 60 * 60 * 24,
      }
   })
)

app.use(bodyParser.json())
app.use('/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);
module.exports = app;
