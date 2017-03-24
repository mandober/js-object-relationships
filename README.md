# Relationships between objects in JS

Diagram of relationships between compound types in JS:


<img src="https://github.com/mandober/js-object-relationships/blob/master/js-rel.jpg?raw=true" alt="JS Object Relationships">


Complex or compound types are object, function, string, array, regexp, number, date, etc. In fact, all complex types are a subtypes of the type object. Every complex type has its eponymous constructor function:
* `function Object()`
* `function Function()`
* `function Array()`
* `function String()`
* `function Date()`
* `function Regexp()`   
etc.   
and each constructor function has an accompanying object - its prototype object, whose subtype has the same name as the constructor function:
* `"[object Object]"`
* `"[object Function]"`
* `"[object Array]"`
* `"[object String]"`
* `"[object Date]"`
* `"[object Regexp]"`   
etc.


## Prototype chain

Red fat arrows show the links between objects - these links make up the prototype chain.

A link is a hidden private property of an object known as `[[Prototype]]`. Although it was used for a long time, only now ES6 has standardized the public, addressable, version of this property named `__proto__`, which can be used to examine relationships between objects.

Namely, if an object is queried for a property (`obj.propName`) and it doesn't have its own property by that name, its `[[Prototype]]` i.e. `__proto__` link is followed to the next object, which is queried for that property, and so on to the next linked object, until such property is found. Object `Object.prototype` (1) is the final link in the prototype chain and if it doesn't have that property, the search is over and `undefined` is returned. The same goes for both, properties and methods.

In fact, `__proto__` is not a property found on every object - it is located only on `Object.prototype` (1) (and it is not really a property, but a pair of get/set methods), but since `Object.prototype` is at the end of the prototype chain, all other objects have access to `__proto__` property/method, just by following the prototype links.

> All roads lead (and end) to `Object.prototype`.

A very useful function for examination of an object's own properties (properties found on the object itself, not by following the prototype chain) is `getOwnPropertyNames()`. This method lives on function object `Function()` (3), so it must be addressed as `Object.getOwnPropertyNames(nameOfObjectToExamine)`.


## Relationships

Each constructor function is accompanied by a nameless object, which can be identified according to relationship with its constructor function. Each function has a `prototype` property pointing to its prototype object, and each prototype object has a `constructor` property pointing back to function.

For example, `Object` function's (3) `prototype` points to *the* object, *the* top-of-the-chain, proper object `Object.prototype` (1). He points back to her:
```js
Object === Object.prototype.constructor;
// true
Object.prototype.toString.call(Object);
// "[object Object]"
Object.prototype.toString.call(Object.prototype);
// "[object Function]"
```

Another special pair is constructor function `Function`(4) and function referred to as `Function.prototype`(2). What is special is that every constructor function (and any user created function) will have its proto link point to `Function.prototype`(2). And all function's prototype objects will point to `Object.prototype`(1). So this is the only pair where a constructor function has a proto link pointing to its prototype function (`Function.prototype`).

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

* Manipulating `__proto__` property:
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



## Creation of new objects

New proper object (object Object) can be created in several ways:

* When a function is created (a), its prototype object (b) is also created. Every function has a prototype/constructor relationship with its object. Function is prototype linked to `Function.prototype` object; that prototype object is linked to `Object.prototype`. This is somewhat special object with a different purpose than objects that are user created:

* When an object is created with constructor call to a user created function `var obj = new Fun()`(c) it gets prototype linked to function's prototype object (b).

* Calling object constructor function `obj = new Object()` or just calling the constructor without the `new` keyword `obj = Object()`.

* Using the function `Object.create()`.

* Using object literal form `obj = {}`.


## Creation of object's subtypes

### **Array**

Whether a new array s created by using a constructor call (with or without the `new` keyword) or by using the array literal form, it all amounts to the same result: newly created array (d) is proto linked to `Array.prototype`. It is similar for other subtypes.

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


## Identify and list own properties

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
// Object {} (id:1)
Object.getOwnPropertyNames(String.prototype);
// ["length", "constructor", "charAt", "charCodeAt", "endsWith", "includes", "indexOf", "lastIndexOf", "localeCompare", "normalize", "substr", "substring", "startsWith", "toString", "trim", "trimLeft", "trimRight", "valueOf", "codePointAt", "concat", "match", "repeat", "replace", "search", "slice", "split", "toLowerCase", "toLocaleLowerCase", "toUpperCase", "toLocaleUpperCase", "link", "anchor", "fontcolor", "fontsize", "big", "blink", "bold", "fixed", "italics", "small", "strike", "sub", "sup", "padStart", "padEnd"]
Object.prototype.toString.call(String.prototype);
// "[object String]"
```


# References

* https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
