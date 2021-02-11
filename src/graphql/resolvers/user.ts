import * as jwt from 'jsonwebtoken';
import {login, registerUser, renew} from "../../services/cognito";
import User from "../../database/models/user";

export default {
    Mutation: {
        register: async (parent, {email, password}) => {
            const awsSub = await registerUser(email, password);
            const user = new User({email, awsSub});
            await user.save();
            return `Registration succeed, check your ${email} mail`;
        },
        login: async (parent, {email, password}) => {
            const {idToken, refreshToken} = await login(email, password);
            const user = await User.findOneAndUpdate({email}, {idToken, refreshToken}, {new: true})
            if (!user) {
                throw new Error('User does not exist')
            }
            const token = jwt.sign({_id: user._id, email}, `${process.env.JWT_SECRET_KEY}`);
            return {accessToken: token, refreshToken};
        },
        refreshToken: async (parent, {refreshToken}) => {
            const user = await User.findOne({refreshToken})
            if (!user) {
                throw new Error(`User with such token doesn't exists`);
            }
            const res = await renew(refreshToken, user.email)
            await User.updateOne({refreshToken}, {idToken: res.idToken, refreshToken: res.refreshToken})
            const token = jwt.sign({_id: user._id, email: user.email}, `${process.env.JWT_SECRET_KEY}`);
            return {accessToken: token, refreshToken: res.refreshToken};
        }
    }
}