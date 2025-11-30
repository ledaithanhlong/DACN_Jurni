import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          appearance={{
            variables: {
              colorPrimary: '#1e3a8a',
              colorText: '#1f2937',
            },
            elements: {
              formButtonPrimary: 'bg-blue-dark hover:bg-blue-dark/90 text-white shadow-md',
              footerActionLink: 'text-orange-accent hover:text-orange-hover',
            }
          }}
        />
      </div>
    </div>
  );
}


