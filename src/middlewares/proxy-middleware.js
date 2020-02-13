const fs = require('fs');
const request = require('request');

module.exports = function getProxy(url) {
  return (req, res, next) => {
    req.headers['accept-encoding'] = null;
    req.headers['encoding'] = null;

    req
      .pipe(request(url + req.originalUrl))
      .pipe(res);
  }
};