var pd = require("../src/pd.js").extendNatives(),
    assert = require("assert");
    
module.exports = {
    "test pd exists": function () {
        assert(pd);
        assert(pd.mixin);
        assert(pd.extend);
    },
    "test natives exists": function () {
        assert(Object.extend);
        assert.deepEqual(Object.extend, pd.extend);
        assert(Object.prototype.new);
        assert(Object.getOwnPropertyDescriptors);
        assert.deepEqual(Object.getOwnPropertyDescriptors, pd);
    },
    "test pd": function () {
        var obj = {
            "foo": "foobar",
            "baz": /something/,
            "faz": ["one", "two", "three"],
            "obj": {
                "baz": "booz"
            },
            get thing() {
                return 42;    
            },
            set thingtwo(v) {
                this._thingtwo = v;
            },
            get thingthree() {
                return 42;
            },
            set thingthree(v) {
                this._thingthree = v;
            }
        };
        var pds = pd(obj);
        Object.getOwnPropertyNames(pds).forEach(function (name) {
            assert.deepEqual(pds[name], Object.getOwnPropertyDescriptor(obj, name));
        });
    },
    "test pd.extend": function () {
        var o1 = {
            things: "foo"
        };
        var o2 = {
            otherThings: "bar",
            overwrite: "bad value"
        };
        var o3 = {
            moreThings: "baz",
            overwrite: "good value"
        };
        pd.extend(o1,o2,o3);
        assert.deepEqual(o1, {
            things: "foo",
            otherThings: "bar",
            moreThings: "baz",
            overwrite: "good value"
        });
    },
    "test pd.mixin": function () { 
        var Proto = {
            method: function () {
                return 42;
            },
            constructor: function () {
                this.a = true;
            }
        }
        
        var Mixin = {
            otherMethod: function () {
                return 43;
            },
            constructor: function () {
                this.b = true;
            }
        }
        pd.mixin(Proto, Mixin);
        var o = Proto.new();
        assert.equal(o.method(), 42);
        assert.equal(o.otherMethod(), 43);
        assert.equal(o.a, true);
        assert.equal(o.b, true);
    },
    "test .new": function () {
        var Proto = {
            method: function () {
                return 42;
            },
            constructor: function () {
                this.a = true;
            }
        }
        
        var o = Proto.new();
        assert.equal(o.method(), 42);
        assert.equal(o.a, true);
        assert(Proto.isPrototypeOf(o));
    }
};

if (!module.parent) {
    var tests = Object.keys(module.exports);
    var errors = []
    var success = []
    tests.forEach(function (test) {
        try {
            module.exports[test]();
            success.push(test);
        } catch (e) {
            errors.push(e);
        }
    });
    console.log("tests succeeded : ", success.length);
    console.log("errors : ", errors.length);
    errors.forEach(function (e) {
        console.dir(e);
        console.log(e.stack);
    });
};


