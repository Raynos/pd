!(function _anonymousWrapper(global) {
    "use strict";

    /*
        Base object to inherit from, exposes extend, make and beget as methods
    */
    var Base = {
            extend: operateOnThis(extend),
            make: operateOnThis(make),
            beget: operateOnThis(beget)
        },
        Object = global.Object,
        slice = [].slice,
        call = Function.prototype.call,
        getOwnPropertyNames = call.bind(Object.getOwnPropertyNames, Object),
        getOwnPropertyDescriptor = 
            call.bind(Object.getOwnPropertyDescriptor, Object),
        create = call.bind(Object.create, Object),
        defineProperty = call.bind(Object.defineProperty, Object);

    extend(getOwnPropertyDescriptors, {
        make: make,
        extend: extend,
        beget: beget,
        extendNatives: extendNatives,
        Name: Name,
        Base: Base
    });

    if (typeof module !== "undefined" && module.exports) {
        module.exports = getOwnPropertyDescriptors;
    } else {
        global.pd = getOwnPropertyDescriptors;
    }

    /*
        pd will return all the own propertydescriptors of the object

        @param Object object - object to get pds from.

        @return Object - A hash of key/propertyDescriptors
    */    
    function getOwnPropertyDescriptors(object) {
        var keys = getOwnPropertyNames(object),
            returnObj = {};

        keys.forEach(getPropertyDescriptor);

        return returnObj;

        function getPropertyDescriptor(key) {
            var pd = getOwnPropertyDescriptor(object, key);
            returnObj[key] = pd;
        }
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
        var objs = slice.call(arguments, 1);

        objs.forEach(extendTarget);

        return target;

        function extendTarget(obj) {
            var props = getOwnPropertyNames(obj);
            props.forEach(function (key) {
                target[key] = obj[key];
            });
        }
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
        var returnObj = create(proto),
            args = slice.call(arguments, 1);

        args.unshift(returnObj);
        extend.apply(null, args);

        return returnObj;
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
        var returnObj = create(proto),
            args = slice.call(arguments, 1),
            constructor = proto.constructor;

        if (constructor) {
            constructor.apply(returnObj, args);
        }

        return returnObj;
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
        var privates = create(object), 
            base = object.valueOf;

        defineProperty(object, 'valueOf', {
            value: valueOf
        });

        return privates;

        function valueOf(value) {
            if (value !== namespace || this !== object) {
                return base.apply(this, arguments);
            } else {
                return privates;
            }
        }
    }

    /*
        Constructs a Name function, when given an object it will return a
        privates object. 

        @author Gozala : https://gist.github.com/1269991

        @return Function name
    */
    function Name() {
        var namespace = {};

        return name;

        function name(object) {
            var privates = object.valueOf(namespace);
            if (privates !== object) {
                return privates;
            } else {
                return defineNamespace(object, namespace);
            }
        }
    }

    /*
        Utility function, takes a function and returns a new function
            which will curry `this` as the first argument

        @param Function method - method to curry this on

        @return Function - new function which invokes method with `this`
    */
    function operateOnThis(method) {
        return onThis;

        function onThis() {
            var args = slice.call(arguments);
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
            define(Object, "getOwnPropertyDescriptors",
                getOwnPropertyDescriptors);
        }

        ["extend", "make", "beget", "Name"].forEach(injectIntoGlobals);

        return getOwnPropertyDescriptors;

        function define(obj, name, value) {
            defineProperty(obj, name, {
                value: value,
                configurable: true
            });
        }

        function injectIntoGlobals(name) {
            var value = getOwnPropertyDescriptors[name],
                objectProto = Object.prototype;

            if (!Object[name]) {
                define(Object, name, value);
            }

            if (name !== "Name" && 
                !objectProto[name] &&
                prototypes.indexOf(name) !== -1
            ) {
                define(objectProto, name, operateOnThis(value));
            }
        }
    }

})(global || window);