import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './routes/App.jsx';
import './styles.css';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasClerk = Boolean(clerkKey && clerkKey !== 'your_clerk_publishable_key');

async function render() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  if (hasClerk) {
    const { ClerkProvider } = await import('@clerk/clerk-react');
    root.render(
      <React.StrictMode>
        <ClerkProvider 
          publishableKey={clerkKey} 
          signInUrl="/sign-in" 
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          afterSignUpUrl="/"
          verificationFallbackRedirectUrl="/sign-up/verify-email-address"
        >
          <BrowserRouter>
            <App clerkEnabled={true} />
          </BrowserRouter>
        </ClerkProvider>
      </React.StrictMode>
    );
  } else {
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App clerkEnabled={false} />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}

render();

