var unexpected = require('unexpected');
var unexpectedFs = require('../');

describe('unexpected-fs', function () {
    describe('with fs mocked out', function () {
        var fileContent = function (fileName) {
            var fs = require('fs');

            return fs.readFileSync('/' + fileName, 'utf-8');
        };

        var expect = unexpected
            .clone()
            .installPlugin(unexpectedFs);

        it('should not throw', function () {
            return expect('foobar.txt', 'with fs mocked out', {
                '/foobar.txt': 'Foobar!'
            }, 'when passed as parameter to', fileContent, 'to equal', 'Foobar!');
        });

        describe('mock.file proxy', function () {
            it('should realise that an object is a file', function () {
                return expect(function () {
                    var fs = require('fs');
                    expect(fs.readFileSync('/foo.txt', 'utf-8'), 'to satisfy', 'foobar!');
                    expect(fs.statSync('/foo.txt'), 'to satisfy', {
                        ctime: new Date(1)
                    });
                }, 'with fs mocked out', {
                    '/foo.txt': {
                        _isFile: true,
                        ctime: new Date(1),
                        content: 'foobar!'
                    }
                }, 'not to throw');
            });
        });
    });
    describe('does it update already exisitng fs modules?', function () {
        it('huh?', function () {
            var fs = require('fs');
            var someMethod = function (fileName) {
                return fs.readFileSync('/' + fileName, 'utf-8');
            };

            var expect = unexpected
                .clone()
                .installPlugin(unexpectedFs);
            return expect('doesIt.txt', 'with fs mocked out', {
                '/doesIt.txt': 'Yes it does!'
            }, 'when passed as parameter to', someMethod, 'to equal', 'Yes it does!');
        });
    });
});
