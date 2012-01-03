var slice = [].slice;

extend(getOwnPropertyDescriptors, {
    "bindAll": bindAll,
    "extend": extend,
    "Name": Name
});

module["exports"] = getOwnPropertyDescriptors;

/*
    pd will return all the own propertydescriptors of the object

    @param Object object - object to get pds from.

    @return Object - A hash of key/propertyDescriptors
*/    
function getOwnPropertyDescriptors(object) {
    var keys = Object.getOwnPropertyNames(object),
        returnObj = {};

    keys.forEach(getPropertyDescriptor);

    return returnObj;

    function getPropertyDescriptor(key) {
        var pd = Object.getOwnPropertyDescriptor(object, key);
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

    function extendTargetWithProperties(source) {
        Object.getOwnPropertyNames(source).forEach(extendTarget);
        
        function extendTarget(key) {
            Object.defineProperty(target, key, 
                Object.getOwnPropertyDescriptor(source, key));
        }
    }
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
    var privates = Object.create(object), 
        base = object.valueOf;

    Object.defineProperty(object, 'valueOf', {
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