
     import React, { useState } from 'react';
     import { create, get } from '@github/webauthn-json';

     // 1. 요소에 대한 타입 정의
interface CredentialDescriptor {
  id: BufferSource;
  type: PublicKeyCredentialType;
  transports?: AuthenticatorTransport[]; // 이 부분이 핵심
}

    
     const AuthTest: React.FC = () => {
       const [username, setUsername] = useState('');
       const [status, setStatus] = useState('');
       const [jwt, setJwt] = useState('');
    
       // 1. REGISTRATION FLOW
       const handleRegister = async () => {
         try {
           setStatus('Fetching registration options...');
    
           // Get options from backend
           const optionsRes = await fetch(`/api/auth/register/options?username=${username}`, { method: 'POST' });
           const creationOptions = await optionsRes.json();
    
           setStatus('Waiting for device (Biometrics/Security Key)...');
    
          // --- FIX STARTS HERE ---
          // If the backend sent extensions (like appidExclude), remove them 
          // to avoid the "not a valid URL" error in the browser.
          if (creationOptions.extensions) {
            delete creationOptions.extensions;
          }
          // --- FIX ENDS HERE ---
    
          setStatus('Waiting for device...');
   
          const credential = await create({
            publicKey: creationOptions
          });
    
           // Send response back to finish registration
           const finishRes = await fetch(`/api/auth/register/finish?username=${username}`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(credential),
           });
    
           if (finishRes.ok) {
             setStatus('Registration Successful!');
           } else {
             setStatus('Registration Failed at Server.');
           }
         } catch (err) {

           setStatus(`Error: ${err}`);
         }
       };
    
       // 2. LOGIN FLOW
   const handleLogin = async () => {
     try {
       setStatus('Fetching login options...');
       const optionsRes = await fetch(`/api/auth/login/options?username=${username}`, { method: 'POST' });
       const assertionOptions = await optionsRes.json();

       // 1. Extract the options
       const publicKeyOptions = assertionOptions.publicKeyCredentialRequestOptions;

       // 2. --- FIX: Sanitize 'transports' in allowCredentials ---
       if (publicKeyOptions.allowCredentials) {
         publicKeyOptions.allowCredentials = publicKeyOptions.allowCredentials.map((cred: CredentialDescriptor) => {
           // If transports is missing, null, or not an array, delete it so the browser uses defaults
           if (!cred.transports || !Array.isArray(cred.transports)) {
             delete cred.transports;
           }
           return cred;
         });
       }

       // 3. Keep your previous fix for extensions
       if (publicKeyOptions.extensions) {
         delete publicKeyOptions.extensions;
       }

       setStatus('Waiting for device...');

       // 4. Call the browser API
       const assertion = await get({
         publicKey: publicKeyOptions
       });

       setStatus('Verifying with server...');
       const finishRes = await fetch(`/api/auth/login/finish?username=${username}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(assertion),
       });

       if (finishRes.ok) {
         const token = await finishRes.text();
         setJwt(token);
         setStatus('Login Successful!');
       } else {
         setStatus('Login Failed.');
       }
     } catch (err) {
       setStatus(`Error: ${err}`);
     }
   };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget: EventTarget & HTMLInputElement = e.target
    setUsername(eventTarget.value);
  };
    
       return (
         <div style={{ padding: '20px' }}>
           <h1>WebAuthn Test Page</h1>
           <div>
             <input
               type="text"
               placeholder="Enter Username"
               value={username}
              onChange={handleUsernameChange}
             />
           </div>
           <div style={{ marginTop: '10px' }}>
             <button onClick={handleRegister}>Register (Signup)</button>
             <button onClick={handleLogin} style={{ marginLeft: '10px' }}>Login</button>
           </div>
    
           <hr />
           <p><strong>Status:</strong> {status}</p>
           {jwt && (
             <div>
              <p><strong>JWT Token:</strong></p>
              <textarea readOnly value={jwt} style={{ width: '100%', height: '100px' }} />
            </div>
          )}
        </div>
      );
    };
   
    export default AuthTest