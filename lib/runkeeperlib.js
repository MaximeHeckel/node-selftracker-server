/*
 * node-runkeeper - Node.js Client for Runkeeper Health Graph API
 *
 * runkeeper.js:  Defines the HealthGraph class
 *
 * author: Mark Soper (masoper@gmail.com)
 */

 var request = require('request'),
    API = require('./runkeeperapi.js').API;

var HealthGraph = exports.HealthGraph = function(options) {

    this.client_id = options.client_id || null ;
    this.client_secret = options.client_secret || null;
    this.auth_url = options.auth_url || "https://runkeeper.com/apps/authorize";
    this.access_token_url = options.access_token_url || "https://runkeeper.com/apps/token";
    this.redirect_uri = options.redirect_uri || null;
    this.api_domain = options.api_domain || "api.runkeeper.com";

};



// Refer to Runkeeper OAuth docs: http://developer.runkeeper.com/healthgraph/registration-authorization
// Assumes Step 1 has been done, so you have the authorization_code
// getToken performs Step 2

HealthGraph.prototype.getNewToken = function (authorization_code, callback) {

    var request_params = {
	grant_type: "authorization_code",
	code: authorization_code,
	client_id: this.client_id,
	client_secret: this.client_secret,
	redirect_uri: this.redirect_uri
    };

    var paramlist  = [];
    for (pk in request_params) {
	paramlist.push(pk + "=" + request_params[pk]);
    };
    var body_string = paramlist.join("&");

    var request_details = {
	method: "POST",
	headers: {'content-type' : 'application/x-www-form-urlencoded'},
	uri: this.access_token_url,
	body: body_string
    };

    request(request_details,
	function(error, response, body) {
        callback(JSON.parse(body)['access_token']);
    });
};


for (func_name in API) {

    HealthGraph.prototype[func_name] = (function(func_name) {
	    return function(access_token, callback) {
		    var request_details = {
		      method: API[func_name]['method'] || 'GET',
		      headers: {
            'Accept': API[func_name]['media_type'],
			      'Authorization' : 'Bearer ' + access_token},
		      uri: "https://" + this.api_domain + API[func_name]['uri']
		    };
    		request(request_details,
			    function(error, response, body) {
			      callback(body);
			    });
	      };
	  })(func_name);

};
