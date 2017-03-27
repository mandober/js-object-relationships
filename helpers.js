/**
 * Finds the subtype of an object.
 *
 * @param [Object] obj Object to examine.
 * @return [string] Subtype of object.
 *
 * EXAMPLE:
 * subtype(Object); // "object Function"
 * subtype(Function.prototype); // "object Function"
 */
var subtype = function (obj) {
    return Object.prototype.toString.call(obj).slice(1, -1);
};


/**
 * Finds object's own propery names.
 *
 * @param [Object] obj Object to query for own property names.
 * @return [Array] Object's own propery names.
 *
 * EXAMPLE:
 * prop(Function.prototype); // ["apply", "bind", ...]
 */
var prop = function (obj) {
    return Object.getOwnPropertyNames(obj);
};


/**
 * Finds object's prototype chain.
 *
 * @param [Object] obj Object to start with.
 * @return [string] Object's prototype chain.
 *
 * EXAMPLE:
 * chain(Function); // "Function -> Function.prototype -> Object.prototype -> null"
 */
var chain = function (obj) {
    var proto = obj.constructor.prototype,
        result = arguments[0] + ' -> ';
    while (proto) {
        result += ' -> ' + proto.constructor.name;
        proto = Object.getPrototypeOf(proto);
    }
    return result;
}