(function() {
'use strict';

const postButtonSelector = '.send-post';
const getButtonSelector = '.send-get';

var postTargetUrl = 'post-target';
var getTargetUrl = 'get-target';


function HttpClient() {}
const client = new HttpClient();
HttpClient.prototype.getAsync = function(url, onResponse) {
  fetch(url, {method: 'GET'}).then((response) => onResponse(response));
};

HttpClient.prototype.postAsync = function(url, data, onResponse) {
  fetch(url, {method: 'POST', body: JSON.stringify(data)})
      .then((response) => onResponse(response));
};


function hookButtonClick(selector, callback) {
  document.querySelector(selector).addEventListener('click', callback);
}

window.addEventListener('load', function() {
  // Hook on load functions

  // Hook click listener of POST button
  hookButtonClick(postButtonSelector, () => {
    // Create a simple post request with some JSON
    client.postAsync(
        postTargetUrl, {test_val: 'test'}, () => console.log('POST DONE!'));
  });

  // Hook click listener of GET button
  hookButtonClick(getButtonSelector, () => {
    // Create a simple get request
    client.getAsync(getTargetUrl, (res) => console.debug(res));
  });
});

})();