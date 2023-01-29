const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  });

const app = require('./app');

console.log(app.get('env')); //development (or production)
// console.log(process.env); //environment variables

const tourSchema = new mongoose.Schema({
  //schema
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //validator
    unique: true, //unique: true, csak egy tour lehet egy name-el
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema); //model

const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.7,
  price: 997,
});

// testTour
//   .save()
//   .then((doc) => {
//     //save to database
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR: ', err);
//   });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
