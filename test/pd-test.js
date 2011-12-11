var pd = require("../src/pd.js").extendNatives(true),
    tester = require("tester"),
    assert = require("assert");
    
module.exports = {
    "test pd exists": function () {
        assert(pd);
        assert(pd.beget);
        assert(pd.make);
        assert(pd.Name);
        assert(pd.extend);
        assert(pd.extendNatives);
    },
    "test natives exists": function () {
        assert(Object.extend);
        assert.deepEqual(Object.extend, pd.extend);
        assert(Object.prototype.beget);
        assert(Object.beget);
        assert.deepEqual(Object.beget, pd.beget);
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
        var o4 = {};

        pd.extend(o4, o1,o2,o3);
        assert.deepEqual(o4, {
            things: "foo",
            otherThings: "bar",
            moreThings: "baz",
            overwrite: "good value"
        });

        o1.extend(o2, o3);
        assert.deepEqual(o1, {
            things: "foo",
            otherThings: "bar",
            moreThings: "baz",
            overwrite: "good value"
        });
    },
    "test .beget": function () {
        var Proto = {
            method: function () {
                return 42;
            },
            constructor: function () {
                this.a = true;
            }
        }
        
        var o = Proto.beget();
        assert.equal(o.method(), 42);
        assert.equal(o.a, true);
        assert(Proto.isPrototypeOf(o));

        var o = pd.beget(Proto);
        assert.equal(o.method(), 42);
        assert.equal(o.a, true);
        assert(Proto.isPrototypeOf(o));        
    },
    "test make": function () {
        var Proto = {};
        var o = pd.make(Proto, {
            "one": "two",
            "three": Proto
        });
        assert(Proto.isPrototypeOf(o));
        assert(o.hasOwnProperty("one"));
        assert(o.one === "two");
        assert(o.three === Proto);
        assert(o.hasOwnProperty("three"));

        var o = Proto.make({
            "one": "two",
            "three": Proto 
        });
        assert(Proto.isPrototypeOf(o));
        assert(o.hasOwnProperty("one"));
        assert(o.one === "two");
        assert(o.three === Proto);
        assert(o.hasOwnProperty("three"));
    },
    "test Base": function () {
        var Child = pd.Base.make({
            foo: "bar"
        });

        Child.extend({ "baz": "boz"});
        assert(Child.baz === "boz");

        var c = Child.beget();
        assert(c.foo === "bar");
    },
    "test bindAll": function () {
        var o = {
            foo: function () { return this; },
            bar: function () { return this; },
            baz: function () { return this; }
        };

        var one = pd.extend({}, o);
        pd.bindAll(one);
        var foo = one.foo;
        var bar = one.bar;
        assert(foo() === one);
        assert(bar() === one);

        var two = pd.extend({}, o);
        pd.bindAll(two, ["bar"]);
        var foo = two.foo;
        var bar = two.bar;
        assert(foo() === global);
        console.log(two.bar === o.bar);
        assert(bar() === two);
    }
};

if (!module.parent) {
    tester(module.exports);
};


