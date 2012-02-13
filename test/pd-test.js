var pd = require("../lib/pd.js"),
    assert = require("assert");
    
suite("pd", function () {
    test("pd exists", function () {
        assert(pd);
        assert(pd.Name);
        assert(pd.extend);
        assert(pd.bindAll);
    });

    test("pd", function () {
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
    });

    test("pd.extend", function () {
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

        pd.extend(o1, o2, o3);
        assert.deepEqual(o1, {
            things: "foo",
            otherThings: "bar",
            moreThings: "baz",
            overwrite: "good value"
        });
    });

    test("bindAll", function () {
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
        assert(bar() === two);
    });

    test("Name", function () {
        var name = pd.Name();
        name(name).foo = 42;
        assert(name(name).foo === 42);
    });

    test("mixin", function () {
        var o = {
            constructor: function () {
                this.foo = "foo";
                return this;
            }
        };

        var p = {
            constructor: function () {
                this.bar = "bar";
                return this;
            }
        };

        pd.mixin(o, p);

        o.constructor();
        assert.equal(o.foo, "foo");
        assert.equal(o.bar, "bar");
    });
});


