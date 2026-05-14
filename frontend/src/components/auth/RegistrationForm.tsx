import { create } from "@github/webauthn-json/browser-ponyfill";
import { useState } from "react";
import { useFinishRegistration, useStartRegistration } from "../../api/generated";
import { prepareCreationOptions } from "./function/transformAuthResult";
import { Link } from "@tanstack/react-router";
import { resolveMutateResult } from "../../util/resolveMutateResult";

export const RegistrationForm = () => {

  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const { resolveMutateAsync: startRegistration } = resolveMutateResult(useStartRegistration());
  
  const { resolveMutateAsync: finishRegistration } = resolveMutateResult(useFinishRegistration());

  const processRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    if (!username) return;

    try {
      setStatus('loading');
      const startResult = await startRegistration({params: {username}});
      const creationOptions = prepareCreationOptions(startResult.data || {});

      const credential = await create({
        publicKey: creationOptions.publicKey,
      });

      await finishRegistration({data: {username: username, responseJson: JSON.stringify(credential)}});

      setStatus('success');
      setMessage('Registration Successful!');


    } catch (error) {

      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unknown error');
    }

  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          We use Passkeys for a secure, passwordless experience.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={(e) => {
          void processRegistration(e);
        }}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-out-allowed"
            >
              {status === 'loading' ? 'Registering...' : 'Register with Passkey'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-md text-sm ${
            status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
