const Task = require('../../models/task');
const User = require('../../models/user');

module.exports = {
    tasks: async (args, req) => {
        const {user} = req;
        if (!user) {
            throw new Error('Unauthorized');
        }
        return Task.find({creator: user.id});
    },
    createTask: async (args, req) => {
        const {user} = req;
        if (!user) {
            throw new Error('Unauthorized');
        }
        const {title, status} = args.taskInput;
        const task = new Task({
            title,
            status,
            creator: user.id,
        });
        return task.save();
    },
    updateTaskStatus: async (args, req) => {
        const {user} = req;
        if (!user) {
            throw new Error('Unauthorized');
        }
        const {id, status} = args.taskInput;
        return Task.findOneAndUpdate({_id: id, creator: user.id}, {status}, {new: true});
    },
    deleteTask: async ({id}, req) => {
        const {user} = req;
        if (!user) {
            throw new Error('Unauthorized');
        }
        return Task.findOneAndRemove({_id: id, creator: user.id})
    }
}
