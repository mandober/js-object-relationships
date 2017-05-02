# Relationships between Objects in JS

Exploring relationships between builtin objects and their prototypes in JavaScript.

## Data Types

There are 7 built-in data types in JavaScript:
* 6 primitives (primitive types):    
  `string, number, boolean, symbol, null, undefined`
* 1 compound (complex) type:    
  `object` (natives, builtin objects)

Compound datatype `object` is an object in a broader sense; in JS all compound types (natives) are specialized subtypes of object. Commonly used built-ins are `Object, Array, Date, RegExp, Math, Function`. Function is a callable object; String, Symbol, Number and Boolean objects are rarely used directly, but they are fundamental when dealing with their primitive counterparts ("boxing primitives").

JS host environment provides many other natives, such as global object (`window` in browser), but they are not part of EcmaScript core, rather, they are a part of a separate specification (Browser Object Model, Document Object Model, etc.).

> Lists of all built-in objects on MDN: [Standard built-in objects][link1]


## Built-in objects

Objects in JS are collection of properties. Property is a key/value pair: key is a property name and value can be anything: a primitive (string, number, etc) or a native (object, function, array, etc).

All natives, have corresponding constructor functions: `Object`, `Function`, `Array`, `Regexp`, etc. 

All constructor functions have a prototype: `Object.prototype`, `Function.prototype`, `Array.prototype`, `Regexp.prototype`, etc.


## Constructor functions and their prototypes

Constructor functions, being objects, have properties. One of them is a special property named `prototype` that references an object - function's prototype object.

In turn, the prototype object itself has a special property named `constructor` that references back the constructor function.

The prototype object has other properties (methods) specific to its type; for example, `Array()` function's prototype object is itself an array, and it holds properties (methods) that are useful when dealing with arrays (`push, pop, indexOf`, etc).

One way to looks at this, is that all natives are defined by a pair: a constructor function and function's corresponding prototype.


### Prototype Chain

All objects have another special property that allows them to access properties that are found on other objects. This is a hidden property accessible only to JS engine, known as `[[Prototype]]` (internal properties are usually denoted in double brackets). Its public, externally accessible, version is called `__proto__`.

![Prototype Chain][pic1]
*Diagram 1: Prototype Chain*

This diagram shows only several constructor functions and their prototypes. Thick red lines in the diagram represent the links between objects, `[[Prototype]]` references (links). These links make up the prototype chain.

In fact, prototype chain can be viewed as collection of all the Prototype (capital "P") links, or it can be viewed as a concrete prototype chain of a given object. For example, prototype chain starting with `Function` function, continues onto `Function.prototype` and then to `Object.prototype`.

`Object.prototype` is the final link in the prototype chain , it terminates the prototype chain by Prototype-linking to `null`.

Prototype chain is traversed every time an object (array, function, object, etc) is queried for a property; if an object doesn't have such property, the search will continue, by following the Prototype links, to the next object. Finally, if `Object.prototype`, which is always at the end of any object's prototype chain, doesn't have such property, the search is over (and `undefined` is returned).

> All roads lead to `Object.prototype`    

This is why all object have access to properties (methods) found on `Object.prototype` like `toString()`, `valueOf()`, `hasOwnProperty()`, `propertyIsEnumerable()`, etc.

All said is true for initial JS environment, before any  user code is executed - let a user interfere and the lot quickly goes tits up because these relationships (properties) are not immutable.


### Identifying objects

Constructor function, like all functions have a proper name (a name as a string) so they are easily recognized in the output of various JS host environments.

The problem is recognizing their prototype objects as they don't have a name - they are only referred to in relation to their constructor function, e.g. `Object.prototype` object. JS host environments will have different representations for them.

```js
Object.name; // "Object"

Object;
/*
Firefox (v.53) will output: function Object()
Node (v.7.9.0) will output: [Function: Object]
Chrome Canary (v.60) will output: function Object() { [native code] }
*/

Object.prototype;
// (Node): {}
// (Firefox): Object { , 15 more… }
// (Chrome): Object {..., valueOf: function, ...}
```
Conveniently, browsers' output is clickable, which displays all object's properties - knowing what (prototype) object contains which properties is a way to distinguish them.

![Identifying objects][pic2]
*Diagram 2: Identifying objects by their methods*


### Object and Function

`Object` and `Function` natives are the most fundamental builtins as they are at the top of the prototype chain. Similar to objects that all have `Object.prototype` in their PC, all functions have `Function.prototype` in theirs. `Function.prototype` itself is Prototype linked to `Object.prototype`.

![Object and Function][pic3]
*Diagram 3: Object and Function*

`Object` constructor function is used to creates object wrappers (e.g. given a string parameter, it will wrap the string into a `String` object), so creating new objects is better done using some other method, like literal form.

Constructor function `Function` can be constructor-called to create new function, but this is not common; a function is better off defined using function declarations or function expression.


### Creating new objects


Functions are often used as constructors for objects

![Creating new objects][pic4]
*Diagram 4: Creating new objects*








---
[link1]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

[pic1]: diagrams/01_prototype-chain.png
[pic2]: diagrams/02_methods.png
[pic3]: diagrams/03_object-and-function.png
[pic4]: diagrams/04_new-objects.png
