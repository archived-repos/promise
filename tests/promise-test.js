describe('promise test', function () {

	// var $promise = fn('$promise');

	it("testing resolution", function(done) {

		var result = false;

		$promise(function (resolve, reject) {
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

		$promise(function (resolve, reject) {
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

		$promise(function (resolve, reject) {
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

			$promise(function (resolve, reject) {
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

			$promise(function (resolve, reject) {
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

		$promise(function (resolve, reject) {
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

		$promise(function (resolve, reject) {
			reject('foobar');
		})

		.catch(function (value) {
			return $promise(function (resolve, reject) {
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

			var promise = $promise(function (resolve, reject) {
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

			;

			setTimeout(function() {
				expect(result).toBe('finally ok ;)');
				done();
			}, 10);

    });

    it("resolved all", function(done) {

			var result = false;

			var p = $promise.all([
				$promise(function (resolve, reject) {
					setTimeout(function () {
						resolve('foo');
					}, 1);
				}),
				$promise(function (resolve, reject) {
					setTimeout(function () {
						resolve('bar');
					}, 1);
				})
			])

			p.then(function (results) {
					expect(results.join('.')).toBe('foo.bar');
					done();
				});
    });

    it("rejected all (2)", function(done) {

			var result = false;

			$promise.all([
				$promise(function (resolve, reject) {
					setTimeout(function () {
						resolve('foo');
					}, 1);
				}),
				$promise(function (resolve, reject) {
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

		it("rejected all (3)", function(done) {

			var result = false;

			$promise.all([
				$promise(function (resolve, reject) {
					setTimeout(function () {
						resolve('foo');
					}, 1);
				}),
				'bar'
			])
				.then(function (results) {
					console.log('results', results);
					result = 'ok ' + results.join('.');
				}).catch(function (reason) {
					result = 'whoops ' + reason;
				});

			setTimeout(function() {
				expect(result).toBe('ok foo.bar');
				done();
			}, 10);
    });

		it("rejected all (3)", function(done) {

			var result = false;

			$promise.all([
				'foo',
				'bar'
			])
				.then(function (results) {
					console.log('results', results);
					result = 'ok ' + results.join('.');
				}).catch(function (reason) {
					result = 'whoops ' + reason;
				});

			setTimeout(function() {
				expect(result).toBe('ok foo.bar');
				done();
			}, 10);
    });

});
