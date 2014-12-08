module.exports = function(config) {
  
  var configuration = {
    frameworks: ['jasmine'],
    plugins: [ 'karma-jasmine', 'karma-chrome-launcher' ],
    files: [
      'node_modules/jstool-core/core.js',
    	'promise.js',
     	'tests/*.js'
    ],
    browsers: [ 'Chrome' ],
    singleRun: true
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};