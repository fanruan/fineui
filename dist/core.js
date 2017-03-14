/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.3",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Remove at next major release (1.9/2.0)
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = core_slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
	assertGetIdNotName,
	Expr,
	getText,
	isXML,
	contains,
	compile,
	sortOrder,
	hasDuplicate,
	outermostContext,

	baseHasDuplicate = true,
	strundefined = "undefined",

	expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

	Token = String,
	document = window.document,
	docElem = document.documentElement,
	dirruns = 0,
	done = 0,
	pop = [].pop,
	push = [].push,
	slice = [].slice,
	// Use a stripped-down indexOf if a native one is unavailable
	indexOf = [].indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	// Augment a function for special use by Sizzle
	markFunction = function( fn, value ) {
		fn[ expando ] = value == null || value;
		return fn;
	},

	createCache = function() {
		var cache = {},
			keys = [];

		return markFunction(function( key, value ) {
			// Only keep the most recent entries
			if ( keys.push( key ) > Expr.cacheLength ) {
				delete cache[ keys.shift() ];
			}

			// Retrieve with (key + " ") to avoid collision with native Object.prototype properties (see Issue #157)
			return (cache[ key + " " ] = value);
		}, cache );
	},

	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// Regex

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments not in parens/brackets,
	//   then attribute selectors and non-pseudos (denoted by :),
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

	// For matchExpr.POS and matchExpr.needsContext
	pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
		"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

	rnot = /^:not/,
	rsibling = /[\x20\t\r\n\f]*[+~]/,
	rendsWithNot = /:not\($/,

	rheader = /h\d/i,
	rinputs = /input|select|textarea|button/i,

	rbackslash = /\\(?!\\)/g,

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"POS": new RegExp( pos, "i" ),
		"CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
	},

	// Support

	// Used for testing something on an element
	assert = function( fn ) {
		var div = document.createElement("div");

		try {
			return fn( div );
		} catch (e) {
			return false;
		} finally {
			// release memory in IE
			div = null;
		}
	},

	// Check if getElementsByTagName("*") returns only elements
	assertTagNameNoComments = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	}),

	// Check if getAttribute returns normalized href attributes
	assertHrefNotNormalized = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}),

	// Check if attributes should be retrieved by attribute nodes
	assertAttributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	}),

	// Check if getElementsByClassName can be trusted
	assertUsableClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	}),

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	assertUsableName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = document.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			document.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			document.getElementsByName( expando + 0 ).length;
		assertGetIdNotName = !document.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

// If slice is not available, provide a backup
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

function Sizzle( selector, context, results, seed ) {
	results = results || [];
	context = context || document;
	var match, elem, xml, m,
		nodeType = context.nodeType;

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( nodeType !== 1 && nodeType !== 9 ) {
		return [];
	}

	xml = isXML( context );

	if ( !xml && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	} else {

		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	}
	return ret;
};

isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	docElem.compareDocumentPosition ?
	function( a, b ) {
		return b && !!( a.compareDocumentPosition( b ) & 16 );
	} :
	function( a, b ) {
		while ( (b = b.parentNode) ) {
			if ( b === a ) {
				return true;
			}
		}
		return false;
	};

Sizzle.attr = function( elem, name ) {
	var val,
		xml = isXML( elem );

	if ( !xml ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( xml || assertAttributes ) {
		return elem.getAttribute( name );
	}
	val = elem.getAttributeNode( name );
	return val ?
		typeof elem[ name ] === "boolean" ?
			elem[ name ] ? name : null :
			val.specified ? val.value : null :
		null;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	// IE6/7 return a modified href
	attrHandle: assertHrefNotNormalized ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		},

	find: {
		"ID": assertGetIdNotName ?
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			} :
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			},

		"TAG": assertTagNameNoComments ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					var elem,
						tmp = [],
						i = 0;

					for ( ; (elem = results[i]); i++ ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			},

		"NAME": assertUsableName && function( tag, context ) {
			if ( typeof context.getElementsByName !== strundefined ) {
				return context.getElementsByName( name );
			}
		},

		"CLASS": assertUsableClassName && function( className, context, xml ) {
			if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
				return context.getElementsByClassName( className );
			}
		}
	},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( rbackslash, "" );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				3 xn-component of xn+y argument ([+-]?\d*n|)
				4 sign of xn-component
				5 x of xn-component
				6 sign of y-component
				7 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1] === "nth" ) {
				// nth-child requires argument
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
				match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

			// other types prohibit arguments
			} else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var unquoted, excess;
			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			if ( match[3] ) {
				match[2] = match[3];
			} else if ( (unquoted = match[4]) ) {
				// Only check arguments that contain a pseudo
				if ( rpseudo.test(unquoted) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					unquoted = unquoted.slice( 0, excess );
					match[0] = match[0].slice( 0, excess );
				}
				match[2] = unquoted;
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {
		"ID": assertGetIdNotName ?
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					return elem.getAttribute("id") === id;
				};
			} :
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === id;
				};
			},

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}
			nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ expando ][ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem, context ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.substr( result.length - check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, argument, first, last ) {

			if ( type === "nth" ) {
				return function( elem ) {
					var node, diff,
						parent = elem.parentNode;

					if ( first === 1 && last === 0 ) {
						return true;
					}

					if ( parent ) {
						diff = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								diff++;
								if ( elem === node ) {
									break;
								}
							}
						}
					}

					// Incorporate the offset (or cast to NaN), then check against cycle size
					diff -= last;
					return diff === first || ( diff % first === 0 && diff / first >= 0 );
				};
			}

			return function( elem ) {
				var node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;
				}
			};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			var nodeType;
			elem = elem.firstChild;
			while ( elem ) {
				if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
					return false;
				}
				elem = elem.nextSibling;
			}
			return true;
		},

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"text": function( elem ) {
			var type, attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				(type = elem.type) === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
		},

		// Input types
		"radio": createInputPseudo("radio"),
		"checkbox": createInputPseudo("checkbox"),
		"file": createInputPseudo("file"),
		"password": createInputPseudo("password"),
		"image": createInputPseudo("image"),

		"submit": createButtonPseudo("submit"),
		"reset": createButtonPseudo("reset"),

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"focus": function( elem ) {
			var doc = elem.ownerDocument;
			return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		"active": function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		},

		// Positional types
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			for ( var i = 0; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			for ( var i = 1; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

function siblingCheck( a, b, ret ) {
	if ( a === b ) {
		return ret;
	}

	var cur = a.nextSibling;

	while ( cur ) {
		if ( cur === b ) {
			return -1;
		}

		cur = cur.nextSibling;
	}

	return 1;
}

sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
			a.compareDocumentPosition :
			a.compareDocumentPosition(b) & 4
		) ? -1 : 1;
	} :
	function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	hasDuplicate = baseHasDuplicate;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ expando ][ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			tokens.push( matched = new Token( match.shift() ) );
			soFar = soFar.slice( matched.length );

			// Cast descendant combinators to space
			matched.type = match[0].replace( rtrim, " " );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {

				tokens.push( matched = new Token( match.shift() ) );
				soFar = soFar.slice( matched.length );
				matched.type = type;
				matched.matches = match;
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && combinator.dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( checkNonElements || elem.nodeType === 1  ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( !xml ) {
				var cache,
					dirkey = dirruns + " " + doneName + " ",
					cachedkey = dirkey + cachedruns;
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( (cache = elem[ expando ]) === cachedkey ) {
							return elem.sizset;
						} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
							if ( elem.sizset ) {
								return elem;
							}
						} else {
							elem[ expando ] = cachedkey;
							if ( matcher( elem, context, xml ) ) {
								elem.sizset = true;
								return elem;
							}
							elem.sizset = false;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( matcher( elem, context, xml ) ) {
							return elem;
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && tokens.join("")
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Nested matchers should use non-integer dirruns
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = superMatcher.el;
			}

			// Add elements passing elementMatchers directly to results
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++superMatcher.el;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				for ( j = 0; (matcher = setMatchers[j]); j++ ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	superMatcher.el = 0;
	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ expando ][ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed, xml ) {
	var i, tokens, token, type, find,
		match = tokenize( selector ),
		j = match.length;

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !xml &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().length );
			}

			// Fetch a seed set for right-to-left matching
			for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( rbackslash, "" ),
						rsibling.test( tokens[0].type ) && context.parentNode || context,
						xml
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && tokens.join("");
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		xml,
		results,
		rsibling.test( selector )
	);
	return results;
}

if ( document.querySelectorAll ) {
	(function() {
		var disconnectedMatch,
			oldSelect = select,
			rescape = /'|\\/g,
			rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

			// qSa(:focus) reports false when true (Chrome 21), no need to also add to buggyMatches since matches checks buggyQSA
			// A support test would require too much code (would include document ready)
			rbuggyQSA = [ ":focus" ],

			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			// A support test would require too much code (would include document ready)
			// just skip matchesSelector for :active
			rbuggyMatches = [ ":active" ],
			matches = docElem.matchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.webkitMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector;

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here (do not put tests after this one)
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE9 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<p test=''></p>";
			if ( div.querySelectorAll("[test^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here (do not put tests after this one)
			div.innerHTML = "<input type='hidden'/>";
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push(":enabled", ":disabled");
			}
		});

		// rbuggyQSA always contains :focus, so no need for a length check
		rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

		select = function( selector, context, results, seed, xml ) {
			// Only use querySelectorAll when not filtering,
			// when this is not xml,
			// and when no QSA bugs apply
			if ( !seed && !xml && !rbuggyQSA.test( selector ) ) {
				var groups, i,
					old = true,
					nid = expando,
					newContext = context,
					newSelector = context.nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + groups[i].join("");
					}
					newContext = rsibling.test( selector ) && context.parentNode || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results, slice.call( newContext.querySelectorAll(
							newSelector
						), 0 ) );
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}

			return oldSelect( selector, context, results, seed, xml );
		};

		if ( matches ) {
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				try {
					matches.call( div, "[test!='']:sizzle" );
					rbuggyMatches.push( "!=", pseudos );
				} catch ( e ) {}
			});

			// rbuggyMatches always contains :active and :focus, so no need for a length check
			rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

			Sizzle.matchesSelector = function( elem, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace( rattributeQuotes, "='$1']" );

				// rbuggyMatches always contains :active, so no need for an existence check
				if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && !rbuggyQSA.test( expr ) ) {
					try {
						var ret = matches.call( elem, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9
								elem.document && elem.document.nodeType !== 11 ) {
							return ret;
						}
					} catch(e) {}
				}

				return Sizzle( expr, null, null, [ elem ] ).length > 0;
			};
		}
	})();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, l, length, n, r, ret,
			self = this;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		ret = this.pushStack( "", "find", selector );

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rcheckableType = /^(?:checkbox|radio)$/,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
		}
	},

	after: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( !isDisconnected( this[0] ) ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		}

		return this.length ?
			this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
			this;
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = [].concat.apply( [], args );

		var results, first, fragment, iNoClone,
			i = 0,
			value = args[0],
			scripts = [],
			l = this.length;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call( this, i, table ? self.html() : undefined );
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			results = jQuery.buildFragment( args, this, scripts );
			fragment = results.fragment;
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				// Fragments from the fragment cache must always be cloned and never used in place.
				for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						i === iNoClone ?
							fragment :
							jQuery.clone( fragment, true, true )
					);
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						if ( jQuery.ajax ) {
							jQuery.ajax({
								url: elem.src,
								type: "GET",
								dataType: "script",
								async: false,
								global: false,
								"throws": true
							});
						} else {
							jQuery.error("no ajax");
						}
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	if ( nodeName === "object" ) {
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
	var fragment, cacheable, cachehit,
		first = args[ 0 ];

	// Set context from what may come in as undefined or a jQuery collection or a node
	// Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
	// also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
	context = context || document;
	context = !context.nodeType && context[0] || context;
	context = context.ownerDocument || context;

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		// Mark cacheable and look for a hit
		cacheable = true;
		fragment = jQuery.fragments[ first ];
		cachehit = fragment !== undefined;
	}

	if ( !fragment ) {
		fragment = context.createDocumentFragment();
		jQuery.clean( args, context, fragment, scripts );

		// Update the cache, but only store false
		// unless this is a second parsing of the same content
		if ( cacheable ) {
			jQuery.fragments[ first ] = cachehit && fragment;
		}
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			l = insert.length,
			parent = this.length === 1 && this[0].parentNode;

		if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
			insert[ original ]( this[0] );
			return this;
		} else {
			for ( ; i < l; i++ ) {
				elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			clone;

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
			safe = context === document && safeFragment,
			ret = [];

		// Ensure that context is a document
		if ( !context || typeof context.createDocumentFragment === "undefined" ) {
			context = document;
		}

		// Use the already-created safe fragment if context permits
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Ensure a safe container in which to render the html
					safe = safe || createSafeFragment( context );
					div = context.createElement("div");
					safe.appendChild( div );

					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Go to html and back, then peel off extra wrappers
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					depth = wrap[0];
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						hasBody = rtbody.test(elem);
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Take out of fragment container (we need a fresh div each time)
					div.parentNode.removeChild( div );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				jQuery.merge( ret, elem );
			}
		}

		// Fix #11356: Clear elements from safeFragment
		if ( div ) {
			elem = div = safe = null;
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
					fixDefaultChecked( elem );
				} else if ( typeof elem.getElementsByTagName !== "undefined" ) {
					jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
				}
			}
		}

		// Append elements to a provided document fragment
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var data, id, elem, type,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( elem.removeAttribute ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						jQuery.deletedIds.push( id );
					}
				}
			}
		}
	}
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
	browser.webkit = true;
} else if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

	eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var elem, display,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {
			display = curCSS( elem, "display" );

			if ( !values[ index ] && display !== "none" ) {
				jQuery._data( elem, "olddisplay", display );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state, fn2 ) {
		var bool = typeof state === "boolean";

		if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
			return eventsToggle.apply( this, arguments );
		}

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, numeric, extra ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( numeric || extra !== undefined ) {
			num = parseFloat( val );
			return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	curCSS = function( elem, name ) {
		var ret, width, minWidth, maxWidth,
			computed = window.getComputedStyle( elem, null ),
			style = elem.style;

		if ( computed ) {

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed.getPropertyValue( name ) || computed[ name ];

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	curCSS = function( elem, name ) {
		var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			// we use jQuery.css instead of curCSS here
			// because of the reliableMarginRight CSS hook!
			val += jQuery.css( elem, extra + cssExpand[ i ], true );
		}

		// From this point on we use curCSS for maximum performance (relevant in animations)
		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		valueIsBorderBox = true,
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox
		)
	) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	if ( elemdisplay[ nodeName ] ) {
		return elemdisplay[ nodeName ];
	}

	var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
		display = elem.css("display");
	elem.remove();

	// If the simple way fails,
	// get element's real default display by attaching it to a temp iframe
	if ( display === "none" || display === "" ) {
		// Use the already-created iframe if possible
		iframe = document.body.appendChild(
			iframe || jQuery.extend( document.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			})
		);

		// Create a cacheable copy of the iframe document on first call.
		// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
		// document to it; WebKit & Firefox won't allow reusing the iframe document.
		if ( !iframeDoc || !iframe.createElement ) {
			iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
			iframeDoc.write("<!doctype html><html><body>");
			iframeDoc.close();
		}

		elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

		display = curCSS( elem, "display" );
		document.body.removeChild( iframe );
	}

	// Store the correct default display
	elemdisplay[ nodeName ] = display;

	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				} else {
					return getWidthOrHeight( elem, name, extra );
				}
			}
		},

		set: function( elem, value, extra ) {
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
				style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "marginRight" );
					}
				});
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						var ret = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType, list, placeBefore,
			dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
			i = 0,
			length = dataTypes.length;

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var selection,
		list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters );

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	// Don't do a request if no elements are being requested
	if ( !this.length ) {
		return this;
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// Request the remote document
	jQuery.ajax({
		url: url,

		// if "type" variable is undefined, then "GET" method will be used
		type: type,
		dataType: "html",
		data: params,
		complete: function( jqXHR, status ) {
			if ( callback ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			}
		}
	}).done(function( responseText ) {

		// Save response for use in complete callback
		response = arguments;

		// See if a selector was specified
		self.html( selector ?

			// Create a dummy div to hold the results
			jQuery("<div>")

				// inject the contents of the document in, removing the scripts
				// to avoid any 'Permission Denied' errors in IE
				.append( responseText.replace( rscript, "" ) )

				// Locate the specified elements
				.find( selector ) :

			// If not, just inject the full result
			responseText );

	});

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // ifModified key
			ifModifiedKey,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || strAbort;
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ ifModifiedKey ] = modified;
					}
					modified = jqXHR.getResponseHeader("Etag");
					if ( modified ) {
						jQuery.etag[ ifModifiedKey ] = modified;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.always( tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();

		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ],
		converters = {},
		i = 0;

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
var oldCallbacks = [],
	rquestion = /\?/,
	rjsonp = /(=)\?(?=&|$)|\?\?/,
	nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		data = s.data,
		url = s.url,
		hasCallback = s.jsonp !== false,
		replaceInUrl = hasCallback && rjsonp.test( url ),
		replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
			!( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
			rjsonp.test( data );

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;
		overwritten = window[ callbackName ];

		// Insert callback into url or form data
		if ( replaceInUrl ) {
			s.url = url.replace( rjsonp, "$1" + callbackName );
		} else if ( replaceInData ) {
			s.data = data.replace( rjsonp, "$1" + callbackName );
		} else if ( hasCallback ) {
			s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});
var xhrCallbacks,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( e ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback, 0 );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	}, 0 );
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		index = 0,
		tweenerIndex = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end, easing ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			anim: animation,
			queue: animation.opts.queue,
			elem: elem
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.done(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery.removeData( elem, "fxshow", true );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing any value as a 4th parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, false, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ||
			// special check for .toggle( handler, handler, ... )
			( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations resolve immediately
				if ( empty ) {
					anim.stop( true );
				}
			};

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	if ( (body = doc.body) === elem ) {
		return jQuery.offset.bodyOffset( elem );
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== "undefined" ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	clientTop  = docElem.clientTop  || body.clientTop  || 0;
	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	scrollTop  = win.pageYOffset || docElem.scrollTop;
	scrollLeft = win.pageXOffset || docElem.scrollLeft;
	return {
		top: box.top  + scrollTop  - clientTop,
		left: box.left + scrollLeft - clientLeft
	};
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.body;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, value, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

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
    var Ctor = function(){};

    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.8.2';

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1: return function(value) {
                return func.call(context, value);
            };
            case 2: return function(value, other) {
                return func.call(context, value, other);
            };
            case 3: return function(value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function(accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function() {
            return func.apply(context, arguments);
        };
    };

    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result 鈥? either
    // identity, an arbitrary callback, a property matcher, or a property accessor.
    var cb = function(value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };
    _.iteratee = function(value, context) {
        return cb(value, context, Infinity);
    };

    // An internal function for creating assigner functions.
    var createAssigner = function(keysFunc, undefinedOnly) {
        return function(obj) {
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
    var baseCreate = function(prototype) {
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
    var isArrayLike = function(collection) {
        var length = collection != null && collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function(obj, iteratee, context) {
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
    _.map = _.collect = function(obj, iteratee, context) {
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
    function createReduce(dir) {
        // Optimized iterator function as using arguments.length
        // in the main function will deoptimize the, see #1991.
        function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        }

        return function(obj, iteratee, memo, context) {
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
    _.find = _.detect = function(obj, predicate, context) {
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
    _.filter = _.select = function(obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function(value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function(obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function(obj, predicate, context) {
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
    _.some = _.any = function(obj, predicate, context) {
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
    _.contains = _.includes = _.include = function(obj, target, fromIndex) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        return _.indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function(obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
        });
    };

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
        return _.map(obj, _.property(key));
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function(obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function(obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    // Return the maximum element (or element-based computation).
    _.max = function(obj, iteratee, context) {
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
            _.each(obj, function(value, index, list) {
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
    _.min = function(obj, iteratee, context) {
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
            _.each(obj, function(value, index, list) {
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
    _.shuffle = function(obj) {
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
    _.sample = function(obj, n, guard) {
        if (n == null || guard) {
            if (!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    };

    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function(value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            };
        }).sort(function(left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function(behavior) {
        return function(obj, iteratee, context) {
            var result = {};
            iteratee = cb(iteratee, context);
            _.each(obj, function(value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            });
            return result;
        };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function(result, value, key) {
        if (_.has(result, key)) result[key].push(value); else result[key] = [value];
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function(result, value, key) {
        result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function(result, value, key) {
        if (_.has(result, key)) result[key]++; else result[key] = 1;
    });

    // Safely create a real, live array from anything iterable.
    _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function(obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var pass = [], fail = [];
        _.each(obj, function(value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value);
        });
        return [pass, fail];
    };

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) return array[0];
        return _.initial(array, array.length - n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.
    _.initial = function(array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.
    _.last = function(array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array.
    _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function(array) {
        return _.filter(array, _.identity);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, strict, startIndex) {
        var output = [], idx = 0;
        for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                //flatten current level of array or arguments object
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
    _.flatten = function(array, shallow) {
        return flatten(array, shallow, false);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
        return _.difference(array, slice.call(arguments, 1));
    };

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iteratee, context) {
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
    _.union = function() {
        return _.uniq(flatten(arguments, true, true));
    };

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function(array) {
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
    _.difference = function(array) {
        var rest = flatten(arguments, true, true, 1);
        return _.filter(array, function(value){
            return !_.contains(rest, value);
        });
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function() {
        return _.unzip(arguments);
    };

    // Complement of _.zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices
    _.unzip = function(array) {
        var length = array && _.max(array, 'length').length || 0;
        var result = Array(length);

        for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
        }
        return result;
    };

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function(list, values) {
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
    _.indexOf = function(array, item, isSorted) {
        var i = 0, length = array && array.length;
        if (typeof isSorted == 'number') {
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

    _.lastIndexOf = function(array, item, from) {
        var idx = array ? array.length : 0;
        if (typeof from == 'number') {
            idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
        }
        if (item !== item) {
            return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
        }
        while (--idx >= 0) if (array[idx] === item) return idx;
        return -1;
    };

    // Generator function to create the findIndex and findLastIndex functions
    function createIndexFinder(dir) {
        return function(array, predicate, context) {
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
    _.sortedIndex = function(array, obj, iteratee, context) {
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
    _.range = function(start, stop, step) {
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
    var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
    };

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function(func, context) {
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        var args = slice.call(arguments, 2);
        var bound = function() {
            return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
        };
        return bound;
    };

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder, allowing any combination of arguments to be pre-filled.
    _.partial = function(func) {
        var boundArgs = slice.call(arguments, 1);
        var bound = function() {
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
    _.bindAll = function(obj) {
        var i, length = arguments.length, key;
        if (length <= 1) throw new Error('bindAll must be passed function names');
        for (i = 1; i < length; i++) {
            key = arguments[i];
            obj[key] = _.bind(obj[key], obj);
        }
        return obj;
    };

    // Memoize an expensive function by storing its results.
    _.memoize = function(func, hasher) {
        var memoize = function(key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function(func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function(){
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
    _.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
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
    _.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
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

        return function() {
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
    _.wrap = function(func, wrapper) {
        return _.partial(wrapper, func);
    };

    // Returns a negated version of the passed-in predicate.
    _.negate = function(predicate) {
        return function() {
            return !predicate.apply(this, arguments);
        };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function() {
        var args = arguments;
        var start = args.length - 1;
        return function() {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
        };
    };

    // Returns a function that will only be executed on and after the Nth call.
    _.after = function(times, func) {
        return function() {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // Returns a function that will only be executed up to (but not including) the Nth call.
    _.before = function(times, func) {
        var memo;
        return function() {
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
    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

        // Constructor is a special case.
        var prop = 'constructor';
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
    _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // Retrieve all the property names of an object.
    _.allKeys = function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // Retrieve the values of an object's properties.
    _.values = function(obj) {
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
    _.mapObject = function(obj, iteratee, context) {
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
    _.pairs = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function(obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function(obj) {
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
    _.findKey = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
        }
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(object, oiteratee, context) {
        var result = {}, obj = object, iteratee, keys;
        if (obj == null) return result;
        if (_.isFunction(oiteratee)) {
            keys = _.allKeys(obj);
            iteratee = optimizeCb(oiteratee, context);
        } else {
            keys = flatten(arguments, false, false, 1);
            iteratee = function(value, key, obj) { return key in obj; };
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
    _.omit = function(obj, iteratee, context) {
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
        } else {
            var keys = _.map(flatten(arguments, false, false, 1), String);
            iteratee = function(value, key) {
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
    _.create = function(prototype, props) {
        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    // Returns whether an object has a given set of `key:value` pairs.
    _.isMatch = function(object, attrs) {
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
    var eq = function(a, b, aStack, bStack) {
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
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                _.isFunction(bCtor) && bCtor instanceof bCtor)
                && ('constructor' in a && 'constructor' in b)) {
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
    _.isEqual = function(a, b) {
        return eq(a, b);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        return _.keys(obj).length === 0;
    };

    // Is a given value a DOM element?
    _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };

    // Is a given variable an object?
    _.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function(obj) {
            return _.has(obj, 'callee');
        };
    }

    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), and in Safari 8 (#1929).
    if (typeof /./ != 'function' && typeof Int8Array != 'object') {
        _.isFunction = function(obj) {
            return typeof obj == 'function' || false;
        };
    }

    // Is a given object a finite number?
    _.isFinite = function(obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function(obj) {
        return _.isNumber(obj) && obj !== +obj;
    };

    // Is a given value a boolean?
    _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    // Is a given value equal to null?
    _.isNull = function(obj) {
        return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function(obj) {
        return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
    };

    // Keep the identity function around for default iteratees.
    _.identity = function(value) {
        return value;
    };

    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function(value) {
        return function() {
            return value;
        };
    };

    _.noop = function(){};

    _.property = function(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // Generates a function for a given object that returns a given property.
    _.propertyOf = function(obj) {
        return obj == null ? function(){} : function(key) {
            return obj[key];
        };
    };

    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    _.matcher = _.matches = function(attrs) {
        attrs = _.extendOwn({}, attrs);
        return function(obj) {
            return _.isMatch(obj, attrs);
        };
    };

    // Run a function **n** times.
    _.times = function(n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function() {
        return new Date().getTime();
    };

    // List of HTML entities for escaping.
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function(map) {
        var escaper = function(match) {
            return map[match];
        };
        // Regexes for identifying a key that needs to be escaped
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function(string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function(object, property, fallback) {
        var value = object == null ? void 0 : object[property];
        if (value === void 0) {
            value = fallback;
        }
        return _.isFunction(value) ? value.call(object) : value;
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape      : /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function(match) {
        return '\\' + escapes[match];
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function(text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
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
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';

        try {
            var render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        var template = function(data) {
            return render.call(this, data, _);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function(obj) {
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
    var result = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result(this, func.apply(_, args));
            };
        });
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
            return result(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            return result(this, method.apply(this._wrapped, arguments));
        };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function() {
        return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function() {
        return '' + this._wrapped;
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function() {
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
 * MVC工厂
 * guy
 * @class BI.Factory
 */
BI.Factory = {
    parsePath: function parsePath (path) {
        var segments = path.split('.');
        return function (obj) {
            for (var i = 0; i < segments.length; i++) {
                if (!obj) {
                    return;
                }
                obj = obj[segments[i]];
            }
            return obj;
        }
    },
    createView : function(url, viewFunc, mData, vData, context){
        var modelFunc = viewFunc.replace(/View/, "Model");
        modelFunc = this.parsePath(modelFunc)(window);
        if(!_.isFunction(modelFunc)){
            modelFunc = BI.Model;
        }
//        try {
            var model = new (modelFunc)(_.extend({}, mData, {
                    parent: context && context.model,
                    rootURL: url
            }), {silent: true});
//        } catch (e) {
//
//        }
//        try {
        var view = new (eval(viewFunc))(_.extend({}, vData, {
            model: model,
            parent: context,
            rootURL: url
        }));
//        } catch (e) {
//
//        }
        return view;
    }
};(function(root, factory) {
        root.BI = factory(root, root.BI || {}, root._, (root.jQuery || root.$));
}(this, function(root, BI, _, $) {

    var previousBI = root.BI;

    // Create local references to array methods we'll want to use later.
    var array = [];
    var slice = array.slice;

    // Current version of the library. Keep in sync with `package.json`.
    BI.VERSION = '1.0.0';

    // For BI's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
    // the `$` variable.
    BI.$ = $;

    // Runs BI.js in *noConflict* mode, returning the `BI` variable
    // to its previous owner. Returns a reference to this BI object.
    BI.noConflict = function() {
        root.BI = previousBI;
        return this;
    };

    // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
    // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
    // set a `X-Http-Method-Override` header.
    BI.emulateHTTP = true;

    // Turn on `emulateJSON` to support legacy servers that can't deal with direct
    // `application/json` requests ... this will encode the body as
    // `application/x-www-form-urlencoded` instead and will send the model in a
    // form param named `model`.
    BI.emulateJSON = true;

    // BI.Events
    // ---------------

    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, BI.Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    var Events = BI.Events = {

        // Bind an event to a `callback` function. Passing `"all"` will bind
        // the callback to all events fired.
        on: function(name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({callback: callback, context: context, ctx: context || this});
            return this;
        },

        // Bind an event to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once: function(name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function() {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off: function(name, callback, context) {
            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;

            // Remove all callbacks for all events.
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }

            var names = name ? [name] : _.keys(this._events);
            for (var i = 0, length = names.length; i < length; i++) {
                name = names[i];

                // Bail out if there are no events stored.
                var events = this._events[name];
                if (!events) continue;

                // Remove all callbacks for this event.
                if (!callback && !context) {
                    delete this._events[name];
                    continue;
                }

                // Find any remaining events.
                var remaining = [];
                for (var j = 0, k = events.length; j < k; j++) {
                    var event = events[j];
                    if (
                        callback && callback !== event.callback &&
                        callback !== event.callback._callback ||
                        context && context !== event.context
                        ) {
                        remaining.push(event);
                    }
                }

                // Replace events if there are any remaining.  Otherwise, clean up.
                if (remaining.length) {
                    this._events[name] = remaining;
                } else {
                    delete this._events[name];
                }
            }

            return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function(name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) triggerEvents(events, args);
            if (allEvents) triggerEvents(allEvents, arguments);
            return this;
        },

        // Inversion-of-control versions of `on` and `once`. Tell *this* object to
        // listen to an event in another object ... keeping track of what it's
        // listening to.
        listenTo: function(obj, name, callback) {
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
            listeningTo[id] = obj;
            if (!callback && typeof name === 'object') callback = this;
            obj.on(name, callback, this);
            return this;
        },

        listenToOnce: function(obj, name, callback) {
            if (typeof name === 'object') {
                for (var event in name) this.listenToOnce(obj, event, name[event]);
                return this;
            }
            if (eventSplitter.test(name)) {
                var names = name.split(eventSplitter);
                for (var i = 0, length = names.length; i < length; i++) {
                    this.listenToOnce(obj, names[i], callback);
                }
                return this;
            }
            if (!callback) return this;
            var once = _.once(function() {
                this.stopListening(obj, name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.listenTo(obj, name, once);
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function(obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) return this;
            var remove = !name && !callback;
            if (!callback && typeof name === 'object') callback = this;
            if (obj) (listeningTo = {})[obj._listenId] = obj;
            for (var id in listeningTo) {
                obj = listeningTo[id];
                obj.off(name, callback, this);
                if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
            }
            return this;
        }

    };

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function(obj, action, name, rest) {
        if (!name) return true;

        // Handle event maps.
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }

        // Handle space separated event names.
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, length = names.length; i < length; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }

        return true;
    };

    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // BI events have 3 arguments).
    var triggerEvents = function(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
            case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
            case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
            case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
            case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
            default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
        }
    };

    // Aliases for backwards compatibility.
    Events.bind   = Events.on;
    Events.unbind = Events.off;

    // Allow the `BI` object to serve as a global event bus, for folks who
    // want global "pubsub" in a convenient place.
    _.extend(BI, Events);

    // BI.M
    // --------------

    // BI **Models** are the basic data object in the framework --
    // frequently representing a row in a table in a database on your server.
    // A discrete chunk of data and a bunch of useful, related methods for
    // performing computations and transformations on that data.

    // Create a new model with the specified attributes. A client id (`cid`)
    // is automatically generated and assigned for you.
    var M = BI.M = function(attributes, options) {
        var attrs = attributes || {};
        options = options || {};
        this.cid = _.uniqueId('c');
        this.attributes = {};
        if (options.collection) this.collection = options.collection;
        if (options.parse) attrs = this.parse(attrs, options) || {};
        this.options = attrs = _.defaults({}, attrs, _.result(this, '_defaultConfig'));
        _.extend(this, _.pick(this.options, modelOptions));
        this.set(attrs, options);
        this.changed = {};
        this._init.apply(this, arguments);
    };

    var modelOptions = ['rootURL', 'parent', 'data', 'id'];

    // Attach all inheritable methods to the M prototype.
    _.extend(M.prototype, Events, {

        // A hash of attributes whose current and previous value differ.
        changed: null,

        // The value returned during the last failed validation.
        validationError: null,

        // The default name for the JSON `id` attribute is `"id"`. MongoDB and
        // CouchDB users may want to set this to `"_id"`.
        idAttribute: 'ID',

        _defaultConfig: function(){return {}},
        // _init is an empty function by default. Override it with your own
        // initialization logic.
        _init: function(){},

        // Return a copy of the model's `attributes` object.
        toJSON: function(options) {
            return _.clone(this.attributes);
        },

        // Proxy `BI.sync` by default -- but override this if you need
        // custom syncing semantics for *this* particular model.
        sync: function() {
            return BI.sync.apply(this, arguments);
        },

        // Get the value of an attribute.
        get: function(attr) {
            return this.attributes[attr];
        },

        // Get the HTML-escaped value of an attribute.
        escape: function(attr) {
            return _.escape(this.get(attr));
        },

        // Returns `true` if the attribute contains a value that is not null
        // or undefined.
        has: function(attr) {
            return _.has(this.attributes, attr);
        },

        // Special-cased proxy to underscore's `_.matches` method.
        matches: function(attrs) {
            var keys = _.keys(attrs), length = keys.length;
            var obj = Object(this.attributes);
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (!_.isEqual(attrs[key], obj[key]) || !(key in obj)) return false;
            }
            return true;
        },

        // Set a hash of model attributes on the object, firing `"change"`. This is
        // the core primitive operation of a model, updating the data and notifying
        // anyone who needs to know about the change in state. The heart of the beast.
        set: function(key, val, options) {
            var attr, attrs, unset, changes, silent, changing, changed, prev, current;
            if (key == null) return this;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options || (options = {});

            // Run validation.
            if (!this._validate(attrs, options)) return false;

            // Extract attributes and options.
            unset           = options.unset;
            silent          = options.silent;
            changes         = [];
            changing        = this._changing;
            this._changing  = true;

            if (!changing) {
                this._previousAttributes = _.clone(this.attributes);
                this.changed = {};
            }
            current = this.attributes, prev = this._previousAttributes;

            // Check for changes of `id`.
            if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

            // For each `set` attribute, update or delete the current value.
            for (attr in attrs) {
                val = attrs[attr];
                if (!_.isEqual(current[attr], val)) changes.push(attr);
                if (!_.isEqual(prev[attr], val)) {
                    this.changed[attr] = val;
                } else {
                    delete this.changed[attr];
                }
                unset ? delete current[attr] : current[attr] = val;
            }

            // Trigger all relevant attribute changes.
            if (!silent) {
                if (changes.length) this._pending = options;
                for (var i = 0, length = changes.length; i < length; i++) {
                    this.trigger('change:' + changes[i], this, current[changes[i]], options);
                }
            }

            // You might be wondering why there's a `while` loop here. Changes can
            // be recursively nested within `"change"` events.
            if (changing) return this;
            changed = BI.clone(this.changed);
            if (!silent) {
                while (this._pending) {
                    options = this._pending;
                    this._pending = false;
                    this.trigger('change', changed, prev, this, options);
                }
            }
            this._pending = false;
            this._changing = false;
            if (!silent && changes.length) this.trigger("changed", changed, prev, this, options);
            return this;
        },

        // Remove an attribute from the model, firing `"change"`. `unset` is a noop
        // if the attribute doesn't exist.
        unset: function(attr, options) {
            return this.set(attr, void 0, _.extend({}, options, {unset: true}));
        },

        // Clear all attributes on the model, firing `"change"`.
        clear: function(options) {
            var attrs = {};
            for (var key in this.attributes) attrs[key] = void 0;
            return this.set(attrs, _.extend({}, options, {unset: true}));
        },

        // Determine if the model has changed since the last `"change"` event.
        // If you specify an attribute name, determine if that attribute has changed.
        hasChanged: function(attr) {
            if (attr == null) return !_.isEmpty(this.changed);
            return _.has(this.changed, attr);
        },

        // Return an object containing all the attributes that have changed, or
        // false if there are no changed attributes. Useful for determining what
        // parts of a view need to be updated and/or what attributes need to be
        // persisted to the server. Unset attributes will be set to undefined.
        // You can also pass an attributes object to diff against the model,
        // determining if there *would be* a change.
        changedAttributes: function(diff) {
            if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
            var val, changed = false;
            var old = this._changing ? this._previousAttributes : this.attributes;
            for (var attr in diff) {
                if (_.isEqual(old[attr], (val = diff[attr]))) continue;
                (changed || (changed = {}))[attr] = val;
            }
            return changed;
        },

        // Get the previous value of an attribute, recorded at the time the last
        // `"change"` event was fired.
        previous: function(attr) {
            if (attr == null || !this._previousAttributes) return null;
            return this._previousAttributes[attr];
        },

        // Get all of the attributes of the model at the time of the previous
        // `"change"` event.
        previousAttributes: function() {
            return _.clone(this._previousAttributes);
        },

        // Fetch the model from the server. If the server's representation of the
        // model differs from its current attributes, they will be overridden,
        // triggering a `"change"` event.
        fetch: function(options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function(resp) {
                if(!options.noset) {
                    if (!model.set(model.parse(resp, options), options)) return false;
                }
                if (success) success(resp, model, options);
                model.trigger('sync', resp, model, options).trigger('read', resp, model, options);
            };
            wrapError(this, options);
            return this.sync('read', this, options);
        },

        // Set a hash of model attributes, and sync the model to the server.
        // If the server returns an attributes hash that differs, the model's
        // state will be `set` again.
        save: function(key, val, options) {
            var attrs, method, xhr, attributes = this.attributes;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (key == null || typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options = _.extend({validate: true}, options);

            // If we're not waiting and attributes exist, save acts as
            // `set(attr).save(null, opts)` with validation. Otherwise, check if
            // the model will be valid when the attributes, if any, are set.
            if (attrs && !options.wait) {
                if (!this.set(attrs, options)) return false;
            } else {
                if (!this._validate(attrs, options)) return false;
            }

            // Set temporary attributes if `{wait: true}`.
            if (attrs && options.wait) {
                this.attributes = _.extend({}, attributes, attrs);
            }

            // After a successful server-side save, the client is (optionally)
            // updated with the server-side state.
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function(resp) {
                // Ensure attributes are restored during synchronous saves.
                model.attributes = attributes;
                var serverAttrs = model.parse(resp, options);
                if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
                if (_.isObject(serverAttrs) && !options.noset && !model.set(serverAttrs, options)) {
                    return false;
                }
                if (success) success(resp, model, options);
                model.trigger('sync', resp, model, options)
                    .trigger((options.patch ? 'patch' : 'update'), resp, model, options);
            };
            wrapError(this, options);

            method = /**this.isNew() ? 'create' :**/ (options.patch ? 'patch' : 'update');
            if (method === 'patch' && !options.attrs) options.attrs = attrs;
            xhr = this.sync(method, this, options);

            // Restore attributes.
            if (attrs && options.wait) this.attributes = attributes;

            return xhr;
        },

        // Destroy this model on the server if it was already persisted.
        // Optimistically removes the model from its collection, if it has one.
        // If `wait: true` is passed, waits for the server to respond before removal.
        destroy: function(options) {
            options = options ? _.clone(options) : {};
            var model = this;
            var success = options.success;

            var destroy = function() {
                model.stopListening();
                model.trigger('destroy', model.collection, model, options);
            };

            options.success = function(resp) {
                if (options.wait || model.isNew()) destroy();
                if (success) success(resp, model, options);
                if (!model.isNew()) model.trigger('sync', resp, model, options).trigger('delete', resp, model, options);
            };

            if (this.isNew()) {
                options.success();
                return false;
            }
            wrapError(this, options);

            var xhr = this.sync('delete', this, options);
            if (!options.wait) destroy();
            return xhr;
        },

        // Default URL for the model's representation on the server -- if you're
        // using BI's restful methods, override this to change the endpoint
        // that will be called.
        url: function() {
            var base =
                _.result(this.collection, 'url');
            if (this.isNew()) return base;
            return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
        },

        // **parse** converts a response into the hash of attributes to be `set` on
        // the model. The default implementation is just to pass the response along.
        parse: function(resp, options) {
            return resp;
        },

        // Create a new model with identical attributes to this one.
        clone: function() {
            return new this.constructor(this.attributes);
        },

        // A model is new if it has never been saved to the server, and lacks an id.
        isNew: function() {
            return !this.has(this.idAttribute);
        },

        // Check if the model is currently in a valid state.
        isValid: function(options) {
            return this._validate({}, _.extend(options || {}, { validate: true }));
        },

        // Run validation against the next complete set of model attributes,
        // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
        _validate: function(attrs, options) {
            if (!options.validate || !this.validate) return true;
            attrs = _.extend({}, this.attributes, attrs);
            var error = this.validationError = this.validate(attrs, options) || null;
            if (!error) return true;
            this.trigger('invalid', error, this, _.extend(options, {validationError: error}));
            return false;
        }

    });

    // Underscore methods that we want to implement on the M.
    var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit', 'chain', 'isEmpty'];

    // Mix in each Underscore method as a proxy to `M#attributes`.
    _.each(modelMethods, function(method) {
        if (!_[method]) return;
        M.prototype[method] = function() {
            var args = slice.call(arguments);
            args.unshift(this.attributes);
            return _[method].apply(_, args);
        };
    });

    // BI.Collection
    // -------------------

    // If models tend to represent a single row of data, a BI Collection is
    // more analogous to a table full of data ... or a small slice or page of that
    // table, or a collection of rows that belong together for a particular reason
    // -- all of the messages in this particular folder, all of the documents
    // belonging to this particular author, and so on. Collections maintain
    // indexes of their models, both in order, and for lookup by `id`.

    // Create a new **Collection**, perhaps to contain a specific type of `model`.
    // If a `comparator` is specified, the Collection will maintain
    // its models in sort order, as they're added and removed.
    var Collection = BI.Collection = function(models, options) {
        this.options = options = options || {};
        if (options.model) this.model = options.model;
        if (options.comparator !== void 0) this.comparator = options.comparator;
        this._reset();
        this._init.apply(this, arguments);
        if (models) this.reset(models, _.extend({silent: true}, options));
    };

    // Default options for `Collection#set`.
    var setOptions = {add: true, remove: true, merge: true};
    var addOptions = {add: true, remove: false};

    // Define the Collection's inheritable methods.
    _.extend(Collection.prototype, Events, {

        // The default model for a collection is just a **BI.M**.
        // This should be overridden in most cases.
        model: M,

        // _init is an empty function by default. Override it with your own
        // initialization logic.
        _init: function(){},

        // The JSON representation of a Collection is an array of the
        // models' attributes.
        toJSON: function(options) {
            return this.map(function(model){ return model.toJSON(options); });
        },

        // Proxy `BI.sync` by default.
        sync: function() {
            return BI.sync.apply(this, arguments);
        },

        // Add a model, or list of models to the set.
        add: function(models, options) {
            return this.set(models, _.extend({merge: false}, options, addOptions));
        },

        // Remove a model, or a list of models from the set.
        remove: function(models, options) {
            var singular = !_.isArray(models);
            models = singular ? [models] : _.clone(models);
            options || (options = {});
            for (var i = 0, length = models.length; i < length; i++) {
                var model = models[i] = this.get(models[i]);
                if (!model) continue;
                var id = this.modelId(model.attributes);
                if (id != null) delete this._byId[id];
                delete this._byId[model.cid];
                var index = this.indexOf(model);
                this.models.splice(index, 1);
                this.length--;
                if (!options.silent) {
                    options.index = index;
                    model.trigger('remove', model, this, options);
                }
                this._removeReference(model, options);
            }
            return singular ? models[0] : models;
        },

        // Update a collection by `set`-ing a new list of models, adding new ones,
        // removing models that are no longer present, and merging models that
        // already exist in the collection, as necessary. Similar to **M#set**,
        // the core operation for updating the data contained by the collection.
        set: function(models, options) {
            options = _.defaults({}, options, setOptions);
            if (options.parse) models = this.parse(models, options);
            var singular = !_.isArray(models);
            models = singular ? (models ? [models] : []) : models.slice();
            var id, model, attrs, existing, sort;
            var at = options.at;
            if (at != null) at = +at;
            if (at < 0) at += this.length + 1;
            var sortable = this.comparator && (at == null) && options.sort !== false;
            var sortAttr = _.isString(this.comparator) ? this.comparator : null;
            var toAdd = [], toRemove = [], modelMap = {};
            var add = options.add, merge = options.merge, remove = options.remove;
            var order = !sortable && add && remove ? [] : false;
            var orderChanged = false;

            // Turn bare objects into model references, and prevent invalid models
            // from being added.
            for (var i = 0, length = models.length; i < length; i++) {
                attrs = models[i];

                // If a duplicate is found, prevent it from being added and
                // optionally merge it into the existing model.
                if (existing = this.get(attrs)) {
                    if (remove) modelMap[existing.cid] = true;
                    if (merge && attrs !== existing) {
                        attrs = this._isModel(attrs) ? attrs.attributes : attrs;
                        if (options.parse) attrs = existing.parse(attrs, options);
                        existing.set(attrs, options);
                        if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
                    }
                    models[i] = existing;

                    // If this is a new, valid model, push it to the `toAdd` list.
                } else if (add) {
                    model = models[i] = this._prepareModel(attrs, options);
                    if (!model) continue;
                    toAdd.push(model);
                    this._addReference(model, options);
                }

                // Do not add multiple models with the same `id`.
                model = existing || model;
                if (!model) continue;
                id = this.modelId(model.attributes);
                if (order && (model.isNew() || !modelMap[id])) {
                    order.push(model);

                    // Check to see if this is actually a new model at this index.
                    orderChanged = orderChanged || !this.models[i] || model.cid !== this.models[i].cid;
                }

                modelMap[id] = true;
            }

            // Remove nonexistent models if appropriate.
            if (remove) {
                for (var i = 0, length = this.length; i < length; i++) {
                    if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
                }
                if (toRemove.length) this.remove(toRemove, options);
            }

            // See if sorting is needed, update `length` and splice in new models.
            if (toAdd.length || orderChanged) {
                if (sortable) sort = true;
                this.length += toAdd.length;
                if (at != null) {
                    for (var i = 0, length = toAdd.length; i < length; i++) {
                        this.models.splice(at + i, 0, toAdd[i]);
                    }
                } else {
                    if (order) this.models.length = 0;
                    var orderedModels = order || toAdd;
                    for (var i = 0, length = orderedModels.length; i < length; i++) {
                        this.models.push(orderedModels[i]);
                    }
                }
            }

            // Silently sort the collection if appropriate.
            if (sort) this.sort({silent: true});

            // Unless silenced, it's time to fire all appropriate add/sort events.
            if (!options.silent) {
                var addOpts = at != null ? _.clone(options) : options;
                for (var i = 0, length = toAdd.length; i < length; i++) {
                    if (at != null) addOpts.index = at + i;
                    (model = toAdd[i]).trigger('add', model, this, addOpts);
                }
                if (sort || orderChanged) this.trigger('sort', this, options);
            }

            // Return the added (or merged) model (or models).
            return singular ? models[0] : models;
        },

        // When you have more items than you want to add or remove individually,
        // you can reset the entire set with a new list of models, without firing
        // any granular `add` or `remove` events. Fires `reset` when finished.
        // Useful for bulk operations and optimizations.
        reset: function(models, options) {
            options = options ? _.clone(options) : {};
            for (var i = 0, length = this.models.length; i < length; i++) {
                this._removeReference(this.models[i], options);
            }
            options.previousModels = this.models;
            this._reset();
            models = this.add(models, _.extend({silent: true}, options));
            if (!options.silent) this.trigger('reset', this, options);
            return models;
        },

        // Add a model to the end of the collection.
        push: function(model, options) {
            return this.add(model, _.extend({at: this.length}, options));
        },

        // Remove a model from the end of the collection.
        pop: function(options) {
            var model = this.at(this.length - 1);
            this.remove(model, options);
            return model;
        },

        // Add a model to the beginning of the collection.
        unshift: function(model, options) {
            return this.add(model, _.extend({at: 0}, options));
        },

        // Remove a model from the beginning of the collection.
        shift: function(options) {
            var model = this.at(0);
            this.remove(model, options);
            return model;
        },

        // Slice out a sub-array of models from the collection.
        slice: function() {
            return slice.apply(this.models, arguments);
        },

        // Get a model from the set by id.
        get: function(obj) {
            if (obj == null) return void 0;
            var id = this.modelId(this._isModel(obj) ? obj.attributes : obj);
            return this._byId[obj] || this._byId[id] || this._byId[obj.cid];
        },

        // Get the model at the given index.
        at: function(index) {
            if (index < 0) index += this.length;
            return this.models[index];
        },

        // Return models with matching attributes. Useful for simple cases of
        // `filter`.
        where: function(attrs, first) {
            var matches = _.matches(attrs);
            return this[first ? 'find' : 'filter'](function(model) {
                return matches(model.attributes);
            });
        },

        // Return the first model with matching attributes. Useful for simple cases
        // of `find`.
        findWhere: function(attrs) {
            return this.where(attrs, true);
        },

        // Force the collection to re-sort itself. You don't need to call this under
        // normal circumstances, as the set will maintain sort order as each item
        // is added.
        sort: function(options) {
            if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
            options || (options = {});

            // Run sort based on type of `comparator`.
            if (_.isString(this.comparator) || this.comparator.length === 1) {
                this.models = this.sortBy(this.comparator, this);
            } else {
                this.models.sort(_.bind(this.comparator, this));
            }

            if (!options.silent) this.trigger('sort', this, options);
            return this;
        },

        // Pluck an attribute from each model in the collection.
        pluck: function(attr) {
            return _.invoke(this.models, 'get', attr);
        },

        // Fetch the default set of models for this collection, resetting the
        // collection when they arrive. If `reset: true` is passed, the response
        // data will be passed through the `reset` method instead of `set`.
        fetch: function(options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var success = options.success;
            var collection = this;
            options.success = function(resp) {
                var method = options.reset ? 'reset' : 'set';
                collection[method](resp, options);
                if (success) success(collection, resp, options);
                collection.trigger('sync', collection, resp, options);
            };
            wrapError(this, options);
            return this.sync('read', this, options);
        },

        // Create a new instance of a model in this collection. Add the model to the
        // collection immediately, unless `wait: true` is passed, in which case we
        // wait for the server to agree.
        create: function(model, options) {
            options = options ? _.clone(options) : {};
            if (!(model = this._prepareModel(model, options))) return false;
            if (!options.wait) this.add(model, options);
            var collection = this;
            var success = options.success;
            options.success = function(model, resp) {
                if (options.wait) collection.add(model, options);
                if (success) success(model, resp, options);
            };
            model.save(null, options);
            return model;
        },

        // **parse** converts a response into a list of models to be added to the
        // collection. The default implementation is just to pass it through.
        parse: function(resp, options) {
            return resp;
        },

        // Create a new collection with an identical list of models as this one.
        clone: function() {
            return new this.constructor(this.models, {
                model: this.model,
                comparator: this.comparator
            });
        },

        // Define how to uniquely identify models in the collection.
        modelId: function (attrs) {
            return attrs[this.model.prototype.idAttribute || 'id'];
        },

        // Private method to reset all internal state. Called when the collection
        // is first _initd or reset.
        _reset: function() {
            this.length = 0;
            this.models = [];
            this._byId  = {};
        },

        // Prepare a hash of attributes (or other model) to be added to this
        // collection.
        _prepareModel: function(attrs, options) {
            if (this._isModel(attrs)) {
                if (!attrs.collection) attrs.collection = this;
                return attrs;
            }
            options = options ? _.clone(options) : {};
            options.collection = this;
            var model = new this.model(attrs, options);
            if (!model.validationError) return model;
            this.trigger('invalid', this, model.validationError, options);
            return false;
        },

        // Method for checking whether an object should be considered a model for
        // the purposes of adding to the collection.
        _isModel: function (model) {
            return model instanceof M;
        },

        // Internal method to create a model's ties to a collection.
        _addReference: function(model, options) {
            this._byId[model.cid] = model;
            var id = this.modelId(model.attributes);
            if (id != null) this._byId[id] = model;
            model.on('all', this._onModelEvent, this);
        },

        // Internal method to sever a model's ties to a collection.
        _removeReference: function(model, options) {
            if (this === model.collection) delete model.collection;
            model.off('all', this._onModelEvent, this);
        },

        // Internal method called every time a model in the set fires an event.
        // Sets need to update their indexes when models change ids. All other
        // events simply proxy through. "add" and "remove" events that originate
        // in other collections are ignored.
        _onModelEvent: function(event, model, collection, options) {
            if ((event === 'add' || event === 'remove') && collection !== this) return;
            if (event === 'destroy') this.remove(model, options);
            if (event === 'change') {
                var prevId = this.modelId(model.previousAttributes());
                var id = this.modelId(model.attributes);
                if (prevId !== id) {
                    if (prevId != null) delete this._byId[prevId];
                    if (id != null) this._byId[id] = model;
                }
            }
            this.trigger.apply(this, arguments);
        }

    });

    // Underscore methods that we want to implement on the Collection.
    // 90% of the core usefulness of BI Collections is actually implemented
    // right here:
    var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
        'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
        'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
        'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
        'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
        'lastIndexOf', 'isEmpty', 'chain', 'sample', 'partition'];

    // Mix in each Underscore method as a proxy to `Collection#models`.
    _.each(methods, function(method) {
        if (!_[method]) return;
        Collection.prototype[method] = function() {
            var args = slice.call(arguments);
            args.unshift(this.models);
            return _[method].apply(_, args);
        };
    });

    // Underscore methods that take a property name as an argument.
    var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

    // Use attributes instead of properties.
    _.each(attributeMethods, function(method) {
        if (!_[method]) return;
        Collection.prototype[method] = function(value, context) {
            var iterator = _.isFunction(value) ? value : function(model) {
                return model.get(value);
            };
            return _[method](this.models, iterator, context);
        };
    });

    // BI.V
    // -------------

    // BI Views are almost more convention than they are actual code. A V
    // is simply a JavaScript object that represents a logical chunk of UI in the
    // DOM. This might be a single item, an entire list, a sidebar or panel, or
    // even the surrounding frame which wraps your whole app. Defining a chunk of
    // UI as a **V** allows you to define your DOM events declaratively, without
    // having to worry about render order ... and makes it easy for the view to
    // react to specific changes in the state of your models.

    // Creating a BI.V creates its initial element outside of the DOM,
    // if an existing element is not provided...
    var V = BI.V = function(options) {
        this.cid = _.uniqueId('view');
        options = options || {};
        this.options = _.defaults(options, _.result(this, '_defaultConfig'));
        _.extend(this, _.pick(this.options, viewOptions));
        this._ensureElement();
        this._init.apply(this, arguments);
    };

    // Cached regex to split keys for `delegate`.
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    // List of view options to be merged as properties.
    var viewOptions = ['rootURL', 'model', 'parent', 'collection', 'element', 'id', 'attributes', 'baseCls', 'tagName', 'events'];

    // Set up all inheritable **BI.V** properties and methods.
    _.extend(V.prototype, Events, {

        // The default `tagName` of a V's element is `"div"`.
        tagName: 'div',

        // jQuery delegate for element lookup, scoped to DOM elements within the
        // current view. This should be preferred to global lookups where possible.
        $: function(selector) {
            return this.$el.find(selector);
        },

        _defaultConfig: function(){return {}},

        // _init is an empty function by default. Override it with your own
        // initialization logic.
        _init: function(){},

        //容器，默认放在this.element上
        _vessel: function(){return this.element},
        // **render** is the core function that your view should override, in order
        // to populate its element (`this.el`), with the appropriate HTML. The
        // convention is for **render** to always return `this`.
        _render: function(vessel) {
            return this;
        },

        // Remove this view by taking the element out of the DOM, and removing any
        // applicable BI.Events listeners.
        remove: function() {
            this._removeElement();
            this.stopListening();
            return this;
        },

        // Remove this view's element from the document and all event listeners
        // attached to it. Exposed for subclasses using an alternative DOM
        // manipulation API.
        _removeElement: function() {
            this.$el.remove();
            if ($.browser.msie === true) {
                this.el.outerHTML = '';
            }
        },

        // Change the view's element (`this.el` property) and re-delegate the
        // view's events on the new element.
        setElement: function(element) {
            this.undelegateEvents();
            this._setElement(element);
            this.$vessel = this._vessel();
            this._render(this.$vessel);
            this.delegateEvents();
            return this;
        },

        setVisible: function(visible){
            this.options.invisible = !visible;
            if (visible){
                this.element.show();
            } else {
                this.element.hide();
            }
        },

        isVisible: function(){
            return !this.options.invisible;
        },

        visible: function(){
            this.setVisible(true);
        },

        invisible: function(){
            this.setVisible(false);
        },

        // Creates the `this.el` and `this.$el` references for this view using the
        // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
        // context or an element. Subclasses can override this to utilize an
        // alternative DOM manipulation API and are only required to set the
        // `this.el` property.
        _setElement: function(el) {
            this.$el = el instanceof BI.$ ? el : BI.$(el);
            this.element = this.$el;
            this.el = this.$el[0];
        },

        // Set callbacks, where `this.events` is a hash of
        //
        // *{"event selector": "callback"}*
        //
        //     {
        //       'mousedown .title':  'edit',
        //       'click .button':     'save',
        //       'click .open':       function(e) { ... }
        //     }
        //
        // pairs. Callbacks will be bound to the view, with `this` set properly.
        // Uses event delegation for efficiency.
        // Omitting the selector binds the event to `this.el`.
        delegateEvents: function(events) {
            if (!(events || (events = _.result(this, 'events')))) return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) method = this[events[key]];
                if (!method) continue;
                var match = key.match(delegateEventSplitter);
                this.delegate(match[1], match[2], _.bind(method, this));
            }
            return this;
        },

        // Add a single event listener to the view's element (or a child element
        // using `selector`). This only works for delegate-able events: not `focus`,
        // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
        delegate: function(eventName, selector, listener) {
            this.$vessel.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        },

        // Clears all callbacks previously bound to the view by `delegateEvents`.
        // You usually don't need to use this, but may wish to if you have multiple
        // BI views attached to the same DOM element.
        undelegateEvents: function() {
            if (this.$vessel) this.$vessel.off('.delegateEvents' + this.cid);
            return this;
        },

        // A finer-grained `undelegateEvents` for removing a single delegated event.
        // `selector` and `listener` are both optional.
        undelegate: function(eventName, selector, listener) {
            this.$vessel.off(eventName + '.delegateEvents' + this.cid, selector, listener);
        },

        // Produces a DOM element to be assigned to your view. Exposed for
        // subclasses using an alternative DOM manipulation API.
        _createElement: function(tagName) {
            return document.createElement(tagName);
        },

        // Ensure that the V has a DOM element to render into.
        // If `this.el` is a string, pass it through `$()`, take the first
        // matching element, and re-assign it to `el`. Otherwise, create
        // an element from the `id`, `className` and `tagName` properties.
        _ensureElement: function() {
            var attrs = _.extend({}, _.result(this, 'attributes'));
            if (this.baseCls) attrs['class'] = _.result(this, 'baseCls');
            if (!this.element) {
                this.setElement(this._createElement(_.result(this, 'tagName')));
            } else {
                this.setElement(_.result(this, 'element'));
            }
            this._setAttributes(attrs);
        },

        // Set attributes from a hash on this view's element.  Exposed for
        // subclasses using an alternative DOM manipulation API.
        _setAttributes: function(attributes) {
            this.$el.attr(attributes);
        }

    });

    // BI.sync
    // -------------

    // Override this function to change the manner in which BI persists
    // models to the server. You will be passed the type of request, and the
    // model in question. By default, makes a RESTful Ajax request
    // to the model's `url()`. Some possible customizations could be:
    //
    // * Use `setTimeout` to batch rapid-fire updates into a single request.
    // * Send up the models as XML instead of JSON.
    // * Persist models via WebSockets instead of Ajax.
    //
    // Turn on `BI.emulateHTTP` in order to send `PUT` and `DELETE` requests
    // as `POST`, with a `_method` parameter containing the true HTTP method,
    // as well as all requests with the body as `application/x-www-form-urlencoded`
    // instead of `application/json` with the model in a param named `model`.
    // Useful when interfacing with server-side languages like **PHP** that make
    // it difficult to read the body of `PUT` requests.
    BI.sync = function(method, model, options) {
        var type = methodMap[method];

        // Default options, unless specified.
        _.defaults(options || (options = {}), {
            emulateHTTP: BI.emulateHTTP,
            emulateJSON: BI.emulateJSON
        });

        // Default JSON-request options.
        var params = {type: type, dataType: 'json'};

        // Ensure that we have a URL.
        if (!options.url) {
            params.url = _.result(model, method+"URL") || _.result(model, 'url');
            if(!params.url){
                return;
            }
        }

        // Ensure that we have the appropriate request data.
        if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
            params.contentType = 'application/json';
            params.data = _.extend({id: model.id}, model.toJSON(options), options.attrs);
        }

        // For older servers, emulate JSON by encoding the request into an HTML-form.
        if (options.emulateJSON) {
            params.contentType = 'application/x-www-form-urlencoded';
            params.data = options.data ? options.data : params.data;
        }

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
            params.type = 'POST';
            if (options.emulateJSON) params.data._method = type;
            var beforeSend = options.beforeSend;
            options.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-HTTP-Method-Override', type);
                if (beforeSend) return beforeSend.apply(this, arguments);
            };
        }

        // Don't process data on a non-GET request.
        if (params.type !== 'GET' && !options.emulateJSON) {
            params.processData = false;
        }

        // Pass along `textStatus` and `errorThrown` from jQuery.
        var error = options.error;
        options.error = function(xhr, textStatus, errorThrown) {
            options.textStatus = textStatus;
            options.errorThrown = errorThrown;
            if (error) error.apply(this, arguments);
        };

        // Make the request, allowing the user to override any Ajax options.
        var xhr = options.xhr = BI.ajax(_.extend(params, options));
        model.trigger('request', xhr, model, options);
        return xhr;
    };

    // Map from CRUD to HTTP for our default `BI.sync` implementation.
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'patch':  'PATCH',
        'delete': 'DELETE',
        'read':   'GET'
    };

    // Set the default implementation of `BI.ajax` to proxy through to `$`.
    // Override this if you'd like to use a different library.
    BI.ajax = $.ajax;

    // BI.Router
    // ---------------

    // Routers map faux-URLs to actions, and fire events when routes are
    // matched. Creating a new one sets its `routes` hash, if not set statically.
    var Router = BI.Router = function(options) {
        options || (options = {});
        if (options.routes) this.routes = options.routes;
        this._bindRoutes();
        this._init.apply(this, arguments);
    };

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /(\(\?)?:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    // Set up all inheritable **BI.Router** properties and methods.
    _.extend(Router.prototype, Events, {

        // _init is an empty function by default. Override it with your own
        // initialization logic.
        _init: function(){},

        // Manually bind a single named route to a callback. For example:
        //
        //     this.route('search/:query/p:num', 'search', function(query, num) {
        //       ...
        //     });
        //
        route: function(route, name, callback) {
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) callback = this[name];
            var router = this;
            BI.history.route(route, function(fragment) {
                var args = router._extractParameters(route, fragment);
                if (router.execute(callback, args, name) !== false) {
                    router.trigger.apply(router, ['route:' + name].concat(args));
                    router.trigger('route', name, args);
                    BI.history.trigger('route', router, name, args);
                }
            });
            return this;
        },

        // Execute a route handler with the provided parameters.  This is an
        // excellent place to do pre-route setup or post-route cleanup.
        execute: function(callback, args, name) {
            if (callback) callback.apply(this, args);
        },

        // Simple proxy to `BI.history` to save a fragment into the history.
        navigate: function(fragment, options) {
            BI.history.navigate(fragment, options);
            return this;
        },

        // Bind all defined routes to `BI.history`. We have to reverse the
        // order of the routes here to support behavior where the most general
        // routes can be defined at the bottom of the route map.
        _bindRoutes: function() {
            if (!this.routes) return;
            this.routes = _.result(this, 'routes');
            var route, routes = _.keys(this.routes);
            while ((route = routes.pop()) != null) {
                this.route(route, this.routes[route]);
            }
        },

        // Convert a route string into a regular expression, suitable for matching
        // against the current location hash.
        _routeToRegExp: function(route) {
            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                })
                .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        },

        // Given a route, and a URL fragment that it matches, return the array of
        // extracted decoded parameters. Empty or unmatched parameters will be
        // treated as `null` to normalize cross-browser behavior.
        _extractParameters: function(route, fragment) {
            var params = route.exec(fragment).slice(1);
            return _.map(params, function(param, i) {
                // Don't decode the search params.
                if (i === params.length - 1) return param || null;
                return param ? decodeURIComponent(param) : null;
            });
        }

    });

    // BI.History
    // ----------------

    // Handles cross-browser history management, based on either
    // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
    // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
    // and URL fragments. If the browser supports neither (old IE, natch),
    // falls back to polling.
    var History = BI.History = function() {
        this.handlers = [];
        _.bindAll(this, 'checkUrl');

        // Ensure that `History` can be used outside of the browser.
        if (typeof window !== 'undefined') {
            this.location = window.location;
            this.history = window.history;
        }
    };

    // Cached regex for stripping a leading hash/slash and trailing space.
    var routeStripper = /^[#\/]|\s+$/g;

    // Cached regex for stripping leading and trailing slashes.
    var rootStripper = /^\/+|\/+$/g;

    // Cached regex for stripping urls of hash.
    var pathStripper = /#.*$/;

    // Has the history handling already been started?
    History.started = false;

    // Set up all inheritable **BI.History** properties and methods.
    _.extend(History.prototype, Events, {

        // The default interval to poll for hash changes, if necessary, is
        // twenty times a second.
        interval: 50,

        // Are we at the app root?
        atRoot: function() {
            var path = this.location.pathname.replace(/[^\/]$/, '$&/');
            return path === this.root && !this.getSearch();
        },

        // In IE6, the hash fragment and search params are incorrect if the
        // fragment contains `?`.
        getSearch: function() {
            var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
            return match ? match[0] : '';
        },

        // Gets the true hash value. Cannot use location.hash directly due to bug
        // in Firefox where location.hash will always be decoded.
        getHash: function(window) {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : '';
        },

        // Get the pathname and search params, without the root.
        getPath: function() {
            var path = decodeURI(this.location.pathname + this.getSearch());
            var root = this.root.slice(0, -1);
            if (!path.indexOf(root)) path = path.slice(root.length);
            return path.charAt(0) === '/' ? path.slice(1) : path;
        },

        // Get the cross-browser normalized URL fragment from the path or hash.
        getFragment: function(fragment) {
            if (fragment == null) {
                if (this._hasPushState || !this._wantsHashChange) {
                    fragment = this.getPath();
                } else {
                    fragment = this.getHash();
                }
            }
            return fragment.replace(routeStripper, '');
        },

        // Start the hash change handling, returning `true` if the current URL matches
        // an existing route, and `false` otherwise.
        start: function(options) {
            if (History.started) throw new Error('BI.history has already been started');
            History.started = true;

            // Figure out the initial configuration. Do we need an iframe?
            // Is pushState desired ... is it available?
            this.options          = _.extend({root: '/'}, this.options, options);
            this.root             = this.options.root;
            this._wantsHashChange = this.options.hashChange !== false;
            this._hasHashChange   = 'onhashchange' in window;
            this._wantsPushState  = !!this.options.pushState;
            this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
            this.fragment         = this.getFragment();

            // Normalize root to always include a leading and trailing slash.
            this.root = ('/' + this.root + '/').replace(rootStripper, '/');

            // Transition from hashChange to pushState or vice versa if both are
            // requested.
            if (this._wantsHashChange && this._wantsPushState) {

                // If we've started off with a route from a `pushState`-enabled
                // browser, but we're currently in a browser that doesn't support it...
                if (!this._hasPushState && !this.atRoot()) {
                    var root = this.root.slice(0, -1) || '/';
                    this.location.replace(root + '#' + this.getPath());
                    // Return immediately as browser will do redirect to new url
                    return true;

                    // Or if we've started out with a hash-based route, but we're currently
                    // in a browser where it could be `pushState`-based instead...
                } else if (this._hasPushState && this.atRoot()) {
                    this.navigate(this.getHash(), {replace: true});
                }

            }

            // Proxy an iframe to handle location events if the browser doesn't
            // support the `hashchange` event, HTML5 history, or the user wants
            // `hashChange` but not `pushState`.
            if (!this._hasHashChange && this._wantsHashChange && (!this._wantsPushState || !this._hasPushState)) {
                var iframe = document.createElement('iframe');
                iframe.src = 'javascript:0';
                iframe.style.display = 'none';
                iframe.tabIndex = -1;
                var body = document.body;
                // Using `appendChild` will throw on IE < 9 if the document is not ready.
                this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
                this.iframe.document.open().close();
                this.iframe.location.hash = '#' + this.fragment;
            }

            // Add a cross-platform `addEventListener` shim for older browsers.
            var addEventListener = window.addEventListener || function (eventName, listener) {
                return attachEvent('on' + eventName, listener);
            };

            // Depending on whether we're using pushState or hashes, and whether
            // 'onhashchange' is supported, determine how we check the URL state.
            if (this._hasPushState) {
                addEventListener('popstate', this.checkUrl, false);
            } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
                addEventListener('hashchange', this.checkUrl, false);
            } else if (this._wantsHashChange) {
                this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
            }

            if (!this.options.silent) return this.loadUrl();
        },

        // Disable BI.history, perhaps temporarily. Not useful in a real app,
        // but possibly useful for unit testing Routers.
        stop: function() {
            // Add a cross-platform `removeEventListener` shim for older browsers.
            var removeEventListener = window.removeEventListener || function (eventName, listener) {
                return detachEvent('on' + eventName, listener);
            };

            // Remove window listeners.
            if (this._hasPushState) {
                removeEventListener('popstate', this.checkUrl, false);
            } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
                removeEventListener('hashchange', this.checkUrl, false);
            }

            // Clean up the iframe if necessary.
            if (this.iframe) {
                document.body.removeChild(this.iframe.frameElement);
                this.iframe = null;
            }

            // Some environments will throw when clearing an undefined interval.
            if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
            History.started = false;
        },

        // Add a route to be tested when the fragment changes. Routes added later
        // may override previous routes.
        route: function(route, callback) {
            this.handlers.unshift({route: route, callback: callback});
        },

        // Checks the current URL to see if it has changed, and if it has,
        // calls `loadUrl`, normalizing across the hidden iframe.
        checkUrl: function(e) {
            var current = this.getFragment();

            // If the user pressed the back button, the iframe's hash will have
            // changed and we should use that for comparison.
            if (current === this.fragment && this.iframe) {
                current = this.getHash(this.iframe);
            }

            if (current === this.fragment) return false;
            if (this.iframe) this.navigate(current);
            this.loadUrl();
        },

        // Attempt to load the current URL fragment. If a route succeeds with a
        // match, returns `true`. If no defined routes matches the fragment,
        // returns `false`.
        loadUrl: function(fragment) {
            fragment = this.fragment = this.getFragment(fragment);
            return _.any(this.handlers, function(handler) {
                if (handler.route.test(fragment)) {
                    handler.callback(fragment);
                    return true;
                }
            });
        },

        // Save a fragment into the hash history, or replace the URL state if the
        // 'replace' option is passed. You are responsible for properly URL-encoding
        // the fragment in advance.
        //
        // The options object can contain `trigger: true` if you wish to have the
        // route callback be fired (not usually desirable), or `replace: true`, if
        // you wish to modify the current URL without adding an entry to the history.
        navigate: function(fragment, options) {
            if (!History.started) return false;
            if (!options || options === true) options = {trigger: !!options};

            // Normalize the fragment.
            fragment = this.getFragment(fragment || '');

            // Don't include a trailing slash on the root.
            var root = this.root;
            if (fragment === '' || fragment.charAt(0) === '?') {
                root = root.slice(0, -1) || '/';
            }
            var url = root + fragment;

            // Strip the hash and decode for matching.
            fragment = decodeURI(fragment.replace(pathStripper, ''));

            if (this.fragment === fragment) return;
            this.fragment = fragment;

            // If pushState is available, we use it to set the fragment as a real URL.
            if (this._hasPushState) {
                this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

                // If hash changes haven't been explicitly disabled, update the hash
                // fragment to store history.
            } else if (this._wantsHashChange) {
                this._updateHash(this.location, fragment, options.replace);
                if (this.iframe && (fragment !== this.getHash(this.iframe))) {
                    // Opening and closing the iframe tricks IE7 and earlier to push a
                    // history entry on hash-tag change.  When replace is true, we don't
                    // want this.
                    if (!options.replace) this.iframe.document.open().close();
                    this._updateHash(this.iframe.location, fragment, options.replace);
                }

                // If you've told us that you explicitly don't want fallback hashchange-
                // based history, then `navigate` becomes a page refresh.
            } else {
                return this.location.assign(url);
            }
            if (options.trigger) return this.loadUrl(fragment);
        },

        // Update the hash location, either replacing the current entry, or adding
        // a new one to the browser history.
        _updateHash: function(location, fragment, replace) {
            if (replace) {
                var href = location.href.replace(/(javascript:|#).*$/, '');
                location.replace(href + '#' + fragment);
            } else {
                // Some browsers require that `hash` contains a leading #.
                location.hash = '#' + fragment;
            }
        }

    });

    // Create the default BI.history.
    BI.history = new History;

    // Helpers
    // -------

    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Set up inheritance for the model, collection, router, view and history.
    M.extend = Collection.extend = Router.extend = V.extend = History.extend = extend;

    // Throw an error when a URL is needed, and none is supplied.
    var urlError = function() {
        throw new Error('A "url" property or function must be specified');
    };

    // Wrap an optional error callback with a fallback error event.
    var wrapError = function(model, options) {
        var error = options.error;
        options.error = function(resp) {
            if (error) error(model, resp, options);
            model.trigger('error', model, resp, options);
        };
    };

    return BI;

}));/**
 * MVC路由
 * @class BI.WRouter
 * @extends BI.Router
 * @type {*|void|Object}
 */
BI.WRouter = BI.Router.extend({
    add: function(route, callback){
        this.handlers || (this.handlers=[]);
        this.handlers.unshift({route: route, callback: callback})
    },

    route: function(route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];
        var self = this;
        this.add(route, function(fragment) {
            var args = self._extractParameters(route, fragment);
            var result = self.execute(callback, args, name)
            if (result !== false) {
                self.trigger.apply(self, ['route:' + name].concat(args));
                self.trigger('route', name, args);
            }
            return result;
        });
        return this;
    },

    execute: function(callback, args, name) {
        if (callback) return callback.apply(this, args);
        return name;
    },

    get: function(fragment){
        var result = null;
        _.any(this.handlers, function(handler) {
            if (handler.route.test(fragment)) {
                result = handler.callback(fragment);
                return true;
            }
        });
        return result;
    }
});/**
 * 基本函数
 * Create By GUY 2014\11\17
 *
 */

if (!window.BI) {
    window.BI = {};
}
;
!(function ($, undefined) {
    _.extend(BI, {
        version: "4.0"
    });
    var traverse = function (func, context) {
        return function (value, key, obj) {
            return func.call(context, key, value, obj);
        }
    };
    var _apply = function (name) {
        return function () {
            return _[name].apply(_, arguments);
        }
    };
    var _applyFunc = function (name) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args[1] = _.isFunction(args[1]) ? traverse(args[1], args[2]) : args[1];
            return _[name].apply(_, args);
        }
    };

    //Utility
    _.extend(BI, {
        i18nText: function (key) {
            var localeText = key;
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
                    throw new Error(v + "值不合法");
                } else {
                    return true;
                }
            }
            if (!this.isArray(is)) {
                is = [is];
            }
            if (!this.deepContains(is, v)) {
                throw new Error(v + "值不合法");
            }
        },

        warn: function (message) {
            console.warn(message)
        },

        UUID: function () {
            var f = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
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
                throw new Error("无法根据items创建组件?")
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
                    })
                }
                if (item.el instanceof BI.Widget || (BI.View && item.el instanceof BI.View)) {
                    innerAttr.shift();
                    return BI.extend({}, outerAttr.shift(), {type: null}, item);
                }
                if (item.el) {
                    return BI.extend({}, outerAttr.shift(), item, {
                        el: BI.extend({}, innerAttr.shift(), item.el)
                    })
                }
                return BI.extend({}, outerAttr.shift(), {
                    el: BI.extend({}, innerAttr.shift(), item)
                })
            })
        },

        //用容器包装items
        packageItems: function (items, layouts) {
            for (var i = layouts.length - 1; i >= 0; i--) {
                items = BI.map(items, function (k, it) {
                    return BI.extend({}, layouts[i], {
                        items: [
                            BI.extend({}, layouts[i].el, {
                                el: it
                            })
                        ]
                    })
                })
            }
            return items;
        },

        formatEL: function (obj) {
            if (obj && obj.el) {
                return obj;
            }
            return {
                el: obj
            };
        },

        //剥开EL
        stripEL: function (obj) {
            return obj.type && obj || obj.el || obj;
        },

        trans2Element: function (widgets) {
            return BI.map(widgets, function (i, wi) {
                return wi.element;
            });
        }
    });

    //集合相关方法
    _.each(["where", "findWhere", "contains", "invoke", "pluck", "shuffle", "sample", "toArray", "size"], function (name) {
        BI[name] = _apply(name)
    });
    _.each(["each", "map", "reduce", "reduceRight", "find", "filter", "reject", "every", "all", "some", "any", "max", "min",
        "sortBy", "groupBy", "indexBy", "countBy", "partition"], function (name) {
        BI[name] = _applyFunc(name)
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
        //数数
        count: function (from, to, predicate) {
            var t;
            if (predicate) {
                for (t = from; t < to; t++) {
                    predicate(t);
                }
            }
            return to - from;
        },

        //倒数
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
                if (predicate(index, obj[index], obj)) return true;
            }
            return false;
        },

        backEvery: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                if (!predicate(index, obj[index], obj)) return false;
            }
            return true;
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
            return str.split('&-&');
        },

        array2String: function (array) {
            return array.join("&-&");
        },

        abc2Int: function (str) {
            var idx = 0, start = 'A', str = str.toUpperCase();
            for (var i = 0, len = str.length; i < len; ++i) {
                idx = str.charAt(i).charCodeAt(0) - start.charCodeAt(0) + 26 * idx + 1;
                if (idx > (2147483646 - str.charAt(i).charCodeAt(0) + start.charCodeAt(0)) / 26) {
                    return 0;
                }
            }
            return idx;
        },

        int2Abc: function (num) {
            var DIGITS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
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

    //数组相关的方法
    _.each(["first", "initial", "last", "rest", "compact", "flatten", "without", "union", "intersection",
        "difference", "zip", "unzip", "object", "indexOf", "lastIndexOf", "sortedIndex", "range"], function (name) {
        BI[name] = _apply(name)
    });
    _.each(["findIndex", "findLastIndex"], function (name) {
        BI[name] = _applyFunc(name)
    });
    _.extend(BI, {
        //构建一个长度为length的数组
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
            if (array == null) return [];
            if (!_.isBoolean(isSorted)) {
                context = iteratee;
                iteratee = isSorted;
                isSorted = false;
            }
            iteratee && (iteratee = traverse(iteratee, context));
            return _.uniq.call(_, array, isSorted, iteratee, context);
        }
    });

    //对象相关方法
    _.each(["keys", "allKeys", "values", "pairs", "invert", "create", "functions", "extend", "extendOwn",
        "defaults", "clone", "property", "propertyOf", "matcher", "isEqual", "isMatch", "isEmpty",
        "isElement", "isNumber", "isString", "isArray", "isObject", "isArguments", "isFunction", "isFinite",
        "isBoolean", "isDate", "isRegExp", "isError", "isNaN", "isUndefined"], function (name) {
        BI[name] = _apply(name)
    });
    _.each(["mapObject", "findKey", "pick", "omit", "tap"], function (name) {
        BI[name] = _applyFunc(name)
    });
    _.extend(BI, {

        inherit: function (sb, sp, overrides) {
            if (typeof sp == 'object') {
                overrides = sp;
                sp = sb;
                sb = function () {
                    sp.apply(this, arguments);
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
            if (BI.isKey(keys)) {
                return _.has.apply(_, arguments);
            }
            if (!keys || BI.isEmpty(keys)) {
                return false;
            }
            return BI.every(keys, function (i, key) {
                return _.has(obj, key);
            });
        },

        //数字和字符串可以作为key
        isKey: function (key) {
            return BI.isNumber(key) || (BI.isString(key) && key.length > 0);
        },

        //忽略大小写的等于
        isCapitalEqual: function (a, b) {
            a = BI.isNull(a) ? a : ("" + a).toLowerCase();
            b = BI.isNull(b) ? b : ("" + b).toLowerCase();
            return BI.isEqual(a, b);
        },

        isWidthOrHeight: function (w) {
            if (typeof w == 'number') {
                return w >= 0;
            } else if (typeof w == 'string') {
                return /^\d{1,3}%$/.exec(w) || w == 'auto' || /^\d+px$/.exec(w);
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

    //deep方法
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
            if (type === '[object Date]') {
                return new Date(obj.getTime());
            }

            var i, clone, key;

            // Array
            if (type === '[object Array]') {
                i = obj.length;

                clone = [];

                while (i--) {
                    clone[i] = BI.deepClone(obj[i]);
                }
            }
            // Object
            else if (type === '[object Object]' && obj.constructor === Object) {
                clone = {};

                for (var i in obj) {
                    if (_.has(obj, i)) {
                        clone[i] = BI.deepClone(obj[i]);
                    }
                }
            }

            return clone || obj;
        },

        isDeepMatch: function (object, attrs) {
            var keys = BI.keys(attrs), length = keys.length;
            if (object == null) return !length;
            var obj = Object(object);
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (!BI.isEqual(attrs[key], obj[key]) || !(key in obj)) return false;
            }
            return true;
        },

        deepContains: function (obj, copy) {
            if (BI.isObject(copy)) {
                return BI.any(obj, function (i, v) {
                    if (BI.isEqual(v, copy)) {
                        return true;
                    }
                })
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
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if (BI.isEqual(target, obj[i])) {
                        obj.splice(i--, 1);
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if (BI.isEqual(target, obj[i])) {
                        delete obj[i];
                    }
                });
            }
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
            } else {
                var result = {};
                BI.each(obj, function (i, v) {
                    if (!BI.isEqual(target, obj[i])) {
                        result[i] = v;
                    }
                });
                return result;
            }
        },

        deepUniq: function () {

        },

        //比较两个对象得出不一样的key值
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
        }
    });

    //通用方法
    _.each(["uniqueId", "result", "chain", "iteratee", "escape", "unescape"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        }
    });

    //事件相关方法
    _.each(["bind", "once", "partial", "debounce", "throttle", "delay", "defer", "wrap"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        }
    });

    _.extend(BI, {
        nextTick: (function () {
            var callbacks = [];
            var pending = false;
            var timerFunc;

            function nextTickHandler() {
                pending = false;
                var copies = callbacks.slice(0);
                callbacks = [];
                for (var i = 0; i < copies.length; i++) {
                    copies[i].func.apply(null, copies[i].args);
                }
            }

            /* istanbul ignore if */
            if (typeof MutationObserver !== 'undefined') {
                var counter = 1;
                var observer = new MutationObserver(nextTickHandler);
                var textNode = document.createTextNode(counter);
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function () {
                    counter = (counter + 1) % 2;
                    textNode.data = counter;
                }
            } else {
                timerFunc = setTimeout
            }
            return function (cb) {
                var args = [].slice.call(arguments, 1);
                callbacks.push({func: cb, args: args});
                if (pending) return;
                pending = true;
                timerFunc(nextTickHandler, 0);
            }
        })()
    });

    //数字相关方法
    _.each(["random"], function (name) {
        BI[name] = _apply(name)
    });
    _.extend(BI, {
        getTime: function () {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            } else {
                if (window.performance && window.performance.webkitNow) {
                    return window.performance.webkitNow();
                } else {
                    if (Date.now) {
                        return Date.now();
                    } else {
                        return new Date().getTime();
                    }
                }
            }
        },

        parseInt: function (number) {
            var radix = 10;
            if (/^0x/g.test(number)) {
                radix = 16;
            }
            try {
                return parseInt(number, radix);
            } catch (e) {
                throw new Error("转成int类型失败");
                return NaN;
            }
        },

        parseFloat: function (number) {
            try {
                return parseFloat(number);
            } catch (e) {
                throw new Error("转成float类型失败");
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
                    sum += new Number(iteratee.apply(context, [i, item]));
                } else {
                    sum += new Number(item);
                }
            });
            return sum;
        },

        average: function (array, iteratee, context) {
            var sum = BI.sum(array, iteratee, context);
            return sum / array.length;
        }
    });

    //字符串相关方法
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

        isLiteral: function (exp) {
            var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/
            return literalValueRE.test(exp)
        },

        stripQuotes: function (str) {
            var a = str.charCodeAt(0)
            var b = str.charCodeAt(str.length - 1)
            return a === b && (a === 0x22 || a === 0x27)
                ? str.slice(1, -1)
                : str
        },

        //background-color => backgroundColor
        camelize: function (str) {
            return str.replace(/-(.)/g, function (_, character) {
                return character.toUpperCase();
            });
        },

        //backgroundColor => background-color
        hyphenate: function (str) {
            return str.replace(/([A-Z])/g, '-$1').toLowerCase();
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

    //浏览器相关方法
    _.extend(BI, {
        isIE: function () {
            return $.browser.msie;
        },

        isChrome: function () {
            return $.browser.chrome;
        },

        isFireFox: function () {
            return $.browser.mozilla;
        },

        isOpera: function () {
            return $.browser.opera;
        },

        isSafari: function () {
            return $.browser.safari;
        },

        isKhtml: function () {
            return /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
        },

        isSupportCss3: function (style) {
            var prefix = ['webkit', 'Moz', 'ms', 'o'],
                i, len,
                humpString = [],
                htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };

            for (i in prefix) {
                humpString.push(_toHumb(prefix[i] + '-' + style));
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
    //BI请求
    _.extend(BI, {

        /**
         * 异步ajax请求
         * @param {String} op op参数
         * @param {String} cmd cmd参数
         * @param {JSON} data ajax请求的参数
         * @param {Function} callback 回调函数
         * @param {Function} complete 回调
         */
        requestAsync: function (op, cmd, data, callback, complete) {
            // if (BI.isNull(BI.REQUEST_LOADING)) {
            //     BI.REQUEST_LOADING = BI.createWidget({
            //         type: "bi.request_loading"
            //     });
            // }
            data = data || {};
            if (!BI.isKey(op)) {
                op = 'fr_bi_dezi';
            }
            if (op === "fr_bi_dezi") {
                data.sessionID = Data.SharingPool.get("sessionID");
            }
            var url = FR.servletURL + '?op=' + op + '&cmd=' + cmd + "&_=" + Math.random();
            (BI.ajax || FR.ajax)({
                url: url,
                type: 'POST',
                data: data,
                error: function () {
                    // BI.Msg.toast(BI.i18nText("BI-Ajax_Error"));
                    //失败 取消、重新加载
                    // BI.REQUEST_LOADING.setCallback(function () {
                    //     BI.requestAsync(op, cmd, data, callback, complete);
                    // });
                    // BI.REQUEST_LOADING.showError();
                },
                complete: function (res, status) {
                    if (BI.isFunction(callback) && status === 'success') {
                        callback(BI.jsonDecode(res.responseText));
                        BI.Maskers.hide(BI.RequstLoading.MASK_ID);
                    }
                    if (BI.isFunction(complete)) {
                        complete();
                    }
                }
            });
        },

        /**
         * 同步ajax请求
         * @param {String} op op参数
         * @param {String} cmd cmd参数
         * @param {JSON} data ajax请求的参�?
         * @returns {Object} ajax同步请求返回的JSON对象
         */
        requestSync: function (op, cmd, data) {
            data = data || {};
            if (!BI.isKey(op)) {
                op = 'fr_bi_dezi';
            }
            if (op === "fr_bi_dezi") {
                data.sessionID = Data.SharingPool.get("sessionID");
            }
            var url = FR.servletURL + '?op=' + op + '&cmd=' + cmd + "&_=" + Math.random();
            var result = {};
            (BI.ajax || FR.ajax)({
                url: url,
                type: 'POST',
                async: false,
                data: data,
                error: function () {
                    BI.Msg.toast(BI.i18nText("BI-Ajax_Error"));
                },
                complete: function (res, status) {
                    if (status === 'success') {
                        result = BI.jsonDecode(res.responseText);
                    }
                }
            });
            return result;
        },

        /**
         * 请求方法
         * @param cmd 命令
         * @param data 数据
         * @param extend 参数
         * @returns {*}
         */
        request: function (cmd, data, extend) {
            extend = extend || {};
            data = data || {};
            var op = extend.op;
            if (!BI.isKey(op)) {
                op = 'fr_bi_dezi';
            }
            if (op === "fr_bi_dezi") {
                data.sessionID = Data.SharingPool.get("sessionID");
            }
            if (extend.async === true) {
                BI.requestAsync(op, cmd, data, extend.complete || extend.success);
            } else {
                return BI.requestSync(op, cmd, data);
            }
        }
    });
})(jQuery);/**
 * 客户端观察者，主要处理事件的添加、删除、执行等
 * @class BI.OB
 * @abstract
 */
BI.OB = function (config) {
    this.options = $.extend(this._defaultConfig(), config);
    this._init();
    this._confirmEvents();
};
$.extend(BI.OB.prototype, {
    _defaultConfig: function () {
        return {};
    },
    _init: function () {
        var self = this;
        if (this.options.listeners != null) {
            $.each(this.options.listeners, function (i, lis) {
                (lis.target ? lis.target : self)[lis.once ? 'once' : 'on']
                (lis.eventName, lis.action.createDelegate(self))
            })
            delete this.options.listeners;
        }
    },

    _confirmEvents: function () {
        this.fireEvent(BI.Events.AFTERINIT);
    },

    _getEvents: function () {
        if (!$.isArray(this.events)) {
            this.events = []
        }

        return this.events;
    },

    /**
     * 给观察者绑定一个事件
     * e.g. 给填报页面添加一个提交失败事件：contentPane.on(BI.Events.WF, function() {alert("填报失败！");});
     *      给文本框控件p1添加一个初始化后事件：p1.on(BI.Evnets.AFTERINIT, function() {alert("初始化完成！");});
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

        /*alex:如果fn是null,就是把eventName上面所有方法都un掉*/
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
                })
                this._getEvents()[eventName] = newFns;
            }
        }
    },
    /**
     * 清除观察者的所有事件绑定
     */
    purgeListeners: function () {
        /*alex:清空events*/
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
        if ($.isArray(fns)) {
            var args = Array.prototype.slice.call(arguments, 1)
            for (var i = 0; i < fns.length; i++) {
                if (fns[i].apply(this, args) === false) {
                    return false;
                }
            }
        }
        return true;
    }
});
BI.OB.capture = function (o, fn, scope) {
    o.fireEvent = o.fireEvent.createInterceptor(fn, scope);
}
// alex:释放事件的捕捉
BI.OB.releaseCapture = function (o) {
    o.fireEvent = BI.OB.prototype.fireEvent;
};/**
 * Widget超类
 * @class BI.Widget
 * @extends BI.OB
 *
 * @cfg {JSON} options 配置属性
 */
BI.Widget = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.Widget.superclass._defaultConfig.apply(this, arguments), {
            tagName: "div",
            attributes: {},
            data: {},

            tag: null,
            widgetName: "",
            disabled: false,
            invisible: false,
            invalid: false,
            baseCls: "",
            extraCls: "",
            cls: ""
        })
    },

    _initOpts: function () {
    },

    _init: function () {
        var o = this.options;
        this._initOpts()
        BI.isWidget(o.element) && (o.element = o.element.element);
        BI.isString(o.element) && (o.element = $(o.element));
        o.renderEl || (o.renderEl = o.element);
        o.element || (o.element = o.renderEl);
        o.element || (o.renderEl = o.element = $(document.createElement(o.tagName)));
        this.widgetName = o.widgetName || (o.widgetName = BI.uniqueId("widget"));
        this._initRoot();
        this._initElementWidth();
        this._initElementHeight();
        this._initVisualEffects();
        o.extraCls && this.element.addClass(o.extraCls);
        o.cls && this.element.addClass(o.cls);
        this.element.attr(o.attributes).data(o.data);
        this.widgets = {};//保存子组件
    },

    /**
     * 初始化根节点
     * @private
     */
    _initRoot: function () {
        if (this.options.renderEl != null) {
            this.element = $(this.options.renderEl);
        } else {
            this.element = this._defaultRoot();
        }
        if (this.options.baseCls) {
            this.element.addClass(this.options.baseCls);
        }
    },

    _initElementWidth: function () {
        var o = this.options;
        if (BI.isWidthOrHeight(o.width)) {
            this.element.css("width", o.width);
        }
    },

    _initElementHeight: function () {
        var o = this.options;
        if (BI.isWidthOrHeight(o.height)) {
            this.element.css("height", o.height);
        }
    },

    _initVisualEffects: function () {
        BI.nextTick(BI.bind(function () {
            if (this.options.disabled) {
                this.setEnable(false);
            }
            if (this.options.invalid) {
                this.setValid(false);
            }
        }, this));

        if (this.options.invisible) {
            this.setVisible(false);
        }
    },

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
                var args = Array.prototype.slice.call(arguments, 1)
                for (var i = 0; i < fns.length; i++) {
                    if (fns[i].apply(this, args) === false) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    setWidth: function (w) {
        this.options.width = w;
        this._initElementWidth();
    },

    setHeight: function (h) {
        this.options.height = h;
        this._initElementHeight();
    },

    setElement: function (widget) {
        if (widget == this) {
            return;
        }
        this.element = BI.isWidget(widget) ? widget.element : $(widget);
        return this;
    },

    setEnable: function (enable) {
        BI.assert(enable, [true, false]);
        if (enable === true) {
            this.options.disabled = false;
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.options.disabled = true;
            this.element.addClass("base-disabled disabled");
        }
    },

    setVisible: function (visible) {
        BI.assert(visible, [true, false]);
        if (visible === true) {
            this.options.invisible = false;
            this.element.show();
        } else if (visible === false) {
            this.options.invisible = true;
            this.element.hide();
        }
        this.fireEvent(BI.Events.VIEW, visible);
    },

    setValid: function (valid) {
        BI.assert(valid, [true, false]);
        this.options.invalid = !valid;
        if (valid === true) {
            this.element.removeClass("base-invalid invalid");
        } else if (valid === false) {
            this.element.addClass("base-invalid invalid");
        }
    },

    getWidth: function () {
        return this.options.width;
    },

    getHeight: function () {
        return this.options.height;
    },

    isValid: function () {
        return !this.options.invalid;
    },

    valid: function () {
        this.setValid(true);
    },

    invalid: function () {
        this.setValid(false);
    },

    addWidget: function (name, widget) {
        var self = this;
        if (name instanceof BI.Widget) {
            widget = name;
            name = widget.getName();
        }
        if (!BI.isKey(name)) {
            throw new Error("name cannot be null");
        }
        name = BI.isKey(name) ? (name + "") : "";
        name = name || widget.getName() || BI.UUID();
        if (this.widgets[name]) {
            throw new Error("name has already been existed");
        }
        widget.on(BI.Events.DESTROY, function () {
            delete self.widgets[name]
        });
        return (this.widgets[name] = widget);
    },

    getWidgetByName: function (name) {
        if (!BI.isKey(name) || name == this.getName()) {
            return this;
        }
        name = name + "";
        var widget = void 0, other = {};
        BI.any(this.widgets, function (i, wi) {
            if (i === name) {
                widget = wi;
                return true;
            }
            other[i] = wi;
        });
        if (!widget) {
            BI.any(other, function (i, wi) {
                return (widget = wi.getWidgetByName(i));
            });
        }
        return widget;
    },

    hasWidget: function (name) {
        return this.widgets[name] != null;
    },

    getWidgets: function () {
        return this.widgets;
    },

    getValidWidgets: function () {
        var widgets = [];
        BI.each(this.widgets, function (i, wi) {
            if (wi.isValid()) {
                widgets.push(wi);
            }
        });
        return widgets;
    },

    getName: function () {
        return this.options.widgetName;
    },

    setTag: function (tag) {
        this.options.tag = tag;
    },

    getTag: function () {
        return this.options.tag;
    },

    attr: function (key, value) {
        if (BI.isNotNull(value)) {
            return this.options[key] = value;
        }
        return this.options[key];
    },

    getText : function() {

    },

    setText : function(text) {

    },

    getValue: function () {

    },

    setValue: function (value, shouldFireEvent) {

    },

    getType: function () {
        return this.options.type;
    },

    isEnabled: function () {
        return !this.options.disabled;
    },

    isVisible: function () {
        return !this.options.invisible;
    },

    render: function () {
        this.element.append(this.hang());
        return this;
    },

    hang: function () {
        return BI.DOM.hang(BI.trans2Element(this.widgets));
    },

    clear: function () {
        this.hang();
        this.element.empty();
        this.widgets = {};
    },

    empty: function () {
        BI.each(this.widgets, function (i, wi) {
            wi.destroy();
        });
        this.element.empty();
        this.widgets = {};
    },

    destroy: function () {
        this.empty();
        this.element.each(function () {
            $(this).remove();
            if (BI.isIE()) {
                this.outerHTML = '';
            }
        });
        this.fireEvent(BI.Events.DESTROY);
    },

    _defaultRoot: function () {
        return $("<div/>");
    },

    disable: function () {
        this.setEnable(false);
    },

    enable: function () {
        this.setEnable(true);
    },

    invisible: function () {
        this.setVisible(false);
    },

    visible: function () {
        this.setVisible(true);
    }
});BI.Model = BI.inherit(BI.M, {
    _defaultConfig: function () {
        return {
            "default": "just a default",
            "current": void 0
        }
    },

    _static: function () {
        return {};
    },

    _init: function () {
        BI.Model.superclass._init.apply(this, arguments);
        this.on("change:current", function (obj, val) {
            BI.isNotNull(val) && this.refresh(val);
        }).on("change", function (changed, prev, context, options) {
            if (this._start === true || BI.has(changed, "current")) {
                return;
            }
            this.actionStart();
            if (!this.local()) {
                !BI.has(this._tmp, BI.keys(changed)) && this.parent && this.parent._change(this);
                this._changing_ = true;
                this.change(changed, prev, context, options);
                this._changing_ = false;
            }
        });

        this._tmp = {};//过渡属性

        this._hass = {};
        this._gets = [];//记录交互行为
        this._start = false;
        this._changing_ = false;

        this._read = BI.debounce(BI.bind(this.fetch, this), 30);
        this._save = BI.debounce(BI.bind(this.save, this), 30);
        this._F = [];
    },

    toJSON: function () {
        var json = BI.Model.superclass.toJSON.apply(this, arguments);
        delete json["baseCls"];
        delete json["current"];
        delete json["default"];
        delete json["parent"];
        delete json["rootURL"];
        delete json["id"];
        delete json["tag"];
        BI.each(this._gets, function (i, action) {
            delete json[action];
        });
        return json;
    },

    copy: function () {
        if (this._start === true || this._changing_ === true) {
            this._F.push({f: this.copy, arg: arguments});
            return;
        }
        this.trigger("copy");
    },
    //子节点的一个类似副本
    similar: function (value, key1, key2, key3) {
        return value;
    },

    _map: function (child) {
        var self = this;
        var map = {}, current = {};
        var mapping = function (key, ch) {
            key = key + "";
            if (key === "") {
                return;
            }
            var keys = key.split('.');
            if (!map[keys[0]]) {
                map[keys[0]] = self.get(keys[0]);
            }
            var parent = map, last = void 0;
            BI.each(keys, function (i, k) {
                last && (parent = parent[last] || (parent[last] = {}));
                last = k;
            });
            parent[last] = ch.toJSON();
        };
        BI.each(this._childs, function (key, chs) {
            if (!BI.isArray(chs)) {
                chs = [chs];
            }
            BI.each(chs, function (i, ch) {
                if (ch === child) {
                    current[key] = child;
                    return;
                }
                //mapping(key, ch);
            })
        });
        BI.each(current, function (key, ch) {
            mapping(key, ch);
        });
        var tmp = {};
        BI.each(this._tmp, function (k) {
            if (map[k]) {
                tmp[k] = map[k];
                delete map[k];
            }
        });
        this.tmp(tmp);
        return map;
    },

    _change: function (child) {
        this.set(this._map(child));
        return this;
    },

    splice: function (old, key1, key2, key3) {

    },

    duplicate: function (copy, key1, key2, key3) {

    },

    change: function (changed, prev) {

    },

    actionStart: function () {
        this._start = true;
        return this;
    },

    actionEnd: function () {
        var self = this;
        this._start = false;
        var _gets = this._gets.slice(0), _F = this._F.slice(0);
        this._gets = [];
        this._hass = {};
        this._F = [];
        BI.each(_gets, function (i, action) {
            self.unset(action, {silent: true});
        });
        BI.each(_F, function (i, fn) {
            fn.f.apply(self, fn.arg);
        });
        return this;
    },

    addChild: function (name, child) {
        name = name + "";
        var self = this;
        this._childs || (this._childs = {});
        if (this._childs[name]) {
            if (BI.isArray(this._childs[name])) {
                this._childs[name].push(child);
            } else {
                this._childs[name] = [this._childs[name]].concat(child)
            }
        } else {
            this._childs[name] = child;
        }
        child && child.on("destroy", function () {
            var keys = name.split('.');
            var g = self.get(keys[0]), p, c;
            var sset = !!self._tmp[keys[0]] ? "tmp" : "set", unset = "un" + sset;

            BI.each(keys, function (i, k) {
                if (i === 0) {
                    c = g;
                    return;
                }
                p = c;
                c = c[k];
            });
            self.removeChild(name, child);
            var newKeys = BI.clone(keys);
            keys.length > 1 ? newKeys.unshift(BI.deepClone(p[keys[keys.length - 1]])) : newKeys.unshift(BI.deepClone(g));
            keys.length > 1 ? (delete p[keys[keys.length - 1]], self[sset](keys[0], g, {silent: true})) : self[unset](name, {silent: true});
            !BI.has(self._tmp, keys[0]) && self.parent && self.parent._change(self);
            self.splice.apply(self, newKeys);
            self.trigger("splice", newKeys);
        }).on("copy", function () {
            var keys = name.split('.');
            var g = self.get(keys[0]), p, c;
            var sset = !!self._tmp[keys[0]] ? "tmp" : "set";
            BI.each(keys, function (i, k) {
                if (i === 0) {
                    c = g;
                    return;
                }
                p = c;
                c = c[k];
            });
            var copy = BI.UUID(), newKeys = BI.clone(keys);
            keys.length > 1 ? newKeys.unshift(BI.deepClone(p[keys[keys.length - 1]])) : newKeys.unshift(BI.deepClone(g));
            var backup = self.similar.apply(self, newKeys);
            keys.length > 1 ? (p[copy] = backup, self[sset](keys[0], g, {silent: true})) : self[sset](copy, backup, {silent: true});
            keys.unshift(copy);
            !BI.has(self._tmp, keys[0]) && self.parent && self.parent._change(self);
            self.duplicate.apply(self, keys);
            self.trigger("duplicate", keys);
        });
    },

    removeChild: function (name, child) {
        if (BI.isArray(this._childs[name])) {
            BI.remove(this._childs[name], child);
            if (BI.isEmpty(this._childs[name])) {
                delete this._childs[name];
            }
            return;
        }
        delete this._childs[name];
    },

    has: function (attr, istemp) {
        if (istemp === true) {
            return _.has(this.tmp, attr);
        }
        if (this._start === true && this._changing_ === false) {
            this._hass[attr] = true;
        }
        return BI.Model.superclass.has.apply(this, arguments);
    },

    cat: function (attr) {
        if (_.has(this._tmp, attr)) {
            return this._tmp[attr];
        }
        if (this._start === true && this._hass[attr]) {
            delete this._hass[attr];
            switch (attr) {
                case "default":
                    break;
                case "current":
                    break;
                default :
                    this._gets.push(attr);
                    break;
            }
        }
        if (_.has(this.attributes, attr)) {
            return this.attributes[attr];
        }
        var sta = _.result(this, "_static");
        return BI.isFunction(sta[attr]) ? sta[attr].apply(this, BI.values(arguments).slice(1)) : sta[attr];
    },

    get: function () {
        return BI.deepClone(this.cat.apply(this, arguments));
    },

    set: function (key, val, options) {
        if (this._start === true || this._changing_ === true) {
            this._F.push({f: this.set, arg: arguments});
            return this;
        }
        return BI.Model.superclass.set.apply(this, arguments);
    },

    unset: function (attr, options) {
        var self = this;
        BI.each(this._childs, function (key, model) {
            key = key + "";
            var keys = key.split('.');
            if (_.isEqual(attr, keys[0])) {
                delete self._childs[attr];
                if (!BI.isArray(model)) {
                    model = [model];
                }
                BI.each(model, function (i, m) {
                    m.trigger("unset");
                });
            }
        });
        return BI.Model.superclass.unset.apply(this, arguments);
    },

    tmp: function (key, val, options) {
        if (this._start === true || this._changing_ === true) {
            this._F.push({f: this.tmp, arg: arguments});
            return this;
        }
        var attr, attrs, unset, changes, silent, changing, changed, prev, current;
        if (key == null) return this;
        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }
        options || (options = {});

        unset = options.unset;
        silent = options.silent;
        changes = [];
        changing = this._changingTmp;
        this._changingTmp = true;

        if (!changing) {
            this._previousTmp = _.clone(this._tmp);
            this.changedTmp = {};
        }
        if (!this._previousTmp) {
            this._previousTmp = _.clone(this._tmp);
        }
        current = this._tmp, prev = this._previousTmp;

        for (attr in attrs) {
            val = attrs[attr];
            if (!_.isEqual(current[attr], val)) changes.push(attr);
            if (!_.isEqual(prev[attr], val)) {
                this.changedTmp[attr] = val;
            } else {
                delete this.changedTmp[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
        }

        if (!silent) {
            if (changes.length) this._pendingTmp = options;
            for (var i = 0, length = changes.length; i < length; i++) {
                this.trigger('change:' + changes[i], this, current[changes[i]], options);
            }
        }

        if (changing) return this;
        changed = BI.clone(this.changedTmp);
        if (!silent) {
            while (this._pendingTmp) {
                options = this._pendingTmp;
                this._pendingTmp = false;
                this.trigger('change', changed, prev, this, options);
            }
        }
        this._pendingTmp = false;
        this._changingTmp = false;
        if (!silent && changes.length) this.trigger("changed", changed, prev, this, options);
        return this;
    },

    untmp: function (attr, options) {
        var self = this;
        BI.each(this._childs, function (key, model) {
            key = key + "";
            var keys = key.split('.');
            if (_.isEqual(attr, keys[0])) {
                delete self._childs[attr];
                if (!BI.isArray(model)) {
                    model = [model];
                }
                BI.each(model, function (i, m) {
                    m.trigger("unset");
                });
            }
        });
        return this.tmp(attr, void 0, _.extend({}, options, {unset: true}));
    },

    cancel: function (options) {
        var self = this;
        var tmp = BI.clone(this._tmp);
        this._tmp = {};
        BI.each(tmp, function (k) {
            self.untmp(k, options);
        });
    },

    submit: function () {
        var tmp = BI.clone(this._tmp);
        this._tmp = {};
        this.set(tmp);
        return this;
    },

    urlRoot: function () {
        return FR.servletURL;
    },

    parse: function (data) {
        return data;
    },

    setEditing: function (edit) {
        this._editing = edit;
    },

    getEditing: function () {
        if (this._start !== true) {
            throw new Error("getEditing函数只允许在local中调用");
        }
        return this._editing;
    },

    local: function () {

    },

    load: function (data) {

    },

    refresh: function () {

    },

    /**
     * 更新整个model
     */
    updateURL: function () {

    },
    /**
     * 添加一个元素或删除一个元素或修改一个元素
     */
    patchURL: function () {

    },
    /**
     * 删除整个model, destroy方法调用
     */
    deleteURL: function () {

    },
    /**
     * 读取model
     */
    readURL: function () {

    },

    read: function (options) {
        if (this._start == true || this._changing_ === true) {
            this._F.push({f: this.read, arg: arguments});
            return;
        }
        this._read(options);
    },

    update: function (options) {
        if (this._start == true || this._changing_ === true) {
            this._F.push({f: this.update, arg: arguments});
            return;
        }
        this._save(null, options);
    },

    patch: function (options) {
        if (this._start == true || this._changing_ === true) {
            this._F.push({f: this.patch, arg: arguments});
            return;
        }
        this._save(null, BI.extend({}, options, {
            patch: true
        }));
    }
});/**
 * @class BI.View
 * @extends BI.V
 * @type {*|void|Object}
 */
BI.View = BI.inherit(BI.V, {

    _init: function () {
        BI.View.superclass._init.apply(this, arguments);
        var self = this;
        this.listenTo(this.model, "change:current", function (obj, val) {
            if (BI.isNotNull(val) && val.length > 0) {
                this.refresh(val);
            }
        }).listenTo(this.model, "change", function (changed) {
            this.delegateEvents();
        }).listenTo(this.model, "changed", function (changed, prev, context, options) {
            if (BI.has(changed, "current") && BI.size(changed) > 1) {
                throw new Error("refresh操作不能调用set操作");
            }
            var notLocal = !BI.has(changed, "current") && !this.local() && this.notifyParent().notify();
            this.model.actionEnd() && this.actionEnd();
            this.model._changing_ = true;
            notLocal && !BI.isEmpty(changed) && this.change(changed, prev, context, options);
            this.model._changing_ = false;
            this.model.actionEnd() && this.actionEnd();
        }).listenTo(this.model, "destroy", function () {
            this.destroy();
        }).listenTo(this.model, "unset", function () {
            this.destroy();
        }).listenTo(this.model, "splice", function (arg) {
            this.splice.apply(this, arg);
        }).listenTo(this.model, "duplicate", function (arg) {
            this.duplicate.apply(this, arg);
        });
        this._F = [];
        var flatten = ["_init", "_defaultConfig", "_vessel", "_render", "getName", "listenEnd", "local", "refresh", "load", "change"];
        flatten = BI.makeObject(flatten, true);
        BI.each(this.constructor.caller.caller.prototype, function (key) {
            if (flatten[key]) {
                return;
            }
            var f = self[key];
            if (BI.isFunction(f)) {
                self[key] = BI.bind(function () {
                    if (this.model._start === true) {
                        this._F.push({f: f, arg: arguments});
                        return;
                    }
                    return f.apply(this, arguments);
                }, self);
            }
        })
    },

    change: function (changed, prev) {

    },

    actionEnd: function () {
        var self = this;
        var _F = this._F.slice(0);
        this._F = [];
        BI.each(_F, function (i, f) {
            f.f.apply(self, f.arg);
        });
        return this;
    },

    delegateEvents: function (events) {
        if (!(events || (events = BI.deepClone(_.result(this, 'events'))))) return this;
        var delegateEventSplitter = /^(\S+)\s*(.*)$/;
        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) method = this[events[key]];
            if (!method) continue;
            var match = key.match(delegateEventSplitter);
            var ev = true;
            switch (match[1]) {
                case "draggable":
                    break;
                case "droppable":
                    break;
                case "sortable":
                    break;
                case "resizable":
                    break;
                case "hover":
                    break;
                default :
                    ev = false;
                    break;
            }

            var off = new BI.OffList({
                event: match[1] + '.delegateEvents' + this.cid
            });

            var keys = match[2].split('.');
            var handle = keys[1];
            var bind = ev ? new BI.EventList({
                event: match[1],
                handle: handle,
                callback: BI.bind(method, this)
            }) : new BI.ListenerList({
                event: match[1] + '.delegateEvents' + this.cid,
                handle: handle,
                callback: BI.bind(method, this),
                context: this
            });

            var list = [];
            if (this[keys[0]] && (this[keys[0]] instanceof $ || this[keys[0]].element instanceof $)) {
                list = [this[keys[0]]]
                delete events[key];
            } else if (BI.isArray(this[keys[0]]) || BI.isPlainObject(this[keys[0]])) {
                list = this[keys[0]]
                delete events[key];
            }
            off.populate(list);
            bind.populate(list);
        }
        return BI.View.superclass.delegateEvents.apply(this, [events]);
    },

    _vessel: function () {
        this._cardLayouts = {};
        this._cardLayouts[this.getName()] = new BI.CardLayout({
            element: this.element
        });
        var vessel = BI.createWidget();
        this._cardLayouts[this.getName()].addCardByName(this.getName(), vessel);
        return vessel.element;
    },

    _render: function (vessel) {
        return this;
    },

    /**
     * 创建儿子所在容器
     * @param key
     * @param vessel
     * @param options  isLayer:是否是弹出层, defaultShowName:默认显示项
     * @returns {BI.View}
     */
    addSubVessel: function (key, vessel, options) {
        options || (options = {});
        this._cardLayouts || (this._cardLayouts = {});
        var id = key + this.cid;
        options.isLayer && (vessel = BI.Layers.has(id) ? BI.Layers.get(id) : BI.Layers.create(id, vessel));
        if (this._cardLayouts[key]) {
            options.defaultShowName && this._cardLayouts[key].setDefaultShowName(options.defaultShowName);
            this._cardLayouts[key].setElement(vessel) && this._cardLayouts[key].resize();
            return this;
        }
        this._cardLayouts[key] = BI.createWidget({
            type: "bi.card",
            element: vessel,
            defaultShowName: options.defaultShowName
        });
        return this;
    },

    removeSubVessel: function (key) {
        var self = this, id = key + this.cid;
        BI.Layers.remove(id);
        var cardNames = this._cardLayouts[key] && this._cardLayouts[key].getAllCardNames();
        BI.each(cardNames, function (i, name) {
            delete self._cards[name];
        });
        this._cardLayouts[key] && this._cardLayouts[key].destroy();
        return this;
    },

    createView: function (url, modelData, viewData) {
        return BI.Factory.createView(url, this.get(url), modelData, viewData);
    },

    /**
     * 跳转到指定的card
     * @param cardName
     */
    skipTo: function (cardName, layout, modelData, viewData, options) {
        if (this.model._start === true || this._changing_ === true) {
            this._F.push({f: this.skipTo, arg: arguments});
            return this;
        }
        var self = this, isValid = BI.isKey(modelData), data = void 0;
        BI.isKey(layout) && (layout = layout + "");
        layout = layout || this.getName();
        options || (options = {});
        if (isValid) {
            modelData = modelData + "";//避免modelData是数字
            var keys = modelData.split('.');
            BI.each(keys, function (i, k) {
                if (i === 0) {
                    data = self.model.get(k) || {};
                } else {
                    data = data[k] || {};
                }
            });
            data.id = options.id || keys[keys.length - 1];
        } else {
            data = modelData;
        }
        BI.extend(data, options.data);
        var action = options.action || new BI.ShowAction();
        var cardLayout = this._cardLayouts[layout];
        if (!cardLayout) {
            return this;
        }
        cardLayout.setVisible(true);
        if (BI.isKey(cardName) && !cardLayout.isCardExisted(cardName)) {
            var view = this.createView(this.rootURL + "/" + cardName, data, viewData);
            isValid && this.model.addChild(modelData, view.model);
            view.listenTo(view.model, "destroy", function () {
                delete self._cards[cardName];
                cardLayout.deleteCardByName(cardName);
                if (cardLayout.isAllCardHide()) {
                    cardLayout.setVisible(false);
                    BI.Layers.hide(layout + self.cid);
                }
            }).listenTo(view.model, "unset", function () {
                delete self._cards[cardName];
                cardLayout.deleteCardByName(cardName);
            });
            cardLayout.addCardByName(cardName, view);
            this._cards || (this._cards = {});
            this._cards[cardName] = view;
            data = {};
            this.on("end:" + view.cid, function () {
                var isNew = false, t, keys;
                if (isValid) {
                    keys = modelData.split('.');
                    BI.each(keys, function (i, k) {
                        if (i === 0) {
                            t = self.model.get(k) || (isNew = true);
                        } else {
                            t = t[k] || (isNew = true);
                        }
                    });
                }
                if (isNew) {
                    delete self._cards[cardName];
                    self.model.removeChild(modelData, view.model);
                    cardLayout.deleteCardByName(cardName);
                    view.destroy();
                    cardLayout.setVisible(false);
                }
                action.actionBack(view, null, function () {
                    if (cardLayout.isAllCardHide()) {
                        cardLayout.setVisible(false);
                        BI.Layers.hide(layout + self.cid);
                    }
                    !isNew && (self.listenEnd.apply(self, isValid ? keys : [modelData]) !== false) && self.populate();
                })
            }).on("change:" + view.cid, _.bind(this.notifyParent, this));
        }
        BI.isKey(cardName) && BI.Layers.show(layout + this.cid);
        cardLayout.showCardByName(cardName, action, function () {
            BI.isKey(cardName) && self._cards[cardName].populate(data, options);
        });
        !BI.isKey(cardName) && BI.Layers.hide(layout + this.cid);
        return this._cards[cardName];
    },

    listenEnd: function (key1, key2, key3) {
        return this;
    },

    /**
     * 告诉父亲我的操作结束了，后面的事情任由父亲处置
     * @param force 强制下次再次进入该节点时不进行刷新操作， 默认执行刷新
     * @returns {BI.View}
     */
    notifyParentEnd: function (force) {
        this.parent && this.parent.trigger("end:" + this.cid);
        this.trigger("end");
        !force && this.notify();
        return this;
    },

    /**
     * 通知父亲我的数据发生了变化
     */
    notifyParent: function () {
        this.parent && this.parent.notify().trigger("change:" + this.cid);
        return this;
    },

    /**
     * 告诉Model数据改变了
     */
    notify: function () {
        this.model.unset("current", {silent: true});
        return this;
    },

    getName: function () {
        return "VIEW"
    },

    /**
     * 全局刷新
     * @param current
     */
    refresh: function (current) {
    },
    /**
     * 局部刷新
     */
    local: function () {
        return false;
    },

    load: function (data) {

    },

    readData: function (force, options) {
        options || (options = {});
        var self = this;
        var args = [].slice.call(arguments, 2);
        if (!force && this._readed === true) {//只从后台获取一次数据
            callback(this.model.toJSON());
            return;
        }
        //采用静默方式读数据,该数据变化不引起data的change事件触发
        var success = options.success;
        this.read(BI.extend({
            silent: true
        }, options, {
            success: function (data, model) {
                callback(data);
                !force && (self._readed = true);
                self.delegateEvents();
                success && success(data, model);
            }
        }));
        function callback(data) {
            self.model.load(data);
            self.load(data);
            BI.each(args, function (i, arg) {
                if (BI.isFunction(arg)) {
                    arg.apply(self, [data]);
                }
            })
        }
    },

    //处理model的通用方法
    cat: function () {
        return this.model.cat.apply(this.model, arguments);
    },

    get: function () {
        return this.model.get.apply(this.model, arguments);
    },

    set: function () {
        return this.model.set.apply(this.model, arguments);
    },

    has: function () {
        return this.model.has.apply(this.model, arguments);
    },

    getEditing: function () {
        return this.model.getEditing();
    },

    read: function (options) {
        this.model.read(options)
    },

    update: function (options) {
        this.model.update(options);
    },

    patch: function (options) {
        this.model.patch(options);
    },

    reading: function (options) {
        var self = this;
        var name = BI.UUID();
        this.read(BI.extend({}, options, {
            beforeSend: function () {
                var loading = BI.createWidget({
                    type: 'bi.vertical',
                    items: [{
                        type: "bi.layout",
                        height: 30,
                        cls: "loading-background"
                    }],
                    element: BI.Maskers.make(name, self)
                });
                loading.setVisible(true);
            },
            complete: function (data) {
                options.complete && options.complete(data);
                BI.Maskers.remove(name);
            }
        }));
    },

    updating: function (options) {
        var self = this;
        var name = BI.UUID();
        this.update(BI.extend({}, options, {
            noset: true,
            beforeSend: function () {
                var loading = BI.createWidget({
                    type: 'bi.vertical',
                    items: [{
                        type: "bi.layout",
                        height: 30,
                        cls: "loading-background"
                    }],
                    element: BI.Maskers.make(name, self)
                });
                loading.setVisible(true);
            },
            complete: function (data) {
                options.complete && options.complete(data);
                BI.Maskers.remove(name);
            }
        }));
    },

    patching: function (options) {
        var self = this;
        var name = BI.UUID();
        this.patch(BI.extend({}, options, {
            noset: true,
            beforeSend: function () {
                var loading = BI.createWidget({
                    type: 'bi.vertical',
                    items: [{
                        type: "bi.layout",
                        height: 30,
                        cls: "loading-background"
                    }],
                    element: BI.Maskers.make(name, self)
                });
                loading.setVisible(true);
            },
            complete: function (data) {
                options.complete && options.complete(data);
                BI.Maskers.remove(name);
            }
        }));
    },

    populate: function (modelData, options) {
        var self = this;
        options || (options = {});
        if (options.force === true) {
            this.notify();
        }
        if (this._cardLayouts && this._cardLayouts[this.getName()]) {
            this._cardLayouts[this.getName()].showCardByName(this.getName());
        }
        //BI.each(this._cardLayouts, function (key, layout) {
        //    layout.showCardByName(layout.getDefaultShowName() || self.getName());
        //});
        //BI.each(this._cards, function (i, card) {
        //    card.notify && card.notify();
        //});
        if (this._F.length > 0) {
            throw new Error("流程错误");
        }
        if (options.force === true) {
            this.model.set(modelData, options).set({current: this.model.get("default")});
            return;
        }
        if (options.force === false) {
            this.model.set(modelData);
            return;
        }
        var filter = BI.clone(modelData || {});
        delete filter.id;
        var contains = BI.has(this.model.toJSON(), _.keys(filter));
        var match = BI.isEmpty(filter) || (contains && this.model.matches(modelData));
        if (match === true) {
            this.model.set({current: this.model.get("default")});
        } else if (contains === false) {
            this.model.set(modelData);
        } else {
            this.model.set(modelData, options).set({current: this.model.get("default")});
        }
    },

    //删除子节点触发
    splice: function (old, key1, key2, key3) {

    },

    //复制子节点触发
    duplicate: function (copy, key1, key2, key3) {

    },

    destroy: function () {
        BI.each(this._cardLayouts, function (name, card) {
            card && card.destroy();
        });
        delete this._cardLayouts;
        delete this._cards;
        this.remove();
        this.destroyed();
    },

    destroyed: function () {

    }
});(function ($) {

    var kv = {}; // alex:键(编辑器简称,如text)值(也是一个字符串,如FR.TextEditor)对
    $.shortcut = function (xtype, cls) {
        if (kv[xtype] != null) {
            throw ("shortcut:[" + xtype + "] has been registed");
        }
        kv[xtype] = cls;
        $.extend(cls.prototype, {
            xtype: xtype
        })
    };

    // 根据配置属性生成widget
    var createWidget = function (config) {
        // alex:如果是一个jquery对象,就在外面套一层,变成一个FR.Widget
        if (config instanceof $) {
            return new BI.Widget({
                element: config
            });
        }
        if (config['classType']) {
            return new (new Function('return ' + config['classType'] + ';')())(config);
        }

        if (!config.type) {

        }
        var xtype = config.type.toLowerCase();
        var cls = kv[xtype];
        return new cls(config);
    };

    BI.createWidget = function (item, options) {
        var el;
        options || (options = {});
        if (BI.isEmpty(item) && BI.isEmpty(options)) {
            return BI.Plugin.getObject("bi.layout", BI.createWidget({
                type: "bi.layout"
            }));
        }
        if (BI.isWidget(item)) {
            return item;
        }
        if (item && (item.type || options.type)) {
            el = BI.extend({}, options, item);
            return BI.Plugin.getObject(el.type, createWidget(BI.Plugin.getWidget(el.type, el)));
        }
        if (item && item.el && (item.el.type || options.type)) {
            el = BI.extend({}, options, item.el);
            return BI.Plugin.getObject(el.type, createWidget(BI.Plugin.getWidget(el.type, el)));
        }
        if (item && BI.isWidget(item.el)) {
            return item.el;
        }
        throw new Error('无法根据item创建组件');
    }

})(jQuery);(function (window, undefined) {
    function aspect(type) {
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

})(window);;
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
    })
})();BI.CellSizeAndPositionManager = function (cellCount, cellSizeGetter, estimatedCellSize) {
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
        }
    },

    getTotalSize: function () {
        var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
        return lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size + (this._cellCount - this._lastMeasuredIndex - 1) * this._estimatedCellSize
    },

    getUpdatedOffsetForIndex: function (align, containerSize, currentOffset, targetIndex) {
        var datum = this.getSizeAndPositionOfCell(targetIndex);
        var maxOffset = datum.offset;
        var minOffset = maxOffset - containerSize + datum.size;

        var idealOffset;

        switch (align) {
            case 'start':
                idealOffset = maxOffset;
                break;
            case 'end':
                idealOffset = minOffset;
                break;
            case 'center':
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
            return {}
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
        }
    },

    resetCell: function (index) {
        this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, index - 1)
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
        } else {
            return this._exponentialSearch(lastMeasuredIndex, offset);
        }
    }
};

BI.ScalingCellSizeAndPositionManager = function (cellCount, cellSizeGetter, estimatedCellSize, maxScrollSize) {
    this._cellSizeAndPositionManager = new BI.CellSizeAndPositionManager(cellCount, cellSizeGetter, estimatedCellSize);
    this._maxScrollSize = maxScrollSize || 10000000
};

BI.ScalingCellSizeAndPositionManager.prototype = {
    constructor: BI.ScalingCellSizeAndPositionManager,

    configure: function () {
        this._cellSizeAndPositionManager.configure.apply(this._cellSizeAndPositionManager, arguments);
    },

    getCellCount: function () {
        return this._cellSizeAndPositionManager.getCellCount()
    },

    getEstimatedCellSize: function () {
        return this._cellSizeAndPositionManager.getEstimatedCellSize()
    },

    getLastMeasuredIndex: function () {
        return this._cellSizeAndPositionManager.getLastMeasuredIndex()
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
        this._cellSizeAndPositionManager.resetCell(index)
    },

    _getOffsetPercentage: function (containerSize, offset, totalSize) {
        return totalSize <= containerSize
            ? 0
            : offset / (totalSize - containerSize)
    },

    _offsetToSafeOffset: function (containerSize, offset) {
        var totalSize = this._cellSizeAndPositionManager.getTotalSize();
        var safeTotalSize = this.getTotalSize();

        if (totalSize === safeTotalSize) {
            return offset;
        } else {
            var offsetPercentage = this._getOffsetPercentage(containerSize, offset, totalSize);

            return Math.round(offsetPercentage * (safeTotalSize - containerSize));
        }
    },

    _safeOffsetToOffset: function (containerSize, offset) {
        var totalSize = this._cellSizeAndPositionManager.getTotalSize();
        var safeTotalSize = this.getTotalSize();

        if (totalSize === safeTotalSize) {
            return offset;
        } else {
            var offsetPercentage = this._getOffsetPercentage(containerSize, offset, safeTotalSize);

            return Math.round(offsetPercentage * (totalSize - containerSize));
        }
    }
};/**
 * 汉字拼音索引
 */
;
!(function () {
    var _ChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBR"
        + "CFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZ"
        + "YRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZ"
        + "ZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZN"
        + "TYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJ"
        + "KQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXK"
        + "WYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSD"
        + "CJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHN"
        + "GPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZ"
        + "SZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGX"
        + "XZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTT"
        + "TKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDK"
        + "HNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCM"
        + "BJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZH"
        + "QKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJ"
        + "SZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHH"
        + "ARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKK"
        + "BXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJ"
        + "QFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQY"
        + "TLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZ"
        + "SQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDP"
        + "JHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLR"
        + "DTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBM"
        + "YHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJ"
        + "HKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQ"
        + "HHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZK"
        + "DDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCS"
        + "ZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCX"
        + "TCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZ"
        + "QAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKT"
        + "CSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLK"
        + "QUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZ"
        + "RNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYS"
        + "JTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHL"
        + "LQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQ"
        + "XRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLL"
        + "BNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJ"
        + "MHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFF"
        + "YTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQ"
        + "XSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJH"
        + "FXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLW"
        + "TGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQY"
        + "BKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLT"
        + "YXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQY"
        + "WRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTM"
        + "LRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTY"
        + "NXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXC"
        + "HXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSL"
        + "LLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXS"
        + "XNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDX"
        + "YYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTY"
        + "YMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHK"
        + "ZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYG"
        + "ZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQ"
        + "STDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQ"
        + "XQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXB"
        + "QKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSL"
        + "DLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSS"
        + "NXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWB"
        + "ZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZ"
        + "QPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGW"
        + "SGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJH"
        + "CLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPK"
        + "YGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDK"
        + "NTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYS"
        + "XDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRB"
        + "CQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKX"
        + "WYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYY"
        + "ZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJ"
        + "BZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQY"
        + "QQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXY"
        + "SZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXC"
        + "QQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQT"
        + "TFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJ"
        + "CJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXW"
        + "WGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSR"
        + "NQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXH"
        + "LHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJ"
        + "ZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLG"
        + "YJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDF"
        + "QTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZ"
        + "ZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYE"
        + "BHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMC"
        + "LLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFY"
        + "WHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZY"
        + "ZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMS"
        + "TPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZML"
        + "LJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJ"
        + "ZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJM"
        + "KMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQX"
        + "YJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQT"
        + "MYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZM"
        + "CYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZH"
        + "HXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJE"
        + "CXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLL"
        + "XDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZE"
        + "AWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJ"
        + "YHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHL"
        + "RMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPN"
        + "HMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQ"
        + "DCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";

    //此处收录了375个多音字,数据来自于http://www.51window.net/page/pinyin
    var oMultiDiff = {
        "19969": "DZ",
        "19975": "WM",
        "19988": "QJ",
        "20048": "YL",
        "20056": "SC",
        "20060": "NM",
        "20094": "QG",
        "20127": "QJ",
        "20167": "QC",
        "20193": "YG",
        "20250": "KH",
        "20256": "ZC",
        "20282": "SC",
        "20285": "QJG",
        "20291": "TD",
        "20314": "YD",
        "20340": "NE",
        "20375": "TD",
        "20389": "YJ",
        "20391": "CZ",
        "20415": "PB",
        "20446": "YS",
        "20447": "SQ",
        "20504": "TC",
        "20608": "KG",
        "20854": "QJ",
        "20857": "ZC",
        "20911": "PF",
        "20504": "TC",
        "20608": "KG",
        "20854": "QJ",
        "20857": "ZC",
        "20911": "PF",
        "20985": "AW",
        "21032": "PB",
        "21048": "XQ",
        "21049": "SC",
        "21089": "YS",
        "21119": "JC",
        "21242": "SB",
        "21273": "SC",
        "21305": "YP",
        "21306": "QO",
        "21330": "ZC",
        "21333": "SDC",
        "21345": "QK",
        "21378": "CA",
        "21397": "SC",
        "21414": "XS",
        "21442": "SC",
        "21477": "JG",
        "21480": "TD",
        "21484": "ZS",
        "21494": "YX",
        "21505": "YX",
        "21512": "HG",
        "21523": "XH",
        "21537": "PB",
        "21542": "PF",
        "21549": "KH",
        "21571": "E",
        "21574": "DA",
        "21588": "TD",
        "21589": "O",
        "21618": "ZC",
        "21621": "KHA",
        "21632": "ZJ",
        "21654": "KG",
        "21679": "LKG",
        "21683": "KH",
        "21710": "A",
        "21719": "YH",
        "21734": "WOE",
        "21769": "A",
        "21780": "WN",
        "21804": "XH",
        "21834": "A",
        "21899": "ZD",
        "21903": "RN",
        "21908": "WO",
        "21939": "ZC",
        "21956": "SA",
        "21964": "YA",
        "21970": "TD",
        "22003": "A",
        "22031": "JG",
        "22040": "XS",
        "22060": "ZC",
        "22066": "ZC",
        "22079": "MH",
        "22129": "XJ",
        "22179": "XA",
        "22237": "NJ",
        "22244": "TD",
        "22280": "JQ",
        "22300": "YH",
        "22313": "XW",
        "22331": "YQ",
        "22343": "YJ",
        "22351": "PH",
        "22395": "DC",
        "22412": "TD",
        "22484": "PB",
        "22500": "PB",
        "22534": "ZD",
        "22549": "DH",
        "22561": "PB",
        "22612": "TD",
        "22771": "KQ",
        "22831": "HB",
        "22841": "JG",
        "22855": "QJ",
        "22865": "XQ",
        "23013": "ML",
        "23081": "WM",
        "23487": "SX",
        "23558": "QJ",
        "23561": "YW",
        "23586": "YW",
        "23614": "YW",
        "23615": "SN",
        "23631": "PB",
        "23646": "ZS",
        "23663": "ZT",
        "23673": "YG",
        "23762": "TD",
        "23769": "ZS",
        "23780": "QJ",
        "23884": "QK",
        "24055": "XH",
        "24113": "DC",
        "24162": "ZC",
        "24191": "GA",
        "24273": "QJ",
        "24324": "NL",
        "24377": "TD",
        "24378": "QJ",
        "24439": "PF",
        "24554": "ZS",
        "24683": "TD",
        "24694": "WE",
        "24733": "LK",
        "24925": "TN",
        "25094": "ZG",
        "25100": "XQ",
        "25103": "XH",
        "25153": "PB",
        "25170": "PB",
        "25179": "KG",
        "25203": "PB",
        "25240": "ZS",
        "25282": "FB",
        "25303": "NA",
        "25324": "KG",
        "25341": "ZY",
        "25373": "WZ",
        "25375": "XJ",
        "25384": "A",
        "25457": "A",
        "25528": "SD",
        "25530": "SC",
        "25552": "TD",
        "25774": "ZC",
        "25874": "ZC",
        "26044": "YW",
        "26080": "WM",
        "26292": "PB",
        "26333": "PB",
        "26355": "ZY",
        "26366": "CZ",
        "26397": "ZC",
        "26399": "QJ",
        "26415": "ZS",
        "26451": "SB",
        "26526": "ZC",
        "26552": "JG",
        "26561": "TD",
        "26588": "JG",
        "26597": "CZ",
        "26629": "ZS",
        "26638": "YL",
        "26646": "XQ",
        "26653": "KG",
        "26657": "XJ",
        "26727": "HG",
        "26894": "ZC",
        "26937": "ZS",
        "26946": "ZC",
        "26999": "KJ",
        "27099": "KJ",
        "27449": "YQ",
        "27481": "XS",
        "27542": "ZS",
        "27663": "ZS",
        "27748": "TS",
        "27784": "SC",
        "27788": "ZD",
        "27795": "TD",
        "27812": "O",
        "27850": "PB",
        "27852": "MB",
        "27895": "SL",
        "27898": "PL",
        "27973": "QJ",
        "27981": "KH",
        "27986": "HX",
        "27994": "XJ",
        "28044": "YC",
        "28065": "WG",
        "28177": "SM",
        "28267": "QJ",
        "28291": "KH",
        "28337": "ZQ",
        "28463": "TL",
        "28548": "DC",
        "28601": "TD",
        "28689": "PB",
        "28805": "JG",
        "28820": "QG",
        "28846": "PB",
        "28952": "TD",
        "28975": "ZC",
        "29100": "A",
        "29325": "QJ",
        "29575": "SL",
        "29602": "FB",
        "30010": "TD",
        "30044": "CX",
        "30058": "PF",
        "30091": "YSP",
        "30111": "YN",
        "30229": "XJ",
        "30427": "SC",
        "30465": "SX",
        "30631": "YQ",
        "30655": "QJ",
        "30684": "QJG",
        "30707": "SD",
        "30729": "XH",
        "30796": "LG",
        "30917": "PB",
        "31074": "NM",
        "31085": "JZ",
        "31109": "SC",
        "31181": "ZC",
        "31192": "MLB",
        "31293": "JQ",
        "31400": "YX",
        "31584": "YJ",
        "31896": "ZN",
        "31909": "ZY",
        "31995": "XJ",
        "32321": "PF",
        "32327": "ZY",
        "32418": "HG",
        "32420": "XQ",
        "32421": "HG",
        "32438": "LG",
        "32473": "GJ",
        "32488": "TD",
        "32521": "QJ",
        "32527": "PB",
        "32562": "ZSQ",
        "32564": "JZ",
        "32735": "ZD",
        "32793": "PB",
        "33071": "PF",
        "33098": "XL",
        "33100": "YA",
        "33152": "PB",
        "33261": "CX",
        "33324": "BP",
        "33333": "TD",
        "33406": "YA",
        "33426": "WM",
        "33432": "PB",
        "33445": "JG",
        "33486": "ZN",
        "33493": "TS",
        "33507": "QJ",
        "33540": "QJ",
        "33544": "ZC",
        "33564": "XQ",
        "33617": "YT",
        "33632": "QJ",
        "33636": "XH",
        "33637": "YX",
        "33694": "WG",
        "33705": "PF",
        "33728": "YW",
        "33882": "SR",
        "34067": "WM",
        "34074": "YW",
        "34121": "QJ",
        "34255": "ZC",
        "34259": "XL",
        "34425": "JH",
        "34430": "XH",
        "34485": "KH",
        "34503": "YS",
        "34532": "HG",
        "34552": "XS",
        "34558": "YE",
        "34593": "ZL",
        "34660": "YQ",
        "34892": "XH",
        "34928": "SC",
        "34999": "QJ",
        "35048": "PB",
        "35059": "SC",
        "35098": "ZC",
        "35203": "TQ",
        "35265": "JX",
        "35299": "JX",
        "35782": "SZ",
        "35828": "YS",
        "35830": "E",
        "35843": "TD",
        "35895": "YG",
        "35977": "MH",
        "36158": "JG",
        "36228": "QJ",
        "36426": "XQ",
        "36466": "DC",
        "36710": "JC",
        "36711": "ZYG",
        "36767": "PB",
        "36866": "SK",
        "36951": "YW",
        "37034": "YX",
        "37063": "XH",
        "37218": "ZC",
        "37325": "ZC",
        "38063": "PB",
        "38079": "TD",
        "38085": "QY",
        "38107": "DC",
        "38116": "TD",
        "38123": "YD",
        "38224": "HG",
        "38241": "XTC",
        "38271": "ZC",
        "38415": "YE",
        "38426": "KH",
        "38461": "YD",
        "38463": "AE",
        "38466": "PB",
        "38477": "XJ",
        "38518": "YT",
        "38551": "WK",
        "38585": "ZC",
        "38704": "XS",
        "38739": "LJ",
        "38761": "GJ",
        "38808": "SQ",
        "39048": "JG",
        "39049": "XJ",
        "39052": "HG",
        "39076": "CZ",
        "39271": "XT",
        "39534": "TD",
        "39552": "TD",
        "39584": "PB",
        "39647": "SB",
        "39730": "LG",
        "39748": "TPB",
        "40109": "ZQ",
        "40479": "ND",
        "40516": "HG",
        "40536": "HG",
        "40583": "QJ",
        "40765": "YQ",
        "40784": "QJ",
        "40840": "YK",
        "40863": "QJG"
    };

    var _checkPYCh = function (ch) {
        var uni = ch.charCodeAt(0);
        // 如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
        if (uni > 40869 || uni < 19968)
            return ch; // dealWithOthers(ch);
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
            if (typeof (str) != "string")
                return '' + str;
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
    var _window
    if (typeof window !== 'undefined') {
        _window = window
    } else if (typeof self !== 'undefined') {
        _window = self
    } else {
        _window = this
    }

    var attachEvent = typeof document !== 'undefined' && document.attachEvent;
    var stylesCreated = false;

    if (!attachEvent) {
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
            expandChild.style.width = expand.offsetWidth + 1 + 'px';
            expandChild.style.height = expand.offsetHeight + 1 + 'px';
            expand.scrollLeft = expand.scrollWidth;
            expand.scrollTop = expand.scrollHeight;
        };

        var checkTriggers = function (element) {
            return element.offsetWidth !== element.__resizeLast__.width ||
                element.offsetHeight !== element.__resizeLast__.height;
        }

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
            animationstring = 'animation',
            keyframeprefix = '',
            animationstartevent = 'animationstart',
            domPrefixes = 'Webkit Moz O ms'.split(' '),
            startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
            pfx = '';
        {
            var elm = document.createElement('fakeelement');
            if (elm.style.animationName !== undefined) {
                animation = true;
            }

            if (animation === false) {
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                        pfx = domPrefixes[i];
                        animationstring = pfx + 'Animation';
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animationstartevent = startEvents[i];
                        animation = true;
                        break;
                    }
                }
            }
        }

        var animationName = 'resizeanim';
        var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
        var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
    }

    var createStyles = function () {
        if (!stylesCreated) {
            //opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
            var css = (animationKeyframes ? animationKeyframes : '') +
                    '.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
                    '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
            stylesCreated = true;
        }
    }

    var addResizeListener = function (element, fn) {
        if (attachEvent) element.attachEvent('onresize', fn);
        else {
            if (!element.__resizeTriggers__) {
                if (getComputedStyle(element).position === 'static') element.style.position = 'relative';
                createStyles();
                element.__resizeLast__ = {};
                element.__resizeListeners__ = [];
                (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
                element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
                    '<div class="contract-trigger"></div>';
                element.appendChild(element.__resizeTriggers__);
                resetTriggers(element);
                element.addEventListener('scroll', scrollListener, true);

                /* Listen for a css animation to detect element display/re-attach */
                animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function (e) {
                    if (e.animationName === animationName)
                        resetTriggers(element);
                });
            }
            element.__resizeListeners__.push(fn);
        }
    };

    var removeResizeListener = function (element, fn) {
        if (attachEvent) element.detachEvent('onresize', fn);
        else {
            element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if (!element.__resizeListeners__.length) {
                element.removeEventListener('scroll', scrollListener, true);
                element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
            }
        }
    }

    BI.ResizeDetector = {
        addResizeListener: function (widget, fn) {
            addResizeListener(widget.element[0], fn);
        },
        removeResizeListener: function (widget, fn) {
            removeResizeListener(widget.element[0], fn);
        }
    };
}());
;
(function () {
    function defaultComparator(a, b) {
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
    }
})();
;(function () {
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
            return defaultRowHeight
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
    getSize: function () /*number*/ {
        return this._size;
    },

    getValuePosition: function (/*number*/ value) /*?number*/ {
        if (this._valueToPositionMap[value] === undefined) {
            return null;
        }
        return this._valueToPositionMap[value];
    },

    getNewPositionForValue: function (/*number*/ value) /*number*/ {
        var newPosition = this._size;
        this._size++;
        this._pushToHeaps(newPosition, value);
        this._valueToPositionMap[value] = newPosition;
        return newPosition;
    },

    replaceFurthestValuePosition: function (/*number*/ lowValue,
                                            /*number*/ highValue,
                                            /*number*/ newValue) /*?number*/ {
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

    _pushToHeaps: function (/*number*/ position, /*number*/ value) {
        var element = {
            position: position,
            value:value
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

    _cleanHeap: function (/*object*/ heap) {
        while (!heap.empty() &&
        this._valueToPositionMap[heap.peek().value] === undefined) {
            heap.pop();
        }
    },

    _smallerComparator: function (/*object*/ lhs, /*object*/ rhs) /*boolean*/ {
        return lhs.value < rhs.value;
    },

    _greaterComparator: function (/*object*/ lhs, /*object*/ rhs) /*boolean*/ {
        return lhs.value > rhs.value;
    }
};
;
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
            if (typeof key == 'undefined') {
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
            if (fn == null || typeof (fn) != "function") {
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
            })
            return array;
        }
    }
})();window.BI = window.BI || {};

$.extend(BI, {
    $defaultImport: function (options) {
        var config = $.extend({
            op: 'resource',
            path: null,
            type: null,
            must: false
        }, options);
        config.url = FR.servletURL + '?op=' + config.op + '&resource=' + config.path;
        this.$import(config.url, config.type,config.must);
    },
    $import: function () {
        var _LOADED = {}; // alex:保存加载过的
        function loadReady(src, must) {
            var $scripts = $("head script");
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
            if (ext === 'css') {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = src;
                var head = document.getElementsByTagName('head')[0];
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
                        if (status == 'success') {
                            _LOADED[src] = true;
                        }
                    }
                })
            }
        }
    }()
});;
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
                entry.older = this.tail
            } else {
                this.head = entry
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
                : entry.value
        }
        // HEAD--------------TAIL
        //   <.older   .newer>
        //  <--- add direction --
        //   A  B  C  <D>  E
        if (entry.newer) {
            if (entry === this.head) {
                this.head = entry.newer
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
            : entry.value
    };
})();;
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
        if (bkey.length > 16)
            bkey = this.core_md5(bkey, key.length * this.chrsz);

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
        for (var i = 0; i < str.length * this.chrsz; i += this.chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
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
                if (i * 8 + j * 6 > binarray.length * 32)
                    str += this.b64pad;
                else
                    str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    };
    BI.MD5 = new MD5();
})();//线段树
;(function () {
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

    BI.PrefixIntervalTree.empty = function () {
        return BI.PrefixIntervalTree.uniform(size, 0);
    };

})();
;
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

        getElementByIndex: function(index) {
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
        
        splice: function() {
            this.array.splice.apply(this.array, arguments);  
        },
        
        slice: function() {
            this.array.slice.apply(this.array, arguments);    
        },
        
        size: function () {
            return this.array.length;
        },

        each: function (fn, scope) {
            var scope = scope || window;
            var fn = fn || null;
            if (fn == null || typeof (fn) != "function") {
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
            })
        },

        clear: function () {
            this.array.clear();
        }
    }
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
            return this._indices
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
                    indices[index] = index
                })
            });

            return BI.map(BI.keys(indices), function (i, index) {
                return indices[index]
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
                        this._sections[key] = new Section(this._sectionSize, this._sectionSize, sectionX * this._sectionSize, sectionY * this._sectionSize)
                    }

                    sections.push(this._sections[key])
                }
            }

            return sections
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
    }
})();if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {

} else {
    Set = function () {
        this.set = {}
    };
    Set.prototype.has = function (key) {
        return this.set[key] !== undefined;
    };
    Set.prototype.add = function (key) {
        this.set[key] = 1
    };
    Set.prototype.clear = function () {
        this.set = {}
    };
};
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
    }

})();
;
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
            return node === this.root || node.id === this.root.id;
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
                })
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

        //中序遍历(递归)
        _inOrderTraverse: function (node, callback) {
            if (node != null) {
                this._inOrderTraverse(node.getLeft());
                callback && callback(node);
                this._inOrderTraverse(node.getRight());
            }
        },

        //中序遍历(非递归)
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

        //先序遍历(递归)
        _preOrderTraverse: function (node, callback) {
            if (node != null) {
                callback && callback(node);
                this._preOrderTraverse(node.getLeft());
                this._preOrderTraverse(node.getRight());
            }
        },

        //先序遍历（非递归）
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

        //后序遍历(递归)
        _postOrderTraverse: function (node, callback) {
            if (node != null) {
                this._postOrderTraverse(node.getLeft());
                this._postOrderTraverse(node.getRight());
                callback && callback(node);
            }
        },

        //后续遍历(非递归)
        nrPostOrderTraverse: function (callback) {

            var stack = [];
            var node = this.root;
            var preNode = null;//表示最近一次访问的节点

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
                this.getChild(cur).setRight(child);
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
                    node.pId = pId;
                    delete node.children;
                    r.push(node);
                    if (nodes[i]["children"]) {
                        r = r.concat(BI.Tree.transformToArrayFormat(nodes[i]["children"], node.id));
                    }
                }
            } else {
                var newNodes = BI.clone(nodes);
                newNodes.pId = pId;
                delete newNodes.children;
                r.push(newNodes);
                if (nodes["children"]) {
                    r = r.concat(BI.Tree.transformToArrayFormat(nodes["children"], newNodes.id));
                }
            }
            return r;
        },

        arrayFormat: function (nodes, pId) {
            if (!nodes) return [];
            var r = [];
            if (BI.isArray(nodes)) {
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    r.push(node);
                    if (nodes[i]["children"]) {
                        r = r.concat(BI.Tree.transformToArrayFormat(nodes[i]["children"], node.id));
                    }
                }
            } else {
                var newNodes = nodes;
                r.push(newNodes);
                if (nodes["children"]) {
                    r = r.concat(BI.Tree.transformToArrayFormat(nodes["children"], newNodes.id));
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
                    if(BI.isNull(sNodes[i].id)) {
                        return sNodes;
                    }
                    tmpMap[sNodes[i].id] = BI.clone(sNodes[i]);
                }
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (tmpMap[sNodes[i].pId] && sNodes[i].id != sNodes[i].pId) {
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
            } else {
                return [sNodes];
            }
        }
    })
})();//向量操作
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
    //判断两个区域是否相交，若相交，则要么顶点互相包含，要么矩形边界（或对角线）相交
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
        } else if (obj.x != null && obj.y != null)//判断矩形对角线相交 |v1 X v2||v1 X v3| < 0
        {
            var vector1 = new BI.Vector(this.w, this.h);//矩形对角线向量
            var vector2 = new BI.Vector(obj.x - this.x, obj.y - this.y);
            var vector3 = new BI.Vector(vector2.x + obj.w, vector2.y + obj.h);
            if ((vector1.cross(vector2) * vector1.cross(vector3)) < 0) {
                return true;
            }
        }
        return false;
    },
    //判断一个点是否在这个区域内部
    isPointInside: function (x, y) {
        if (this.x == null || this.y == null) {
            return false;
        }
        if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
            return true;
        }
        return false;
    },
    //返回区域的重心，因为是矩形所以返回中点
    getPosition: function () {
        var pos = [];
        pos.push(this.x + this.w / 2);
        pos.push(this.y + this.h / 2);
        return pos;
    }
};;
!(function (BI) {

    if (BI.isIE()) {
        XMLSerializer = null;
        DOMParser = null;
    }


    var XML = {
        Document: {
            NodeType: {
                ELEMENT: 1,
                ATTRIBUTE: 2,
                TEXT: 3,
                CDATA_SECTION: 4,
                ENTITY_REFERENCE: 5,
                ENTITY: 6,
                PROCESSING_INSTRUCTION: 7,
                COMMENT: 8,
                DOCUMENT: 9,
                DOCUMENT_TYPE: 10,
                DOCUMENT_FRAGMENT: 11,
                NOTATION: 12
            }
        }
    };

    XML.ResultType = {
        single: 'single',
        array: 'array'
    };

    XML.fromString = function (xmlStr) {
        try {
            var parser = new DOMParser();
            return parser.parseFromString(xmlStr, "text/xml");
        } catch (e) {
            var arrMSXML = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0"];
            for (var i = 0; i < arrMSXML.length; i++) {
                try {
                    var xmlDoc = new ActiveXObject(arrMSXML[i]);
                    xmlDoc.setProperty("SelectionLanguage", "XPath");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlStr);
                    return xmlDoc;
                } catch (xmlError) {
                }
            }
        }
    };

    XML.toString = function (xmlNode) {
        if (!BI.isIE()) {
            var xmlSerializer = new XMLSerializer();
            return xmlSerializer.serializeToString(xmlNode);
        } else
            return xmlNode.xml;
    };

    XML.getNSResolver = function (str) {
        if (!str)
            return null;
        var list = str.split(' ');
        var namespaces = {};
        for (var i = 0; i < list.length; i++) {
            var pair = list[i].split('=');
            var fix = BI.trim(pair[0]).replace("xmlns:", "");
            namespaces[fix] = BI.trim(pair[1]).replace(/"/g, "").replace(/'/g, "");
        }
        return function (prefix) {
            return namespaces[prefix];
        };
    };

    XML.eval = function (context, xpathExp, resultType, namespaces) {
        if ((BI.isIE() && ('undefined' === typeof(context.selectSingleNode) || 'undefined' === typeof(context.selectNodes)))) {
            return XML.eval2(context, xpathExp, resultType, namespaces);
        } else {
            if (BI.isIE()) {
                namespaces = namespaces ? namespaces : "";
                var doc = (context.nodeType == XML.Document.NodeType.DOCUMENT) ? context : context.ownerDocument;
                doc.setProperty("SelectionNamespaces", namespaces);
                var result;
                if (resultType == this.ResultType.single) {
                    result = context.selectSingleNode(xpathExp);
                } else {
                    result = context.selectNodes(xpathExp) || [];
                }
                doc.setProperty("SelectionNamespaces", "");
                return result;
            } else {
                var node = context;
                var xmlDoc = (context.nodeName.indexOf("document") == -1) ? context.ownerDocument : context;
                var retType = (resultType == this.ResultType.single) ? XPathResult.FIRST_ORDERED_NODE_TYPE : XPathResult.ANY_TYPE;
                var col = xmlDoc.evaluate(xpathExp, node, XML.getNSResolver(namespaces), retType, null);

                if (retType == XPathResult.FIRST_ORDERED_NODE_TYPE) {
                    return col.singleNodeValue;
                } else {
                    var thisColMemb = col.iterateNext();
                    var rowsCol = [];
                    while (thisColMemb) {
                        rowsCol[rowsCol.length] = thisColMemb;
                        thisColMemb = col.iterateNext();
                    }
                    return rowsCol;
                }
            }
        }
    };

    XML.eval2 = function (context, xpathExp, resultType, namespaces) {
        if (resultType !== "single" && resultType !== undefined && resultType !== null) {
            throw new Error("justep.SimpleXML.eval只支持resultType='single', 不支持" + resultType);
        }

        if (context === null || context === undefined || xpathExp === null || xpathExp === undefined) {
            return context;
        }

        if (context.nodeType == XML.Document.NodeType.DOCUMENT) {
            context = context.documentElement;
        }

        var childs, i;
        if (xpathExp.indexOf("/") != -1) {
            var items = xpathExp.split("/");
            var isAbs = xpathExp.substring(0, 1) == "/";
            for (i = 0; i < items.length; i++) {
                var item = items[i];
                if (item === "") {
                    continue;
                } else {
                    var next = null;
                    var ii = i + 1;
                    for (; ii < items.length; ii++) {
                        if (next === null) {
                            next = items[ii];
                        } else {
                            next = next + "/" + items[ii];
                        }
                    }

                    if (item == ".") {
                        return this.eval(context, next, resultType);

                    } else if (item == "..") {
                        return this.eval2(context.parentNode, next, resultType);

                    } else if (item == "*") {
                        if (isAbs) {
                            return this.eval2(context, next, resultType);

                        } else {
                            childs = context.childNodes;
                            for (var j = 0; j < childs.length; j++) {
                                var tmp = this.eval2(childs[j], next, resultType);
                                if (tmp !== null) {
                                    return tmp;
                                }
                            }
                            return null;
                        }

                    } else {
                        if (isAbs) {
                            if (context.nodeName == item) {
                                return this.eval2(context, next, resultType);
                            } else {
                                return null;
                            }
                        } else {
                            var child = this.getChildByName(context, item);
                            if (child !== null) {
                                return this.eval2(child, next, resultType);
                            } else {
                                return null;
                            }

                        }
                    }

                }
            }

            return null;

        } else {
            if ("text()" == xpathExp) {
                childs = context.childNodes;
                for (i = 0; i < childs.length; i++) {
                    if (childs[i].nodeType == XML.Document.NodeType.TEXT) {
                        return childs[i];
                    }
                }
                return null;
            } else {
                return this.getChildByName(context, xpathExp);
            }
        }
    };

    XML.getChildByName = function (context, name) {
        if (context === null || context === undefined || name === null || name === undefined) {
            return null;
        }

        if (context.nodeType == XML.Document.NodeType.DOCUMENT) {
            context = context.documentElement;
        }

        var childs = context.childNodes;
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].nodeType == XML.Document.NodeType.ELEMENT && (childs[i].nodeName == name || name == "*")) {
                return childs[i];
            }
        }

        return null;
    };

    XML.appendChildren = function (context, xpathExp, nodes, isBefore) {
        nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
        var finded = this.eval(context, xpathExp);
        var count = finded.length;
        for (var i = 0; i < count; i++) {
            if (isBefore && finded[i].firstNode) {
                this._insertBefore(finded[i], nodes, finded[i].firstNode);
            } else {
                for (var j = 0; j < nodes.length; j++) {
                    finded[i].appendChild(nodes[j]);
                }
            }
        }
        return count;
    };

    XML.removeNodes = function (context, xpathExp) {
        var nodes = this.eval(context, xpathExp);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].parentNode.removeChild(nodes[i]);
        }
    };

    XML._insertBefore = function (parent, newchildren, refchild) {
        for (var i = 0; i < newchildren.length; i++) {
            parent.insertBefore(newchildren[i], refchild);
        }
    };

    XML.insertNodes = function (context, xpathExp, nodes, isBefore) {
        nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
        var finded = this.eval(context, xpathExp);
        var count = finded.length;
        for (var i = 0; i < count; i++) {
            var refnode = (isBefore) ? finded[i] : finded[i].nextSibling;
            this._insertBefore(finded[i].parentNode, nodes, refnode);
        }
        return count;
    };

    XML.replaceNodes = function (context, xpathExp, nodes) {
        nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
        var finded = this.eval(context, xpathExp);
        var count = finded.length;
        for (var i = 0; i < count; i++) {
            var refnode = finded[i];
            var parent = refnode.parentNode;
            this._insertBefore(parent, nodes, refnode);
            parent.removeChild(refnode);
        }
        return count;
    };

    XML.setNodeText = function (context, xpathExp, text) {
        var finded = this.eval(context, xpathExp, this.ResultType.single);
        if (finded === null)
            return;
        if (finded.nodeType == XML.Document.NodeType.ELEMENT) {
            var textNode = this.eval(finded, "./text()", this.ResultType.single);
            if (!textNode) {
                textNode = finded.ownerDocument.createTextNode("");
                finded.appendChild(textNode);
            }
            textNode.nodeValue = text;
        } else {
            finded.nodeValue = text;
        }
        return;
    };

    XML.getNodeText = function (context, xpathExp, defaultValue) {
        var finded = xpathExp ? this.eval(context, xpathExp, this.ResultType.single) : context;
        if (finded && (finded.nodeType == XML.Document.NodeType.ELEMENT)) {
            finded = this.eval(finded, "./text()", this.ResultType.single);
        }
        return (finded && finded.nodeValue) ? "" + finded.nodeValue : (defaultValue !== undefined) ? defaultValue : null;
    };

    XML.Namespaces = {
        XMLSCHEMA: "http://www.w3.org/2001/XMLSchema#",
        XMLSCHEMA_STRING: "http://www.w3.org/2001/XMLSchema#String",
        XMLSCHEMA_LONG: "http://www.w3.org/2001/XMLSchema#Long",
        XMLSCHEMA_INTEGER: 'http://www.w3.org/2001/XMLSchema#Integer',
        XMLSCHEMA_FLOAT: 'http://www.w3.org/2001/XMLSchema#Float',
        XMLSCHEMA_DOUBLE: 'http://www.w3.org/2001/XMLSchema#Double',
        XMLSCHEMA_DECIMAL: 'http://www.w3.org/2001/XMLSchema#Decimal',
        XMLSCHEMA_DATE: 'http://www.w3.org/2001/XMLSchema#Date',
        XMLSCHEMA_TIME: 'http://www.w3.org/2001/XMLSchema#Time',
        XMLSCHEMA_DATETIME: 'http://www.w3.org/2001/XMLSchema#DateTime',
        XMLSCHEMA_BOOLEAN: 'http://www.w3.org/2001/XMLSchema#Boolean',
        XMLSCHEMA_SYMBOL: 'http://www.w3.org/2001/XMLSchema#Symbol',
        JUSTEPSCHEMA: "http://www.justep.com/xbiz#",
        RDF: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        JUSTEP: "http://www.justep.com/x5#",
        'get': function (type) {
            type = type ? type.toLowerCase() : "string";
            if ("string" == type)
                return XML.Namespaces.XMLSCHEMA_STRING;
            else if ("integer" == type)
                return XML.Namespaces.XMLSCHEMA_INTEGER;
            else if ("long" == type)
                return XML.Namespaces.XMLSCHEMA_LONG;
            else if ("float" == type)
                return XML.Namespaces.XMLSCHEMA_FLOAT;
            else if ("double" == type)
                return XML.Namespaces.XMLSCHEMA_DOUBLE;
            else if ("decimal" == type)
                return XML.Namespaces.XMLSCHEMA_DECIMAL;
            else if ("date" == type)
                return XML.Namespaces.XMLSCHEMA_DATE;
            else if ("time" == type)
                return XML.Namespaces.XMLSCHEMA_TIME;
            else if ("datetime" == type)
                return XML.Namespaces.XMLSCHEMA_DATETIME;
            else if ("boolean" == type)
                return XML.Namespaces.XMLSCHEMA_BOOLEAN;
        }
    };
})(BI);BI.BehaviorFactory = {
    createBehavior: function(key, options){
        var behavior;
        switch (key){
            case "highlight":
                behavior = BI.HighlightBehavior;
                break;
            case "redmark":
                behavior = BI.RedMarkBehavior;
                break;
        }
        return new behavior(options);
    }
}

/**
 * guy
 * 行为控件
 * @class BI.Behavior
 * @extends BI.OB
 */
BI.Behavior = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.Behavior.superclass._defaultConfig.apply(this, arguments), {
            rule: function(){return true;}
        });
    },

    _init : function() {
        BI.Behavior.superclass._init.apply(this, arguments);

    },

    doBehavior: function(){

    }
});/**
 * 布局容器类
 * @class BI.Layout
 * @extends BI.Widget
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Boolean} [options.scrollable=false] 子组件超出容器边界之后是否会出现滚动条
 * @cfg {Boolean} [options.scrollx=false] 子组件超出容器边界之后是否会出现横向滚动条
 * @cfg {Boolean} [options.scrolly=false] 子组件超出容器边界之后是否会出现纵向滚动条
 */
BI.Layout = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Layout.superclass._defaultConfig.apply(this, arguments), {
            scrollable: null, //true, false, null
            scrollx: false, //true, false
            scrolly: false, //true, false
            items: []
        });
    },
    _init: function () {
        BI.Layout.superclass._init.apply(this, arguments);
        this._init4Margin();
        this._init4Scroll();
    },

    /**
     * 初始化布局与外层容器的边间距
     * @private
     */
    _init4Margin: function () {
        if (this.options.top) {
            this.element.css('top', this.options.top);
        }
        if (this.options.left) {
            this.element.css('left', this.options.left);
        }
        if (this.options.bottom) {
            this.element.css('bottom', this.options.bottom);
        }
        if (this.options.right) {
            this.element.css('right', this.options.right);
        }
    },

    /**
     * 初始化布局的滚动形态
     * @private
     */
    _init4Scroll: function () {
        switch (this.options.scrollable) {
            case true:
                this.element.css("overflow", "auto");
                break;
            case false:
                this.element.css("overflow", "hidden");
                break;
            default :
                break;
        }
        if (this.options.scrollx) {
            this.element.css({
                "overflow-x": "auto",
                "overflow-y": "hidden"
            });
        }
        if (this.options.scrolly) {
            this.element.css({
                "overflow-x": "hidden",
                "overflow-y": "auto"
            });
        }
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w;
        if (!this.hasWidget(this.getName() + i)) {
            w = BI.createWidget(item);
            this.addWidget(this.getName() + i, w);
        } else {
            w = this.getWidgetByName(this.getName() + i);
        }
        return w;
    },

    stroke: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                self._addElement(i, item);
            }
        });
    },

    populate: function (items) {
        var self = this;
        this.reset(items);
        this.stroke(items);
    },

    reset: function (items) {
        this.options.items = items || [];
    },

    resize: function () {

    },

    /**
     * 添加一个子组件到容器中
     * @param {JSON/BI.Widget} item 子组件
     */
    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.element);
        return w;
    },

    addItems: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            self.addItem(item);
        })
    },

    getValue: function (name) {
        if (name) {
            return this.getWidgetByName(name).getValue();
        }
        var value = [];
        BI.each(this.widgets, function (i, wi) {
            var v = wi.getValue(name);
            v = BI.isArray(v) ? v : [v];
            value = value.concat(v);
        });
        return value;
    },

    setValue: function (v, name) {
        if (name) {
            return this.getWidgetByName(name).setValue(v);
        }
        BI.each(this.widgets, function (i, wi) {
            wi.setValue(v);
        })
    },

    setText: function (v, name) {
        if (name) {
            return this.getWidgetByName(name).setText(v);
        }
        BI.each(this.widgets, function (i, wi) {
            wi.setText(v);
        })
    },

    empty: function () {
        BI.Layout.superclass.empty.apply(this, arguments);
        this.reset();
    }
});
$.shortcut('bi.layout', BI.Layout);/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.Action
 * @extends BI.OB
 * @abstract
 */
BI.Action = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.Action.superclass._defaultConfig.apply(this, arguments), {
            src: null,
            tar: null
        });
    },

    _init : function() {
        BI.Action.superclass._init.apply(this, arguments);
    },

    actionPerformed: function(src, tar, callback){

    },

    actionBack: function(tar, src, callback){

    }
});

BI.ActionFactory = {
    createAction: function(key, options){
        var action;
        switch (key){
            case "show":
                action = BI.ShowAction;
                break;
        }
        return new action(options);
    }
}/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.EffectShowAction
 * @extends BI.Action
 */
BI.EffectShowAction = BI.inherit(BI.Action, {
    _defaultConfig: function() {
        return BI.extend(BI.EffectShowAction.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init : function() {
        BI.EffectShowAction.superclass._init.apply(this, arguments);
    },

    _checkBrowser: function(){
        return false;
//        return !(BI.isFireFox() && parseInt($.browser.version) < 10);
    },

    actionPerformed: function(src, tar, callback){
        src = src || this.options.src ,tar = tar || this.options.tar || "body";

        if(this._checkBrowser()) {
            var transferEl = BI.createWidget({
                type: "bi.layout",
                cls: "bi-transfer-temp-el"
            })

            BI.createWidget({
                type: "bi.absolute",
                element: "body",
                items: [transferEl]
            })

            transferEl.element.css({
                width: tar.element.width(),
                height: tar.element.height(),
                top: tar.element.offset().top,
                left: tar.element.offset().left
            });

            src.element.effect("transfer", {
                to: transferEl.element,
                className: "ui-effects-transfer"
            }, 400, function () {
                transferEl.destroy();
                tar && tar.element.show(0, callback);
            })
        } else {
            tar && tar.element.show(0, callback);
        }
    },

    actionBack: function(tar, src, callback){
        src = src || this.options.src || $("body"),tar = tar || this.options.tar;
        tar && tar.element.hide();
        if(this._checkBrowser()) {
            var transferEl = BI.createWidget({
                type: "bi.layout",
                cls: "bi-transfer-temp-el"
            })

            BI.createWidget({
                type: "bi.absolute",
                element: "body",
                items: [transferEl]
            })
            transferEl.element.css({
                width: src.element.width(),
                height: src.element.height(),
                top: src.element.offset().top,
                left: src.element.offset().left
            });

            tar.element.effect("transfer", {
                to: transferEl.element,
                className: "ui-effects-transfer"
            }, 400, function () {
                transferEl.destroy();
                callback && callback();
            })
        } else {
            callback && callback();
        }
    }
});/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.ShowAction
 * @extends BI.Action
 */
BI.ShowAction = BI.inherit(BI.Action, {
    _defaultConfig: function() {
        return BI.extend(BI.ShowAction.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init : function() {
        BI.ShowAction.superclass._init.apply(this, arguments);
    },

    actionPerformed: function(src, tar, callback){
        tar = tar || this.options.tar;
        tar && tar.element.show(0, callback);
    },

    actionBack: function(tar, src, callback){
        tar = tar || this.options.tar;
        tar.element.hide(0, callback);
    }
});/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.ScaleShowAction
 * @extends BI.Action
 * @abstract
 */
BI.ScaleShowAction = BI.inherit(BI.Action, {
    _defaultConfig: function() {
        return BI.extend(BI.ScaleShowAction.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init : function() {
        BI.ScaleShowAction.superclass._init.apply(this, arguments);
    },

    _checkBrowser: function(){
        return false;
//        return !(BI.isFireFox() && parseInt($.browser.version) < 10);
    },

    actionPerformed: function(src, tar, callback){
        tar = tar || this.options.tar;
        this._checkBrowser() ? tar.element.show("scale", {percent:110}, 200, callback) : tar.element.show(0,callback);
    },

    actionBack : function(tar, src, callback){
        tar = tar || this.options.tar;
        this._checkBrowser() ? tar.element.hide("scale", {percent:0}, 200, callback) : tar.element.hide(0,callback);
    }
});/**
 * @class BI.FloatSection
 * @extends BI.View
 * @abstract
 */
BI.FloatSection = BI.inherit(BI.View, {
    _init : function() {
        BI.FloatSection.superclass._init.apply(this, arguments);
        var self = this;
        var flatten = ["_init", "_defaultConfig", "_vessel", "_render", "getName", "listenEnd", "local", "refresh", "load", "change"];
        flatten = BI.makeObject(flatten, true);
        BI.each(this.constructor.caller.caller.caller.prototype, function (key) {
            if (flatten[key]) {
                return;
            }
            var f = self[key];
            if (BI.isFunction(f)) {
                self[key] = BI.bind(function () {
                    if (this.model._start === true) {
                        this._F.push({f: f, arg: arguments});
                        return;
                    }
                    return f.apply(this, arguments);
                }, self);
            }
        })
    },

    rebuildNorth : function(north) {
        return true;
    },
    rebuildCenter : function(center) {},
    rebuildSouth : function(south) {
        return false;
    },
    close: function(){
        this.notifyParentEnd();
        this.trigger(BI.PopoverSection.EVENT_CLOSE);
    },
    end: function(){

    }
});

/**
 * 弹出层
 * @class BI.PopoverSection
 * @extends BI.Widget
 * @abstract
 */
BI.PopoverSection = BI.inherit(BI.Widget, {
    _init : function() {
        BI.PopoverSection.superclass._init.apply(this, arguments);
    },

    rebuildNorth : function(north) {
        return true;
    },
    rebuildCenter : function(center) {},
    rebuildSouth : function(south) {
        return false;
    },
    close: function(){
        this.fireEvent(BI.PopoverSection.EVENT_CLOSE);
    },
    end: function(){

    }
});
BI.PopoverSection.EVENT_CLOSE = "EVENT_CLOSE";/**
 * guy
 *
 * @class BI.HighlightBehavior
 * @extends BI.Behavior
 */
BI.HighlightBehavior = BI.inherit(BI.Behavior, {
    _defaultConfig: function() {
        return BI.extend(BI.HighlightBehavior.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _init : function() {
        BI.HighlightBehavior.superclass._init.apply(this, arguments);

    },

    doBehavior: function(items){
        var args = Array.prototype.slice.call(arguments, 1),
            o = this.options;
        BI.each(items, function(i, item){
            if(item instanceof BI.Single) {
                if (o.rule(item.getValue(), item)) {
                    item.doHighLight.apply(item, args);
                } else {
                    item.unHighLight.apply(item, args);
                }
            } else {
                item.doBehavior.apply(item, args);
            }
        })
    }
});/**
 * guy
 * 标红行为
 * @class BI.RedMarkBehavior
 * @extends BI.Behavior
 */
BI.RedMarkBehavior = BI.inherit(BI.Behavior, {
    _defaultConfig: function() {
        return BI.extend(BI.RedMarkBehavior.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _init : function() {
        BI.RedMarkBehavior.superclass._init.apply(this, arguments);

    },

    doBehavior: function(items){
        var args  = Array.prototype.slice.call(arguments, 1),
            o     = this.options;
        BI.each(items, function(i, item){
            if(item instanceof BI.Single) {
                if (o.rule(item.getValue(), item)) {
                    item.doRedMark.apply(item, args);
                } else {
                    item.unRedMark.apply(item, args);
                }
            } else {
                item.doBehavior.apply(item, args);
            }
        })
    }
});/*
 * 前端缓存
 */
window.localStorage || (window.localStorage = {
    items: {},
    setItem: function (k, v) {
        BI.Cache.addCookie(k, v);
    },
    getItem: function (k) {
        return BI.Cache.getCookie(k);
    },
    removeItem: function (k) {
        BI.Cache.deleteCookie(k);
    },
    key: function () {

    },
    clear: function () {
        this.items = {};
    }
});
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
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
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
};/**
 * guy
 * 控制器
 * Controller层超类
 * @class BI.Controller
 * @extends FR.OB
 * @abstract
 */
BI.Controller = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.Controller.superclass._defaultConfig.apply(this, arguments), {

        })
    },
    _init : function() {
        BI.Controller.superclass._init.apply(this, arguments);
    },

    destroy: function(){

    }
});
BI.Controller.EVENT_CHANGE = "__EVENT_CHANGE__";/**
 * 广播
 *
 * Created by GUY on 2015/12/23.
 * @class
 */
BI.BroadcastController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.BroadcastController.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.BroadcastController.superclass._init.apply(this, arguments);
        this._broadcasts = {};
    },

    on: function (name, fn) {
        if (!this._broadcasts[name]) {
            this._broadcasts[name] = [];
        }
        this._broadcasts[name].push(fn);
    },

    send: function (name) {
        var args = [].slice.call(arguments, 1);
        BI.each(this._broadcasts[name], function (i, fn) {
            fn.apply(null, args);
        });
    },

    remove: function (name, fn) {
        if (fn) {
            BI.remove(this._broadcasts[name], fn);
        } else {
            delete this._broadcasts[name];
        }
        return this;
    }
});/**
 * 气泡图控制器
 * 控制气泡图的显示方向
 *
 * Created by GUY on 2015/8/21.
 * @class
 */
BI.BubblesController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.BubblesController.superclass._defaultConfig.apply(this, arguments), {});
    },

    _const: {
        bubbleHeight: 35
    },

    _init: function () {
        BI.BubblesController.superclass._init.apply(this, arguments);
        this.bubblesManager = {};
        this.storeBubbles = {};
    },

    _createBubble: function (direct, text, height) {
        return BI.createWidget({
            type: "bi.bubble",
            text: text,
            height: height || 35,
            direction: direct
        });
    },

    hide: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        this.get(name).element.hide(0, callback);
        this.get(name).invisible();
        return this;
    },

    _getOffsetLeft: function(name, context, offsetStyle){
        var left = 0;
        if ("center" === offsetStyle) {
            left = context.element.offset().left + (context.element.bounds().width - this.get(name).element.bounds().width) / 2;
            if (left < 0) {
                left = 0;
            }
            return left;
        }
        if ("right" === offsetStyle) {
            left = context.element.offset().left + context.element.bounds().width - this.get(name).element.bounds().width;
            if (left < 0) {
                left = 0;
            }
            return left;
        }
        return context.element.offset().left;
    },

    _getOffsetTop: function(name, context, offsetStyle){
        var top = 0;
        if ("center" === offsetStyle) {
            top = context.element.offset().top + (context.element.bounds().height - this.get(name).element.bounds().height) / 2;
            if (top < 0) {
                top = 0;
            }
            return top;
        } else if ("right" === offsetStyle) {
            top = context.element.offset().top + context.element.bounds().height - this.get(name).element.bounds().height;
            if (top < 0) {
                top = 0;
            }
            return top;
        }
        return context.element.offset().top;
    },

    _getLeftPosition: function(name, context, offsetStyle){
        var position = $.getLeftPosition(context, this.get(name));
        position.top = this._getOffsetTop(name, context, offsetStyle);
        return position;
    },

    _getBottomPosition: function(name, context, offsetStyle){
        var position = $.getBottomPosition(context, this.get(name));
        position.left = this._getOffsetLeft(name, context, offsetStyle);
        return position;
    },

    _getTopPosition: function(name, context, offsetStyle){
        var position = $.getTopPosition(context, this.get(name));
        position.left = this._getOffsetLeft(name, context, offsetStyle);
        return position;
    },

    _getRightPosition: function(name, context, offsetStyle){
        var position = $.getRightPosition(context, this.get(name));
        position.top = this._getOffsetTop(name, context, offsetStyle);
        return position;
    },

    /**
     *
     * @param name
     * @param text
     * @param context
     * @param offsetStyle center, left, right三种类型， 默认left
     * @returns {BI.BubblesController}
     */
    show: function (name, text, context, opt) {
        opt || (opt = {});
        var container = opt.container || context;
        var offsetStyle = opt.offsetStyle || {};
        if (!this.storeBubbles[name]) {
            this.storeBubbles[name] = {};
        }
        if (!this.storeBubbles[name]["top"]) {
            this.storeBubbles[name]["top"] = this._createBubble("top", text);
        }
        BI.createWidget({
            type: "bi.absolute",
            element: container,
            items: [{
                el: this.storeBubbles[name]["top"]
            }]
        })
        this.set(name, this.storeBubbles[name]["top"])
        var position = this._getTopPosition(name, context, offsetStyle);
        this.get(name).element.css({left: position.left, top: position.top});
        this.get(name).invisible();
        if (!$.isTopSpaceEnough(context, this.get(name))) {
            if (!this.storeBubbles[name]["left"]) {
                this.storeBubbles[name]["left"] = this._createBubble("left", text, 30);
            }
            BI.createWidget({
                type: "bi.absolute",
                element: container,
                items: [{
                    el: this.storeBubbles[name]["left"]
                }]
            })
            this.set(name, this.storeBubbles[name]["left"]);
            var position = this._getLeftPosition(name, context, offsetStyle);
            this.get(name).element.css({left: position.left, top: position.top});
            this.get(name).invisible();
            if (!$.isLeftSpaceEnough(context, this.get(name))) {
                if (!this.storeBubbles[name]["right"]) {
                    this.storeBubbles[name]["right"] = this._createBubble("right", text, 30);
                }
                BI.createWidget({
                    type: "bi.absolute",
                    element: container,
                    items: [{
                        el: this.storeBubbles[name]["right"]
                    }]
                })
                this.set(name, this.storeBubbles[name]["right"])
                var position = this._getRightPosition(name, context, offsetStyle);
                this.get(name).element.css({left: position.left, top: position.top});
                this.get(name).invisible();
                if (!$.isRightSpaceEnough(context, this.get(name))) {
                    if (!this.storeBubbles[name]["bottom"]) {
                        this.storeBubbles[name]["bottom"] = this._createBubble("bottom", text);
                    }
                    BI.createWidget({
                        type: "bi.absolute",
                        element: container,
                        items: [{
                            el: this.storeBubbles[name]["bottom"]
                        }]
                    });
                    this.set(name, this.storeBubbles[name]["bottom"]);
                    var position = this._getBottomPosition(name, context, offsetStyle);
                    this.get(name).element.css({left: position.left, top: position.top});
                    this.get(name).invisible();
                }
            }
        }
        this.get(name).setText(text);
        this.get(name).visible();
        return this;
    },

    add: function (name, bubble) {
        if (this.has(name)) {
            return this;
        }
        this.set(name, bubble);
        return this;
    },

    get: function (name) {
        return this.bubblesManager[name];
    },

    set: function (name, bubble) {
        this.bubblesManager[name] = bubble;
    },

    has: function (name) {
        return this.bubblesManager[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.bubblesManager[name].destroy();
        delete this.bubblesManager[name];
        return this;
    }
});/**
 * guy
 * FloatBox弹出层控制器, z-index在100w层级
 * @class BI.FloatBoxController
 * @extends BI.Controller
 */
BI.FloatBoxController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatBoxController.superclass._defaultConfig.apply(this, arguments), {
            modal: true, // 模态窗口
            render: "body"
        });
    },

    _init: function () {
        BI.FloatBoxController.superclass._init.apply(this, arguments);
        this.modal = this.options.modal;
        this.floatManager = {};
        this.floatLayer = {};
        this.floatContainer = {};
        this.zindex = BI.zIndex_floatbox;
        this.zindexMap = {};
    },

    _check: function (name) {
        return BI.isNotNull(this.floatManager[name]);
    },

    create: function (name, section, options) {
        if (this._check(name)) {
            return this;
        }
        var floatbox = BI.createWidget({
            type: "bi.float_box"
        }, options);
        floatbox.populate(section);
        this.add(name, floatbox, options);
        return this;
    },

    add: function (name, floatbox, options) {
        var self = this;
        options || (options = {});
        if (this._check(name)) {
            return this;
        }
        this.floatContainer[name] = BI.createWidget({
            type: "bi.absolute",
            cls: "bi-list-view",
            items: [{
                el: (this.floatLayer[name] = BI.createWidget({
                    type: 'bi.absolute',
                    items: [floatbox]
                })),
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.floatManager[name] = floatbox;
        (function (key) {
            floatbox.on(BI.FloatBox.EVENT_FLOAT_BOX_CLOSED, function () {
                self.close(key);
            })
        })(name);
        BI.createWidget({
            type: "bi.absolute",
            element: options.container || this.options.render,
            items: [{
                el: this.floatContainer[name],
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        return this;
    },

    open: function (name) {
        if (!this._check(name)) {
            return this;
        }
        var container = this.floatContainer[name];
        container.element.css("zIndex", this.zindex++);
        this.modal && container.element.__hasZIndexMask__(this.zindexMap[name]) && container.element.__releaseZIndexMask__(this.zindexMap[name]);
        this.zindexMap[name] = this.zindex;
        this.modal && container.element.__buildZIndexMask__(this.zindex++);
        this.get(name).setZindex(this.zindex++);
        this.floatContainer[name].visible();
        var floatbox = this.get(name);
        floatbox.show();
        var W = $(this.options.render).width(), H = $(this.options.render).height();
        var w = floatbox.element.width(), h = floatbox.element.height();
        var left = (W - w) / 2, top = (H - h) / 2;
        if (left < 0) {
            left = 0;
        }
        if (top < 0) {
            top = 0;
        }
        floatbox.element.css({
            left: left + "px",
            top: top + "px"
        });
        return this;
    },

    close: function (name) {
        if (!this._check(name)) {
            return this;
        }
        this.floatContainer[name].invisible();
        this.modal && this.floatContainer[name].element.__releaseZIndexMask__(this.zindexMap[name]);
        return this;
    },

    get: function (name) {
        return this.floatManager[name];
    },

    remove: function (name) {
        if (!this._check(name)) {
            return this;
        }
        this.floatContainer[name].destroy();
        this.modal && this.floatContainer[name].element.__releaseZIndexMask__(this.zindexMap[name]);
        delete this.floatManager[name];
        delete this.floatLayer[name];
        delete this.zindexMap[name];
        delete this.floatContainer[name];
        return this;
    }
});/**
 * 弹出层面板控制器, z-index在10w层级
 *
 * Created by GUY on 2015/6/24.
 * @class
 */
BI.LayerController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.LayerController.superclass._defaultConfig.apply(this, arguments), {
            render: "body"
        });
    },

    _init: function () {
        BI.LayerController.superclass._init.apply(this, arguments);
        this.layerManager = {};
        this.layouts = {};
        this.zindex = BI.zIndex_layer;
        BI.Resizers.add("layerController" + BI.uniqueId(), BI.bind(this._resize, this));
    },

    _resize: function () {
        BI.each(this.layouts, function (i, layer) {
            if (layer.element.is(":visible")) {
                layer.element.trigger("__resize__");
            }
        })
    },

    make: function (name, container, op) {
        if (this.has(name)) {
            return this.get(name);
        }
        op || (op = {});
        var widget = BI.createWidget((op.render || {}), {
            type: "bi.layout"
        });
        BI.createWidget({
            type: "bi.absolute",
            element: container || this.options.render,
            items: [BI.extend({
                el: widget
            }, {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }, op.offset)]
        });
        this.add(name, widget, widget);
        return widget;
    },

    create: function (name, from, op) {
        if (this.has(name)) {
            return this.get(name);
        }
        op || (op = {});
        var offset = op.offset || {};
        var w = from;
        if (BI.isWidget(from)) {
            w = from.element;
        }
        if (BI.isNotEmptyString(w)) {
            w = $(w);
        }
        if (this.has(name)) {
            return this.get(name);
        }
        var widget = BI.createWidget((op.render || {}), {
            type: "bi.layout"
        });
        var layout = BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: widget,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: op.container || this.options.render,
            items: [{
                el: layout,
                left: offset.left || 0,
                right: offset.right || 0,
                top: offset.top || 0,
                bottom: offset.bottom || 0
            }]
        });
        if (w) {
            layout.element.addClass("bi-list-view");
            layout.element.css({
                left: w.offset().left + (offset.left || 0),
                top: w.offset().top + (offset.top || 0),
                width: offset.width || (w.outerWidth() - (offset.right || 0)) || "",
                height: offset.height || (w.outerHeight() - (offset.bottom || 0)) || ""
            });
            layout.element.on("__resize__", function () {
                w.is(":visible") &&
                layout.element.css({
                    left: w.offset().left + (offset.left || 0),
                    top: w.offset().top + (offset.top || 0),
                    width: offset.width || (w.outerWidth() - (offset.right || 0)) || "",
                    height: offset.height || (w.outerHeight() - (offset.bottom || 0)) || ""
                });
            });
        }
        this.add(name, widget, layout);
        return widget;
    },

    hide: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        this._getLayout(name).invisible();
        this._getLayout(name).element.hide(0, callback);
        return this;
    },

    show: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        this._getLayout(name).visible();
        this._getLayout(name).element.css("z-index", this.zindex++).show(0, callback).trigger("__resize__");
        return this;
    },

    isVisible: function (name) {
        return this.has(name) && this._getLayout(name).isVisible();
    },

    add: function (name, layer, layout) {
        if (this.has(name)) {
            throw new Error("该弹出面板已经存在了，不能添加该key值");
        }
        layout.setVisible(false);
        this.layerManager[name] = layer;
        this.layouts[name] = layout;
        layout.element.css("z-index", this.zindex++);
        return this;
    },

    _getLayout: function (name) {
        return this.layouts[name];
    },

    get: function (name) {
        return this.layerManager[name];
    },

    has: function (name) {
        return this.layerManager[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.layerManager[name].destroy();
        this.layouts[name].destroy();
        delete this.layerManager[name];
        delete this.layouts[name];
        return this;
    }
});/**
 * 遮罩面板, z-index在1亿层级
 *
 * Created by GUY on 2015/6/24.
 * @class
 */
BI.MaskersController = BI.inherit(BI.LayerController, {
    _defaultConfig: function () {
        return BI.extend(BI.MaskersController.superclass._defaultConfig.apply(this, arguments), {
            render: "body"
        });
    },

    _init: function () {
        BI.MaskersController.superclass._init.apply(this, arguments);
        this.zindex = BI.zIndex_masker;
    }
});/**
 * window.resize 控制器
 *
 * Created by GUY on 2015/6/24.
 * @class
 */
BI.ResizeController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.ResizeController.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.ResizeController.superclass._init.apply(this, arguments);
        var self = this;
        this.resizerManger = {};
        var fn = BI.debounce(function (ev) {
            //if (BI.isWindow(ev.target)) {
            self._resize(ev);
            //}
        }, 30);
        $(window).resize(fn);
    },

    _resize: function (ev) {
        BI.each(this.resizerManger, function (key, resizer) {
            if (resizer instanceof $) {
                if (resizer.is(":visible")) {
                    resizer.trigger("__resize__");
                }
                return;
            }
            if (resizer instanceof BI.Layout) {
                resizer.resize();
                return;
            }
            if (BI.isFunction(resizer)) {
                resizer(ev);
                return;
            }
        })
    },

    add: function (name, resizer) {
        if (this.has(name)) {
            return this;
        }
        this.resizerManger[name] = resizer;
        return this;
    },

    get: function (name) {
        return this.resizerManger[name];
    },

    has: function (name) {
        return this.resizerManger[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        delete this.resizerManger[name];
        return this;
    }
});/**
 * tooltip控制器
 * 控制tooltip的显示,  且页面中只有一个tooltip显示
 *
 * Created by GUY on 2015/9/8.
 * @class BI.TooltipsController
 * @extends BI.Controller
 */
BI.TooltipsController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.TooltipsController.superclass._defaultConfig.apply(this, arguments), {});
    },

    _const: {
        height: 20
    },

    _init: function () {
        BI.TooltipsController.superclass._init.apply(this, arguments);
        this.tooltipsManager = {};
        this.showingTips = {};//存储正在显示的tooltip
    },

    _createTooltip: function (text, level) {
        return BI.createWidget({
            type: "bi.tooltip",
            text: text,
            level: level,
            height: this._const.height
        });
    },

    hide: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        delete this.showingTips[name];
        this.get(name).element.hide(0, callback);
        this.get(name).invisible();
        return this;
    },

    create: function (name, text, level, context) {
        if (!this.has(name)) {
            var tooltip = this._createTooltip(text, level);
            this.add(name, tooltip);
            BI.createWidget({
                type: "bi.absolute",
                element: context || "body",
                items: [{
                    el: tooltip
                }]
            });
            tooltip.invisible();
        }
        return this.get(name);
    },

    //opt: {container: '', belowMouse: false}
    show: function (e, name, text, level, context, opt) {
        opt || (opt = {});
        var self = this;
        BI.each(this.showingTips, function (i, tip) {
            self.hide(i);
        });
        this.showingTips = {};
        if (!this.has(name)) {
            this.create(name, text, level, opt.container || context);
        }

        var offset = context.element.offset();
        var bounds = context.element.bounds();

        var top = offset.top + bounds.height + 5;
        var tooltip = this.get(name);
        tooltip.setText(text);
        tooltip.element.css({
            left: "0px",
            top: "0px"
        });
        tooltip.visible();
        tooltip.element.height(tooltip.element[0].scrollHeight);
        this.showingTips[name] = true;
        var x = e.pageX || e.clientX, y = (e.pageY || e.clientY) + 15;
        if (x + tooltip.element.outerWidth() > $("body").outerWidth()) {
            x -= tooltip.element.outerWidth();
        }
        if (y + tooltip.element.outerHeight() > $("body").outerHeight()) {
            y -= tooltip.element.outerHeight() + 15;
            top = offset.top - tooltip.element.outerHeight() - 5;
            !opt.belowMouse && (y = Math.min(y, top));
        } else {
            !opt.belowMouse && (y = Math.max(y, top));
        }
        tooltip.element.css({
            left: x < 0 ? 0 : x + "px",
            top: y < 0 ? 0 : y + "px"
        });
        tooltip.element.hover(function () {
            self.remove(name);
            context.element.trigger("mouseleave.title" + context.getName());
        });
        return this;
    },

    add: function (name, bubble) {
        if (this.has(name)) {
            return this;
        }
        this.set(name, bubble);
        return this;
    },

    get: function (name) {
        return this.tooltipsManager[name];
    },

    set: function (name, bubble) {
        this.tooltipsManager[name] = bubble;
    },

    has: function (name) {
        return this.tooltipsManager[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.tooltipsManager[name].destroy();
        delete this.tooltipsManager[name];
        return this;
    }
});/**
 *
 * @class BI.FloatBoxRouter
 * @extends BI.WRouter
 */
BI.FloatBoxRouter = BI.inherit(BI.WRouter, {
    routes: {},

    _init: function () {
        this.store = {};
        this.views = {};
    },

    createView: function (url, modelData, viewData, context) {
        return BI.Factory.createView(url, this.get(url), modelData || {}, viewData || {}, context)
    },

    open: function (url, modelData, viewData, context, options) {
        var self = this, isValid = BI.isKey(modelData);
        options || (options = {});
        url = context.rootURL + "/" + url;
        var data = void 0;
        if (isValid) {
            modelData = modelData + "";//避免modelData是数字
            var keys = modelData.split('.');
            BI.each(keys, function (i, k) {
                if (i === 0) {
                    data = context.model.get(k) || {};
                } else {
                    data = data[k] || {};
                }
            });
            data.id = options.id || keys[keys.length - 1];
        } else {
            data = modelData;
        }
        BI.extend(data, options.data);
        if (!this.controller) {
            this.controller = new BI.FloatBoxController();
        }
        if (!this.store[url]) {
            this.store[url] = BI.createWidget({
                type: "bi.float_box"
            }, options);
            var view = this.createView(url, data, viewData, context);
            isValid && context.model.addChild(modelData, view.model);
            view.listenTo(view.model, "destroy", function () {
                self.remove(url);
            });
            this.store[url].populate(view);
            this.views[url] = view;
            this.controller.add(url, this.store[url]);
            context && context.on("end:" + view.cid, function () {
                BI.nextTick(function () {
                    self.close(url);
//                    view.end();
                    var t = void 0, isNew = false, keys;
                    if (isValid) {
                        keys = modelData.split('.');
                        BI.each(keys, function (i, k) {
                            if (i === 0) {
                                t = context.model.get(k) || (isNew = true);
                            } else {
                                t = t[k] || (isNew = true);
                            }
                        })
                    }
                    isNew && context.model.removeChild(modelData);
                    !isNew && (context.listenEnd.apply(context, isValid ? keys : [modelData]) !== false) && context.populate();
                }, 30)
            }).on("change:" + view.cid, _.bind(context.notifyParent, context))
        }
        this.controller.open(url);
        this.views[url].populate(data, options.force || true);
        return this;
    },

    close: function (url) {
        if (this.controller) {
            this.controller.close(url);
        }
        return this;
    },

    remove: function (url, context) {
        url = context.rootURL + "/" + url;
        if(this.controller){
            this.controller.remove(url);
            delete this.store[url];
            this.views[url] && this.views[url].destroy();
            delete this.views[url];
        }
        return this;
    }
});/**
 * 统一绑定事件
 * @type {*|void|Object}
 */
BI.EventList = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.EventList.superclass._defaultConfig.apply(this, arguments), {
            event: "click",
            callback: BI.emptyFn,
            handle: "",
            items:[]
        });
    },

    _init : function() {
        BI.EventList.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getHandle: function(item){
        var handle = this.options.handle ? _.result(item, this.options.handle) : item;
        return handle.element || handle;
    },

    populate: function(items){
        var self    = this,
            event   = this.options.event,
            callback = this.options.callback;
        BI.nextTick(function(){
            BI.each(items, function(i, item){
                var fn  = callback(item);
                BI.isFunction(fn) && (fn = BI.debounce(fn, BI.EVENT_RESPONSE_TIME, true));
                self._getHandle(item)[event](fn);
            })
        })

    }
});/**
 * 统一监听jquery事件
 * @type {*|void|Object}
 */
BI.ListenerList = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.ListenerList.superclass._defaultConfig.apply(this, arguments), {
            event: "click",
            callback: BI.emptyFn,
            items:[]
        });
    },

    _init : function() {
        BI.ListenerList.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getHandle: function(item){
        var handle = this.options.handle ? _.result(item, this.options.handle) : item;
        return handle.element || handle;
    },

    populate: function(items){
        var self     = this,
            event    = this.options.event,
            callback = this.options.callback;
        BI.nextTick(function(){
            BI.each(items, function(i, item){
                var fn  = callback(item);
                BI.isFunction(fn) && (fn = BI.debounce(fn, BI.EVENT_RESPONSE_TIME, true));
                self._getHandle(item).on(event, fn);
            })
        })
    }
});/**
 * Created by GUY on 2015/6/25.
 */
/**
 * 统一监听jquery事件
 * @type {*|void|Object}
 */
BI.OffList = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.OffList.superclass._defaultConfig.apply(this, arguments), {
            event: "click",
            items:[]
        });
    },

    _init : function() {
        BI.OffList.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getHandle: function(item){
        var handle = this.options.handle ? _.result(item, this.options.handle) : item;
        return handle.element || handle;
    },

    populate: function(items){
        var self   = this,
            event  = this.options.event;
        BI.each(items, function(i, item){
            self._getHandle(item).off(event);
        })
    }
});/**
 * 事件集合
 * @class BI.Events
 */
_.extend(BI, {
    Events: {

        /**
         * @static
         * @property keydown事件
         */
        KEYDOWN: "_KEYDOWN",

        /**
         * @static
         * @property 回撤事件
         */
        BACKSPACE: "_BACKSPACE",

        /**
         * @static
         * @property 空格事件
         */
        SPACE: "_SPACE",

        /**
         * @static
         * @property 回车事件
         */
        ENTER: "_ENTER",

        /**
         * @static
         * @property 确定事件
         */
        CONFIRM: '_CONFIRM',

        /**
         * @static
         * @property 错误事件
         */
        ERROR: '_ERROR',

        /**
         * @static
         * @property 暂停事件
         */
        PAUSE: '_PAUSE',

        /**
         * @static
         * @property destroy事件
         */
        DESTROY: '_DESTROY',

        /**
         * @static
         * @property 清除选择
         */
        CLEAR: '_CLEAR',

        /**
         * @static
         * @property 添加数据
         */
        ADD: '_ADD',

        /**
         * @static
         * @property 正在编辑状态事件
         */
        EDITING: '_EDITING',

        /**
         * @static
         * @property 空状态事件
         */
        EMPTY: '_EMPTY',

        /**
         * @static
         * @property 显示隐藏事件
         */
        VIEW: '_VIEW',

        /**
         * @static
         * @property 窗体改变大小
         */
        RESIZE: "_RESIZE",

        /**
         * @static
         * @property 编辑前事件
         */
        BEFOREEDIT: '_BEFOREEDIT',

        /**
         * @static
         * @property 编辑后事件
         */
        AFTEREDIT: '_AFTEREDIT',

        /**
         * @static
         * @property 开始编辑事件
         */
        STARTEDIT: '_STARTEDIT',

        /**
         * @static
         * @property 停止编辑事件
         */
        STOPEDIT: '_STOPEDIT',

        /**
         * @static
         * @property 值改变事件
         */
        CHANGE: '_CHANGE',

        /**
         * @static
         * @property 下拉弹出菜单事件
         */
        EXPAND: '_EXPAND',

        /**
         * @static
         * @property 关闭下拉菜单事件
         */
        COLLAPSE: '_COLLAPSE',

        /**
         * @static
         * @property 回调事件
         */
        CALLBACK: '_CALLBACK',

        /**
         * @static
         * @property 点击事件
         */
        CLICK: '_CLICK',

        /**
         * @static
         * @property 状态改变事件，一般是用在复选按钮和单选按钮
         */
        STATECHANGE: '_STATECHANGE',

        /**
         * @static
         * @property 状态改变前事件
         */
        BEFORESTATECHANGE: '_BEFORESTATECHANGE',


        /**
         * @static
         * @property 初始化事件
         */
        INIT: '_INIT',

        /**
         * @static
         * @property 初始化后事件
         */
        AFTERINIT: '_AFTERINIT',

        /**
         * @static
         * @property 滚动条滚动事件
         */
        SCROLL: '_SCROLL',


        /**
         * @static
         * @property 开始加载事件
         */
        STARTLOAD: '_STARTLOAD',

        /**
         * @static
         * @property 加载后事件
         */
        AFTERLOAD: '_AFTERLOAD',


        /**
         * @static
         * @property 提交前事件
         */
        BS: 'beforesubmit',

        /**
         * @static
         * @property 提交后事件
         */
        AS: 'aftersubmit',

        /**
         * @static
         * @property 提交完成事件
         */
        SC: 'submitcomplete',

        /**
         * @static
         * @property 提交失败事件
         */
        SF: 'submitfailure',

        /**
         * @static
         * @property 提交成功事件
         */
        SS: 'submitsuccess',

        /**
         * @static
         * @property 校验提交前事件
         */
        BVW: 'beforeverifywrite',

        /**
         * @static
         * @property 校验提交后事件
         */
        AVW: 'afterverifywrite',

        /**
         * @static
         * @property 校验后事件
         */
        AV: 'afterverify',

        /**
         * @static
         * @property 填报前事件
         */
        BW: 'beforewrite',

        /**
         * @static
         * @property 填报后事件
         */
        AW: 'afterwrite',

        /**
         * @static
         * @property 填报成功事件
         */
        WS: 'writesuccess',

        /**
         * @static
         * @property 填报失败事件
         */
        WF: 'writefailure',

        /**
         * @static
         * @property 添加行前事件
         */
        BA: 'beforeappend',

        /**
         * @static
         * @property 添加行后事件
         */
        AA: 'afterappend',

        /**
         * @static
         * @property 删除行前事件
         */
        BD: 'beforedelete',

        /**
         * @static
         * @property 删除行后事件
         */
        AD: 'beforedelete',

        /**
         * @static
         * @property 未提交离开事件
         */
        UC: 'unloadcheck',


        /**
         * @static
         * @property PDF导出前事件
         */
        BTOPDF: 'beforetopdf',

        /**
         * @static
         * @property PDF导出后事件
         */
        ATOPDF: 'aftertopdf',

        /**
         * @static
         * @property Excel导出前事件
         */
        BTOEXCEL: 'beforetoexcel',

        /**
         * @static
         * @property Excel导出后事件
         */
        ATOEXCEL: 'aftertoexcel',

        /**
         * @static
         * @property Word导出前事件
         */
        BTOWORD: 'beforetoword',

        /**
         * @static
         * @property Word导出后事件
         */
        ATOWORD: 'aftertoword',

        /**
         * @static
         * @property 图片导出前事件
         */
        BTOIMAGE: 'beforetoimage',

        /**
         * @static
         * @property 图片导出后事件
         */
        ATOIMAGE: 'aftertoimage',

        /**
         * @static
         * @property HTML导出前事件
         */
        BTOHTML: 'beforetohtml',

        /**
         * @static
         * @property HTML导出后事件
         */
        ATOHTML: 'aftertohtml',

        /**
         * @static
         * @property Excel导入前事件
         */
        BIMEXCEL: 'beforeimportexcel',

        /**
         * @static
         * @property Excel导出后事件
         */
        AIMEXCEL: 'afterimportexcel',

        /**
         * @static
         * @property PDF打印前事件
         */
        BPDFPRINT: 'beforepdfprint',

        /**
         * @static
         * @property PDF打印后事件
         */
        APDFPRINT: 'afterpdfprint',

        /**
         * @static
         * @property Flash打印前事件
         */
        BFLASHPRINT: 'beforeflashprint',

        /**
         * @static
         * @property Flash打印后事件
         */
        AFLASHPRINT: 'afterflashprint',

        /**
         * @static
         * @property Applet打印前事件
         */
        BAPPLETPRINT: 'beforeappletprint',

        /**
         * @static
         * @property Applet打印后事件
         */
        AAPPLETPRINT: 'afterappletprint',

        /**
         * @static
         * @property 服务器打印前事件
         */
        BSEVERPRINT: 'beforeserverprint',

        /**
         * @static
         * @property 服务器打印后事件
         */
        ASERVERPRINT: 'afterserverprint',

        /**
         * @static
         * @property 邮件发送前事件
         */
        BEMAIL: 'beforeemail',

        /**
         * @static
         * @property 邮件发送后事件
         */
        AEMAIL: 'afteremail'
    }
});/**
 * guy
 * 最基础的dom操作
 */
BI.extend(jQuery.fn, {

    destroy: function () {
        this.remove();
        if (BI.isIE() === true) {
            this[0].outerHTML = '';
        }
    },
    /**
     * 高亮显示
     * @param text 必需
     * @param keyword
     * @param py 必需
     * @returns {*}
     * @private
     */
    __textKeywordMarked__: function (text, keyword, py) {
        if (!BI.isKey(keyword)) {
            return this.text(text);
        }
        keyword = keyword + "";
        keyword = BI.toUpperCase(keyword);
        var textLeft = (text || "") + "";
        py = (py || BI.makeFirstPY(text)) + "";
        if (py != null) {
            py = BI.toUpperCase(py);
        }
        this.empty();
        while (true) {
            var tidx = BI.toUpperCase(textLeft).indexOf(keyword);
            var pidx = null;
            if (py != null) {
                pidx = py.indexOf(keyword);
                if (pidx >= 0) {
                    pidx = pidx % text.length;
                }
            }

            if (tidx >= 0) {
                this.append(textLeft.substr(0, tidx));
                this.append($("<span>").addClass("bi-keyword-red-mark")
                    .text(textLeft.substr(tidx, keyword.length)));

                textLeft = textLeft.substr(tidx + keyword.length);
                if (py != null) {
                    py = py.substr(tidx + keyword.length);
                }
            } else if (pidx != null && pidx >= 0 && Math.floor(pidx / text.length) === Math.floor((pidx + keyword.length - 1) / text.length)) {
                this.append(textLeft.substr(0, pidx));
                this.append($("<span>").addClass("bi-keyword-red-mark")
                    .text(textLeft.substr(pidx, keyword.length)));
                if (py != null) {
                    py = py.substr(pidx + keyword.length);
                }
                textLeft = textLeft.substr(pidx + keyword.length);
            } else {
                this.append(textLeft);
                break;
            }
        }

        return this;
    },

    getDomHeight: function (parent) {
        var clone = $(this).clone();
        clone.appendTo($(parent || "body"));
        var height = clone.height();
        clone.remove();
        return height;
    },

    //是否有竖直滚动条
    hasVerticalScroll: function () {
        return this.height() > 0 && this[0].clientWidth < this[0].offsetWidth;
    },

    //是否有水平滚动条
    hasHorizonScroll: function () {
        return this.width() > 0 && this[0].clientHeight < this[0].offsetHeight;
    },

    //获取计算后的样式
    getStyle: function (name) {
        var node = this[0];
        var computedStyle = void 0;

        // W3C Standard
        if (window.getComputedStyle) {
            // In certain cases such as within an iframe in FF3, this returns null.
            computedStyle = window.getComputedStyle(node, null);
            if (computedStyle) {
                return computedStyle.getPropertyValue(BI.hyphenate(name));
            }
        }
        // Safari
        if (document.defaultView && document.defaultView.getComputedStyle) {
            computedStyle = document.defaultView.getComputedStyle(node, null);
            // A Safari bug causes this to return null for `display: none` elements.
            if (computedStyle) {
                return computedStyle.getPropertyValue(BI.hyphenate(name));
            }
            if (name === 'display') {
                return 'none';
            }
        }
        // Internet Explorer
        if (node.currentStyle) {
            if (name === 'float') {
                return node.currentStyle.cssFloat || node.currentStyle.styleFloat;
            }
            return node.currentStyle[BI.camelize(name)];
        }
        return node.style && node.style[BI.camelize(name)];
    },

    __isMouseInBounds__: function (e) {
        var offset2Body = this.offset();
        return !(e.pageX < offset2Body.left || e.pageX > offset2Body.left + this.outerWidth()
        || e.pageY < offset2Body.top || e.pageY > offset2Body.top + this.outerHeight())
    },

    __hasZIndexMask__: function (zindex) {
        return zindex && this.zIndexMask[zindex] != null;
    },

    __buildZIndexMask__: function (zindex, domArray) {
        this.zIndexMask = this.zIndexMask || {};//存储z-index的mask
        this.indexMask = this.indexMask || [];//存储mask
        var mask = BI.createWidget({
            type: "bi.center_adapt",
            cls: "bi-z-index-mask",
            items: domArray
        });

        mask.element.css({"z-index": zindex});
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: mask,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.indexMask.push(mask);
        zindex && (this.zIndexMask[zindex] = mask);
        return mask.element;
    },

    __releaseZIndexMask__: function (zindex) {
        if (zindex && this.zIndexMask[zindex]) {
            this.indexMask.remove(this.zIndexMask[zindex]);
            this.zIndexMask[zindex].destroy();
            return;
        }
        this.indexMask = this.indexMask || [];
        var indexMask = this.indexMask.pop();
        indexMask && indexMask.destroy();
    }
});

BI.extend(jQuery, {

    getLeftPosition: function (combo, popup, extraWidth) {
        return {
            left: combo.element.offset().left - popup.element.outerWidth() - (extraWidth || 0)
        };
    },

    getRightPosition: function (combo, popup, extraWidth) {
        var el = combo.element;
        return {
            left: el.offset().left + el.outerWidth() + (extraWidth || 0)
        }
    },

    getTopPosition: function (combo, popup, extraHeight) {
        return {
            top: combo.element.offset().top - popup.element.outerHeight() - (extraHeight || 0)
        };
    },

    getBottomPosition: function (combo, popup, extraHeight) {
        var el = combo.element;
        return {
            top: el.offset().top + el.outerHeight() + (extraHeight || 0)
        };
    },

    isLeftSpaceEnough: function (combo, popup, extraWidth) {
        return $.getLeftPosition(combo, popup, extraWidth).left >= 0;
    },

    isRightSpaceEnough: function (combo, popup, extraWidth) {
        var viewBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        return $.getRightPosition(combo, popup, extraWidth).left + viewBounds.width <= windowBounds.width;
    },

    isTopSpaceEnough: function (combo, popup, extraHeight) {
        return $.getTopPosition(combo, popup, extraHeight).top >= 0;
    },

    isBottomSpaceEnough: function (combo, popup, extraHeight) {
        var viewBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        return $.getBottomPosition(combo, popup, extraHeight).top + viewBounds.height <= windowBounds.height;
    },

    isRightSpaceLarger: function (combo) {
        var windowBounds = $("body").bounds();
        return windowBounds.width - combo.element.offset().left - combo.element.bounds().width >= combo.element.offset().left;
    },

    isBottomSpaceLarger: function (combo) {
        var windowBounds = $("body").bounds();
        return windowBounds.height - combo.element.offset().top - combo.element.bounds().height >= combo.element.offset().top;
    },

    getLeftAlignPosition: function (combo, popup, extraWidth) {
        var viewBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        var left = combo.element.offset().left + extraWidth;
        if (left + viewBounds.width > windowBounds.width) {
            left = windowBounds.width - viewBounds.width;
        }
        if (left < 0) {
            left = 0;
        }
        return {
            left: left
        }
    },

    getLeftAdaptPosition: function (combo, popup, extraWidth) {
        if ($.isLeftSpaceEnough(combo, popup, extraWidth)) {
            return $.getLeftPosition(combo, popup, extraWidth);
        }
        return {
            left: 0
        }
    },

    getRightAlignPosition: function (combo, popup, extraWidth) {
        var comboBounds = combo.element.bounds(), viewBounds = popup.element.bounds();
        var left = combo.element.offset().left + comboBounds.width - viewBounds.width - extraWidth;
        if (left < 0) {
            left = 0;
        }
        return {
            left: left
        }
    },

    getRightAdaptPosition: function (combo, popup, extraWidth) {
        if ($.isRightSpaceEnough(combo, popup, extraWidth)) {
            return $.getRightPosition(combo, popup, extraWidth);
        }
        return {
            left: $("body").bounds().width - popup.element.bounds().width
        }
    },

    getTopAlignPosition: function (combo, popup, extraHeight, needAdaptHeight) {
        var comboOffset = combo.element.offset();
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        var top, adaptHeight;
        if ($.isBottomSpaceEnough(combo, popup, -1 * comboBounds.height + extraHeight)) {
            top = comboOffset.top + extraHeight;
        } else if (needAdaptHeight) {
            top = comboOffset.top + extraHeight;
            adaptHeight = windowBounds.height - top;
        } else {
            top = windowBounds.height - popupBounds.height;
            if (top < extraHeight) {
                adaptHeight = windowBounds.height - extraHeight;
            }
        }
        if (top < extraHeight) {
            top = extraHeight;
        }
        return adaptHeight ? {
            top: top,
            adaptHeight: adaptHeight
        } : {
            top: top
        }
    },

    getTopAdaptPosition: function (combo, popup, extraHeight, needAdaptHeight) {
        var popupBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        if ($.isTopSpaceEnough(combo, popup, extraHeight)) {
            return $.getTopPosition(combo, popup, extraHeight);
        }
        if (needAdaptHeight) {
            return {
                top: 0,
                adaptHeight: combo.element.offset().top - extraHeight
            }
        }
        if (popupBounds.height + extraHeight > windowBounds.height) {
            return {
                top: 0,
                adaptHeight: windowBounds.height - extraHeight
            }
        }
        return {
            top: 0
        }
    },

    getBottomAlignPosition: function (combo, popup, extraHeight, needAdaptHeight) {
        var comboOffset = combo.element.offset();
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        var top, adaptHeight;
        if ($.isTopSpaceEnough(combo, popup, -1 * comboBounds.height + extraHeight)) {
            top = comboOffset.top + comboBounds.height - popupBounds.height - extraHeight;
        } else if (needAdaptHeight) {
            top = 0;
            adaptHeight = comboOffset.top + comboBounds.height - extraHeight;
        } else {
            top = 0;
            if (popupBounds.height + extraHeight > windowBounds.height) {
                adaptHeight = windowBounds.height - extraHeight;
            }
        }
        if (top < 0) {
            top = 0;
        }
        return adaptHeight ? {
            top: top,
            adaptHeight: adaptHeight
        } : {
            top: top
        }
    },

    getBottomAdaptPosition: function (combo, popup, extraHeight, needAdaptHeight) {
        var comboOffset = combo.element.offset();
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        if ($.isBottomSpaceEnough(combo, popup, extraHeight)) {
            return $.getBottomPosition(combo, popup, extraHeight);
        }
        if (needAdaptHeight) {
            return {
                top: comboOffset.top + comboBounds.height + extraHeight,
                adaptHeight: windowBounds.height - comboOffset.top - comboBounds.height - extraHeight
            }
        }
        if (popupBounds.height + extraHeight > windowBounds.height) {
            return {
                top: extraHeight,
                adaptHeight: windowBounds.height - extraHeight
            }
        }
        return {
            top: windowBounds.height - popupBounds.height - extraHeight
        }
    },

    getCenterAdaptPosition: function (combo, popup) {
        var comboOffset = combo.element.offset();
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        var left;
        if (comboOffset.left + comboBounds.width / 2 + popupBounds.width / 2 > windowBounds.width) {
            left = windowBounds.width - popupBounds.width;
        } else {
            left = comboOffset.left + comboBounds.width / 2 - popupBounds.width / 2;
        }
        if (left < 0) {
            left = 0;
        }
        return {
            left: left
        }
    },

    getMiddleAdaptPosition: function (combo, popup) {
        var comboOffset = combo.element.offset();
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(), windowBounds = $("body").bounds();
        var top;
        if (comboOffset.top + comboBounds.height / 2 + popupBounds.height / 2 > windowBounds.height) {
            top = windowBounds.height - popupBounds.height;
        } else {
            top = comboOffset.top + comboBounds.height / 2 - popupBounds.height / 2;
        }
        if (top < 0) {
            top = 0;
        }
        return {
            top: top
        }
    },

    getComboPositionByDirections: function (combo, popup, extraWidth, extraHeight, needAdaptHeight, directions) {
        extraWidth || (extraWidth = 0);
        extraHeight || (extraHeight = 0);
        var i, direct;
        var leftRight = [], topBottom = [];
        var isNeedAdaptHeight = false, tbFirst = false, lrFirst = false;
        var left, top, pos;
        for (i = 0; i < directions.length; i++) {
            direct = directions[i];
            switch (direct) {
                case "left":
                    leftRight.push(direct);
                    break;
                case "right":
                    leftRight.push(direct);
                    break;
                case "top":
                    topBottom.push(direct);
                    break;
                case "bottom":
                    topBottom.push(direct);
                    break;
            }
        }
        for (i = 0; i < directions.length; i++) {
            direct = directions[i];
            switch (direct) {
                case "left":
                    if (!isNeedAdaptHeight) {
                        var tW = tbFirst ? extraHeight : extraWidth, tH = tbFirst ? 0 : extraHeight;
                        if ($.isLeftSpaceEnough(combo, popup, tW)) {
                            left = $.getLeftPosition(combo, popup, tW).left;
                            if (topBottom[0] === "bottom") {
                                pos = $.getTopAlignPosition(combo, popup, tH, needAdaptHeight);
                                pos.dir = "left,bottom";
                            } else {
                                pos = $.getBottomAlignPosition(combo, popup, tH, needAdaptHeight);
                                pos.dir = "left,top";
                            }
                            if (tbFirst) {
                                pos.change = "left";
                            }
                            pos.left = left;
                            return pos;
                        }
                    }
                    lrFirst = true;
                    break;
                case "right":
                    if (!isNeedAdaptHeight) {
                        var tW = tbFirst ? extraHeight : extraWidth, tH = tbFirst ? extraWidth : extraHeight;
                        if ($.isRightSpaceEnough(combo, popup, tW)) {
                            left = $.getRightPosition(combo, popup, tW).left;
                            if (topBottom[0] === "bottom") {
                                pos = $.getTopAlignPosition(combo, popup, tH, needAdaptHeight);
                                pos.dir = "right,bottom";
                            } else {
                                pos = $.getBottomAlignPosition(combo, popup, tH, needAdaptHeight);
                                pos.dir = "right,top";
                            }
                            if (tbFirst) {
                                pos.change = "right";
                            }
                            pos.left = left;
                            return pos;
                        }
                    }
                    lrFirst = true;
                    break;
                case "top":
                    var tW = lrFirst ? extraHeight : extraWidth, tH = lrFirst ? extraWidth : extraHeight;
                    if ($.isTopSpaceEnough(combo, popup, tH)) {
                        top = $.getTopPosition(combo, popup, tH).top;
                        if (leftRight[0] === "right") {
                            pos = $.getLeftAlignPosition(combo, popup, tW, needAdaptHeight);
                            pos.dir = "top,right";
                        } else {
                            pos = $.getRightAlignPosition(combo, popup, tW);
                            pos.dir = "top,left";
                        }
                        if (lrFirst) {
                            pos.change = "top";
                        }
                        pos.top = top;
                        return pos;
                    }
                    if (needAdaptHeight) {
                        isNeedAdaptHeight = true;
                    }
                    tbFirst = true;
                    break;
                case "bottom":
                    var tW = lrFirst ? extraHeight : extraWidth, tH = lrFirst ? extraWidth : extraHeight;
                    if ($.isBottomSpaceEnough(combo, popup, tH)) {
                        top = $.getBottomPosition(combo, popup, tH).top;
                        if (leftRight[0] === "right") {
                            pos = $.getLeftAlignPosition(combo, popup, tW, needAdaptHeight);
                            pos.dir = "bottom,right";
                        } else {
                            pos = $.getRightAlignPosition(combo, popup, tW);
                            pos.dir = "bottom,left";
                        }
                        if (lrFirst) {
                            pos.change = "bottom";
                        }
                        pos.top = top;
                        return pos;
                    }
                    if (needAdaptHeight) {
                        isNeedAdaptHeight = true;
                    }
                    tbFirst = true;
                    break;
            }
        }

        switch (directions[0]) {
            case "left":
            case "right":
                if ($.isRightSpaceLarger(combo)) {
                    left = $.getRightAdaptPosition(combo, popup, extraWidth).left;
                } else {
                    left = $.getLeftAdaptPosition(combo, popup, extraWidth).left;
                }
                if (topBottom[0] === "bottom") {
                    pos = $.getTopAlignPosition(combo, popup, extraHeight, needAdaptHeight);
                    pos.left = left;
                    pos.dir = directions[0] + ",bottom";
                    return pos;
                }
                pos = $.getBottomAlignPosition(combo, popup, extraHeight, needAdaptHeight);
                pos.left = left;
                pos.dir = directions[0] + ",top";
                return pos;
            default :
                if ($.isBottomSpaceLarger(combo)) {
                    pos = $.getBottomAdaptPosition(combo, popup, extraHeight, needAdaptHeight);
                } else {
                    pos = $.getTopAdaptPosition(combo, popup, extraHeight, needAdaptHeight);
                }
                if (leftRight[0] === "right") {
                    left = $.getLeftAlignPosition(combo, popup, extraWidth, needAdaptHeight).left;
                    pos.left = left;
                    pos.dir = directions[0] + ",right";
                    return pos;
                }
                left = $.getRightAlignPosition(combo, popup, extraWidth).left;
                pos.left = left;
                pos.dir = directions[0] + ",left";
                return pos;
        }
    },


    getComboPosition: function (combo, popup, extraWidth, extraHeight, needAdaptHeight, directions, offsetStyle) {
        extraWidth || (extraWidth = 0);
        extraHeight || (extraHeight = 0);
        var maxHeight = $("body").bounds().height - extraHeight;
        maxHeight = Math.min(popup.attr("maxHeight") || maxHeight, maxHeight);
        popup.resetHeight && popup.resetHeight(maxHeight);
        var position = $.getComboPositionByDirections(combo, popup, extraWidth, extraHeight, needAdaptHeight, directions || ['bottom', 'top', 'right', 'left']);
        switch (offsetStyle) {
            case "center":
                if (position.change) {
                    var p = $.getMiddleAdaptPosition(combo, popup);
                    position.top = p.top;
                } else {
                    var p = $.getCenterAdaptPosition(combo, popup);
                    position.left = p.left;
                }
                break;
            case "middle":
                if (position.change) {
                    var p = $.getCenterAdaptPosition(combo, popup);
                    position.left = p.left;
                } else {
                    var p = $.getMiddleAdaptPosition(combo, popup);
                    position.top = p.top;
                }
                break;
        }
        return position;
    }
});/**
 * 基本的函数
 * Created by GUY on 2015/6/24.
 */
$(function () {
    BI.Func = {};
    var formulas = {};
    BI.extend(BI.Func, {
        /**
         * 创建唯一的名字
         * @param array
         * @param name
         * @returns {*}
         */
        createDistinctName: function (array, name) {
            var src = name, idx = 1;
            name = name || "";
            while (true) {
                if (!ArrayUtils.getItemByName(array, name)) {
                    break;
                }
                name = src + (idx++);
            }
            return name;
        },

        /**
         * 获取搜索结果
         * @param items
         * @param keyword
         * @param param  搜索哪个属性
         */
        getSearchResult: function (items, keyword, param) {
            var isArray = BI.isArray(items);
            items = isArray ? BI.flatten(items) : items;
            param || (param = "text");
            if (!BI.isKey(keyword)) {
                return {
                    finded: BI.deepClone(items),
                    matched: isArray ? [] : {}
                };
            }
            var t, text, py;
            keyword = BI.toUpperCase(keyword);
            var matched = isArray ? [] : {}, finded = isArray ? [] : {};
            BI.each(items, function (i, item) {
                item = BI.deepClone(item);
                t = BI.stripEL(item);
                text = t[param] || t.text || t.value || t.name || t;
                py = BI.makeFirstPY(text);
                text = BI.toUpperCase(text);
                py = BI.toUpperCase(py);
                var pidx;
                if (text.indexOf(keyword) > -1) {
                    if (text === keyword) {
                        isArray ? matched.push(item) : (matched[i] = item);
                    } else {
                        isArray ? finded.push(item) : (finded[i] = item);
                    }
                } else if (pidx = py.indexOf(keyword), (pidx > -1 && Math.floor(pidx / text.length) === Math.floor((pidx + keyword.length - 1) / text.length))) {
                    if (text === keyword || keyword.length === text.length) {
                        isArray ? matched.push(item) : (matched[i] = item);
                    } else {
                        isArray ? finded.push(item) : (finded[i] = item);
                    }
                }
            });
            return {
                matched: matched,
                finded: finded
            }
        },

        /**
         * 公式合法性验证
         */
        checkFormulaValidation: function (str) {
            if (!BI.isEmptyString(str)) {
                if (BI.has(formulas, str)) {
                    return formulas[str];
                }
                formulas[str] = false;
                var response = BI.requestSync("fr_bi_base", "check_validation_of_expression", {expression: str});
                if (response.validation === "invalid") {
                    formulas[str] = false;
                } else if (response.validation === "valid") {
                    formulas[str] = true;
                }
                return formulas[str];
            } else {
                return true;
            }
        },

        getFormulaStringFromFormulaValue: function (formulaValue) {
            var formulaString = "";
            var regx = /\$[\{][^\}]*[\}]|\w*\w|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)/g;
            var result = formulaValue.match(regx);
            BI.each(result, function (i, item) {
                var fieldRegx = /\$[\{][^\}]*[\}]/;
                var str = item.match(fieldRegx);
                if (BI.isNotEmptyArray(str)) {
                    formulaString = formulaString + str[0].substring(2, item.length - 1);
                } else {
                    formulaString = formulaString + item;
                }
            });
            return formulaString;
        },

        formatAddress: function (address) {
            var temp = '';
            var url1 = /[a-zA-z]+:\/\/[^\s]*/;
            var url2 = /\/[^\s]*/;
            if (address.match(url1) || address.match(url2)) {
                temp = address;
            } else if (BI.isNotEmptyString(address)) {
                temp = "http://" + address;
            }
            return temp;
        },

        getCompleteImageUrl: function (url) {
            return FR.servletURL + "?op=fr_bi&cmd=get_uploaded_image&image_id=" + url;
        }

    });

    /**
     * 对DOM操作的通用函数
     * @type {{}}
     */
    BI.DOM = {};
    BI.extend(BI.DOM, {

        /**
         * 把dom数组或元素悬挂起来,使其不对html产生影响
         * @param dom
         */
        hang: function (doms) {
            if (BI.isEmpty(doms)) {
                return;
            }
            var frag = document.createDocumentFragment();
            BI.each(doms, function (i, dom) {
                dom instanceof BI.Widget && (dom = dom.element);
                dom instanceof $ && dom[0] && frag.appendChild(dom[0]);
            });
            return frag;
        },

        isExist: function (obj) {
            return $("body").find(obj.element).length > 0;
        },

        //预加载图片
        preloadImages: function (srcArray, onload) {
            var count = 0, images = [];

            function complete() {
                count++;
                if (count >= srcArray.length) {
                    onload();
                }
            }

            BI.each(srcArray, function (i, src) {
                images[i] = new Image();
                images[i].src = src;
                images[i].onload = function () {
                    complete()
                };
                images[i].onerror = function () {
                    complete()
                };
            });
        },

        getImageWidthAndHeight: function (src) {
            return BI.requestSync("fr_bi_base", "get_image_size", {
                src: src
            });
        },

        isDarkColor: function (hex) {
            if (!hex) {
                return false;
            }
            var rgb = this.rgb2json(this.hex2rgb(hex));
            var grayLevel = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
            if (grayLevel < 192) {
                return true;
            }
            return false;
        },

        rgb2hex: function (rgbColour) {
            if (!rgbColour || rgbColour.substr(0, 3) != "rgb") {
                return "";
            }
            var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
            var red = BI.parseInt(rgbValues[0]);
            var green = BI.parseInt(rgbValues[1]);
            var blue = BI.parseInt(rgbValues[2]);

            var hexColour = "#" + this.int2hex(red) + this.int2hex(green) + this.int2hex(blue);

            return hexColour;
        },

        rgb2json: function (rgbColour) {
            if (!rgbColour) {
                return {};
            }
            var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
            return {
                r: BI.parseInt(rgbValues[0]),
                g: BI.parseInt(rgbValues[1]),
                b: BI.parseInt(rgbValues[2])
            };
        },

        rgba2json: function (rgbColour) {
            if (!rgbColour) {
                return {};
            }
            var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
            return {
                r: BI.parseInt(rgbValues[0]),
                g: BI.parseInt(rgbValues[1]),
                b: BI.parseInt(rgbValues[2]),
                a: BI.parseFloat(rgbValues[3])
            };
        },

        json2rgb: function (rgb) {
            if (!BI.isKey(rgb.r) || !BI.isKey(rgb.g) || !BI.isKey(rgb.b)) {
                return "";
            }
            return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        },

        json2rgba: function (rgba) {
            if (!BI.isKey(rgba.r) || !BI.isKey(rgba.g) || !BI.isKey(rgba.b)) {
                return "";
            }
            return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
        },

        int2hex: function (strNum) {
            var hexdig = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

            return hexdig[strNum >>> 4] + '' + hexdig[strNum & 15];
        },

        hex2rgb: function (color) {
            if (!color) {
                return "";
            }
            var tempValue = "rgb(", colorArray;

            if (color.length === 7) {
                colorArray = [BI.parseInt('0x' + color.substring(1, 3)),
                    BI.parseInt('0x' + color.substring(3, 5)),
                    BI.parseInt('0x' + color.substring(5, 7))];
            }
            else if (color.length === 4) {
                colorArray = [BI.parseInt('0x' + color.substring(1, 2)),
                    BI.parseInt('0x' + color.substring(2, 3)),
                    BI.parseInt('0x' + color.substring(3, 4))];
            }
            tempValue += colorArray[0] + ",";
            tempValue += colorArray[1] + ",";
            tempValue += colorArray[2] + ")";

            return tempValue;
        },

        rgba2rgb: function (rgbColour, BGcolur) {
            if (BI.isNull(BGcolur)) {
                BGcolur = 1;
            }
            if (rgbColour.substr(0, 4) != "rgba") {
                return "";
            }
            var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
            if (rgbValues.length < 4) {
                return "";
            }
            var R = BI.parseFloat(rgbValues[0]);
            var G = BI.parseFloat(rgbValues[1]);
            var B = BI.parseFloat(rgbValues[2]);
            var A = BI.parseFloat(rgbValues[3]);

            return "rgb(" + Math.floor(255 * (BGcolur * (1 - A )) + R * A) + "," +
                Math.floor(255 * (BGcolur * (1 - A )) + G * A) + "," +
                Math.floor(255 * (BGcolur * (1 - A )) + B * A) + ")";
        },

        getTextSizeWidth: function (text, fontSize) {
            var span = $("<span></span>").addClass("text-width-span").appendTo($("#container"));

            if (fontSize == null) {
                fontSize = 12;
            }
            fontSize = fontSize + "px";

            span.css("font-size", fontSize).text(text);

            var width = span.width();
            span.remove();

            return width;
        },

        //获取滚动条的宽度
        getScrollWidth: function () {
            if (this._scrollWidth == null) {
                var ul = $("<div>").width(50).height(50).css({
                    position: "absolute",
                    top: "-9999px",
                    overflow: "scroll"
                }).appendTo($("#container"));
                this._scrollWidth = ul[0].offsetWidth - ul[0].clientWidth;
                ul.destroy();
            }
            return this._scrollWidth;
        }
    });
});/**
 * guy
 * 检测某个Widget的EventChange事件然后去show某个card
 * @type {*|void|Object}
 * @class BI.ShowListener
 * @extends BI.OB
 */
BI.ShowListener = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.ShowListener.superclass._defaultConfig.apply(this, arguments), {
            eventObj: BI.createWidget(),
            cardLayout: null,
            cardNameCreator: function (v) {
                return v;
            },
            cardCreator: BI.emptyFn,
            afterCardCreated: BI.emptyFn,
            afterCardShow: BI.emptyFn
        });
    },

    _init: function () {
        BI.ShowListener.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        o.eventObj.on(BI.Controller.EVENT_CHANGE, function (type, v, ob) {
            if (type === BI.Events.CLICK) {
                v = v || o.eventObj.getValue();
                v = BI.isArray(v) ? (v.length > 1 ? v.toString() : v[0]) : v;
                if (BI.isNull(v)) {
                    throw new Error("value值不能为空");
                }
                var cardName = o.cardNameCreator(v);
                if (!o.cardLayout.isCardExisted(cardName)) {
                    var card = o.cardCreator(cardName);
                    o.cardLayout.addCardByName(cardName, card);
                    o.afterCardCreated(cardName);
                }
                o.cardLayout.showCardByName(cardName);
                BI.nextTick(function () {
                    o.afterCardShow(cardName);
                    self.fireEvent(BI.ShowListener.EVENT_CHANGE, cardName);
                });
            }
        })
    }
});
BI.ShowListener.EVENT_CHANGE = "ShowListener.EVENT_CHANGE";/**
 * @class BI.Logic
 * @extends BI.OB
 */
BI.Logic = BI.inherit(BI.OB, {
    createLogic: function () {
        return this.options || {};
    }
});

BI.LogicFactory = {
    Type: {
        Vertical: "vertical",
        Horizontal: "horizontal",
        Table: "table",
        HorizontalFill: "horizontal_fill"
    },
    createLogic: function (key, options) {
        var logic;
        switch (key) {
            case BI.LogicFactory.Type.Vertical:
                logic = BI.VerticalLayoutLogic;
                break;
            case BI.LogicFactory.Type.Horizontal:
                logic = BI.HorizontalLayoutLogic;
                break;
            case BI.LogicFactory.Type.Table:
                logic = BI.TableLayoutLogic;
                break;
            case BI.LogicFactory.Type.HorizontalFill:
                logic = BI.HorizontalFillLayoutLogic;
                break;
            default :
                logic = BI.Logic;
                break;
        }
        return new logic(options).createLogic();
    },

    createLogicTypeByDirection: function (direction) {
        switch (direction) {
            case BI.Direction.Top:
            case BI.Direction.Bottom:
            case BI.Direction.Custom:
                return BI.LogicFactory.Type.Vertical;
                break;
            case BI.Direction.Left:
            case BI.Direction.Right:
                return BI.LogicFactory.Type.Horizontal;
        }
    },

    createLogicItemsByDirection: function (direction) {
        var layout;
        var items = Array.prototype.slice.call(arguments, 1);
        items = BI.map(items, function (i, item) {
            if (BI.isWidget(item)) {
                return {
                    el: item,
                    width: item.options.width,
                    height: item.options.height
                }
            }
            return item;
        });
        switch (direction) {
            case BI.Direction.Bottom:
                layout = BI.LogicFactory.Type.Vertical;
                items.reverse();
                break;
            case BI.Direction.Right:
                layout = BI.LogicFactory.Type.Horizontal;
                items.reverse();
                break;
            case BI.Direction.Custom:
                items = items.slice(1);
                break;
        }
        return items;
    }
};/**
 * guy
 * 上下布局逻辑
 * 上下布局的时候要考虑到是动态布局还是静态布局
 *
 * @class BI.VerticalLayoutLogic
 * @extends BI.Logic
 */
BI.VerticalLayoutLogic = BI.inherit(BI.Logic, {
    _defaultConfig: function () {
        return BI.extend(BI.VerticalLayoutLogic.superclass._defaultConfig.apply(this, arguments), {
            dynamic: false,
            scrollable: null,
            scrolly: false,
            scrollx: false,
            items: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    createLogic: function () {
        var layout, o = this.options;
        if (o.dynamic) {
            layout = "bi.vertical";
        } else {
            layout = "bi.vtape";
        }
        return {
            type: layout,
            scrollable: o.scrollable,
            scrolly: o.scrolly,
            scrollx: o.scrollx,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            items: o.items
        }
    },

    _init: function () {
        BI.VerticalLayoutLogic.superclass._init.apply(this, arguments);
    }
});


/**
 * guy
 * 左右布局逻辑
 * 左右布局的时候要考虑到是动态布局还是静态布局
 *
 * @class BI.HorizontalLayoutLogic
 * @extends BI.Logic
 */
BI.HorizontalLayoutLogic = BI.inherit(BI.Logic, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalLayoutLogic.superclass._defaultConfig.apply(this, arguments), {
            dynamic: false,
            scrollable: null,
            scrolly: false,
            scrollx: false,
            items: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    createLogic: function () {
        var layout, o = this.options;
        if (o.dynamic) {
            layout = "bi.horizontal";
        } else {
            layout = "bi.htape";
        }
        return {
            type: layout,
            scrollable: o.scrollable,
            scrolly: o.scrolly,
            scrollx: o.scrollx,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            items: o.items
        }
    },

    _init: function () {
        BI.HorizontalLayoutLogic.superclass._init.apply(this, arguments);
    }
});

/**
 * guy
 * 表格布局逻辑
 * 表格布局的时候要考虑到是动态布局还是静态布局
 *
 * @class BI.TableLayoutLogic
 * @extends BI.OB
 */
BI.TableLayoutLogic = BI.inherit(BI.Logic, {
    _defaultConfig: function () {
        return BI.extend(BI.TableLayoutLogic.superclass._defaultConfig.apply(this, arguments), {
            dynamic: false,
            scrollable: null,
            scrolly: false,
            scrollx: false,
            columns: 0,
            rows: 0,
            columnSize: [],
            rowSize: [],
            hgap: 0,
            vgap: 0,
            items: []
        });
    },

    createLogic: function () {
        var layout, o = this.options;
        if (o.dynamic) {
            layout = "bi.table";
        } else {
            layout = "bi.window";
        }
        return {
            type: layout,
            scrollable: o.scrollable,
            scrolly: o.scrolly,
            scrollx: o.scrollx,
            columns: o.columns,
            rows: o.rows,
            columnSize: o.columnSize,
            rowSize: o.rowSize,
            hgap: o.hgap,
            vgap: o.vgap,
            items: o.items
        }
    },

    _init: function () {
        BI.TableLayoutLogic.superclass._init.apply(this, arguments);
    }
});

/**
 * guy
 * 左右充满布局逻辑
 *
 * @class BI.HorizontalFillLayoutLogic
 * @extends BI.Logic
 */
BI.HorizontalFillLayoutLogic = BI.inherit(BI.Logic, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalFillLayoutLogic.superclass._defaultConfig.apply(this, arguments), {
            dynamic: false,
            scrollable: null,
            scrolly: false,
            scrollx: false,
            items: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    createLogic: function () {
        var layout, o = this.options;
        var columnSize = [];
        BI.each(o.items, function (i, item) {
            columnSize.push(item.width || 0);
        });
        if (o.dynamic) {
            layout = "bi.horizontal_adapt";
        } else {
            layout = "bi.htape";
        }
        return {
            type: layout,
            columnSize: columnSize,
            scrollable: o.scrollable,
            scrolly: o.scrolly,
            scrollx: o.scrollx,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            items: o.items
        }
    },

    _init: function () {
        BI.HorizontalFillLayoutLogic.superclass._init.apply(this, arguments);
    }
});BI.Plugin = BI.Plugin || {};
;
(function () {
    var _WidgetsPlugin = {};
    var _ObjectPlugin = {};
    BI.extend(BI.Plugin, {

        getWidget: function (type, options) {
            if (_WidgetsPlugin[type]) {
                var res;
                for (var i = _WidgetsPlugin[type].length-1; i >=0; i--) {
                    if (res = _WidgetsPlugin[type][i](options)) {
                        return res;
                    }
                }
            }
            return options;
        },

        registerWidget: function (type, fn) {
            if (!_WidgetsPlugin[type]) {
                _WidgetsPlugin[type] = [];
            }
            if (_WidgetsPlugin[type].length > 0) {
                console.log("组件已经注册过了!");
            }
            _WidgetsPlugin[type].push(fn);
        },

        relieveWidget: function (type) {
            delete _WidgetsPlugin[type];
        },

        getObject: function (type, object) {
            if (_ObjectPlugin[type]) {
                var res;
                for (var i = 0, len = _ObjectPlugin[type].length; i < len; i++) {
                    res = _ObjectPlugin[type][i](object);
                }
            }
            return res || object;
        },

        registerObject: function (type, fn) {
            if (!_ObjectPlugin[type]) {
                _ObjectPlugin[type] = [];
            }
            if (_ObjectPlugin[type].length > 0) {
                console.log("对象已经注册过了!");
            }
            _ObjectPlugin[type].push(fn);
        },

        relieveObject: function (type) {
            delete _ObjectPlugin[type];
        }
    });
})();/**
 * 对数组对象的扩展
 * @class Array
 */
$.extend(Array.prototype, {
    /**
     * 检查指定的值是否在数组中
     * @param {Object} o 要检查的值
     * @return {Number}  o在数组中的索引（如果不在数组中则返回-1）
     */
    indexOf: function (o) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (_.isEqual(o, this[i])) {
                return i;
            }
        }
        return -1;
    },

    /**
     * 检查指定的值是否在数组中
     * ie67不支持数组的这个方法
     * @param {Object} o 要检查的值
     * @return {Number}  o在数组中的索引（如果不在数组中则返回-1）
     */
    lastIndexOf: function (o) {
        for (var len = this.length, i = len - 1; i >= 0; i--) {
            if (_.isEqual(o, this[i])) {
                return i;
            }
        }
        return -1;
    },

    /**
     * 从数组中移除指定的值，如果值不在数组中，则不产生任何效果
     * @param {Object} o 要移除的值
     * @return {Array} 移除制定值后的数组
     */
    remove: function (o) {
        var index = this.indexOf(o);
        if (index != -1) {
            this.splice(index, 1);
        }
        return this;
    },
    /**
     * 移除数组中的所有元素
     */
    clear: function () {
        while (this.length > 0) {
            this.pop();
        }
    }
});

/**
 * Array原型拓展
 * Created by wang on 15/6/23.
 */
!function () {
    _.each(['contains', 'indexOf', 'lastIndexOf'], function (name) {
        Array.prototype[name] = function () {
            var arr = _.toArray(arguments);
            arr.unshift(this);
            return BI[name].apply(this, arr);
        };
    });
    Array.prototype.pushArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            this.push(array[i]);
        }
    };
    Array.prototype.pushDistinct = function (obj) {
        if (!this.contains(obj)) {
            this.push(obj);
        }
    };
    Array.prototype.pushDistinctArray = function (array) {
        for (var i = 0, len = array.length; i < len; i++) {
            this.pushDistinct(array[i]);
        }
    };
}();

/**
 * 规定bi的数组分为两种，其中，value和type值为key值
 * 1、[{"text":1,"value":2,"children":[]}]
 * 2、[{"name":1,"type":2,"children":[]}]
 * guy
 * 对数组的操作
 * @type {{}}
 */
ArrayUtils = {};

$.extend(ArrayUtils, {
    /**
     * 遍历方法
     * @param array
     * @param back
     */
    traversal: function (array, back) {
        if (BI.isNull(array)) {
            return;
        }
        var self = this;
        BI.each(array, function (i, item) {
            if (back(i, item) === BI.Status.END) {
                return false;
            }
            self.traversal(item.children, back);
        })
    },

    getAllChildNames: function (array) {
        var names = [];
        this.traversal(array, function (i, item) {
            if (BI.isNotEmptyArray(item.children)) {
                return BI.Status.RUNNING;
            }
            names.push(item.text || item.name);
        });
        return names;
    },

    /**
     * 获取第一个子节点
     * @param array
     */
    getFirstChild: function (array) {
        var first = {};
        this.traversal(array, function (i, item) {
            if (BI.isNotEmptyArray(item.children)) {
                return;
            }
            first = item;
            return BI.Status.END;
        })
        return first;
    },

    /**
     * 获取最后一个子节点
     * @param array
     */
    getLastChild: function (array) {
        var first = {};
        this.traversal(array, function (i, item) {
            if (item.children && item.children.length > 0) {
                return;
            }
            first = item;
        })
        return first;
    },

    getTextByValue: function (array, value) {
        if (!array) {
            return value;
        }
        var text = "";
        this.traversal(array, function (i, item) {
            if (BI.isEqual(item.value, value)) {
                text = item.text;
                return BI.Status.END;
            }
        });
        return text;
    },

    getNameByType: function (array, type) {
        if (!array) {
            return type;
        }
        var name = "";
        this.traversal(array, function (i, item) {
            if (BI.isEqual(item.type, type)) {
                name = item.name;
                return BI.Status.END;
            }
        });
        return name;
    },

    getItemByText: function (array, text) {
        var res = void 0;
        this.traversal(array, function (i, item) {
            if (BI.isCapitalEqual(item.text, text)) {
                res = item;
                return BI.Status.END;
            }
        });
        return res;
    },

    getIndexByText: function (array, text) {
        var res = -1;
        this.traversal(array, function (i, item) {
            if (BI.isCapitalEqual(item.text, text)) {
                res = i;
                return BI.Status.END;
            }
        });
        return res;
    },

    getItemByValue: function (array, value) {
        var res = void 0;
        this.traversal(array, function (i, item) {
            if (BI.isEqual(item.value, value)) {
                res = item;
                return BI.Status.END;
            }
        });
        return res;
    },

    getIndexByValue: function (array, value) {
        var res = -1;
        this.traversal(array, function (i, item) {
            if (BI.isEqual(item.value, value)) {
                res = i;
                return BI.Status.END;
            }
        });
        return res;
    },

    getItemByName: function (array, name) {
        var res = void 0;
        this.traversal(array, function (i, item) {
            if (BI.isCapitalEqual(item.name, name)) {
                res = item;
                return BI.Status.END;
            }
        });
        return res;
    },

    getIndexByName: function (array, name) {
        var res = -1;
        this.traversal(array, function (i, item) {
            if (BI.isCapitalEqual(item.name, name)) {
                res = i;
                return BI.Status.END;
            }
        });
        return res;
    },

    getItemByType: function (array, type) {
        var res = void 0;
        this.traversal(array, function (i, item) {
            if (BI.isEqual(item.type, type)) {
                res = item;
                return BI.Status.END;
            }
        });
        return res;
    },

    getIndexByType: function (array, type) {
        var res = -1;
        this.traversal(array, function (i, item) {
            if (BI.isEqual(item.type, type)) {
                res = i;
                return BI.Status.END;
            }
        });
        return res;
    },

    deleteItemByType: function (array, type) {
        var item = this.getItemByType(array, type);
        array.remove(item);
    },

    deleteItemByName: function (array, name) {
        var item = this.getItemByName(array, name);
        array.remove(item);
    },

    deleteItemByValue: function (array, value) {
        var item = this.getItemByValue(array, value);
        array.remove(item);
    }
});/*
 * 前端缓存
 */
window.localStorage || (window.localStorage = {
    items: {},
    setItem: function (k, v) {
        BI.Cache.addCookie(k, v);
    },
    getItem: function (k) {
        return BI.Cache.getCookie(k);
    },
    removeItem: function (k) {
        BI.Cache.deleteCookie(k);
    },
    key: function () {

    },
    clear: function () {
        this.items = {};
    }
});
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
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
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
};// full day names
Date._DN = [BI.i18nText("BI-Sunday"),
    BI.i18nText("BI-Monday"),
    BI.i18nText("BI-Tuesday"),
    BI.i18nText("BI-Wednesday"),
    BI.i18nText("BI-Thursday"),
    BI.i18nText("BI-Friday"),
    BI.i18nText("BI-Saturday"),
    BI.i18nText("BI-Sunday")];

// short day names
Date._SDN = ['日',
    '',
    '',
    '',
    '',
    '',
    '',
    ''];

// Monday first, etc.
Date._FD = 1;

// full month names
Date._MN = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''];

// short month names
Date._SMN = ['',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''];

Date._QN = ["", BI.i18nText("BI-Quarter_1"),
    BI.i18nText("BI-Quarter_2"),
    BI.i18nText("BI-Quarter_3"),
    BI.i18nText("BI-Quarter_4")];



/** Adds the number of days array to the Date object. */
Date._MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Constants used for time computations */
Date.SECOND = 1000 /* milliseconds */;
Date.MINUTE = 60 * Date.SECOND;
Date.HOUR = 60 * Date.MINUTE;
Date.DAY = 24 * Date.HOUR;
Date.WEEK = 7 * Date.DAY;

/** Returns the number of days in the current month */
Date.prototype.getMonthDays = function (month) {
    var year = this.getFullYear();
    if (typeof month == "undefined") {
        month = this.getMonth();
    }
    if (((0 == (year % 4)) && ( (0 != (year % 100)) || (0 == (year % 400)))) && month == 1) {
        return 29;
    } else {
        return Date._MD[month];
    }
};

/** Returns the number of day in the year. */
Date.prototype.getDayOfYear = function () {
    var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
    var time = now - then;
    return Math.floor(time / Date.DAY);
};

/** Returns the number of the week in year, as defined in ISO 8601. */
Date.prototype.getWeekNumber = function () {
    var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    var DoW = d.getDay();
    d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
    var ms = d.valueOf(); // GMT
    d.setMonth(0);
    d.setDate(4); // Thu in Week 1
    return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
};

//离当前时间多少天的时间
Date.prototype.getOffsetDate = function (offset) {
    return new Date(this.getTime() + offset * 864e5);
};

/** Checks date and time equality */
Date.prototype.equalsTo = function (date) {
    return ((this.getFullYear() == date.getFullYear()) &&
    (this.getMonth() == date.getMonth()) &&
    (this.getDate() == date.getDate()) &&
    (this.getHours() == date.getHours()) &&
    (this.getMinutes() == date.getMinutes()) &&
    (this.getSeconds() == date.getSeconds()));
};

/** Set only the year, month, date parts (keep existing time) */
Date.prototype.setDateOnly = function (date) {
    var tmp = new Date(date);
    this.setDate(1);
    this.setFullYear(tmp.getFullYear());
    this.setMonth(tmp.getMonth());
    this.setDate(tmp.getDate());
};
/** Prints the date in a string according to the given format. */
Date.prototype.print = function (str) {
    var m = this.getMonth();
    var d = this.getDate();
    var y = this.getFullYear();
    var wn = this.getWeekNumber();
    var w = this.getDay();
    var s = {};
    var hr = this.getHours();
    var pm = (hr >= 12);
    var ir = (pm) ? (hr - 12) : hr;
    var dy = this.getDayOfYear();
    if (ir == 0) {
        ir = 12;
    }
    var min = this.getMinutes();
    var sec = this.getSeconds();
    s["%a"] = Date._SDN[w]; // abbreviated weekday name [FIXME: I18N]
    s["%A"] = Date._DN[w]; // full weekday name
    s["%b"] = Date._SMN[m]; // abbreviated month name [FIXME: I18N]
    s["%B"] = Date._MN[m]; // full month name
    // FIXME: %c : preferred date and time representation for the current locale
    s["%C"] = 1 + Math.floor(y / 100); // the century number
    s["%d"] = (d < 10) ? ("0" + d) : d; // the day of the month (range 01 to 31)
    s["%e"] = d; // the day of the month (range 1 to 31)
    // FIXME: %D : american date style: %m/%d/%y
    // FIXME: %E, %F, %G, %g, %h (man strftime)
    s["%H"] = (hr < 10) ? ("0" + hr) : hr; // hour, range 00 to 23 (24h format)
    s["%I"] = (ir < 10) ? ("0" + ir) : ir; // hour, range 01 to 12 (12h format)
    s["%j"] = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy; // day of the year (range 001 to 366)
    s["%k"] = hr;		// hour, range 0 to 23 (24h format)
    s["%l"] = ir;		// hour, range 1 to 12 (12h format)
    s["%X"] = (m < 9) ? ("0" + (1 + m)) : (1 + m); // month, range 01 to 12
    s["%x"] = m + 1 // month, range 1 to 12
    s["%M"] = (min < 10) ? ("0" + min) : min; // minute, range 00 to 59
    s["%n"] = "\n";		// a newline character
    s["%p"] = pm ? "PM" : "AM";
    s["%P"] = pm ? "pm" : "am";
    // FIXME: %r : the time in am/pm notation %I:%M:%S %p
    // FIXME: %R : the time in 24-hour notation %H:%M
    s["%s"] = Math.floor(this.getTime() / 1000);
    s["%S"] = (sec < 10) ? ("0" + sec) : sec; // seconds, range 00 to 59
    s["%t"] = "\t";		// a tab character
    // FIXME: %T : the time in 24-hour notation (%H:%M:%S)
    s["%U"] = s["%W"] = s["%V"] = (wn < 10) ? ("0" + wn) : wn;
    s["%u"] = w + 1;	// the day of the week (range 1 to 7, 1 = MON)
    s["%w"] = w;		// the day of the week (range 0 to 6, 0 = SUN)
    // FIXME: %x : preferred date representation for the current locale without the time
    // FIXME: %X : preferred time representation for the current locale without the date
    s["%y"] = ('' + y).substr(2, 2); // year without the century (range 00 to 99)
    s["%Y"] = y;		// year with the century
    s["%%"] = "%";		// a literal '%' character

    var re = /%./g;
    if (!BI.isKhtml()) {
        return str.replace(re, function (par) {
            return s[par] || par;
        });
    }

    var a = str.match(re);
    for (var i = 0; i < a.length; i++) {
        var tmp = s[a[i]];
        if (tmp) {
            re = new RegExp(a[i], 'g');
            str = str.replace(re, tmp);
        }
    }

    return str;
};

/**
 * 是否是闰年
 * @param year
 * @returns {boolean}
 */
Date.isLeap = function (year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * 检测是否在有效期
 *
 * @param YY 年
 * @param MM 月
 * @param DD 日
 * @param minDate '1900-01-01'
 * @param maxDate '2099-12-31'
 * @returns {Array} 若无效返回无效状态
 */
Date.checkVoid = function (YY, MM, DD, minDate, maxDate) {
    var back = [];
    YY = YY | 0;
    MM = MM | 0;
    DD = DD | 0;
    minDate = BI.isString(minDate) ? minDate.match(/\d+/g) : minDate;
    maxDate = BI.isString(maxDate) ? maxDate.match(/\d+/g) : maxDate;
    if (YY < minDate[0]) {
        back = ['y'];
    } else if (YY > maxDate[0]) {
        back = ['y', 1];
    } else if (YY >= minDate[0] && YY <= maxDate[0]) {
        if (YY == minDate[0]) {
            if (MM < minDate[1]) {
                back = ['m'];
            } else if (MM == minDate[1]) {
                if (DD < minDate[2]) {
                    back = ['d'];
                }
            }
        }
        if (YY == maxDate[0]) {
            if (MM > maxDate[1]) {
                back = ['m', 1];
            } else if (MM == maxDate[1]) {
                if (DD > maxDate[2]) {
                    back = ['d', 1];
                }
            }
        }
    }
    return back;
};

Date.checkLegal = function (str) {
    var ar = str.match(/\d+/g);
    var YY = ar[0] | 0, MM = ar[1] | 0, DD = ar[2] | 0;
    if (ar.length <= 1) {
        return true;
    }
    if (ar.length <= 2) {
        return MM >= 1 && MM <= 12;
    }
    Date._MD[1] = Date.isLeap(YY) ? 29 : 28;
    return MM >= 1 && MM <= 12 && DD <= Date._MD[MM - 1];
};

Date.parseDateTime = function (str, fmt) {
    var today = new Date();
    var y = 0;
    var m = 0;
    var d = 1;
    //wei : 对于fmt为‘YYYYMM’或者‘YYYYMMdd’的格式，str的值为类似'201111'的形式，因为年月之间没有分隔符，所以正则表达式分割无效，导致bug7376。
    var a = str.split(/\W+/);
    if (fmt.toLowerCase() == '%y%x' || fmt.toLowerCase() == '%y%x%d') {
        var yearlength = 4;
        var otherlength = 2;
        a[0] = str.substring(0, yearlength);
        a[1] = str.substring(yearlength, yearlength + otherlength);
        a[2] = str.substring(yearlength + otherlength, yearlength + otherlength * 2);
    }
    var b = fmt.match(/%./g);
    var i = 0, j = 0;
    var hr = 0;
    var min = 0;
    var sec = 0;
    for (i = 0; i < a.length; ++i) {
        switch (b[i]) {
            case "%d":
            case "%e":
                d = parseInt(a[i], 10);
                break;

            case "%X":
                m = parseInt(a[i], 10) - 1;
                break;
            case "%x":
                m = parseInt(a[i], 10) - 1;
                break;

            case "%Y":
            case "%y":
                y = parseInt(a[i], 10);
                (y < 100) && (y += (y > 29) ? 1900 : 2000);
                break;

            case "%b":
            case "%B":
                for (j = 0; j < 12; ++j) {
                    if (Date._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) {
                        m = j;
                        break;
                    }
                }
                break;

            case "%H":
            case "%I":
            case "%k":
            case "%l":
                hr = parseInt(a[i], 10);
                break;

            case "%P":
            case "%p":
                if (/pm/i.test(a[i]) && hr < 12) {
                    hr += 12;
                } else if (/am/i.test(a[i]) && hr >= 12) {
                    hr -= 12;
                }
                break;

            case "%M":
                min = parseInt(a[i], 10);
            case "%S":
                sec = parseInt(a[i], 10);
                break;
        }
    }
//    if (!a[i]) {
//        continue;
//	}
    if (isNaN(y)) {
        y = today.getFullYear();
    }
    if (isNaN(m)) {
        m = today.getMonth();
    }
    if (isNaN(d)) {
        d = today.getDate();
    }
    if (isNaN(hr)) {
        hr = today.getHours();
    }
    if (isNaN(min)) {
        min = today.getMinutes();
    }
    if (isNaN(sec)) {
        sec = today.getSeconds();
    }
    if (y != 0) {
        return new Date(y, m, d, hr, min, sec);
    }
    y = 0;
    m = -1;
    d = 0;
    for (i = 0; i < a.length; ++i) {
        if (a[i].search(/[a-zA-Z]+/) != -1) {
            var t = -1;
            for (j = 0; j < 12; ++j) {
                if (Date._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) {
                    t = j;
                    break;
                }
            }
            if (t != -1) {
                if (m != -1) {
                    d = m + 1;
                }
                m = t;
            }
        } else if (parseInt(a[i], 10) <= 12 && m == -1) {
            m = a[i] - 1;
        } else if (parseInt(a[i], 10) > 31 && y == 0) {
            y = parseInt(a[i], 10);
            (y < 100) && (y += (y > 29) ? 1900 : 2000);
        } else if (d == 0) {
            d = a[i];
        }
    }
    if (y == 0) {
        y = today.getFullYear();
    }
    if (m != -1 && d != 0) {
        return new Date(y, m, d, hr, min, sec);
    }
    return today;
};/*
 * 给jQuery.Event对象添加的工具方法
 */
$.extend($.Event.prototype, {
    // event.stopEvent
    stopEvent: function () {
        this.stopPropagation();
        this.preventDefault();
    }
});Function.prototype.before = function (func) {
    var __self = this;
    return function () {
        if (func.apply(this, arguments) === false) {
            return false;
        }
        return __self.apply(this, arguments);
    }
};

Function.prototype.after = function (func) {
    var __self = this;
    return function () {
        var ret = __self.apply(this, arguments);
        if (ret === false) {
            return false;
        }
        func.apply(this, arguments);
        return ret;
    }
};if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== '0.000' ||
    (0.9).toFixed(0) === '0' || (1.255).toFixed(2) !== '1.25' ||
    (1000000000000000128).toFixed(0) !== "1000000000000000128") {
    (function () {
        var base, size, data, i;
        base = 1e7;
        size = 6;
        data = [0, 0, 0, 0, 0, 0];
        function multiply(n, c) {
            var i = -1;
            while (++i < size) {
                c += n * data[i];
                data[i] = c % base;
                c = Math.floor(c / base);
            }
        }

        function divide(n) {
            var i = size, c = 0;
            while (--i >= 0) {
                c += data[i];
                data[i] = Math.floor(c / n);
                c = (c % n) * base;
            }
        }

        function toString() {
            var i = size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || data[i] !== 0) {
                    var t = String(data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += '0000000'.slice(0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        }

        function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x)
                : pow(x * x, n / 2, acc)));
        }

        function log(x) {
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
                throw new RangeError('Number.toFixed called with invalid number of decimals');
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
                //1e-21<x<1e21
                //-70<log2(x)<70
                e = log(x * pow(2, 69, 1)) - 69;
                z = (e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1));
                z *= 0x10000000000000;//Math.pow(2,52);
                e = 52 - e;

                //-18<e<122
                //x=z/2^e
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
                    m = toString() + '0.00000000000000000000'.slice(2, 2 + f);
                }
            }

            if (f > 0) {
                k = m.length;

                if (k <= f) {
                    m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
                } else {
                    m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
                }
            } else {
                m = s + m;
            }

            return m;
        }

    })();
}


/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
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

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};
/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
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
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
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
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};/**
 * 特殊情况
 * Created by wang on 15/6/23.
 */
//解决console未定义问题 guy
window.console = window.console || (function () {
        var c = {};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
            = c.clear = c.exception = c.trace = c.assert = function () {
        };
        return c;
    })();


//修复ie9下sort方法的bug
!function (window) {
    var ua = window.navigator.userAgent.toLowerCase(),
        reg = /msie|applewebkit.+safari/;
    if (reg.test(ua)) {
        var _sort = Array.prototype.sort;
        Array.prototype.sort = function (fn) {
            if (!!fn && typeof fn === 'function') {
                if (this.length < 2) {
                    return this;
                }
                var i = 0, j = i + 1, l = this.length, tmp, r = false, t = 0;
                for (; i < l; i++) {
                    for (j = i + 1; j < l; j++) {
                        t = fn.call(this, this[i], this[j]);
                        r = (typeof t === 'number' ? t :
                                !!t ? 1 : 0) > 0;
                        if (r === true) {
                            tmp = this[i];
                            this[i] = this[j];
                            this[j] = tmp;
                        }
                    }
                }
                return this;
            } else {
                return _sort.call(this);
            }
        };
    }
}(window);/**
 * 对字符串对象的扩展
 * @class String
 */
$.extend(String.prototype, {

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
        $.each(paras, function (name, value) {
            if (typeof(name) === 'string') {
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
        } else {
            return start + this;
        }
    },

    /**
     * 获取字符串中某字符串的所有项位置数组
     * @param {String} sub 子字符串
     * @return {Number[]} 子字符串在父字符串中出现的所有位置组成的数组
     */
    allIndexOf: function (sub) {
        if (typeof sub != 'string') {
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
$.extend(String, {

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
 * guy
 * 状态常量
 */

_.extend(BI, {
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
        Default: -999,
        None: -1,
        Single: 0,
        Multi: 1,
        All: 2
    },
    HorizontalAlign: {
        Left: "left",
        Right: "right",
        Center: "center"
    },
    VerticalAlign: {
        Middle: "middle",
        Top: "top",
        Bottom: "bottom"
    }
});BI.EventListener = {
    listen: function listen(target, eventType, callback) {
        if (target.addEventListener) {
            target.addEventListener(eventType, callback, false);
            return {
                remove: function remove() {
                    target.removeEventListener(eventType, callback, false);
                }
            };
        } else if (target.attachEvent) {
            target.attachEvent('on' + eventType, callback);
            return {
                remove: function remove() {
                    target.detachEvent('on' + eventType, callback);
                }
            };
        }
    },

    capture: function capture(target, eventType, callback) {
        if (target.addEventListener) {
            target.addEventListener(eventType, callback, true);
            return {
                remove: function remove() {
                    target.removeEventListener(eventType, callback, true);
                }
            };
        } else {
            return {
                remove: BI.emptyFn
            };
        }
    },

    registerDefault: function registerDefault() {
    }
};!(function () {
    var cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.clearTimeout;

    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.setTimeout;


    BI.MouseMoveTracker = function (onMove, onMoveEnd, domNode) {
        this._isDragging = false;
        this._animationFrameID = null;
        this._domNode = domNode;
        this._onMove = onMove;
        this._onMoveEnd = onMoveEnd;

        this._onMouseMove = BI.bind(this._onMouseMove, this);
        this._onMouseUp = BI.bind(this._onMouseUp, this);
        this._didMouseMove = BI.bind(this._didMouseMove, this);
    };
    BI.MouseMoveTracker.prototype = {
        constructor: BI.MouseMoveTracker,
        captureMouseMoves: function (/*object*/ event) {
            if (!this._eventMoveToken && !this._eventUpToken) {
                this._eventMoveToken = BI.EventListener.listen(
                    this._domNode,
                    'mousemove',
                    this._onMouseMove
                );
                this._eventUpToken = BI.EventListener.listen(
                    this._domNode,
                    'mouseup',
                    this._onMouseUp
                );
            }

            if (!this._isDragging) {
                this._deltaX = 0;
                this._deltaY = 0;
                this._isDragging = true;
                this._x = event.clientX;
                this._y = event.clientY;
            }
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        },

        releaseMouseMoves: function () {
            if (this._eventMoveToken && this._eventUpToken) {
                this._eventMoveToken.remove();
                this._eventMoveToken = null;
                this._eventUpToken.remove();
                this._eventUpToken = null;
            }

            if (this._animationFrameID !== null) {
                cancelAnimationFrame(this._animationFrameID);
                this._animationFrameID = null;
            }

            if (this._isDragging) {
                this._isDragging = false;
                this._x = null;
                this._y = null;
            }
        },

        isDragging: function () /*boolean*/ {
            return this._isDragging;
        },

        _onMouseMove: function (/*object*/ event) {
            var x = event.clientX;
            var y = event.clientY;

            this._deltaX += (x - this._x);
            this._deltaY += (y - this._y);

            if (this._animationFrameID === null) {
                // The mouse may move faster then the animation frame does.
                // Use `requestAnimationFrame` to avoid over-updating.
                this._animationFrameID =
                    requestAnimationFrame(this._didMouseMove);
            }

            this._x = x;
            this._y = y;
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        },

        _didMouseMove: function () {
            this._animationFrameID = null;
            this._onMove(this._deltaX, this._deltaY);
            this._deltaX = 0;
            this._deltaY = 0;
        },

        _onMouseUp: function () {
            if (this._animationFrameID) {
                this._didMouseMove();
            }
            this._onMoveEnd();
        }
    };
})();!(function () {
    var PIXEL_STEP = 10;
    var LINE_HEIGHT = 40;
    var PAGE_HEIGHT = 800;
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.setTimeout;

    function normalizeWheel(/*object*/event) /*object*/ {
        var sX = 0,
            sY = 0,
            // spinX, spinY
            pX = 0,
            pY = 0; // pixelX, pixelY

        // Legacy
        if ('detail' in event) {
            sY = event.detail;
        }
        if ('wheelDelta' in event) {
            sY = -event.wheelDelta / 120;
        }
        if ('wheelDeltaY' in event) {
            sY = -event.wheelDeltaY / 120;
        }
        if ('wheelDeltaX' in event) {
            sX = -event.wheelDeltaX / 120;
        }

        // side scrolling on FF with DOMMouseScroll
        if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
            sX = sY;
            sY = 0;
        }

        pX = sX * PIXEL_STEP;
        pY = sY * PIXEL_STEP;

        if ('deltaY' in event) {
            pY = event.deltaY;
        }
        if ('deltaX' in event) {
            pX = event.deltaX;
        }

        if ((pX || pY) && event.deltaMode) {
            if (event.deltaMode === 1) {
                // delta in LINE units
                pX *= LINE_HEIGHT;
                pY *= LINE_HEIGHT;
            } else {
                // delta in PAGE units
                pX *= PAGE_HEIGHT;
                pY *= PAGE_HEIGHT;
            }
        }

        // Fall-back if spin cannot be determined
        if (pX && !sX) {
            sX = pX < 1 ? -1 : 1;
        }
        if (pY && !sY) {
            sY = pY < 1 ? -1 : 1;
        }

        return {
            spinX: sX,
            spinY: sY,
            pixelX: pX,
            pixelY: pY
        };
    }

    BI.WheelHandler = function (onWheel, handleScrollX, handleScrollY, stopPropagation) {
        this._animationFrameID = null;
        this._deltaX = 0;
        this._deltaY = 0;
        this._didWheel = BI.bind(this._didWheel, this);
        if (typeof handleScrollX !== 'function') {
            handleScrollX = handleScrollX ?
                function () {
                    return true
                } :
                function () {
                    return false
                };
        }

        if (typeof handleScrollY !== 'function') {
            handleScrollY = handleScrollY ?
                function () {
                    return true
                } :
                function () {
                    return false
                };
        }

        if (typeof stopPropagation !== 'function') {
            stopPropagation = stopPropagation ?
                function () {
                    return true
                } :
                function () {
                    return false
                };
        }

        this._handleScrollX = handleScrollX;
        this._handleScrollY = handleScrollY;
        this._stopPropagation = stopPropagation;
        this._onWheelCallback = onWheel;
        this.onWheel = BI.bind(this.onWheel, this);
    };
    BI.WheelHandler.prototype = {
        constructor: BI.WheelHandler,
        onWheel: function (/*object*/ event) {
            var normalizedEvent = normalizeWheel(event);
            var deltaX = this._deltaX + normalizedEvent.pixelX;
            var deltaY = this._deltaY + normalizedEvent.pixelY;
            var handleScrollX = this._handleScrollX(deltaX, deltaY);
            var handleScrollY = this._handleScrollY(deltaY, deltaX);
            if (!handleScrollX && !handleScrollY) {
                return;
            }

            this._deltaX += handleScrollX ? normalizedEvent.pixelX : 0;
            this._deltaY += handleScrollY ? normalizedEvent.pixelY : 0;
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);

            var changed;
            if (this._deltaX !== 0 || this._deltaY !== 0) {
                if (this._stopPropagation()) {
                    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
                }
                changed = true;
            }

            if (changed === true && this._animationFrameID === null) {
                this._animationFrameID = requestAnimationFrame(this._didWheel);
            }
        },

        _didWheel: function () {
            this._animationFrameID = null;
            this._onWheelCallback(this._deltaX, this._deltaY);
            this._deltaX = 0;
            this._deltaY = 0;
        }
    };
})();/**
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
    empty: null
});/**
 * absolute实现的居中布局
 * @class BI.AbsoluteCenterLayout
 * @extends BI.Layout
 */
BI.AbsoluteCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AbsoluteCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-absolute-center-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    _init: function () {
        BI.AbsoluteCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "absolute",
            "left": o.hgap + o.lgap + (item.lgap || 0),
            "right": o.hgap + o.rgap + (item.rgap || 0),
            "top": o.vgap + o.tgap + (item.tgap || 0),
            "bottom": o.vgap + o.bgap + (item.bgap || 0),
            "margin": "auto"
        });
        return w;
    },

    resize: function () {
        // console.log("absolute_center_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.AbsoluteCenterLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.absolute_center_adapt', BI.AbsoluteCenterLayout);/**
 * absolute实现的居中布局
 * @class BI.AbsoluteHorizontalLayout
 * @extends BI.Layout
 */
BI.AbsoluteHorizontalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AbsoluteHorizontalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-absolute-horizontal-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    _init: function () {
        BI.AbsoluteHorizontalLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteHorizontalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "absolute",
            "left": o.hgap + o.lgap + (item.lgap || 0),
            "right": o.hgap + o.rgap + (item.rgap || 0),
            "margin": "auto"
        });
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css("top", o.vgap + o.tgap + (item.tgap || 0));
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css("bottom", o.vgap + o.bgap + (item.bgap || 0));
        }
        return w;
    },

    resize: function () {
        // console.log("absolute_horizontal_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.AbsoluteHorizontalLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.absolute_horizontal_adapt', BI.AbsoluteHorizontalLayout);/**
 * absolute实现的居中布局
 * @class BI.AbsoluteVerticalLayout
 * @extends BI.Layout
 */
BI.AbsoluteVerticalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AbsoluteVerticalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-absolute-vertical-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    _init: function () {
        BI.AbsoluteVerticalLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteVerticalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "absolute",
            "left": item.lgap,
            "right": item.rgap,
            "top": o.vgap + o.tgap + (item.tgap || 0),
            "bottom": o.vgap + o.bgap + (item.bgap || 0),
            "margin": "auto"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css("left", o.hgap + o.lgap + (item.lgap || 0));
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css("right", o.hgap + o.rgap + (item.rgap || 0));
        }
        return w;
    },

    resize: function () {
        // console.log("absolute_vertical_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.AbsoluteVerticalLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.absolute_vertical_adapt', BI.AbsoluteVerticalLayout);/**
 * 自适应水平和垂直方向都居中容器
 * @class BI.CenterAdaptLayout
 * @extends BI.Layout
 */
BI.CenterAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.CenterAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-center-adapt-layout",
            columnSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.CenterAdaptLayout.superclass._init.apply(this, arguments);
        var table = BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
        table.element.css({
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        }).appendTo(this.element);
        this.tr = BI.createWidget({
            type: "bi.layout",
            tagName: "tr"
        });
        this.tr.element.appendTo(table.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this.getName() + i)) {
            var w = BI.createWidget(item);
            w.element.css({"position": "relative", "top": "0", "left": "0", "margin": "0px auto"});
            td = BI.createWidget({
                type: "bi.default",
                tagName: "td",
                attributes: {
                    width: width
                },
                items: [w]
            });
            this.addWidget(this.getName() + i, td);
        } else {
            td = this.getWidgetByName(this.getName() + i);
            td.element.attr("width", width);
        }
        td.element.css({"max-width": o.columnSize[i]});
        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            "position": "relative",
            "height": "100%",
            "vertical-align": "middle",
            "margin": "0",
            "padding": "0",
            "border": "none"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return td;
    },

    render: function () {
        if (!BI.isEmpty(this.widgets)) {
            this.tr.element.append(this.hang());
        }
        return this;
    },

    clear: function () {
        this.hang();
        this.widgets = {};
        this.tr.empty();
    },

    empty: function () {
        BI.each(this.widgets, function (i, wi) {
            wi.destroy();
        });
        this.widgets = {};
        this.tr.empty();
    },

    resize: function () {
        // console.log("center_adapt布局不需要resize");
    },

    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.tr.element);
        return w;
    },

    populate: function (items) {
        BI.CenterAdaptLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.center_adapt', BI.CenterAdaptLayout);/**
 * 水平方向居中容器
 * @class BI.HorizontalAdaptLayout
 * @extends BI.Layout
 */
BI.HorizontalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-horizontal-adapt-layout",
            verticalAlign: BI.VerticalAlign.Middle,
            columnSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.HorizontalAdaptLayout.superclass._init.apply(this, arguments);
        var table = BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
        table.element.css({
            "position": "relative",
            "width": "100%",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        }).appendTo(this.element);
        this.tr = BI.createWidget({
            type: "bi.layout",
            tagName: "tr"
        });
        this.tr.element.appendTo(table.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this.getName() + i)) {
            var w = BI.createWidget(item);
            w.element.css({"position": "relative", "top": "0", "left": "0", "margin": "0px auto"});
            td = BI.createWidget({
                type: "bi.default",
                tagName: "td",
                attributes: {
                    width: width
                },
                items: [w]
            });
            this.addWidget(this.getName() + i, td);
        } else {
            td = this.getWidgetByName(this.getName() + i);
            td.element.attr("width", width);
        }
        td.element.css({"max-width": o.columnSize[i] + "px"});
        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            "position": "relative",
            "vertical-align": o.verticalAlign,
            "margin": "0",
            "padding": "0",
            "border": "none"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return td;
    },

    render: function () {
        if (!BI.isEmpty(this.widgets)) {
            this.tr.element.append(this.hang());
        }
    },

    clear: function () {
        this.hang();
        this.widgets = {};
        this.tr.empty();
    },

    empty: function () {
        BI.each(this.widgets, function (i, wi) {
            wi.destroy();
        });
        this.widgets = {};
        this.tr.empty();
    },

    resize: function () {
        // console.log("horizontal_adapt布局不需要resize");
    },

    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.tr.element);
        return w;
    },

    populate: function (items) {
        BI.HorizontalAdaptLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.horizontal_adapt', BI.HorizontalAdaptLayout);/**
 * 左右分离，垂直方向居中容器
 *          items:{
                left: [{el:{type:"bi.button"}}],
                right:[{el:{type:"bi.button"}}]
            }
 * @class BI.LeftRightVerticalAdaptLayout
 * @extends BI.Layout
 */
BI.LeftRightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-left-right-vertical-adapt-layout",
            items: {},
            llgap: 0,
            lrgap: 0,
            lhgap: 0,
            rlgap: 0,
            rrgap: 0,
            rhgap: 0
        });
    },
    _init: function () {
        BI.LeftRightVerticalAdaptLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("left_right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var o = this.options;
        if ("left" in items) {
            var left = BI.createWidget({
                type: "bi.vertical_adapt",
                items: items.left,
                hgap: o.lhgap,
                lgap: o.llgap,
                rgap: o.lrgap
            });
            left.element.css("height", "100%");
            BI.createWidget({
                type: "bi.left",
                element: this.element,
                items: [left]
            });
            this.addWidget(left);
        }
        if ("right" in items) {
            var right = BI.createWidget({
                type: "bi.vertical_adapt",
                items: items.right,
                hgap: o.rhgap,
                lgap: o.rlgap,
                rgap: o.rrgap
            });
            right.element.css("height", "100%");
            BI.createWidget({
                type: "bi.right",
                element: this.element,
                items: [right]
            });
            this.addWidget(right);
        }
    },

    populate: function (items) {
        BI.LeftRightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.left_right_vertical_adapt', BI.LeftRightVerticalAdaptLayout);


BI.LeftVerticalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-left-vertical-adapt-layout",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    _init: function () {
        BI.LeftVerticalAdaptLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        console.log("left_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("不能添加元素")
    },

    populate: function (items) {
        BI.LeftVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        var o = this.options;
        var left = BI.createWidget({
            type: "bi.vertical_adapt",
            items: items,
            lgap: o.lgap,
            hgap: o.hgap,
            rgap: o.rgap
        });
        left.element.css("height", "100%");
        BI.createWidget({
            type: "bi.left",
            element: this.element,
            items: [left]
        });
        this.addWidget(left);
    }
});
$.shortcut('bi.left_vertical_adapt', BI.LeftVerticalAdaptLayout);

BI.RightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.RightVerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-right-vertical-adapt-layout",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    _init: function () {
        BI.RightVerticalAdaptLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        console.log("right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("不能添加元素")
    },

    populate: function (items) {
        BI.RightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        var o = this.options;
        var right = BI.createWidget({
            type: "bi.vertical_adapt",
            items: items,
            lgap: o.lgap,
            hgap: o.hgap,
            rgap: o.rgap
        });
        right.element.css("height", "100%");
        BI.createWidget({
            type: "bi.right",
            element: this.element,
            items: [right]
        });
        this.addWidget(right);
    }
});
$.shortcut('bi.right_vertical_adapt', BI.RightVerticalAdaptLayout);/**
 * 垂直方向居中容器
 * @class BI.VerticalAdaptLayout
 * @extends BI.Layout
 */
BI.VerticalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.VerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-vertical-adapt-layout",
            columnSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.VerticalAdaptLayout.superclass._init.apply(this, arguments);
        var table = BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
        table.element.css({
            "position": "relative",
            "height": "100%",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        }).appendTo(this.element);
        this.tr = BI.createWidget({
            type: "bi.layout",
            tagName: "tr"
        });
        this.tr.element.appendTo(table.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this.getName() + i)) {
            var w = BI.createWidget(item);
            w.element.css({"position": "relative", "top": "0", "left": "0", "margin": "0px auto"});
            td = BI.createWidget({
                type: "bi.default",
                tagName: "td",
                attributes: {
                    width: width
                },
                items: [w]
            });
            this.addWidget(this.getName() + i, td);
        } else {
            td = this.getWidgetByName(this.getName() + i);
            td.element.attr("width", width);
        }

        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            "position": "relative",
            "height": "100%",
            "vertical-align": "middle",
            "margin": "0",
            "padding": "0",
            "border": "none"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return td;
    },

    render: function () {
        if (!BI.isEmpty(this.widgets)) {
            this.tr.element.append(this.hang());
        }
    },

    clear: function () {
        this.hang();
        this.widgets = {};
        this.tr.empty();
    },

    empty: function () {
        BI.each(this.widgets, function (i, wi) {
            wi.destroy();
        });
        this.widgets = {};
        this.tr.empty();
    },

    resize: function () {
        // console.log("vertical_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.VerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.vertical_adapt', BI.VerticalAdaptLayout);/**
 * 水平方向居中自适应容器
 * @class BI.HorizontalAutoLayout
 * @extends BI.Layout
 */
BI.HorizontalAutoLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalAutoLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-horizon-auto-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    _init: function () {
        BI.HorizontalAutoLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.HorizontalAutoLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "relative",
            "margin": "0px auto"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("horizontal_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.HorizontalAutoLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.horizontal_auto', BI.HorizontalAutoLayout);/**
 * 浮动的居中布局
 */
BI.FloatCenterAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatCenterAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-center-adapt-layout",
            items: [],
            hgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0,
            lgap: 0,
            rgap: 0
        });
    },
    _init: function () {
        BI.FloatCenterAdaptLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("float_center_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        var left = BI.createWidget({
            type: "bi.vertical",
            items: items,
            hgap: o.hgap,
            vgap: o.vgap,
            tgap: o.tgap,
            bgap: o.bgap,
            lgap: o.lgap,
            rgap: o.rgap
        });

        BI.createWidget({
            type: "bi.left",
            element: this.element,
            items: [left]
        });

        BI.nextTick(function () {
            var width = left.element.width(),
                height = left.element.height();
            BI.DOM.hang([left]);
            left.element.width(width).height(height).css("float", "none");
            BI.createWidget({
                type: "bi.center_adapt",
                element: self.element,
                items: [left]
            })
        });
    },

    populate: function (items) {
        BI.FloatCenterAdaptLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.float_center_adapt', BI.FloatCenterAdaptLayout);/**
 * 浮动的水平居中布局
 */
BI.FloatHorizontalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatHorizontalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-horizontal-adapt-layout",
            items: [],
            hgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0,
            lgap: 0,
            rgap: 0
        });
    },
    _init: function () {
        BI.FloatHorizontalLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("float_horizontal_adapt布局不需要resize");
    },

    _addElement: function (i, item) {
        var self = this, o = this.options;
        var left = BI.createWidget({
            type: "bi.vertical",
            items: [item],
            hgap: o.hgap,
            vgap: o.vgap,
            tgap: o.tgap,
            bgap: o.bgap,
            lgap: o.lgap,
            rgap: o.rgap
        });

        BI.createWidget({
            type: "bi.left",
            element: this.element,
            items: [left]
        });

        BI.nextTick(function () {
            var width = left.element.width(),
                height = left.element.height();
            BI.DOM.hang([left]);
            left.element.width(width).height(height).css("float", "none");
            BI.createWidget({
                type: "bi.horizontal_auto",
                element: self.element,
                items: [left]
            })
        });
        this.addWidget(left);
        return left;
    },

    populate: function (items) {
        BI.HorizontalAutoLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.horizontal_float', BI.FloatHorizontalLayout);/**
 * 内联布局
 * @class BI.InlineCenterAdaptLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.InlineCenterAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.InlineCenterAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-inline-center-adapt-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.InlineCenterAdaptLayout.superclass._init.apply(this, arguments);
        this.element.css({
            whiteSpace: "nowrap"
        });
        this.populate(this.options.items);
    },

    _addElement: function (i, item, length) {
        var o = this.options;
        if (!this.hasWidget(this.getName() + i)) {
            var t = BI.createWidget(item);
            t.element.css({
                "position": "relative"
            });
            var w = BI.createWidget({
                type: "bi.horizontal_auto",
                items: [t]
            });
            this.addWidget(this.getName() + i, w);
        } else {
            var w = this.getWidgetByName(this.getName() + i);
        }
        w.element.css({
            "position": "relative",
            "display": "inline-block",
            "vertical-align": "middle",
            "*display": "inline",
            "*zoom": 1,
            "min-width": 100 / length + "%"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        throw new Error("不能添加元素");
    },

    stroke: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                self._addElement(i, item, items.length);
            }
        });
    },

    populate: function (items) {
        BI.InlineCenterAdaptLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.inline_center_adapt', BI.InlineCenterAdaptLayout);/**
 * 内联布局
 * @class BI.InlineVerticalAdaptLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.InlineVerticalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.InlineVerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-inline-vertical-adapt-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.InlineVerticalAdaptLayout.superclass._init.apply(this, arguments);
        this.element.css({
            whiteSpace: "nowrap"
        });
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.InlineVerticalAdaptLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "relative",
            "display": "inline-block",
            "vertical-align": "middle",
            "*display": "inline",
            "*zoom": 1
        });
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.InlineVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.inline_vertical_adapt', BI.InlineVerticalAdaptLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexCenterLayout
 * @extends BI.Layout
 */
BI.FlexCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FlexCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-flex-center-layout"
        });
    },
    _init: function () {
        BI.FlexCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "flex-shrink": "0"});
        return w;
    },

    resize: function () {
        // console.log("flex_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexCenterLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.flex_center', BI.FlexCenterLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexHorizontalLayout
 * @extends BI.Layout
 */
BI.FlexHorizontalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FlexHorizontalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-flex-horizontal-layout",
            verticalAlign: "middle",
            columnSize: [],
            scrollx: true,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FlexHorizontalLayout.superclass._init.apply(this, arguments);
        var o = this.options;
        this.element.addClass(o.verticalAlign);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexHorizontalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "flex-shrink": "0"});
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("flex_horizontal布局不需要resize");
    },

    populate: function (items) {
        BI.FlexHorizontalLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.flex_horizontal', BI.FlexHorizontalLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalCenter
 * @extends BI.Layout
 */
BI.FlexVerticalCenter = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FlexVerticalCenter.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-flex-vertical-center",
            columnSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FlexVerticalCenter.superclass._init.apply(this, arguments);
        var o = this.options;
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexVerticalCenter.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "flex-shrink": "0"});
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("flex_vertical_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexVerticalCenter.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.flex_vertical_center', BI.FlexVerticalCenter);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexCenterLayout
 * @extends BI.Layout
 */
BI.FlexCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FlexCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-flex-wrapper-center-layout clearfix"
        });
    },
    _init: function () {
        BI.FlexCenterLayout.superclass._init.apply(this, arguments);
        this.wrapper = $("<div>").addClass("flex-wrapper-center-layout-wrapper").appendTo(this.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"}).appendTo(this.wrapper);
        return w;
    },

    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.wrapper);
        return w;
    },

    resize: function () {
        // console.log("flex_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexCenterLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.flex_wrapper_center', BI.FlexCenterLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexHorizontalLayout
 * @extends BI.Layout
 */
BI.FlexHorizontalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FlexHorizontalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-flex-wrapper-horizontal-layout clearfix",
            verticalAlign: "middle",
            columnSize: [],
            scrollx: true,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FlexHorizontalLayout.superclass._init.apply(this, arguments);
        var o = this.options;
        this.wrapper = $("<div>").addClass("flex-wrapper-horizontal-layout-wrapper " + o.verticalAlign).appendTo(this.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexHorizontalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"}).appendTo(this.wrapper);
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.wrapper);
        return w;
    },

    resize: function () {
        // console.log("flex_horizontal布局不需要resize");
    },

    populate: function (items) {
        BI.FlexHorizontalLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.flex_wrapper_horizontal', BI.FlexHorizontalLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalCenter
 * @extends BI.Layout
 */
BI.FlexVerticalCenter = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FlexVerticalCenter.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-flex-wrapper-vertical-center clearfix",
            columnSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FlexVerticalCenter.superclass._init.apply(this, arguments);
        var o = this.options;
        this.wrapper = $("<div>").addClass("flex-wrapper-vertical-center-wrapper").appendTo(this.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexVerticalCenter.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"}).appendTo(this.wrapper);
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.wrapper);
        return w;
    },

    resize: function () {
        // console.log("flex_vertical_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexVerticalCenter.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.flex_wrapper_vertical_center', BI.FlexVerticalCenter);/**
 * 固定子组件上下左右的布局容器
 * @class BI.AbsoluteLayout
 * @extends BI.Layout
 */
BI.AbsoluteLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AbsoluteLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-absolute-layout",
            hgap: null,
            vgap: null,
            lgap: null,
            rgap: null,
            tgap: null,
            bgap: null
        });
    },
    _init: function () {
        BI.AbsoluteLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteLayout.superclass._addElement.apply(this, arguments);
        var left = 0, right = 0, top = 0, bottom = 0;
        if (BI.isNotNull(item.left)) {
            w.element.css({"left": item.left});
            left += item.left;
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({"right": item.right});
            right += item.right;
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({"top": item.top});
            top += item.top;
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({"bottom": item.bottom});
            bottom += item.bottom;
        }

        if (BI.isNotNull(o.hgap)) {
            left += o.hgap;
            w.element.css({"left": left});
            right += o.hgap;
            w.element.css({"right": right});
        }
        if (BI.isNotNull(o.vgap)) {
            top += o.vgap;
            w.element.css({"top": top});
            bottom += o.vgap;
            w.element.css({"bottom": bottom});
        }

        if (BI.isNotNull(o.lgap)) {
            left += o.lgap;
            w.element.css({"left": left});
        }
        if (BI.isNotNull(o.rgap)) {
            right += o.rgap;
            w.element.css({"right": right});
        }
        if (BI.isNotNull(o.tgap)) {
            top += o.tgap;
            w.element.css({"top": top});
        }
        if (BI.isNotNull(o.bgap)) {
            bottom += o.bgap;
            w.element.css({"bottom": bottom});
        }


        if (BI.isNotNull(item.width)) {
            w.element.css({"width": item.width});
        }
        if (BI.isNotNull(item.height)) {
            w.element.css({"height": item.height});
        }
        w.element.css({"position": "absolute"});
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    stroke: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                if (!BI.isWidget(item) && !item.el) {
                    throw new Error("absolute布局中el 是必要属性");
                }
                self._addElement(i, item);
            }
        });
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.absolute', BI.AbsoluteLayout);BI.AdaptiveLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AdaptiveLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-adaptive-layout",
            hgap: null,
            vgap: null,
            lgap: null,
            rgap: null,
            tgap: null,
            bgap: null
        });
    },
    _init: function () {
        BI.AdaptiveLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AdaptiveLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"});
        var left = 0, right = 0, top = 0, bottom = 0;
        if (BI.isNotNull(item.left)) {
            w.element.css({
                "margin-left": item.left
            })
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({
                "margin-right": item.right
            })
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({
                "margin-top": item.top
            })
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({
                "margin-bottom": item.bottom
            })
        }

        if (BI.isNotNull(o.hgap)) {
            left += o.hgap;
            w.element.css({"left": left});
            right += o.hgap;
            w.element.css({"right": right});
        }
        if (BI.isNotNull(o.vgap)) {
            top += o.vgap;
            w.element.css({"top": top});
            bottom += o.vgap;
            w.element.css({"bottom": bottom});
        }

        if (BI.isNotNull(o.lgap)) {
            left += o.lgap;
            w.element.css({"left": left});
        }
        if (BI.isNotNull(o.rgap)) {
            right += o.rgap;
            w.element.css({"right": right});
        }
        if (BI.isNotNull(o.tgap)) {
            top += o.tgap;
            w.element.css({"top": top});
        }
        if (BI.isNotNull(o.bgap)) {
            bottom += o.bgap;
            w.element.css({"bottom": bottom});
        }

        if (BI.isNotNull(item.width)) {
            w.element.css({"width": item.width});
        }
        if (BI.isNotNull(item.height)) {
            w.element.css({"height": item.height});
        }
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.adaptive', BI.AdaptiveLayout);/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.BorderLayout
 * @extends BI.Layout
 */
BI.BorderLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.BorderLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-border-layout",
            items: {}
        });
    },
    _init: function () {
        BI.BorderLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function(regions){
        var item;
        var top = 0;
        var bottom = 0;
        var left = 0;
        var right = 0;
        if ("north" in regions) {
            item = regions["north"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this.getName() + "north")) {
                        var w = BI.createWidget(item);
                        this.addWidget(this.getName() + "north", w);
                    }
                    this.getWidgetByName(this.getName() + "north").element.height(item.height)
                        .css({
                            "position": "absolute",
                            "top": (item.top || 0),
                            "left": (item.left || 0),
                            "right": (item.right || 0),
                            "bottom": "initial"
                        });
                }
                top = (item.height || 0) + (item.top || 0) + (item.bottom || 0);
            }
        }
        if ("south" in regions) {
            item = regions["south"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this.getName() + "south")) {
                        var w = BI.createWidget(item);
                        this.addWidget(this.getName() + "south", w);
                    }
                    this.getWidgetByName(this.getName() + "south").element.height(item.height)
                        .css({
                            "position": "absolute",
                            "bottom": (item.bottom || 0),
                            "left": (item.left || 0),
                            "right": (item.right || 0),
                            "top": "initial"
                        });
                }
                bottom = (item.height || 0) + (item.top || 0) + (item.bottom || 0);
            }
        }
        if ("west" in regions) {
            item = regions["west"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this.getName() + "west")) {
                        var w = BI.createWidget(item);
                        this.addWidget(this.getName() + "west", w);
                    }
                    this.getWidgetByName(this.getName() + "west").element.width(item.width)
                        .css({
                            "position": "absolute",
                            "left": (item.left || 0),
                            top: top,
                            bottom: bottom,
                            "right": "initial"
                        });
                }
                left = (item.width || 0) + (item.left || 0) + (item.right || 0);
            }
        }
        if ("east" in regions) {
            item = regions["east"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this.getName() + "east")) {
                        var w = BI.createWidget(item);
                        this.addWidget(this.getName() + "east", w);
                    }
                    this.getWidgetByName(this.getName() + "east").element.width(item.width)
                        .css({
                            "position": "absolute",
                            "right": (item.right || 0),
                            top: top,
                            bottom: bottom,
                            "left": "initial"
                        });
                }
                right = (item.width || 0) + (item.left || 0) + (item.right || 0);
            }
        }
        if ("center" in regions) {
            item = regions["center"];
            if (item != null) {
                if (!this.hasWidget(this.getName() + "center")) {
                    var w = BI.createWidget(item);
                    this.addWidget(this.getName() + "center", w);
                }
                this.getWidgetByName(this.getName() + "center").element
                    .css({"position": "absolute", "top": top, "bottom": bottom, "left": left, "right": right});
            }
        }
    },

    populate: function (items) {
        BI.BorderLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.border', BI.BorderLayout);/**
 * 卡片布局，可以做到当前只显示一个组件，其他的都隐藏
 * @class BI.CardLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {String} options.defaultShowName 默认展示的子组件名
 */
BI.CardLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.CardLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-card-layout",
            items: []
        });
    },
    _init: function () {
        BI.CardLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getCardName: function (cardName) {
        return this.getName() + cardName;
    },

    resize: function () {
        // console.log("default布局不需要resize");
    },

    stroke: function (items) {
        var self = this;
        this.clear();
        this.showIndex = void 0;
        BI.each(items, function (i, item) {
            if (!!item) {
                if (!self.hasWidget(self._getCardName(item.cardName))) {
                    var w = BI.createWidget(item);
                    self.addWidget(self._getCardName(item.cardName), w);
                } else {
                    var w = self.getWidgetByName(self._getCardName(item.cardName));
                }
                w.element.css({"position": "absolute", "top": "0", "right": "0", "bottom": "0", "left": "0"});
                w.invisible();
            }
        });
    },

    populate: function (items) {
        BI.CardLayout.superclass.populate.apply(this, arguments);
        this.render();
        this.options.defaultShowName && this.showCardByName(this.options.defaultShowName);
    },

    isCardExisted: function (cardName) {
        return this.hasWidget(this._getCardName(cardName))
            && $(this.getWidgetByName(this._getCardName(cardName)).element).length !== 0;
    },

    getCardByName: function (cardName) {
        if (!this.hasWidget(this._getCardName(cardName))) {
            throw new Error("cardName不存在，无法获取");
        }
        return this.widgets[this._getCardName(cardName)];
    },

    deleteCardByName: function (cardName) {
        if (!this.hasWidget(this._getCardName(cardName))) {
            throw new Error("cardName不存在，无法删除");
        }
        this.getWidgetByName(this._getCardName(cardName)).destroy();
        var index = BI.findKey(this.options.items, function (i, item) {
            return item.cardName == cardName;
        });
        this.options.items.splice(index, 1);
        delete this.widgets[this._getCardName(cardName)];
    },

    addCardByName: function (cardName, cardItem) {
        if (this.hasWidget(this._getCardName(cardName))) {
            throw new Error("cardName已经存在了");
        }
        this.options.items.push({el: cardItem, cardName: cardName});
        var widget = BI.createWidget(cardItem);
        widget.element.css({"position": "relative", "top": "0", "left": "0", "width": "100%", "height": "100%"})
            .appendTo(this.element);
        widget.invisible();
        this.addWidget(this._getCardName(cardName), widget);
        return widget;
    },

    showCardByName: function (name, action, callback) {
        var self = this;
        //name不存在的时候全部隐藏
        var exist = this.hasWidget(this._getCardName(name));
        if (this.showIndex != null) {
            this.lastShowIndex = this.showIndex;
        }
        this.showIndex = this._getCardName(name);
        var flag = false;
        BI.each(this.widgets, function (i, el) {
            if (self._getCardName(name) != i) {
                //动画效果只有在全部都隐藏的时候才有意义,且只要执行一次动画操作就够了
                !flag && !exist && (BI.Action && action instanceof BI.Action) ? (action.actionBack(el), flag = true) : el.element.hide();
            } else {
                (BI.Action && action instanceof BI.Action) ? action.actionPerformed(void 0, el, callback) : el.element.show(0, callback);
            }
        });
    },

    showLastCard: function () {
        var self = this;
        this.showIndex = this.lastShowIndex;
        BI.each(this.widgets, function (i, el) {
            if (self.showIndex != i) {
                el.element.hide();
            } else {
                el.element.show();
            }
        })
    },

    setDefaultShowName: function (name) {
        this.options.defaultShowName = name;
        return this;
    },

    getDefaultShowName: function () {
        return this.options.defaultShowName;
    },

    getAllCardNames: function () {
        return BI.map(this.options.items, function (i, item) {
            return item.cardName;
        })
    },

    getShowingCard: function () {
        if (!BI.isKey(this.showIndex)) {
            return void 0;
        }
        return this.getWidgetByName(this.showIndex);
    },

    deleteAllCard: function () {
        var self = this;
        BI.each(this.getAllCardNames(), function (i, name) {
            self.deleteCardByName(name);
        })
    },

    hideAllCard: function () {
        BI.each(this.widgets, function (i, el) {
            el.invisible();
        });
    },

    isAllCardHide: function () {
        var flag = true;
        BI.each(this.widgets, function (i, el) {
            if (el.isVisible()) {
                flag = true;
                return false;
            }
        });
        return flag;
    },

    empty: function () {
        BI.CardLayout.superclass.empty.apply(this, arguments);
        this.showIndex = void 0;
    }
});
$.shortcut('bi.card', BI.CardLayout);/**
 * 默认的布局方式
 *
 * @class BI.DefaultLayout
 * @extends BI.Layout
 */
BI.DefaultLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.DefaultLayout.superclass._defaultConfig.apply(this, arguments), {
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: []
        });
    },
    _init: function () {
        BI.DefaultLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.DefaultLayout.superclass._addElement.apply(this, arguments);
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("default布局不需要resize")
    },

    populate: function (items) {
        BI.DefaultLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.default', BI.DefaultLayout);/**
 * 分隔容器的控件，按照宽度和高度所占比平分整个容器
 *
 * @class BI.DivisionLayout
 * @extends BI.Layout
 */
BI.DivisionLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.DivisionLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-division-layout",
            columns: null,
            rows: null,
            items: []
            //    [
            //    {
            //        column: 0,
            //        row: 0,
            //        width: 0.25,
            //        height: 0.33,
            //        el: {type: 'bi.button', text: 'button1'}
            //    },
            //    {
            //        column: 1,
            //        row: 1,
            //        width: 0.25,
            //        height: 0.33,
            //        el: {type: 'bi.button', text: 'button2'}
            //    },
            //    {
            //        column: 3,
            //        row: 2,
            //        width: 0.25,
            //        height: 0.33,
            //        el: {type: 'bi.button', text: 'button3'}
            //    }
            //]
        });
    },
    _init: function () {
        BI.DivisionLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.opitons.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function(items){
        var o = this.options;
        var rows = o.rows || o.items.length, columns = o.columns || ((o.items[0] && o.items[0].length) | 0);
        var map = BI.makeArray(rows), widths = {}, heights = {};
        function firstElement(item, row, col) {
            if (row === 0) {
                item.addClass("first-row")
            }
            if (col === 0) {
                item.addClass("first-col");
            }
            item.addClass(BI.isOdd(row + 1) ? "odd-row" : "even-row");
            item.addClass(BI.isOdd(col + 1) ? "odd-col" : "even-col");
            item.addClass("center-element");
        }

        function firstObject(item, row, col) {
            var cls = "";
            if (row === 0) {
                cls += " first-row";
            }
            if (col === 0) {
                cls += " first-col";
            }
            BI.isOdd(row + 1) ? (cls += " odd-row") : (cls += " even-row");
            BI.isOdd(col + 1) ? (cls += " odd-col") : (cls += " even-col");
            item.cls = (item.cls || "") + cls + " center-element";
        }

        function first(item, row, col) {
            if (item instanceof BI.Widget) {
                firstElement(item.element, row, col);
            } else if (item.el instanceof BI.Widget) {
                firstElement(item.el.element, row, col);
            } else if (item.el) {
                firstObject(item.el, row, col)
            } else {
                firstObject(item, row, col);
            }
        }
        BI.each(map, function (i) {
            map[i] = BI.makeArray(columns);
        });
        BI.each(items, function (i, item) {
            if (BI.isArray(item)) {
                BI.each(item, function (j, el) {
                    widths[i] = (widths[i] || 0) + item.width;
                    heights[j] = (heights[j] || 0) + item.height;
                    map[i][j] = el;
                });
                return;
            }
            widths[item.row] = (widths[item.row] || 0) + item.width;
            heights[item.column] = (heights[item.column] || 0) + item.height;
            map[item.row][item.column] = item;
        });
        for (var i = 0; i < rows; i++) {
            var totalW = 0;
            for (var j = 0; j < columns; j++) {
                if (!map[i][j]) {
                    throw new Error("缺少item项");
                }
                if(!this.hasWidget(this.getName() + i + "_" + j)) {
                    var w = BI.createWidget(map[i][j]);
                    this.addWidget(this.getName() + i + "_" + j, w);
                } else {
                    w = this.getWidgetByName(this.getName() + i + "_" + j);
                }
                var left = totalW * 100 / widths[i];
                w.element.css({"position": "absolute", "left": left + "%"});
                if (j > 0) {
                    var lastW = this.getWidgetByName(this.getName() + i + "_" + (j - 1));
                    lastW.element.css({"right": (100 - left) + "%"});
                }
                if (j == o.columns - 1) {
                    w.element.css({"right": "0%"});
                }
                first(w, i, j);
                totalW += map[i][j].width;
            }
        }
        for (var j = 0; j < o.columns; j++) {
            var totalH = 0;
            for (var i = 0; i < o.rows; i++) {
                var w = this.getWidgetByName(this.getName() + i + "_" + j);
                var top = totalH * 100 / heights[j];
                w.element.css({"top": top + "%"});
                if (i > 0) {
                    var lastW = this.getWidgetByName(this.getName() + (i - 1) + "_" + j);
                    lastW.element.css({"bottom": (100 - top) + "%"});
                }
                if (i == o.rows - 1) {
                    w.element.css({"bottom": "0%"});
                }
                totalH += map[i][j].height;
            }
        }
    },

    populate: function (items) {
        BI.DivisionLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.division', BI.DivisionLayout);/**
 * 靠左对齐的自由浮动布局
 * @class BI.FloatLeftLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.FloatLeftLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatLeftLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-left-layout clearfix",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FloatLeftLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FloatLeftLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "float": "left"});
        if (BI.isNotNull(item.left)) {
            w.element.css({"left": item.left});
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({"right": item.right});
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({"top": item.top});
        }
        if ((item.lgap || 0) + o.hgap + o.lgap !== 0) {
            w.element.css("margin-left", (item.lgap || 0) + o.hgap + o.lgap);
        }
        if ((item.rgap || 0) + o.hgap + o.rgap !== 0) {
            w.element.css("margin-right", (item.rgap || 0) + o.hgap + o.rgap);
        }
        if ((item.tgap || 0) + o.vgap + o.tgap !== 0) {
            w.element.css("margin-top", (item.tgap || 0) + o.vgap + o.tgap);
        }
        if ((item.bgap || 0) + o.vgap + o.bgap !== 0) {
            w.element.css("margin-bottom", (item.bgap || 0) + o.vgap + o.bgap);
        }
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.FloatLeftLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.left', BI.FloatLeftLayout);

/**
 * 靠右对齐的自由浮动布局
 * @class BI.FloatRightLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.FloatRightLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatRightLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-right-layout clearfix",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FloatRightLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FloatRightLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "float": "right"});
        if (BI.isNotNull(item.left)) {
            w.element.css({"left": item.left});
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({"right": item.right});
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({"top": item.top});
        }
        if ((item.lgap || 0) + o.hgap + o.lgap !== 0) {
            w.element.css("margin-left", (item.lgap || 0) + o.hgap + o.lgap);
        }
        if ((item.rgap || 0) + o.hgap + o.rgap !== 0) {
            w.element.css("margin-right", (item.rgap || 0) + o.hgap + o.rgap);
        }
        if ((item.tgap || 0) + o.vgap + o.tgap !== 0) {
            w.element.css("margin-top", (item.tgap || 0) + o.vgap + o.tgap);
        }
        if ((item.bgap || 0) + o.vgap + o.bgap !== 0) {
            w.element.css("margin-bottom", (item.bgap || 0) + o.vgap + o.bgap);
        }
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.FloatRightLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.right', BI.FloatRightLayout);/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.BorderLayout
 * @extends BI.Layout
 */
BI.GridLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.GridLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-grid-layout",
            columns: null,
            rows: null,
            items: []
            /*[
             {
             column: 0,
             row: 0,
             el: {type: 'bi.button', text: 'button1'}
             },
             {
             column: 1,
             row: 1,
             el: {type: 'bi.button', text: 'button2'}
             },
             {
             column: 3,
             row: 2,
             el: {type: 'bi.button', text: 'button3'}
             }
             ]*/
        });
    },
    _init: function () {
        BI.GridLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("grid布局不需要resize")
    },

    addItem: function () {
        //do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var o = this.options;
        var rows = o.rows || o.items.length, columns = o.columns || ((o.items[0] && o.items[0].length) | 0);
        var width = 100 / columns, height = 100 / rows;
        var els = new Array(rows);

        function firstElement(item, row, col) {
            if (row === 0) {
                item.addClass("first-row")
            }
            if (col === 0) {
                item.addClass("first-col");
            }
            item.addClass(BI.isOdd(row + 1) ? "odd-row" : "even-row");
            item.addClass(BI.isOdd(col + 1) ? "odd-col" : "even-col");
            item.addClass("center-element");
        }

        function firstObject(item, row, col) {
            var cls = "";
            if (row === 0) {
                cls += " first-row";
            }
            if (col === 0) {
                cls += " first-col";
            }
            BI.isOdd(row + 1) ? (cls += " odd-row") : (cls += " even-row");
            BI.isOdd(col + 1) ? (cls += " odd-col") : (cls += " even-col");
            item.cls = (item.cls || "") + cls + " center-element";
        }

        function first(item, row, col) {
            if (item instanceof BI.Widget) {
                firstElement(item.element, row, col);
            } else if (item.el instanceof BI.Widget) {
                firstElement(item.el.element, row, col);
            } else if (item.el) {
                firstObject(item.el, row, col)
            } else {
                firstObject(item, row, col);
            }
        }

        BI.each(els, function (i) {
            els[i] = new Array(columns);
        });
        BI.each(items, function (i, item) {
            if (BI.isArray(item)) {
                BI.each(item, function (j, el) {
                    els[i][j] = BI.createWidget(el);
                });
                return;
            }
            els[item.row][item.column] = BI.createWidget(item);
        });
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (!els[i][j]) {
                    els[i][j] = BI.createWidget({
                        type: "bi.layout"
                    });
                }
                first(els[i][j], i, j);
                els[i][j].element.css({
                    "position": "absolute",
                    "top": height * i + "%",
                    "left": width * j + "%",
                    "right": (100 - (width * (j + 1))) + "%",
                    "bottom": (100 - (height * (i + 1))) + "%"
                });
                this.addWidget(els[i][j]);
            }
        }
    },

    populate: function (items) {
        BI.GridLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.grid', BI.GridLayout);/**
 * 水平布局
 * @class BI.HorizontalLayout
 * @extends BI.Layout
 */
BI.HorizontalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-horizontal-layout",
            verticalAlign: "middle",
            columnSize: [],
            scrollx: true,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.HorizontalLayout.superclass._init.apply(this, arguments);
        var table = BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
        table.element.css({
            "position": "relative",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        }).appendTo(this.element);
        this.tr = BI.createWidget({
            type: "bi.layout",
            tagName: "tr"
        });
        this.tr.element.appendTo(table.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this.getName() + i)) {
            var w = BI.createWidget(item);
            w.element.css({"position": "relative", "margin": "0px auto"});
            td = BI.createWidget({
                type: "bi.default",
                tagName: "td",
                attributes: {
                    width: width
                },
                items: [w]
            });
            this.addWidget(this.getName() + i, td);
        } else {
            td = this.getWidgetByName(this.getName() + i);
            td.element.attr("width", width);
        }

        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            "position": "relative",
            "vertical-align": o.verticalAlign,
            "margin": "0",
            "padding": "0",
            "border": "none"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return td;
    },

    render: function () {
        if (!BI.isEmpty(this.widgets)) {
            this.tr.element.append(this.hang());
        }
        return this;
    },

    clear: function () {
        this.hang();
        this.widgets = {};
        this.tr.empty();
    },

    empty: function () {
        BI.each(this.widgets, function (i, wi) {
            wi.destroy();
        });
        this.widgets = {};
        this.tr.empty();
    },

    resize: function () {
        // console.log("horizontal layout do not need to resize");
    },

    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.tr.element);
        return w;
    },

    populate: function (items) {
        BI.HorizontalLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.horizontal', BI.HorizontalLayout);

/**
 * 水平布局
 * @class BI.HorizontalCellLayout
 * @extends BI.Layout
 */
BI.HorizontalCellLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalCellLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-horizontal-cell-layout",
            scrollable: true,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.HorizontalCellLayout.superclass._init.apply(this, arguments);
        this.element.css({"display": "table", "vertical-align": "top"});
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.HorizontalCellLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "display": "table-cell", "vertical-align": "middle"});
        if (o.hgap + o.lgap > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + "px"
            })
        }
        if (o.hgap + o.rgap > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + "px"
            })
        }
        if (o.vgap + o.tgap > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + "px"
            })
        }
        if (o.vgap + o.bgap > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("horizontal do not need to resize");
    },

    populate: function (items) {
        BI.HorizontalCellLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.horizontal_cell', BI.HorizontalCellLayout);/**
 * 内联布局
 * @class BI.InlineLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.InlineLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.InlineLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-inline-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.InlineLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.InlineLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", display: "inline-block", "*display": "inline", "*zoom": 1});
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function(){
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.InlineLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.inline', BI.InlineLayout);/**
 * 靠左对齐的自由浮动布局
 * @class BI.LatticeLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.LatticeLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.LatticeLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-lattice-layout clearfix"
            //columnSize: [0.2, 0.2, 0.6],
        });
    },
    _init: function () {
        BI.LatticeLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.LatticeLayout.superclass._addElement.apply(this, arguments);
        if (o.columnSize && o.columnSize[i]) {
            var width = o.columnSize[i] / BI.sum(o.columnSize) * 100 + "%";
        } else {
            var width = 1 / this.options.items.length * 100 + "%"
        }
        w.element.css({"position": "relative", "float": "left", "width": width});
        return w;
    },

    addItem: function (item) {
        var w = BI.LatticeLayout.superclass.addItem.apply(this, arguments);
        this.resize();
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.LatticeLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.lattice', BI.LatticeLayout);/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.TableLayout
 * @extends BI.Layout
 */
BI.TableLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.TableLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-layout",
            scrolly: true,
            columnSize: [200, 200, 'fill'],
            rowSize: 30,  //or [30,30,30]
            hgap: 0,
            vgap: 0,
            items: [[
                {
                    el: {text: 'label1'}
                },
                {
                    el: {text: 'label2'}
                },
                {
                    el: {text: 'label3'}
                }
            ]]
        });
    },
    _init: function () {
        BI.TableLayout.superclass._init.apply(this, arguments);
        this.rows = 0;
        this.populate(this.options.items);
    },

    _addElement: function (idx, arr) {
        var o = this.options;
        var abs = [], left = 0, right = 0, i, j;

        function firstElement(item, row, col) {
            if (row === 0) {
                item.addClass("first-row")
            }
            if (col === 0) {
                item.addClass("first-col");
            }
            item.addClass(BI.isOdd(row + 1) ? "odd-row" : "even-row");
            item.addClass(BI.isOdd(col + 1) ? "odd-col" : "even-col");
            item.addClass("center-element");
        }

        function firstObject(item, row, col) {
            var cls = "";
            if (row === 0) {
                cls += " first-row";
            }
            if (col === 0) {
                cls += " first-col";
            }
            BI.isOdd(row + 1) ? (cls += " odd-row") : (cls += " even-row");
            BI.isOdd(col + 1) ? (cls += " odd-col") : (cls += " even-col");
            item.cls = (item.cls || "") + cls + " center-element";
        }

        function first(item, row, col) {
            if (item instanceof BI.Widget) {
                firstElement(item.element, row, col);
            } else if (item.el instanceof BI.Widget) {
                firstElement(item.el.element, row, col);
            } else if (item.el) {
                firstObject(item.el, row, col)
            } else {
                firstObject(item, row, col);
            }
        }

        for (i = 0; i < arr.length; i++) {
            if (BI.isNumber(o.columnSize[i])) {
                first(arr[i], this.rows, i);
                abs.push(BI.extend({
                    top: 0,
                    bottom: 0,
                    left: o.columnSize[i] <= 1 ? left * 100 + "%" : left,
                    width: o.columnSize[i] <= 1 ? o.columnSize[i] * 100 + "%" : o.columnSize[i]
                }, arr[i]));
                left += o.columnSize[i] + (o.columnSize[i] < 1 ? 0 : o.hgap);
            } else {
                break;
            }
        }
        for (j = arr.length - 1; j > i; j--) {
            if (BI.isNumber(o.columnSize[j])) {
                first(arr[j], this.rows, j);
                abs.push(BI.extend({
                    top: 0,
                    bottom: 0,
                    right: o.columnSize[j] <= 1 ? right * 100 + "%" : right,
                    width: o.columnSize[j] <= 1 ? o.columnSize[j] * 100 + "%" : o.columnSize[j]
                }, arr[j]))
                right += o.columnSize[j] + (o.columnSize[j] < 1 ? 0 : o.hgap);
            } else {
                throw new Error("只能有一个fill属性的item");
            }
        }
        if (i >= 0 && i < arr.length) {
            first(arr[i], this.rows, i);
            abs.push(BI.extend({
                top: 0,
                bottom: 0,
                left: left <= 1 ? left * 100 + "%" : left,
                right: right <= 1 ? right * 100 + "%" : right
            }, arr[i]))
        }
        var w = BI.createWidget({
            type: "bi.absolute",
            height: BI.isArray(o.rowSize) ? o.rowSize[this.rows] : o.rowSize,
            items: abs
        });
        if (this.rows > 0) {
            this.getWidgetByName(this.getName() + (this.rows - 1)).element.css({
                "margin-bottom": o.vgap
            })
        }
        w.element.css({
            "position": "relative"
        });
        this.addWidget(this.getName() + (this.rows++), w);
        return w;
    },

    resize: function () {
        // console.log("table布局不需要resize");
    },

    addItem: function (arr) {
        if (!BI.isArray(arr)) {
            throw new Error("item 必须是数组");
        }
        return BI.TableLayout.superclass.addItem.apply(this, arguments);
    },

    populate: function (items) {
        BI.TableLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.table', BI.TableLayout);/**
 * 水平tape布局
 * @class BI.HTapeLayout
 * @extends BI.Layout
 */
BI.HTapeLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HTapeLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-h-tape-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: [
                {
                    width: 100,
                    el: {type: 'bi.button', text: 'button1'}
                },
                {
                    width: 'fill',
                    el: {type: 'bi.button', text: 'button2'}
                },
                {
                    width: 200,
                    el: {type: 'bi.button', text: 'button3'}
                }
            ]
        });
    },
    _init: function () {
        BI.HTapeLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },
    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        BI.each(items, function (i, item) {
            if (!self.hasWidget(self.getName() + i + "")) {
                var w = BI.createWidget(item);
                self.addWidget(self.getName() + i + "", w);
            } else {
                w = self.getWidgetByName(self.getName() + i + "");
            }
            w.element.css({"position": "absolute", top: o.vgap + o.tgap + "px", bottom: o.vgap + o.bgap + "px"});
        });

        var left = {}, right = {};
        left[0] = 0;
        right[items.length - 1] = 0;

        BI.any(items, function (i, item) {
            var w = self.getWidgetByName(self.getName() + i + "");
            if (BI.isNull(left[i])) {
                left[i] = left[i - 1] + items[i - 1].width + 2 * o.hgap + o.lgap + o.rgap;
            }
            if (item.width < 1 && item.width >= 0) {
                w.element.css({"left": left[i] * 100 + "%", width: item.width * 100 + "%"})
            } else {
                w.element.css({
                    "left": left[i] + o.hgap + o.lgap + "px",
                    width: BI.isNumber(item.width) ? item.width : ""
                });
            }
            if (!BI.isNumber(item.width)) {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            var w = self.getWidgetByName(self.getName() + i + "");
            if (BI.isNull(right[i])) {
                right[i] = right[i + 1] + items[i + 1].width + 2 * o.hgap + o.lgap + o.rgap;
            }
            if (item.width < 1 && item.width >= 0) {
                w.element.css({"right": right[i] * 100 + "%", width: item.width * 100 + "%"})
            } else {
                w.element.css({
                    "right": right[i] + o.hgap + o.rgap + "px",
                    width: BI.isNumber(item.width) ? item.width : ""
                });
            }
            if (!BI.isNumber(item.width)) {
                return true;
            }
        })
    },

    populate: function (items) {
        BI.HTapeLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.htape', BI.HTapeLayout);

/**
 * 垂直tape布局
 * @class BI.VTapeLayout
 * @extends BI.Layout
 */
BI.VTapeLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.VTapeLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-v-tape-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: [
                {
                    height: 100,
                    el: {type: 'bi.button', text: 'button1'}
                },
                {
                    height: 'fill',
                    el: {type: 'bi.button', text: 'button2'}
                },
                {
                    height: 200,
                    el: {type: 'bi.button', text: 'button3'}
                }
            ]
        });
    },
    _init: function () {
        BI.VTapeLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        BI.each(items, function (i, item) {
            if (!self.hasWidget(self.getName() + i + "")) {
                var w = BI.createWidget(item);
                self.addWidget(self.getName() + i + "", w);
            } else {
                w = self.getWidgetByName(self.getName() + i + "");
            }
            w.element.css({"position": "absolute", left: o.hgap + o.lgap + "px", right: o.hgap + o.rgap + "px"});
        });

        var top = {}, bottom = {};
        top[0] = 0;
        bottom[items.length - 1] = 0;

        BI.any(items, function (i, item) {
            var w = self.getWidgetByName(self.getName() + i + "");
            if (BI.isNull(top[i])) {
                top[i] = top[i - 1] + items[i - 1].height + 2 * o.vgap + o.tgap + o.bgap;
            }
            if (item.height < 1 && item.height >= 0) {
                w.element.css({"top": top[i] * 100 + "%", height: item.height * 100 + "%"})
            } else {
                w.element.css({
                    "top": top[i] + o.vgap + o.tgap + "px",
                    height: BI.isNumber(item.height) ? item.height : ""
                });
            }
            if (!BI.isNumber(item.height)) {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            var w = self.getWidgetByName(self.getName() + i + "");
            if (BI.isNull(bottom[i])) {
                bottom[i] = bottom[i + 1] + items[i + 1].height + 2 * o.vgap + o.tgap + o.bgap;
            }
            if (item.height < 1 && item.height >= 0) {
                w.element.css({"bottom": bottom[i] * 100 + "%", height: item.height * 100 + "%"})
            } else {
                w.element.css({
                    "bottom": bottom[i] + o.vgap + o.bgap + "px",
                    height: BI.isNumber(item.height) ? item.height : ""
                });
            }
            if (!BI.isNumber(item.height)) {
                return true;
            }
        })
    },

    populate: function (items) {
        BI.VTapeLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.vtape', BI.VTapeLayout);/**
 * td布局
 * @class BI.TdLayout
 * @extends BI.Layout
 */
BI.TdLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.TdLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-td-layout",
            columnSize: [200, 200, 200],
            hgap: 0,
            vgap: 0,
            items: [[
                {
                    el: {text: 'label1'}
                },
                {
                    el: {text: 'label2'}
                },
                {
                    el: {text: 'label3'}
                }
            ]]
        });
    },
    _init: function () {
        BI.TdLayout.superclass._init.apply(this, arguments);
        this.table = BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
        this.table.element.css({
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        }).appendTo(this.element);
        this.rows = 0;
        this.populate(this.options.items);
    },

    _addElement: function (idx, arr) {
        var o = this.options;

        function firstElement(item, row, col) {
            if (row === 0) {
                item.addClass("first-row")
            }
            if (col === 0) {
                item.addClass("first-col");
            }
            item.addClass(BI.isOdd(row + 1) ? "odd-row" : "even-row");
            item.addClass(BI.isOdd(col + 1) ? "odd-col" : "even-col");
            item.addClass("center-element");
        }

        function firstObject(item, row, col) {
            var cls = "";
            if (row === 0) {
                cls += " first-row";
            }
            if (col === 0) {
                cls += " first-col";
            }
            BI.isOdd(row + 1) ? (cls += " odd-row") : (cls += " even-row");
            BI.isOdd(col + 1) ? (cls += " odd-col") : (cls += " even-col");
            item.cls = (item.cls || "") + cls + " center-element";
        }

        function first(item, row, col) {
            if (item instanceof BI.Widget) {
                firstElement(item.element, row, col);
            } else if (item.el instanceof BI.Widget) {
                firstElement(item.el.element, row, col);
            } else if (item.el) {
                firstObject(item.el, row, col)
            } else {
                firstObject(item, row, col);
            }
        }

        var tr = BI.createWidget({
            type: "bi.default",
            tagName: "tr"
        });

        for (var i = 0; i < arr.length; i++) {
            var w = BI.createWidget(arr[i]);
            w.element.css({"position": "relative", "top": "0", "left": "0", "margin": "0px auto"});
            first(w, this.rows++, i);
            var td = BI.createWidget({
                type: 'bi.default',
                attributes: {
                    width: o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i]
                },
                tagName: 'td',
                items: [w]
            });
            td.element.css({
                "position": "relative",
                "vertical-align": "middle",
                "margin": "0",
                "padding": "0",
                "border": "none"
            });
            tr.addItem(td);
        }
        this.table.element.append(tr.element);
        return tr;
    },

    resize: function () {
        // console.log("td布局不需要resize");
    },

    addItem: function (arr) {
        if (!BI.isArray(arr)) {
            throw new Error("item 必须是数组");
        }
        return BI.TdLayout.superclass.addItem.apply(this, arguments);
    },

    populate: function (items) {
        BI.TdLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.td', BI.TdLayout);/**
 * 垂直布局
 * @class BI.VerticalLayout
 * @extends BI.Layout
 */
BI.VerticalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.VerticalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-vertical-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            scrolly: true
        });
    },
    _init: function () {
        BI.VerticalLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.VerticalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "relative"
        });
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.VerticalLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.vertical', BI.VerticalLayout);/**
 *
 * @class BI.WindowLayout
 * @extends BI.Layout
 */
BI.WindowLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.WindowLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-window-layout",
            columns: 3,
            rows: 2,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            columnSize: [100, "fill", 200],
            rowSize: [100, "fill"],
            items: [[
                {
                    el: {type: 'bi.button', text: 'button1'}
                },
                {
                    el: {type: 'bi.button', text: 'button2'}
                },
                {
                    el: {type: 'bi.button', text: 'button3'}
                }
            ]]
        });
    },
    _init: function () {
        BI.WindowLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var o = this.options;
        if (BI.isNumber(o.rowSize)) {
            o.rowSize = BI.makeArray(o.items.length, 1 / o.items.length);
        }
        if (BI.isNumber(o.columnSize)) {
            o.columnSize = BI.makeArray(o.items[0].length, 1 / o.items[0].length);
        }
        function firstElement(item, row, col) {
            if (row === 0) {
                item.addClass("first-row")
            }
            if (col === 0) {
                item.addClass("first-col");
            }
            item.addClass(BI.isOdd(row + 1) ? "odd-row" : "even-row");
            item.addClass(BI.isOdd(col + 1) ? "odd-col" : "even-col");
            item.addClass("center-element");
        }

        function firstObject(item, row, col) {
            var cls = "";
            if (row === 0) {
                cls += " first-row";
            }
            if (col === 0) {
                cls += " first-col";
            }
            BI.isOdd(row + 1) ? (cls += " odd-row") : (cls += " even-row");
            BI.isOdd(col + 1) ? (cls += " odd-col") : (cls += " even-col");
            item.cls = (item.cls || "") + cls + " center-element";
        }

        function first(item, row, col) {
            if (item instanceof BI.Widget) {
                firstElement(item.element, row, col);
            } else if (item.el instanceof BI.Widget) {
                firstElement(item.el.element, row, col);
            } else if (item.el) {
                firstObject(item.el, row, col)
            } else {
                firstObject(item, row, col);
            }
        }

        for (var i = 0; i < o.rows; i++) {
            for (var j = 0; j < o.columns; j++) {
                if (!o.items[i][j]) {
                    throw new Error("缺少item项");
                }
                if (!this.hasWidget(this.getName() + i + "_" + j)) {
                    var w = BI.createWidget(o.items[i][j]);
                    w.element.css({"position": "absolute"});
                    this.addWidget(this.getName() + i + "_" + j, w);
                }
            }
        }
        var left = {}, right = {}, top = {}, bottom = {};
        left[0] = 0;
        top[0] = 0;
        right[o.columns - 1] = 0;
        bottom[o.rows - 1] = 0;
        //从上到下
        for (var i = 0; i < o.rows; i++) {
            for (var j = 0; j < o.columns; j++) {
                var wi = this.getWidgetByName(this.getName() + i + "_" + j);
                if (BI.isNull(top[i])) {
                    top[i] = top[i - 1] + (o.rowSize[i - 1] < 1 ? o.rowSize[i - 1] : o.rowSize[i - 1] + o.vgap + o.bgap);
                }
                var t = top[i] <= 1 ? top[i] * 100 + "%" : top[i] + o.vgap + o.tgap + "px", h = "";
                if (BI.isNumber(o.rowSize[i])) {
                    h = o.rowSize[i] <= 1 ? o.rowSize[i] * 100 + "%" : o.rowSize[i] + "px";
                }
                wi.element.css({"top": t, height: h});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.rowSize[i])) {
                break;
            }
        }
        //从下到上
        for (var i = o.rows - 1; i >= 0; i--) {
            for (var j = 0; j < o.columns; j++) {
                var wi = this.getWidgetByName(this.getName() + i + "_" + j);
                if (BI.isNull(bottom[i])) {
                    bottom[i] = bottom[i + 1] + (o.rowSize[i + 1] < 1 ? o.rowSize[i + 1] : o.rowSize[i + 1] + o.vgap + o.tgap);
                }
                var b = bottom[i] <= 1 ? bottom[i] * 100 + "%" : bottom[i] + o.vgap + o.bgap + "px", h = "";
                if (BI.isNumber(o.rowSize[i])) {
                    h = o.rowSize[i] <= 1 ? o.rowSize[i] * 100 + "%" : o.rowSize[i] + "px";
                }
                wi.element.css({"bottom": b, height: h});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.rowSize[i])) {
                break;
            }
        }
        //从左到右
        for (var j = 0; j < o.columns; j++) {
            for (var i = 0; i < o.rows; i++) {
                var wi = this.getWidgetByName(this.getName() + i + "_" + j);
                if (BI.isNull(left[j])) {
                    left[j] = left[j - 1] + (o.columnSize[j - 1] < 1 ? o.columnSize[j - 1] : o.columnSize[j - 1] + o.hgap + o.rgap);
                }
                var l = left[j] <= 1 ? left[j] * 100 + "%" : left[j] + o.hgap + o.lgap + "px", w = "";
                if (BI.isNumber(o.columnSize[j])) {
                    w = o.columnSize[j] <= 1 ? o.columnSize[j] * 100 + "%" : o.columnSize[j] + "px";
                }
                wi.element.css({"left": l, width: w});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.columnSize[j])) {
                break;
            }
        }
        //从右到左
        for (var j = o.columns - 1; j >= 0; j--) {
            for (var i = 0; i < o.rows; i++) {
                var wi = this.getWidgetByName(this.getName() + i + "_" + j);
                if (BI.isNull(right[j])) {
                    right[j] = right[j + 1] + (o.columnSize[j + 1] < 1 ? o.columnSize[j + 1] : o.columnSize[j + 1] + o.hgap + o.lgap)
                }
                var r = right[j] <= 1 ? right[j] * 100 + "%" : right[j] + o.hgap + o.rgap + "px", w = "";
                if (BI.isNumber(o.columnSize[j])) {
                    w = o.columnSize[j] <= 1 ? o.columnSize[j] * 100 + "%" : o.columnSize[j] + "px";
                }
                wi.element.css({"right": r, width: w});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.columnSize[j])) {
                break;
            }
        }
    },

    populate: function (items) {
        BI.WindowLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.window', BI.WindowLayout);/**
 * 水平和垂直方向都居中容器, 非自适应，用于宽度高度固定的面板
 * @class BI.CenterLayout
 * @extends BI.Layout
 */
BI.CenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.CenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    _init: function () {
        BI.CenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("center布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("不能添加元素");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.clear();
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: i,
                row: 0,
                el: BI.createWidget({
                    type: "bi.layout",
                    cls: "center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")
                })
            });
        });
        BI.each(items, function (i, item) {
            if (!!item) {
                var w = BI.createWidget(item);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    width: "auto",
                    height: "auto"
                }).appendTo(list[i].el.element);
                self.addWidget(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this.element,
            columns: list.length,
            rows: 1,
            items: list
        });
    },

    populate: function (items) {
        BI.CenterLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.center', BI.CenterLayout);/**
 * 浮动布局实现的居中容器
 * @class BI.FloatCenterLayout
 * @extends BI.Layout
 */
BI.FloatCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FloatCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("floatcenter布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.clear();
        var list = [], width = 100 / items.length;
        BI.each(items, function (i) {
            var widget = BI.createWidget();
            widget.element.addClass("center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")).css({
                width: width + "%",
                height: "100%"
            });
            list.push({
                el: widget
            });
        });
        BI.each(items, function (i, item) {
            if (!!item) {
                var w = BI.createWidget(item);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    width: "auto",
                    height: "auto"
                }).appendTo(list[i].el.element);
                self.addWidget(w);
            }
        });
        BI.createWidget({
            type: "bi.left",
            element: this.element,
            items: list
        });
    },

    populate: function (items) {
        BI.FloatCenterLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.float_center', BI.FloatCenterLayout);/**
 * 水平和垂直方向都居中容器, 非自适应，用于宽度高度固定的面板
 * @class BI.HorizontalCenterLayout
 * @extends BI.Layout
 */
BI.HorizontalCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-horizontal-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.HorizontalCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("horizontal_center布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var o = this.options;
        this.clear();
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: i,
                row: 0,
                el: BI.createWidget({
                    type: "bi.layout",
                    cls: "center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")
                })
            });
        });
        BI.each(items, function (i, item) {
            if (!!item) {
                var w = BI.createWidget(item);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    width: "auto"
                }).appendTo(list[i].el.element);
                self.addWidget(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this.element,
            columns: list.length,
            rows: 1,
            items: list
        });
    },

    populate: function (items) {
        BI.HorizontalCenterLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.horizontal_center', BI.HorizontalCenterLayout);/**
 * 垂直方向都居中容器, 非自适应，用于高度不固定的面板
 * @class BI.VerticalCenterLayout
 * @extends BI.Layout
 */
BI.VerticalCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.VerticalCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-vertical-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.VerticalCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("vertical_center布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.clear();
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: 0,
                row: i,
                el: BI.createWidget({
                    type: "bi.layout",
                    cls: "center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")
                })
            });
        });
        BI.each(items, function (i, item) {
            if (!!item) {
                var w = BI.createWidget(item);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    height: "auto"
                }).appendTo(list[i].el.element);
                self.addWidget(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this.element,
            columns: 1,
            rows: list.length,
            items: list
        });
    },

    populate: function (items) {
        BI.VerticalCenterLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.vertical_center', BI.VerticalCenterLayout);/**
 * 保存数据，将js里面用到的常量数据都分离
 *
 */
BI.Data = Data = {};

/**
 * 存放bi里面通用的一些常量
 * @type {{}}
 */
Data.Constant = BI.Constant = BICst = {};
/**
 * 缓冲池
 * @type {{Buffer: {}}}
 */
;
(function () {
    var Buffer = {};
    var MODE = false;//设置缓存模式为关闭

    Data.BufferPool = {
        put: function (name, cache) {
            if (BI.isNotNull(Buffer[name])) {
                throw new Error("Buffer Pool has the key already!");
            }
            Buffer[name] = cache;
        },

        get: function (name) {
            return Buffer[name];
        },
    };
})();/**
 * 共享池
 * @type {{Shared: {}}}
 */
;
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
                copy = copy[args[i]];
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

};//工程配置
$(function () {
    //注册布局
    var isSupportFlex = BI.isSupportCss3("flex");
    BI.Plugin.registerWidget("bi.horizontal", function (ob) {
        if (isSupportFlex) {
            return BI.extend(ob, {type: "bi.flex_horizontal"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.center_adapt", function (ob) {
        if (isSupportFlex && ob.items && ob.items.length <= 1) {
            //有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                //不是IE用flex_wrapper_center布局
                if (!BI.isIE()) {
                    return BI.extend(ob, {type: "bi.flex_wrapper_center"});
                }
                return ob;
            }
            return BI.extend(ob, {type: "bi.flex_center"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.vertical_adapt", function (ob) {
        if (isSupportFlex) {
            //有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                //不是IE用flex_wrapper_center布局
                if (!BI.isIE()) {
                    return BI.extend({}, ob, {type: "bi.flex_wrapper_vertical_center"});
                }
                return ob;
            }
            return BI.extend(ob, {type: "bi.flex_vertical_center"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.float_center_adapt", function (ob) {
        if (isSupportFlex) {
            //有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                //不是IE用flex_wrapper_center布局
                if (!BI.isIE()) {
                    return BI.extend({}, ob, {type: "bi.flex_wrapper_center"});
                }
                return ob;
            }
            return BI.extend(ob, {type: "bi.flex_center"});
        } else {
            return ob;
        }
    });

    //注册控件
    BI.Plugin.registerWidget("bi.grid_table", function (ob) {
        //IE下滚动条滑动效果不好，禁止掉
        if (BI.isIE() || BI.isFireFox()) {
            return BI.extend(ob, {type: "bi.quick_grid_table"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.collection_table", function (ob) {
        //IE下滚动条滑动效果不好，禁止掉
        if (BI.isIE() || BI.isFireFox()) {
            return BI.extend(ob, {type: "bi.quick_collection_table"});
        } else {
            return ob;
        }
    });
});