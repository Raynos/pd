# pd <a name="_pd" href="#_pd"><small><sup>link</sup></small></a>

A small utility for writing OO javascript.

pd is short for property descriptor.

It converts objects into property descriptors. So you can create objects like:

    var o = Object.create(somePrototype, pd({
        "someProp": "someValue"
        get someGetter() {
            
        },
        set someSetter() {
            
        }
    }));
    
## Blog posts <a name="Blog_posts" href="#Blog_posts"><small><sup>link</sup></small></a>

 - [Doing Object Oriented JavaScript][3]

## Examples <a name="Examples" href="#Examples"><small><sup>link</sup></small></a>



 - [vows-fluent annotated code][2] **OUTDATED uses pd 0.1.1**

## Documentation <a name="Documentation" href="#Documentation"><small><sup>link</sup></small></a>

See the [annotated source code][1] **OUTDATED shows pd 0.1.1** 

### pd (obj) <a name="pd" href="#pd"><small><sup>link</sup></small></a>

pd converts all the values of your objects properties into propertydescriptors of those values.

    pd({
        "foo": "bar"
    })

is the same as

    {
        "foo": {
            "value": "bar",
            "enumerable": true,
            "writable": true,
            "configurable": true
        }
    }

### pd.extend (obj..) <a name="pd.extend" href="#pd.extend"><small><sup>link</sup></small></a>

pd.extend extends an object with other objects. key clashes are given right preference

    pd.extend(
        {
            "one": "faz",
            "three": "bar"
        },
        {
            "two": "ni",
            "three": "baz"
        },
        {
            "three": "bas",
            "four": "four"
        }
    );

is the same as

    {
        "one": "faz",
        "two": "ni",
        "three": "bas",
        "four": "four"
    }
    
pd.extend returns the first object you pass in.

### pd.mixin (target, source) <a name="pd.mixin" href="#pd.mixin"><small><sup>link</sup></small></a>

pd.mixin is virtually the same as pd.extend however it only takes two arguments and it will overwrite
the constructor property of target with the function composition of target.constructor and source.constructor.

    pd.mixin(SomeProto, {
      addThisMethod: function () { },
      constructor: function () { 
        // invoke this constructor code after SomeProto.constructor
      }
    });
    
### pd.extendNatives <a name="pd.extendNatives" href="#pd.extendNatives"><small><sup>link</sup></small></a>

pd.extendNatives extends some native objects and then returns pd.

Specifically it will set the following if they don't exist

 - Object.extend (same as pd.extend)
 - Object.getOwnPropertyDescriptors (same as pd)
 - Object.prototype.new (explained below)
 
`Object.prototype.new` generates a new object by calling `Object.create(this)`, then invokes the constructor of that object if it exists and then returns it.

This basically is meant as sugar to allow ["prototypes as classes"][4]

Example:

    var Proto = {
        method: function () {
            console.log("method");
        },
        constructor: function (arg) {
            console.log("constructed", arg);    
        }
    };

    var o = Proto.new(42); // "constructed", 42
    console.log(Proto.isPrototypeOf(o)); // true
    o.method(); // "method"



  [1]: http://raynos.github.com/pd/docs/pd.html
  [2]: http://raynos.github.com/vows-fluent/docs/vows-fluent.html
  [3]: http://raynos.org/blog/4/Doing-Object-Oriented-JavaScript
  [4]: http://www.2ality.com/2011/06/prototypes-as-classes.html