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

(function (definition, root) {

  if ( typeof window === 'undefined' ) {
    if ( typeof module !== 'undefined' ) {
      module.exports = definition();
    }
  } else {
    if ( root.fn ) {
      fn.define('qPromise', function () { return definition(root); } );
    } else if( !root.qPromise ) {
      root.qPromise = definition(root);
    }
  }

})(function (root) {

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

		while( queue.length ) {
			if( step[action] ) {
				return step;
			}
			step = queue.shift();
		}

		return (step && step[action]) ? step : false;
	}

	function processResult (promise, status, action, value) {

		var step = getStep(promise.queue, action);

		if( step ) {
			promise['[[PromiseStatus]]'] = status;
			if( value !== undefined ) {
				promise['[[PromiseValue]]'] = value;
			}
		} else {
			step = promise.queue.finally.shift();

			while( step ) {
				step(value);
				step = getStep(promise.queue.finally, action);
			}

			step = false;
		}

		if( step && step[action] ) {

			try {
				var newValue = step[action].call(promise, value);
				promise['[[PromiseStatus]]'] = 'fulfilled';
			} catch(err) {
				promise['[[PromiseStatus]]'] = 'rejected';
				promise['[[PromiseValue]]'] = err;
				newValue = err;
			}

			if( newValue && newValue.then instanceof Function ) {

				newValue.then(function (result) {
					promise.resolve( result );
					return result;
				}, function (reason) {
					promise.reject( reason );
					throw reason;
				});

			} else {
				
				switch ( promise['[[PromiseStatus]]'] ) {
					case 'fulfilled':
						promise.resolve( ( newValue === undefined ) ? value : newValue );
						break;
					case 'rejected':
						promise.reject( ( newValue === undefined ) ? value : newValue );
						break;
				}
			}

		}

		return promise;
	}

	function initPromise(promise, handler) {
		promise.queue = [];
		promise.queue.finally = [];

		/*jshint validthis: true */
		promise['[[PromiseStatus]]'] = 'pending';
		promise['[[PromiseValue]]'] = undefined;

		processPromise(promise, handler);
	}

	function P(handler) {

		/*jshint validthis: true */
		if( this === undefined || this === root ) {
			return new P(handler);
		} else {
			initPromise(this, handler);
		}
	}

	P.prototype.then = function (onFulfilled, onRejected) {
		if( onFulfilled instanceof Function ) {
			this.queue.push({ then: onFulfilled, catch: onRejected });
		}

		return this;
	};

	P.prototype.catch = function (onRejected) {
		if( onRejected instanceof Function ) {
			this.queue.push({ catch: onRejected });
		}

		return this;
	};

	P.prototype.finally = function (onFulfilled) {
		if( onFulfilled instanceof Function ) {
			this.queue.finally.push(onFulfilled);
		}

		return this;
	};

	P.prototype.resolve = function (value) {
		return processResult(this, 'fulfilled', 'then', value);
	};

	P.prototype.reject = function (value) {
		return processResult(this, 'rejected', 'catch', value);
	};

	P.defer = function () {
		var deferred = new P();
		deferred.promise = deferred;
		return deferred;
	};

	P.when = function (promise) {
		var whenPromise = new P(function (resolve, reject) {
			if( promise && promise.then ) {
				promise.then(resolve, reject);
			} else {
				resolve(whenPromise, promise);
			}
		});
		return whenPromise;
	};

	return P;

}, this);
