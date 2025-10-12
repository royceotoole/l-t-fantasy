'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Connect to Yahoo Fantasy
          </h1>
          <p className="text-gray-600">
            Sign in with your Yahoo account to access your fantasy league data
          </p>
        </div>

        <button
          onClick={() => signIn('yahoo')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          Sign in with Yahoo
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have a Yahoo account?{' '}
            <a 
              href="https://login.yahoo.com/account/create" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
