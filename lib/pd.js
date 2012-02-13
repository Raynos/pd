/*
    pd(obj) -> propertyDescriptorsOfObject {
        bindAll: function that binds all the methods of an object to the object,
        extend: function that extends the first argument with the rest
        Name: returns a namespace(anyKey) -> uniqueObject function
    }
    
    pd requires ES5. Uses the shimmable subset of ES5.
*/
(function (Object, slice, letters) {
    "use strict";
    
    pd.bindAll = bindAll;
    pd.extend = extend;
    pd.Name = Name;
    pd.mixin = mixin;
    pd.combine = combine;
    
    typeof module !== "undefined" ? module.exports = pd : window.pd = pd;

    /*
        pd will return all the own propertydescriptors of the object

        @param Object object - object to get pds from.

        @return Object - A hash of key/propertyDescriptors
    */    
    function pd(obj, pds) {
        pds = {};
        Object.getOwnPropertyNames(obj).forEach(function(key) {
            pds[key] = Object.getOwnPropertyDescriptor(obj, key);
        });
        return pds;
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

    function mixin(target) {
        slice.call(arguments, 1).forEach(function (source) {
            var constructor;
            if (source.constructor && target.constructor) {
                constructor = combine(target.constructor, source.constructor);
            }
            Object.defineProperties(target, pd(source));
            constructor && (target.constructor = constructor);
        });
        return target;
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
            valueOf = object.valueOf;
        
        Object.defineProperty(object, "valueOf", {
            value: function(value) {
                return value !== key ? valueOf.apply(this, arguments) : privates;
            },
            writable: true
        });
        
        return privates;
    }
    
    /*
        Constructs a Name function, when given an object it will return a
        privates object. 

        @author Gozala : https://gist.github.com/1269991

        @return Function name
    */
    function Name(key) {
        key = {};
        return name;
        
        function name(object) {
            var privates = object.valueOf(key);
            return privates !== object ? privates : namespace(object, key)
        }
    }
    
    /*
        bindAll binds all methods to have their context set to the object

        @param Object obj - the object to bind methods on
        @param Array whitelist - optional whitelist of methods to bind

        @return Object - the bound object
    */
    function bindAll(obj, whitelist) {
        (whitelist || Object.keys(obj).filter(isMethod)).forEach(bindMethods);
        
        return obj;
        
        function isMethod(key) {
            return obj[key] && obj[key].bind === isMethod.bind;
        }
        
        function bindMethods(name) {
            obj[name] = obj[name].bind(obj)
        }
    }
    
    function construct(len, source, f1, f2) {
        var argSig = letters.slice(0, len).join(',');

        return Function(
            "f, g",
            "return function(" + argSig + source
        )(f1, f2);
    }

    function combine(f1, f2, pre)  {
        var len, source = "){",
            apply_string = ".apply(this, arguments);",
            create_r_string = "var r = ",
            return_r_string = "return r; }";

        if (pre) {
            len = f2.length;
            source += ("f" + apply_string + create_r_string);
        } else {
            len = f1.length;
            source += (create_r_string + "f" + apply_string);
        }

        source += ("g" + apply_string + return_r_string);
        
        return construct(len, source, f1, f2);
    }

})(Object, [].slice, "abcdefghijklmnopqrstuvwxyz".split(""));