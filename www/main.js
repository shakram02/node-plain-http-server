(function() {
'use strict';

// Selectors of buttons in HTML
const postButtonSelector = '.send-post';
const getButtonSelector = '.send-get';

// Those target links don't exist on the server, they cause the errors
var postTargetUrl = 'post-target';
var getTargetUrl = 'get-target';

// HttpClient object sends POST/GET requests, you don't need ajax and its
// nightmares, this keeps you cool
const client = new HttpClient();

function HttpClient() {}

// JavaScript is async, that means that code isn't executed line by line,
// you request a command (GET) and the response arrives later, that's
// why you need the onResponse callback, it takes the server's reply as
// a paramter.
HttpClient.prototype.getAsync = function(url, onResponse) {
  fetch(url, {method: 'GET'}).then((response) => onResponse(response));
};

HttpClient.prototype.postAsync = function(url, data, onResponse) {
  fetch(url, {method: 'POST', body: JSON.stringify(data)})
      .then((response) => onResponse(response));
};

// I don't like too much nesting, this function does just that
function hookButtonClick(selector, callback) {
  document.querySelector(selector).addEventListener('click', callback);
}

// This event is called when HTML window is loaded,
// you setup the event listeners here because elsewhere
// they'll be null/undefined
window.addEventListener('load', function() {
  // Hook on load functions

  // Hook click listener of POST button, and the click handler as a lambda
  hookButtonClick(postButtonSelector, () => {
    // Create a simple post request with some JSON
    client.postAsync(
        // Send some JSON data with that entry, you can add entries, it's up to you
        // the function is the handler of the POST reply. JSON data will usually 
        // be data filled in a form
        postTargetUrl, {test_val: 'test'}, () => console.log('POST DONE!'));
  });

  // Hook click listener of GET button
  hookButtonClick(getButtonSelector, () => {
    // Create a simple get request
    client.getAsync(getTargetUrl, (res) => console.debug(res));
  });
});

})();