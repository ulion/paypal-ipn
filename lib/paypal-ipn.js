var https = require('https');
var qs = require('querystring');

var SANDBOX_URL = 'www.sandbox.paypal.com';
var REGULAR_URL = 'www.paypal.com';


exports.verify = function verify(params, callback) {
  params.cmd = '_notify-validate';

  //Set up the request to paypal
  var req_options = {
    host: (params.test_ipn) ? SANDBOX_URL : REGULAR_URL,
    method: 'GET',
    path: '/cgi-bin/webscr?' + qs.stringify(params)
  }


  var req = https.request(req_options, function paypal_request(res) {
    res.on('data', function paypal_response(d) {
      var response = d.toString();

      //Check if IPN is valid
      callback(response != 'VERIFIED', response);
    });
  });
  req.end();

  //Request error
  req.on('error', function request_error(e) {
    callback(true, e);
  });
};