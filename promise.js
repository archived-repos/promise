/*
 * css.js
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Jesús Manuel Germade Castiñeiras <jesus@germade.es>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

// var qPromise = fn('qPromise');

// new qPromise(function (resolve, reject) {
// 		resolve('hola caracola');
// 	})

//     .finally(function (result) {
//     	console.log('checkpoint 4', result);
//     }, function (reason) {
//     	console.log('checkpoint 4.1', reason);
//     })

//     .then(function (result) {
//     	console.log('checkpoint 1', result);
//     })

//     .then(function (result) {
//         console.log('checkpoint 2', result);
//         this.hold(function (resolve, reject) {
//             setTimeout(function () {
//                 reject('whoops');
//             }, 1000);
//         });
//     })

//     .then(function (result) {
// 		console.log('checkpoint 3', result);
// 	}, function (reason) {
// 		console.log('checkpoint 3.1', reason);
// 	})
// ;

(function (definition) {

  if ( typeof window === 'undefined' ) {
    if ( typeof module !== 'undefined' ) {
      module.exports = definition();
    }
  } else {
    if ( window.fn ) {
      fn.define('qPromise', definition );
    } else if( !window.qPromise ) {
      window.qPromise = definition();
    }
  }

})(function () {

	function promiseState () {
		this['[[PromiseStatus]]'] = 'pending'; // fulfilled | rejected
		this['[[PromiseValue]]'] = undefined; // fulfilled | rejected
	}

	function processPromise (promise, handler) {
		if( handler instanceof Function ) {
			setTimeout(function () {
				handler.apply(promise, [function (result) {
					promise.resolve(result);
				}, function (result) {
					promise.reject(result);
				}]);
			}, 0);
		}
	}

	function getStep(queue, action) {
		var step = queue.shift();

		while( queue.length && !step[action] ) {
			step = queue.shift();
		}

		return step;
	}

	function processResult (promise, status, action, value) {

		var step = getStep(promise.queue, action);

		if( step ) {
			promise['[[PromiseStatus]]'] = status;
			if( value !== undefined ) {
				promise['[[PromiseValue]]'] = value;
			}
		} else {
			step = getStep(promise.queue.finally, action);
			value = promise['[[PromiseValue]]'];
		}

		if( step && step[action] ) {

			var newValue = step[action].call(promise, value);

			switch ( promise['[[PromiseStatus]]'] ) {
				case 'fulfilled':
					promise.resolve( ( newValue === undefined ) ? value : newValue );
					break;
				case 'rejected':
					promise.reject( ( newValue === undefined ) ? value : newValue );
					break;
			}
		}

		return promise;
	}

	function qPromise(handler) {
		this.queue = [];
		this.queue.finally = [];
		processPromise(this, handler);
	}

	qPromise.prototype = new promiseState();

	qPromise.prototype.then = function (onFulfilled, onRejected) {
		if( onFulfilled instanceof Function ) {
			this.queue.push({ then: onFulfilled, catch: onRejected });
		}

		return this;
	};

	qPromise.prototype.catch = function (onRejected) {
		if( onRejected instanceof Function ) {
			this.queue.push({ catch: onRejected });
		}

		return this;
	};

	qPromise.prototype.finally = function (onFulfilled, onRejected) {
		if( onFulfilled instanceof Function ) {
			this.queue.finally.push({ then: onFulfilled, catch: onRejected });
		}

		return this;
	};

	qPromise.prototype.resolve = function (value) {
		return processResult(this, 'fulfilled', 'then', value);
	};

	qPromise.prototype.reject = function (value) {
		return processResult(this, 'rejected', 'catch', value);
	};

	qPromise.prototype.hold = function (handler) {

		this['[[PromiseStatus]]'] = 'pending';
		this['[[PromiseValue]]'] = undefined;

		processPromise(this, handler);
	};

	qPromise.defer = function () {
		return new qPromise();
	}

	return qPromise;
});
