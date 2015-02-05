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

	function Promise(handler) {

		/*jshint validthis: true */
		if( this === undefined || this === window ) {
			return new Promise(handler);
		}

		this.queue = [];
		this.queue.finally = [];

		/*jshint validthis: true */
		this['[[PromiseStatus]]'] = 'pending'; // fulfilled | rejected
		this['[[PromiseValue]]'] = undefined; // fulfilled | rejected

		processPromise(this, handler);
	}

	Promise.prototype.then = function (onFulfilled, onRejected) {
		if( onFulfilled instanceof Function ) {
			this.queue.push({ then: onFulfilled, catch: onRejected });
		}

		return this;
	};

	Promise.prototype.catch = function (onRejected) {
		if( onRejected instanceof Function ) {
			this.queue.push({ catch: onRejected });
		}

		return this;
	};

	Promise.prototype.finally = function (onFulfilled, onRejected) {
		if( onFulfilled instanceof Function ) {
			this.queue.finally.push({ then: onFulfilled, catch: onRejected });
		}

		return this;
	};

	Promise.prototype.resolve = function (value) {
		return processResult(this, 'fulfilled', 'then', value);
	};

	Promise.prototype.reject = function (value) {
		return processResult(this, 'rejected', 'catch', value);
	};

	Promise.prototype.hold = function (handler) {

		this['[[PromiseStatus]]'] = 'pending';
		this['[[PromiseValue]]'] = undefined;

		processPromise(this, handler);
	};

	Promise.defer = function () {
		var deferred = new Promise();
		deferred.promise = deferred;
		return deferred;
	};

	Promise.when = function (promise) {
		var whenPromise = new Promise(function (resolve, reject) {
			if( promise && promise.then ) {
				promise.then(resolve, reject);
			} else {
				resolve(whenPromise, promise);
			}
		});
		return whenPromise;
	};

	return Promise;
});
