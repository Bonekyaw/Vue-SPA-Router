// The users.js component is going to expose some functions we can call 
// to do operations on the /api/users resource. This module is going 
// to be relatively simple, but later can allow you to do any mapping, 
// data manipulation, etc. before or after the API request. 
// This file serves as a repository of reusable API operations:

import axios from 'axios';

export default {
    all() {
        return axios.get('/api/users');
    },
    find(id) {
        return axios.get(`/api/users/${id}`);
    },
    update(id, data) {
        return axios.put(`/api/users/${id}`, data);
    },
    delete(id) {
        return axios.delete(`/api/users/${id}`);
    },
};