const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(app.get('env')); //development (or production)
// console.log(process.env); //environment variables

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
