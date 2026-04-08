import { useState } from "react";
import { useFinishLogin, useStartLogin } from "../../api/generated";
import { prepareLoginOptions } from "./transformLoginResultParam";
import { useNavigate } from "react-router-dom";


export const LoginForm: React.FC= () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate()
  const { mutateAsync: startLoginProcess } = useStartLogin();

  const {mutateAsync: finishLoginProcess} = useFinishLogin();

  const handleLogin = async () => {

      try {
      const loginOptions = await startLoginProcess({params: {username}}); 
      const requestOptions = prepareLoginOptions(loginOptions);
      const assertion = await navigator.credentials.get({ publicKey: requestOptions });       
      
      const accessToken = await finishLoginProcess({data: JSON.stringify(assertion), params: {username}});
      localStorage.setItem('accessToken', accessToken);
      navigate('/home');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please try again.');
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
             <button onClick={handleLogin} style={{ marginLeft: '10px' }}>Login</button>
           </div>
        </div>
      );


}
export default LoginForm;