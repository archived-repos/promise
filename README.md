jstool-promise
==============

[![npm version](https://badge.fury.io/js/jstool-promise.svg)](http://badge.fury.io/js/jstool-promise) [![Build Status](https://travis-ci.org/jstools/promise.js.svg?branch=master)](https://travis-ci.org/jstools/promise.js)

```.js
var qPromise = fn('qPromise');

new qPromise(function (resolve, reject) {
		resolve('hola caracola');
	})

    .finally(function (result) {
    	console.log('checkpoint 4', result);
    }, function (reason) {
    	console.log('checkpoint 4.1', reason);
    })

    .then(function (result) {
    	console.log('checkpoint 1', result);
    })

    .then(function (result) {
        console.log('checkpoint 2', result);
        this.hold(function (resolve, reject) {
            setTimeout(function () {
                reject('whoops');
            }, 1000);
        });
    })

    .then(function (result) {
		console.log('checkpoint 3', result);
	}, function (reason) {
		console.log('checkpoint 3.1', reason);
	})
;
```