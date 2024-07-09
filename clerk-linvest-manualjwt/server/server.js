import 'dotenv/config'; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import cors from 'cors';
import axios from 'axios';
const port = process.env.PORT || 3000;

const app = express()
app.use(cors())
// Use the lax middleware that returns an empty auth object when unauthenticated
app.get('/protected-endpoint', ClerkExpressRequireAuth(), (req, res) => {
  res.json(req.auth);
}
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
}
);

app.get('/', function (req, res) {
  res.send('Hello World!');
}
);

app.get('/', function (req, res) {
  res.send('Hello World2!');
}
);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${3001}`);
}
);
