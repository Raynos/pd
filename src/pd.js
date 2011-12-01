!(function (exports) {
    "use strict";

    /*
        Base object to inherit from, exposes extend, make and beget as methods
    */
    var Base = {
        extend: operateOnThis(extend),
        make: operateOnThis(make),
        beget: operateOnThis(beget)
    };

    extend(getOwnPropertyDescriptors, {
        make: make,
        extend: extend,
        beget: beget,
        extendNatives: extendNatives,
        Name: Name,
        Base: Base
    });

    exports(getOwnPropertyDescriptors);

    /*
        pd will return all the own propertydescriptors of the object

        @param Object obj - object to get pds from.

        @return Object - A hash of key/propertyDescriptors
    */    
    function getOwnPropertyDescriptors(obj) {
        var keys = Object.getOwnPropertyNames(obj);
        var o = {};
        keys.forEach(function _each(key) {
            var pd = Object.getOwnPropertyDescriptor(obj, key);
            o[key] = pd;
        });
        return o;
    }

    /*
        Extend will extend the firat parameter with any other parameters 
        passed in. Only the own property names will be extended into
        the object

        @param Object target - target to be extended
        @arguments Array [target, ...] - the rest of the objects passed
            in will extended into the target

        @return Object - the target
    */
    function extend(target) {
        var objs = Array.prototype.slice.call(arguments, 1);
        objs.forEach(function (obj) {
            var props = Object.getOwnPropertyNames(obj);
            props.forEach(function (key) {
                target[key] = obj[key];
            });
        });
        return target;
    }

    /*
        make will call Object.create with the proto and pd(props)

        @param Object proto - the prototype to inherit from
        @arguments Array [proto, ...] - the rest of the arguments will
            be mixed into the object, i.e. the object will be extend
            with the objects

        @return Object - the new object
    */
    function make (proto) {
        var o = Object.create(proto);
        var args = [].slice.call(arguments, 1);
        args.unshift(o);
        extend.apply(null, args);
        return o;
    }

    /*
        beget will generate a new object from the proto, any other arguments
        will be passed to proto.constructor

        @param Object proto - the prototype to use for the new object
        @arguments Array [proto, ...] - the rest of the arguments will
            be passed into proto.constructor

        @return Object - the newly created object
    */
    function beget(proto) {
        var o = Object.create(proto);
        var args = Array.prototype.slice.call(arguments, 1);
        proto.constructor && proto.constructor.apply(o, args);
        return o;
    }

    /*
        defines a namespace object. This hides a "privates" object on object 
        under the "key" namespace

        @param Object object - object to hide a privates object on
        @param Object namespace - key to hide it under

        @author Gozala : https://gist.github.com/1269991

        @return Object privates
    */
    function defineNamespace(object, namespace) {
        var privates = Object.create(object), 
            base = object.valueOf;

        Object.defineProperty(object, 'valueOf', { 
            value: function valueOf(value) {
                if (value !== namespace || this !== object) {
                    return base.apply(this, arguments);
                } else {
                    return privates;
                }
            }
        });

        return privates;
    }

    /*
        Constructs a Name function, when given an object it will return a
        privates object. 

        @author Gozala : https://gist.github.com/1269991

        @return Function name
    */
    function Name() {
        var namespace = {};

        return function name(object) {
            var privates = object.valueOf(namespace);
            if (privates !== object) {
                return privates;
            } else {
                return defineNamespace(object, namespace);
            }
        };
    }

    /*
        Utility function, takes a function and returns a new function
            which will curry `this` as the first argument

        @param Function method - method to curry this on

        @return Function - new function which invokes method with `this`
    */
    function operateOnThis(method) {
        return function _onThis() {
            var args = [].slice.call(arguments);
            return method.apply(null, [this].concat(args));
        }
    }

    /*
        Will extend native objects with utility methods

        @param Boolean prototypes - flag to indicate whether you want to extend
            prototypes as well
    */
    function extendNatives(prototypes) {
        prototypes === true && (prototypes = ["make", "beget", "extend"]);

        if (!Object.getOwnPropertyDescriptors) {
            Object.defineProperty(Object, "getOwnPropertyDescriptors", {
                value: getOwnPropertyDescriptors,
                configurable: true
            });
        }

        [
            "extend",
            "make",
            "beget",
            "Name"
        ].forEach(function (name) {
            if (!Object[name]) {
                Object.defineProperty(Object, name, {
                    value: getOwnPropertyDescriptors[name],
                    configurable: true
                });
            }

            if (name !== "Name" && 
                !Object.prototype[name] &&
                prototypes.indexOf(name) !== -1
            ) {
                Object.defineProperty(Object.prototype, name, {
                    value: operateOnThis(getOwnPropertyDescriptors[name]),
                    configurable: true
                });
            }
        });

        return getOwnPropertyDescriptors;
    }

})(function (data) {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = data;
    } else {
        window.pd = data;
    }
});



