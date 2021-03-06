describe('promise resolution', function () {

  // var $promise = fn('$promise');

    it("testing resolution", function(done) {

      $promise(function (resolve, reject) {
        resolve('gogogo!');
      })

			.then(function (result) {
        expect(result).toBe('gogogo!');
        done();
			});

    });

    it("reject resolution", function(done) {

      $promise(function (resolve, reject) {
        reject('foobar');
      })

      .then(function (value) {
        return 'ok ' + value;
      }).catch(function (reason) {
        throw 'whoops ' + reason;
      })

			.catch(function (reason) {
        expect(reason).toBe('whoops foobar');
        done();
			});

    });

});

describe('promise interception', function () {

    it("testing interception resolve", function(done) {

	    $promise(function (resolve, reject) {
	      resolve('foobar');
	    })

	    .then(function (value) {
	      return ':)';
	    })

	    .then(function (value) {
	      return 'ok ' + value;
	    }).catch(function (reason) {
	      throw 'whoops ' + reason;
	    })

			.then(function (result) {
	      expect(result).toBe('ok :)');
	      done();
			});

    });

    it("testing interception resolve to reject", function(done) {

      $promise(function (resolve, reject) {
        resolve('foobar');
      })

      .then(function (value) {
        throw 'oO';
      })

      .then(function (value) {
        return 'ok ' + value;
      }).catch(function (reason) {
        throw 'whoops ' + reason;
      })

			.catch(function (reason) {
        expect(reason).toBe('whoops oO');
        done();
			});

    });

    it("testing interception reject", function(done) {

      $promise(function (resolve, reject) {
        reject('foobar');
      })

      .catch(function (value) {
        throw 'oO';
      })

      .then(function (value) {
        return 'ok ' + value;
      }).catch(function (reason) {
        throw 'whoops ' + reason;
      })

			.catch(function (reason) {
        expect(reason).toBe('whoops oO');
        done();
			});

    });

    it("testing interception reject to resolve", function(done) {

			$promise(function (resolve, reject) {
	      reject('foobar');
	    })

	    .catch(function (value) {
	      return ':)';
	    })

	    .then(function (value) {
	      return 'ok ' + value;
	    }).catch(function (reason) {
	      throw 'whoops ' + reason;
	    })

			.then(function (result) {
	      expect(result).toBe('ok :)');
	      done();
			});

    });

    it("testing interception resolve returning promise", function(done) {

	    $promise(function (resolve, reject) {
	      reject('foobar');
	    })

	    .catch(function (value) {
	      return $promise(function (resolve, reject) {
	        resolve(':)');
	      });
	    })

	    .then(function (value) {
	      return 'ok ' + value;
	    }).catch(function (reason) {
	      throw 'whoops ' + reason;
	    })

			.then(function (result) {
	      expect(result).toBe('ok :)');
	      done();
			});

    });

});

describe('promise finally', function () {

    it("testing finally", function(done) {

      var result = false;

      var promise = $promise(function (resolve, reject) {
        reject('foobar');
      })

      .finally(function (value) {
				expect(value).toBe('ok ;)');
        done();
      })

        .catch(function (value) {
          return ';)';
        })

        .then(function (value) {
          return 'ok ' + value;
        })

      ;

    });

});

describe('promise all', function () {

    it("list resolved", function(done) {

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

    it("list rejected", function(done) {

      $promise.all([
        $promise(function (resolve, reject) {
          setTimeout(function () {
            resolve('ok');
          }, 1);
        }),
        $promise(function (resolve, reject) {
          setTimeout(function () {
            reject('whoops');
          }, 1);
        })
      ])
        .catch(function (reason) {
          expect(reason).toBe('whoops');
          done();
        });
    });

    it("list mixed", function(done) {

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
          expect( results.join('.') ).toBe('foo.bar');
          done();
        });
    });

    it("list values", function(done) {

      var result = false;

      $promise.all([
        'foo',
        'bar'
      ])
        .then(function (results) {
          expect( results.join('.') ).toBe('foo.bar');
          done();
        });
    });

});

describe('promise then', function () {

    it("resolve", function(done) {

      var result = false;

      $promise(function (resolve, reject) {
        resolve('gogogo!');
      })

        .then(function (result) {
          return $promise.resolve(result);
        })

        .then(function (result) {
          expect(result).toBe('gogogo!');
          done();
        });

    });

    it("reject", function(done) {

      var result = false;

      $promise(function (resolve, reject) {
        resolve('gogogo!');
      })

        .then(function (result) {
          return $promise.reject('whoops!');
        })

        .catch(function (result) {
          expect(result).toBe('whoops!');
          done();
        });

    });

    it("when resolve", function(done) {

      var result = false;

      $promise(function (resolve, reject) {
        resolve('gogogo!');
      })

        .then(function (result) {
          return $promise.when(result);
        })

        .then(function (result) {
          expect(result).toBe('gogogo!');
          done();
        });

    });

    it("when reject", function(done) {

      var result = false;

      $promise(function (resolve, reject) {
        resolve('gogogo!');
      })

        .then(function (result) {
          return $promise.when(result).then(function () {
            throw 'whoops!';
          })
        })

        .catch(function (result) {
          expect(result).toBe('whoops!');
          done();
        });

    });

    it("$promise.resolve", function(done) {

      var result = false;

      $promise(function (resolve, reject) {
        resolve('gogogo!');
      })

        .then(function (result) {
          return $promise.resolve(result);
        })

        .then(function (result) {
          expect(result).toBe('gogogo!');
          done();
        });

    });

    it("$promise.reject", function(done) {

      var result = false;

      $promise(function (resolve, reject) {
        resolve('gogogo!');
      })

        .then(function (result) {
          return $promise.reject('whoops!');
        })

        .catch(function (result) {
          expect(result).toBe('whoops!');
          done();
        });

    });

});
