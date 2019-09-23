/* eslint-disable */
export const store = {
    users: {}
    ,
    addUser(user) {
        this.users = user;
    },
    sync() {
        this.users = this.users;
    }
};