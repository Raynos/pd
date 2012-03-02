/*
    pd(obj) -> propertyDescriptorsOfObject {
        bindAll: function that binds all the methods of an object to the object,
        extend: function that extends the first argument with the rest
        Name: returns a namespace(anyKey) -> uniqueObject function
    }
    
    pd requires ES5. Uses the shimmable subset of ES5.
*/
;(function (Object, slice) {
    "use strict"
    
    pd.bindAll = bindAll
    pd.extend = extend
    pd.Name = Name
    
    typeof module !== "undefined" ? module.exports = pd : window.pd = pd

    /*
        pd will return all the own propertydescriptors of the object

        @param Object object - object to get pds from.

        @return Object - A hash of key/propertyDescriptors
    */    
    function pd(obj) {
        var pds = {}
        Object.getOwnPropertyNames(obj).forEach(function(key) {
            pds[key] = Object.getOwnPropertyDescriptor(obj, key)
        })
        return pds
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
            Object.defineProperties(target, pd(source))
        });
        return target
    }

    /*
        defines a namespace object. This hides a "privates" object on object 
        under the "key" namespace

        @param Object object - object to hide a privates object on
        @param Object key - key to hide it under

        @author Gozala : https://gist.github.com/1269991

        @return Object privates
    */
    function namespace(object, key) {
        var privates = Object.create(object),
            valueOf = object.valueOf
        
        Object.defineProperty(object, "valueOf", {
            value: function(value) {
                return value !== key ? valueOf.apply(this, arguments) : privates
            },
            writable: true,
            configurable: true
        })
        
        return privates
    }
    
    /*
        Constructs a Name function, when given an object it will return a
        privates object. 

        @author Gozala : https://gist.github.com/1269991

        @return Function name
    */
    function Name() {
        var key = {}
        return name
        
        function name(object) {
            var privates = object.valueOf(key)
            return privates !== object ? privates : namespace(object, key)
        }
    }
    
    /*
        bindAll binds all methods to have their context set to the object

        @param Object obj - the object to bind methods on
        @arguments Array [target, ...] - the rest of the objects passed
            in will extended into the obj

        @return Object - the bound object
    */
    function bindAll(obj) {
        pd.extend.apply(null, arguments) 
        Object.keys(obj).filter(isMethod).forEach(bindMethods)
        return obj
        
        function isMethod(name) {
            return obj[name] && obj[name].bind === isMethod.bind
        }
        
        function bindMethods(name) {
            obj[name] = obj[name].bind(obj)
        }
    }

})(Object, [].slice)