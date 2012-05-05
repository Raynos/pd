var slice = Array.prototype.slice

/*
    pd {
        bindAll: function that binds all the methods of an object to the object
        extend: function that extends the first argument with the rest
        Name: returns a namespace(anyKey) -> uniqueObject function
        memoize: returns a memoized version of the function
    }
*/
module.exports = {
    bindAll: bindAll,
    extend: extend,
    Name: Name,
    memoize: asyncMemoize
}

/*
    Extend will extend the first parameter with any other parameters 
    passed in. Only the own property names will be extended into
    the object

    @param Object target - target to be extended
    @arguments Array [target, ...] - the rest of the objects passed
        in will extended into the target

    @return Object - the target
*/
function extend(target) {
    slice.call(arguments, 1).forEach(function(source) {
        Object.getOwnPropertyNames(source).forEach(function (name) {
            target[name] = source[name]
        })
    })
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
    extend.apply(null, arguments) 
    Object.keys(obj).filter(isMethod).forEach(bindMethods)
    return obj
    
    function isMethod(name) {
        return obj[name] && obj[name].bind === isMethod.bind
    }
    
    function bindMethods(name) {
        obj[name] = obj[name].bind(obj)
    }
}

/*
    default hasher for memoize. Takes the first arguments and returns it
        if it's a string, otherwise returns the string "void"

    @param Any x - argument to hash on

    @return String - a hash key
*/
function defaultHasher(x) { 
    if (typeof x === "object" || typeof x === "function" ||
            typeof x === "undefined"
    ) {
        return "void"
    }
    return x.toString()
}

/*
    memoizes asynchronous functions. The asynchronous function must have
        a callback as a last argument, and that callback must be called.
    
    Memoization means that the function you pass in will only be called once
        for every different type of argument. If the async function only
        has a callback argument then it will only be called once. The 
        results of invocation are cached

    @param Function fn - function to memoize
    @param Object context - optional context for the function
    @param Function hasher - optional custom hasher function. This will
        be called on the arguments of the memoized function. The result
        of the hasher will be the key the cached data will be stored under.

    @return Function - the memoized function
*/
function asyncMemoize(fn, context, hasher) {
    var caches = callProxy.cache = {},
        callbackLists = {}

    if (typeof context === "function") {
        hasher = context
        context = null
    }

    if (typeof hasher === "undefined") {
        hasher = defaultHasher
    }

    return callProxy

    function callProxy() {
        var args = [].slice.call(arguments),
            cb = args.pop(),
            key = hasher.apply(null, args)

        if (caches[key]) {
            return typeof cb === "function" && cb.apply(null, caches[key])
        } else if (callbackLists[key]) {
            return callbackLists[key].push(cb)
        }

        callbackLists[key] = [cb]

        args.push(callbackProxy)

        fn.apply(context, args)

        function callbackProxy() {
            caches[key] = arguments
            var list = callbackLists[key]
            delete callbackLists[key]
            // it might undefined >_< if the callback is blocking
            list && list.forEach(function (cb) {
                typeof cb === "function" && cb.apply(this, caches[key])
            }, this)
        }
    }
}