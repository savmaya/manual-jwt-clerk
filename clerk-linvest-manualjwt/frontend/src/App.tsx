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
