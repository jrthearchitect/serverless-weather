/**
 * This action calls remote API to get City's weather
 *
 * @param   params.SERVICE_PROVIDER_URL             SERVICE_PROVIDER_URL
 * @param   params.zip             zip code
 * @return  Weather Information
 */

function weatherQuery(params) {
  var getCurrentDatetime = function() {
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "/" +
      (currentdate.getMonth() + 1) + "/" +
      currentdate.getDate() + " @ " +
      currentdate.getHours() + ":" +
      currentdate.getMinutes() + ":" +
      currentdate.getSeconds();
    return datetime;
  };

  var guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  return new Promise(function(resolve, reject) {
    var REQUEST = require('request');
    var request = REQUEST.defaults({
      strictSSL: false
    });
    var url = params.SERVICE_PROVIDER_URL + '&zip=' + params.zip;
    console.log(url);
    request({
      'method': 'GET',
      'url': url,
      'json': true
    }, function(err, resp, body) {
      if (err) {
        reject({
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 404,
          body: {
            error: "API Call Failed"
          }
        });
      } else {
        var response = {};
        if (body.cod === 200) {
          var weath = "Conditions are " + body.weather[0].main + " and temperature is " + body.main.temp + ' F';
          resolve({
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: {
              'colorStyle': '',
              'zip': params.zip,
              'city': body.name,
              'weather': weath,
              'zipTime': getCurrentDatetime()
            }
          });
        } else {
          reject({
            headers: {
              'Content-Type': 'application/json'
            },
            statusCode: body.cod,
            body: {
              'colorStyle': 'warningText',
              'city': 'Invalid Zip',
              'weather': 'Invalid Zip',
              'msg':err
            }
          });
        }
      }
    });
  });
}

exports.main = weatherQuery;
