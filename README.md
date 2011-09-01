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

## Examples <a name="Examples" href="#Examples"><small><sup>link</sup></small></a>

 - [vows-fluent annotated code][2]

## Documentation <a name="Documentation" href="#Documentation"><small><sup>link</sup></small></a>

See the [annotated source code][1]

### pd <a name="pd" href="#pd"><small><sup>link</sup></small></a>

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

### pd.merge <a name="pd.merge" href="#pd.merge"><small><sup>link</sup></small></a>

pd.merge merges objects together. Any key clashes are given right preference

    pd.merge(
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

### pd.object <a name="pd.object" href="#pd.object"><small><sup>link</sup></small></a>

pd.object is a simple Object.create shorthand.

    pd.object(o)

is the same as

    Object.create(Object.prototype, pd(o));


  [1]: http://raynos.github.com/pd/docs/pd.html
  [2]: http://raynos.github.com/vows-fluent/docs/vows-fluent.html