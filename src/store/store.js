/* eslint-disable */
export const store = {
    state: {
        users: {}
    },
    addUser(user) {
        this.state.users.push(user);
    }
};