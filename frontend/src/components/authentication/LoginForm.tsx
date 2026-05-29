import { useNavigate } from "@tanstack/react-router";
import type { LoginResponse } from "../../api/model";
import { get, type AuthenticationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill";
import { prepareLoginOptions } from "../../services/authentication/transformLoginResultParam";
import { useFinishLogin, useStartLogin } from "../../api/generated";
import { resolveMutateResult } from "../../utils/resolveMutateResult";
import { startLoginParamsSchema } from "../../api/zod/startLoginParams.zod";
import { finishLoginParamsSchema } from "../../api/zod/finishLoginParams.zod";
import { useAuthStore } from "../../hooks/authentication/authStore";
import { getJwtExpiration } from "../../utils/jwt";
import { useState } from "react";


export const LoginForm: React.FC= () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login);
  const {resolveMutateAsync: startLoginProcess } = resolveMutateResult(useStartLogin());
  const {resolveMutateAsync: finishLoginProcess} = resolveMutateResult(useFinishLogin());

  const handleLoginStart = async () => {

     try {
       const { data: loginOptions } = await startLoginProcess({params: {username}}, startLoginParamsSchema); 

       const requestOptions = prepareLoginOptions(loginOptions ?? {} as LoginResponse);
       const assertion = await get({ publicKey: requestOptions });       

       return assertion

     } catch (error) {
       alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
     }
  }

  const handleLoginFinish = async (assertion: AuthenticationPublicKeyCredential) =>{

     const dataResult = await finishLoginProcess({data: JSON.stringify(assertion), params: {username}}, finishLoginParamsSchema);

     // Assuming the backend now returns an object with accessToken and refreshToken
     // even if the generated type still says string.
     const finishResult = dataResult.data as unknown as { accessToken: string; refreshToken: string };
     const loginSuccess = dataResult.success
 
        if(finishResult && loginSuccess){
          localStorage.setItem('accessToken', finishResult.accessToken);
          localStorage.setItem('refreshToken', finishResult.refreshToken);
          localStorage.setItem('userName', username);
          const expiry = getJwtExpiration(finishResult.accessToken);
          login(username, expiry, finishResult.refreshToken);
          void navigate({ to: '/home' });
        }
   }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget: EventTarget & HTMLInputElement = e.target
    setUsername(eventTarget.value);
  };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              We use Passkeys for a secure, passwordless experience.
            </p>
          </div>    
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm" style={{ padding: '20px' }}>
            <input
               type="text"
               placeholder="Enter Username"
               value={username}
               onChange={handleUsernameChange}
             />
          </div>
          <div style={{ marginTop: '10px' }}>
             <button onClick={() =>{
              
              const login = async() => {
               
                const loginFinishParam = await handleLoginStart();
                
                if (loginFinishParam) {
                  await handleLoginFinish(loginFinishParam);
                }

              }

              void login()

             }} style={{ marginLeft: '10px' }}>Login</button>
           </div>
        </div>
      );


}
export default LoginForm;

