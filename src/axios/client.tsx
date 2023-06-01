import axios from 'axios';

const localStorageTokenKey = 'authorization';

export const Api = axios.create({
    baseURL: 'https://gradeapp--brunaotavares.repl.co/',
});

// Api.interceptors.request.use((config) => {
//     const token = localStorage.getItem(localStorageTokenKey);
//     if (token && config.headers) {
//         config.headers['authorization'] = 'Bearer ' + token;
//     }
//     return config;
// },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// Api.interceptors.response.use(function (res) {
//     if (res.data.code == 401) {
//         window.location.reload();
//     }
//     return res;
// });