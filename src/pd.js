!function _anonymousWrapper() {
    "use strict";

    /*
        Base object to inherit from, exposes extend, make and beget as methods
    */
    var Base = {},
        slice = [].slice,
        call = Function.prototype.call,
        getOwnPropertyNames = call.bind(Object.getOwnPropertyNames, Object),
        getOwnPropertyDescriptor = 
            call.bind(Object.getOwnPropertyDescriptor, Object),
        create = call.bind(Object.create, Object),
        defineProperty = call.bind(Object.defineProperty, Object);

    extend(getOwnPropertyDescriptors, {
        Base: Base,
        beget: beget,
        bindAll: bindAll,
        extend: extend,
        extendNatives: extendNatives,
        make: make,
        Name: Name
    });
    
    extend(Base, {
        beget: operateOnThis(beget),
        bindAll: operateOnThis(bindAll),
        extend: operateOnThis(extend),
        make: operateOnThis(make)
    });

    if (typeof module !== "undefined" && module.exports) {
        module.exports = getOwnPropertyDescriptors;
    } else {
        window.pd = getOwnPropertyDescriptors;
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

        objs.forEach(extendTargetWithProperties);

        return target;

        function extendTargetWithProperties(obj) {
            var props = getOwnPropertyNames(obj);
            props.forEach(extendTarget);
            
            function extendTarget(key) {
                target[key] = obj[key];
            }
        }
    }

    /*
        make will call Object.create with the proto and pd(props)
        
        Note, make also fixes the constructor <-> prototype link.

        @param Object proto - the prototype to inherit from
        @arguments Array [proto, ...] - the rest of the arguments will
            be mixed into the object, i.e. the object will be extend
            with the objects

        @return Object - the new object
    */
    function make(proto) {
        var returnObj = create(proto),
            args = slice.call(arguments, 1);

        args.unshift(returnObj);
        extend.apply(null, args);
        proto.constructor && proto.constructor.prototype = proto;

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
        bindAll binds all methods to have their context set to the object

        @param Object obj - the object to bind methods on
        @param Array methods - optional whitelist of methods to bind

        @return Object - the bound object
    */
    function bindAll(obj, whitelist) {
        var keys = Object.keys(obj).filter(stripNonMethods);

        (whitelist || keys).forEach(bindMethod);

        function stripNonMethods(name) {
            return typeof obj[name] === "function";
        }

        function bindMethod(name) {
            obj[name] = obj[name].bind(obj);
        }

        return obj;
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
        if (prototypes === true) {
            prototypes = ["make", "beget", "extend", "bindAll"];
        }

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
                thisValue = operateOnThis(value),
                objectProto = Object.prototype;

            if (!Object[name]) {
                define(Object, name, value);
            }

            if (!objectProto[name] &&
                prototypes.indexOf(name) !== -1
            ) {
                define(objectProto, name, thisValue);
            }
        }
    }

}();