# Relationships between Objects in JS

Exploring relationships between built-in objects in JavaScript.

## Data Types

There are 7 built-in data types in JavaScript:
* 6 primitive types: `string, number, boolean, symbol, null, undefined`
* 1 compound type: `object`, with subtypes such as object, array, function, etc.

*Typically for JavaScript there's a naming confusion right from the start, preventing a clean grouping of builtin objects: there's a compound type named object, which is comprised of many subtypes. These subtypes are collectively called builtin objects (built-ins) or native objects (natives) or just, well, objects. Problem is, one of these native object is also called object.*

So, all built-ins are, in fact, objects. Each one is a specialized subtypes of generic object type. Commonly used built-ins are `Object, Array, Date, RegExp, Math, Function`. Function is a callable object; String, Symbol, Number and Boolean objects are rarely used directly, but they are fundamental when dealing with their primitive counterparts ("boxing primitives").

JS host environment provides many other natives, such as global object (`window` in browser), but they are not part of EcmaScript core, rather, they are a part of a separate specification (Browser Object Model, Document Object Model, etc.).

> Lists of all built-in objects on MDN: [Standard built-in objects][link1]


## Built-in objects

Objects in JS are collection of properties. Property is a key/value pair: key is a property name and value can be any of any type: a primitive (string, number, etc) or a compound (object, function, array, etc).

Built-in objects have corresponding constructor functions: `Object`, `Function`, `Array`, `Regexp`, etc. 

All of these constructor functions have a prototype: `Object.prototype`, `Function.prototype`, `Array.prototype`, `Regexp.prototype`, etc.


### Constructors and prototypes

Constructor functions, being objects, have properties. One of them is a special property named `prototype` that references an object - function's prototype object. In turn, the prototype object itself has a special property named `constructor` that references back the constructor function.

The prototype object has many properties (methods) specific to its type; for example, `Array` function's prototype object is itself an array, and it holds properties (methods) that are useful when dealing with arrays (`push, pop, indexOf`, etc). 

One way to looks at this, is that all natives are defined by a pair: a constructor function and function's corresponding prototype.

When referring to a particular method, for example a method found on the Array function itself, convention is to write `Array.from`, but when method is on `Array.prototype` object, it is shorthanded as `Array#pop`.


### Prototype Chain

All objects have access to their own properties, but moreover, they can also access properties found on other objects. This mechanism is implemented through a special internal (accessible only to JS engine) property called `[[Prototype]]` (internal properties are usually denoted in double brackets). ES6 has standardized a public, externally accessible, version of this property, `__proto__`. 


![Prototype Chain][pic1]    
*Diagram 1: JS engine’s “looking busy” screensaver*

Diagram shows some common constructor functions and their prototypes. Thick red lines represent `[[Prototype]]` links i.e. `__proto__` references . These links make up the prototype chain.

*(Proto)typical JS naming convention: there's a `prototype` property that references prototype objects and internal [[Prototype]] property along with  public `__proto__` property that comprises the prototype chain. Warning: these two refer to very different objects.*

In a way, prototype chain can be viewed as collection of all the [[Prototype]] links, or, more specifically, as a prototype chain of a given object. For example, prototype chain of `Function` function, starts with the function itself, continues to `Function.prototype` and then ends at `Object.prototype`.

`Object.prototype` is the final link in the prototype chain , it terminates the prototype chain by Prototype-linking to `null`.

> All roads lead to `Object.prototype`    

Prototype chain is traversed every time an object (array, function, object, etc) is queried for a property; if an object doesn't have such property, the search will continue, by following the Prototype links, to the next object. Finally, if `Object.prototype`, which is always at the end of any object's prototype chain, doesn't have such property, the search is over (and `undefined` is returned).

This is why all object have access to properties (methods) found on `Object.prototype` like `toString()`, `valueOf()`, `hasOwnProperty()`, `propertyIsEnumerable()`, etc.

All said is true for initial JS environment, before any  user code is executed - let a user interfere and the lot quickly goes tits up because these relationships (properties) are not immutable.


### Identifying objects

Constructor function, like all functions have a proper name (a name as a string) so they are easily recognized in the output of various JS host environments.

![Identifying objects][pic2]    
*Function, Object, prototypes, properties*

The problem is recognizing their prototype objects as they don't have a name - they are only referred to in relation to their constructor function, e.g. `Object.prototype` object. JS host environments will have different representations for them.

Conveniently, browsers' output is clickable, which displays all object's properties - knowing what (prototype) object contains which properties is a way to distinguish them.


## Creating new objects

### Objects and Functions

`Object` and `Function` natives are the most fundamental builtins; their prototype objects are at the top of the prototype chain; former sits on the top of a prototype chain, while latter is in the prototype chain of all functions, including constructor functions and user created ones.

![Object and Function][pic3]   
*Initial state*

`Object` constructor function can create various subtypes of the general object type; it can construct new "proper" object, but it is mostly creates wrapper objects for different types (for example, if its argument is a string parameter, it will wrap the string, creating a `String` object).

![Creating new objects][pic4]    
*Creating new objects using object literal*

Diagram shows creation of new object (yellow entity) and the resulting prototype chain: whether a new object is created with a constructor call, or by using its literal form, the new object will be [[Prototype]] linked to `Object.prototype`.

```js
// make an object using literal notation:
var obj1 = {a:1, b:2};
// which amount to the same as:
var obj1 = new Object(); 
obj1.a = 1;
obj1.b = 2;

// quasi OO style:
function Person(f, l) {
  this.f = f;
  this.l = l;
}
var jack = new Person("jack", "bauer");
```
Frequently used pattern for creating new object(s) is to define a function and constructor call it. In the code block above, first a new function is defined, then it is constructor called (with the `new` keyword), resulting in a new object (called 'jack').

In this scenario, resulting object will have a different [[Prototype]] linkage than an object created using literal notation. Resulting prototype chain is shown below:

![pic5]    
*Creating a new object via constructor call*

Instantiated object ('jack') will be [[Prototype]] linked to the prototype object of the constructor function ('Person.prototype').





---
[link1]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
[pic1]: diagrams/01_prototype-chain.png
[pic2]: diagrams/02_methods.png
[pic3]: diagrams/03_object-and-function.png
[pic4]: diagrams/04_object-literal.png
[pic5]: diagrams/05_object-construction-call.png
