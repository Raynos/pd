var pd = require("../src/pd.js"),
    is = require("vows-is");

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
}

is.partial("property", function _partial(context, name) {
    return context.context("contains a " + name + " property that")
        .topic.is.property(name)
        .vow.it.should.be.ok;
});

is.partial("haspd", function _partial(context, name) {
    var o = {};
    o[name] = Object.getOwnPropertyDescriptor(obj, name);

    return context.
        vow.it.should.include.object(o);
});

var one = {
    "one": "faz",
    "three": "bar"
};

var two = {
    "two": "ni",
    "three": "baz"
};

var three = {
    "three": "bas",
    "four": "four"
};

var suite = is.suite("pd").batch()
    
    .context("pd")
        .topic.is(function() { return pd })
        .vow.it.should.be.a("function")
        .vow.it.should.have.property("merge")
        .vow.it.should.have.property("object")

        .context("pd({ })")
            .topic.is(function(pd) {
                return pd(obj);       
            })
            .vow.it.should.be.a("object")
            .partial("haspd", "foo")
            .partial("haspd", "baz")
            .partial("haspd", "faz")
            .partial("haspd", "obj")
            .partial("haspd", "thing")
            .partial("haspd", "thingtwo")
            .partial("haspd", "thingthree")
            .parent()

        .context("pd.merge(one, two, three)")
            .topic.is(function(pd) {
                return pd.merge(one, two, three); 
            })
            .vow.it.should.include.object({"one": "faz"})
            .vow.it.should.include.object({"two": "ni"})
            .vow.it.should.include.object({"three": "bas"})
            .vow.it.should.include.object({"four": "four"})
            .parent()
        
        .context("pd.object(one)")
            .topic.is(function(pd) {
                return pd.object(one);
            })
            .vow.it.should.have.property("one", "faz")
            .vow.it.should.have.property("three", "bar")
            .parent()

.suite();

if (module.parent) {
    suite.export(module);
} else {
    suite.run({
        reporter: is.reporter
    })
}
