module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: [ 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-chrome-launcher', 'karma-firefox-launcher' ],
    files: [
      'node_modules/jstool-core/core.js',
    	'promise.js',
     	'tests/*.js'
    ],
    browsers: [ 'Chrome' ],
    singleRun: true
  });
};