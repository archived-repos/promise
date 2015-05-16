jEngine: $promise [![wercker status](https://app.wercker.com/status/ea1a628b907d1613503a54e03df4cadd/s "wercker status")](https://app.wercker.com/project/bykey/ea1a628b907d1613503a54e03df4cadd)
================
[![Bower version](https://badge.fury.io/bo/jengine-promise.svg)](http://badge.fury.io/bo/jengine-promise)
[![npm version](https://badge.fury.io/js/jengine-promise.svg)](http://badge.fury.io/js/jengine-promise)
[![Build Status](https://travis-ci.org/jstools/promise.svg?branch=master)](https://travis-ci.org/jstools/promise)
Installation
------------
```.sh
npm install jengine-promise --save
```
  or
```.sh
bower install jengine-promise --save
```
Usage
-----
```.js
$promise(function (resolve, reject) {
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
output:
```.sh
checkpoint 1 gogogo!
checkpoint 2.1 whoops!
# elapsed 400ms
checkpoint 3 all right!
checkpoint 4 all right!
```
