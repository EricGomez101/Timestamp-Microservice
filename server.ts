import { type } from "os";

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const types = {DATE: 'DATE', UNIX: 'UNIX', NULL: 'NULL', ERROR: 'ERROR'};

app.get('/', (req, res) => {
  res.json({'message': 'hello world'});
});

const middleware = (req, res, next) => {
  const { DATE, UNIX, NULL, ERROR } = types;
  const dateString = req.params.dateString;

  if (dateString === undefined) {
    req.type = NULL;
    
    next()
  }

  if (/\w{4}-\w+-\w+/.test(dateString)) req.type = DATE;
  
  else if (/\d{3,}/.test(dateString)) req.type = UNIX;

  else req.type = ERROR;

  next();
};

app.get('/api/timestamp/:dateString?', middleware, (req, res) => {
  const { DATE, UNIX, ERROR } = types;
  const dateString = req.params.dateString;
  let type = req.type;

  let date = type === UNIX ? new Date(Number(dateString)) : type === DATE ? new Date(dateString) : new Date();
  
  const time = date.getTime();
  const utcString = date.toUTCString();

  let message: { unix: number; utc: string } | { error: string } = {"unix": time, "utc": utcString};

  if ( type === ERROR ) message = {"error": "Invalid Date"};

  res.json(message);
});

app.listen(port);
