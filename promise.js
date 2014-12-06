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

(function () {

	function addWhen (Promise) {
		if( !Promise.when ) {
			Promise.when = function (p) {
				p = p || {};
	            return new Promise(function (resolve, reject) {
	                if( p ) {
	                    if( typeof p.then === 'function' ) {
	                        p.then(resolve, reject);
	                    } else {
	                        setTimeout(function () {
	                            resolve();
	                        }, 0);
	                    }
	                } else {
	                    setTimeout(function () {
	                        reject();
	                    }, 0);
	                }
	            });
	        };
		}
	}

	if( typeof window === 'undefined' ) {
		var Promise = require('promise-es6').Promise;
		addWhen(Promise);
		if ( typeof module !== 'undefined' ) {
			module.exports = Promise;
		}
	} else {
		if( typeof Promise === 'undefined' ) {
			throw 'Promise not found';
		} else {
			addWhen(Promise);
			fn.define('Promise', function () { return Promise; });
		}
	}

})();