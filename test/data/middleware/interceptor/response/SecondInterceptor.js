module.exports = function(body, headers, request, callback) {
    var previousInterceptorHeader = headers['via']; 
    var newHeaders = {};
    newHeaders['Via'] = 'previous Interceptor wrote: ' + previousInterceptorHeader;
    callback(null, body, newHeaders);
};