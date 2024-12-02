import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const user_pool_id = process.env.REACT_APP_USER_POOL_ID;
const client_id = process.env.REACT_APP_CLIENT_ID

const poolData = {
    UserPoolId: {user_pool_id}, // Replace with your Cognito User Pool ID
    ClientId: {client_id}, // Replace with your App Client ID
};

const userPool = new CognitoUserPool(poolData);

export const login = (username, password) =>
    new Promise((resolve, reject) => {
        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
        });

        const user = new CognitoUser({
            Username: username,
            Pool: userPool,
        });

        user.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const idToken = result.getIdToken().getJwtToken();
                resolve(idToken);
            },
            onFailure: (err) => reject(err),
        });
    });
