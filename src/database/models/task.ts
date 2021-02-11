import * as mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Task', taskSchema);