var pd = require("../lib/pd.js"),
    assert = require("assert");
    
suite("pd", function () {
    test("pd exists", function () {
        assert(pd)
        assert(pd.Name)
        assert(pd.extend)
        assert(pd.bindAll)
    })

   

    test("pd.extend", function () {
        var o1 = {
            things: "foo"
        }
        var o2 = {
            otherThings: "bar",
            overwrite: "bad value"
        }
        var o3 = {
            moreThings: "baz",
            overwrite: "good value"
        }
        var o4 = {}

        pd.extend(o4, o1,o2,o3)
        assert.deepEqual(o4, {
            things: "foo",
            otherThings: "bar",
            moreThings: "baz",
            overwrite: "good value"
        })

        pd.extend(o1, o2, o3)
        assert.deepEqual(o1, {
            things: "foo",
            otherThings: "bar",
            moreThings: "baz",
            overwrite: "good value"
        })
    })

    test("bindAll", function () {
        var o = {
            foo: function () { return this; },
            bar: function () { return this; },
            baz: function () { return this; }
        }

        var one = pd.extend({}, o)
        pd.bindAll(one)
        var foo = one.foo
        var bar = one.bar
        assert(foo() === one)
        assert(bar() === one)

        var two = pd.extend({}, o)
        pd.bindAll(two, {
            boo: function () { return this }
        })
        var foo = two.foo
        var boo = two.boo
        assert(foo() === two)
        assert(boo() === two)
    })

    test("Name", function () {
        var name = pd.Name()
        name(name).foo = 42
        assert(name(name).foo === 42)
    })

    test("memoize", function (done) {
        var counter = 0,
            nextCounter = 3

        var foo = function (cb) {
            assert(this.apples === "potatoes")
            counter++
            cb()
        }

        var bar = pd.memoize(foo, { apples: "potatoes" })

        bar()
        bar()
        bar()

        var complex = function (name, cb) {
            setTimeout(function () {
                counter++
                cb(name * 2, name + "b", 42)
            }, 500)
        }

        var bar = pd.memoize(complex)

        bar("foo", function (nan, b, world) {
            assert(isNaN(nan))
            assert(world === 42)
            assert(b === "foob")
            next()
        })

        bar("baz", function (nan, b, world) {
            assert(isNaN(nan))
            assert(world === 42)
            assert(b === "bazb")  
            next()
        })

        bar("foo", function (nan, b, world) {
            assert(isNaN(nan))
            assert(world === 42)
            assert(b === "foob")
            next()
        })

        function next() {
            if (--nextCounter === 0) {
                assert(counter === 3)
                done()
            }
        }

        assert(counter === 1)
    })

    test("memoize with function", function (done) {
        var count = 0,
            nextCount = 2

        var foo = pd.memoize(function (cb) {
            setTimeout(function () {
                count++
                cb({ foo: "foo" }, { bar: "bar" })
            }, 500)
        })

        foo(function (foo, bar) {
            assert(foo.foo === "foo")
            assert(bar.bar === "bar")
            next()
        })

        foo(function (foo, bar) {
            assert(foo.foo === "foo")
            assert(bar.bar === "bar")
            next()
        })

        function next() {
            if (--nextCount === 0) {
                assert(count === 1)
                done()
            }
        }
    })
})


