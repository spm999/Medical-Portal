const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rout=require('./router.js');

const app = express();

app.use(rout);
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Handle preflight requests
    if ('OPTIONS' === req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  });

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

/////////////////////////////////////////////////////////////////////////

const Doctor = require('./routes/doctorRoute.js');
app.use('/doctor', Doctor);

const Patient=require('./routes/patientRoute.js');
app.use('/patient', Patient);

// /////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});