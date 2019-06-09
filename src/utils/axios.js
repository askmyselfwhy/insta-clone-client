import axios from 'axios';
import { apiUrl } from '../config';
// import config from '../config';

export default axios.create({
  // Replace this with real one after deploying on HEROKU(?)
  baseURL: apiUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})