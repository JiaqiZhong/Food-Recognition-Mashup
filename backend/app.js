const express = require('express');
const port = 4000;
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Routers
const clarifaiRouter = require('./routes/clarifai')
const nutritionFactsRouter = require('./routes/nutritionFacts')
const recipesRouter = require('./routes/recipes');

const app = express();

const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://food-lens-client.vercel.app' // For production
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors());
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({ Page: "Backend for FoodLens" })
});

// Routers
app.use('/recognition', clarifaiRouter);
app.use('/nutrition-facts', nutritionFactsRouter);
app.use('/recipes', recipesRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;