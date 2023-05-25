'use strict';

import axios from 'axios';
// const Const = require('../constants/index');
import Const from '../constants/index';

const axiosGet = function (url) {
  const fullURL = `${Const.baseURL}${url}`;
  return axios(fullURL);
};

const axiosPost = function (url, body) {
  const fullURL = `${Const.baseURL}${url}`;

  return axios({
    method: 'POST',
    url: fullURL,
    'Content-Type': 'application/json',
    data: body
  });
};

const axiosPut = function (url, body) {
  const fullURL = `${Const.baseURL}${url}`;

  return axios({
    method: 'PUT',
    url: fullURL,
    'Content-Type': 'application/json',
    data: body
  });
};

const axiosDel = function (url) {
  const fullURL = `${Const.baseURL}${url}`;
  return axios({
    method: 'DELETE',
    url: fullURL
  });
};

export {
  axiosGet,
  axiosPost,
  axiosPut,
  axiosDel
};
