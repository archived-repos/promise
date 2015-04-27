jsTools: Promise
================
[![Bower version](https://badge.fury.io/bo/jstools-promise.svg)](http://badge.fury.io/bo/jstools-promise)
[![npm version](https://badge.fury.io/js/jstools-promise.svg)](http://badge.fury.io/js/jstools-promise)
[![Build Status](https://travis-ci.org/jstools/promise.svg?branch=master)](https://travis-ci.org/jstools/promise)

```.sh
npm install jstools-promise --save
```
or
```.sh
bower install jstools-promise --save
```

```.js
new qPromise(function (resolve, reject) {
        resolve('gogogo!');
    })

    .finally(function (result) {
        console.log('checkpoint 4', result);
    }, function (reason) {
        console.log('checkpoint 4.1', reason);
    })

    .then(function (result) {
        console.log('checkpoint 1', result);
        throw 'whoops!';
    })

    .then(function (result) {
        console.log('checkpoint 2', result);
    },function (result) {
        console.log('checkpoint 2.1', result);
        return qPromise(function (resolve, reject) {
            setTimeout(function () { resolve('all right!'); }, 400);
        });
    })

    .then(function (result) {
        console.log('checkpoint 3', result);
    }, function (reason) {
        console.log('checkpoint 3.1', reason);
    })
;
```
output will be:
```.sh
checkpoint 1 gogogo!
checkpoint 2.1 whoops!
# elapsed 400ms
checkpoint 3 all right!
checkpoint 4 all right!
```
