describe('promise test', function () {

	// var qPromise = fn('qPromise');

	it("testing resolution", function(done) {

		var result = false;

		qPromise(function (resolve, reject) {
			resolve('gogogo!');
		})

		.then(function (value) {
			result = value;
		});

		setTimeout(function() {

			expect(result).toBe('gogogo!');

			done();
		}, 10);
    });

    it("reject resolution", function(done) {

		var result = false;

		qPromise(function (resolve, reject) {
			reject('foobar');
		})

		.then(function (value) {
			result = 'ok ' + value;
		}).catch(function (reason) {
			result = 'whoops ' + reason;
		});

		setTimeout(function() {
			expect(result).toBe('whoops foobar');
			done();
		}, 10);
    });

    it("testing interception resolve", function(done) {

		var result = false;

		qPromise(function (resolve, reject) {
			resolve('foobar');
		})

		.then(function (value) {
			return ':)';
		})

		.then(function (value) {
			result = 'ok ' + value;
		}).catch(function (reason) {
			result = 'whoops ' + reason;
		});

		setTimeout(function() {
			expect(result).toBe('ok :)');
			done();
		}, 10);
    });

    it("testing interception resolve to reject", function(done) {

		var result = false;

		qPromise(function (resolve, reject) {
			resolve('foobar');
		})

		.then(function (value) {
			throw 'oO';
		})

		.then(function (value) {
			result = 'ok ' + value;
		}).catch(function (reason) {
			result = 'whoops ' + reason;
		});

		setTimeout(function() {
			expect(result).toBe('whoops oO');
			done();
		}, 10);

    });

    it("testing interception reject", function(done) {

		var result = false;

		qPromise(function (resolve, reject) {
			reject('foobar');
		})

		.catch(function (value) {
			throw 'oO';
		})

		.then(function (value) {
			result = 'ok ' + value;
		}).catch(function (reason) {
			result = 'whoops ' + reason;
		});

		setTimeout(function() {
			expect(result).toBe('whoops oO');
			done();
		}, 10);
    });

    it("testing interception reject to resolve", function(done) {

		var result = false;

		qPromise(function (resolve, reject) {
			reject('foobar');
		})

		.catch(function (value) {
			return ':)';
		})

		.then(function (value) {
			result = 'ok ' + value;
		}).catch(function (reason) {
			result = 'whoops ' + reason;
		});

		setTimeout(function() {
			expect(result).toBe('ok :)');
			done();
		}, 10);
		
    });

    it("testing interception resolve returning promise", function(done) {

		var result = false;

		qPromise(function (resolve, reject) {
			reject('foobar');
		})

		.catch(function (value) {
			return qPromise(function (resolve, reject) {
				resolve(':)');
			});
		})

		.then(function (value) {
			result = 'ok ' + value;
		}).catch(function (reason) {
			result = 'whoops ' + reason;
		});

		setTimeout(function() {
			expect(result).toBe('ok :)');
			done();
		}, 10 );
		
    });

    it("testing finally", function(done) {

		var result = false;

		var promise = qPromise(function (resolve, reject) {
			reject('foobar');
		})

		.finally(function (value) {
			result = 'finally ' + value;
		})

		.catch(function (value) {
			return ';)';
		})

		.then(function (value) {
			return 'ok ' + value;
		})

		.catch(function (reason) {
			throw 'whoops ' + reason;
		})

		;

		setTimeout(function() {
			expect(result).toBe('finally ok ;)');
			done();
		}, 10);
		
    });

    it("resolved all", function(done) {

		var result = false;

		qPromise.all([
			qPromise(function (resolve, reject) {
				setTimeout(function () {
					resolve('foo');
				}, 1);
			}),
			qPromise(function (resolve, reject) {
				setTimeout(function () {
					resolve('bar');
				}, 1);
			})
		])
			.then(function (results) {
				console.log('results', results);
				result = 'ok ' + results.join('.');
			}).catch(function (results) {
				result = 'whoops ' + results.join('.');
			});

		setTimeout(function() {
			expect(result).toBe('ok foo.bar');
			done();
		}, 10);
    });

    it("rejected all", function(done) {

		var result = false;

		qPromise.all([
			qPromise(function (resolve, reject) {
				setTimeout(function () {
					resolve('foo');
				}, 1);
			}),
			qPromise(function (resolve, reject) {
				setTimeout(function () {
					reject('bar');
				}, 1);
			})
		])
			.then(function (results) {
				console.log('results', results);
				result = 'ok ' + results.join('.');
			}).catch(function (reason) {
				result = 'whoops ' + reason;
			});

		setTimeout(function() {
			expect(result).toBe('whoops bar');
			done();
		}, 10);
    });

});