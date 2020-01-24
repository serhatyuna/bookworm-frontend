import axios from 'axios';
import store from '../store';

export default (() => axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    common: {
      Authorization: store.getters['user/getToken'],
    },
  },
}))();
