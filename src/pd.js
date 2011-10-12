// ## [Github Repo](https://github.com/Raynos/pd)

// pd converts all the values of the properties into propertydescriptors
var pd = function _pd(obj) {
    var keys = Object.getOwnPropertyNames(obj);
    var o = {};
    keys.forEach(function _each(key) {
        var pd = Object.getOwnPropertyDescriptor(obj, key);
        o[key] = pd;
    });
    return o;
};

// Extend natives. This implements the getOwnPropertyDescriptors as defined in es.next
pd.extendNatives = function _extendNatives() {
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
    if (!Object.prototype.new) {
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

// Mixin does the same as pd.extend except it will
// overwrite the constructor target with the composition 
// of the constructor of target and the constructor of source
pd.mixin = function (target, source) {
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

// Extend is an n-ary operator that extends the first argument
// with the own properties of the other arguments
// returns the first argument
pd.extend = function (target) {
    var objs = Array.prototype.slice.call(arguments, 1);
    objs.forEach(function (obj) {
        var props = Object.getOwnPropertyNames(obj);
        props.forEach(function (key) {
            target[key] = obj[key];
        });
    });
    return target;
};

if ("undefined" !== typeof module && module.exports) {
    module.exports = pd;
} else {
    window.pd = pd;
}