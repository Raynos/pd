# Raynos coding style

Forked from [idiomatic.js][1]

## Table of Contents

 - [Whitespace](#whitespace)
 - [Beautiful Syntax](#spacing)
 - [Conditional Evaluation](#cond)
 - [Practical Style](#practical)
 - [Naming](#naming)
 - [Misc](#misc)
 - [Comments](#comments)


## Idiomatic Style Manifesto


1. <a name="whitespace">Whitespace</a>

 - 4 spaces per indent. No tabs.

2. <a name="spacing">Beautiful Syntax</a>

	A. Parens, Braces, Linebreaks

	```javascript

	// if/else/for/while/try always have braces and span multiple lines
	// this encourages readability
	// There shall be a space between if and ( and ) and {.
	// There shall be no space between ( and condition and condition and )

	// 2.A.1.1
	// Use whitespace to promote readability

	if (condition) {
		// statements
	}

	while (condition) {
		// statements
	}

	for (var i = 0; i < 100; i++) {
		// statements
	}

	
	if (true) {
		// statements
	} else {
		// statements
	}
	```


	B. Assignments, Declarations, Functions ( Named, Expression, Constructor )

	```javascript

	// 2.B.1.1
	// Variables
	var foo = "bar",
		num = 1,
		undef;

	// Literal notations:
	var array = [],
		object = {};


	// 2.B.1.2
	// Using only one `var` per scope (logical) promotes readability
	// and keeps your declaration list free of clutter (also saves a few bytes)
	// Note logical scope is logical scope. Declare variables above their first
	// use. Never write two var statements after each other

	// Bad
	var foo = "";
	var bar = "";
	var qux;

	// Good
	var foo = "",
		bar = "",
		quux;
	```

	```javascript

	// 2.B.2.1
	// Named Function Declaration
	function foo(arg1, argN) {
		/* code */
	}

	// Usage
	foo(arg1, argN);


	// 2.B.2.2
	// Named Function (w/ callback argument)
	// callbacks will always be the last argument
	function bar(arg1, callback) {
		if (arg1 && callback) {
			callback();
		}
	}

	// Usage
	bar(arg1, callback);

	function callback() {
		// callback statements
	}


	// 2.B.2.3
	// Function Expression
	// Never use non-anonymous function expressions
	// Always favour function declarations.
	// A exception is the desire to have a single anonymous function in
	// global scope

	(function _yourSingleGlobalAnonymousFunctionClosure () {
		/* code */
	}())

	// Another exception is NFE on an object literal

	var literal = {
		method: function _method() {
			
		}
	};

	// 2.B.2.4
	// Constructor definition
	// Don't use them. Use prototypical OO

	E. End of Lines and Empty Lines

	Whitespace can ruin diffs and make changesets impossible to read. Consider incorporating a pre-commit hook that removes end-of-line whitespace and blanks spaces on empty lines automatically.
	```

3. <a name="cond">Conditional Evaluation</a>

	Favour using truthy and falsey checks rather then verbose checks where 
	applicable


	```javascript

	// 3.1.1
	// When only evaluating that an array has length,
	// instead of this:
	if (array.length > 0) ...

	// ...evaluate truthiness, like this:
	if (array.length) ...
	```


	```javascript

	// 3.2.1
	// Type coercion and evaluation notes

	Always use === even for x == null favour the more verbose alternative

	x === null || x === undefined

	```

4. <a name="practical">Practical Style</a>

	```javascript

	// 4.1.1
	// A Practical Module

	(function _anonymousWrapper(global) {
		"use strict";

		var SomeObject = {
			string: "a string",
			object: {
				lang: "en-US"
			},
			method: function _namedMethod() {
				return 42;
			}
		};

		// Other things might happen here

		// expose our module through a module loader or global
		if (typeof module !== "undefined" && module.exports) {
			module.exports = SomeObject;
		} else {
			global.SomeObject = SomeObject;
		}

	}(global || window));


	// 4.2.1
	// A Practical Prototype

	(function( global ) {

		var SomeObject = {
			constructor: function _constructor(foo) {
				this.foo = foo;
				return this;
			},
			/* We do not use useless getter/setter methods ever.
			getFoo: function _getFoo() { ... }
			*/
			manipulate: function _manipulate(id) {
				foo += id;
			}
		};

		// For easier inheritance use pd
		SomeObject = pd.Base.make(SomeObject);

		// expose our module through a module loader or global
		if (typeof module !== "undefined" && module.exports) {
			module.exports = SomeObject;
		} else {
			global.SomeObject = SomeObject;
		}

	}( global || window ));

	```

	Examples:
	
	 - [pd][2]
	 - [after][3]

5. <a name="naming">Naming</a>

	Use sensible, readable names

	```javascript
	// 5.1
	// Naming style

	functionNamesLikeThis;
	variableNamesLikeThis;
	PrototypeObjectNamesLikeThis;
	methodNamesLikeThis;
	SYMBOLIC_CONSTANTS_LIKE_THIS;
	```

6. <a name="misc">Misc</a>

	A. Early returns promote code readability with negligible performance difference

	```javascript

	// 6.A.1.1
	// Bad:
	function returnLate( foo ) {
		var ret;

		if ( foo ) {
			ret = "foo";
		} else {
			ret = "quux";
		}
		return ret;
	}

	// Good:

	function returnEarly( foo ) {

		if ( foo ) {
			return "foo";
		}
		return "quux";
	}

	B. Use new lines to split up logical blocks in functions

	// 6.B.1.1
	// Bad:
	function extend(target) {
        var objs = slice.call(arguments, 1);
        objs.forEach(extendTarget);
        return target;
    }

    // Good:

    function extend(target) {
        var objs = slice.call(arguments, 1);

        objs.forEach(extendTarget);

        return target;
    }

    // In general, variable declarations have a new line after them
    // Return statements have a new line after them
    // lines of code should be broken up with a new line 
    // unless they are manipulation the same object
    // Don't add a new at the start of a function or the end
    // unless it's the global wrapper

    // Good:

    (function _anonWrapper() {
    	
    	function name(param) {
    		var o = param;

    		o++;

    		return o;
    	}

    }());

    C. inner Function declarations at the bottom

    // 6.C.1.1

    // Bad:

    function extend(target) {
        var objs = slice.call(arguments, 1);

        function extendTarget(obj) {
            var props = getOwnPropertyNames(obj);
            props.forEach(function (key) {
                target[key] = obj[key];
            });
        }

        objs.forEach(extendTarget);

        return target;    
    }

    // Very Bad:

    function extend(target) {
        var objs = slice.call(arguments, 1);

        objs.forEach(function (obj) {
            var props = getOwnPropertyNames(obj);
            props.forEach(function (key) {
                target[key] = obj[key];
            });
        });

        return target;    
    }

    // Good:

	function extend(target) {
        var objs = slice.call(arguments, 1);

        objs.forEach(extendTarget);

        return target;    

        function extendTarget(obj) {
            var props = getOwnPropertyNames(obj);
            props.forEach(function (key) {
                target[key] = obj[key];
            });
        }
    }

    D. Always "use strict";

    E. line length shall be 100 characters, no more, no exceptions.

    To match line length properly you shall split up expression as follows

    // 6.E.1.1

    // Bad

    if (condition1 !== false && condition2 !== false && condition3 !== false && condition4 !== false) {
        // codez
    }

    // Good

    if (condition1 !== false &&
        condition2 !== false &&
        condition3 !== false &&
        condition4 !== false
    ) {
        // codez
    }

    // 6.E.2.1

    // Bad

    invoke("string", "foobar", longNameIsHere, ["literal", "array", "is", "here"]);

    // Good
    // Split the invocation into either two lines at a sensible point

    invoke("string", "foobar", 
        longNameIsHere, ["literal", "array", "is", "here"]);

    // Also Good
    // If each segment is long split into multiple lines

    invoke(
        "string", 
        "foobar", 
        longNameIsHere, 
        ["literal", "array", "is", "here"]
    );

    // 6.E.3.1

    // Bad

    ["long", "long", "long", "long", "long", "long", "long", "long", "long", "long", "long", "long"];

    // Good

    ["long", "long", "long", "long", "long", "long", 
        "long", "long", "long", "long", "long", "long"];

    // Also Good

    [
        "long", 
        "long", 
        "long", 
        "long", 
        "long", 
        "long", 
        "long", 
        "long", 
        "long", 
        "long", 
        "long", 
        "long"
    ];

	```

    If your line length is hurt because of nesting 
    Then that is because your doing it wrong.

    Block nesting should be favoured to 2 and limited to 3. 
    If it is more then it needs to refactored.

7. <a name="comments">Comments</a>

 - single block comment above a function

  [1]: https://github.com/rwldrn/idiomatic.js
  [2]: https://github.com/Raynos/pd/blob/e1ca84aba1282f0bd62112050adb4d5263a0ea33/src/pd.js
  [3]: https://github.com/Raynos/after.js/blob/7054d2788aa2175b6178ea31e260f6e9c6fc01c4/src/after.js