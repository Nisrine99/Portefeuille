import axios from 'axios';

const apiNoAuth = axios.create({
  baseURL: 'http://192.168.1.5:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiNoAuth;
