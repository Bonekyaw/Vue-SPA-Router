<template>
    <div class="users">
        <div v-if="error" class="error">
            <p>{{ error }}</p>
        </div>
        
        <ul v-if="users">
            <li v-for="{ id, name, email } in users">
                <strong>Name:</strong> {{ name }},
                <strong>Email:</strong> {{ email }}
            </li>
        </ul>

        <div class="pagination">
            <button :disabled="! prevPage" @click.prevent="goToPrev">Previous</button>
            {{ paginatonCount }}
            <button :disabled="! nextPage" @click.prevent="goToNext">Next</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
const getUsers = (page, callback) => {          //beforeRouteEnter -> getUsers -> callback -> next -> setData
    const params = { page };                    // { page : 1 }
    axios
        .get('/api/users', { params })
        .then(response => {
            callback(null, response.data);      //(error,data)
        }).catch(error => {
            callback(error, error.response.data);
        });
};
export default {
    data() {
        return {
            users: null,
            meta: null,
            links: {
                first: null,
                last: null,
                next: null,
                prev: null,
            },
            error: null,
        };
    },
    computed: {
        nextPage() {
            if (! this.meta || this.meta.current_page === this.meta.last_page) {
                return;
            }
            return this.meta.current_page + 1;
        },
        prevPage() {
            if (! this.meta || this.meta.current_page === 1) {
                return;
            }
            return this.meta.current_page - 1;
        },
        paginatonCount() {
            if (! this.meta) {
                return;
            }
            const { current_page, last_page } = this.meta;
            return `${current_page} of ${last_page}`;
        },
    },                                              // to: Route, from : Route, next : function
    beforeRouteEnter (to, from, next) {             //fetch the data and then navigate to the new route
        getUsers(to.query.page, (err, data) => {    //const getUsers(page, callback)    / page=1,...
            next(vm => vm.setData(err, data));      //only after completion, we trigger next() and set the data on our component (the vm variable)
        });
    },
    // when route changes and this component is already rendered,
    // the logic will be slightly different.
    beforeRouteUpdate (to, from, next) {
        this.users = this.links = this.meta = null      //should display progress bar, now
        getUsers(to.query.page, (err, data) => {        // in the request as a query string param,If it’s null (no page passed in the route), then the API will automatically assume page=1
            this.setData(err, data);
            next();         //our component (the vm variable) is now still already rendered, no need to set data
        });
    },
    methods: {
        goToNext() {
            this.$router.push({     // to.query.page
                query: {
                    page: this.nextPage,
                },
            });
        },
        goToPrev() {
            this.$router.push({
                name: 'users.index',        //:to="{ name: 'users.index' }"  in order to prevent other route link before
                query: {
                    page: this.prevPage,
                }
            });
        },
        setData(err, { data: users, links, meta }) {        //vm.setData(error,data)
            if (err) {
                this.error = err.toString();
            } else {
                this.users = users;
                this.links = links;
                this.meta = meta;
            }
        },
    }
}
</script>

// Part 2 
// fetchData() {
//     this.error = this.users = null;
//     this.loading = true;
//     axios
//         .get('/api/users')
//         .then(response => {
//             this.loading = false;
//             this.users = response.data;
//         }).catch(error => {
//             this.loading = false;
//             this.error = error.response.data.message || error.message;
//         });
// }
// 
//     {
//    "data":[
//       {
//          "name":"Francis Marquardt",
//          "email":"schamberger.adrian@example.net"
//       },
//       {
//          "name":"Dr. Florine Beatty",
//          "email":"fcummerata@example.org"
//       },
//       ...
//    ],
//    "links":{
//       "first":"http:\/\/vue-router.test\/api\/users?page=1",        // to.query.page
//       "last":"http:\/\/vue-router.test\/api\/users?page=5",
//       "prev":null,
//       "next":"http:\/\/vue-router.test\/api\/users?page=2"
//    },
//    "meta":{
//       "current_page":1,
//       "from":1,
//       "last_page":5,
//       "path":"http:\/\/vue-router.test\/api\/users",
//       "per_page":10,
//       "to":10,
//       "total":50
//    }
// }