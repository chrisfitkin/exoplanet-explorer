/*
Instructions:
(1) Refactor .forEach below to create a sequence of Promises that always resolves in the same
    order it was created.
  (a) Fetch each planet's JSON from the array of URLs in the search results.
  (b) Call createPlanetThumb on each planet's response data to add it to the page.
(2) Use developer tools to determine if the planets are being fetched in series or in parallel.
 */

// Inline configuration for jshint below. Prevents `gulp jshint` from failing with quiz starter code.
/* jshint unused: false */

(function(document) {
  'use strict';

  var home = null;

  /**
   * Helper function to show the search query.
   * @param {String} query - The search query.
   */
  function addSearchHeader(query) {
    home.innerHTML = '<h2 class="page-title">query: ' + query + '</h2>';
  }

  /**
   * Helper function to create a planet thumbnail.
   * @param  {Object} data - The raw data describing the planet.
   */
  function createPlanetThumb(data) {
    var pT = document.createElement('planet-thumb');
    for (var d in data) {
      pT[d] = data[d];
    }
    home.appendChild(pT);
  }

  /**
   * XHR wrapped in a promise.
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    return fetch(url, {
      method: 'get'
    });
  }

  /**
   * Performs an XHR for a JSON and returns a parsed JSON response.
   * @param  {String} url - The JSON URL to fetch.
   * @return {Promise}    - A promise that passes the parsed JSON response.
   */
  function getJSON(url) {
    return get(url).then(function(response) {
      return response.json();
    });
  }

  window.addEventListener('WebComponentsReady', function() {
    home = document.querySelector('section[data-route="home"]');
    /*
    Refactor this code!
     */
    getJSON('../data/earth-like-results.json')
    .then(function(response) {
      console.log(response.results)

      // http://www.datchley.name/promise-patterns-anti-patterns/#executingpromisesinseries

      var i = 0
      var createArray = response.results.map(function(url) {
          console.log(i++)
          let j = i
          return function() {
            console.log('processing ' + j + ' '+ url)
            return Promise.resolve(function() {
              console.log('resolving ' + j + ' '+url)
              getJSON(url)
              .then(createPlanetThumb)
              .then(function() {
                console.log('resolved ' + j + ' '+url)
              })
            });
          }
      });
      console.log(createArray)
      function pseries(list) {
        var p = Promise.resolve();
        return list.reduce(function(pacc, fn) {
          return pacc = pacc.then(fn);
        }, p);
      }
      var result = pseries(createArray);

      // var reducedPromise = createArray.reduce((p, fn) => p.then(fn), Promise.resolve())
      //   .then(function(result) {
      //     console.log('Display complete')
      //   })
      //   .catch(Error('Could not load JSON planets'))
      // console.log(reducedPromise)

      // response.results.forEach(function(url) {
      //   getJSON(url).then(createPlanetThumb);
      // });
    });
  });
})(document);
