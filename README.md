# Relationships between Objects and Prototypes in JS


<img src="https://github.com/mandober/js-object-relationships/blob/master/prototype-chain.jpg?raw=true" alt="Diagram of Prototype chain in JS">
<small>Prototype chain</small>
       
      
* [Types](#types)
* [Built-in objects](#built-in-objects)
* [Prototype chain](#prototype-chain)
* [Identifying objects](#identifying-objects)
* [Own properties](#own-properties)
* [Relationships between objects](#relationships-between-objects)
* [Manipulating relationships](#manipulating-relationships)
* [Creating new objects](#creating-new-objects)
* [List of own properties](#list-of-own-properties)
* [References](#references)
     
     
## Types

There are 7 built-in types in JavaScript:
* 6 primitives (primitive types):    
  `string, number, boolean, symbol, null, undefined`
* 1 compound (complex) type:    
  `object`

This is an object in the broader sense; it has many subtypes, collectively called natives or [built-in objects](https://www.ecma-international.org/ecma-262/7.0/#sec-well-known-intrinsic-objects). Commonly used built-ins are Object, Array, Date, RegExp, Math, Function. Function is a callable object; String, Symbol, Number and Boolean built-ins are rarely used directly, but they are fundamental when dealing with their primitive counterparts ("boxing"); Global object is provided by the host environment.


## Built-in objects

All built-in objects have corresponding constructor functions: `Object(), Function(), Array(), String(), Regexp()`, etc.

All constructor function have an accompanying object - their prototype object, whose (sub)type corresponds to the name of the constructor function: `object Object, object Function, object Array, object String, object Regexp`, etc.


## Prototype chain

Red lines in the diagram show the links between objects - these links make up the prototype chain. A link represents an internal property of an object called `[[Prototype]]`.

While `[[Prototype]]` is an internal, private property that can't be referenced, its public, addressable, version is called `__proto__` and it can be used to examine relationships between objects. 

If an object is queried for a property (`obj.propName`) and it doesn't have its own property by that name, its `[[Prototype]]` link is followed to the next object, which is queried for that property, and so on, to the next `[[Prototype]]` linked object. Object `Object.prototype` (1) is the final link in the prototype chain and if it doesn't have that property, the search is over and `undefined` is returned.

In fact, `__proto__` is not really a *data property*, but an *accessor property* (a getter and a setter function) that exposes the internal [[Prototype]] link of an object. It is own property of the `Object.prototype` object and since this object is at the top of the prototype chain, every object has access to `__proto__` property thanks to the prototype chain.

> All roads lead (and end) to `Object.prototype`.    

For example, function `Function()` [[Prototype]] links to `Function.prototype`(2) and it links to `Object.prototype`(1), which is the end of the prototype chain:    
`Function() -> Function.prototype -> Object.prototype -> null`

```js
Function.__proto__ === Function.prototype; // true
Function.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null; // true
```

`Object.getPrototypeOf()` method also returns the prototype (i.e. the value of the internal [[Prototype]] property) of the specified object.
```js
Object.getPrototypeOf(Function)=== Function.prototype; // true
Object.getPrototypeOf(Function.prototype) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype) === null; // true
```


## Identifying objects

All built-in objects have corresponding constructor functions: Object(), Function(), etc. These functions are easy to identify, since each has its own `name` property.
```js
Object.name; // "Object"
Function.name; // "Function"
Array.name; // "Array"
```
<small>Note: feedbacks are from: Chrome (v.57.0.2987.110 x64), Firefox (v.52.0.1 x64), Edge (v.14.14393 x64), Node (v7.7.3 x64)</small>

Browser's console will return the name of each function as a primitive string (in double quotes) and Node's REPL will return the same (in single quotes). So it's easy to identify a function named "Function", or the one named "Object".

Things are different when stating just the name of a constructor functions. In that case console will try to return representation of that object, but it'll still be easy to identify it. For example:
```js
Object;
// chrome: function Object() { [native code] }
// firefox: function Object()
// edge: function Object() { [native code] }
// node: [Function: Object]
Function;
// chrome: function Function() { [native code] }
// firefox: function Function()
// edge: function Function() { [native code] }
// node: [Function: Function]
```

In JS, an object is a collection of properties; a property is an association between a name (or key) and a value. A property's value can be a primitive value, but it can also be a complex value i.e. an object.

Constructor function has own property named `prototype` whose value is an object. Because of its significance, it may be easier if this object is viewed as a separate entity (like in the diagram). The problem is that this object doesn't have a name per se. Unlike function objects, prototype objects don't have a `name` property. Their name exist only in reference to their constructor function. For example, function `Function` and its prototype object `Function.prototype`.

Therefor, identifying a prototype object is trickier,
```js
Object.prototype;
// chrome: Object {__defineGetter__: function, __defineSetter__: function, hasOwnProperty: function, __lookupGetter__: function, __lookupSetter__: function…}
// firefox: Object { , 15 more… }
// edge: [object Object]{}
// node: {}
```
as they can only be identified by their properties i.e. by recognizing at least some property names that are unique to each prototype object. It also helps that consoles' output can be clicked in order to show full list of object's properties.
```js
Function.prototype;
// chrome: function () { [native code] }
// firefox: function ()
// edge: function() { [native code] }
// node: [Function]
```

Subtype of prototype objects corresponds to the name of their constructor function:
```js
Object.prototype.toString.call(Object.prototype); // "[object Object]"
Object.prototype.toString.call(Function.prototype); // "[object Function]"
Object.prototype.toString.call(Array.prototype); // "[object Array]"
```


## Own properties

`getOwnPropertyNames()` is a function that exposes names of object's own properties (properties found on the object itself, not by following the prototype chain). This method belongs to the `Object()` function and it returns an array of property names.
```js
Object.getOwnPropertyNames(Object.prototype);
// [ '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'propertyIsEnumerable', 'constructor', 'toString', 'toLocaleString', 'valueOf', 'isPrototypeOf' '__proto__' ]
```


## Relationships between objects

Each constructor function has a `prototype` property pointing to its prototype object, and each prototype object has a `constructor` property pointing back to its function.

For example, object Function `Object` has a `prototype` property that points to *the object*, *the* top-of-the-chain, `Object.prototype`(1) object Object. He points back to her:
```js
Object === Object.prototype.constructor; // true
```

> All prototype objects [[Prototype]] link to `Object.prototype`(1).

Another special pair is the constructor function `Function` and its prototype object `Function.prototype`(2). What is special is that every constructor function (and any user created function) will [[Prototype]] link to `Function.prototype`(2). This is the only pair where a constructor function [[Prototype]] links to its prototype object.

> All functions [[Prototype]] link to `Function.prototype`

```js
Function === Function.prototype.constructor; // true
Function.__proto__ === Function.prototype; // true
```

## Manipulating relationships

All said holds true only to the point when user code is introduced. Allow a user to interfere with JS and things quickly get out of hand: relationships between objects are not immutable. Commonly used methods for manipulating [[Prototype]] are `create()` and `setPrototypeOf()`, and even directly manipulating `__proto__` property (not recommended).

`Object.create()` creates a new object, [[Prototype]] linked to the specified object (or null). 
`Object.setPrototypeOf()` method sets the [[Prototype]] of a source object to destination object (or null).

```js
var obj1 = {a: 1};
var obj2 = {__proto__: obj1};
Object.getPrototypeOf(obj2) === obj1; //true

var obj3 = Object.create(obj1);
Object.getPrototypeOf(obj3) === obj1; //true

Object.setPrototypeOf(obj2, obj3);
Object.getPrototypeOf(obj2) === obj3; //true

// creates a new object removed from the prototype chain:
var free = Object.create(null);

// removes existing object from the prototype chain:
Object.setPrototypeOf(obj1, null);
```



<img src="https://github.com/mandober/js-object-relationships/blob/master/js-rel.jpg?raw=true" alt="Object Relationships">



## Creating new objects


**Function**   

Besides the usual ways (function declarations and function expressions), function can be created by calling constructor function `Function()`, with or without the `new` keyword. This allows for dynamically setting new function's parameters and body:
```js
var f1 = new Function('n', 'return n + n');
f1(4); // 8
var f2 = Function('n', 'return n + n');
f2(4); // 8
```   
   
> Every time you create a new function, you end up with 2 objects: the function itself (object Function) and its prototype object (object Object).

When a new function (a) is created it is [[Prototype]] linked to its prototype object (b). Every function has a prototype/constructor relationship with its object. Function itself will be prototype linked to `Function.prototype`(2) object; its prototype object will be prototype linked to `Object.prototype`(1).
    
    
**Object**   

A proper object (object Object) can be created in several ways:

* From constructor call to a user's function `var obj1 = new Fun()`(c). When an object is created this way, it gets [[Prototype]] linked to function's prototype object (b).

* Using `create()` function: `var obj2 = Object.create()`. [[Prototype]] link of the new object can be set to specified object, passed in as a parameter.

* By calling constructor function Object() (with or without the `new` keyword): `var obj3 = new Object()`.

* Using object literal form: `var obj4 = {}`.

* Every function has [[Prototype]] link to its prototype object. This object can be kidnapped; new identity can be provided; any link to its constructor function can be erased.

```js
var f1 = function() {};
obj5 = f1.prototype;
delete obj5.constructor;
obj5; // Object {}
```



**Array**   
Whether a new array is created by using a constructor call (with or without the `new` keyword) or by using the array literal form, it all amounts to the same result: newly created array (element d in the diagram) is prototype linked to `Array.prototype` (6). It is similar with other compound (sub)types.

```js
var arr1 = new Array();
// []
var arr2 = Array();
// []
var arr3 = [];
// []
arr1.__proto__;
arr2.__proto__;
arr3.__proto__;
// [constructor: function, toString: function, join: function, pop: function…] (6)
```

There's a special case when using Array constructor function with only one numeric parameter:
```js
var arr4 = new Array(3);
// [undefined × 3]
arr4.length;
// 3
var arr5 = new Array(3.14);
// Uncaught RangeError: Invalid array length
```
This will only set the `length` property of the new array.



**Date**   

There is no date literal form, so a new date object must be created by calling the native constructor. If it is called without the `new` keyword, string representation of the current date is returned.
```js
var d1 = new Date();
// (date object)
var d2 = Date();
// (string representation of the current date)
```


**RegExp**   

Regular expressions have both, literal and constructed form. The latter can be used, with or without the `new` keyword, to dynamically define a regex pattern.
```js
var re1 = /.*/g
var re2 = new RegExp(/.*/, "g")
var re3 = RegExp(/.*/, "g")
var str = 'abc';
var re4 = new RegExp(str + '{3}', "g");//  /abc{3}/g
```


<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>


## List of own properties

These are global functions, that are invoked globally rather than on an object:

```js
    eval()
    uneval()
    isFinite()
    isNaN()
    parseFloat()
    parseInt()
    decodeURI()
    decodeURIComponent()
    encodeURI()
    encodeURIComponent()
```

Other functions are invoked on an object that owns them.


### Object

```js
Object.getOwnPropertyNames(Object);
// ["length", "name", "arguments", "caller", "prototype", "assign", "getOwnPropertyDescriptor", "getOwnPropertyDescriptors", "getOwnPropertyNames", "getOwnPropertySymbols", "is", "preventExtensions", "seal", "create", "defineProperties", "defineProperty", "freeze", "getPrototypeOf", "setPrototypeOf", "isExtensible", "isFrozen", "isSealed", "keys", "entries", "values"]

Object.getOwnPropertyNames(Object.prototype);
// ["__defineGetter__", "__defineSetter__", "hasOwnProperty", "__lookupGetter__", "__lookupSetter__", "propertyIsEnumerable", "__proto__", "constructor", "toString", "toLocaleString", "valueOf", "isPrototypeOf"]
```

## Function

```js
Object.getOwnPropertyNames(Function);
// ["length", "name", "arguments", "caller", "prototype"]

Object.getOwnPropertyNames(Function.prototype);
// ["length", "name", "arguments", "caller", "apply", "bind", "call", "toString", "constructor"]
```

## Array

```js
Object.getOwnPropertyNames(Array);
// ["length", "name", "arguments", "caller", "prototype", "isArray", "from", "of"]

Object.getOwnPropertyNames(Array.prototype);
// ["length", "constructor", "toString", "toLocaleString", "join", "pop", "push", "reverse", "shift", "unshift", "slice", "splice", "sort", "filter", "forEach", "some", "every", "map", "indexOf", "lastIndexOf", "reduce", "reduceRight", "copyWithin", "find", "findIndex", "fill", "includes", "keys", "entries", "concat"]
```


## String

```js
Object.getOwnPropertyNames(String);
// ["length", "name", "arguments", "caller", "prototype", "fromCharCode", "fromCodePoint", "raw"]

Object.getOwnPropertyNames(String.prototype);
// ["length", "constructor", "charAt", "charCodeAt", "endsWith", "includes", "indexOf", "lastIndexOf", "localeCompare", "normalize", "substr", "substring", "startsWith", "toString", "trim", "trimLeft", "trimRight", "valueOf", "codePointAt", "concat", "match", "repeat", "replace", "search", "slice", "split", "toLowerCase", "toLocaleLowerCase", "toUpperCase", "toLocaleUpperCase", "link", "anchor", "fontcolor", "fontsize", "big", "blink", "bold", "fixed", "italics", "small", "strike", "sub", "sup", "padStart", "padEnd"]
```


## Number

```js
Object.getOwnPropertyNames(Number);
// ["length", "name", "arguments", "caller", "prototype", "isFinite", "isInteger", "isNaN", "isSafeInteger", "parseFloat", "parseInt", "MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY", "POSITIVE_INFINITY", "MAX_SAFE_INTEGER", "MIN_SAFE_INTEGER", "EPSILON"]

Object.getOwnPropertyNames(Number.prototype);
// ["constructor", "toExponential", "toFixed", "toPrecision", "toString", "valueOf", "toLocaleString"]
```


## Boolean

```js
Object.getOwnPropertyNames(Boolean);
// ["length", "name", "arguments", "caller", "prototype"]

Object.getOwnPropertyNames(Boolean.prototype);
// ["constructor", "toString", "valueOf"]
```


## RegExp


```js
Object.getOwnPropertyNames(RegExp);
// ["length", "name", "arguments", "caller", "prototype", "input", "$_", "lastMatch", "$&", "lastParen", "$+", "leftContext", "$`", "rightContext", "$'", "$1", "$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9"]

Object.getOwnPropertyNames(RegExp.prototype);
// ["constructor", "exec", "flags", "global", "ignoreCase", "multiline", "source", "sticky", "unicode", "compile", "toString", "test"]
```


## Date

```js
Object.getOwnPropertyNames(Date);
// ["length", "name", "arguments", "caller", "prototype", "now", "parse", "UTC"]

Object.getOwnPropertyNames(Date.prototype);
// ["constructor", "toString", "toDateString", "toTimeString", "toISOString", "toUTCString", "toGMTString", "getDate", "setDate", "getDay", "getFullYear", "setFullYear", "getHours", "setHours", "getMilliseconds", "setMilliseconds", "getMinutes", "setMinutes", "getMonth", "setMonth", "getSeconds", "setSeconds", "getTime", "setTime", "getTimezoneOffset", "getUTCDate", "setUTCDate", "getUTCDay", "getUTCFullYear", "setUTCFullYear", "getUTCHours", "setUTCHours", "getUTCMilliseconds", "setUTCMilliseconds", "getUTCMinutes", "setUTCMinutes", "getUTCMonth", "setUTCMonth", "getUTCSeconds", "setUTCSeconds", "valueOf", "getYear", "setYear", "toJSON", "toLocaleString", "toLocaleDateString", "toLocaleTimeString"]
```


<p>&nbsp;</p>
<p>&nbsp;</p>


## References

* https://www.ecma-international.org/ecma-262/7.0/
* https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

