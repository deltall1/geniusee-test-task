const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const poolData = {
    UserPoolId : "us-east-2_SfsNW7GHf", // Your user pool id here
    ClientId : "3fplmjaeqk87fqi880243ufee6" // Your client id here
};
const pool_region = 'us-east-2';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function registerUser(email, password) {
    return new Promise((resolve, reject) => {
        userPool.signUp(email, password, null, null, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(result.userSub);
        })
    })
}

function login(email, password) {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : email,
        Password : password
    });

    const userData = {
        Username : email,
        Pool : userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                resolve({
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                })
            },
            onFailure: function(err) {
                console.log(err);
                reject(err);
            },
        })
    })
}

function validateToken(token) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                const keys = body['keys'];
                for(let i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    const key_id = keys[i].kid;
                    const modulus = keys[i].n;
                    const exponent = keys[i].e;
                    const key_type = keys[i].kty;
                    const jwk = { kty: key_type, n: modulus, e: exponent};
                    const pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                const decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    reject();
                }

                const kid = decodedJwt.header.kid;
                const pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    reject();
                }

                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        reject(err)
                    } else {
                        resolve(payload)
                    }
                });
            } else {
                console.log("Error! Unable to download JWKs");
                reject(error)
            }
        });
    })
}

function renew(refreshToken, email) {
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: refreshToken});
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.refreshSession(RefreshToken, (err, session) => {
            if (err) {
                console.log(err);
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



exports.registerUser = registerUser;
exports.login = login;
exports.validateToken = validateToken;
exports.renew = renew;