var request = require('supertest'),
	app = require('../../app/v1/app').app,
	exec = require('child_process').exec,
	execSync = require('child_process').execSync,
	containerHash = '';

before(function (done) {
	exec('docker run -p 27017:27017 -d mongo', { encoding: 'utf8' }, function(err, stdout){
		console.log('container started...');
		containerHash = stdout.trim();
		execSync("docker run --rm mongo /bin/sh -c \"mongo --eval 'db.leafdata.createIndex( { key: 1 } )' 192.168.59.104\"");
		done();
	});
});

describe('update a root keyval', function(){

	it('should pass with a proper message body', function(done){

		request(app)
		.put('/foo')
		.send({value: 'bar'})
		.expect(201)
		.expect('content-type', /json/)
		.end(done);

	});

	it('pass with a pre-existing key', function(done){

		request(app)
		.put('/world/na/us/az/name')
		.send({value: 'Arizona'})
		.expect(201)
		.expect('content-type', /json/)
		.end(done);

	});

	it('should fail if key has ending slash', function(done){

		request(app)
		.put('/test/')
		.send({value: 'ing'})
		.expect(400)
		.expect('content-type', /json/)
		.end(done);

	});

	it('should fail with an empty message body', function(done){

		request(app)
		.put('/foo')
		.expect(400)
		.expect('content-type', /json/)
		.end(done);

	});

});

describe('update a nested key/val', function(){

	it('should pass with a proper message body', function(done){

		request(app)
		.put('/world/na/us/az/name')
		.send({value: 'Arizona'})
		.expect(201)
		.expect('content-type', /json/)
		.end(done);

	});

	it('pass with a pre-existing key', function(done){

		request(app)
		.put('/world/na/us/az/name')
		.send({value: 'Arizona'})
		.expect(201)
		.expect('content-type', /json/)
		.end(done);

	});

	it('should fail if key has ending slash', function(done){

		request(app)
		.put('/world/na/us/az/name/')
		.send({value: 'Arizona'})
		.expect(400)
		.expect('content-type', /json/)
		.end(done);

	});

	it('should fail with an empty message body', function(done){

		request(app)
		.put('/world/na/us/az/name')
		.expect(400)
		.expect('content-type', /json/)
		.end(done);

	});

});

after(function (done) {
	exec('docker rm --force ' + containerHash, { encoding: 'utf8' }, function(){
		console.log('container stopped...');
		done();
	});
});

/*

201 = keyval set
204 = keyval deleted
404 = keyval not found
200 = keyval found
400 = bad request   i.e. missing msg body, invalid url etc etc





create a root key/val
* with a proper message body - should pass
* with an ending slash - should fail
* with an empty message body
* to a key/val that already exists

create a nested key/val to a new path
* with a proper message body - should pass
* for a key container - should fail
* with an ending slash - should fail
* with an empty message body - should fail
* to a key/val that already exists

create a nested key/val to a pre-existing path
* with a proper message body - should pass
* for a key container - should fail
* with an ending slash - should fail
* with an empty message body - should fail
* to a key/val that already exists

*/