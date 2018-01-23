//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function () {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
        push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
        nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys,
        nativeBind         = FuncProto.bind,
        nativeCreate       = Object.create;

    // Naked function reference for surrogate-prototype-swapping.
    var Ctor = function () {};

    // Create a safe reference to the Underscore object for use below.
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = "1.8.2";

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1: return function (value) {
                return func.call(context, value);
            };
            case 2: return function (value, other) {
                return func.call(context, value, other);
            };
            case 3: return function (value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function (accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result 鈥? either
    // identity, an arbitrary callback, a property matcher, or a property accessor.
    var cb = function (value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };
    _.iteratee = function (value, context) {
        return cb(value, context, Infinity);
    };

    // An internal function for creating assigner functions.
    var createAssigner = function (keysFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    // An internal function for creating a new object that inherits from another.
    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var isArrayLike = function (collection) {
        var length = collection != null && collection.length;
        return typeof length === "number" && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };

    // Return the results of applying the iteratee to each element.
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // Create a reducing function iterating left or right.
    function createReduce (dir) {
        // Optimized iterator function as using arguments.length
        // in the main function will deoptimize the, see #1991.
        function iterator (obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        }

        return function (obj, iteratee, memo, context) {
            iteratee = optimizeCb(iteratee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            // Determine the initial value if none is provided.
            if (arguments.length < 3) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            return iterator(obj, iteratee, memo, keys, index, length);
        };
    }

    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    _.reduce = _.foldl = _.inject = createReduce(1);

    // The right-associative version of reduce, also known as `foldr`.
    _.reduceRight = _.foldr = createReduce(-1);

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function (obj, predicate, context) {
        var key;
        if (isArrayLike(obj)) {
            key = _.findIndex(obj, predicate, context);
        } else {
            key = _.findKey(obj, predicate, context);
        }
        if (key !== void 0 && key !== -1) return obj[key];
    };

    // Return all the elements that pass a truth test.
    // Aliased as `select`.
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    // Determine if at least one element in the object matches a truth test.
    // Aliased as `any`.
    _.some = _.any = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `includes` and `include`.
    _.contains = _.includes = _.include = function (obj, target, fromIndex) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        return _.indexOf(obj, target, typeof fromIndex === "number" && fromIndex) >= 0;
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
        });
    };

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    // Return the maximum element (or element-based computation).
    _.max = function (obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value > result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // Return the minimum element (or element-based computation).
    _.min = function (obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // Shuffle a collection, using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher鈥揧ates_shuffle).
    _.shuffle = function (obj) {
        var set = isArrayLike(obj) ? obj : _.values(obj);
        var length = set.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand = _.random(0, index);
            if (rand !== index) shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
        }
        return shuffled;
    };

    // Sample **n** random values from a collection.
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function (obj, n, guard) {
        if (n == null || guard) {
            if (!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    };

    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), "value");
    };

    // An internal function used for aggregate "group by" operations.
    var group = function (behavior) {
        return function (obj, iteratee, context) {
            var result = {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            });
            return result;
        };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key].push(value); else result[key] = [value];
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function (result, value, key) {
        result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key]++; else result[key] = 1;
    });

    // Safely create a real, live array from anything iterable.
    _.toArray = function (obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function (obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var pass = [], fail = [];
        _.each(obj, function (value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value);
        });
        return [pass, fail];
    };

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) return array[0];
        return _.initial(array, array.length - n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.
    _.initial = function (array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.
    _.last = function (array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array.
    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function (array) {
        return _.filter(array, _.identity);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function (input, shallow, strict, startIndex) {
        var output = [], idx = 0;
        for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                // flatten current level of array or arguments object
                if (!shallow) value = flatten(value, shallow, strict);
                var j = 0, len = value.length;
                output.length += len;
                while (j < len) {
                    output[idx++] = value[j++];
                }
            } else if (!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };

    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, false);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1));
    };

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        if (array == null) return [];
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null) iteratee = cb(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = array.length; i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted) {
                if (!i || seen !== computed) result.push(value);
                seen = computed;
            } else if (iteratee) {
                if (!_.contains(seen, computed)) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (!_.contains(result, value)) {
                result.push(value);
            }
        }
        return result;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function () {
        return _.uniq(flatten(arguments, true, true));
    };

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function (array) {
        if (array == null) return [];
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = array.length; i < length; i++) {
            var item = array[i];
            if (_.contains(result, item)) continue;
            for (var j = 1; j < argsLength; j++) {
                if (!_.contains(arguments[j], item)) break;
            }
            if (j === argsLength) result.push(item);
        }
        return result;
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function (array) {
        var rest = flatten(arguments, true, true, 1);
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function () {
        return _.unzip(arguments);
    };

    // Complement of _.zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices
    _.unzip = function (array) {
        var length = array && _.max(array, "length").length || 0;
        var result = Array(length);

        for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
        }
        return result;
    };

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function (list, values) {
        var result = {};
        for (var i = 0, length = list && list.length; i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function (array, item, isSorted) {
        var i = 0, length = array && array.length;
        if (typeof isSorted === "number") {
            i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
        } else if (isSorted && length) {
            i = _.sortedIndex(array, item);
            return array[i] === item ? i : -1;
        }
        if (item !== item) {
            return _.findIndex(slice.call(array, i), _.isNaN);
        }
        for (; i < length; i++) if (array[i] === item) return i;
        return -1;
    };

    _.lastIndexOf = function (array, item, from) {
        var idx = array ? array.length : 0;
        if (typeof from === "number") {
            idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
        }
        if (item !== item) {
            return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
        }
        while (--idx >= 0) if (array[idx] === item) return idx;
        return -1;
    };

    // Generator function to create the findIndex and findLastIndex functions
    function createIndexFinder (dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = array != null && array.length;
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                if (predicate(array[index], index, array)) return index;
            }
            return -1;
        };
    }

    // Returns the first index on an array-like that passes a predicate test
    _.findIndex = createIndexFinder(1);

    _.findLastIndex = createIndexFinder(-1);

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = array.length;
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
        }
        return low;
    };

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function (start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = step || 1;

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    };

    // Function (ahem) Functions
    // ------------------

    // Determines whether to execute a function as a constructor
    // or a normal function with the provided arguments
    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
    };

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function (func, context) {
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError("Bind must be called on a function");
        var args = slice.call(arguments, 2);
        var bound = function () {
            return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
        };
        return bound;
    };

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder, allowing any combination of arguments to be pre-filled.
    _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1);
        var bound = function () {
            var position = 0, length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
                args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) args.push(arguments[position++]);
            return executeBound(func, bound, this, this, args);
        };
        return bound;
    };

    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = function (obj) {
        var i, length = arguments.length, key;
        if (length <= 1) throw new Error("bindAll must be passed function names");
        for (i = 1; i < length; i++) {
            key = arguments[i];
            obj[key] = _.bind(obj[key], obj);
        }
        return obj;
    };

    // Memoize an expensive function by storing its results.
    _.memoize = function (func, hasher) {
        var memoize = function (key) {
            var cache = memoize.cache;
            var address = "" + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    };

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = _.partial(_.delay, _, 1);

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function () {
            var last = _.now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func);
    };

    // Returns a negated version of the passed-in predicate.
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function () {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
        };
    };

    // Returns a function that will only be executed on and after the Nth call.
    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // Returns a function that will only be executed up to (but not including) the Nth call.
    _.before = function (times, func) {
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
        };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = _.partial(_.before, 2);

    // Object Functions
    // ----------------

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{toString: null}.propertyIsEnumerable("toString");
    var nonEnumerableProps = ["valueOf", "isPrototypeOf", "toString",
        "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];

    function collectNonEnumProps (obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

        // Constructor is a special case.
        var prop = "constructor";
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    }

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // Retrieve all the property names of an object.
    _.allKeys = function (obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // Retrieve the values of an object's properties.
    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    // Returns the results of applying the iteratee to each element of the object
    // In contrast to _.map it returns an object
    _.mapObject = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys =  _.keys(obj),
            length = keys.length,
            results = {},
            currentKey;
        for (var index = 0; index < length; index++) {
            currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = createAssigner(_.allKeys);

    // Assigns a given object with all the own properties in the passed-in object(s)
    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
    _.extendOwn = _.assign = createAssigner(_.keys);

    // Returns the first key on an object that passes a predicate test
    _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
        }
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function (object, oiteratee, context) {
        var result = {}, obj = object, iteratee, keys;
        if (obj == null) return result;
        if (_.isFunction(oiteratee)) {
            keys = _.allKeys(obj);
            iteratee = optimizeCb(oiteratee, context);
        } else {
            keys = flatten(arguments, false, false, 1);
            iteratee = function (value, key, obj) { return key in obj; };
            obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
    };

    // Return a copy of the object without the blacklisted properties.
    _.omit = function (obj, iteratee, context) {
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
        } else {
            var keys = _.map(flatten(arguments, false, false, 1), String);
            iteratee = function (value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    };

    // Fill in a given object with default properties.
    _.defaults = createAssigner(_.allKeys, true);

    // Creates an object that inherits from the given prototype object.
    // If additional properties are provided then they will be added to the
    // created object.
    _.create = function (prototype, props) {
        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    // Returns whether an object has a given set of `key:value` pairs.
    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };


    // Internal recursive comparison function for `isEqual`.
    var eq = function (a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) return a === b;
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case "[object RegExp]":
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case "[object String]":
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return "" + a === "" + b;
            case "[object Number]":
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case "[object Date]":
            case "[object Boolean]":
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
        }

        var areArrays = className === "[object Array]";
        if (!areArrays) {
            if (typeof a !== "object" || typeof b !== "object") return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                _.isFunction(bCtor) && bCtor instanceof bCtor)
                && ("constructor" in a && "constructor" in b)) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = _.keys(a), key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (_.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function (a, b) {
        return eq(a, b);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function (obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        return _.keys(obj).length === 0;
    };

    // Is a given value a DOM element?
    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function (obj) {
        return toString.call(obj) === "[object Array]";
    };

    // Is a given variable an object?
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === "function" || type === "object" && !!obj;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    _.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (name) {
        _["is" + name] = function (obj) {
            return toString.call(obj) === "[object " + name + "]";
        };
    });

    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
            return _.has(obj, "callee");
        };
    }

    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), and in Safari 8 (#1929).
    if (typeof /./ !== "function" && typeof Int8Array !== "object") {
        _.isFunction = function (obj) {
            return typeof obj === "function" || false;
        };
    }

    // Is a given object a finite number?
    _.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function (obj) {
        return _.isNumber(obj) && obj !== +obj;
    };

    // Is a given value a boolean?
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
    };

    // Is a given value equal to null?
    _.isNull = function (obj) {
        return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function (obj) {
        return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };

    // Keep the identity function around for default iteratees.
    _.identity = function (value) {
        return value;
    };

    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function (value) {
        return function () {
            return value;
        };
    };

    _.noop = function () {};

    _.property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // Generates a function for a given object that returns a given property.
    _.propertyOf = function (obj) {
        return obj == null ? function () {} : function (key) {
            return obj[key];
        };
    };

    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        return function (obj) {
            return _.isMatch(obj, attrs);
        };
    };

    // Run a function **n** times.
    _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function () {
        return new Date().getTime();
    };

    // List of HTML entities for escaping.
    var escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    };
    var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };
        // Regexes for identifying a key that needs to be escaped
        var source = "(?:" + _.keys(map).join("|") + ")";
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, "g");
        return function (string) {
            string = string == null ? "" : "" + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function (object, property, fallback) {
        var value = object == null ? void 0 : object[property];
        if (value === void 0) {
            value = fallback;
        }
        return _.isFunction(value) ? value.call(object) : value;
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function (match) {
        return "\\" + escapes[match];
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function (text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join("|") + "|$", "g");

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            // Adobe VMs need the match returned to produce the correct offest.
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            var render = new Function(settings.variable || "obj", "_", source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        var template = function (data) {
            return render.call(this, data, _);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || "obj";
        template.source = "function(" + argument + "){\n" + source + "}";

        return template;
    };

    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var result = function (instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result(this, func.apply(_, args));
            };
        });
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === "shift" || name === "splice") && obj.length === 0) delete obj[0];
            return result(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    _.each(["concat", "join", "slice"], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return result(this, method.apply(this._wrapped, arguments));
        };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function () {
        return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function () {
        return "" + this._wrapped;
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === "function" && define.amd) {
        define("underscore", [], function () {
            return _;
        });
    }
}.call(this));/**
 * Created by richie on 15/7/8.
 */
/**
 * 初始化BI对象
 */
if (window.BI == null) {
    window.BI = {};
}/**
 * 常量
 */

_.extend(BI, {
    MAX: 0xfffffffffffffff,
    MIN: -0xfffffffffffffff,
    EVENT_RESPONSE_TIME: 200,
    zIndex_layer: 1e5,
    zIndex_floatbox: 1e6,
    zIndex_popup: 1e7,
    zIndex_masker: 1e8,
    zIndex_tip: 1e9,
    emptyStr: "",
    emptyFn: function () {
    },
    empty: null,
    Key: {
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/"
    },
    KeyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    },
    Status: {
        SUCCESS: 1,
        WRONG: 2,
        START: 3,
        END: 4,
        WAITING: 5,
        READY: 6,
        RUNNING: 7,
        OUTOFBOUNDS: 8,
        NULL: -1
    },
    Direction: {
        Top: "top",
        Bottom: "bottom",
        Left: "left",
        Right: "right",
        Custom: "custom"
    },
    Axis: {
        Vertical: "vertical",
        Horizontal: "horizontal"
    },
    Selection: {
        Default: -2,
        None: -1,
        Single: 0,
        Multi: 1,
        All: 2
    },
    HorizontalAlign: {
        Left: "left",
        Right: "right",
        Center: "center",
        Stretch: "stretch"
    },
    VerticalAlign: {
        Middle: "middle",
        Top: "top",
        Bottom: "bottom",
        Stretch: "stretch"
    }
});/**
 * 对数组对象的扩展
 * @class Array
 */
_.extend(Array.prototype, {
    contains: function (o) {
        return this.indexOf(o) > -1;
    },

    /**
     * 从数组中移除指定的值，如果值不在数组中，则不产生任何效果
     * @param {Object} o 要移除的值
     * @return {Array} 移除制定值后的数组
     */
    remove: function (o) {
        var index = this.indexOf(o);
        if (index !== -1) {
            this.splice(index, 1);
        }
        return this;
    },

    pushArray: function (array) {
        for (var i = 0; i < array.length; i++) {
            this.push(array[i]);
        }
    },
    pushDistinct: function (obj) {
        if (!this.contains(obj)) {
            this.push(obj);
        }
    },
    pushDistinctArray: function (array) {
        for (var i = 0, len = array.length; i < len; i++) {
            this.pushDistinct(array[i]);
        }
    }
});
if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== "0.000" ||
    (0.9).toFixed(0) === "0" || (1.255).toFixed(2) !== "1.25" ||
    (1000000000000000128).toFixed(0) !== "1000000000000000128") {
    (function () {
        var base, size, data, i;
        base = 1e7;
        size = 6;
        data = [0, 0, 0, 0, 0, 0];
        function multiply (n, c) {
            var i = -1;
            while (++i < size) {
                c += n * data[i];
                data[i] = c % base;
                c = Math.floor(c / base);
            }
        }

        function divide (n) {
            var i = size, c = 0;
            while (--i >= 0) {
                c += data[i];
                data[i] = Math.floor(c / n);
                c = (c % n) * base;
            }
        }

        function toString () {
            var i = size;
            var s = "";
            while (--i >= 0) {
                if (s !== "" || i === 0 || data[i] !== 0) {
                    var t = String(data[i]);
                    if (s === "") {
                        s = t;
                    } else {
                        s += "0000000".slice(0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        }

        function pow (x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x)
                : pow(x * x, n / 2, acc)));
        }

        function log (x) {
            var n = 0;
            while (x >= 4096) {
                n += 12;
                x /= 4096;
            }
            while (x >= 2) {
                n += 1;
                x /= 2;
            }
            return n;
        }

        Number.prototype.toFixed = function (fractionDigits) {
            var f, x, s, m, e, z, j, k;
            f = Number(fractionDigits);
            f = f !== f ? 0 : Math.floor(f);

            if (f < 0 || f > 20) {
                throw new RangeError("Number.toFixed called with invalid number of decimals");
            }

            x = Number(this);

            if (x !== x) {
                return "NaN";
            }

            if (x <= -1e21 || x > 1e21) {
                return String(x);
            }

            s = "";

            if (x < 0) {
                s = "-";
                x = -x;
            }

            m = "0";

            if (x > 1e-21) {
                // 1e-21<x<1e21
                // -70<log2(x)<70
                e = log(x * pow(2, 69, 1)) - 69;
                z = (e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1));
                z *= 0x10000000000000;// Math.pow(2,52);
                e = 52 - e;

                // -18<e<122
                // x=z/2^e
                if (e > 0) {
                    multiply(0, z);
                    j = f;

                    while (j >= 7) {
                        multiply(1e7, 0);
                        j -= 7;
                    }

                    multiply(pow(10, j, 1), 0);
                    j = e - 1;

                    while (j >= 23) {
                        divide(1 << 23);
                        j -= 23;
                    }
                    divide(1 << j);
                    multiply(1, 1);
                    divide(2);
                    m = toString();
                } else {
                    multiply(0, z);
                    multiply(1 << (-e), 0);
                    m = toString() + "0.00000000000000000000".slice(2, 2 + f);
                }
            }

            if (f > 0) {
                k = m.length;

                if (k <= f) {
                    m = s + "0.0000000000000000000".slice(0, f - k + 2) + m;
                } else {
                    m = s + m.slice(0, k - f) + "." + m.slice(k - f);
                }
            } else {
                m = s + m;
            }

            return m;
        };

    })();
}


/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd (arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};
/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub (arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.sub = function (arg) {
    return accSub(this, arg);
};
/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul (arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
};
/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv (arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (t2 > t1) ? (r1 / r2) * pow(10, t2 - t1) : (r1 / r2) / pow(10, t1 - t2);
    }
}

// 给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};/**
 * 对字符串对象的扩展
 * @class String
 */
_.extend(String.prototype, {

    /**
     * 判断字符串是否已指定的字符串开始
     * @param {String} startTag   指定的开始字符串
     * @return {Boolean}  如果字符串以指定字符串开始则返回true，否则返回false
     */
    startWith: function (startTag) {
        if (startTag == null || startTag == "" || this.length === 0 || startTag.length > this.length) {
            return false;
        }
        return this.substr(0, startTag.length) == startTag;
    },
    /**
     * 判断字符串是否以指定的字符串结束
     * @param {String} endTag 指定的字符串
     * @return {Boolean}  如果字符串以指定字符串结束则返回true，否则返回false
     */
    endWith: function (endTag) {
        if (endTag == null || endTag == "" || this.length === 0 || endTag.length > this.length) {
            return false;
        }
        return this.substring(this.length - endTag.length) == endTag;
    },

    /**
     * 获取url中指定名字的参数
     * @param {String} name 参数的名字
     * @return {String} 参数的值
     */
    getQuery: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = this.substr(this.indexOf("?") + 1).match(reg);
        if (r) {
            return unescape(r[2]);
        }
        return null;
    },

    /**
     * 给url加上给定的参数
     * @param {Object} paras 参数对象，是一个键值对对象
     * @return {String} 添加了给定参数的url
     */
    appendQuery: function (paras) {
        if (!paras) {
            return this;
        }
        var src = this;
        // 没有问号说明还没有参数
        if (src.indexOf("?") === -1) {
            src += "?";
        }
        // 如果以问号结尾，说明没有其他参数
        if (src.endWith("?") !== false) {
        } else {
            src += "&";
        }
        _.each(paras, function (value, name) {
            if (typeof(name) === "string") {
                src += name + "=" + value + "&";
            }
        });
        src = src.substr(0, src.length - 1);
        return src;
    },
    /**
     * 将所有符合第一个字符串所表示的字符串替换成为第二个字符串
     * @param {String} s1 要替换的字符串的正则表达式
     * @param {String} s2 替换的结果字符串
     * @returns {String} 替换后的字符串
     */
    replaceAll: function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    },
    /**
     * 总是让字符串以指定的字符开头
     * @param {String} start 指定的字符
     * @returns {String} 以指定字符开头的字符串
     */
    perfectStart: function (start) {
        if (this.startWith(start)) {
            return this;
        }
        return start + this;

    },

    /**
     * 获取字符串中某字符串的所有项位置数组
     * @param {String} sub 子字符串
     * @return {Number[]} 子字符串在父字符串中出现的所有位置组成的数组
     */
    allIndexOf: function (sub) {
        if (typeof sub !== "string") {
            return [];
        }
        var str = this;
        var location = [];
        var offset = 0;
        while (str.length > 0) {
            var loc = str.indexOf(sub);
            if (loc === -1) {
                break;
            }
            location.push(offset + loc);
            str = str.substring(loc + sub.length, str.length);
            offset += loc + sub.length;
        }
        return location;
    }
});

/**
 * 对字符串对象的扩展
 * @class String
 */
_.extend(String, {

    /**
     * 对字符串中的'和\做编码处理
     * @static
     * @param {String} string 要做编码处理的字符串
     * @return {String} 编码后的字符串
     */
    escape: function (string) {
        return string.replace(/('|\\)/g, "\\$1");
    },

    /**
     * 让字符串通过指定字符做补齐的函数
     *
     *      var s = String.leftPad('123', 5, '0');//s的值为：'00123'
     *
     * @static
     * @param {String} val 原始值
     * @param {Number} size 总共需要的位数
     * @param {String} ch 用于补齐的字符
     * @return {String}  补齐后的字符串
     */
    leftPad: function (val, size, ch) {
        var result = String(val);
        if (!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result.toString();
    },

    /**
     * 对字符串做替换的函数
     *
     *      var cls = 'my-class', text = 'Some text';
     *      var res = String.format('<div class="{0}>{1}</div>"', cls, text);
     *      //res的值为：'<div class="my-class">Some text</div>';
     *
     * @static
     * @param {String} format 要做替换的字符串，替换字符串1，替换字符串2...
     * @return {String} 做了替换后的字符串
     */
    format: function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i];
        });
    }
});/**
 * 基本函数
 * Create By GUY 2014\11\17
 *
 */

if (!window.BI) {
    window.BI = {};
}

!(function (undefined) {
    var traverse = function (func, context) {
        return function (value, key, obj) {
            return func.call(context, key, value, obj);
        };
    };
    var _apply = function (name) {
        return function () {
            return _[name].apply(_, arguments);
        };
    };
    var _applyFunc = function (name) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args[1] = _.isFunction(args[1]) ? traverse(args[1], args[2]) : args[1];
            return _[name].apply(_, args);
        };
    };

    // Utility
    _.extend(BI, {
        i18nText: function (key) {
            var localeText = (BI.i18n && BI.i18n[key]) || "";
            if (!localeText) {
                localeText = key;
            }
            var len = arguments.length;
            if (len > 1) {
                for (var i = 1; i < len; i++) {
                    var key = "{R" + i + "}";
                    localeText = localeText.replaceAll(key, arguments[i] + "");
                }
            }
            return localeText;
        },

        assert: function (v, is) {
            if (this.isFunction(is)) {
                if (!is(v)) {
                    throw new Error(v + " error");
                } else {
                    return true;
                }
            }
            if (!this.isArray(is)) {
                is = [is];
            }
            if (!this.deepContains(is, v)) {
                throw new Error(v + " error");
            }
        },

        warn: function (message) {
            console.warn(message);
        },

        UUID: function () {
            var f = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            var str = "";
            for (var i = 0; i < 16; i++) {
                var r = parseInt(f.length * Math.random(), 10);
                str += f[r];
            }
            return str;
        },

        isWidget: function (widget) {
            return widget instanceof BI.Widget || (BI.View && widget instanceof BI.View);
        },

        createWidgets: function (items, options) {
            if (!BI.isArray(items)) {
                throw new Error("cannot create Widgets");
            }
            return BI.map(BI.flatten(items), function (i, item) {
                return BI.createWidget(item, BI.deepClone(options));
            });
        },

        createItems: function (data, innerAttr, outerAttr) {
            innerAttr = BI.isArray(innerAttr) ? innerAttr : BI.makeArray(BI.flatten(data).length, innerAttr);
            outerAttr = BI.isArray(outerAttr) ? outerAttr : BI.makeArray(BI.flatten(data).length, outerAttr);
            return BI.map(data, function (i, item) {
                if (BI.isArray(item)) {
                    return BI.createItems(item, innerAttr, outerAttr);
                }
                if (item instanceof BI.Widget) {
                    return BI.extend({}, innerAttr.shift(), outerAttr.shift(), {
                        type: null,
                        el: item
                    });
                }
                if (innerAttr[0] instanceof BI.Widget) {
                    outerAttr.shift();
                    return BI.extend({}, item, {
                        el: innerAttr.shift()
                    });
                }
                if (item.el instanceof BI.Widget || (BI.View && item.el instanceof BI.View)) {
                    innerAttr.shift();
                    return BI.extend({}, outerAttr.shift(), {type: null}, item);
                }
                if (item.el) {
                    return BI.extend({}, outerAttr.shift(), item, {
                        el: BI.extend({}, innerAttr.shift(), item.el)
                    });
                }
                return BI.extend({}, outerAttr.shift(), {
                    el: BI.extend({}, innerAttr.shift(), item)
                });
            });
        },

        // 用容器包装items
        packageItems: function (items, layouts) {
            for (var i = layouts.length - 1; i >= 0; i--) {
                items = BI.map(items, function (k, it) {
                    return BI.extend({}, layouts[i], {
                        items: [
                            BI.extend({}, layouts[i].el, {
                                el: it
                            })
                        ]
                    });
                });
            }
            return items;
        },

        formatEL: function (obj) {
            if (obj && !obj.type && obj.el) {
                return obj;
            }
            return {
                el: obj
            };
        },

        // 剥开EL
        stripEL: function (obj) {
            return obj.type && obj || obj.el || obj;
        },

        trans2Element: function (widgets) {
            return BI.map(widgets, function (i, wi) {
                return wi.element;
            });
        }
    });

    // 集合相关方法
    _.each(["where", "findWhere", "contains", "invoke", "pluck", "shuffle", "sample", "toArray", "size"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["each", "map", "reduce", "reduceRight", "find", "filter", "reject", "every", "all", "some", "any", "max", "min",
        "sortBy", "groupBy", "indexBy", "countBy", "partition"], function (name) {
        BI[name] = _applyFunc(name);
    });
    _.extend(BI, {
        clamp: function (value, minValue, maxValue) {
            if (value < minValue) {
                value = minValue;
            }
            if (value > maxValue) {
                value = maxValue;
            }
            return value;
        },
        // 数数
        count: function (from, to, predicate) {
            var t;
            if (predicate) {
                for (t = from; t < to; t++) {
                    predicate(t);
                }
            }
            return to - from;
        },

        // 倒数
        inverse: function (from, to, predicate) {
            return BI.count(to, from, predicate);
        },

        firstKey: function (obj) {
            var res = undefined;
            BI.any(obj, function (key, value) {
                res = key;
                return true;
            });
            return res;
        },

        lastKey: function (obj) {
            var res = undefined;
            BI.each(obj, function (key, value) {
                res = key;
                return true;
            });
            return res;
        },

        firstObject: function (obj) {
            var res = undefined;
            BI.any(obj, function (key, value) {
                res = value;
                return true;
            });
            return res;
        },

        lastObject: function (obj) {
            var res = undefined;
            BI.each(obj, function (key, value) {
                res = value;
                return true;
            });
            return res;
        },

        concat: function (obj1, obj2) {
            if (BI.isKey(obj1)) {
                return obj1 + "" + obj2;
            }
            if (BI.isArray(obj1)) {
                return obj1.concat(obj2);
            }
            if (BI.isObject(obj1)) {
                return _.extend({}, obj1, obj2);
            }
        },

        backEach: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                predicate(index, obj[index], obj);
            }
            return false;
        },

        backAny: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                if (predicate(index, obj[index], obj)) {
                    return true;
                }
            }
            return false;
        },

        backEvery: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                if (!predicate(index, obj[index], obj)) {
                    return false;
                }
            }
            return true;
        },

        backFindKey: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            var keys = _.keys(obj), key;
            for (var i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
                if (predicate(obj[key], key, obj)) {
                    return key;
                }
            }
        },

        backFind: function (obj, predicate, context) {
            var key;
            if (BI.isArray(obj)) {
                key = BI.findLastIndex(obj, predicate, context);
            } else {
                key = BI.backFindKey(obj, predicate, context);
            }
            if (key !== void 0 && key !== -1) {
                return obj[key];
            }
        },

        remove: function (obj, target, context) {
            var isFunction = BI.isFunction(target);
            target = isFunction || BI.isArray(target) ? target : [target];
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if ((isFunction && target.apply(context, [i, obj[i]]) === true) || (!isFunction && target.contains(obj[i]))) {
                        obj.splice(i--, 1);
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if ((isFunction && target.apply(context, [i, obj[i]]) === true) || (!isFunction && target.contains(obj[i]))) {
                        delete obj[i];
                    }
                });
            }
        },

        removeAt: function (obj, index) {
            index = BI.isArray(index) ? index : [index];
            var isArray = BI.isArray(obj), i;
            for (i = 0; i < index.length; i++) {
                if (isArray) {
                    obj[index[i]] = "$deleteIndex";
                } else {
                    delete obj[index[i]];
                }
            }
            if (isArray) {
                BI.remove(obj, "$deleteIndex");
            }
        },

        string2Array: function (str) {
            return str.split("&-&");
        },

        array2String: function (array) {
            return array.join("&-&");
        },

        abc2Int: function (str) {
            var idx = 0, start = "A", str = str.toUpperCase();
            for (var i = 0, len = str.length; i < len; ++i) {
                idx = str.charAt(i).charCodeAt(0) - start.charCodeAt(0) + 26 * idx + 1;
                if (idx > (2147483646 - str.charAt(i).charCodeAt(0) + start.charCodeAt(0)) / 26) {
                    return 0;
                }
            }
            return idx;
        },

        int2Abc: function (num) {
            var DIGITS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            var idx = num, str = "";
            if (num === 0) {
                return "";
            }
            while (idx !== 0) {
                var t = idx % 26;
                if (t === 0) {
                    t = 26;
                }
                str = DIGITS[t - 1] + str;
                idx = (idx - t) / 26;
            }
            return str;
        }
    });

    // 数组相关的方法
    _.each(["first", "initial", "last", "rest", "compact", "flatten", "without", "union", "intersection",
        "difference", "zip", "unzip", "object", "indexOf", "lastIndexOf", "sortedIndex", "range"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["findIndex", "findLastIndex"], function (name) {
        BI[name] = _applyFunc(name);
    });
    _.extend(BI, {
        // 构建一个长度为length的数组
        makeArray: function (length, value) {
            var res = [];
            for (var i = 0; i < length; i++) {
                if (BI.isNull(value)) {
                    res.push(i);
                } else {
                    res.push(BI.deepClone(value));
                }
            }
            return res;
        },

        makeObject: function (array, value) {
            var map = {};
            for (var i = 0; i < array.length; i++) {
                if (BI.isNull(value)) {
                    map[array[i]] = array[i];
                } else {
                    map[array[i]] = BI.deepClone(value);
                }
            }
            return map;
        },

        makeArrayByArray: function (array, value) {
            var res = [];
            if (!array) {
                return res;
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (BI.isArray(array[i])) {
                    res.push(arguments.callee(array[i], value));
                } else {
                    res.push(BI.deepClone(value));
                }
            }
            return res;
        },

        uniq: function (array, isSorted, iteratee, context) {
            if (array == null) {
                return [];
            }
            if (!_.isBoolean(isSorted)) {
                context = iteratee;
                iteratee = isSorted;
                isSorted = false;
            }
            iteratee && (iteratee = traverse(iteratee, context));
            return _.uniq.call(_, array, isSorted, iteratee, context);
        }
    });

    // 对象相关方法
    _.each(["keys", "allKeys", "values", "pairs", "invert", "create", "functions", "extend", "extendOwn",
        "defaults", "clone", "property", "propertyOf", "matcher", "isEqual", "isMatch", "isEmpty",
        "isElement", "isNumber", "isString", "isArray", "isObject", "isArguments", "isFunction", "isFinite",
        "isBoolean", "isDate", "isRegExp", "isError", "isNaN", "isUndefined"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["mapObject", "findKey", "pick", "omit", "tap"], function (name) {
        BI[name] = _applyFunc(name);
    });
    _.extend(BI, {

        inherit: function (sb, sp, overrides) {
            if (typeof sp === "object") {
                overrides = sp;
                sp = sb;
                sb = function () {
                    return sp.apply(this, arguments);
                };
            }
            var F = function () {
                }, spp = sp.prototype;
            F.prototype = spp;
            sb.prototype = new F();
            sb.superclass = spp;
            _.extend(sb.prototype, overrides, {
                superclass: sp
            });
            return sb;
        },

        has: function (obj, keys) {
            if (BI.isArray(keys)) {
                if (keys.length === 0) {
                    return false;
                }
                return BI.every(keys, function (i, key) {
                    return _.has(obj, key);
                });
            }
            return _.has.apply(_, arguments);
        },

        // 数字和字符串可以作为key
        isKey: function (key) {
            return BI.isNumber(key) || (BI.isString(key) && key.length > 0);
        },

        // 忽略大小写的等于
        isCapitalEqual: function (a, b) {
            a = BI.isNull(a) ? a : ("" + a).toLowerCase();
            b = BI.isNull(b) ? b : ("" + b).toLowerCase();
            return BI.isEqual(a, b);
        },

        isWidthOrHeight: function (w) {
            if (typeof w === "number") {
                return w >= 0;
            } else if (typeof w === "string") {
                return /^\d{1,3}%$/.exec(w) || w == "auto" || /^\d+px$/.exec(w);
            }
        },

        isNotNull: function (obj) {
            return !BI.isNull(obj);
        },

        isNull: function (obj) {
            return typeof  obj === "undefined" || obj === null;
        },

        isPlainObject: function () {
            return $.isPlainObject.apply($, arguments);
        },

        isEmptyArray: function (arr) {
            return BI.isArray(arr) && BI.isEmpty(arr);
        },

        isNotEmptyArray: function (arr) {
            return BI.isArray(arr) && !BI.isEmpty(arr);
        },

        isEmptyObject: function (obj) {
            return BI.isEqual(obj, {});
        },

        isNotEmptyObject: function (obj) {
            return BI.isPlainObject(obj) && !BI.isEmptyObject(obj);
        },

        isEmptyString: function (obj) {
            return BI.isString(obj) && obj.length === 0;
        },

        isNotEmptyString: function (obj) {
            return BI.isString(obj) && !BI.isEmptyString(obj);
        },

        isWindow: function () {
            return $.isWindow.apply($, arguments);
        }
    });

    // deep方法
    _.extend(BI, {
        /**
         *完全克隆�?个js对象
         * @param obj
         * @returns {*}
         */
        deepClone: function (obj) {
            if (obj === null || obj === undefined) {
                return obj;
            }

            var type = Object.prototype.toString.call(obj);

            // Date
            if (type === "[object Date]") {
                return Date.getDate(obj.getTime());
            }

            var i, clone, key;

            // Array
            if (type === "[object Array]") {
                i = obj.length;

                clone = [];

                while (i--) {
                    clone[i] = BI.deepClone(obj[i]);
                }
            }
            // Object
            else if (type === "[object Object]" && obj.constructor === Object) {
                clone = {};

                for (var i in obj) {
                    if (BI.has(obj, i)) {
                        clone[i] = BI.deepClone(obj[i]);
                    }
                }
            }

            return clone || obj;
        },

        isDeepMatch: function (object, attrs) {
            var keys = BI.keys(attrs), length = keys.length;
            if (object == null) {
                return !length;
            }
            var obj = Object(object);
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (!BI.isEqual(attrs[key], obj[key]) || !(key in obj)) {
                    return false;
                }
            }
            return true;
        },

        deepContains: function (obj, copy) {
            if (BI.isObject(copy)) {
                return BI.any(obj, function (i, v) {
                    if (BI.isEqual(v, copy)) {
                        return true;
                    }
                });
            }
            return BI.contains(obj, copy);
        },

        deepIndexOf: function (obj, target) {
            for (var i = 0; i < obj.length; i++) {
                if (BI.isEqual(target, obj[i])) {
                    return i;
                }
            }
            return -1;
        },

        deepRemove: function (obj, target) {
            var done = false;
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if (BI.isEqual(target, obj[i])) {
                        obj.splice(i--, 1);
                        done = true;
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if (BI.isEqual(target, obj[i])) {
                        delete obj[i];
                        done = true;
                    }
                });
            }
            return done;
        },

        deepWithout: function (obj, target) {
            if (BI.isArray(obj)) {
                var result = [];
                for (var i = 0; i < obj.length; i++) {
                    if (!BI.isEqual(target, obj[i])) {
                        result.push(obj[i]);
                    }
                }
                return result;
            }
            var result = {};
            BI.each(obj, function (i, v) {
                if (!BI.isEqual(target, obj[i])) {
                    result[i] = v;
                }
            });
            return result;

        },

        deepUnique: function (array) {
            var result = [];
            BI.each(array, function (i, item) {
                if (!BI.deepContains(result, item)) {
                    result.push(item);
                }
            });
            return result;
        },

        // 比较两个对象得出不一样的key值
        deepDiff: function (object, other) {
            object || (object = {});
            other || (other = {});
            var result = [];
            var used = [];
            for (var b in object) {
                if (this.has(object, b)) {
                    if (!this.isEqual(object[b], other[b])) {
                        result.push(b);
                    }
                    used.push(b);
                }
            }
            for (var b in other) {
                if (this.has(other, b) && !used.contains(b)) {
                    result.push(b);
                }
            }
            return result;
        },

        deepExtend: function () {
            var args = [].slice.call(arguments);
            args.unshift(true);
            return $.extend.apply($, args);
        }
    });

    // 通用方法
    _.each(["uniqueId", "result", "chain", "iteratee", "escape", "unescape"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        };
    });

    // 事件相关方法
    _.each(["bind", "once", "partial", "debounce", "throttle", "delay", "defer", "wrap"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        };
    });

    _.extend(BI, {
        nextTick: (function () {
            var callbacks = [];
            var pending = false;
            var timerFunc;

            function nextTickHandler () {
                pending = false;
                var copies = callbacks.slice(0);
                callbacks = [];
                for (var i = 0; i < copies.length; i++) {
                    copies[i]();
                }
            }

            if (typeof Promise !== "undefined") {
                var p = Promise.resolve();
                timerFunc = function () {
                    p.then(nextTickHandler);
                };
            } else

            /* istanbul ignore if */
            if (typeof MutationObserver !== "undefined") {
                var counter = 1;
                var observer = new MutationObserver(nextTickHandler);
                var textNode = document.createTextNode(counter + "");
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function () {
                    counter = (counter + 1) % 2;
                    textNode.data = counter + "";
                };
            } else {
                timerFunc = function () {
                    setTimeout(nextTickHandler, 0);
                };
            }
            return function queueNextTick (cb) {
                var _resolve;
                var args = [].slice.call(arguments, 1);
                callbacks.push(function () {
                    if (cb) {
                        cb.apply(null, args);
                    }
                    if (_resolve) {
                        _resolve.apply(null, args);
                    }
                });
                if (!pending) {
                    pending = true;
                    timerFunc();
                }
                if (!cb && typeof Promise !== "undefined") {
                    return new Promise(function (resolve) {
                        _resolve = resolve;
                    });
                }
            };
        })()
    });

    // 数字相关方法
    _.each(["random"], function (name) {
        BI[name] = _apply(name);
    });
    _.extend(BI, {
        getTime: function () {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            }
            if (window.performance && window.performance.webkitNow) {
                return window.performance.webkitNow();
            }
            if (Date.now) {
                return Date.now();
            }
            return Date.getDate().getTime();



        },

        parseInt: function (number) {
            var radix = 10;
            if (/^0x/g.test(number)) {
                radix = 16;
            }
            try {
                return parseInt(number, radix);
            } catch (e) {
                throw new Error(number + "parse int error");
                return NaN;
            }
        },

        parseSafeInt: function (value) {
            var MAX_SAFE_INTEGER = 9007199254740991;
            return value
                ? this.clamp(this.parseInt(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
                : (value === 0 ? value : 0);
        },

        parseFloat: function (number) {
            try {
                return parseFloat(number);
            } catch (e) {
                throw new Error(number + "parse float error");
                return NaN;
            }
        },

        isNaturalNumber: function (number) {
            if (/^\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isPositiveInteger: function (number) {
            if (/^\+?[1-9][0-9]*$/.test(number)) {
                return true;
            }
            return false;
        },

        isNegativeInteger: function (number) {
            if (/^\-[1-9][0-9]*$/.test(number)) {
                return true;
            }
            return false;
        },

        isInteger: function (number) {
            if (/^\-?\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isNumeric: function (number) {
            return $.isNumeric(number);
        },

        isFloat: function (number) {
            if (/^([+-]?)\\d*\\.\\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isOdd: function (number) {
            if (!BI.isInteger(number)) {
                return false;
            }
            return number & 1 === 1;
        },

        isEven: function (number) {
            if (!BI.isInteger(number)) {
                return false;
            }
            return number & 1 === 0;
        },

        sum: function (array, iteratee, context) {
            var sum = 0;
            BI.each(array, function (i, item) {
                if (iteratee) {
                    sum += Number(iteratee.apply(context, [i, item]));
                } else {
                    sum += Number(item);
                }
            });
            return sum;
        },

        average: function (array, iteratee, context) {
            var sum = BI.sum(array, iteratee, context);
            return sum / array.length;
        }
    });

    // 字符串相关方法
    _.extend(BI, {
        trim: function () {
            return $.trim.apply($, arguments);
        },

        toUpperCase: function (string) {
            return (string + "").toLocaleUpperCase();
        },

        toLowerCase: function (string) {
            return (string + "").toLocaleLowerCase();
        },

        isEndWithBlank: function (string) {
            return /(\s|\u00A0)$/.test(string);
        },

        isLiteral: function (exp) {
            var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;
            return literalValueRE.test(exp);
        },

        stripQuotes: function (str) {
            var a = str.charCodeAt(0);
            var b = str.charCodeAt(str.length - 1);
            return a === b && (a === 0x22 || a === 0x27)
                ? str.slice(1, -1)
                : str;
        },

        // background-color => backgroundColor
        camelize: function (str) {
            return str.replace(/-(.)/g, function (_, character) {
                return character.toUpperCase();
            });
        },

        // backgroundColor => background-color
        hyphenate: function (str) {
            return str.replace(/([A-Z])/g, "-$1").toLowerCase();
        },

        isNotEmptyString: function (str) {
            return BI.isString(str) && !BI.isEmpty(str);
        },

        isEmptyString: function (str) {
            return BI.isString(str) && BI.isEmpty(str);
        },

        /**
         * 对字符串进行加密 {@link #decrypt}
         * @static
         * @param str 原始字符�?
         * @param keyt 密钥
         * @returns {String} 加密后的字符�?
         */
        encrypt: function (str, keyt) {
            if (str == "") {
                return "";
            }
            str = escape(str);
            if (!keyt || keyt == "") {
                keyt = "655";
            }
            keyt = escape(keyt);
            if (keyt == null || keyt.length <= 0) {
                alert("Please enter a password with which to encrypt the message.");
                return null;
            }
            var prand = "";
            for (var i = 0; i < keyt.length; i++) {
                prand += keyt.charCodeAt(i).toString();
            }
            var sPos = Math.floor(prand.length / 5);
            var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));

            var incr = Math.ceil(keyt.length / 2);
            var modu = Math.pow(2, 31) - 1;
            if (mult < 2) {
                alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
                return null;
            }
            //        var salt = Math.round(Math.random() * 1000000000) % 100000000;
            var salt = 101;
            prand += salt;
            while (prand.length > 10) {
                prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length), 10)).toString();
            }
            prand = (mult * prand + incr) % modu;
            var enc_chr = "";
            var enc_str = "";
            for (var i = 0; i < str.length; i++) {
                enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
                if (enc_chr < 16) {
                    enc_str += "0" + enc_chr.toString(16);
                } else {
                    enc_str += enc_chr.toString(16);
                }
                prand = (mult * prand + incr) % modu;
            }
            salt = salt.toString(16);
            while (salt.length < 8) {
                salt = "0" + salt;
            }
            enc_str += salt;
            return enc_str;
        },

        /**
         * 对加密后的字符串解密 {@link #encrypt}
         * @static
         * @param str 加密过的字符�?
         * @param keyt 密钥
         * @returns {String} 解密后的字符�?
         */
        decrypt: function (str, keyt) {
            if (str == "") {
                return "";
            }
            if (!keyt || keyt == "") {
                keyt = "655";
            }
            keyt = escape(keyt);
            if (str == null || str.length < 8) {
                return;
            }
            if (keyt == null || keyt.length <= 0) {
                return;
            }
            var prand = "";
            for (var i = 0; i < keyt.length; i++) {
                prand += keyt.charCodeAt(i).toString();
            }
            var sPos = Math.floor(prand.length / 5);
            var tempmult = prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4);
            if (sPos * 5 < prand.length) {
                tempmult += prand.charAt(sPos * 5);
            }
            var mult = parseInt(tempmult);
            var incr = Math.round(keyt.length / 2);
            var modu = Math.pow(2, 31) - 1;
            var salt = parseInt(str.substring(str.length - 8, str.length), 16);
            str = str.substring(0, str.length - 8);
            prand += salt;
            while (prand.length > 10) {
                prand = (parseInt(prand.substring(0, 10), 10) + parseInt(prand.substring(10, prand.length), 10)).toString();
            }
            prand = (mult * prand + incr) % modu;
            var enc_chr = "";
            var enc_str = "";
            for (var i = 0; i < str.length; i += 2) {
                enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
                enc_str += String.fromCharCode(enc_chr);
                prand = (mult * prand + incr) % modu;
            }
            return unescape(enc_str);
        }
    });

    // 浏览器相关方法
    _.extend(BI, {
        isIE: function () {
            if (this.__isIE == null) {
                this.__isIE = /(msie|trident)/i.test(navigator.userAgent.toLowerCase());
            }
            return this.__isIE;
        },

        getIEVersion: function () {
            if (this.__IEVersion != null) {
                return this.__IEVersion;
            }
            var version = 0;
            var agent = navigator.userAgent.toLowerCase();
            var v1 = agent.match(/(?:msie\s([\w.]+))/);
            var v2 = agent.match(/(?:trident.*rv:([\w.]+))/);
            if (v1 && v2 && v1[1] && v2[1]) {
                version = Math.max(v1[1] * 1, v2[1] * 1);
            } else if (v1 && v1[1]) {
                version = v1[1] * 1;
            } else if (v2 && v2[1]) {
                version = v2[1] * 1;
            } else {
                version = 0;
            }
            return this.__IEVersion = version;
        },

        isIE9Below: function () {
            if (!BI.isIE()) {
                return false;
            }
            return this.getIEVersion() < 9;
        },

        isEdge: function () {
            return /edge/i.test(navigator.userAgent.toLowerCase());
        },

        isChrome: function () {
            return /chrome/i.test(navigator.userAgent.toLowerCase());
        },

        isFireFox: function () {
            return /firefox/i.test(navigator.userAgent.toLowerCase());
        },

        isOpera: function () {
            return /opera/i.test(navigator.userAgent.toLowerCase());
        },

        isSafari: function () {
            return /safari/i.test(navigator.userAgent.toLowerCase());
        },

        isKhtml: function () {
            return /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
        },

        isMac: function () {
            return /macintosh|mac os x/i.test(navigator.userAgent);
        },

        isWindows: function () {
            return /windows|win32/i.test(navigator.userAgent);
        },

        isSupportCss3: function (style) {
            var prefix = ["webkit", "Moz", "ms", "o"],
                i, len,
                humpString = [],
                htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };

            for (i in prefix) {
                humpString.push(_toHumb(prefix[i] + "-" + style));
            }
            humpString.push(_toHumb(style));

            for (i = 0, len = humpString.length; i < len; i++) {
                if (humpString[i] in htmlStyle) {
                    return true;
                }
            }
            return false;
        }
    });
    // BI请求
    _.extend(BI, {

        ajax: function (option) {
            option || (option = {});
            var async = option.async;
            option.data = BI.cjkEncodeDO(option.data || {});

            $.ajax({
                url: option.url,
                type: "POST",
                data: option.data,
                async: async,
                error: option.error,
                complete: function (res, status) {
                    if (BI.isFunction(option.complete)) {
                        option.complete(BI.jsonDecode(res.responseText), status);
                    }
                }
            });
        }
    });
})();/**
 * 客户端观察者，主要处理事件的添加、删除、执行等
 * @class BI.OB
 * @abstract
 */
BI.OB = function (config) {
    var props = this.props;
    if (BI.isFunction(this.props)) {
        props = this.props(config);
    }
    this.options = ($ || _).extend(this._defaultConfig(config), props, config);
    this._init();
    this._initRef();
};
_.extend(BI.OB.prototype, {
    props: {},
    init: null,
    destroyed: null,

    _defaultConfig: function (config) {
        return {};
    },

    _init: function () {
        this._initListeners();
        this.init && this.init();
    },

    _initListeners: function () {
        var self = this;
        if (this.options.listeners != null) {
            $.each(this.options.listeners, function (i, lis) {
                (lis.target ? lis.target : self)[lis.once ? "once" : "on"]
                (lis.eventName, _.bind(lis.action, self));
            });
            delete this.options.listeners;
        }
    },

    // 获得一个当前对象的引用
    _initRef: function () {
        if (this.options.ref) {
            this.options.ref.call(this, this);
        }
    },

    _getEvents: function () {
        if (!$.isArray(this.events)) {
            this.events = [];
        }
        return this.events;
    },

    /**
     * 给观察者绑定一个事件
     * @param {String} eventName 事件的名字
     * @param {Function} fn 事件对应的执行函数
     */
    on: function (eventName, fn) {
        eventName = eventName.toLowerCase();
        var fns = this._getEvents()[eventName];
        if (!$.isArray(fns)) {
            fns = [];
            this._getEvents()[eventName] = fns;
        }
        fns.push(fn);
    },

    /**
     * 给观察者绑定一个只执行一次的事件
     * @param {String} eventName 事件的名字
     * @param {Function} fn 事件对应的执行函数
     */
    once: function (eventName, fn) {
        var proxy = function () {
            fn.apply(this, arguments);
            this.un(eventName, proxy);
        };
        this.on(eventName, proxy);
    },
    /**
     * 解除观察者绑定的指定事件
     * @param {String} eventName 要解除绑定事件的名字
     * @param {Function} fn 事件对应的执行函数，该参数是可选的，没有该参数时，将解除绑定所有同名字的事件
     */
    un: function (eventName, fn) {
        eventName = eventName.toLowerCase();

        /* alex:如果fn是null,就是把eventName上面所有方法都un掉*/
        if (fn == null) {
            delete this._getEvents()[eventName];
        } else {
            var fns = this._getEvents()[eventName];
            if ($.isArray(fns)) {
                var newFns = [];
                $.each(fns, function (idx, ifn) {
                    if (ifn != fn) {
                        newFns.push(ifn);
                    }
                });
                this._getEvents()[eventName] = newFns;
            }
        }
    },
    /**
     * 清除观察者的所有事件绑定
     */
    purgeListeners: function () {
        /* alex:清空events*/
        this.events = [];
    },
    /**
     * 触发绑定过的事件
     *
     * @param {String} eventName 要触发的事件的名字
     * @returns {Boolean} 如果事件函数返回false，则返回false并中断其他同名事件的执行，否则执行所有的同名事件并返回true
     */
    fireEvent: function () {
        var eventName = arguments[0].toLowerCase();
        var fns = this._getEvents()[eventName];
        if (BI.isArray(fns)) {
            if (BI.isArguments(arguments[1])) {
                for (var i = 0; i < fns.length; i++) {
                    if (fns[i].apply(this, arguments[1]) === false) {
                        return false;
                    }
                }
            } else {
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0; i < fns.length; i++) {
                    if (fns[i].apply(this, args) === false) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    destroy: function () {
        this.destroyed && this.destroyed();
        this.purgeListeners();
    }
});(function () {
    if (!window.BI) {
        window.BI = {};
    }
    function isEmpty (value) {
        // 判断是否为空值
        var result = value === "" || value === null || value === undefined;
        return result;
    }

    // 判断是否是无效的日期
    function isInvalidDate (date) {
        return date == "Invalid Date" || date == "NaN";
    }

    /**
     * 科学计数格式
     */
    function _eFormat (text, fmt) {
        var e = fmt.indexOf("E");
        var eleft = fmt.substr(0, e), eright = fmt.substr(e + 1);
        if (/^[0\.-]+$/.test(text)) {
            text = BI._numberFormat(0.0, eleft) + "E" + BI._numberFormat(0, eright);
        } else {
            var isNegative = text < 0;
            if (isNegative) {
                text = text.substr(1);
            }
            var elvl = (eleft.split(".")[0] || "").length;
            var point = text.indexOf(".");
            if (point < 0) {
                point = text.length;
            }
            var i = 0; // 第一个不为0的数的位置
            text = text.replace(".", "");
            for (var len = text.length; i < len; i++) {
                var ech = text.charAt(i);
                if (ech <= "9" && ech >= "1") {
                    break;
                }
            }
            var right = point - i - elvl;
            var left = text.substr(i, elvl);
            var dis = i + elvl - text.length;
            if (dis > 0) {
                // 末位补全0
                for (var k = 0; k < dis; k++) {
                    left += "0";
                }
            } else {
                left += "." + text.substr(i + elvl);
            }
            left = left.replace(/^[0]+/, "");
            if (right < 0 && eright.indexOf("-") < 0) {
                eright += ";-" + eright;
            }
            text = BI._numberFormat(left, eleft) + "E" + BI._numberFormat(right, eright);
            if (isNegative) {
                text = "-" + text;
            }
        }
        return text;
    }

    /**
     * 数字格式
     */
    function _numberFormat (text, format) {
        var text = text + "";
        // 数字格式，区分正负数
        var numMod = format.indexOf(";");
        if (numMod > -1) {
            if (text >= 0) {
                return _numberFormat(text + "", format.substring(0, numMod));
            }
            return _numberFormat((-text) + "", format.substr(numMod + 1));

        }
        // 兼容格式处理负数的情况(copy:fr-jquery.format.js)
        if (+text < 0 && format.charAt(0) !== "-") {
            return _numberFormat((-text) + "", "-" + format);
        }

        var tp = text.split("."), fp = format.split("."),
            tleft = tp[0] || "", fleft = fp[0] || "",
            tright = tp[1] || "", fright = fp[1] || "";
        // 百分比,千分比的小数点移位处理
        if (/[%‰]$/.test(format)) {
            var paddingZero = /[%]$/.test(format) ? "00" : "000";
            tright += paddingZero;
            tleft += tright.substr(0, paddingZero.length);
            tleft = tleft.replace(/^0+/gi, "");
            tright = tright.substr(paddingZero.length).replace(/0+$/gi, "");
        }
        var right = _dealWithRight(tright, fright);
        if (right.leftPlus) {
            // 小数点后有进位
            tleft = parseInt(tleft) + 1 + "";

            tleft = isNaN(tleft) ? "1" : tleft;
        }
        right = right.num;
        var left = _dealWithLeft(tleft, fleft);
        if (!(/[0-9]/.test(left))) {
            left = left + "0";
        }
        if (!(/[0-9]/.test(right))) {
            return left + right;
        }
        return left + "." + right;

    }

    /**
     * 处理小数点右边小数部分
     * @param tright 右边内容
     * @param fright 右边格式
     * @returns {JSON} 返回处理结果和整数部分是否需要进位
     * @private
     */
    function _dealWithRight (tright, fright) {
        var right = "", j = 0, i = 0;
        for (var len = fright.length; i < len; i++) {
            var ch = fright.charAt(i);
            var c = tright.charAt(j);
            switch (ch) {
                case "0":
                    if (isEmpty(c)) {
                        c = "0";
                    }
                    right += c;
                    j++;
                    break;
                case "#":
                    right += c;
                    j++;
                    break;
                default :
                    right += ch;
                    break;
            }
        }
        var rll = tright.substr(j);
        var result = {};
        if (!isEmpty(rll) && rll.charAt(0) > 4) {
            // 有多余字符，需要四舍五入
            result.leftPlus = true;
            var numReg = right.match(/^[0-9]+/);
            if (numReg) {
                var num = numReg[0];
                var orilen = num.length;
                var newnum = parseInt(num) + 1 + "";
                // 进位到整数部分
                if (newnum.length > orilen) {
                    newnum = newnum.substr(1);
                } else {
                    newnum = String.leftPad(newnum, orilen, "0");
                    result.leftPlus = false;
                }
                right = right.replace(/^[0-9]+/, newnum);
            }
        }
        result.num = right;
        return result;
    }

    /**
     * 处理小数点左边整数部分
     * @param tleft 左边内容
     * @param fleft 左边格式
     * @returns {string} 返回处理结果
     * @private
     */
    function _dealWithLeft (tleft, fleft) {
        var left = "";
        var j = tleft.length - 1;
        var combo = -1, last = -1;
        var i = fleft.length - 1;
        for (; i >= 0; i--) {
            var ch = fleft.charAt(i);
            var c = tleft.charAt(j);
            switch (ch) {
                case "0":
                    if (isEmpty(c)) {
                        c = "0";
                    }
                    last = -1;
                    left = c + left;
                    j--;
                    break;
                case "#":
                    last = i;
                    left = c + left;
                    j--;
                    break;
                case ",":
                    if (!isEmpty(c)) {
                        // 计算一个,分隔区间的长度
                        var com = fleft.match(/,[#0]+/);
                        if (com) {
                            combo = com[0].length - 1;
                        }
                        left = "," + left;
                    }
                    break;
                default :
                    left = ch + left;
                    break;
            }
        }
        if (last > -1) {
            // 处理剩余字符
            var tll = tleft.substr(0, j + 1);
            left = left.substr(0, last) + tll + left.substr(last);
        }
        if (combo > 0) {
            // 处理,分隔区间
            var res = left.match(/[0-9]+,/);
            if (res) {
                res = res[0];
                var newstr = "", n = res.length - 1 - combo;
                for (; n >= 0; n = n - combo) {
                    newstr = res.substr(n, combo) + "," + newstr;
                }
                var lres = res.substr(0, n + combo);
                if (!isEmpty(lres)) {
                    newstr = lres + "," + newstr;
                }
            }
            left = left.replace(/[0-9]+,/, newstr);
        }
        return left;
    }

    BI.cjkEncode = function (text) {
        // alex:如果非字符串,返回其本身(cjkEncode(234) 返回 ""是不对的)
        if (typeof text !== "string") {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code >= 128 || code === 91 || code === 93) {// 91 is "[", 93 is "]".
                newText += "[" + code.toString(16) + "]";
            } else {
                newText += text.charAt(i);
            }
        }

        return newText;
    };

    /**
     * 将cjkEncode处理过的字符串转化为原始字符串
     *
     * @static
     * @param text 需要做解码的字符串
     * @return {String} 解码后的字符串
     */
    BI.cjkDecode = function (text) {
        if (text == null) {
            return "";
        }
        // 查找没有 "[", 直接返回.  kunsnat:数字的时候, 不支持indexOf方法, 也是直接返回.
        if (!isNaN(text) || text.indexOf("[") == -1) {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (ch == "[") {
                var rightIdx = text.indexOf("]", i + 1);
                if (rightIdx > i + 1) {
                    var subText = text.substring(i + 1, rightIdx);
                    // james：主要是考虑[CDATA[]]这样的值的出现
                    if (subText.length > 0) {
                        ch = String.fromCharCode(eval("0x" + subText));
                    }

                    i = rightIdx;
                }
            }

            newText += ch;
        }

        return newText;
    };

    // replace the html special tags
    BI.htmlEncode = function (text) {
        return (text == null) ? '' : String(text).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\s/g, '&nbsp;');
    };
    // html decode
    BI.htmlDecode = function (text) {
        return (text == null) ? "" : String(text).replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
    };

    BI.cjkEncodeDO = function (o) {
        if (BI.isPlainObject(o)) {
            var result = {};
            _.each(o, function (v, k) {
                if (!(typeof v === "string")) {
                    v = BI.jsonEncode(v);
                }
                // wei:bug 43338，如果key是中文，cjkencode后o的长度就加了1，ie9以下版本死循环，所以新建对象result。
                k = BI.cjkEncode(k);
                result[k] = BI.cjkEncode(v);
            });
            return result;
        }
        return o;
    };

    BI.jsonEncode = function (o) {
        // james:这个Encode是抄的EXT的
        var useHasOwn = !!{}.hasOwnProperty;

        // crashes Safari in some instances
        // var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

        var m = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };

        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return "\"" + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                    var c = m[b];
                    if (c) {
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                }) + "\"";
            }
            return "\"" + s + "\"";
        };

        var encodeArray = function (o) {
            var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(",");
                        }
                        a.push(v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };

        if (typeof o === "undefined" || o === null) {
            return "null";
        } else if (BI.isArray(o)) {
            return encodeArray(o);
        } else if (o instanceof Date) {
            /*
             * alex:原来只是把年月日时分秒简单地拼成一个String,无法decode
             * 现在这么处理就可以decode了,但是JS.jsonDecode和Java.JSONObject也要跟着改一下
             */
            return BI.jsonEncode({
                __time__: o.getTime()
            });
        } else if (typeof o === "string") {
            return encodeString(o);
        } else if (typeof o === "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o === "boolean") {
            return String(o);
        } else if (BI.isFunction(o)) {
            return String(o);
        }
        var a = ["{"], b, i, v;
        for (i in o) {
            if (!useHasOwn || o.hasOwnProperty(i)) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(",");
                        }
                        a.push(BI.jsonEncode(i), ":",
                            v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
        }
        a.push("}");
        return a.join("");

    };

    BI.jsonDecode = function (text) {

        try {
            // 注意0啊
            // var jo = $.parseJSON(text) || {};
            var jo = $ ? $.parseJSON(text): window.JSON.parse(text);
            if (jo == null) {
                jo = {};
            }
        } catch (e) {
            /*
             * richie:浏览器只支持标准的JSON字符串转换，而jQuery会默认调用浏览器的window.JSON.parse()函数进行解析
             * 比如：var str = "{'a':'b'}",这种形式的字符串转换为JSON就会抛异常
             */
            try {
                jo = new Function("return " + text)() || {};
            } catch (e) {
                // do nothing
            }
            if (jo == null) {
                jo = [];
            }
        }
        if (!_hasDateInJson(text)) {
            return jo;
        }

        function _hasDateInJson (json) {
            if (!json || typeof json !== "string") {
                return false;
            }
            return json.indexOf("__time__") != -1;
        }

        return (function (o) {
            if (typeof o === "string") {
                return o;
            }
            if (o && o.__time__ != null) {
                return new Date(o.__time__);
            }
            for (var a in o) {
                if (o[a] == o || typeof o[a] === "object" || _.isFunction(o[a])) {
                    break;
                }
                o[a] = arguments.callee(o[a]);
            }

            return o;
        })(jo);
    };

    BI.contentFormat = function (cv, fmt) {
        if (isEmpty(cv)) {
            // 原值为空，返回空字符
            return "";
        }
        var text = cv.toString();
        if (isEmpty(fmt)) {
            // 格式为空，返回原字符
            return text;
        }
        if (fmt.match(/^T/)) {
            // T - 文本格式
            return text;
        } else if (fmt.match(/^D/)) {
            // D - 日期(时间)格式
            if (!(cv instanceof Date)) {
                if (typeof cv === "number") {
                    // 毫秒数类型
                    cv = new Date(cv);
                } else {
                    // 字符串类型，如yyyyMMdd、MMddyyyy等这样无分隔符的结构
                    cv = Date.parseDate(cv + "", Date.patterns.ISO8601Long);
                }
            }
            if (!BI.isNull(cv)) {
                var needTrim = fmt.match(/^DT/);
                text = BI.date2Str(cv, fmt.substring(needTrim ? 2 : 1));
            }
        } else if (fmt.match(/E/)) {
            // 科学计数格式
            text = _eFormat(text, fmt);
        } else {
            // 数字格式
            text = _numberFormat(text, fmt);
        }
        // ¤ - 货币格式
        text = text.replace(/¤/g, "￥");
        return text;
    };

    /**
     * 把日期对象按照指定格式转化成字符串
     *
     *      @example
     *      var date = new Date('Thu Dec 12 2013 00:00:00 GMT+0800');
     *      var result = BI.date2Str(date, 'yyyy-MM-dd');//2013-12-12
     *
     * @class BI.date2Str
     * @param date 日期
     * @param format 日期格式
     * @returns {String}
     */
    BI.date2Str = function (date, format) {
        if (!date) {
            return "";
        }
        // O(len(format))
        var len = format.length, result = "";
        if (len > 0) {
            var flagch = format.charAt(0), start = 0, str = flagch;
            for (var i = 1; i < len; i++) {
                var ch = format.charAt(i);
                if (flagch !== ch) {
                    result += compileJFmt({
                        char: flagch,
                        str: str,
                        len: i - start
                    }, date);
                    flagch = ch;
                    start = i;
                    str = flagch;
                } else {
                    str += ch;
                }
            }
            result += compileJFmt({
                char: flagch,
                str: str,
                len: len - start
            }, date);
        }
        return result;

        function compileJFmt (jfmt, date) {
            var str = jfmt.str, len = jfmt.len, ch = jfmt["char"];
            switch (ch) {
                case "E": // 星期
                    str = Date._DN[date.getDay()];
                    break;
                case "y": // 年
                    if (len <= 3) {
                        str = (date.getFullYear() + "").slice(2, 4);
                    } else {
                        str = date.getFullYear();
                    }
                    break;
                case "M": // 月
                    if (len > 2) {
                        str = Date._MN[date.getMonth()];
                    } else if (len < 2) {
                        str = date.getMonth() + 1;
                    } else {
                        str = String.leftPad(date.getMonth() + 1 + "", 2, "0");
                    }
                    break;
                case "d": // 日
                    if (len > 1) {
                        str = String.leftPad(date.getDate() + "", 2, "0");
                    } else {
                        str = date.getDate();
                    }
                    break;
                case "h": // 时(12)
                    var hour = date.getHours() % 12;
                    if (hour === 0) {
                        hour = 12;
                    }
                    if (len > 1) {
                        str = String.leftPad(hour + "", 2, "0");
                    } else {
                        str = hour;
                    }
                    break;
                case "H": // 时(24)
                    if (len > 1) {
                        str = String.leftPad(date.getHours() + "", 2, "0");
                    } else {
                        str = date.getHours();
                    }
                    break;
                case "m":
                    if (len > 1) {
                        str = String.leftPad(date.getMinutes() + "", 2, "0");
                    } else {
                        str = date.getMinutes();
                    }
                    break;
                case "s":
                    if (len > 1) {
                        str = String.leftPad(date.getSeconds() + "", 2, "0");
                    } else {
                        str = date.getSeconds();
                    }
                    break;
                case "a":
                    str = date.getHours() < 12 ? "am" : "pm";
                    break;
                case "z":
                    str = date.getTimezone();
                    break;
                default:
                    str = jfmt.str;
                    break;
            }
            return str;
        }
    };

    BI.object2Number = function (value) {
        if (value == null) {
            return 0;
        }
        if (typeof value === "number") {
            return value;
        }
        var str = value + "";
        if (str.indexOf(".") === -1) {
            return parseInt(str);
        }
        return parseFloat(str);


    };

    BI.object2Date = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        } else if (typeof obj === "number") {
            return new Date(obj);
        }
        var str = obj + "";
        str = str.replace(/-/g, "/");
        var dt = new Date(str);
        if (!isInvalidDate(dt)) {
            return dt;
        }

        return new Date();

    };

    BI.object2Time = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        }
        var str = obj + "";
        str = str.replace(/-/g, "/");
        var dt = new Date(str);
        if (!isInvalidDate(dt)) {
            return dt;
        }
        if (str.indexOf("/") === -1 && str.indexOf(":") !== -1) {
            dt = new Date("1970/01/01 " + str);
            if (!isInvalidDate(dt)) {
                return dt;
            }
        }
        dt = BI.str2Date(str, "HH:mm:ss");
        if (!isInvalidDate(dt)) {
            return dt;
        }
        return new Date();

    };
})();
(function () {
    var constantInjection = {};
    BI.constant = function (xtype, cls) {
        if (constantInjection[xtype] != null) {
            throw ("constant:[" + xtype + "] has been registed");
        }
        constantInjection[xtype] = cls;
    };

    var modelInjection = {};
    BI.model = function (xtype, cls) {
        if (modelInjection[xtype] != null) {
            throw ("model:[" + xtype + "] has been registed");
        }
        modelInjection[xtype] = cls;
    };

    var storeInjection = {};
    BI.store = function (xtype, cls) {
        if (storeInjection[xtype] != null) {
            throw ("store:[" + xtype + "] has been registed");
        }
        storeInjection[xtype] = cls;
    };

    var serviceInjection = {};
    BI.service = function (xtype, cls) {
        if (serviceInjection[xtype] != null) {
            throw ("service:[" + xtype + "] has been registed");
        }
        serviceInjection[xtype] = cls;
    };

    var providerInjection = {};
    BI.provider = function (xtype, cls) {
        if (providerInjection[xtype] != null) {
            throw ("provider:[" + xtype + "] has been registed");
        }
        providerInjection[xtype] = cls;
    };

    BI.config = function (type, configFn) {
        if (constantInjection[type]) {
            return constantInjection[type] = configFn(constantInjection[type]);
        }
        if (providerInjection[type]) {
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            return configFn(providers[type]);
        }
        BI.Plugin.configWidget(type, configFn);
    };

    var actions = {};
    BI.action = function (type, actionFn) {
        if (!actions[type]) {
            actions[type] = [];
        }
        actions[type].push(actionFn);
        return function () {
            actions[type].remove(actionFn);
            if (actions[type].length === 0) {
                delete actions[type];
            }
        };
    };

    var points = {};
    BI.point = function (type, action, pointFn, after) {
        if (!points[type]) {
            points[type] = {};
        }
        if (!points[type][action]) {
            points[type][action] = {};
            points[type][action][after ? "after" : "before"] = [];
        }
        points[type][action][after ? "after" : "before"].push(pointFn);
    };

    BI.Constants = {
        getConstant: function (type) {
            return constantInjection[type];
        }
    };

    var callPoint = function (inst, type) {
        if (points[type]) {
            for (var action in points[type]) {
                var fns = points[type][action].before;
                if (fns) {
                    BI.aspect.before(inst, action, function () {
                        for (var i = 0, len = fns.length; i < len; i++) {
                            fns[i].apply(inst, arguments);
                        }
                    });
                }
                fns = points[type][action].after;
                if (fns) {
                    BI.aspect.after(inst, action, function () {
                        for (var i = 0, len = fns.length; i < len; i++) {
                            fns[i].apply(inst, arguments);
                        }
                    });
                }
            }
        }
    };
    BI.Models = {
        getModel: function (type, config) {
            var inst = new modelInjection[type](config);
            callPoint(inst, type);
            return inst;
        }
    };

    var stores = {};

    BI.Stores = {
        getStore: function (type, config) {
            if (stores[type]) {
                return stores[type];
            }
            stores[type] = new storeInjection[type](config);
            callPoint(stores[type], type);
            return stores[type];
        }
    };

    var services = {};

    BI.Services = {
        getService: function (type, config) {
            if (services[type]) {
                return services[type];
            }
            services[type] = new serviceInjection[type](config);
            callPoint(services[type], type);
            return services[type];
        }
    };

    var providers = {}, providerInstance = {};

    BI.Providers = {
        getProvider: function (type, config) {
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            if (!providerInstance[type]) {
                providerInstance[type] = new providers[type].$get()(config);
            }
            return providerInstance[type];
        }
    };

    BI.Actions = {
        runAction: function (type, config) {
            BI.each(actions[type], function (i, act) {
                act(config);
            });
        }
    };
})();
(function (window, undefined) {
    function aspect (type) {
        return function (target, methodName, advice) {
            var exist = target[methodName],
                dispatcher;

            if (!exist || exist.target != target) {
                dispatcher = target[methodName] = function () {
                    // before methods
                    var beforeArr = dispatcher.before;
                    var args = arguments, next;
                    for (var l = beforeArr.length; l--;) {
                        next = beforeArr[l].advice.apply(this, args);
                        if (next === false) {
                            return false;
                        }
                        args = next || args;
                    }
                    // target method
                    var rs = dispatcher.method.apply(this, args);
                    // after methods
                    var afterArr = dispatcher.after;
                    for (var i = 0, ii = afterArr.length; i < ii; i++) {
                        next = afterArr[i].advice.call(this, rs, args);
                        if (rs === false) {
                            return false;
                        }
                        args = next || args;
                    }
                    return rs;
                };

                dispatcher.before = [];
                dispatcher.after = [];

                if (exist) {
                    dispatcher.method = exist;
                }
                dispatcher.target = target;
            }

            var aspectArr = (dispatcher || exist)[type];
            var obj = {
                advice: advice,
                _index: aspectArr.length,
                remove: function () {
                    aspectArr.splice(this._index, 1);
                }
            };
            aspectArr.push(obj);

            return obj;
        };
    }

    BI.aspect = {
        before: aspect("before"),
        after: aspect("after")
    };

    return BI.aspect;

})(window);
!(function () {

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


    // private method for UTF-8 encoding
    var _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    // private method for UTF-8 decoding
    var _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0, c3 = 0, c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    };

    _.extend(BI, {

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = _utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = _utf8_decode(output);

            return output;

        }
    });
})();
BI.Cache = {
    _prefix: "bi",
    setUsername: function (username) {
        localStorage.setItem(BI.Cache._prefix + ".username", (username + "" || "").toUpperCase());
    },
    getUsername: function () {
        return localStorage.getItem(BI.Cache._prefix + ".username") || "";
    },
    _getKeyPrefix: function () {
        return BI.Cache.getUsername() + "." + BI.Cache._prefix + ".";
    },
    _generateKey: function (key) {
        return BI.Cache._getKeyPrefix() + (key || "");
    },
    getItem: function (key) {
        return localStorage.getItem(BI.Cache._generateKey(key));
    },
    setItem: function (key, value) {
        localStorage.setItem(BI.Cache._generateKey(key), value);
    },
    removeItem: function (key) {
        localStorage.removeItem(BI.Cache._generateKey(key));
    },
    clear: function () {
        for (var i = localStorage.length; i >= 0; i--) {
            var key = localStorage.key(i);
            if (key) {
                if (key.indexOf(BI.Cache._getKeyPrefix()) === 0) {
                    localStorage.removeItem(key);
                }
            }
        }
    },
    keys: function () {
        var result = [];
        for (var i = localStorage.length; i >= 0; i--) {
            var key = localStorage.key(i);
            if (key) {
                var prefix = BI.Cache._getKeyPrefix();
                if (key.indexOf(prefix) === 0) {
                    result[result.length] = key.substring(prefix.length);
                }
            }
        }
        return result;
    },

    addCookie: function (name, value, path, expiresHours) {
        var cookieString = name + "=" + escape(value);
        // 判断是否设置过期时间
        if (expiresHours && expiresHours > 0) {
            var date = new Date();
            date.setTime(date.getTime() + expiresHours * 3600 * 1000);
            cookieString = cookieString + "; expires=" + date.toGMTString();
        }
        if (path) {
            cookieString = cookieString + "; path=" + path;
        }
        document.cookie = cookieString;
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {return unescape(arr[2]);}
        return null;
    },
    deleteCookie: function (name, path) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        var cookieString = name + "=v; expires=" + date.toGMTString();
        if (path) {
            cookieString = cookieString + "; path=" + path;
        }
        document.cookie = cookieString;
    }
};BI.CellSizeAndPositionManager = function (cellCount, cellSizeGetter, estimatedCellSize) {
    this._cellSizeGetter = cellSizeGetter;
    this._cellCount = cellCount;
    this._estimatedCellSize = estimatedCellSize;
    this._cellSizeAndPositionData = {};
    this._lastMeasuredIndex = -1;
};

BI.CellSizeAndPositionManager.prototype = {
    constructor: BI.CellSizeAndPositionManager,
    configure: function (cellCount, estimatedCellSize) {
        this._cellCount = cellCount;
        this._estimatedCellSize = estimatedCellSize;
    },

    getCellCount: function () {
        return this._cellCount;
    },

    getEstimatedCellSize: function () {
        return this._estimatedCellSize;
    },

    getLastMeasuredIndex: function () {
        return this._lastMeasuredIndex;
    },

    getSizeAndPositionOfCell: function (index) {
        if (index < 0 || index >= this._cellCount) {
            return;
        }
        if (index > this._lastMeasuredIndex) {
            var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
            var offset = lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size;

            for (var i = this._lastMeasuredIndex + 1; i <= index; i++) {
                var size = this._cellSizeGetter(i);

                if (size == null || isNaN(size)) {
                    continue;
                }

                this._cellSizeAndPositionData[i] = {
                    offset: offset,
                    size: size
                };

                offset += size;
            }

            this._lastMeasuredIndex = index;
        }
        return this._cellSizeAndPositionData[index];
    },

    getSizeAndPositionOfLastMeasuredCell: function () {
        return this._lastMeasuredIndex >= 0
            ? this._cellSizeAndPositionData[this._lastMeasuredIndex]
            : {
                offset: 0,
                size: 0
            };
    },

    getTotalSize: function () {
        var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
        return lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size + (this._cellCount - this._lastMeasuredIndex - 1) * this._estimatedCellSize;
    },

    getUpdatedOffsetForIndex: function (align, containerSize, currentOffset, targetIndex) {
        var datum = this.getSizeAndPositionOfCell(targetIndex);
        var maxOffset = datum.offset;
        var minOffset = maxOffset - containerSize + datum.size;

        var idealOffset;

        switch (align) {
            case "start":
                idealOffset = maxOffset;
                break;
            case "end":
                idealOffset = minOffset;
                break;
            case "center":
                idealOffset = maxOffset - ((containerSize - datum.size) / 2);
                break;
            default:
                idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
                break;
        }

        var totalSize = this.getTotalSize();

        return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
    },

    getVisibleCellRange: function (containerSize, offset) {
        var totalSize = this.getTotalSize();

        if (totalSize === 0) {
            return {};
        }

        var maxOffset = offset + containerSize;
        var start = this._findNearestCell(offset);

        var datum = this.getSizeAndPositionOfCell(start);
        offset = datum.offset + datum.size;

        var stop = start;

        while (offset < maxOffset && stop < this._cellCount - 1) {
            stop++;
            offset += this.getSizeAndPositionOfCell(stop).size;
        }

        return {
            start: start,
            stop: stop
        };
    },

    resetCell: function (index) {
        this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, index - 1);
    },

    _binarySearch: function (high, low, offset) {
        var middle;
        var currentOffset;

        while (low <= high) {
            middle = low + Math.floor((high - low) / 2);
            currentOffset = this.getSizeAndPositionOfCell(middle).offset;

            if (currentOffset === offset) {
                return middle;
            } else if (currentOffset < offset) {
                low = middle + 1;
            } else if (currentOffset > offset) {
                high = middle - 1;
            }
        }

        if (low > 0) {
            return low - 1;
        }
    },

    _exponentialSearch: function (index, offset) {
        var interval = 1;

        while (index < this._cellCount && this.getSizeAndPositionOfCell(index).offset < offset) {
            index += interval;
            interval *= 2;
        }

        return this._binarySearch(Math.min(index, this._cellCount - 1), Math.floor(index / 2), offset);
    },

    _findNearestCell: function (offset) {
        if (isNaN(offset)) {
            return;
        }

        offset = Math.max(0, offset);

        var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
        var lastMeasuredIndex = Math.max(0, this._lastMeasuredIndex);

        if (lastMeasuredCellSizeAndPosition.offset >= offset) {
            return this._binarySearch(lastMeasuredIndex, 0, offset);
        }
        return this._exponentialSearch(lastMeasuredIndex, offset);
        
    }
};

BI.ScalingCellSizeAndPositionManager = function (cellCount, cellSizeGetter, estimatedCellSize, maxScrollSize) {
    this._cellSizeAndPositionManager = new BI.CellSizeAndPositionManager(cellCount, cellSizeGetter, estimatedCellSize);
    this._maxScrollSize = maxScrollSize || 10000000;
};

BI.ScalingCellSizeAndPositionManager.prototype = {
    constructor: BI.ScalingCellSizeAndPositionManager,

    configure: function () {
        this._cellSizeAndPositionManager.configure.apply(this._cellSizeAndPositionManager, arguments);
    },

    getCellCount: function () {
        return this._cellSizeAndPositionManager.getCellCount();
    },

    getEstimatedCellSize: function () {
        return this._cellSizeAndPositionManager.getEstimatedCellSize();
    },

    getLastMeasuredIndex: function () {
        return this._cellSizeAndPositionManager.getLastMeasuredIndex();
    },

    getOffsetAdjustment: function (containerSize, offset) {
        var totalSize = this._cellSizeAndPositionManager.getTotalSize();
        var safeTotalSize = this.getTotalSize();
        var offsetPercentage = this._getOffsetPercentage(containerSize, offset, safeTotalSize);

        return Math.round(offsetPercentage * (safeTotalSize - totalSize));
    },

    getSizeAndPositionOfCell: function (index) {
        return this._cellSizeAndPositionManager.getSizeAndPositionOfCell(index);
    },

    getSizeAndPositionOfLastMeasuredCell: function () {
        return this._cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell();
    },

    getTotalSize: function () {
        return Math.min(this._maxScrollSize, this._cellSizeAndPositionManager.getTotalSize());
    },

    getUpdatedOffsetForIndex: function (align, containerSize, currentOffset, targetIndex) {
        currentOffset = this._safeOffsetToOffset(containerSize, currentOffset);

        var offset = this._cellSizeAndPositionManager.getUpdatedOffsetForIndex(align, containerSize, currentOffset, targetIndex);

        return this._offsetToSafeOffset(containerSize, offset);
    },

    getVisibleCellRange: function (containerSize, offset) {
        offset = this._safeOffsetToOffset(containerSize, offset);

        return this._cellSizeAndPositionManager.getVisibleCellRange(containerSize, offset);
    },

    resetCell: function (index) {
        this._cellSizeAndPositionManager.resetCell(index);
    },

    _getOffsetPercentage: function (containerSize, offset, totalSize) {
        return totalSize <= containerSize
            ? 0
            : offset / (totalSize - containerSize);
    },

    _offsetToSafeOffset: function (containerSize, offset) {
        var totalSize = this._cellSizeAndPositionManager.getTotalSize();
        var safeTotalSize = this.getTotalSize();

        if (totalSize === safeTotalSize) {
            return offset;
        }
        var offsetPercentage = this._getOffsetPercentage(containerSize, offset, totalSize);

        return Math.round(offsetPercentage * (safeTotalSize - containerSize));
        
    },

    _safeOffsetToOffset: function (containerSize, offset) {
        var totalSize = this._cellSizeAndPositionManager.getTotalSize();
        var safeTotalSize = this.getTotalSize();

        if (totalSize === safeTotalSize) {
            return offset;
        }
        var offsetPercentage = this._getOffsetPercentage(containerSize, offset, safeTotalSize);

        return Math.round(offsetPercentage * (totalSize - containerSize));
        
    }
};/**
 * 汉字拼音索引
 */

!(function () {
    var _ChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGHGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";

    // 此处收录了375个多音字,数据来自于http://www.51window.net/page/pinyin
    var oMultiDiff = {
        19969: "DZ",
        19975: "WM",
        19988: "QJ",
        20048: "YL",
        20056: "SC",
        20060: "NM",
        20094: "QG",
        20127: "QJ",
        20167: "QC",
        20193: "YG",
        20250: "KH",
        20256: "ZC",
        20282: "SC",
        20285: "QJG",
        20291: "TD",
        20314: "YD",
        20315: "BF",
        20340: "NE",
        20375: "TD",
        20389: "YJ",
        20391: "CZ",
        20415: "PB",
        20446: "YS",
        20447: "SQ",
        20504: "TC",
        20608: "KG",
        20854: "QJ",
        20857: "ZC",
        20911: "PF",
        20985: "AW",
        21032: "PB",
        21048: "XQ",
        21049: "SC",
        21089: "YS",
        21119: "JC",
        21242: "SB",
        21273: "SC",
        21305: "YP",
        21306: "QO",
        21330: "ZC",
        21333: "SDC",
        21345: "QK",
        21378: "CA",
        21397: "SC",
        21414: "XS",
        21442: "SC",
        21477: "JG",
        21480: "TD",
        21484: "ZS",
        21494: "YX",
        21505: "YX",
        21512: "HG",
        21523: "XH",
        21537: "PB",
        21542: "PF",
        21549: "KH",
        21571: "E",
        21574: "DA",
        21588: "TD",
        21589: "O",
        21618: "ZC",
        21621: "KHA",
        21632: "ZJ",
        21654: "KG",
        21679: "LKG",
        21683: "KH",
        21710: "A",
        21719: "YH",
        21734: "WOE",
        21769: "A",
        21780: "WN",
        21804: "XH",
        21834: "A",
        21899: "ZD",
        21903: "RN",
        21908: "WO",
        21939: "ZC",
        21956: "SA",
        21964: "YA",
        21970: "TD",
        22003: "A",
        22031: "JG",
        22040: "XS",
        22060: "ZC",
        22066: "ZC",
        22079: "MH",
        22129: "XJ",
        22179: "XA",
        22237: "NJ",
        22244: "TD",
        22280: "JQ",
        22300: "YH",
        22313: "XW",
        22331: "YQ",
        22343: "YJ",
        22351: "PH",
        22395: "DC",
        22412: "TD",
        22484: "PB",
        22500: "PB",
        22534: "ZD",
        22549: "DH",
        22561: "PB",
        22612: "TD",
        22771: "KQ",
        22831: "HB",
        22841: "JG",
        22855: "QJ",
        22865: "XQ",
        23013: "ML",
        23081: "WM",
        23487: "SX",
        23558: "QJ",
        23561: "YW",
        23586: "YW",
        23614: "YW",
        23615: "SN",
        23631: "PB",
        23646: "ZS",
        23663: "ZT",
        23673: "YG",
        23762: "TD",
        23769: "ZS",
        23780: "QJ",
        23884: "QK",
        24055: "XH",
        24113: "DC",
        24162: "ZC",
        24191: "GA",
        24273: "QJ",
        24324: "NL",
        24377: "TD",
        24378: "QJ",
        24439: "PF",
        24554: "ZS",
        24683: "TD",
        24694: "WE",
        24733: "LK",
        24925: "TN",
        25094: "ZG",
        25100: "XQ",
        25103: "XH",
        25153: "PB",
        25170: "PB",
        25179: "KG",
        25203: "PB",
        25240: "ZS",
        25282: "FB",
        25303: "NA",
        25324: "KG",
        25341: "ZY",
        25373: "WZ",
        25375: "XJ",
        25384: "A",
        25457: "A",
        25528: "SD",
        25530: "SC",
        25552: "TD",
        25774: "ZC",
        25874: "ZC",
        26044: "YW",
        26080: "WM",
        26292: "PB",
        26333: "PB",
        26355: "ZY",
        26366: "CZ",
        26397: "ZC",
        26399: "QJ",
        26415: "ZS",
        26451: "SB",
        26526: "ZC",
        26552: "JG",
        26561: "TD",
        26588: "JG",
        26597: "CZ",
        26629: "ZS",
        26638: "YL",
        26646: "XQ",
        26653: "KG",
        26657: "XJ",
        26727: "HG",
        26894: "ZC",
        26937: "ZS",
        26946: "ZC",
        26999: "KJ",
        27099: "KJ",
        27449: "YQ",
        27481: "XS",
        27542: "ZS",
        27663: "ZS",
        27748: "TS",
        27784: "SC",
        27788: "ZD",
        27795: "TD",
        27812: "O",
        27850: "PB",
        27852: "MB",
        27895: "SL",
        27898: "PL",
        27973: "QJ",
        27981: "KH",
        27986: "HX",
        27994: "XJ",
        28044: "YC",
        28065: "WG",
        28177: "SM",
        28267: "QJ",
        28291: "KH",
        28337: "ZQ",
        28463: "TL",
        28548: "DC",
        28601: "TD",
        28689: "PB",
        28805: "JG",
        28820: "QG",
        28846: "PB",
        28952: "TD",
        28975: "ZC",
        29100: "A",
        29325: "QJ",
        29575: "SL",
        29602: "FB",
        30010: "TD",
        30044: "CX",
        30058: "PF",
        30091: "YSP",
        30111: "YN",
        30229: "XJ",
        30427: "SC",
        30465: "SX",
        30631: "YQ",
        30655: "QJ",
        30684: "QJG",
        30707: "SD",
        30729: "XH",
        30796: "LG",
        30917: "PB",
        31074: "NM",
        31085: "JZ",
        31109: "SC",
        31181: "ZC",
        31192: "MLB",
        31293: "JQ",
        31400: "YX",
        31584: "YJ",
        31896: "ZN",
        31909: "ZY",
        31995: "XJ",
        32321: "PF",
        32327: "ZY",
        32418: "HG",
        32420: "XQ",
        32421: "HG",
        32438: "LG",
        32473: "GJ",
        32488: "TD",
        32521: "QJ",
        32527: "PB",
        32562: "ZSQ",
        32564: "JZ",
        32735: "ZD",
        32793: "PB",
        33071: "PF",
        33098: "XL",
        33100: "YA",
        33152: "PB",
        33261: "CX",
        33324: "BP",
        33333: "TD",
        33406: "YA",
        33426: "WM",
        33432: "PB",
        33445: "JG",
        33486: "ZN",
        33493: "TS",
        33507: "QJ",
        33540: "QJ",
        33544: "ZC",
        33564: "XQ",
        33617: "YT",
        33632: "QJ",
        33636: "XH",
        33637: "YX",
        33694: "WG",
        33705: "PF",
        33728: "YW",
        33882: "SR",
        34067: "WM",
        34074: "YW",
        34121: "QJ",
        34255: "ZC",
        34259: "XL",
        34425: "JH",
        34430: "XH",
        34485: "KH",
        34503: "YS",
        34532: "HG",
        34552: "XS",
        34558: "YE",
        34593: "ZL",
        34660: "YQ",
        34892: "XH",
        34928: "SC",
        34999: "QJ",
        35048: "PB",
        35059: "SC",
        35098: "ZC",
        35203: "TQ",
        35265: "JX",
        35299: "JX",
        35782: "SZ",
        35828: "YS",
        35830: "E",
        35843: "TD",
        35895: "YG",
        35977: "MH",
        36158: "JG",
        36228: "QJ",
        36426: "XQ",
        36466: "DC",
        36710: "JC",
        36711: "ZYG",
        36767: "PB",
        36866: "SK",
        36951: "YW",
        37034: "YX",
        37063: "XH",
        37218: "ZC",
        37325: "ZC",
        38063: "PB",
        38079: "TD",
        38085: "QY",
        38107: "DC",
        38116: "TD",
        38123: "YD",
        38224: "HG",
        38241: "XTC",
        38271: "ZC",
        38415: "YE",
        38426: "KH",
        38461: "YD",
        38463: "AE",
        38466: "PB",
        38477: "XJ",
        38518: "YT",
        38551: "WK",
        38585: "ZC",
        38704: "XS",
        38739: "LJ",
        38761: "GJ",
        38808: "SQ",
        39048: "JG",
        39049: "XJ",
        39052: "HG",
        39076: "CZ",
        39271: "XT",
        39534: "TD",
        39552: "TD",
        39584: "PB",
        39647: "SB",
        39730: "LG",
        39748: "TPB",
        40109: "ZQ",
        40479: "ND",
        40516: "HG",
        40536: "HG",
        40583: "QJ",
        40765: "YQ",
        40784: "QJ",
        40840: "YK",
        40863: "QJG"
    };

    var _checkPYCh = function (ch) {
        var uni = ch.charCodeAt(0);
        // 如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
        if (uni > 40869 || uni < 19968) {return ch;} // dealWithOthers(ch);
        return (oMultiDiff[uni] ? oMultiDiff[uni] : (_ChineseFirstPY.charAt(uni - 19968)));
    };

    var _mkPYRslt = function (arr) {
        var arrRslt = [""], k;
        for (var i = 0, len = arr.length; i < len; i++) {
            var str = arr[i];
            var strlen = str.length;
            if (strlen == 1) {
                for (k = 0; k < arrRslt.length; k++) {
                    arrRslt[k] += str;
                }
            } else {
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                for (k = 0; k < strlen; k++) {
                    // 复制一个相同的arrRslt
                    var tmp = tmpArr.slice(0);
                    // 把当前字符str[k]添加到每个元素末尾
                    for (var j = 0; j < tmp.length; j++) {
                        tmp[j] += str.charAt(k);
                    }
                    // 把复制并修改后的数组连接到arrRslt上
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        return arrRslt.join("").toLowerCase();
    };

    _.extend(BI, {
        makeFirstPY: function (str) {
            if (typeof (str) !== "string") {return "" + str;}
            var arrResult = []; // 保存中间结果的数组
            for (var i = 0, len = str.length; i < len; i++) {
                // 获得unicode码
                var ch = str.charAt(i);
                // 检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
                arrResult.push(_checkPYCh(ch));
            }
            // 处理arrResult,返回所有可能的拼音首字母串数组
            return _mkPYRslt(arrResult);
        }
    });
})();/**
 * Detect Element Resize.
 * Forked in order to guard against unsafe 'window' and 'document' references.
 *
 * https://github.com/sdecima/javascript-detect-element-resize
 * Sebastian Decima
 *
 * version: 0.5.3
 **/
!(function () {
    // Check `document` and `window` in case of server-side rendering
    var _window;
    if (typeof window !== "undefined") {
        _window = window;
    } else if (typeof self !== "undefined") {
        _window = self;
    } else {
        _window = this;
    }

    var addEventListener = typeof document !== "undefined" && document.addEventListener;
    var stylesCreated = false;

    if (addEventListener) {
        var requestFrame = (function () {
            var raf = _window.requestAnimationFrame || _window.mozRequestAnimationFrame || _window.webkitRequestAnimationFrame ||
                function (fn) {
                    return _window.setTimeout(fn, 20);
                };
            return function (fn) {
                return raf(fn);
            };
        })();

        var cancelFrame = (function () {
            var cancel = _window.cancelAnimationFrame || _window.mozCancelAnimationFrame || _window.webkitCancelAnimationFrame ||
                _window.clearTimeout;
            return function (id) {
                return cancel(id);
            };
        })();

        var resetTriggers = function (element) {
            var triggers = element.__resizeTriggers__,
                expand = triggers.firstElementChild,
                contract = triggers.lastElementChild,
                expandChild = expand.firstElementChild;
            contract.scrollLeft = contract.scrollWidth;
            contract.scrollTop = contract.scrollHeight;
            expandChild.style.width = expand.offsetWidth + 1 + "px";
            expandChild.style.height = expand.offsetHeight + 1 + "px";
            expand.scrollLeft = expand.scrollWidth;
            expand.scrollTop = expand.scrollHeight;
        };

        var checkTriggers = function (element) {
            return element.offsetWidth !== element.__resizeLast__.width ||
                element.offsetHeight !== element.__resizeLast__.height;
        };

        var scrollListener = function (e) {
            var element = this;
            resetTriggers(this);
            if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
            this.__resizeRAF__ = requestFrame(function () {
                if (checkTriggers(element)) {
                    element.__resizeLast__.width = element.offsetWidth;
                    element.__resizeLast__.height = element.offsetHeight;
                    element.__resizeListeners__.forEach(function (fn) {
                        fn.call(element, e);
                    });
                }
            });
        };

        /* Detect CSS Animations support to detect element display/re-attach */
        var animation = false,
            animationstring = "animation",
            keyframeprefix = "",
            animationstartevent = "animationstart",
            domPrefixes = "Webkit Moz O ms".split(" "),
            startEvents = "webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "),
            pfx = "";
        {
            var elm = document.createElement("fakeelement");
            if (elm.style.animationName !== undefined) {
                animation = true;
            }

            if (animation === false) {
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + "AnimationName"] !== undefined) {
                        pfx = domPrefixes[i];
                        animationstring = pfx + "Animation";
                        keyframeprefix = "-" + pfx.toLowerCase() + "-";
                        animationstartevent = startEvents[i];
                        animation = true;
                        break;
                    }
                }
            }
        }

        var animationName = "resizeanim";
        var animationKeyframes = "@" + keyframeprefix + "keyframes " + animationName + " { from { opacity: 0; } to { opacity: 0; } } ";
        var animationStyle = keyframeprefix + "animation: 1ms " + animationName + "; ";
    }

    var createStyles = function () {
        if (!stylesCreated) {
            // opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
            var css = (animationKeyframes ? animationKeyframes : "") +
                    ".resize-triggers { " + (animationStyle ? animationStyle : "") + "visibility: hidden; opacity: 0; } " +
                    ".resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");

            style.type = "text/css";
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
            stylesCreated = true;
        }
    };

    var addResizeListener = function (element, fn) {
        if (addEventListener) {
            if (!element.__resizeTriggers__) {
                if (getComputedStyle(element).position === "static") element.style.position = "relative";
                createStyles();
                element.__resizeLast__ = {};
                element.__resizeListeners__ = [];
                (element.__resizeTriggers__ = document.createElement("div")).className = "resize-triggers";
                element.__resizeTriggers__.innerHTML = "<div class=\"expand-trigger\"><div></div></div>" +
                    "<div class=\"contract-trigger\"></div>";
                element.appendChild(element.__resizeTriggers__);
                resetTriggers(element);
                element.addEventListener("scroll", scrollListener, true);

                /* Listen for a css animation to detect element display/re-attach */
                animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function (e) {
                    if (e.animationName === animationName) {resetTriggers(element);}
                });
            }
            element.__resizeListeners__.push(fn);

        } else {
            element.attachEvent("onresize", fn);
        }
    };

    var removeResizeListener = function (element, fn) {
        if (addEventListener) {
            element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if (!element.__resizeListeners__.length) {
                element.removeEventListener("scroll", scrollListener, true);
                element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
            }
        } else {
            element.detachEvent("onresize", fn);
        }
    };

    BI.ResizeDetector = {
        addResizeListener: function (widget, fn) {
            addResizeListener(widget.element[0], fn);
            return function () {
                removeResizeListener(widget.element[0], fn);
            };
        },
        removeResizeListener: function (widget, fn) {
            removeResizeListener(widget.element[0], fn);
        }
    };
}());

(function () {
    function defaultComparator (a, b) {
        return a < b;
    }

    BI.Heap = function (items, comparator) {
        this._items = items || [];
        this._size = this._items.length;
        this._comparator = comparator || defaultComparator;
        this._heapify();
    };

    BI.Heap.prototype = {
        constructor: BI.Heap,
        empty: function () {
            return this._size === 0;
        },

        pop: function () {
            if (this._size === 0) {
                return;
            }

            var elt = this._items[0];

            var lastElt = this._items.pop();
            this._size--;

            if (this._size > 0) {
                this._items[0] = lastElt;
                this._sinkDown(0);
            }

            return elt;
        },

        push: function (item) {
            this._items[this._size++] = item;
            this._bubbleUp(this._size - 1);
        },

        size: function () {
            return this._size;
        },

        peek: function () {
            if (this._size === 0) {
                return;
            }

            return this._items[0];
        },

        _heapify: function () {
            for (var index = Math.floor((this._size + 1) / 2); index >= 0; index--) {
                this._sinkDown(index);
            }
        },

        _bubbleUp: function (index) {
            var elt = this._items[index];
            while (index > 0) {
                var parentIndex = Math.floor((index + 1) / 2) - 1;
                var parentElt = this._items[parentIndex];

                // if parentElt < elt, stop
                if (this._comparator(parentElt, elt)) {
                    return;
                }

                // swap
                this._items[parentIndex] = elt;
                this._items[index] = parentElt;
                index = parentIndex;
            }
        },

        _sinkDown: function (index) {
            var elt = this._items[index];

            while (true) {
                var leftChildIndex = 2 * (index + 1) - 1;
                var rightChildIndex = 2 * (index + 1);
                var swapIndex = -1;

                if (leftChildIndex < this._size) {
                    var leftChild = this._items[leftChildIndex];
                    if (this._comparator(leftChild, elt)) {
                        swapIndex = leftChildIndex;
                    }
                }

                if (rightChildIndex < this._size) {
                    var rightChild = this._items[rightChildIndex];
                    if (this._comparator(rightChild, elt)) {
                        if (swapIndex === -1 ||
                            this._comparator(rightChild, this._items[swapIndex])) {
                            swapIndex = rightChildIndex;
                        }
                    }
                }

                // if we don't have a swap, stop
                if (swapIndex === -1) {
                    return;
                }

                this._items[index] = this._items[swapIndex];
                this._items[swapIndex] = elt;
                index = swapIndex;
            }
        }
    };
})();
(function () {
    var clamp = function (min, value, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    };

    var BUFFER_ROWS = 5;
    var NO_ROWS_SCROLL_RESULT = {
        index: 0,
        offset: 0,
        position: 0,
        contentHeight: 0
    };

    BI.TableScrollHelper = function (rowCount,
        defaultRowHeight,
        viewportHeight,
        rowHeightGetter) {
        this._rowOffsets = BI.PrefixIntervalTree.uniform(rowCount, defaultRowHeight);
        this._storedHeights = new Array(rowCount);
        for (var i = 0; i < rowCount; ++i) {
            this._storedHeights[i] = defaultRowHeight;
        }
        this._rowCount = rowCount;
        this._position = 0;
        this._contentHeight = rowCount * defaultRowHeight;
        this._defaultRowHeight = defaultRowHeight;
        this._rowHeightGetter = rowHeightGetter ?
            rowHeightGetter : function () {
                return defaultRowHeight;
            };
        this._viewportHeight = viewportHeight;

        this._updateHeightsInViewport(0, 0);
    };

    BI.TableScrollHelper.prototype = {
        constructor: BI.TableScrollHelper,
        setRowHeightGetter: function (rowHeightGetter) {
            this._rowHeightGetter = rowHeightGetter;
        },

        setViewportHeight: function (viewportHeight) {
            this._viewportHeight = viewportHeight;
        },

        getContentHeight: function () {
            return this._contentHeight;
        },

        _updateHeightsInViewport: function (firstRowIndex,
            firstRowOffset) {
            var top = firstRowOffset;
            var index = firstRowIndex;
            while (top <= this._viewportHeight && index < this._rowCount) {
                this._updateRowHeight(index);
                top += this._storedHeights[index];
                index++;
            }
        },

        _updateHeightsAboveViewport: function (firstRowIndex) {
            var index = firstRowIndex - 1;
            while (index >= 0 && index >= firstRowIndex - BUFFER_ROWS) {
                var delta = this._updateRowHeight(index);
                this._position += delta;
                index--;
            }
        },

        _updateRowHeight: function (rowIndex) {
            if (rowIndex < 0 || rowIndex >= this._rowCount) {
                return 0;
            }
            var newHeight = this._rowHeightGetter(rowIndex);
            if (newHeight !== this._storedHeights[rowIndex]) {
                var change = newHeight - this._storedHeights[rowIndex];
                this._rowOffsets.set(rowIndex, newHeight);
                this._storedHeights[rowIndex] = newHeight;
                this._contentHeight += change;
                return change;
            }
            return 0;
        },

        getRowPosition: function (rowIndex) {
            this._updateRowHeight(rowIndex);
            return this._rowOffsets.sumUntil(rowIndex);
        },

        scrollBy: function (delta) {
            if (this._rowCount === 0) {
                return NO_ROWS_SCROLL_RESULT;
            }
            var firstRow = this._rowOffsets.greatestLowerBound(this._position);
            firstRow = clamp(firstRow, 0, Math.max(this._rowCount - 1, 0));
            var firstRowPosition = this._rowOffsets.sumUntil(firstRow);
            var rowIndex = firstRow;
            var position = this._position;

            var rowHeightChange = this._updateRowHeight(rowIndex);
            if (firstRowPosition !== 0) {
                position += rowHeightChange;
            }
            var visibleRowHeight = this._storedHeights[rowIndex] -
                (position - firstRowPosition);

            if (delta >= 0) {

                while (delta > 0 && rowIndex < this._rowCount) {
                    if (delta < visibleRowHeight) {
                        position += delta;
                        delta = 0;
                    } else {
                        delta -= visibleRowHeight;
                        position += visibleRowHeight;
                        rowIndex++;
                    }
                    if (rowIndex < this._rowCount) {
                        this._updateRowHeight(rowIndex);
                        visibleRowHeight = this._storedHeights[rowIndex];
                    }
                }
            } else if (delta < 0) {
                delta = -delta;
                var invisibleRowHeight = this._storedHeights[rowIndex] - visibleRowHeight;

                while (delta > 0 && rowIndex >= 0) {
                    if (delta < invisibleRowHeight) {
                        position -= delta;
                        delta = 0;
                    } else {
                        position -= invisibleRowHeight;
                        delta -= invisibleRowHeight;
                        rowIndex--;
                    }
                    if (rowIndex >= 0) {
                        var change = this._updateRowHeight(rowIndex);
                        invisibleRowHeight = this._storedHeights[rowIndex];
                        position += change;
                    }
                }
            }

            var maxPosition = this._contentHeight - this._viewportHeight;
            position = clamp(position, 0, maxPosition);
            this._position = position;
            var firstRowIndex = this._rowOffsets.greatestLowerBound(position);
            firstRowIndex = clamp(firstRowIndex, 0, Math.max(this._rowCount - 1, 0));
            firstRowPosition = this._rowOffsets.sumUntil(firstRowIndex);
            var firstRowOffset = firstRowPosition - position;

            this._updateHeightsInViewport(firstRowIndex, firstRowOffset);
            this._updateHeightsAboveViewport(firstRowIndex);

            return {
                index: firstRowIndex,
                offset: firstRowOffset,
                position: this._position,
                contentHeight: this._contentHeight
            };
        },

        _getRowAtEndPosition: function (rowIndex) {
            // We need to update enough rows above the selected one to be sure that when
            // we scroll to selected position all rows between first shown and selected
            // one have most recent heights computed and will not resize
            this._updateRowHeight(rowIndex);
            var currentRowIndex = rowIndex;
            var top = this._storedHeights[currentRowIndex];
            while (top < this._viewportHeight && currentRowIndex >= 0) {
                currentRowIndex--;
                if (currentRowIndex >= 0) {
                    this._updateRowHeight(currentRowIndex);
                    top += this._storedHeights[currentRowIndex];
                }
            }
            var position = this._rowOffsets.sumTo(rowIndex) - this._viewportHeight;
            if (position < 0) {
                position = 0;
            }
            return position;
        },

        scrollTo: function (position) {
            if (this._rowCount === 0) {
                return NO_ROWS_SCROLL_RESULT;
            }
            if (position <= 0) {
                // If position less than or equal to 0 first row should be fully visible
                // on top
                this._position = 0;
                this._updateHeightsInViewport(0, 0);

                return {
                    index: 0,
                    offset: 0,
                    position: this._position,
                    contentHeight: this._contentHeight
                };
            } else if (position >= this._contentHeight - this._viewportHeight) {
                // If position is equal to or greater than max scroll value, we need
                // to make sure to have bottom border of last row visible.
                var rowIndex = this._rowCount - 1;
                position = this._getRowAtEndPosition(rowIndex);
            }
            this._position = position;

            var firstRowIndex = this._rowOffsets.greatestLowerBound(position);
            firstRowIndex = clamp(firstRowIndex, 0, Math.max(this._rowCount - 1, 0));
            var firstRowPosition = this._rowOffsets.sumUntil(firstRowIndex);
            var firstRowOffset = firstRowPosition - position;

            this._updateHeightsInViewport(firstRowIndex, firstRowOffset);
            this._updateHeightsAboveViewport(firstRowIndex);

            return {
                index: firstRowIndex,
                offset: firstRowOffset,
                position: this._position,
                contentHeight: this._contentHeight
            };
        },

        /**
         * Allows to scroll to selected row with specified offset. It always
         * brings that row to top of viewport with that offset
         */
        scrollToRow: function (rowIndex, offset) {
            rowIndex = clamp(rowIndex, 0, Math.max(this._rowCount - 1, 0));
            offset = clamp(offset, -this._storedHeights[rowIndex], 0);
            var firstRow = this._rowOffsets.sumUntil(rowIndex);
            return this.scrollTo(firstRow - offset);
        },

        /**
         * Allows to scroll to selected row by bringing it to viewport with minimal
         * scrolling. This that if row is fully visible, scroll will not be changed.
         * If top border of row is above top of viewport it will be scrolled to be
         * fully visible on the top of viewport. If the bottom border of row is
         * below end of viewport, it will be scrolled up to be fully visible on the
         * bottom of viewport.
         */
        scrollRowIntoView: function (rowIndex) {
            rowIndex = clamp(rowIndex, 0, Math.max(this._rowCount - 1, 0));
            var rowBegin = this._rowOffsets.sumUntil(rowIndex);
            var rowEnd = rowBegin + this._storedHeights[rowIndex];
            if (rowBegin < this._position) {
                return this.scrollTo(rowBegin);
            } else if (this._position + this._viewportHeight < rowEnd) {
                var position = this._getRowAtEndPosition(rowIndex);
                return this.scrollTo(position);
            }
            return this.scrollTo(this._position);
        }
    };

})();
// Data structure that allows to store values and assign positions to them
// in a way to minimize changing positions of stored values when new ones are
// added or when some values are replaced. Stored elements are alwasy assigned
// a consecutive set of positoins startin from 0 up to count of elements less 1
// Following actions can be executed
// * get position assigned to given value (null if value is not stored)
// * create new entry for new value and get assigned position back
// * replace value that is furthest from specified value range with new value
//   and get it's position back
// All operations take amortized log(n) time where n is number of elements in
// the set.
BI.IntegerBufferSet = function () {
    this._valueToPositionMap = {};
    this._size = 0;
    this._smallValues = new BI.Heap(
        [], // Initial data in the heap
        this._smallerComparator
    );
    this._largeValues = new BI.Heap(
        [], // Initial data in the heap
        this._greaterComparator
    );

};

BI.IntegerBufferSet.prototype = {
    constructor: BI.IntegerBufferSet,
    getSize: function () /* number*/ {
        return this._size;
    },

    getValuePosition: function (/* number*/ value) /* ?number*/ {
        if (this._valueToPositionMap[value] === undefined) {
            return null;
        }
        return this._valueToPositionMap[value];
    },

    getNewPositionForValue: function (/* number*/ value) /* number*/ {
        var newPosition = this._size;
        this._size++;
        this._pushToHeaps(newPosition, value);
        this._valueToPositionMap[value] = newPosition;
        return newPosition;
    },

    replaceFurthestValuePosition: function (/* number*/ lowValue,
        /* number*/ highValue,
        /* number*/ newValue) /* ?number*/ {
        this._cleanHeaps();
        if (this._smallValues.empty() || this._largeValues.empty()) {
            // Threre are currently no values stored. We will have to create new
            // position for this value.
            return null;
        }

        var minValue = this._smallValues.peek().value;
        var maxValue = this._largeValues.peek().value;
        if (minValue >= lowValue && maxValue <= highValue) {
            // All values currently stored are necessary, we can't reuse any of them.
            return null;
        }

        var valueToReplace;
        if (lowValue - minValue > maxValue - highValue) {
            // minValue is further from provided range. We will reuse it's position.
            valueToReplace = minValue;
            this._smallValues.pop();
        } else {
            valueToReplace = maxValue;
            this._largeValues.pop();
        }
        var position = this._valueToPositionMap[valueToReplace];
        delete this._valueToPositionMap[valueToReplace];
        this._valueToPositionMap[newValue] = position;
        this._pushToHeaps(position, newValue);

        return position;
    },

    _pushToHeaps: function (/* number*/ position, /* number*/ value) {
        var element = {
            position: position,
            value: value
        };
        // We can reuse the same object in both heaps, because we don't mutate them
        this._smallValues.push(element);
        this._largeValues.push(element);
    },

    _cleanHeaps: function () {
        // We not usually only remove object from one heap while moving value.
        // Here we make sure that there is no stale data on top of heaps.
        this._cleanHeap(this._smallValues);
        this._cleanHeap(this._largeValues);
        var minHeapSize =
            Math.min(this._smallValues.size(), this._largeValues.size());
        var maxHeapSize =
            Math.max(this._smallValues.size(), this._largeValues.size());
        if (maxHeapSize > 10 * minHeapSize) {
            // There are many old values in one of heaps. We nned to get rid of them
            // to not use too avoid memory leaks
            this._recreateHeaps();
        }
    },

    _recreateHeaps: function () {
        var sourceHeap = this._smallValues.size() < this._largeValues.size() ?
            this._smallValues :
            this._largeValues;
        var newSmallValues = new Heap(
            [], // Initial data in the heap
            this._smallerComparator
        );
        var newLargeValues = new Heap(
            [], // Initial datat in the heap
            this._greaterComparator
        );
        while (!sourceHeap.empty()) {
            var element = sourceHeap.pop();
            // Push all stil valid elements to new heaps
            if (this._valueToPositionMap[element.value] !== undefined) {
                newSmallValues.push(element);
                newLargeValues.push(element);
            }
        }
        this._smallValues = newSmallValues;
        this._largeValues = newLargeValues;
    },

    _cleanHeap: function (/* object*/ heap) {
        while (!heap.empty() &&
        this._valueToPositionMap[heap.peek().value] === undefined) {
            heap.pop();
        }
    },

    _smallerComparator: function (/* object*/ lhs, /* object*/ rhs) /* boolean*/ {
        return lhs.value < rhs.value;
    },

    _greaterComparator: function (/* object*/ lhs, /* object*/ rhs) /* boolean*/ {
        return lhs.value > rhs.value;
    }
};

!(function () {
    BI.LinkHashMap = function () {
        this.array = [];
        this.map = {};
    };
    BI.LinkHashMap.prototype = {
        constructor: BI.LinkHashMap,
        has: function (key) {
            if (key in this.map) {
                return true;
            }
            return false;
        },

        add: function (key, value) {
            if (typeof key === "undefined") {
                return;
            }
            if (key in this.map) {
                this.map[key] = value;
            } else {
                this.array.push(key);
                this.map[key] = value;
            }
        },

        remove: function (key) {
            if (key in this.map) {
                delete this.map[key];
                for (var i = 0; i < this.array.length; i++) {
                    if (this.array[i] == key) {
                        this.array.splice(i, 1);
                        break;
                    }
                }
            }
        },

        size: function () {
            return this.array.length;
        },

        each: function (fn, scope) {
            var scope = scope || window;
            var fn = fn || null;
            if (fn == null || typeof (fn) !== "function") {
                return;
            }
            for (var i = 0; i < this.array.length; i++) {
                var key = this.array[i];
                var value = this.map[key];
                var re = fn.call(scope, key, value, i, this.array, this.map);
                if (re == false) {
                    break;
                }
            }
        },

        get: function (key) {
            return this.map[key];
        },

        toArray: function () {
            var array = [];
            this.each(function (key, value) {
                array.push(value);
            });
            return array;
        }
    };
})();window.BI = window.BI || {};

_.extend(BI, {
    $defaultImport: function (options, type) {
        var config;
        if (BI.isObject(options)) {
            config = $.extend({
                op: "resource",
                path: null,
                type: null,
                must: false
            }, options);
            config.url = BI.servletURL + "?op=" + config.op + "&resource=" + config.path;
        } else {
            config = {
                url: BI.servletURL + "?op=resource&resource=" + options,
                type: arguments[1],
                must: arguments[2]
            };
        }
        this.$import(config.url, config.type, config.must);
    },
    $import: function () {
        var _LOADED = {}; // alex:保存加载过的
        function loadReady (src, must) {
            var $scripts = $("head script, body script");
            $.each($scripts, function (i, item) {
                if (item.src.indexOf(src) != -1) {
                    _LOADED[src] = true;
                }
            });
            var $links = $("head link");
            $.each($links, function (i, item) {
                if (item.href.indexOf(src) != -1 && must) {
                    _LOADED[src] = false;
                    $(item).remove();
                }
            });
        }

        // must=true 强行加载
        return function (src, ext, must) {
            loadReady(src, must);
            // alex:如果已经加载过了的,直接return
            if (_LOADED[src] === true) {
                return;
            }
            if (ext === "css") {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = src;
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(link);
                _LOADED[src] = true;
            } else {
                // alex:这里用同步调用的方式,必须等待ajax完成
                $.ajax({
                    url: src,
                    dataType: "script", // alex:指定dataType为script,jquery会帮忙做globalEval的事情
                    async: false,
                    cache: true,
                    complete: function (res, status) {
                        /*
                         * alex:发现jquery会很智能地判断一下返回的数据类型是不是script,然后做一个globalEval
                         * 所以当status为success时就不需要再把其中的内容加到script里面去了
                         */
                        if (status == "success") {
                            _LOADED[src] = true;
                        }
                    }
                });
            }
        };
    }()
});
!(function () {
    BI.LRU = function (limit) {
        this.size = 0;
        this.limit = limit;
        this.head = this.tail = undefined;
        this._keymap = {};
    };

    var p = BI.LRU.prototype;

    p.put = function (key, value) {
        var removed;
        if (this.size === this.limit) {
            removed = this.shift();
        }

        var entry = this.get(key, true);
        if (!entry) {
            entry = {
                key: key
            };
            this._keymap[key] = entry;
            if (this.tail) {
                this.tail.newer = entry;
                entry.older = this.tail;
            } else {
                this.head = entry;
            }
            this.tail = entry;
            this.size++;
        }
        entry.value = value;

        return removed;
    };

    p.shift = function () {
        var entry = this.head;
        if (entry) {
            this.head = this.head.newer;
            this.head.older = undefined;
            entry.newer = entry.older = undefined;
            this._keymap[entry.key] = undefined;
            this.size--;
        }
        return entry;
    };


    p.get = function (key, returnEntry) {
        var entry = this._keymap[key];
        if (entry === undefined) return;
        if (entry === this.tail) {
            return returnEntry
                ? entry
                : entry.value;
        }
        // HEAD--------------TAIL
        //   <.older   .newer>
        //  <--- add direction --
        //   A  B  C  <D>  E
        if (entry.newer) {
            if (entry === this.head) {
                this.head = entry.newer;
            }
            entry.newer.older = entry.older; // C <-- E.
        }
        if (entry.older) {
            entry.older.newer = entry.newer; // C. --> E
        }
        entry.newer = undefined; // D --x
        entry.older = this.tail; // D. --> E
        if (this.tail) {
            this.tail.newer = entry; // E. <-- D
        }
        this.tail = entry;
        return returnEntry
            ? entry
            : entry.value;
    };

    p.has = function (key) {
        return this._keymap[key] != null;
    };
})();
!(function () {
    var MD5 = function (hexcase) {
        this.hexcase = !hexcase ? 0 : 1;
        /* hex output format. 0 - lowercase; 1 - uppercase */
        this.b64pad = "";
        /* base-64 pad character. "=" for strict RFC compliance */
        this.chrsz = 8;
        /* bits per input character. 8 - ASCII; 16 - Unicode */
    };

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    MD5.prototype.hex_md5 = function (s) {
        return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    };

    MD5.prototype.hex_md5_salt = function (s) {
        var md5ed = this.hex_md5(s);

        var items1 = [];
        var items2 = [];
        for (var i = 0; i < md5ed.length; i++) {
            if (i % 2 === 0) {
                items1.push(md5ed.charAt(i));
            } else {
                items2.push(md5ed.charAt(i));
            }
        }
        var result = ":" + items1.join("") + items2.join("");
        return result;
    };

    MD5.prototype.b64_md5 = function (s) {
        return this.binl2b64(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    };

    MD5.prototype.hex_hmac_md5 = function (key, data) {
        return this.binl2hex(this.core_hmac_md5(key, data));
    };

    MD5.prototype.b64_hmac_md5 = function (key, data) {
        return this.binl2b64(this.core_hmac_md5(key, data));
    };

    /* Backwards compatibility - same as hex_md5() */
    MD5.prototype.calcMD5 = function (s) {
        return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    };

    MD5.prototype.core_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return Array(a, b, c, d);

    };

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    MD5.prototype.md5_cmn = function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };
    MD5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    MD5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    MD5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    MD5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };

    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    MD5.prototype.core_hmac_md5 = function (key, data) {
        var bkey = this.str2binl(key);
        if (bkey.length > 16) {bkey = this.core_md5(bkey, key.length * this.chrsz);}

        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = this.core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * this.chrsz);
        return this.core_md5(opad.concat(hash), 512 + 128);
    };

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    MD5.prototype.safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    MD5.prototype.bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };

    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    MD5.prototype.str2binl = function (str) {
        var bin = Array();
        var mask = (1 << this.chrsz) - 1;
        for (var i = 0; i < str.length * this.chrsz; i += this.chrsz) {bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);}
        return bin;
    };

    /*
     * Convert an array of little-endian words to a hex string.
     */
    MD5.prototype.binl2hex = function (binarray) {
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF)
                + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    };

    /*
     * Convert an array of little-endian words to a base-64 string
     */
    MD5.prototype.binl2b64 = function (binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
                | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
                | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) {str += this.b64pad;} else {str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);}
            }
        }
        return str;
    };
    BI.MD5 = new MD5();
})();// 线段树
(function () {
    var parent = function (node) {
        return Math.floor(node / 2);
    };

    var Int32Array = window.Int32Array || function (size) {
        var xs = [];
        for (var i = size - 1; i >= 0; --i) {
            xs[i] = 0;
        }
        return xs;
    };

    var ceilLog2 = function (x) {
        var y = 1;
        while (y < x) {
            y *= 2;
        }
        return y;
    };

    BI.PrefixIntervalTree = function (xs) {
        this._size = xs.length;
        this._half = ceilLog2(this._size);
        this._heap = new Int32Array(2 * this._half);

        var i;
        for (i = 0; i < this._size; ++i) {
            this._heap[this._half + i] = xs[i];
        }

        for (i = this._half - 1; i > 0; --i) {
            this._heap[i] = this._heap[2 * i] + this._heap[2 * i + 1];
        }
    };

    BI.PrefixIntervalTree.prototype = {
        constructor: BI.PrefixIntervalTree,
        set: function (index, value) {
            var node = this._half + index;
            this._heap[node] = value;

            node = parent(node);
            for (; node !== 0; node = parent(node)) {
                this._heap[node] =
                    this._heap[2 * node] + this._heap[2 * node + 1];
            }
        },

        get: function (index) {
            var node = this._half + index;
            return this._heap[node];
        },

        getSize: function () {
            return this._size;
        },

        /**
         * get(0) + get(1) + ... + get(end - 1).
         */
        sumUntil: function (end) {
            if (end === 0) {
                return 0;
            }

            var node = this._half + end - 1;
            var sum = this._heap[node];
            for (; node !== 1; node = parent(node)) {
                if (node % 2 === 1) {
                    sum += this._heap[node - 1];
                }
            }

            return sum;
        },

        /**
         * get(0) + get(1) + ... + get(inclusiveEnd).
         */
        sumTo: function (inclusiveEnd) {
            return this.sumUntil(inclusiveEnd + 1);
        },

        /**
         * sum get(begin) + get(begin + 1) + ... + get(end - 1).
         */
        sum: function (begin, end) {
            return this.sumUntil(end) - this.sumUntil(begin);
        },

        /**
         * Returns the smallest i such that 0 <= i <= size and sumUntil(i) <= t, or
         * -1 if no such i exists.
         */
        greatestLowerBound: function (t) {
            if (t < 0) {
                return -1;
            }

            var node = 1;
            if (this._heap[node] <= t) {
                return this._size;
            }

            while (node < this._half) {
                var leftSum = this._heap[2 * node];
                if (t < leftSum) {
                    node = 2 * node;
                } else {
                    node = 2 * node + 1;
                    t -= leftSum;
                }
            }

            return node - this._half;
        },

        /**
         * Returns the smallest i such that 0 <= i <= size and sumUntil(i) < t, or
         * -1 if no such i exists.
         */
        greatestStrictLowerBound: function (t) {
            if (t <= 0) {
                return -1;
            }

            var node = 1;
            if (this._heap[node] < t) {
                return this._size;
            }

            while (node < this._half) {
                var leftSum = this._heap[2 * node];
                if (t <= leftSum) {
                    node = 2 * node;
                } else {
                    node = 2 * node + 1;
                    t -= leftSum;
                }
            }

            return node - this._half;
        },

        /**
         * Returns the smallest i such that 0 <= i <= size and t <= sumUntil(i), or
         * size + 1 if no such i exists.
         */
        leastUpperBound: function (t) {
            return this.greatestStrictLowerBound(t) + 1;
        },

        /**
         * Returns the smallest i such that 0 <= i <= size and t < sumUntil(i), or
         * size + 1 if no such i exists.
         */
        leastStrictUpperBound: function (t) {
            return this.greatestLowerBound(t) + 1;
        }
    };

    BI.PrefixIntervalTree.uniform = function (size, initialValue) {
        var xs = [];
        for (var i = size - 1; i >= 0; --i) {
            xs[i] = initialValue;
        }

        return new BI.PrefixIntervalTree(xs);
    };

    BI.PrefixIntervalTree.empty = function (size) {
        return BI.PrefixIntervalTree.uniform(size, 0);
    };

})();

!(function () {
    BI.Queue = function (capacity) {
        this.capacity = capacity;
        this.array = [];
    };
    BI.Queue.prototype = {
        constructor: BI.Queue,

        contains: function (v) {
            return this.array.contains(v);
        },

        indexOf: function (v) {
            return this.array.contains(v);
        },

        getElementByIndex: function (index) {
            return this.array[index];
        },

        push: function (v) {
            this.array.push(v);
            if (this.capacity && this.array.length > this.capacity) {
                this.array.shift();
            }
        },

        pop: function () {
            this.array.pop();
        },

        shift: function () {
            this.array.shift();
        },

        unshift: function (v) {
            this.array.unshift(v);
            if (this.capacity && this.array.length > this.capacity) {
                this.array.pop();
            }
        },

        remove: function (v) {
            this.array.remove(v);
        },
        
        splice: function () {
            this.array.splice.apply(this.array, arguments);
        },
        
        slice: function () {
            this.array.slice.apply(this.array, arguments);
        },
        
        size: function () {
            return this.array.length;
        },

        each: function (fn, scope) {
            var scope = scope || window;
            var fn = fn || null;
            if (fn == null || typeof (fn) !== "function") {
                return;
            }
            for (var i = 0; i < this.array.length; i++) {
                var re = fn.call(scope, i, this.array[i], this.array);
                if (re == false) {
                    break;
                }
            }
        },

        toArray: function () {
            return this.array;
        },

        fromArray: function (array) {
            var self = this;
            BI.each(array, function (i, v) {
                self.push(v);
            });
        },

        clear: function () {
            this.array.clear();
        }
    };
})();!(function () {
    var Section = function (height, width, x, y) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;

        this._indexMap = {};
        this._indices = [];
    };

    Section.prototype = {
        constructor: Section,
        addCellIndex: function (index) {
            if (!this._indexMap[index]) {
                this._indexMap[index] = true;
                this._indices.push(index);
            }
        },

        getCellIndices: function () {
            return this._indices;
        }
    };

    var SECTION_SIZE = 100;
    BI.SectionManager = function (sectionSize) {
        this._sectionSize = sectionSize || SECTION_SIZE;
        this._cellMetadata = [];
        this._sections = {};
    };

    BI.SectionManager.prototype = {
        constructor: BI.SectionManager,
        getCellIndices: function (height, width, x, y) {
            var indices = {};

            BI.each(this.getSections(height, width, x, y), function (i, section) {
                BI.each(section.getCellIndices(), function (j, index) {
                    indices[index] = index;
                });
            });

            return BI.map(BI.keys(indices), function (i, index) {
                return indices[index];
            });
        },

        getCellMetadata: function (index) {
            return this._cellMetadata[index];
        },

        getSections: function (height, width, x, y) {
            var sectionXStart = Math.floor(x / this._sectionSize);
            var sectionXStop = Math.floor((x + width - 1) / this._sectionSize);
            var sectionYStart = Math.floor(y / this._sectionSize);
            var sectionYStop = Math.floor((y + height - 1) / this._sectionSize);

            var sections = [];

            for (var sectionX = sectionXStart; sectionX <= sectionXStop; sectionX++) {
                for (var sectionY = sectionYStart; sectionY <= sectionYStop; sectionY++) {
                    var key = sectionX + "." + sectionY;

                    if (!this._sections[key]) {
                        this._sections[key] = new Section(this._sectionSize, this._sectionSize, sectionX * this._sectionSize, sectionY * this._sectionSize);
                    }

                    sections.push(this._sections[key]);
                }
            }

            return sections;
        },

        getTotalSectionCount: function () {
            return BI.size(this._sections);
        },

        registerCell: function (cellMetadatum, index) {
            this._cellMetadata[index] = cellMetadatum;

            BI.each(this.getSections(cellMetadatum.height, cellMetadatum.width, cellMetadatum.x, cellMetadatum.y), function (i, section) {
                section.addCellIndex(index);
            });
        }
    };
})();
(function () {
    var clamp = function (value, min, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    };
    var MIN_BUFFER_ROWS = 6;
    var MAX_BUFFER_ROWS = 10;

    BI.TableRowBuffer = function (rowsCount,
        defaultRowHeight,
        viewportHeight,
        rowHeightGetter) {
        this._bufferSet = new BI.IntegerBufferSet();
        this._defaultRowHeight = defaultRowHeight;
        this._viewportRowsBegin = 0;
        this._viewportRowsEnd = 0;
        this._maxVisibleRowCount = Math.ceil(viewportHeight / defaultRowHeight) + 1;
        // this._bufferRowsCount = Math.floor(this._maxVisibleRowCount / 2);
        this._bufferRowsCount = clamp(
            Math.floor(this._maxVisibleRowCount / 2),
            MIN_BUFFER_ROWS,
            MAX_BUFFER_ROWS
        );
        this._rowsCount = rowsCount;
        this._rowHeightGetter = rowHeightGetter;
        this._rows = [];
        this._viewportHeight = viewportHeight;

    };
    BI.TableRowBuffer.prototype = {
        constructor: BI.TableRowBuffer,

        getRowsWithUpdatedBuffer: function () {
            var remainingBufferRows = 2 * this._bufferRowsCount;
            var bufferRowIndex =
                Math.max(this._viewportRowsBegin - this._bufferRowsCount, 0);
            while (bufferRowIndex < this._viewportRowsBegin) {
                this._addRowToBuffer(
                    bufferRowIndex,
                    this._viewportRowsBegin,
                    this._viewportRowsEnd - 1
                );
                bufferRowIndex++;
                remainingBufferRows--;
            }
            bufferRowIndex = this._viewportRowsEnd;
            while (bufferRowIndex < this._rowsCount && remainingBufferRows > 0) {
                this._addRowToBuffer(
                    bufferRowIndex,
                    this._viewportRowsBegin,
                    this._viewportRowsEnd - 1
                );
                bufferRowIndex++;
                remainingBufferRows--;
            }
            return this._rows;
        },

        getRows: function (firstRowIndex,
            firstRowOffset) {
            var top = firstRowOffset;
            var totalHeight = top;
            var rowIndex = firstRowIndex;
            var endIndex =
                Math.min(firstRowIndex + this._maxVisibleRowCount, this._rowsCount);

            this._viewportRowsBegin = firstRowIndex;
            while (rowIndex < endIndex ||
            (totalHeight < this._viewportHeight && rowIndex < this._rowsCount)) {
                this._addRowToBuffer(
                    rowIndex,
                    firstRowIndex,
                    endIndex - 1
                );
                totalHeight += this._rowHeightGetter(rowIndex);
                ++rowIndex;
                // Store index after the last viewport row as end, to be able to
                // distinguish when there are no rows rendered in viewport
                this._viewportRowsEnd = rowIndex;
            }

            return this._rows;
        },

        _addRowToBuffer: function (rowIndex,
            firstViewportRowIndex,
            lastViewportRowIndex) {
            var rowPosition = this._bufferSet.getValuePosition(rowIndex);
            var viewportRowsCount = lastViewportRowIndex - firstViewportRowIndex + 1;
            var allowedRowsCount = viewportRowsCount + this._bufferRowsCount * 2;
            if (rowPosition === null &&
                this._bufferSet.getSize() >= allowedRowsCount) {
                rowPosition =
                    this._bufferSet.replaceFurthestValuePosition(
                        firstViewportRowIndex,
                        lastViewportRowIndex,
                        rowIndex
                    );
            }
            if (rowPosition === null) {
                // We can't reuse any of existing positions for this row. We have to
                // create new position
                rowPosition = this._bufferSet.getNewPositionForValue(rowIndex);
                this._rows[rowPosition] = rowIndex;
            } else {
                // This row already is in the table with rowPosition position or it
                // can replace row that is in that position
                this._rows[rowPosition] = rowIndex;
            }
        }
    };

})();

(function () {
    BI.Tree = function () {
        this.root = new BI.Node(BI.UUID());
    };

    BI.Tree.prototype = {
        constructor: BI.Tree,
        addNode: function (node, newNode, index) {
            if (BI.isNull(newNode)) {
                this.root.addChild(node, index);
            } else if (BI.isNull(node)) {
                this.root.addChild(newNode, index);
            } else {
                node.addChild(newNode, index);
            }
        },

        isRoot: function (node) {
            return node === this.root;
        },

        getRoot: function () {
            return this.root;
        },

        clear: function () {
            this.root.clear();
        },

        initTree: function (nodes) {
            var self = this;
            this.clear();
            var queue = [];
            BI.each(nodes, function (i, node) {
                var n = new BI.Node(node);
                n.set("data", node);
                self.addNode(n);
                queue.push(n);
            });
            while (!BI.isEmpty(queue)) {
                var parent = queue.shift();
                var node = parent.get("data");
                BI.each(node.children, function (i, child) {
                    var n = new BI.Node(child);
                    n.set("data", child);
                    queue.push(n);
                    self.addNode(parent, n);
                });
            }
        },

        _toJSON: function (node) {
            var self = this;
            var children = [];
            BI.each(node.getChildren(), function (i, child) {
                children.push(self._toJSON(child));
            });
            return BI.extend({
                id: node.id
            }, BI.deepClone(node.get("data")), (children.length > 0 ? {
                    children: children
                } : {}));
        },

        toJSON: function (node) {
            var self = this, result = [];
            BI.each((node || this.root).getChildren(), function (i, child) {
                result.push(self._toJSON(child));
            });
            return result;
        },

        _toJSONWithNode: function (node) {
            var self = this;
            var children = [];
            BI.each(node.getChildren(), function (i, child) {
                children.push(self._toJSONWithNode(child));
            });
            return BI.extend({
                id: node.id
            }, BI.deepClone(node.get("data")), {
                node: node
            }, (children.length > 0 ? {
                    children: children
                } : {}));
        },

        toJSONWithNode: function (node) {
            var self = this, result = [];
            BI.each((node || this.root).getChildren(), function (i, child) {
                result.push(self._toJSONWithNode(child));
            });
            return result;
        },

        search: function (root, target, param) {
            if (!(root instanceof BI.Node)) {
                return arguments.callee.apply(this, [this.root, root, target]);
            }
            var self = this, next = null;

            if (BI.isNull(target)) {
                return null;
            }
            if (BI.isEqual(root[param || "id"], target)) {
                return root;
            }
            BI.any(root.getChildren(), function (i, child) {
                next = self.search(child, target, param);
                if (null !== next) {
                    return true;
                }
            });
            return next;
        },

        _traverse: function (node, callback) {
            var queue = [];
            queue.push(node);
            while (!BI.isEmpty(queue)) {
                var temp = queue.shift();
                var b = callback && callback(temp);
                if (b === false) {
                    break;
                }
                if (b === true) {
                    continue;
                }
                if (temp != null) {
                    queue = queue.concat(temp.getChildren());
                }
            }
        },

        traverse: function (callback) {
            this._traverse(this.root, callback);
        },

        _recursion: function (node, route, callback) {
            var self = this;
            return BI.every(node.getChildren(), function (i, child) {
                var next = BI.clone(route);
                next.push(child.id);
                var b = callback && callback(child, next);
                if (b === false) {
                    return false;
                }
                if (b === true) {
                    return true;
                }
                return self._recursion(child, next, callback);
            });
        },

        recursion: function (callback) {
            this._recursion(this.root, [], callback);
        },

        inOrderTraverse: function (callback) {
            this._inOrderTraverse(this.root, callback);
        },

        // 中序遍历(递归)
        _inOrderTraverse: function (node, callback) {
            if (node != null) {
                this._inOrderTraverse(node.getLeft());
                callback && callback(node);
                this._inOrderTraverse(node.getRight());
            }
        },

        // 中序遍历(非递归)
        nrInOrderTraverse: function (callback) {

            var stack = [];
            var node = this.root;
            while (node != null || !BI.isEmpty(stack)) {
                while (node != null) {
                    stack.push(node);
                    node = node.getLeft();
                }
                node = stack.pop();
                callback && callback(node);
                node = node.getRight();
            }
        },

        preOrderTraverse: function (callback) {
            this._preOrderTraverse(this.root, callback);
        },

        // 先序遍历(递归)
        _preOrderTraverse: function (node, callback) {
            if (node != null) {
                callback && callback(node);
                this._preOrderTraverse(node.getLeft());
                this._preOrderTraverse(node.getRight());
            }
        },

        // 先序遍历（非递归）
        nrPreOrderTraverse: function (callback) {

            var stack = [];
            var node = this.root;

            while (node != null || !BI.isEmpty(stack)) {

                while (node != null) {
                    callback && callback(node);
                    stack.push(node);
                    node = node.getLeft();
                }
                node = stack.pop();
                node = node.getRight();
            }
        },

        postOrderTraverse: function (callback) {
            this._postOrderTraverse(this.root, callback);
        },

        // 后序遍历(递归)
        _postOrderTraverse: function (node, callback) {
            if (node != null) {
                this._postOrderTraverse(node.getLeft());
                this._postOrderTraverse(node.getRight());
                callback && callback(node);
            }
        },

        // 后续遍历(非递归)
        nrPostOrderTraverse: function (callback) {

            var stack = [];
            var node = this.root;
            var preNode = null;// 表示最近一次访问的节点

            while (node != null || !BI.isEmpty(stack)) {

                while (node != null) {
                    stack.push(node);
                    node = node.getLeft();
                }

                node = BI.last(stack);

                if (node.getRight() == null || node.getRight() == preNode) {
                    callback && callback(node);
                    node = stack.pop();
                    preNode = node;
                    node = null;
                } else {
                    node = node.getRight();
                }
            }
        }
    };

    BI.Node = function (id) {
        if (BI.isObject(id)) {
            BI.extend(this, id);
        } else {
            this.id = id;
        }
        this.clear.apply(this, arguments);
    };

    BI.Node.prototype = {
        constructor: BI.Node,

        set: function (key, value) {
            if (BI.isObject(key)) {
                BI.extend(this, key);
                return;
            }
            this[key] = value;
        },

        get: function (key) {
            return this[key];
        },

        isLeaf: function () {
            return BI.isEmpty(this.children);
        },

        getChildren: function () {
            return this.children;
        },

        getChildrenLength: function () {
            return this.children.length;
        },

        getFirstChild: function () {
            return BI.first(this.children);
        },

        getLastChild: function () {
            return BI.last(this.children);
        },

        setLeft: function (left) {
            this.left = left;
        },

        getLeft: function () {
            return this.left;
        },

        setRight: function (right) {
            this.right = right;
        },

        getRight: function () {
            return this.right;
        },

        setParent: function (parent) {
            this.parent = parent;
        },

        getParent: function () {
            return this.parent;
        },

        getChild: function (index) {
            return this.children[index];
        },

        getChildIndex: function (id) {
            return BI.findIndex(this.children, function (i, ch) {
                return ch.get("id") === id;
            });
        },

        removeChild: function (id) {
            this.removeChildByIndex(this.getChildIndex(id));
        },

        removeChildByIndex: function (index) {
            var before = this.getChild(index - 1);
            var behind = this.getChild(index + 1);
            if (before != null) {
                before.setRight(behind || null);
            }
            if (behind != null) {
                behind.setLeft(before || null);
            }
            this.children.splice(index, 1);
        },

        removeAllChilds: function () {
            this.children = [];
        },

        addChild: function (child, index) {
            var cur = null;
            if (BI.isUndefined(index)) {
                cur = this.children.length - 1;
            } else {
                cur = index - 1;
            }
            child.setParent(this);
            if (cur >= 0) {
                this.getChild(cur) && this.getChild(cur).setRight(child);
                child.setLeft(this.getChild(cur));
            }
            if (BI.isUndefined(index)) {
                this.children.push(child);
            } else {
                this.children.splice(index, 0, child);
            }
        },

        equals: function (obj) {
            return this === obj || this.id === obj.id;
        },

        clear: function () {
            this.parent = null;
            this.left = null;
            this.right = null;
            this.children = [];
        }
    };

    BI.extend(BI.Tree, {
        transformToArrayFormat: function (nodes, pId) {
            if (!nodes) return [];
            var r = [];
            if (BI.isArray(nodes)) {
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = BI.clone(nodes[i]);
                    node.pId = node.pId == null ? pId : node.pId;
                    delete node.children;
                    r.push(node);
                    if (nodes[i]["children"]) {
                        r = r.concat(BI.Tree.transformToArrayFormat(nodes[i]["children"], node.id));
                    }
                }
            } else {
                var newNodes = BI.clone(nodes);
                newNodes.pId = newNodes.pId == null ? pId : newNodes.pId;
                delete newNodes.children;
                r.push(newNodes);
                if (nodes["children"]) {
                    r = r.concat(BI.Tree.transformToArrayFormat(nodes["children"], newNodes.id));
                }
            }
            return r;
        },

        arrayFormat: function (nodes, pId) {
            if (!nodes) {
                return [];
            }
            var r = [];
            if (BI.isArray(nodes)) {
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    node.pId = node.pId == null ? pId : node.pId;
                    r.push(node);
                    if (nodes[i]["children"]) {
                        r = r.concat(BI.Tree.arrayFormat(nodes[i]["children"], node.id));
                    }
                }
            } else {
                var newNodes = nodes;
                newNodes.pId = newNodes.pId == null ? pId : newNodes.pId;
                r.push(newNodes);
                if (nodes["children"]) {
                    r = r.concat(BI.Tree.arrayFormat(nodes["children"], newNodes.id));
                }
            }
            return r;
        },

        transformToTreeFormat: function (sNodes) {
            var i, l;
            if (!sNodes) {
                return [];
            }

            if (BI.isArray(sNodes)) {
                var r = [];
                var tmpMap = [];
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (BI.isNull(sNodes[i].id)) {
                        return sNodes;
                    }
                    tmpMap[sNodes[i].id] = BI.clone(sNodes[i]);
                }
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (tmpMap[sNodes[i].pId] && sNodes[i].id !== sNodes[i].pId) {
                        if (!tmpMap[sNodes[i].pId].children) {
                            tmpMap[sNodes[i].pId].children = [];
                        }
                        tmpMap[sNodes[i].pId].children.push(tmpMap[sNodes[i].id]);
                    } else {
                        r.push(tmpMap[sNodes[i].id]);
                    }
                    delete tmpMap[sNodes[i].id].pId;
                }
                return r;
            }
            return [sNodes];
            
        },

        treeFormat: function (sNodes) {
            var i, l;
            if (!sNodes) {
                return [];
            }

            if (BI.isArray(sNodes)) {
                var r = [];
                var tmpMap = [];
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (BI.isNull(sNodes[i].id)) {
                        return sNodes;
                    }
                    tmpMap[sNodes[i].id] = sNodes[i];
                }
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (tmpMap[sNodes[i].pId] && sNodes[i].id !== sNodes[i].pId) {
                        if (!tmpMap[sNodes[i].pId].children) {
                            tmpMap[sNodes[i].pId].children = [];
                        }
                        tmpMap[sNodes[i].pId].children.push(tmpMap[sNodes[i].id]);
                    } else {
                        r.push(tmpMap[sNodes[i].id]);
                    }
                }
                return r;
            }
            return [sNodes];
            
        },

        traversal: function (array, callback) {
            if (BI.isNull(array)) {
                return;
            }
            var self = this;
            BI.any(array, function (i, item) {
                if (callback(i, item) === false) {
                    return true;
                }
                self.traversal(item.children, callback);
            });
        }
    });
})();// 向量操作
BI.Vector = function (x, y) {
    this.x = x;
    this.y = y;
};
BI.Vector.prototype = {
    constructor: BI.Vector,
    cross: function (v) {
        return (this.x * v.y - this.y * v.x);
    },
    length: function (v) {
        return (Math.sqrt(this.x * v.x + this.y * v.y));
    }
};
BI.Region = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};
BI.Region.prototype = {
    constructor: BI.Region,
    // 判断两个区域是否相交，若相交，则要么顶点互相包含，要么矩形边界（或对角线）相交
    isIntersects: function (obj) {
        if (this.isPointInside(obj.x, obj.y) ||
            this.isPointInside(obj.x + obj.w, obj.y) ||
            this.isPointInside(obj.x, obj.y + obj.h) ||
            this.isPointInside(obj.x + obj.w, obj.y + obj.h)) {
            return true;
        } else if (obj.isPointInside(this.x, this.y) ||
            obj.isPointInside(this.x + this.w, this.y) ||
            obj.isPointInside(this.x, this.y + this.h) ||
            obj.isPointInside(this.x + this.w, this.y + this.h)) {
            return true;
        } else if (obj.x != null && obj.y != null)// 判断矩形对角线相交 |v1 X v2||v1 X v3| < 0
        {
            var vector1 = new BI.Vector(this.w, this.h);// 矩形对角线向量
            var vector2 = new BI.Vector(obj.x - this.x, obj.y - this.y);
            var vector3 = new BI.Vector(vector2.x + obj.w, vector2.y + obj.h);
            if ((vector1.cross(vector2) * vector1.cross(vector3)) < 0) {
                return true;
            }
        }
        return false;
    },
    // 判断一个点是否在这个区域内部
    isPointInside: function (x, y) {
        if (this.x == null || this.y == null) {
            return false;
        }
        if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
            return true;
        }
        return false;
    },
    // 返回区域的重心，因为是矩形所以返回中点
    getPosition: function () {
        var pos = [];
        pos.push(this.x + this.w / 2);
        pos.push(this.y + this.h / 2);
        return pos;
    }
};// ;
// !(function (BI) {
//
//     if (BI.isIE()) {
//         XMLSerializer = null;
//         DOMParser = null;
//     }
//
//
//     var XML = {
//         Document: {
//             NodeType: {
//                 ELEMENT: 1,
//                 ATTRIBUTE: 2,
//                 TEXT: 3,
//                 CDATA_SECTION: 4,
//                 ENTITY_REFERENCE: 5,
//                 ENTITY: 6,
//                 PROCESSING_INSTRUCTION: 7,
//                 COMMENT: 8,
//                 DOCUMENT: 9,
//                 DOCUMENT_TYPE: 10,
//                 DOCUMENT_FRAGMENT: 11,
//                 NOTATION: 12
//             }
//         }
//     };
//
//     XML.ResultType = {
//         single: 'single',
//         array: 'array'
//     };
//
//     XML.fromString = function (xmlStr) {
//         try {
//             var parser = new DOMParser();
//             return parser.parseFromString(xmlStr, "text/xml");
//         } catch (e) {
//             var arrMSXML = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0"];
//             for (var i = 0; i < arrMSXML.length; i++) {
//                 try {
//                     var xmlDoc = new ActiveXObject(arrMSXML[i]);
//                     xmlDoc.setProperty("SelectionLanguage", "XPath");
//                     xmlDoc.async = false;
//                     xmlDoc.loadXML(xmlStr);
//                     return xmlDoc;
//                 } catch (xmlError) {
//                 }
//             }
//         }
//     };
//
//     XML.toString = function (xmlNode) {
//         if (!BI.isIE()) {
//             var xmlSerializer = new XMLSerializer();
//             return xmlSerializer.serializeToString(xmlNode);
//         } else
//             return xmlNode.xml;
//     };
//
//     XML.getNSResolver = function (str) {
//         if (!str) {
//             return null;
//         }
//         var list = str.split(' ');
//         var namespaces = {};
//         for (var i = 0; i < list.length; i++) {
//             var pair = list[i].split('=');
//             var fix = BI.trim(pair[0]).replace("xmlns:", "");
//             namespaces[fix] = BI.trim(pair[1]).replace(/"/g, "").replace(/'/g, "");
//         }
//         return function (prefix) {
//             return namespaces[prefix];
//         };
//     };
//
//     XML.eval = function (context, xpathExp, resultType, namespaces) {
//         if ((BI.isIE() && ('undefined' === typeof(context.selectSingleNode) || 'undefined' === typeof(context.selectNodes)))) {
//             return XML.eval2(context, xpathExp, resultType, namespaces);
//         } else {
//             if (BI.isIE()) {
//                 namespaces = namespaces ? namespaces : "";
//                 var doc = (context.nodeType == XML.Document.NodeType.DOCUMENT) ? context : context.ownerDocument;
//                 doc.setProperty("SelectionNamespaces", namespaces);
//                 var result;
//                 if (resultType == this.ResultType.single) {
//                     result = context.selectSingleNode(xpathExp);
//                 } else {
//                     result = context.selectNodes(xpathExp) || [];
//                 }
//                 doc.setProperty("SelectionNamespaces", "");
//                 return result;
//             } else {
//                 var node = context;
//                 var xmlDoc = (context.nodeName.indexOf("document") == -1) ? context.ownerDocument : context;
//                 var retType = (resultType == this.ResultType.single) ? XPathResult.FIRST_ORDERED_NODE_TYPE : XPathResult.ANY_TYPE;
//                 var col = xmlDoc.evaluate(xpathExp, node, XML.getNSResolver(namespaces), retType, null);
//
//                 if (retType == XPathResult.FIRST_ORDERED_NODE_TYPE) {
//                     return col.singleNodeValue;
//                 } else {
//                     var thisColMemb = col.iterateNext();
//                     var rowsCol = [];
//                     while (thisColMemb) {
//                         rowsCol[rowsCol.length] = thisColMemb;
//                         thisColMemb = col.iterateNext();
//                     }
//                     return rowsCol;
//                 }
//             }
//         }
//     };
//
//     XML.eval2 = function (context, xpathExp, resultType, namespaces) {
//         if (resultType !== "single" && resultType !== undefined && resultType !== null) {
//             throw new Error("justep.SimpleXML.eval only be resultType='single', not" + resultType);
//         }
//
//         if (context === null || context === undefined || xpathExp === null || xpathExp === undefined) {
//             return context;
//         }
//
//         if (context.nodeType == XML.Document.NodeType.DOCUMENT) {
//             context = context.documentElement;
//         }
//
//         var childs, i;
//         if (xpathExp.indexOf("/") != -1) {
//             var items = xpathExp.split("/");
//             var isAbs = xpathExp.substring(0, 1) == "/";
//             for (i = 0; i < items.length; i++) {
//                 var item = items[i];
//                 if (item === "") {
//                     continue;
//                 } else {
//                     var next = null;
//                     var ii = i + 1;
//                     for (; ii < items.length; ii++) {
//                         if (next === null) {
//                             next = items[ii];
//                         } else {
//                             next = next + "/" + items[ii];
//                         }
//                     }
//
//                     if (item == ".") {
//                         return this.eval(context, next, resultType);
//
//                     } else if (item == "..") {
//                         return this.eval2(context.parentNode, next, resultType);
//
//                     } else if (item == "*") {
//                         if (isAbs) {
//                             return this.eval2(context, next, resultType);
//
//                         } else {
//                             childs = context.childNodes;
//                             for (var j = 0; j < childs.length; j++) {
//                                 var tmp = this.eval2(childs[j], next, resultType);
//                                 if (tmp !== null) {
//                                     return tmp;
//                                 }
//                             }
//                             return null;
//                         }
//
//                     } else {
//                         if (isAbs) {
//                             if (context.nodeName == item) {
//                                 return this.eval2(context, next, resultType);
//                             } else {
//                                 return null;
//                             }
//                         } else {
//                             var child = this.getChildByName(context, item);
//                             if (child !== null) {
//                                 return this.eval2(child, next, resultType);
//                             } else {
//                                 return null;
//                             }
//
//                         }
//                     }
//
//                 }
//             }
//
//             return null;
//
//         } else {
//             if ("text()" == xpathExp) {
//                 childs = context.childNodes;
//                 for (i = 0; i < childs.length; i++) {
//                     if (childs[i].nodeType == XML.Document.NodeType.TEXT) {
//                         return childs[i];
//                     }
//                 }
//                 return null;
//             } else {
//                 return this.getChildByName(context, xpathExp);
//             }
//         }
//     };
//
//     XML.getChildByName = function (context, name) {
//         if (context === null || context === undefined || name === null || name === undefined) {
//             return null;
//         }
//
//         if (context.nodeType == XML.Document.NodeType.DOCUMENT) {
//             context = context.documentElement;
//         }
//
//         var childs = context.childNodes;
//         for (var i = 0; i < childs.length; i++) {
//             if (childs[i].nodeType == XML.Document.NodeType.ELEMENT && (childs[i].nodeName == name || name == "*")) {
//                 return childs[i];
//             }
//         }
//
//         return null;
//     };
//
//     XML.appendChildren = function (context, xpathExp, nodes, isBefore) {
//         nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
//         var finded = this.eval(context, xpathExp);
//         var count = finded.length;
//         for (var i = 0; i < count; i++) {
//             if (isBefore && finded[i].firstNode) {
//                 this._insertBefore(finded[i], nodes, finded[i].firstNode);
//             } else {
//                 for (var j = 0; j < nodes.length; j++) {
//                     finded[i].appendChild(nodes[j]);
//                 }
//             }
//         }
//         return count;
//     };
//
//     XML.removeNodes = function (context, xpathExp) {
//         var nodes = this.eval(context, xpathExp);
//         for (var i = 0; i < nodes.length; i++) {
//             nodes[i].parentNode.removeChild(nodes[i]);
//         }
//     };
//
//     XML._insertBefore = function (parent, newchildren, refchild) {
//         for (var i = 0; i < newchildren.length; i++) {
//             parent.insertBefore(newchildren[i], refchild);
//         }
//     };
//
//     XML.insertNodes = function (context, xpathExp, nodes, isBefore) {
//         nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
//         var finded = this.eval(context, xpathExp);
//         var count = finded.length;
//         for (var i = 0; i < count; i++) {
//             var refnode = (isBefore) ? finded[i] : finded[i].nextSibling;
//             this._insertBefore(finded[i].parentNode, nodes, refnode);
//         }
//         return count;
//     };
//
//     XML.replaceNodes = function (context, xpathExp, nodes) {
//         nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
//         var finded = this.eval(context, xpathExp);
//         var count = finded.length;
//         for (var i = 0; i < count; i++) {
//             var refnode = finded[i];
//             var parent = refnode.parentNode;
//             this._insertBefore(parent, nodes, refnode);
//             parent.removeChild(refnode);
//         }
//         return count;
//     };
//
//     XML.setNodeText = function (context, xpathExp, text) {
//         var finded = this.eval(context, xpathExp, this.ResultType.single);
//         if (finded === null) {
//             return;
//         }
//         if (finded.nodeType == XML.Document.NodeType.ELEMENT) {
//             var textNode = this.eval(finded, "./text()", this.ResultType.single);
//             if (!textNode) {
//                 textNode = finded.ownerDocument.createTextNode("");
//                 finded.appendChild(textNode);
//             }
//             textNode.nodeValue = text;
//         } else {
//             finded.nodeValue = text;
//         }
//         return;
//     };
//
//     XML.getNodeText = function (context, xpathExp, defaultValue) {
//         var finded = xpathExp ? this.eval(context, xpathExp, this.ResultType.single) : context;
//         if (finded && (finded.nodeType == XML.Document.NodeType.ELEMENT)) {
//             finded = this.eval(finded, "./text()", this.ResultType.single);
//         }
//         return (finded && finded.nodeValue) ? "" + finded.nodeValue : (defaultValue !== undefined) ? defaultValue : null;
//     };
//
//     XML.Namespaces = {
//         XMLSCHEMA: "http://www.w3.org/2001/XMLSchema#",
//         XMLSCHEMA_STRING: "http://www.w3.org/2001/XMLSchema#String",
//         XMLSCHEMA_LONG: "http://www.w3.org/2001/XMLSchema#Long",
//         XMLSCHEMA_INTEGER: 'http://www.w3.org/2001/XMLSchema#Integer',
//         XMLSCHEMA_FLOAT: 'http://www.w3.org/2001/XMLSchema#Float',
//         XMLSCHEMA_DOUBLE: 'http://www.w3.org/2001/XMLSchema#Double',
//         XMLSCHEMA_DECIMAL: 'http://www.w3.org/2001/XMLSchema#Decimal',
//         XMLSCHEMA_DATE: 'http://www.w3.org/2001/XMLSchema#Date',
//         XMLSCHEMA_TIME: 'http://www.w3.org/2001/XMLSchema#Time',
//         XMLSCHEMA_DATETIME: 'http://www.w3.org/2001/XMLSchema#DateTime',
//         XMLSCHEMA_BOOLEAN: 'http://www.w3.org/2001/XMLSchema#Boolean',
//         XMLSCHEMA_SYMBOL: 'http://www.w3.org/2001/XMLSchema#Symbol',
//         JUSTEPSCHEMA: "http://www.justep.com/xbiz#",
//         RDF: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
//         JUSTEP: "http://www.justep.com/x5#",
//         'get': function (type) {
//             type = type ? type.toLowerCase() : "string";
//             if ("string" == type) {
//                 return XML.Namespaces.XMLSCHEMA_STRING;
//             }
//             else if ("integer" == type) {
//                 return XML.Namespaces.XMLSCHEMA_INTEGER;
//             }
//             else if ("long" == type) {
//                 return XML.Namespaces.XMLSCHEMA_LONG;
//             }
//             else if ("float" == type) {
//                 return XML.Namespaces.XMLSCHEMA_FLOAT;
//             }
//             else if ("double" == type) {
//                 return XML.Namespaces.XMLSCHEMA_DOUBLE;
//             }
//             else if ("decimal" == type) {
//                 return XML.Namespaces.XMLSCHEMA_DECIMAL;
//             }
//             else if ("date" == type) {
//                 return XML.Namespaces.XMLSCHEMA_DATE;
//             }
//             else if ("time" == type) {
//                 return XML.Namespaces.XMLSCHEMA_TIME;
//             }
//             else if ("datetime" == type) {
//                 return XML.Namespaces.XMLSCHEMA_DATETIME;
//             }
//             else if ("boolean" == type) {
//                 return XML.Namespaces.XMLSCHEMA_BOOLEAN;
//             }
//         }
//     };
// })(BI);
/**
 * 保存数据，将js里面用到的常量数据都分离
 *
 */
BI.Data = Data = {};

/**
 * 存放bi里面通用的一些常量
 * @type {{}}
 */
Data.Constant = BICst = {};
/**
 * 缓冲池
 * @type {{Buffer: {}}}
 */

(function () {
    var Buffer = {};
    var MODE = false;// 设置缓存模式为关闭

    Data.BufferPool = {
        put: function (name, cache) {
            if (BI.isNotNull(Buffer[name])) {
                throw new Error("Buffer Pool has the key already!");
            }
            Buffer[name] = cache;
        },

        get: function (name) {
            return Buffer[name];
        }
    };
})();/**
 * 共享池
 * @type {{Shared: {}}}
 */

(function () {
    var _Shared = {};
    Data.SharingPool = {
        _Shared: _Shared,
        put: function (name, shared) {
            _Shared[name] = shared;
        },

        cat: function () {
            var args = Array.prototype.slice.call(arguments, 0),
                copy = _Shared;
            for (var i = 0; i < args.length; i++) {
                copy = copy && copy[args[i]];
            }
            return copy;
        },

        get: function () {
            return BI.deepClone(this.cat.apply(this, arguments));
        },

        remove: function (key) {
            delete _Shared[key];
        }
    };
})();Data.Req = {

};
Data.Source = BISource = {

};