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


