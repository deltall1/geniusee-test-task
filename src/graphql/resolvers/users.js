const {login} = require("../../services/cognito");
const {registerUser, renew} = require("../../services/cognito");

const User = require('../../models/user');

module.exports = {
    register: async ({email, password}) => {
        try {
            const cognitoUserSub = await registerUser(email, password);
            const user = new User({email, sub: cognitoUserSub});
            await user.save()
            return `Registration succeed, check your ${email} mail`;
        } catch (err) {
            throw err;
        }
    },
    login: async ({email, password}) => {
        try {
            const auth = await login(email, password)
            await User.findOneAndUpdate({email}, {refreshToken: auth.refreshToken})
            return auth;
        } catch (err) {
            throw err;
        }
    },
    refreshToken: async ({refreshToken}) => {
        try {
            const user = await User.findOne({refreshToken})
            if (!user) {
                throw new Error(`User with such token doesn't exists`);
            }
            return renew(refreshToken, user.email);
        } catch (err) {
            throw err;
        }
    }
}
