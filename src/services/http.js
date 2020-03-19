import axios from 'axios';
import store from '../store';

export default (() => axios.create({
  baseURL: 'https://appbookworm.herokuapp.com/api/',
  headers: {
    common: {
      Authorization: store.getters['user/getToken'],
    },
  },
}))();
