import config from '../config.js';
import mysql from 'mysql';

export default mysql.createPool(config.database);
