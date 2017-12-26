/* !
 * clipboard.js v1.6.1
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
try {// IE8下会抛错
    (function (f) {
        if (typeof exports === "object" && typeof module !== "undefined") {
            module.exports = f();
        } else if (typeof define === "function" && define.amd) {
            define([], f);
        } else {
            var g;
            if (typeof window !== "undefined") {
                g = window;
            } else if (typeof global !== "undefined") {
                g = global;
            } else if (typeof self !== "undefined") {
                g = self;
            } else {
                g = this;
            }
            g.Clipboard = f();
        }
    })(function () {
        var define, module, exports;
        return (function e (t, n, r) {
            function s (o, u) {
                if (!n[o]) {
                    if (!t[o]) {
                        var a = typeof require === "function" && require;
                        if (!u && a)return a(o, !0);
                        if (i)return i(o, !0);
                        var f = new Error("Cannot find module '" + o + "'");
                        throw f.code = "MODULE_NOT_FOUND", f;
                    }
                    var l = n[o] = {exports: {}};
                    t[o][0].call(l.exports, function (e) {
                        var n = t[o][1][e];
                        return s(n ? n : e);
                    }, l, l.exports, e, t, n, r);
                }
                return n[o].exports;
            }

            var i = typeof require === "function" && require;
            for (var o = 0; o < r.length; o++)s(r[o]);
            return s;
        })({
            1: [function (require, module, exports) {
                var DOCUMENT_NODE_TYPE = 9;

                /**
                 * A polyfill for Element.matches()
                 */
                if (typeof Element !== "undefined" && !Element.prototype.matches) {
                    var proto = Element.prototype;

                    proto.matches = proto.matchesSelector ||
                        proto.mozMatchesSelector ||
                        proto.msMatchesSelector ||
                        proto.oMatchesSelector ||
                        proto.webkitMatchesSelector;
                }

                /**
                 * Finds the closest parent that matches a selector.
                 *
                 * @param {Element} element
                 * @param {String} selector
                 * @return {Function}
                 */
                function closest (element, selector) {
                    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
                        if (element.matches(selector)) return element;
                        element = element.parentNode;
                    }
                }

                module.exports = closest;

            }, {}], 2: [function (require, module, exports) {
                var closest = require("./closest");

                /**
                 * Delegates event to a selector.
                 *
                 * @param {Element} element
                 * @param {String} selector
                 * @param {String} type
                 * @param {Function} callback
                 * @param {Boolean} useCapture
                 * @return {Object}
                 */
                function delegate (element, selector, type, callback, useCapture) {
                    var listenerFn = listener.apply(this, arguments);

                    element.addEventListener(type, listenerFn, useCapture);

                    return {
                        destroy: function () {
                            element.removeEventListener(type, listenerFn, useCapture);
                        }
                    };
                }

                /**
                 * Finds closest match and invokes callback.
                 *
                 * @param {Element} element
                 * @param {String} selector
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Function}
                 */
                function listener (element, selector, type, callback) {
                    return function (e) {
                        e.delegateTarget = closest(e.target, selector);

                        if (e.delegateTarget) {
                            callback.call(element, e);
                        }
                    };
                }

                module.exports = delegate;

            }, {"./closest": 1}], 3: [function (require, module, exports) {
                /**
                 * Check if argument is a HTML element.
                 *
                 * @param {Object} value
                 * @return {Boolean}
                 */
                exports.node = function (value) {
                    return value !== undefined
                        && value instanceof HTMLElement
                        && value.nodeType === 1;
                };

                /**
                 * Check if argument is a list of HTML elements.
                 *
                 * @param {Object} value
                 * @return {Boolean}
                 */
                exports.nodeList = function (value) {
                    var type = Object.prototype.toString.call(value);

                    return value !== undefined
                        && (type === "[object NodeList]" || type === "[object HTMLCollection]")
                        && ("length" in value)
                        && (value.length === 0 || exports.node(value[0]));
                };

                /**
                 * Check if argument is a string.
                 *
                 * @param {Object} value
                 * @return {Boolean}
                 */
                exports.string = function (value) {
                    return typeof value === "string"
                        || value instanceof String;
                };

                /**
                 * Check if argument is a function.
                 *
                 * @param {Object} value
                 * @return {Boolean}
                 */
                exports.fn = function (value) {
                    var type = Object.prototype.toString.call(value);

                    return type === "[object Function]";
                };

            }, {}], 4: [function (require, module, exports) {
                var is = require("./is");
                var delegate = require("delegate");

                /**
                 * Validates all params and calls the right
                 * listener function based on its target type.
                 *
                 * @param {String|HTMLElement|HTMLCollection|NodeList} target
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Object}
                 */
                function listen (target, type, callback) {
                    if (!target && !type && !callback) {
                        throw new Error("Missing required arguments");
                    }

                    if (!is.string(type)) {
                        throw new TypeError("Second argument must be a String");
                    }

                    if (!is.fn(callback)) {
                        throw new TypeError("Third argument must be a Function");
                    }

                    if (is.node(target)) {
                        return listenNode(target, type, callback);
                    } else if (is.nodeList(target)) {
                        return listenNodeList(target, type, callback);
                    } else if (is.string(target)) {
                        return listenSelector(target, type, callback);
                    }
                    
                    throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
                    
                }

                /**
                 * Adds an event listener to a HTML element
                 * and returns a remove listener function.
                 *
                 * @param {HTMLElement} node
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Object}
                 */
                function listenNode (node, type, callback) {
                    node.addEventListener(type, callback);

                    return {
                        destroy: function () {
                            node.removeEventListener(type, callback);
                        }
                    };
                }

                /**
                 * Add an event listener to a list of HTML elements
                 * and returns a remove listener function.
                 *
                 * @param {NodeList|HTMLCollection} nodeList
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Object}
                 */
                function listenNodeList (nodeList, type, callback) {
                    Array.prototype.forEach.call(nodeList, function (node) {
                        node.addEventListener(type, callback);
                    });

                    return {
                        destroy: function () {
                            Array.prototype.forEach.call(nodeList, function (node) {
                                node.removeEventListener(type, callback);
                            });
                        }
                    };
                }

                /**
                 * Add an event listener to a selector
                 * and returns a remove listener function.
                 *
                 * @param {String} selector
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Object}
                 */
                function listenSelector (selector, type, callback) {
                    return delegate(document.body, selector, type, callback);
                }

                module.exports = listen;

            }, {"./is": 3, delegate: 2}], 5: [function (require, module, exports) {
                function select (element) {
                    var selectedText;

                    if (element.nodeName === "SELECT") {
                        element.focus();

                        selectedText = element.value;
                    } else if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                        var isReadOnly = element.hasAttribute("readonly");

                        if (!isReadOnly) {
                            element.setAttribute("readonly", "");
                        }

                        element.select();
                        element.setSelectionRange(0, element.value.length);

                        if (!isReadOnly) {
                            element.removeAttribute("readonly");
                        }

                        selectedText = element.value;
                    } else {
                        if (element.hasAttribute("contenteditable")) {
                            element.focus();
                        }

                        var selection = window.getSelection();
                        var range = document.createRange();

                        range.selectNodeContents(element);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        selectedText = selection.toString();
                    }

                    return selectedText;
                }

                module.exports = select;

            }, {}], 6: [function (require, module, exports) {
                function E () {
                    // Keep this empty so it's easier to inherit from
                    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
                }

                E.prototype = {
                    on: function (name, callback, ctx) {
                        var e = this.e || (this.e = {});

                        (e[name] || (e[name] = [])).push({
                            fn: callback,
                            ctx: ctx
                        });

                        return this;
                    },

                    once: function (name, callback, ctx) {
                        var self = this;

                        function listener () {
                            self.off(name, listener);
                            callback.apply(ctx, arguments);
                        }

                        listener._ = callback;
                        return this.on(name, listener, ctx);
                    },

                    emit: function (name) {
                        var data = [].slice.call(arguments, 1);
                        var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
                        var i = 0;
                        var len = evtArr.length;

                        for (i; i < len; i++) {
                            evtArr[i].fn.apply(evtArr[i].ctx, data);
                        }

                        return this;
                    },

                    off: function (name, callback) {
                        var e = this.e || (this.e = {});
                        var evts = e[name];
                        var liveEvents = [];

                        if (evts && callback) {
                            for (var i = 0, len = evts.length; i < len; i++) {
                                if (evts[i].fn !== callback && evts[i].fn._ !== callback) {liveEvents.push(evts[i]);}
                            }
                        }

                        // Remove event from queue to prevent memory leak
                        // Suggested by https://github.com/lazd
                        // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

                        (liveEvents.length)
                            ? e[name] = liveEvents
                            : delete e[name];

                        return this;
                    }
                };

                module.exports = E;

            }, {}], 7: [function (require, module, exports) {
                (function (global, factory) {
                    if (typeof define === "function" && define.amd) {
                        define(["module", "select"], factory);
                    } else if (typeof exports !== "undefined") {
                        factory(module, require("select"));
                    } else {
                        var mod = {
                            exports: {}
                        };
                        factory(mod, global.select);
                        global.clipboardAction = mod.exports;
                    }
                })(this, function (module, _select) {
                    "use strict";

                    var _select2 = _interopRequireDefault(_select);

                    function _interopRequireDefault (obj) {
                        return obj && obj.__esModule ? obj : {
                            default: obj
                        };
                    }

                    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                        return typeof obj;
                    } : function (obj) {
                        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                    };

                    function _classCallCheck (instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                            throw new TypeError("Cannot call a class as a function");
                        }
                    }

                    var _createClass = function () {
                        function defineProperties (target, props) {
                            for (var i = 0; i < props.length; i++) {
                                var descriptor = props[i];
                                descriptor.enumerable = descriptor.enumerable || false;
                                descriptor.configurable = true;
                                if ("value" in descriptor) descriptor.writable = true;
                                Object.defineProperty(target, descriptor.key, descriptor);
                            }
                        }

                        return function (Constructor, protoProps, staticProps) {
                            if (protoProps) defineProperties(Constructor.prototype, protoProps);
                            if (staticProps) defineProperties(Constructor, staticProps);
                            return Constructor;
                        };
                    }();

                    var ClipboardAction = function () {
                        /**
                         * @param {Object} options
                         */
                        function ClipboardAction (options) {
                            _classCallCheck(this, ClipboardAction);

                            this.resolveOptions(options);
                            this.initSelection();
                        }

                        /**
                         * Defines base properties passed from constructor.
                         * @param {Object} options
                         */


                        _createClass(ClipboardAction, [{
                            key: "resolveOptions",
                            value: function resolveOptions () {
                                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                this.action = options.action;
                                this.emitter = options.emitter;
                                this.target = options.target;
                                this.text = options.text;
                                this.trigger = options.trigger;

                                this.selectedText = "";
                            }
                        }, {
                            key: "initSelection",
                            value: function initSelection () {
                                if (this.text) {
                                    this.selectFake();
                                } else if (this.target) {
                                    this.selectTarget();
                                }
                            }
                        }, {
                            key: "selectFake",
                            value: function selectFake () {
                                var _this = this;

                                var isRTL = document.documentElement.getAttribute("dir") == "rtl";

                                this.removeFake();

                                this.fakeHandlerCallback = function () {
                                    return _this.removeFake();
                                };
                                this.fakeHandler = document.body.addEventListener("click", this.fakeHandlerCallback) || true;

                                this.fakeElem = document.createElement("textarea");
                                // Prevent zooming on iOS
                                this.fakeElem.style.fontSize = "12pt";
                                // Reset box model
                                this.fakeElem.style.border = "0";
                                this.fakeElem.style.padding = "0";
                                this.fakeElem.style.margin = "0";
                                // Move element out of screen horizontally
                                this.fakeElem.style.position = "absolute";
                                this.fakeElem.style[isRTL ? "right" : "left"] = "-9999px";
                                // Move element to the same position vertically
                                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                                this.fakeElem.style.top = yPosition + "px";

                                this.fakeElem.setAttribute("readonly", "");
                                this.fakeElem.value = this.text;

                                document.body.appendChild(this.fakeElem);

                                this.selectedText = (0, _select2["default"])(this.fakeElem);
                                this.copyText();
                            }
                        }, {
                            key: "removeFake",
                            value: function removeFake () {
                                if (this.fakeHandler) {
                                    document.body.removeEventListener("click", this.fakeHandlerCallback);
                                    this.fakeHandler = null;
                                    this.fakeHandlerCallback = null;
                                }

                                if (this.fakeElem) {
                                    document.body.removeChild(this.fakeElem);
                                    this.fakeElem = null;
                                }
                            }
                        }, {
                            key: "selectTarget",
                            value: function selectTarget () {
                                this.selectedText = (0, _select2["default"])(this.target);
                                this.copyText();
                            }
                        }, {
                            key: "copyText",
                            value: function copyText () {
                                var succeeded = void 0;

                                try {
                                    succeeded = document.execCommand(this.action);
                                } catch (err) {
                                    succeeded = false;
                                }

                                this.handleResult(succeeded);
                            }
                        }, {
                            key: "handleResult",
                            value: function handleResult (succeeded) {
                                this.emitter.emit(succeeded ? "success" : "error", {
                                    action: this.action,
                                    text: this.selectedText,
                                    trigger: this.trigger,
                                    clearSelection: this.clearSelection.bind(this)
                                });
                            }
                        }, {
                            key: "clearSelection",
                            value: function clearSelection () {
                                if (this.target) {
                                    this.target.blur();
                                }

                                window.getSelection().removeAllRanges();
                            }
                        }, {
                            key: "destroy",
                            value: function destroy () {
                                this.removeFake();
                            }
                        }, {
                            key: "action",
                            set: function set () {
                                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "copy";

                                this._action = action;

                                if (this._action !== "copy" && this._action !== "cut") {
                                    throw new Error("Invalid \"action\" value, use either \"copy\" or \"cut\"");
                                }
                            },
                            get: function get () {
                                return this._action;
                            }
                        }, {
                            key: "target",
                            set: function set (target) {
                                if (target !== undefined) {
                                    if (target && (typeof target === "undefined" ? "undefined" : _typeof(target)) === "object" && target.nodeType === 1) {
                                        if (this.action === "copy" && target.hasAttribute("disabled")) {
                                            throw new Error("Invalid \"target\" attribute. Please use \"readonly\" instead of \"disabled\" attribute");
                                        }

                                        if (this.action === "cut" && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) {
                                            throw new Error("Invalid \"target\" attribute. You can't cut text from elements with \"readonly\" or \"disabled\" attributes");
                                        }

                                        this._target = target;
                                    } else {
                                        throw new Error("Invalid \"target\" value, use a valid Element");
                                    }
                                }
                            },
                            get: function get () {
                                return this._target;
                            }
                        }]);

                        return ClipboardAction;
                    }();

                    module.exports = ClipboardAction;
                });

            }, {select: 5}], 8: [function (require, module, exports) {
                (function (global, factory) {
                    if (typeof define === "function" && define.amd) {
                        define(["module", "./clipboard-action", "tiny-emitter", "good-listener"], factory);
                    } else if (typeof exports !== "undefined") {
                        factory(module, require("./clipboard-action"), require("tiny-emitter"), require("good-listener"));
                    } else {
                        var mod = {
                            exports: {}
                        };
                        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
                        global.clipboard = mod.exports;
                    }
                })(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
                    "use strict";

                    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

                    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

                    var _goodListener2 = _interopRequireDefault(_goodListener);

                    function _interopRequireDefault (obj) {
                        return obj && obj.__esModule ? obj : {
                            default: obj
                        };
                    }

                    function _classCallCheck (instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                            throw new TypeError("Cannot call a class as a function");
                        }
                    }

                    var _createClass = function () {
                        function defineProperties (target, props) {
                            for (var i = 0; i < props.length; i++) {
                                var descriptor = props[i];
                                descriptor.enumerable = descriptor.enumerable || false;
                                descriptor.configurable = true;
                                if ("value" in descriptor) descriptor.writable = true;
                                Object.defineProperty(target, descriptor.key, descriptor);
                            }
                        }

                        return function (Constructor, protoProps, staticProps) {
                            if (protoProps) defineProperties(Constructor.prototype, protoProps);
                            if (staticProps) defineProperties(Constructor, staticProps);
                            return Constructor;
                        };
                    }();

                    function _possibleConstructorReturn (self, call) {
                        if (!self) {
                            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        }

                        return call && (typeof call === "object" || typeof call === "function") ? call : self;
                    }

                    function _inherits (subClass, superClass) {
                        if (typeof superClass !== "function" && superClass !== null) {
                            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                        }

                        subClass.prototype = Object.create(superClass && superClass.prototype, {
                            constructor: {
                                value: subClass,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
                    }

                    var Clipboard = function (_Emitter) {
                        _inherits(Clipboard, _Emitter);

                        /**
                         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
                         * @param {Object} options
                         */
                        function Clipboard (trigger, options) {
                            _classCallCheck(this, Clipboard);

                            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

                            _this.resolveOptions(options);
                            _this.listenClick(trigger);
                            return _this;
                        }

                        /**
                         * Defines if attributes would be resolved using internal setter functions
                         * or custom functions that were passed in the constructor.
                         * @param {Object} options
                         */


                        _createClass(Clipboard, [{
                            key: "resolveOptions",
                            value: function resolveOptions () {
                                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                this.action = typeof options.action === "function" ? options.action : this.defaultAction;
                                this.target = typeof options.target === "function" ? options.target : this.defaultTarget;
                                this.text = typeof options.text === "function" ? options.text : this.defaultText;
                            }
                        }, {
                            key: "listenClick",
                            value: function listenClick (trigger) {
                                var _this2 = this;

                                this.listener = (0, _goodListener2["default"])(trigger, "click", function (e) {
                                    return _this2.onClick(e);
                                });
                            }
                        }, {
                            key: "onClick",
                            value: function onClick (e) {
                                var trigger = e.delegateTarget || e.currentTarget;

                                if (this.clipboardAction) {
                                    this.clipboardAction = null;
                                }

                                this.clipboardAction = new _clipboardAction2["default"]({
                                    action: this.action(trigger),
                                    target: this.target(trigger),
                                    text: this.text(trigger),
                                    trigger: trigger,
                                    emitter: this
                                });
                            }
                        }, {
                            key: "defaultAction",
                            value: function defaultAction (trigger) {
                                return getAttributeValue("action", trigger);
                            }
                        }, {
                            key: "defaultTarget",
                            value: function defaultTarget (trigger) {
                                var selector = getAttributeValue("target", trigger);

                                if (selector) {
                                    return document.querySelector(selector);
                                }
                            }
                        }, {
                            key: "defaultText",
                            value: function defaultText (trigger) {
                                return getAttributeValue("text", trigger);
                            }
                        }, {
                            key: "destroy",
                            value: function destroy () {
                                this.listener.destroy();

                                if (this.clipboardAction) {
                                    this.clipboardAction.destroy();
                                    this.clipboardAction = null;
                                }
                            }
                        }], [{
                            key: "isSupported",
                            value: function isSupported () {
                                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ["copy", "cut"];

                                var actions = typeof action === "string" ? [action] : action;
                                var support = !!document.queryCommandSupported;

                                actions.forEach(function (action) {
                                    support = support && !!document.queryCommandSupported(action);
                                });

                                return support;
                            }
                        }]);

                        return Clipboard;
                    }(_tinyEmitter2["default"]);

                    /**
                     * Helper function to retrieve attribute value.
                     * @param {String} suffix
                     * @param {Element} element
                     */
                    function getAttributeValue (suffix, element) {
                        var attribute = "data-clipboard-" + suffix;

                        if (!element.hasAttribute(attribute)) {
                            return;
                        }

                        return element.getAttribute(attribute);
                    }

                    module.exports = Clipboard;
                });

            }, {"./clipboard-action": 7, "good-listener": 4, "tiny-emitter": 6}]
        }, {}, [8])(8);
    });
} catch (e) {
    /*
     * zClip :: jQuery ZeroClipboard v1.1.1
     * http://steamdev.com/zclip
     *
     * Copyright 2011, SteamDev
     * Released under the MIT license.
     * http://www.opensource.org/licenses/mit-license.php
     *
     * Date: Wed Jun 01, 2011
     */


    (function ($) {

        $.fn.zclip = function (params) {

            if (typeof params === "object" && !params.length) {

                var settings = $.extend({

                    path: "ZeroClipboard.swf",
                    copy: null,
                    beforeCopy: null,
                    afterCopy: null,
                    clickAfter: true,
                    setHandCursor: true,
                    setCSSEffects: true

                }, params);


                return this.each(function () {

                    var o = $(this);

                    if (o.is(":visible") && (typeof settings.copy === "string" || $.isFunction(settings.copy))) {

                        ZeroClipboard.setMoviePath(settings.path);
                        var clip = new ZeroClipboard.Client();

                        if ($.isFunction(settings.copy)) {
                            o.bind("zClip_copy", settings.copy);
                        }
                        if ($.isFunction(settings.beforeCopy)) {
                            o.bind("zClip_beforeCopy", settings.beforeCopy);
                        }
                        if ($.isFunction(settings.afterCopy)) {
                            o.bind("zClip_afterCopy", settings.afterCopy);
                        }

                        clip.setHandCursor(settings.setHandCursor);
                        clip.setCSSEffects(settings.setCSSEffects);
                        clip.addEventListener("mouseOver", function (client) {
                            o.trigger("mouseenter");
                        });
                        clip.addEventListener("mouseOut", function (client) {
                            o.trigger("mouseleave");
                        });
                        clip.addEventListener("mouseDown", function (client) {

                            o.trigger("mousedown");

                            if (!$.isFunction(settings.copy)) {
                                clip.setText(settings.copy);
                            } else {
                                clip.setText(o.triggerHandler("zClip_copy"));
                            }

                            if ($.isFunction(settings.beforeCopy)) {
                                o.trigger("zClip_beforeCopy");
                            }

                        });

                        clip.addEventListener("complete", function (client, text) {

                            if ($.isFunction(settings.afterCopy)) {

                                o.trigger("zClip_afterCopy");

                            } else {
                                if (text.length > 500) {
                                    text = text.substr(0, 500) + "...\n\n(" + (text.length - 500) + " characters not shown)";
                                }

                                o.removeClass("hover");
                                alert("Copied text to clipboard:\n\n " + text);
                            }

                            if (settings.clickAfter) {
                                o.trigger("click");
                            }

                        });


                        clip.glue(o[0], o.parent()[0]);

                        $(window).bind("load resize", function () {
                            clip.reposition();
                        });


                    }

                });

            } else if (typeof params === "string") {

                return this.each(function () {

                    var o = $(this);

                    params = params.toLowerCase();
                    var zclipId = o.data("zclipId");
                    var clipElm = $("#" + zclipId + ".zclip");

                    if (params == "remove") {

                        clipElm.remove();
                        o.removeClass("active hover");

                    } else if (params == "hide") {

                        clipElm.hide();
                        o.removeClass("active hover");

                    } else if (params == "show") {

                        clipElm.show();

                    }

                });

            }

        };


    })(jQuery);


    // ZeroClipboard
    // Simple Set Clipboard System
    // Author: Joseph Huckaby
    var ZeroClipboard = {

        version: "1.0.7",
        clients: {},
        // registered upload clients on page, indexed by id
        moviePath: "ZeroClipboard.swf",
        // URL to movie
        nextId: 1,
        // ID of next movie
        $: function (thingy) {
            // simple DOM lookup utility function
            if (typeof(thingy) === "string") thingy = document.getElementById(thingy);
            if (!thingy.addClass) {
                // extend element with a few useful methods
                thingy.hide = function () {
                    this.style.display = "none";
                };
                thingy.show = function () {
                    this.style.display = "";
                };
                thingy.addClass = function (name) {
                    this.removeClass(name);
                    this.className += " " + name;
                };
                thingy.removeClass = function (name) {
                    var classes = this.className.split(/\s+/);
                    var idx = -1;
                    for (var k = 0; k < classes.length; k++) {
                        if (classes[k] == name) {
                            idx = k;
                            k = classes.length;
                        }
                    }
                    if (idx > -1) {
                        classes.splice(idx, 1);
                        this.className = classes.join(" ");
                    }
                    return this;
                };
                thingy.hasClass = function (name) {
                    return !!this.className.match(new RegExp("\\s*" + name + "\\s*"));
                };
            }
            return thingy;
        },

        setMoviePath: function (path) {
            // set path to ZeroClipboard.swf
            this.moviePath = path;
        },

        dispatch: function (id, eventName, args) {
            // receive event from flash movie, send to client
            var client = this.clients[id];
            if (client) {
                client.receiveEvent(eventName, args);
            }
        },

        register: function (id, client) {
            // register new client to receive events
            this.clients[id] = client;
        },

        getDOMObjectPosition: function (obj, stopObj) {
            // get absolute coordinates for dom element
            var info = {
                left: 0,
                top: 0,
                width: obj.width ? obj.width : obj.offsetWidth,
                height: obj.height ? obj.height : obj.offsetHeight
            };

            if (obj && (obj != stopObj)) {
                info.left += obj.offsetLeft;
                info.top += obj.offsetTop;
            }

            return info;
        },

        Client: function (elem) {
            // constructor for new simple upload client
            this.handlers = {};

            // unique ID
            this.id = ZeroClipboard.nextId++;
            this.movieId = "ZeroClipboardMovie_" + this.id;

            // register client with singleton to receive flash events
            ZeroClipboard.register(this.id, this);

            // create movie
            if (elem) this.glue(elem);
        }
    };

    ZeroClipboard.Client.prototype = {

        id: 0,
        // unique ID for us
        ready: false,
        // whether movie is ready to receive events or not
        movie: null,
        // reference to movie object
        clipText: "",
        // text to copy to clipboard
        handCursorEnabled: true,
        // whether to show hand cursor, or default pointer cursor
        cssEffects: true,
        // enable CSS mouse effects on dom container
        handlers: null,
        // user event handlers
        glue: function (elem, appendElem, stylesToAdd) {
            // glue to DOM element
            // elem can be ID or actual DOM element object
            this.domElement = ZeroClipboard.$(elem);

            // float just above object, or zIndex 99 if dom element isn't set
            var zIndex = 99;
            if (this.domElement.style.zIndex) {
                zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
            }

            if (typeof(appendElem) === "string") {
                appendElem = ZeroClipboard.$(appendElem);
            } else if (typeof(appendElem) === "undefined") {
                appendElem = document.getElementsByTagName("body")[0];
            }

            // find X/Y position of domElement
            var box = ZeroClipboard.getDOMObjectPosition(this.domElement, appendElem);

            // create floating DIV above element
            this.div = document.createElement("div");
            this.div.className = "zclip";
            this.div.id = "zclip-" + this.movieId;
            $(this.domElement).data("zclipId", "zclip-" + this.movieId);
            var style = this.div.style;
            style.position = "absolute";
            style.left = "" + box.left + "px";
            style.top = "" + box.top + "px";
            style.width = "" + box.width + "px";
            style.height = "" + box.height + "px";
            style.zIndex = zIndex;

            if (typeof(stylesToAdd) === "object") {
                for (addedStyle in stylesToAdd) {
                    style[addedStyle] = stylesToAdd[addedStyle];
                }
            }

            // style.backgroundColor = '#f00'; // debug
            appendElem.appendChild(this.div);

            this.div.innerHTML = this.getHTML(box.width, box.height);
        },

        getHTML: function (width, height) {
            // return HTML for movie
            var html = "";
            var flashvars = "id=" + this.id + "&width=" + width + "&height=" + height;

            if (navigator.userAgent.match(/MSIE/)) {
                // IE gets an OBJECT tag
                var protocol = location.href.match(/^https/i) ? "https://" : "http://";
                html += "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" codebase=\"" + protocol + "download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0\" width=\"" + width + "\" height=\"" + height + "\" id=\"" + this.movieId + "\" align=\"middle\"><param name=\"allowScriptAccess\" value=\"always\" /><param name=\"allowFullScreen\" value=\"false\" /><param name=\"movie\" value=\"" + ZeroClipboard.moviePath + "\" /><param name=\"loop\" value=\"false\" /><param name=\"menu\" value=\"false\" /><param name=\"quality\" value=\"best\" /><param name=\"bgcolor\" value=\"#ffffff\" /><param name=\"flashvars\" value=\"" + flashvars + "\"/><param name=\"wmode\" value=\"transparent\"/></object>";
            } else {
                // all other browsers get an EMBED tag
                html += "<embed id=\"" + this.movieId + "\" src=\"" + ZeroClipboard.moviePath + "\" loop=\"false\" menu=\"false\" quality=\"best\" bgcolor=\"#ffffff\" width=\"" + width + "\" height=\"" + height + "\" name=\"" + this.movieId + "\" align=\"middle\" allowScriptAccess=\"always\" allowFullScreen=\"false\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" flashvars=\"" + flashvars + "\" wmode=\"transparent\" />";
            }
            return html;
        },

        hide: function () {
            // temporarily hide floater offscreen
            if (this.div) {
                this.div.style.left = "-2000px";
            }
        },

        show: function () {
            // show ourselves after a call to hide()
            this.reposition();
        },

        destroy: function () {
            // destroy control and floater
            if (this.domElement && this.div) {
                this.hide();
                this.div.innerHTML = "";

                var body = document.getElementsByTagName("body")[0];
                try {
                    body.removeChild(this.div);
                } catch (e) {
                    
                }

                this.domElement = null;
                this.div = null;
            }
        },

        reposition: function (elem) {
            // reposition our floating div, optionally to new container
            // warning: container CANNOT change size, only position
            if (elem) {
                this.domElement = ZeroClipboard.$(elem);
                if (!this.domElement) this.hide();
            }

            if (this.domElement && this.div) {
                var box = ZeroClipboard.getDOMObjectPosition(this.domElement);
                var style = this.div.style;
                style.left = "" + box.left + "px";
                style.top = "" + box.top + "px";
            }
        },

        setText: function (newText) {
            // set text to be copied to clipboard
            this.clipText = newText;
            if (this.ready) {
                this.movie.setText(newText);
            }
        },

        addEventListener: function (eventName, func) {
            // add user event listener for event
            // event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
            eventName = eventName.toString().toLowerCase().replace(/^on/, "");
            if (!this.handlers[eventName]) {
                this.handlers[eventName] = [];
            }
            this.handlers[eventName].push(func);
        },

        setHandCursor: function (enabled) {
            // enable hand cursor (true), or default arrow cursor (false)
            this.handCursorEnabled = enabled;
            if (this.ready) {
                this.movie.setHandCursor(enabled);
            }
        },

        setCSSEffects: function (enabled) {
            // enable or disable CSS effects on DOM container
            this.cssEffects = !!enabled;
        },

        receiveEvent: function (eventName, args) {
            // receive event from flash
            eventName = eventName.toString().toLowerCase().replace(/^on/, "");

            // special behavior for certain events
            switch (eventName) {
                case "load":
                    // movie claims it is ready, but in IE this isn't always the case...
                    // bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
                    this.movie = document.getElementById(this.movieId);
                    if (!this.movie) {
                        var self = this;
                        setTimeout(function () {
                            self.receiveEvent("load", null);
                        }, 1);
                        return;
                    }

                    // firefox on pc needs a "kick" in order to set these in certain cases
                    if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                        var self = this;
                        setTimeout(function () {
                            self.receiveEvent("load", null);
                        }, 100);
                        this.ready = true;
                        return;
                    }

                    this.ready = true;
                    try {
                        this.movie.setText(this.clipText);
                    } catch (e) {
                    }
                    try {
                        this.movie.setHandCursor(this.handCursorEnabled);
                    } catch (e) {
                    }
                    break;

                case "mouseover":
                    if (this.domElement && this.cssEffects) {
                        this.domElement.addClass("hover");
                        if (this.recoverActive) {
                            this.domElement.addClass("active");
                        }


                    }


                    break;

                case "mouseout":
                    if (this.domElement && this.cssEffects) {
                        this.recoverActive = false;
                        if (this.domElement.hasClass("active")) {
                            this.domElement.removeClass("active");
                            this.recoverActive = true;
                        }
                        this.domElement.removeClass("hover");

                    }
                    break;

                case "mousedown":
                    if (this.domElement && this.cssEffects) {
                        this.domElement.addClass("active");
                    }
                    break;

                case "mouseup":
                    if (this.domElement && this.cssEffects) {
                        this.domElement.removeClass("active");
                        this.recoverActive = false;
                    }
                    break;
            } // switch eventName
            if (this.handlers[eventName]) {
                for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
                    var func = this.handlers[eventName][idx];

                    if (typeof(func) === "function") {
                        // actual function reference
                        func(this, args);
                    } else if ((typeof(func) === "object") && (func.length == 2)) {
                        // PHP style object + method, i.e. [myObject, 'myMethod']
                        func[0][func[1]](this, args);
                    } else if (typeof(func) === "string") {
                        // name of function
                        window[func](this, args);
                    }
                } // foreach event handler defined
            } // user defined handler for event
        }

    };
}