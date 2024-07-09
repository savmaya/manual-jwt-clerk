# manual-jwt-clerk
In this tutorial, we'll explore how to use Clerk with Express to authenticate multiple API requests using middleware.

https://www.loom.com/share/3882d2dcb1514874a66a58f97ab05be7?sid=dd071f95-c9ae-4652-95e5-7c08c9eac640

```mkdir server && cd server```

```npm install express cors dotenv @clerk/clerk-sdk-node ```

When they are installed, create a file in your ‘server’ directory called server.js:
```touch server.js```

Then create a .env file in the same directory:
```touch env```

This is where you’re going to store your ```CLERK_PUBLISHABLE_KEY``` & ```CLERK_SECRET_KEY``` You can find this in your dashboard. Because you are building these routes on the backend, you can use your secret key:

Add the following code to ```server.js``` 

```
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}
);
```


- We’re importing the ClerkExpressRequireAuth from the Clerk Node.js SDK
- We’re calling that ClerkExpressRequireAuth middleware within our app.get() function.
-We now have an error-handling middleware function. If an error occurs in any middleware function that is run before this one (here the ClerkExpressRequireAuth), this function will be called. It logs the stack trace of the error and sends a response with the HTTP status code 401, indicating that the client must authenticate to get the requested response, along with the message Unauthenticated!.

If you call this in Postman you’ll get a 401 and this message:
<img width="630" alt="image" src="https://github.com/savmaya/manual-jwt-clerk/assets/100170212/f3444c6f-d275-46ff-bf77-17c800bbc328">
This is safer as we aren’t even sharing the structure of our auth object.

Let's run this: 
```node server.js```
You should now see that message from in your app.listen(…) terminal:
```Example app listening at http://localhost:3000```

Let’s call that endpoint (http://localhost:3000/protected-endpoint) from Postman to see what it returns:
```{
  "sessionClaims": null,
  "sessionId": null,
  "session": null,
  "userId": null,
  "user": null,
  "actor": null,
  "orgId": null,
  "orgRole": null,
  "orgSlug": null,
  "organization": null,
  "claims": null
}
```

ClerkExpressRequireAuth() returns “an empty auth object when unauthenticated.” Now, you have a conundrum—you need an authenticated user to check this really works. To do that, we’ll create a quick React frontend client that calls /protected-endpoint after authenticating a user.

If we now call this within our React app , we do get our auth object because we are authenticated:
```{
  "sessionClaims": {
    "azp": "http://localhost:5173",
    "exp": 1720558905,
    "iat": 1720558845,
    "iss": "https://boss-squid-85.clerk.accounts.dev",
    "nbf": 1720558835,
    "sid": "sess_2j1ZjdrAVrALRRTkn8ZFXHDQ7Qy",
    "sub": "user_2iQUovqEkfcRDScQrXvAIfGQgUn"
  },
  "sessionId": "sess_2j1ZjdrAVrALRRTkn8ZFXHDQ7Qy",
  "userId": "user_2iQUovqEkfcRDScQrXvAIfGQgUn",
  "claims": {
    "azp": "http://localhost:5173",
    "exp": 1720558905,
    "iat": 1720558845,
    "iss": "https://boss-squid-85.clerk.accounts.dev",
    "nbf": 1720558835,
    "sid": "sess_2j1ZjdrAVrALRRTkn8ZFXHDQ7Qy",
    "sub": "user_2iQUovqEkfcRDScQrXvAIfGQgUn"
  }
}

```
Now we will create a react app: 
```npm install create-react-app```
```npx create-react-app frontend```

More details here: https://clerk.com/docs/quickstarts/react

Again, we’re going to add Clerk to this project, this time using@clerk/clerk-react, which is the Clerk React SDK. Like with the backend, you are going to need your Clerk API key. This time though you are going to use your public key as we’re authorizing a frontend client:

Create a .env file and then add that key to it like this: 
```VITE_CLERK_PUBLISHABLE_KEY=example234```

Now go to src/App.tsx remove the boiler plate and add the following: 
```
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

function App() {

  return (
    <div>
      <p>Hello World!</p>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  )
}

export default App
```

In main.tsx add the following: 

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)

```

### Using Clerk with ClerkExpressRequireAuth()
```
import 'dotenv/config' // To read CLERK_API_KEY
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import express from 'express'
import cors from 'cors'
const port = process.env.PORT || 3000

const app = express()
app.use(cors())
// Use the lax middleware that returns an empty auth object when unauthenticated
app.get('/protected-endpoint', ClerkExpressWithAuth(), (req, res) => {
  res.json(req.auth)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```
