import {mergeResolvers} from '@graphql-tools/merge';
import userResolver from "./user";
import taskResolver from "./task";

const index = [userResolver, taskResolver]

export default mergeResolvers(index);