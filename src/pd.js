/*
    pd will return all the own propertydescriptors of the object

    @param Object obj - object to get pds from.

    @return Object - A hash of key/propertyDescriptors
*/
var pd = function _pd(obj) {
    var keys = Object.getOwnPropertyNames(obj);
    var o = {};
    keys.forEach(function _each(key) {
        var pd = Object.getOwnPropertyDescriptor(obj, key);
        o[key] = pd;
    });
    return o;
};

/*
    Will extend native objects with utility methods

    @param Boolean prototypes - flag to indicate whether you want to extend
        prototypes as well
*/
pd.extendNatives = function _extendNatives(prototypes) {
    if (!Object.getOwnPropertyDescriptors) {
        Object.defineProperty(Object, "getOwnPropertyDescriptors", {
            value: pd,
            configurable: true
        });
    }
    if (!Object.extend) {
        Object.defineProperty(Object, "extend", {
            value: pd.extend,
            configurable: true
        });
    }
    if (!Object.make) {
        Object.defineProperty(Object, "make", {
            value: pd.make,
            configurable: true
        });
    }
    if (!Object.prototype.new && prototypes) {
        Object.defineProperty(Object.prototype, "new", {
            value: function _new() {
                var o = Object.create(this);
                o.constructor && o.constructor.apply(o, arguments);
                return o;
            }, 
            configurable: true
        });
    }
    return pd;
};
/*
    Mixin is similar to Extend except it will combine the two constructor
    functions to ensure that the mixin is also constructed.

    @param Object target - target which the source will be mixed into
    @param Object source - the mixin

    @return Object - the target
*/
pd.mixin = function _mixin(target, source) {
    var constructorTarget = target.constructor,
        constructorSource = source.constructor;
        
    pd.extend(target, source);
    if (constructorTarget && constructorSource) {
        target.constructor = function _constructor() {
            var ret = constructorTarget.apply(this, arguments);
            constructorSource.apply(this, arguments);
            return ret;
        };
    };
    return target;
};
/*
    Extend will extend the firat parameter with any other parameters 
    passed in. Only the own property names will be extended into
    the object

    @param Object target - target to be extended
    @arguments Array [target, ...] - the rest of the objects passed
        in will extended into the target

    @return Object - the target
*/
pd.extend = function _extend(target) {
    var objs = Array.prototype.slice.call(arguments, 1);
    objs.forEach(function (obj) {
        var props = Object.getOwnPropertyNames(obj);
        props.forEach(function (key) {
            target[key] = obj[key];
        });
    });
    return target;
};

/*
    new will generate a new object from the proto, any other arguments
    will be passed to proto.constructor

    @param Object proto - the prototype to use for the new object
    @arguments Array [proto, ...] - the rest of the arguments will
        be passed into proto.constructor

    @return Object - the newly created object
*/
pd.new = function _new(proto) {
    var o = Object.create(proto);
    var args = Array.prototype.slice.call(arguments, 1);
    proto.constructor && proto.constructor.apply(o, args);
    return o;
};

/*
    make will call Object.create with the proto and pd(props)

    @param Object proto - the prototype to inherit from
    @param Object props - properties to extend the new object with

    @return Object - the new object
*/
pd.make = function _make (proto, props) {
    return Object.create(proto, pd(props));
};

if ("undefined" !== typeof module && module.exports) {
    module.exports = pd;
}