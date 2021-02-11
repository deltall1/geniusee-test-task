import {Document, model, Schema} from "mongoose";

interface UserDocument extends Document {
    email: string;
    awsSub: string;
    idToken?: string;
    refreshToken?: string;
}

const UserSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: true,
    },
    awsSub: {
        type: String,
        required: true,
    },
    idToken: String,
});

export default model<UserDocument>('User', UserSchema);