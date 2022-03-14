!(function () {
    function extend () {
        var target = arguments[0] || {}, length = arguments.length, i = 1, options, name, src, copy;
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }

    /**
     * 客户端观察者，主要处理事件的添加、删除、执行等
     * @class BI.OB
     * @abstract
     */
    var OB = function (config) {
        this._constructor(config);
    };
    _.extend(OB.prototype, {
        props: {},
        init: null,
        destroyed: null,

        _constructor: function (config) {
            this._initProps(config);
            this._init();
            this._initRef();
        },

        _defaultConfig: function (config) {
            return {};
        },

        _initProps: function (config) {
            var props = this.props;
            if (BI.isFunction(this.props)) {
                props = this.props(config);
            }
            var defaultProps = extend(this._defaultConfig(config), props);
            var modifiedDefaultProps = (config && config.type && BI.OB.configFunctions[config.type + ".props"]) ? BI.reduce(BI.OB.configFunctions[config.type + ".props"], function (value, conf, index) {
                return extend(conf, value.fn(defaultProps, config, value.opt));
            }, {}) : null;
            this.options = extend(defaultProps, modifiedDefaultProps, config);
        },

        _init: function () {
            this._initListeners();
            this.init && this.init();
        },

        _initListeners: function () {
            var self = this;
            if (this.options.listeners != null) {
                _.each(this.options.listeners, function (lis, eventName) {
                    if (_.isFunction(lis)) {
                        self.on(eventName, lis);
                        return;
                    }
                    (lis.target ? lis.target : self)[lis.once ? "once" : "on"](lis.eventName, _.bind(lis.action, self));
                });
                delete this.options.listeners;
            }
        },

        // 获得一个当前对象的引用
        _initRef: function () {
            if (this.options.__ref) {
                this.options.__ref.call(this, this);
            }
            if (this.options.ref) {
                this.options.ref.call(this, this);
            }
        },

        //释放当前对象
        _purgeRef: function () {
            if (this.options.__ref) {
                this.options.__ref.call(null);
                this.options.__ref = null;
            }
            if (this.options.ref) {
                this.options.ref.call(null);
                this.options.ref = null;
            }
        },

        _getEvents: function () {
            if (!_.isObject(this.events)) {
                this.events = {};
            }
            return this.events;
        },

        /**
         * 给观察者绑定一个事件
         * @param {String} eventName 事件的名字
         * @param {Function} fn 事件对应的执行函数
         */
        on: function (eventName, fn) {
            var self = this;
            eventName = eventName.toLowerCase();
            var fns = this._getEvents()[eventName];
            if (!_.isArray(fns)) {
                fns = [];
                this._getEvents()[eventName] = fns;
            }
            fns.push(fn);

            return function () {
                self.un(eventName, fn);
            };
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
                if (_.isArray(fns)) {
                    var newFns = [];
                    _.each(fns, function (ifn) {
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
            this.events = {};
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
            this._purgeRef();
            this.purgeListeners();
        }
    });
    BI.OB = BI.OB || OB;
})();
