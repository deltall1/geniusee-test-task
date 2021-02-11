import Task from "../../database/models/task";

export default {
    Query: {
        tasks: async (parent, args, {user}) => {
            if (!user) {
                throw new Error('Unauthorized')
            }
            return Task.find({creator: user._id});
        },
    },

    Mutation: {
        createTask: async (parent, {title, status}, {user}) => {
            if (!user) {
                throw new Error('Unauthorized')
            }
            const task = new Task({title, status, creator: user._id})
            return task.save();
        },
        updateTaskStatus: async (parent, {id, status}, {user}) => {
            if (!user) {
                throw new Error('Unauthorized')
            }
            return Task.findOneAndUpdate({_id: id, creator: user._id}, {status}, {new: true})
        },
        deleteTask: async (parent, {id}, {user}) => {
            if (!user) {
                throw new Error('Unauthorized')
            }
            return Task.findOneAndRemove({_id: id, creator: user._id})
        },
    }
};