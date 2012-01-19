(function (Object, slice) {
    "use strict";
    
    extend(pd, {
        bindAll: bindAll,
        extend: extend,
        Name: Name
    });
    
    typeof window !== "undefined" ? window.pd = pd : module.exports = pd;

    /*
        pd will return all the own propertydescriptors of the object

        @param Object object - object to get pds from.

        @return Object - A hash of key/propertyDescriptors
    */    
    function pd(obj, retObj) {
        retObj = {};
        Object.getOwnPropertyNames(obj).forEach(function(key) {
            var pd = Object.getOwnPropertyDescriptor(obj, key);
            retObj[key] = pd;
        });
        return retObj;
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
        slice.call(arguments, 1).forEach(function(source) {
            Object.defineProperties(target, pd(source));
        });
        return target;
    }

    /*
        defines a namespace object. This hides a "privates" object on object 
        under the "key" namespace

        @param Object object - object to hide a privates object on
        @param Object namespace - key to hide it under

        @author Gozala : https://gist.github.com/1269991

        @return Object privates
    */
    function namespace(obj, key) {
        var store = Object.create(obj),
            valueOf = obj.valueOf;
        
        Object.defineProperty(obj, "valueOf", {
            value: function(value) {
                return value !== key ? valueOf.apply(this, arguments) : store;
            },
            writable: true
        });
        
        return store;
    }
    
    /*
        Constructs a Name function, when given an object it will return a
        privates object. 

        @author Gozala : https://gist.github.com/1269991

        @return Function name
    */
    function Name() {
        var key = {};
        return function name(obj) {
            var store = obj.valueOf(key);
            return store !== obj ? store : namespace(obj, key)
        }
    }
    
    /*
        bindAll binds all methods to have their context set to the object

        @param Object obj - the object to bind methods on
        @param Array methods - optional whitelist of methods to bind

        @return Object - the bound object
    */
    function bindAll(obj, whitelist) {
        (whitelist || Object.keys(obj).filter(function(key) {
            return obj[key].call;
        })).forEach(function(name) {
            obj[name] = obj[name].bind(obj)
        });
        
        return obj;
    }   
})(Object, [].slice);