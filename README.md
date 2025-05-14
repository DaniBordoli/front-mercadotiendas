# MercadoTiendas

Last updated: 2025-05-13 Frontend

Frontend de la aplicación MercadoTiendas, desarrollada con React y TypeScript.

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm test`: Ejecuta los tests
- `npm run build`: Genera el build de producción

## Deployment

This project is automatically deployed to Vercel. Any changes pushed to the main branch will trigger a new deployment.

## Environment Variables

This application requires the following environment variables:

```
# API URL
REACT_APP_API_URL=https://back-mercadotiendas.onrender.com/api

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Authentication

### Google Authentication
The application supports authentication through Google accounts:
- Users with verified emails in Firebase are automatically activated
- Users with unverified emails will receive an activation code

### Account Activation
- New users receive an activation code via email upon registration
- The activation status is preserved between sessions
- Users must activate their account before accessing the platform

### Password Recovery Flow
The application includes a password recovery system that works as follows:

1. User requests password reset on the login page
2. User enters their email address
3. Backend sends a recovery email with a token
4. User clicks the link in the email and is directed to the password reset page
5. User enters a new password
6. Password is updated in the system

For this flow to work in production, the backend needs the following environment variables:

```
# Frontend URL for recovery links
FRONTEND_URL=https://front-mercadotiendas.vercel.app

# Email Service Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
