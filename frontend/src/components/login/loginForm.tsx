import { useState } from "react";
import { prepareLoginOptions } from "./transformLoginResultParam";
import { useNavigate } from "@tanstack/react-router";
import { useLoginData } from "../../hooks/auth/UseLoginData";
import { useFinishLoginData } from "../../hooks/auth/UseFinishLoginData";
import type { LoginResponse } from "../../api/model";
import { get } from "@github/webauthn-json/browser-ponyfill";


export const LoginForm: React.FC= () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate()
  const { mutateAsync: startLoginProcess } = useLoginData();
  const {mutateAsync: finishLoginProcess} = useFinishLoginData();

  const handleLoginStart = async () => {

      try {
        const { data: loginOptions } = await startLoginProcess({params: {username}}); 

        const requestOptions = prepareLoginOptions(loginOptions ?? {} as LoginResponse);
        const assertion = await get({ publicKey: requestOptions });       

        return assertion
  
      } catch (error) {
        alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
   }

   const handleLoginFinish = async (assertion: any) =>{

      const dataResult = await finishLoginProcess(
          {username,
            jsonparam: JSON.stringify(assertion)
          }
        );

      const finishResult = dataResult.data
      const loginSuccess = dataResult.success

       alert(`result: ${finishResult} and success? ${loginSuccess}`)
 
        if(finishResult && loginSuccess){
          localStorage.setItem('accessToken', finishResult);
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
                  await handleLoginFinish(loginFinishParam)
                }

              }

              void login()

             }} style={{ marginLeft: '10px' }}>Login</button>
           </div>
        </div>
      );


}
export default LoginForm;