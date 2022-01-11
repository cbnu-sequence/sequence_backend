const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const { notFound, errorHandler } = require("./errors/handler");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const session = require('express-session');
const {
   SESSION_SECRET,
   IS_PRODUCTION,
} = require('./configs')



app.use(
   process.env.NODE_ENV === "dev" ? morgan("dev") : morgan("combined")
);
app.use(
   session({
      name: "session.sid",
      resave: false,
      saveUninitialized: false,
      secret: SESSION_SECRET,
      cookie: {
         secure: false,
         maxAge: 1000 * 60 * 60 * 24,
      }
   })
)

app.use(bodyParser.json())
app.use('/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);
module.exports = app;
