import {
    AuthenticationDetails,
    CognitoRefreshToken,
    CognitoUser,
    CognitoUserPool,
} from 'amazon-cognito-identity-js';

export interface CognitoAuthData {
    idToken: string;
    refreshToken: string;
}

const poolData = {
    UserPoolId : `${process.env.COGNITO_USER_POOL_ID}`,
    ClientId : `${process.env.COGNITO_CLIENT_ID}`
};

const userPool = new CognitoUserPool(poolData);

export function registerUser(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        userPool.signUp(email, password, [], [], (err, result) => {
            if (err) {
                reject(err);
            }
            if (!result) {
                throw new Error('Something went wrong')
            }
            resolve(result.userSub);
        })
    })
}

export function login(email: string, password: string): Promise<CognitoAuthData> {
    const authenticationDetails = new AuthenticationDetails({
        Username : email,
        Password : password
    });
    const userData = {
        Username : email,
        Pool : userPool
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                resolve({
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                })
            },
            onFailure: function(err) {
                reject(err);
            },
        })
    })
}

export function renew(refreshToken, email): Promise<CognitoAuthData> {
    const RefreshToken = new CognitoRefreshToken({RefreshToken: refreshToken});
    const userPool = new CognitoUserPool(poolData);
    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.refreshSession(RefreshToken, (err, session) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    idToken: session.idToken.jwtToken,
                    refreshToken: session.refreshToken.token,
                })
            }
        })
    })
}