# Relationships between Objects and Prototypes in JS


<img src="https://github.com/mandober/js-object-relationships/blob/master/prototype-chain.jpg?raw=true" alt="Diagram of Prototype chain in JS">
<small>Prototype chain</small>
       
      
* [Types](#types)
* [Built-in objects](#built-in-objects)
* [Prototype chain](#prototype-chain)
     
     
## Types

There are 7 built-in types in JavaScript:
* 6 primitives (primitive types):    
  `string, number, boolean, symbol, null, undefined`
* 1 compound (complex) type:    
  `object`

This is an object in the broader sense; it has many subtypes, collectively called natives or [built-in objects](https://www.ecma-international.org/ecma-262/7.0/#sec-well-known-intrinsic-objects). Commonly used built-ins are Object, Array, Date, RegExp, Math, Function. Function is a callable object; String, Symbol, Number and Boolean built-ins are rarely used directly, but they are fundamental when dealing with their primitive counterpairs ("boxing"); Global object is provided by the host environment.


## Built-in objects

All built-in objects have corresponding constructor functions: `Object(), Function(), Array(), String(), Regexp()`, etc.

All constructor function have an accompanying object - their prototype object, whose (sub)type corresponds to the name of the constructor function: `object Object, object Function, object Array, object String, object Regexp`, etc.


## Prototype chain

Red lines in the diagram show the links between objects - these links make up the prototype chain.

A link represents a hidden property of an object called `[[Prototype]]`. Public, addressable, version of this property is called `__proto__` and it can be used to examine relationships between objects.

Namely, if an object is queried for a property (`obj.propName`) and it doesn't have its own property by that name, its `[[Prototype]]` i.e. `__proto__` link is followed to the next object, which is queried for the same property, and so on, to the next linked object, until such property is found. Object `Object.prototype` (1) is the final link in the prototype chain and if it doesn't have that property, the search is over and `undefined` is returned. The same goes for both, properties and methods.

In fact, `__proto__` is not a property found on any given object - it is located only on `Object.prototype`(1) , but since `Object.prototype` is at the end of the prototype chain, all other objects have access to `__proto__` thanks to prototype chain.   
     
> All roads lead (and end) to `Object.prototype`.    
     
     
## Object Exploration Tools

* **`__proto__`**     
By using `__proto__` prototype chain can be examined. For example, function `Function()` links to `Function.prototype`(2) and it links to `Object.prototype`, which is the end of the prototype chain.   

`Function() -> Function.prototype -> Object.prototype -> null`    
```js
Function.__proto__ === Function.prototype; // true
Function.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null; // true
```
<small>Note: The feedback is from: Chrome (v.57.0.2987.110 x64), Firefox (v.52.0.1 x64), Edge (v.14.14393), Node (v7.7.3)</small>


* **`toString()`**     
To identify the subtype of an object `toString()` method of `Object.prototype` can be borrowed. It is called as:
`Object.prototype.toString.call(OBJ)`.

```js
Object.prototype.toString.call(Function); // "[object Function]"
Object.prototype.toString.call(Function.prototype); // "[object Function]"
```

Since `Object.prototype` is at the end of prototype chain, this method is available to all objects, which means the name of the owning object (`Object.prototype`) can be left out:

```js
toString === Object.prototype.toString; // true
toString.call(Object); // "[object Function]"
toString.call(Object.prototype); // "[object Object]"
```

<small>The `call()` [method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) calls a function with a given `this` value.</small>


* **`getOwnPropertyNames()`**     
This method is used to find out object's own properties (properties found on the object itself, not by following the prototype chain). This is a method of function `Object()`, so it must be addressed as `Object.getOwnPropertyNames(OBJ)`.    
    
    

## Relationships

Each constructor function is accompanied by a nameless object, which can be identified according to relationship with its constructor function. Each function has a `prototype` property pointing to its prototype object, and each prototype object has a `constructor` property pointing back to function.

For example, `Object` function's (3) `prototype` points to *the* object, *the* top-of-the-chain, proper object `Object.prototype` (1). He points back to her:
```js
Object === Object.prototype.constructor;
// true
```

Another special pair is constructor function `Function`(4) and function referred to as `Function.prototype`(2). What is special is that every constructor function (and any user created function) will have its proto link point to `Function.prototype`(2). And all constructor function's prototype objects will point to `Object.prototype`(1). So this is the only pair where a constructor function has a proto link pointing to its prototype function (`Function.prototype`).

```js
Function === Function.prototype.constructor;
// true
Function.__proto__ === Function.prototype
// true
Object.prototype.toString.call(Function);
// "[object Function]"
Object.prototype.toString.call(Function.prototype);
// "[object Function]"
```

### Manipulating relationships

All relationships between objects can be manipulated by a user. Common manipulation methods:

* `Object.create(pt [,propertiesObject])` creates a new object with the specified prototype object and properties.

* `Object.setPrototypeOf(srcObj, destObj)` method sets the prototype (i.e. the internal [[Prototype]] property) of a source object to destination object (or null).

* By manipulating `__proto__` property.

```js
var objProto = {a:1};
var obj = {__proto__:objProto};
obj.__proto__ === objProto; //true

// creates an object out of prototype chain:
var free = Object.create(null);
// Object {} without any properties

// unlinks existing object from prototype chain:
var unlinked = {a:1,b:2,c:3};
Object.setPrototypeOf(unlinked, null);
unlinked;
// Object {a: 1, b: 2, c: 3} 
// only own properties; properties from prototype chain are no longer available.
```


<img src="https://github.com/mandober/js-object-relationships/blob/master/js-rel.jpg?raw=true" alt="Object Relationships">
Relationships between compound types


## Making new objects


**Function**   

Besides the usual ways (function declarations and function expressions), function can be created by calling constructor function `Function()`, with or without the `new` keyword. This allows for dynamically setting new function's parametars and body:
```js
var f1 = new Function('n', 'return n + n');
f1(4); // 8
var f2 = Function('n', 'return n + n');
f2(4); // 8
```   
   
> Every time you create a new function, you end up with 2 objects: the function itself [object Function] and its prototype object [object Object].   
    
   
**Object**   

A proper object (object Object) can be created in several ways:

* When a new function is created (a), its prototype object (b) is also created. Every function has a prototype/constructor relationship with its object. Function itself will be prototype linked to `Function.prototype`(2) object; its prototype object will be prototype linked to `Object.prototype`(1).

* From constructor call to a user's function `var obj = new Fun()`(c). When an object is created this way, it gets prototype linked to function's prototype object (b).

* By calling constructor function Object() (with or without the `new` keyword):
  `obj = new Object()`
  `obj = Object()`

* Using the function `Object.create()`.

* Using object literal form `obj = {}`.
 

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

There's a special case when using Array constructor function with only one numeric parametar:
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


## Built-ins: identify and list own properties

## Object

### **Object()**

```js
Object;
// function Object() { [native code] } (3)
Object.__proto__;
// function () { [native code] } (2)
Object.getOwnPropertyNames(Object);
// ["length", "name", "arguments", "caller", "prototype", "assign", "getOwnPropertyDescriptor", "getOwnPropertyDescriptors", "getOwnPropertyNames", "getOwnPropertySymbols", "is", "preventExtensions", "seal", "create", "defineProperties", "defineProperty", "freeze", "getPrototypeOf", "setPrototypeOf", "isExtensible", "isFrozen", "isSealed", "keys", "entries", "values"]
Object.prototype.toString.call(Object);
// "[object Function]"
```

### **Object.prototype**

```js
Object.prototype;
// Object {} (1)
Object.prototype.__proto__;
// null (i.e. end of prototype chain)
Object.getOwnPropertyNames(Object.prototype);
// ["__defineGetter__", "__defineSetter__", "hasOwnProperty", "__lookupGetter__", "__lookupSetter__", "propertyIsEnumerable", "__proto__", "constructor", "toString", "toLocaleString", "valueOf", "isPrototypeOf"]
Object.prototype.toString.call(Object.prototype);
// "[object Object]"
```



## Function

### **Function()**

```js
Function;
// function Function() { [native code] } (4)
Function.__proto__;
// function () { [native code] } (2)
Object.getOwnPropertyNames(Function);
// ["length", "name", "arguments", "caller", "prototype"]
Object.prototype.toString.call(Function);
// "[object Function]"
```

### **Function.prototype**

```js
Function.prototype;
// function () { [native code] } (2)
Function.prototype.__proto__;
// Object {} (1)
Object.getOwnPropertyNames(Function.prototype);
// ["length", "name", "arguments", "caller", "apply", "bind", "call", "toString", "constructor"]
Object.prototype.toString.call(Function.prototype);
// "[object Function]"
```



## Array

### **Array()**

```js
Array;
// function Array() { [native code] } (5)
Array.__proto__;
// function () { [native code] } (2)
Object.getOwnPropertyNames(Array);
// ["length", "name", "arguments", "caller", "prototype", "isArray", "from", "of"]
Object.prototype.toString.call(Array);
// "[object Function]"
```

### **Array.prototype**

```js
Array.prototype;
// [constructor: function, toString: function, join: function, pop: function…] (6)
Array.prototype.__proto__;
// Object {} (1)
Object.getOwnPropertyNames(Array.prototype);
// ["length", "constructor", "toString", "toLocaleString", "join", "pop", "push", "reverse", "shift", "unshift", "slice", "splice", "sort", "filter", "forEach", "some", "every", "map", "indexOf", "lastIndexOf", "reduce", "reduceRight", "copyWithin", "find", "findIndex", "fill", "includes", "keys", "entries", "concat"]
Object.prototype.toString.call(Array.prototype);
// "[object Array]"
```


## String
String is a primitive `var str = 'abc'`, but there is also a compound string object `var strObj = new String('abc')`. Those (unlike in case of objects, arrays, etc. literal and constructed forms) are not the same type. It is similar for numbers and booleans.

```js
var str1 = new String("abc");
str1; // String {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}
var str2 = String("abc");
str2; // String {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}
var str = 'abc';
str;
// "abc"
```

### **String()**

```js
String;
// function String() { [native code] } (7)
String.__proto__;
// function () { [native code] } (2)
Object.getOwnPropertyNames(String);
// ["length", "name", "arguments", "caller", "prototype", "fromCharCode", "fromCodePoint", "raw"]
Object.prototype.toString.call(String);
// "[object Function]"
```

### **String.prototype**

```js
String.prototype;
// String {length: 0, constructor: function, charAt: function, charCodeAt: function, endsWith: function…} (id:8)
String.prototype.__proto__;
// Object {} (1 on the diagram)
Object.getOwnPropertyNames(String.prototype);
// ["length", "constructor", "charAt", "charCodeAt", "endsWith", "includes", "indexOf", "lastIndexOf", "localeCompare", "normalize", "substr", "substring", "startsWith", "toString", "trim", "trimLeft", "trimRight", "valueOf", "codePointAt", "concat", "match", "repeat", "replace", "search", "slice", "split", "toLowerCase", "toLocaleLowerCase", "toUpperCase", "toLocaleUpperCase", "link", "anchor", "fontcolor", "fontsize", "big", "blink", "bold", "fixed", "italics", "small", "strike", "sub", "sup", "padStart", "padEnd"]
Object.prototype.toString.call(String.prototype);
// "[object String]"
```


## Number

### **Number()**

```js
Number;
// function Number() { [native code] }
Number.__proto__;
// function () { [native code] } (2)
Object.getOwnPropertyNames(Number);
// ["length", "name", "arguments", "caller", "prototype", "isFinite", "isInteger", "isNaN", "isSafeInteger", "parseFloat", "parseInt", "MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY", "POSITIVE_INFINITY", "MAX_SAFE_INTEGER", "MIN_SAFE_INTEGER", "EPSILON"]
Object.prototype.toString.call(Number);
// "[object Function]"
```

### **Number.prototype**

```js
Number.prototype;
// Number {constructor: function, toExponential: function, toFixed: function, toPrecision: function, toString: function…}
Number.prototype.__proto__;
// Object {} (#1 on the diagram)
Object.getOwnPropertyNames(Number.prototype);
// ["constructor", "toExponential", "toFixed", "toPrecision", "toString", "valueOf", "toLocaleString"]
Object.prototype.toString.call(Number.prototype);
// "[object Number]"
```


## Boolean

### **Boolean()**

```js
Boolean;
// function Boolean() { [native code] }
Boolean.__proto__;
// function () { [native code] } (2)
Object.getOwnPropertyNames(Boolean);
// ["length", "name", "arguments", "caller", "prototype"]
Object.prototype.toString.call(Boolean);
// "[object Function]"
```

### **Boolean.prototype**

```js
Boolean.prototype;
// Boolean {[[PrimitiveValue]]: false, constructor: function, toString: function, valueOf: function}
Boolean.prototype.__proto__;
// Object {} (#1 on the diagram)
Object.getOwnPropertyNames(Boolean.prototype);
// ["constructor", "toString", "valueOf"]
Object.prototype.toString.call(Boolean.prototype);
// "[object Boolean]"
```


## RegExp

Here is a slightly different situation: in Firefox, `RegExp.prototype` is of subtype "[object RegExp]", which is expected and in line with other subtypes, but Chrome (version 57.0.2987.110 64-bit) logs "[object Object]".

### **RegExp()**

```js
RegExp;
// function RegExp() { [native code] }
RegExp.__proto__;
// function () { [native code] } (2)
Object.getOwnPropertyNames(RegExp);
// ["length", "name", "arguments", "caller", "prototype", "input", "$_", "lastMatch", "$&", "lastParen", "$+", "leftContext", "$`", "rightContext", "$'", "$1", "$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9"]
Object.prototype.toString.call(RegExp);
// "[object Function]"
```

### **RegExp.prototype**

```js
RegExp.prototype;
// Object {constructor: function, exec: function…}
RegExp.prototype.__proto__;
// Object {} (#1 on the diagram)
Object.getOwnPropertyNames(RegExp.prototype);
// ["constructor", "exec", "flags", "global", "ignoreCase", "multiline", "source", "sticky", "unicode", "compile", "toString", "test"]
Object.prototype.toString.call(RegExp.prototype);
// "[object Object]" (chrome)
// "[object RegExp]" (firefox)
```


## Date

The situation with `Date.prototype` is again different than before: now both, Chrome and Firefox log "[object Object]", instead of the expected "[object Date]", which is what is reported in Edge (v.14).


### **Date()**

```js
Date;
// function Date() { [native code] }
Date.__proto__;
// function () { [native code] } (2)
Object.getOwnPropertyNames(Date);
// ["length", "name", "arguments", "caller", "prototype", "now", "parse", "UTC"]
Object.prototype.toString.call(Date);
// "[object Function]"
```

### **Date.prototype**

```js
Date.prototype;
// Object {constructor: function, toString: function, toDateString: function, toTimeString: function, toISOString: function…}
Date.prototype.__proto__;
// Object {} (#1 on the diagram)
Object.getOwnPropertyNames(Date.prototype);
// ["constructor", "toString", "toDateString", "toTimeString", "toISOString", "toUTCString", "toGMTString", "getDate", "setDate", "getDay", "getFullYear", "setFullYear", "getHours", "setHours", "getMilliseconds", "setMilliseconds", "getMinutes", "setMinutes", "getMonth", "setMonth", "getSeconds", "setSeconds", "getTime", "setTime", "getTimezoneOffset", "getUTCDate", "setUTCDate", "getUTCDay", "getUTCFullYear", "setUTCFullYear", "getUTCHours", "setUTCHours", "getUTCMilliseconds", "setUTCMilliseconds", "getUTCMinutes", "setUTCMinutes", "getUTCMonth", "setUTCMonth", "getUTCSeconds", "setUTCSeconds", "valueOf", "getYear", "setYear", "toJSON", "toLocaleString", "toLocaleDateString", "toLocaleTimeString"]
Object.prototype.toString.call(Date.prototype);
// "[object Object]" // chrome
// "[object Object]" // firefox
// "[object Date]" // edge
```



<p>&nbsp;</p>


# References

* https://www.ecma-international.org/ecma-262/7.0/
* https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

