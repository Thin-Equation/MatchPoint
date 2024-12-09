import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(
        <Auth0Provider
        domain="dev-0jzyevoto3y0pe6j.us.auth0.com"
        clientId="PjRnjlmpxpmTW11SJjipBQsWbFTOQsSt"
        authorizationParams={{
            redirect_uri: window.location.origin + "/upload",
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
    >
        <App />
    </Auth0Provider>,
);
}