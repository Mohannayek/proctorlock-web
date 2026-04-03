import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_svPE0qWPt', // Paste your User Pool ID here
      userPoolClientId: '55ib6vn5asf4kmg6sa0idgbamm', // Paste your Client ID here
      loginWith: {
        email: true,
      }
    }
  }
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
