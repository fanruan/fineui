/**
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
};(function (root, factory) {
    root.BI = factory(root, root.BI || {}, root._, (root.jQuery || root.$));
}(this, function (root, BI, _, $) {

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
    BI.noConflict = function () {
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
        on: function (name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({callback: callback, context: context, ctx: context || this});
            return this;
        },

        // Bind an event to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once: function (name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function () {
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
        off: function (name, callback, context) {
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

        un: function () {
            this.off.apply(this, arguments);
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function (name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) triggerEvents(events, args);
            if (allEvents) triggerEvents(allEvents, arguments);
            return this;
        },

        fireEvent: function () {
            this.trigger.apply(this, arguments);
        },

        // Inversion-of-control versions of `on` and `once`. Tell *this* object to
        // listen to an event in another object ... keeping track of what it's
        // listening to.
        listenTo: function (obj, name, callback) {
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
            listeningTo[id] = obj;
            if (!callback && typeof name === 'object') callback = this;
            obj.on(name, callback, this);
            return this;
        },

        listenToOnce: function (obj, name, callback) {
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
            var once = _.once(function () {
                this.stopListening(obj, name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.listenTo(obj, name, once);
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function (obj, name, callback) {
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
    var eventsApi = function (obj, action, name, rest) {
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
    var triggerEvents = function (events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
            case 0:
                while (++i < l) (ev = events[i]).callback.call(ev.ctx);
                return;
            case 1:
                while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1);
                return;
            case 2:
                while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;
            case 3:
                while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;
            default:
                while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
                return;
        }
    };

    // Aliases for backwards compatibility.
    Events.bind = Events.on;
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
    var M = BI.M = function (attributes, options) {
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

        _defaultConfig: function () {
            return {}
        },

        // _init is an empty function by default. Override it with your own
        // initialization logic.
        _init: function () {
        },

        // Return a copy of the model's `attributes` object.
        toJSON: function (options) {
            return _.clone(this.attributes);
        },

        // Proxy `BI.sync` by default -- but override this if you need
        // custom syncing semantics for *this* particular model.
        sync: function () {
            return BI.sync.apply(this, arguments);
        },

        // Get the value of an attribute.
        get: function (attr) {
            return this.attributes[attr];
        },

        // Get the HTML-escaped value of an attribute.
        escape: function (attr) {
            return _.escape(this.get(attr));
        },

        // Returns `true` if the attribute contains a value that is not null
        // or undefined.
        has: function (attr) {
            return _.has(this.attributes, attr);
        },

        // Special-cased proxy to underscore's `_.matches` method.
        matches: function (attrs) {
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
        set: function (key, val, options) {
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
            unset = options.unset;
            silent = options.silent;
            changes = [];
            changing = this._changing;
            this._changing = true;

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
        unset: function (attr, options) {
            return this.set(attr, void 0, _.extend({}, options, {unset: true}));
        },

        // Clear all attributes on the model, firing `"change"`.
        clear: function (options) {
            var attrs = {};
            for (var key in this.attributes) attrs[key] = void 0;
            return this.set(attrs, _.extend({}, options, {unset: true}));
        },

        // Determine if the model has changed since the last `"change"` event.
        // If you specify an attribute name, determine if that attribute has changed.
        hasChanged: function (attr) {
            if (attr == null) return !_.isEmpty(this.changed);
            return _.has(this.changed, attr);
        },

        // Return an object containing all the attributes that have changed, or
        // false if there are no changed attributes. Useful for determining what
        // parts of a view need to be updated and/or what attributes need to be
        // persisted to the server. Unset attributes will be set to undefined.
        // You can also pass an attributes object to diff against the model,
        // determining if there *would be* a change.
        changedAttributes: function (diff) {
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
        previous: function (attr) {
            if (attr == null || !this._previousAttributes) return null;
            return this._previousAttributes[attr];
        },

        // Get all of the attributes of the model at the time of the previous
        // `"change"` event.
        previousAttributes: function () {
            return _.clone(this._previousAttributes);
        },

        // Fetch the model from the server. If the server's representation of the
        // model differs from its current attributes, they will be overridden,
        // triggering a `"change"` event.
        fetch: function (options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function (resp) {
                if (!options.noset) {
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
        save: function (key, val, options) {
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
            options.success = function (resp) {
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
        destroy: function (options) {
            options = options ? _.clone(options) : {};
            var model = this;
            var success = options.success;

            var destroy = function () {
                model.stopListening();
                model.trigger('destroy', model.collection, model, options);
            };

            options.success = function (resp) {
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
        url: function () {
            var base =
                _.result(this.collection, 'url');
            if (this.isNew()) return base;
            return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
        },

        // **parse** converts a response into the hash of attributes to be `set` on
        // the model. The default implementation is just to pass the response along.
        parse: function (resp, options) {
            return resp;
        },

        // Create a new model with identical attributes to this one.
        clone: function () {
            return new this.constructor(this.attributes);
        },

        // A model is new if it has never been saved to the server, and lacks an id.
        isNew: function () {
            return !this.has(this.idAttribute);
        },

        // Check if the model is currently in a valid state.
        isValid: function (options) {
            return this._validate({}, _.extend(options || {}, {validate: true}));
        },

        // Run validation against the next complete set of model attributes,
        // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
        _validate: function (attrs, options) {
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
    _.each(modelMethods, function (method) {
        if (!_[method]) return;
        M.prototype[method] = function () {
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
    var Collection = BI.Collection = function (models, options) {
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
        _init: function () {
        },

        // The JSON representation of a Collection is an array of the
        // models' attributes.
        toJSON: function (options) {
            return this.map(function (model) {
                return model.toJSON(options);
            });
        },

        // Proxy `BI.sync` by default.
        sync: function () {
            return BI.sync.apply(this, arguments);
        },

        // Add a model, or list of models to the set.
        add: function (models, options) {
            return this.set(models, _.extend({merge: false}, options, addOptions));
        },

        // Remove a model, or a list of models from the set.
        remove: function (models, options) {
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
        set: function (models, options) {
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
        reset: function (models, options) {
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
        push: function (model, options) {
            return this.add(model, _.extend({at: this.length}, options));
        },

        // Remove a model from the end of the collection.
        pop: function (options) {
            var model = this.at(this.length - 1);
            this.remove(model, options);
            return model;
        },

        // Add a model to the beginning of the collection.
        unshift: function (model, options) {
            return this.add(model, _.extend({at: 0}, options));
        },

        // Remove a model from the beginning of the collection.
        shift: function (options) {
            var model = this.at(0);
            this.remove(model, options);
            return model;
        },

        // Slice out a sub-array of models from the collection.
        slice: function () {
            return slice.apply(this.models, arguments);
        },

        // Get a model from the set by id.
        get: function (obj) {
            if (obj == null) return void 0;
            var id = this.modelId(this._isModel(obj) ? obj.attributes : obj);
            return this._byId[obj] || this._byId[id] || this._byId[obj.cid];
        },

        // Get the model at the given index.
        at: function (index) {
            if (index < 0) index += this.length;
            return this.models[index];
        },

        // Return models with matching attributes. Useful for simple cases of
        // `filter`.
        where: function (attrs, first) {
            var matches = _.matches(attrs);
            return this[first ? 'find' : 'filter'](function (model) {
                return matches(model.attributes);
            });
        },

        // Return the first model with matching attributes. Useful for simple cases
        // of `find`.
        findWhere: function (attrs) {
            return this.where(attrs, true);
        },

        // Force the collection to re-sort itself. You don't need to call this under
        // normal circumstances, as the set will maintain sort order as each item
        // is added.
        sort: function (options) {
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
        pluck: function (attr) {
            return _.invoke(this.models, 'get', attr);
        },

        // Fetch the default set of models for this collection, resetting the
        // collection when they arrive. If `reset: true` is passed, the response
        // data will be passed through the `reset` method instead of `set`.
        fetch: function (options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var success = options.success;
            var collection = this;
            options.success = function (resp) {
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
        create: function (model, options) {
            options = options ? _.clone(options) : {};
            if (!(model = this._prepareModel(model, options))) return false;
            if (!options.wait) this.add(model, options);
            var collection = this;
            var success = options.success;
            options.success = function (model, resp) {
                if (options.wait) collection.add(model, options);
                if (success) success(model, resp, options);
            };
            model.save(null, options);
            return model;
        },

        // **parse** converts a response into a list of models to be added to the
        // collection. The default implementation is just to pass it through.
        parse: function (resp, options) {
            return resp;
        },

        // Create a new collection with an identical list of models as this one.
        clone: function () {
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
        _reset: function () {
            this.length = 0;
            this.models = [];
            this._byId = {};
        },

        // Prepare a hash of attributes (or other model) to be added to this
        // collection.
        _prepareModel: function (attrs, options) {
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
        _addReference: function (model, options) {
            this._byId[model.cid] = model;
            var id = this.modelId(model.attributes);
            if (id != null) this._byId[id] = model;
            model.on('all', this._onModelEvent, this);
        },

        // Internal method to sever a model's ties to a collection.
        _removeReference: function (model, options) {
            if (this === model.collection) delete model.collection;
            model.off('all', this._onModelEvent, this);
        },

        // Internal method called every time a model in the set fires an event.
        // Sets need to update their indexes when models change ids. All other
        // events simply proxy through. "add" and "remove" events that originate
        // in other collections are ignored.
        _onModelEvent: function (event, model, collection, options) {
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
    _.each(methods, function (method) {
        if (!_[method]) return;
        Collection.prototype[method] = function () {
            var args = slice.call(arguments);
            args.unshift(this.models);
            return _[method].apply(_, args);
        };
    });

    // Underscore methods that take a property name as an argument.
    var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

    // Use attributes instead of properties.
    _.each(attributeMethods, function (method) {
        if (!_[method]) return;
        Collection.prototype[method] = function (value, context) {
            var iterator = _.isFunction(value) ? value : function (model) {
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
    var V = BI.V = function (options) {
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
        $: function (selector) {
            return this.$el.find(selector);
        },

        _defaultConfig: function () {
            return {}
        },

        // _init is an empty function by default. Override it with your own
        // initialization logic.
        _init: function () {
        },

        //容器，默认放在this.element上
        _vessel: function () {
            return this
        },
        // **render** is the core function that your view should override, in order
        // to populate its element (`this.el`), with the appropriate HTML. The
        // convention is for **render** to always return `this`.
        render: function (vessel) {
            return this;
        },

        // Remove this view by taking the element out of the DOM, and removing any
        // applicable BI.Events listeners.
        remove: function () {
            this._removeElement();
            this.stopListening();
            return this;
        },

        // Remove this view's element from the document and all event listeners
        // attached to it. Exposed for subclasses using an alternative DOM
        // manipulation API.
        _removeElement: function () {
            this.$el.remove();
            if ($.browser.msie === true) {
                this.el.outerHTML = '';
            }
        },

        // Change the view's element (`this.el` property) and re-delegate the
        // view's events on the new element.
        setElement: function (element) {
            this.undelegateEvents();
            this._setElement(element);
            this.vessel = this._vessel();
            this.render(this.vessel);
            this.delegateEvents();
            return this;
        },

        setVisible: function (visible) {
            this.options.invisible = !visible;
            if (visible) {
                this.element.css("display", "");
            } else {
                this.element.css("display", "none");
            }
        },

        isVisible: function () {
            return !this.options.invisible;
        },

        visible: function () {
            this.setVisible(true);
        },

        invisible: function () {
            this.setVisible(false);
        },

        // Creates the `this.el` and `this.$el` references for this view using the
        // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
        // context or an element. Subclasses can override this to utilize an
        // alternative DOM manipulation API and are only required to set the
        // `this.el` property.
        _setElement: function (el) {
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
        delegateEvents: function (events) {
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
        delegate: function (eventName, selector, listener) {
            this.vessel.element.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        },

        // Clears all callbacks previously bound to the view by `delegateEvents`.
        // You usually don't need to use this, but may wish to if you have multiple
        // BI views attached to the same DOM element.
        undelegateEvents: function () {
            if (this.vessel) this.vessel.element.off('.delegateEvents' + this.cid);
            return this;
        },

        // A finer-grained `undelegateEvents` for removing a single delegated event.
        // `selector` and `listener` are both optional.
        undelegate: function (eventName, selector, listener) {
            this.vessel.element.off(eventName + '.delegateEvents' + this.cid, selector, listener);
        },

        // Produces a DOM element to be assigned to your view. Exposed for
        // subclasses using an alternative DOM manipulation API.
        _createElement: function (tagName) {
            return document.createElement(tagName);
        },

        // Ensure that the V has a DOM element to render into.
        // If `this.el` is a string, pass it through `$()`, take the first
        // matching element, and re-assign it to `el`. Otherwise, create
        // an element from the `id`, `className` and `tagName` properties.
        _ensureElement: function () {
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
        _setAttributes: function (attributes) {
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
    BI.sync = function (method, model, options) {
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
            params.url = _.result(model, method + "URL") || _.result(model, 'url');
            if (!params.url) {
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
            options.beforeSend = function (xhr) {
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
        options.error = function (xhr, textStatus, errorThrown) {
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
        'patch': 'PATCH',
        'delete': 'DELETE',
        'read': 'GET'
    };

    // Set the default implementation of `BI.ajax` to proxy through to `$`.
    // Override this if you'd like to use a different library.
    BI.ajax = $.ajax;

    // BI.Router
    // ---------------

    // Routers map faux-URLs to actions, and fire events when routes are
    // matched. Creating a new one sets its `routes` hash, if not set statically.
    var Router = BI.Router = function (options) {
        options || (options = {});
        if (options.routes) this.routes = options.routes;
        this._bindRoutes();
        this._init.apply(this, arguments);
    };

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    // Set up all inheritable **BI.Router** properties and methods.
    _.extend(Router.prototype, Events, {

        // _init is an empty function by default. Override it with your own
        // initialization logic.
        _init: function () {
        },

        // Manually bind a single named route to a callback. For example:
        //
        //     this.route('search/:query/p:num', 'search', function(query, num) {
        //       ...
        //     });
        //
        route: function (route, name, callback) {
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) callback = this[name];
            var router = this;
            BI.history.route(route, function (fragment) {
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
        execute: function (callback, args, name) {
            if (callback) callback.apply(this, args);
        },

        // Simple proxy to `BI.history` to save a fragment into the history.
        navigate: function (fragment, options) {
            BI.history.navigate(fragment, options);
            return this;
        },

        // Bind all defined routes to `BI.history`. We have to reverse the
        // order of the routes here to support behavior where the most general
        // routes can be defined at the bottom of the route map.
        _bindRoutes: function () {
            if (!this.routes) return;
            this.routes = _.result(this, 'routes');
            var route, routes = _.keys(this.routes);
            while ((route = routes.pop()) != null) {
                this.route(route, this.routes[route]);
            }
        },

        // Convert a route string into a regular expression, suitable for matching
        // against the current location hash.
        _routeToRegExp: function (route) {
            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, function (match, optional) {
                    return optional ? match : '([^/?]+)';
                })
                .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        },

        // Given a route, and a URL fragment that it matches, return the array of
        // extracted decoded parameters. Empty or unmatched parameters will be
        // treated as `null` to normalize cross-browser behavior.
        _extractParameters: function (route, fragment) {
            var params = route.exec(fragment).slice(1);
            return _.map(params, function (param, i) {
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
    var History = BI.History = function () {
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
        atRoot: function () {
            var path = this.location.pathname.replace(/[^\/]$/, '$&/');
            return path === this.root && !this.getSearch();
        },

        // In IE6, the hash fragment and search params are incorrect if the
        // fragment contains `?`.
        getSearch: function () {
            var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
            return match ? match[0] : '';
        },

        // Gets the true hash value. Cannot use location.hash directly due to bug
        // in Firefox where location.hash will always be decoded.
        getHash: function (window) {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : '';
        },

        // Get the pathname and search params, without the root.
        getPath: function () {
            var path = decodeURI(this.location.pathname + this.getSearch());
            var root = this.root.slice(0, -1);
            if (!path.indexOf(root)) path = path.slice(root.length);
            return path.charAt(0) === '/' ? path.slice(1) : path;
        },

        // Get the cross-browser normalized URL fragment from the path or hash.
        getFragment: function (fragment) {
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
        start: function (options) {
            if (History.started) throw new Error('BI.history has already been started');
            History.started = true;

            // Figure out the initial configuration. Do we need an iframe?
            // Is pushState desired ... is it available?
            this.options = _.extend({root: '/'}, this.options, options);
            this.root = this.options.root;
            this._wantsHashChange = this.options.hashChange !== false;
            this._hasHashChange = 'onhashchange' in window;
            this._wantsPushState = !!this.options.pushState;
            this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
            this.fragment = this.getFragment();

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
        stop: function () {
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
        route: function (route, callback) {
            this.handlers.unshift({route: route, callback: callback});
        },

        // Checks the current URL to see if it has changed, and if it has,
        // calls `loadUrl`, normalizing across the hidden iframe.
        checkUrl: function (e) {
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
        loadUrl: function (fragment) {
            fragment = this.fragment = this.getFragment(fragment);
            return _.any(this.handlers, function (handler) {
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
        navigate: function (fragment, options) {
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
        _updateHash: function (location, fragment, replace) {
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
    var extend = function (protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function () {
            this.constructor = child;
        };
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
    var urlError = function () {
        throw new Error('A "url" property or function must be specified');
    };

    // Wrap an optional error callback with a fallback error event.
    var wrapError = function (model, options) {
        var error = options.error;
        options.error = function (resp) {
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
                throw new Error("cannot create Widgets")
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
            if (obj && !obj.type && obj.el) {
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

        deepUnique: function (array) {
            var result = [];
            BI.each(array, function (i, item) {
                if (!BI.deepContains(result, item)) {
                    result.push(item);
                }
            });
            return result;
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
                    copies[i]();
                }
            }

            if (typeof Promise !== 'undefined') {
                var p = Promise.resolve();
                timerFunc = function () {
                    p.then(nextTickHandler);
                }
            } else

            /* istanbul ignore if */
            if (typeof MutationObserver !== 'undefined') {
                var counter = 1;
                var observer = new MutationObserver(nextTickHandler);
                var textNode = document.createTextNode(counter + "");
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function () {
                    counter = (counter + 1) % 2;
                    textNode.data = counter + "";
                }
            } else {
                timerFunc = function () {
                    setTimeout(nextTickHandler, 0)
                }
            }
            return function queueNextTick(cb) {
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
                if (!cb && typeof Promise !== 'undefined') {
                    return new Promise(function (resolve) {
                        _resolve = resolve
                    })
                }
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

        isEndWithBlank: function (string) {
            return /(\s|\u00A0)$/.test(string);
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
            return /(msie|trident)/i.test(navigator.userAgent.toLowerCase());
        },

        getIEVersion: function () {
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
            return version;
        },

        isIE9Below: function () {
            if (!BI.isIE()) {
                return false;
            }
            return this.getIEVersion() < 9;
        },

        isIE9: function () {
            return this.getIEVersion() === 9;
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
})(jQuery);;(function () {
    if (!window.BI) {
        window.BI = {};
    }
    function isEmpty(value) {
        // 判断是否为空值
        var result = value === "" || value === null || value === undefined;
        return result;
    }

    // 判断是否是无效的日期
    function isInvalidDate(date) {
        return date == "Invalid Date" || date == "NaN";
    }

    /**
     * 科学计数格式
     */
    function _eFormat(text, fmt) {
        var e = fmt.indexOf("E");
        var eleft = fmt.substr(0, e), eright = fmt.substr(e + 1);
        if (/^[0\.-]+$/.test(text)) {
            text = BI._numberFormat(0.0, eleft) + 'E' + BI._numberFormat(0, eright)
        } else {
            var isNegative = text < 0;
            if (isNegative) {
                text = text.substr(1);
            }
            var elvl = (eleft.split('.')[0] || '').length;
            var point = text.indexOf(".");
            if (point < 0) {
                point = text.length;
            }
            var i = 0; //第一个不为0的数的位置
            text = text.replace('.', '');
            for (var len = text.length; i < len; i++) {
                var ech = text.charAt(i);
                if (ech <= '9' && ech >= '1') {
                    break;
                }
            }
            var right = point - i - elvl;
            var left = text.substr(i, elvl);
            var dis = i + elvl - text.length;
            if (dis > 0) {
                //末位补全0
                for (var k = 0; k < dis; k++) {
                    left += '0';
                }
            } else {
                left += '.' + text.substr(i + elvl);
            }
            left = left.replace(/^[0]+/, '');
            if (right < 0 && eright.indexOf('-') < 0) {
                eright += ';-' + eright;
            }
            text = BI._numberFormat(left, eleft) + 'E' + BI._numberFormat(right, eright);
            if (isNegative) {
                text = '-' + text;
            }
        }
        return text;
    }

    /**
     * 数字格式
     */
    function _numberFormat(text, format) {
        var text = text + '';
        //数字格式，区分正负数
        var numMod = format.indexOf(';');
        if (numMod > -1) {
            if (text >= 0) {
                return _numberFormat(text + "", format.substring(0, numMod));
            } else {
                return _numberFormat((-text) + "", format.substr(numMod + 1));
            }
        } else {
            //兼容格式处理负数的情况(copy:fr-jquery.format.js)
            if (+text < 0 && format.charAt(0) !== '-') {
                return _numberFormat((-text) + "", '-' + format);
            }
        }
        var tp = text.split('.'), fp = format.split('.'),
            tleft = tp[0] || '', fleft = fp[0] || '',
            tright = tp[1] || '', fright = fp[1] || '';
        //百分比,千分比的小数点移位处理
        if (/[%‰]$/.test(format)) {
            var paddingZero = /[%]$/.test(format) ? '00' : '000';
            tright += paddingZero;
            tleft += tright.substr(0, paddingZero.length);
            tleft = tleft.replace(/^0+/gi, '');
            tright = tright.substr(paddingZero.length).replace(/0+$/gi, '');
        }
        var right = _dealWithRight(tright, fright);
        if (right.leftPlus) {
            //小数点后有进位
            tleft = parseInt(tleft) + 1 + '';

            tleft = isNaN(tleft) ? '1' : tleft;
        }
        right = right.num;
        var left = _dealWithLeft(tleft, fleft);
        if (!(/[0-9]/.test(left))) {
            left = left + '0';
        }
        if (!(/[0-9]/.test(right))) {
            return left + right;
        } else {
            return left + '.' + right;
        }
    }

    /**
     * 处理小数点右边小数部分
     * @param tright 右边内容
     * @param fright 右边格式
     * @returns {JSON} 返回处理结果和整数部分是否需要进位
     * @private
     */
    function _dealWithRight(tright, fright) {
        var right = '', j = 0, i = 0;
        for (var len = fright.length; i < len; i++) {
            var ch = fright.charAt(i);
            var c = tright.charAt(j);
            switch (ch) {
                case '0':
                    if (isEmpty(c)) {
                        c = '0';
                    }
                    right += c;
                    j++;
                    break;
                case '#':
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
            //有多余字符，需要四舍五入
            result.leftPlus = true;
            var numReg = right.match(/^[0-9]+/);
            if (numReg) {
                var num = numReg[0];
                var orilen = num.length;
                var newnum = parseInt(num) + 1 + '';
                //进位到整数部分
                if (newnum.length > orilen) {
                    newnum = newnum.substr(1);
                } else {
                    newnum = String.leftPad(newnum, orilen, '0');
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
    function _dealWithLeft(tleft, fleft) {
        var left = '';
        var j = tleft.length - 1;
        var combo = -1, last = -1;
        var i = fleft.length - 1;
        for (; i >= 0; i--) {
            var ch = fleft.charAt(i);
            var c = tleft.charAt(j);
            switch (ch) {
                case '0':
                    if (isEmpty(c)) {
                        c = '0';
                    }
                    last = -1;
                    left = c + left;
                    j--;
                    break;
                case '#':
                    last = i;
                    left = c + left;
                    j--;
                    break;
                case ',':
                    if (!isEmpty(c)) {
                        //计算一个,分隔区间的长度
                        var com = fleft.match(/,[#0]+/);
                        if (com) {
                            combo = com[0].length - 1;
                        }
                        left = ',' + left;
                    }
                    break;
                default :
                    left = ch + left;
                    break;
            }
        }
        if (last > -1) {
            //处理剩余字符
            var tll = tleft.substr(0, j + 1);
            left = left.substr(0, last) + tll + left.substr(last);
        }
        if (combo > 0) {
            //处理,分隔区间
            var res = left.match(/[0-9]+,/);
            if (res) {
                res = res[0];
                var newstr = '', n = res.length - 1 - combo;
                for (; n >= 0; n = n - combo) {
                    newstr = res.substr(n, combo) + ',' + newstr;
                }
                var lres = res.substr(0, n + combo);
                if (!isEmpty(lres)) {
                    newstr = lres + ',' + newstr;
                }
            }
            left = left.replace(/[0-9]+,/, newstr);
        }
        return left;
    }

    BI.cjkEncode = function (text) {
        // alex:如果非字符串,返回其本身(cjkEncode(234) 返回 ""是不对的)
        if (typeof text !== 'string') {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code >= 128 || code === 91 || code === 93) {//91 is "[", 93 is "]".
                newText += "[" + code.toString(16) + "]";
            } else {
                newText += text.charAt(i);
            }
        }

        return newText
    };

    BI.cjkEncodeDO = function (o) {
        if (BI.isPlainObject(o)) {
            var result = {};
            $.each(o, function (k, v) {
                if (!(typeof v == "string")) {
                    v = BI.jsonEncode(v);
                }
                //wei:bug 43338，如果key是中文，cjkencode后o的长度就加了1，ie9以下版本死循环，所以新建对象result。
                k = BI.cjkEncode(k);
                result[k] = BI.cjkEncode(v);
            });
            return result;
        }
        return o;
    };

    BI.jsonEncode = function (o) {
        //james:这个Encode是抄的EXT的
        var useHasOwn = {}.hasOwnProperty ? true : false;

        // crashes Safari in some instances
        //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

        var m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"': '\\"',
            "\\": '\\\\'
        };

        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    }) + '"';
            }
            return '"' + s + '"';
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
                            a.push(',');
                        }
                        a.push(v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };

        if (typeof o == "undefined" || o === null) {
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
            })
        } else if (typeof o == "string") {
            return encodeString(o);
        } else if (typeof o == "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o == "boolean") {
            return String(o);
        } else if (BI.isFunction(o)) {
            return String(o);
        } else {
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
                                a.push(',');
                            }
                            a.push(BI.jsonEncode(i), ":",
                                v === null ? "null" : BI.jsonEncode(v));
                            b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };

    BI.jsonDecode = function (text) {

        try {
            // 注意0啊
            //var jo = $.parseJSON(text) || {};
            var jo = $.parseJSON(text);
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
                //do nothing
            }
            if (jo == null) {
                jo = [];
            }
        }
        if (!_hasDateInJson(text)) {
            return jo;
        }

        function _hasDateInJson(json) {
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
                if (o[a] == o || typeof o[a] == 'object' || $.isFunction(o[a])) {
                    break;
                }
                o[a] = arguments.callee(o[a]);
            }

            return o;
        })(jo);
    };

    BI.contentFormat = function (cv, fmt) {
        if (isEmpty(cv)) {
            //原值为空，返回空字符
            return '';
        }
        var text = cv.toString();
        if (isEmpty(fmt)) {
            //格式为空，返回原字符
            return text;
        }
        if (fmt.match(/^T/)) {
            //T - 文本格式
            return text;
        } else if (fmt.match(/^D/)) {
            //D - 日期(时间)格式
            if (!(cv instanceof Date)) {
                if (typeof cv === 'number') {
                    //毫秒数类型
                    cv = new Date(cv);
                } else {
                    //字符串类型，如yyyyMMdd、MMddyyyy等这样无分隔符的结构
                    cv = Date.parseDate(cv + "", Date.patterns.ISO8601Long);
                }
            }
            if (!BI.isNull(cv)) {
                var needTrim = fmt.match(/^DT/);
                text = BI.date2Str(cv, fmt.substring(needTrim ? 2 : 1));
            }
        } else if (fmt.match(/E/)) {
            //科学计数格式
            text = _eFormat(text, fmt);
        } else {
            //数字格式
            text = _numberFormat(text, fmt);
        }
        //¤ - 货币格式
        text = text.replace(/¤/g, '￥');
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
            return '';
        }
        // O(len(format))
        var len = format.length, result = '';
        if (len > 0) {
            var flagch = format.charAt(0), start = 0, str = flagch;
            for (var i = 1; i < len; i++) {
                var ch = format.charAt(i);
                if (flagch !== ch) {
                    result += compileJFmt({
                        'char': flagch,
                        'str': str,
                        'len': i - start
                    }, date);
                    flagch = ch;
                    start = i;
                    str = flagch;
                } else {
                    str += ch;
                }
            }
            result += compileJFmt({
                'char': flagch,
                'str': str,
                'len': len - start
            }, date);
        }
        return result;

        function compileJFmt(jfmt, date) {
            var str = jfmt.str, len = jfmt.len, ch = jfmt['char'];
            switch (ch) {
                case 'E': //星期
                    str = Date._DN[date.getDay()];
                    break;
                case 'y': //年
                    if (len <= 3) {
                        str = (date.getFullYear() + '').slice(2, 4);
                    } else {
                        str = date.getFullYear();
                    }
                    break;
                case 'M': //月
                    if (len > 2) {
                        str = Date._MN[date.getMonth()];
                    } else if (len < 2) {
                        str = date.getMonth() + 1;
                    } else {
                        str = String.leftPad(date.getMonth() + 1 + '', 2, '0');
                    }
                    break;
                case 'd': //日
                    if (len > 1) {
                        str = String.leftPad(date.getDate() + '', 2, '0');
                    } else {
                        str = date.getDate();
                    }
                    break;
                case 'h': //时(12)
                    var hour = date.getHours() % 12;
                    if (hour === 0) {
                        hour = 12;
                    }
                    if (len > 1) {
                        str = String.leftPad(hour + '', 2, '0');
                    } else {
                        str = hour;
                    }
                    break;
                case 'H': //时(24)
                    if (len > 1) {
                        str = String.leftPad(date.getHours() + '', 2, '0');
                    } else {
                        str = date.getHours();
                    }
                    break;
                case 'm':
                    if (len > 1) {
                        str = String.leftPad(date.getMinutes() + '', 2, '0');
                    } else {
                        str = date.getMinutes();
                    }
                    break;
                case 's':
                    if (len > 1) {
                        str = String.leftPad(date.getSeconds() + '', 2, '0');
                    } else {
                        str = date.getSeconds();
                    }
                    break;
                case 'a':
                    str = date.getHours() < 12 ? 'am' : 'pm';
                    break;
                case 'z':
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
        if (typeof value == 'number') {
            return value;
        } else {
            var str = value + "";
            if (str.indexOf(".") === -1) {
                return parseInt(str);
            } else {
                return parseFloat(str);
            }
        }
    };

    BI.object2Date = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        } else if (typeof obj == 'number') {
            return new Date(obj);
        } else {
            var str = obj + "";
            str = str.replace(/-/g, '/');
            var dt = new Date(str);
            if (!isInvalidDate(dt)) {
                return dt;
            }

            return new Date();
        }
    };

    BI.object2Time = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        } else {
            var str = obj + "";
            str = str.replace(/-/g, '/');
            var dt = new Date(str);
            if (!isInvalidDate(dt)) {
                return dt;
            }
            if (str.indexOf('/') === -1 && str.indexOf(':') !== -1) {
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
        }
    };
})();
/**
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
         * @property 取消挂载事件
         */
        UNMOUNT: '_UNMOUNT',

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
        Center: "center"
    },
    VerticalAlign: {
        Middle: "middle",
        Top: "top",
        Bottom: "bottom"
    }
});/**
 * 客户端观察者，主要处理事件的添加、删除、执行等
 * @class BI.OB
 * @abstract
 */
BI.OB = function (config) {
    var props = this.props;
    if (BI.isFunction(this.props)) {
        props = this.props(config);
    }
    this.options = $.extend(this._defaultConfig(config), props, config);
    this._init();
    this._initRef();
};
$.extend(BI.OB.prototype, {
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
                (lis.target ? lis.target : self)[lis.once ? 'once' : 'on']
                (lis.eventName, _.bind(lis.action, self))
            });
            delete this.options.listeners;
        }
    },

    //获得一个当前对象的引用
    _initRef: function () {
        if (this.options.ref) {
            this.options.ref.call(this, this);
        }
    },

    _getEvents: function () {
        if (!$.isArray(this.events)) {
            this.events = []
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
});/**
 * Widget超类
 * @class BI.Widget
 * @extends BI.OB
 *
 * @cfg {JSON} options 配置属性
 */
BI.Widget = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.Widget.superclass._defaultConfig.apply(this), {
            root: false,
            tagName: "div",
            attributes: null,
            data: null,

            tag: null,
            disabled: false,
            invisible: false,
            invalid: false,
            baseCls: "",
            extraCls: "",
            cls: ""
        })
    },

    //生命周期函数
    beforeCreate: null,

    created: null,

    render: null,

    beforeMount: null,

    mounted: null,

    update: function () {
    },

    beforeDestroy: null,

    destroyed: null,

    _init: function () {
        BI.Widget.superclass._init.apply(this, arguments);
        this.beforeCreate && this.beforeCreate();
        this._initRoot();
        this._initElementWidth();
        this._initElementHeight();
        this._initVisual();
        this._initState();
        this._initElement();
        this._initEffects();
        this.created && this.created();
    },

    /**
     * 初始化根节点
     * @private
     */
    _initRoot: function () {
        var o = this.options;
        this.widgetName = o.widgetName || BI.uniqueId("widget");
        this._isRoot = o.root;
        if (BI.isWidget(o.element)) {
            if (o.element instanceof BI.Widget) {
                this._parent = o.element;
                this._parent.addWidget(this.widgetName, this);
            } else {
                this._isRoot = true;
            }
            this.element = this.options.element.element;
        } else if (o.element) {
            // if (o.root !== true) {
            //     throw new Error("root is a required property");
            // }
            this.element = $(o.element);
            this._isRoot = true;
        } else {
            this.element = $(document.createElement(o.tagName));
        }
        if (o.baseCls || o.extraCls || o.cls) {
            this.element.addClass((o.baseCls || "") + " " + (o.extraCls || "") + " " + (o.cls || ""));
        }
        if (o.attributes) {
            this.element.attr(o.attributes);
        }
        if (o.data) {
            this.element.data(o.data);
        }
        this._children = {};
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

    _initVisual: function () {
        var o = this.options;
        if (o.invisible) {
            //用display属性做显示和隐藏，否则jquery会在显示时将display设为block会覆盖掉display:flex属性
            this.element.css("display", "none");
        }
    },

    _initEffects: function () {
        var o = this.options;
        if (o.disabled || o.invalid) {
            if (this.options.disabled) {
                this.setEnable(false);
            }
            if (this.options.invalid) {
                this.setValid(false);
            }
        }
    },

    _initState: function () {
        this._isMounted = false;
    },

    _initElement: function () {
        var self = this;
        var els = this.render && this.render();
        if (BI.isPlainObject(els)) {
            els = [els];
        }
        if (BI.isArray(els)) {
            BI.each(els, function (i, el) {
                BI.createWidget(el, {
                    element: self
                })
            })
        }
        // if (this._isRoot === true || !(this instanceof BI.Layout)) {
        this._mount();
        // }
    },

    _setParent: function (parent) {
        this._parent = parent;
    },

    _mount: function () {
        var self = this;
        var isMounted = this._isMounted;
        if (isMounted || !this.isVisible()) {
            return;
        }
        if (this._isRoot === true) {
            isMounted = true;
        } else if (this._parent && this._parent._isMounted === true) {
            isMounted = true;
        }
        if (!isMounted) {
            return;
        }
        this.beforeMount && this.beforeMount();
        this._isMounted = true;
        this._mountChildren && this._mountChildren();
        BI.each(this._children, function (i, widget) {
            !self.isEnabled() && widget._setEnable(false);
            !self.isValid() && widget._setValid(false);
            widget._mount && widget._mount();
        });
        this.mounted && this.mounted();
    },

    _mountChildren: null,

    isMounted: function () {
        return this._isMounted;
    },

    setWidth: function (w) {
        this.options.width = w;
        this._initElementWidth();
    },

    setHeight: function (h) {
        this.options.height = h;
        this._initElementHeight();
    },

    _setEnable: function (enable) {
        if (enable === true) {
            this.options.disabled = false;
        } else if (enable === false) {
            this.options.disabled = true;
        }
        //递归将所有子组件使能
        BI.each(this._children, function (i, child) {
            !child._manualSetEnable && child._setEnable && child._setEnable(enable);
        });
    },

    _setValid: function (valid) {
        if (valid === true) {
            this.options.invalid = false;
        } else if (valid === false) {
            this.options.invalid = true;
        }
        //递归将所有子组件使有效
        BI.each(this._children, function (i, child) {
            !child._manualSetValid && child._setValid && child._setValid(valid);
        });
    },

    _setVisible: function (visible) {
        if (visible === true) {
            this.options.invisible = false;
        } else if (visible === false) {
            this.options.invisible = true;
        }
    },

    setEnable: function (enable) {
        this._manualSetEnable = true;
        this._setEnable(enable);
        if (enable === true) {
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.element.addClass("base-disabled disabled");
        }
    },

    setVisible: function (visible) {
        this._setVisible(visible);
        if (visible === true) {
            //用this.element.show()会把display属性改成block
            this.element.css("display", "");
            this._mount();
        } else if (visible === false) {
            this.element.css("display", "none");
        }
        this.fireEvent(BI.Events.VIEW, visible);
    },

    setValid: function (valid) {
        this._manualSetValid = true;
        this._setValid(valid);
        if (valid === true) {
            this.element.removeClass("base-invalid invalid");
        } else if (valid === false) {
            this.element.addClass("base-invalid invalid");
        }
    },

    doBehavior: function () {
        var args = arguments;
        //递归将所有子组件使有效
        BI.each(this._children, function (i, child) {
            child.doBehavior && child.doBehavior.apply(child, args);
        });
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

    addWidget: function (name, widget) {
        var self = this;
        if (name instanceof BI.Widget) {
            widget = name;
            name = widget.getName();
        }
        if (BI.isKey(name)) {
            name = name + "";
        }
        name = name || widget.getName() || BI.uniqueId("widget");
        if (this._children[name]) {
            throw new Error("name has already been existed");
        }
        widget._setParent && widget._setParent(this);
        widget.on(BI.Events.DESTROY, function () {
            BI.remove(self._children, this);
        });
        return (this._children[name] = widget);
    },

    getWidgetByName: function (name) {
        if (!BI.isKey(name) || name === this.getName()) {
            return this;
        }
        name = name + "";
        var widget = void 0, other = {};
        BI.any(this._children, function (i, wi) {
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

    removeWidget: function (nameOrWidget) {
        var self = this;
        if (BI.isWidget(nameOrWidget)) {
            BI.remove(this._children, nameOrWidget);
        } else {
            delete this._children[nameOrWidget];
        }
    },

    hasWidget: function (name) {
        return this._children[name] != null;
    },

    getName: function () {
        return this.widgetName;
    },

    setTag: function (tag) {
        this.options.tag = tag;
    },

    getTag: function () {
        return this.options.tag;
    },

    attr: function (key, value) {
        var self = this;
        if (BI.isPlainObject(key)) {
            BI.each(key, function (k, v) {
                self.attr(k, v);
            })
            return;
        }
        if (BI.isNotNull(value)) {
            return this.options[key] = value;
        }
        return this.options[key];
    },

    getText: function () {

    },

    setText: function (text) {

    },

    getValue: function () {

    },

    setValue: function (value) {

    },

    isEnabled: function () {
        return !this.options.disabled;
    },

    isVisible: function () {
        return !this.options.invisible;
    },

    disable: function () {
        this.setEnable(false);
    },

    enable: function () {
        this.setEnable(true);
    },

    valid: function () {
        this.setValid(true);
    },

    invalid: function () {
        this.setValid(false);
    },

    invisible: function () {
        this.setVisible(false);
    },

    visible: function () {
        this.setVisible(true);
    },

    __d: function () {
        this.beforeDestroy && this.beforeDestroy();
        BI.each(this._children, function (i, widget) {
            widget._unMount && widget._unMount();
        });
        this._children = {};
        this._parent = null;
        this._isMounted = false;
        this.destroyed && this.destroyed();
    },

    _unMount: function () {
        this.__d();
        this.fireEvent(BI.Events.UNMOUNT);
        this.purgeListeners();
    },

    isolate: function () {
        if (this._parent) {
            this._parent.removeWidget(this);
        }
        BI.DOM.hang([this]);
    },

    empty: function () {
        BI.each(this._children, function (i, widget) {
            widget._unMount && widget._unMount();
        });
        this._children = {};
        this.element.empty();
    },

    _destroy: function () {
        this.__d();
        this.element.destroy();
        this.purgeListeners();
    },

    destroy: function () {
        this.__d();
        this.element.destroy();
        this.fireEvent(BI.Events.DESTROY);
        this.purgeListeners();
    }
});BI.Model = BI.inherit(BI.M, {
    props: {},
    init: null,
    destroyed: null,

    _defaultConfig: function () {
        return BI.extend({
            "default": "just a default",
            "current": void 0
        }, this.props)
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
        this.init && this.init();
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
        var self = this;
        var childMap = this._map(child);
        //this.set(childMap);
        var changes = [];
        var changing = this._changing;
        var changed;
        var options = {};
        this._changing = true;
        if (!changing) {
            this._previousAttributes = _.clone(this.attributes);
            this.changed = {};
        }
        var current = this.attributes, prev = this._previousAttributes, val;
        for (var attr in childMap) {
            val = childMap[attr];
            changes.push(attr);
            this.changed[attr] = val;
            current[attr] = val;
        }
        if (changes.length) this._pending = options;
        for (var i = 0, length = changes.length; i < length; i++) {
            this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
        if (changing) return this;
        changed = BI.clone(this.changed);
        while (this._pending) {
            options = this._pending;
            this._pending = false;
            this.trigger('change', changed, prev, this, options);
        }
        this._pending = false;
        this._changing = false;
        if (changes.length) {
            this.trigger("changed", changed, prev, this, options);
        }
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
            BI.remove(self._childs, child);
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
            if (BI.isKey(backup.id)) {
                copy = backup.id;
                delete backup.id;
            }
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
        return BI.servletURL;
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
    },

    _destroy: function () {
        var children = BI.extend({}, this._childs);
        this._childs = {};
        BI.each(children, function (i, child) {
            child._destroy();
        });
        this.destroyed && this.destroyed();
    },

    destroy: function () {
        this._destroy();
        BI.Model.superclass.destroy.apply(this, arguments);
    }
});/**
 * @class BI.View
 * @extends BI.V
 * @type {*|void|Object}
 */
BI.View = BI.inherit(BI.V, {

    //生命周期函数
    beforeCreate: null,

    created: null,

    beforeDestroy: null,

    destroyed: null,

    _init: function () {
        BI.View.superclass._init.apply(this, arguments);
        this.beforeCreate && this.beforeCreate();
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
            this._destroy();
        }).listenTo(this.model, "unset", function () {
            this._destroy();
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
        });
        this.created && this.created();
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
            element: this
        });
        var vessel = BI.createWidget();
        this._cardLayouts[this.getName()].addCardByName(this.getName(), vessel);
        return vessel;
    },

    render: function (vessel) {
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
        this._cardLayouts[key] && this._cardLayouts[key]._destroy();
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
                    view._destroy();
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
        this.model.read(BI.extend({
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

    reading: function (options) {
        var self = this;
        var name = BI.UUID();
        this.model.read(BI.extend({}, options, {
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
        this.model.update(BI.extend({}, options, {
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
        this.model.patch(BI.extend({}, options, {
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

    _unMount: function () {
        this.beforeDestroy && this.beforeDestroy();
        BI.each(this._cardLayouts, function (name, card) {
            card && card._unMount();
        });
        delete this._cardLayouts;
        delete this._cards;
        this.destroyed && this.destroyed();
        this.trigger(BI.Events.UNMOUNT);
        this.off();
    },

    _destroy: function () {
        var self = this;
        BI.each(this._cardLayouts, function (name, card) {
            card && card._unMount();
            BI.Layers.remove(name + self.cid);
        });
        delete this._cardLayouts;
        delete this._cards;
        this.destroyed && this.destroyed();
        this.remove();
        this.trigger(BI.Events.DESTROY);
        this.off();
    }
});(function () {
    var kv = {};
    BI.shortcut = function (xtype, cls) {
        if (kv[xtype] != null) {
            throw ("shortcut:[" + xtype + "] has been registed");
        }
        kv[xtype] = cls;
    };

    // 根据配置属性生成widget
    var createWidget = function (config) {
        if (config['classType']) {
            return new (new Function('return ' + config['classType'] + ';')())(config);
        }

        var xtype = config.type.toLowerCase();
        var cls = kv[xtype];
        return new cls(config);
    };

    BI.createWidget = function (item, options) {
        var el;
        options || (options = {});
        if (BI.isEmpty(item) && BI.isEmpty(options)) {
            return BI.createWidget({
                type: "bi.layout"
            });
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

})();BI.Plugin = BI.Plugin || {};
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
 * guy
 * 控制器
 * Controller层超类
 * @class BI.Controller
 * @extends BI.OB
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
 * 对数组对象的扩展
 * @class Array
 */
$.extend(Array.prototype, {
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
Date._DN = [BI.i18nText("BI-Basic_Sunday"),
    BI.i18nText("BI-Basic_Monday"),
    BI.i18nText("BI-Basic_Tuesday"),
    BI.i18nText("BI-Basic_Wednesday"),
    BI.i18nText("BI-Basic_Thursday"),
    BI.i18nText("BI-Basic_Friday"),
    BI.i18nText("BI-Basic_Saturday"),
    BI.i18nText("BI-Basic_Sunday")];

// short day names
Date._SDN = [BI.i18nText("BI-Basic_Simple_Sunday"),
    BI.i18nText("BI-Basic_Simple_Monday"),
    BI.i18nText("BI-Basic_Simple_Tuesday"),
    BI.i18nText("BI-Basic_Simple_Wednesday"),
    BI.i18nText("BI-Basic_Simple_Thursday"),
    BI.i18nText("BI-Basic_Simple_Friday"),
    BI.i18nText("BI-Basic_Simple_Saturday"),
    BI.i18nText("BI-Basic_Simple_Sunday")];

// Monday first, etc.
Date._FD = 1;

// full month namesdat
Date._MN = [
    BI.i18nText("BI-Basic_January"),
    BI.i18nText("BI-Basic_February"),
    BI.i18nText("BI-Basic_March"),
    BI.i18nText("BI-Basic_April"),
    BI.i18nText("BI-Basic_May"),
    BI.i18nText("BI-Basic_June"),
    BI.i18nText("BI-Basic_July"),
    BI.i18nText("BI-Basic_August"),
    BI.i18nText("BI-Basic_September"),
    BI.i18nText("BI-Basic_October"),
    BI.i18nText("BI-Basic_November"),
    BI.i18nText("BI-Basic_December")];

// short month names
Date._SMN = [0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11];

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

/**
 * 获取时区
 * @returns {String}
 */
Date.prototype.getTimezone = function () {
    return this.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
};

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
    var week = d.getDay();
    if (this.getMonth() === 0 && this.getDate() <= week) {
        return 1;
    }
    d.setDate(this.getDate() - week);
    var ms = d.valueOf(); // GMT
    d.setMonth(0);
    d.setDate(1);
    var offset = Math.floor((ms - d.valueOf()) / (7 * 864e5)) + 1;
    if (d.getDay() > 0) {
        offset++;
    }
    return offset;
};

//离当前时间多少天的时间
Date.prototype.getOffsetDate = function (offset) {
    return new Date(this.getTime() + offset * 864e5);
};

Date.prototype.getAfterMulQuarter = function (n) {
    var dt = new Date(this.getTime());
    dt.setMonth(dt.getMonth() + n * 3);
    return dt;
};
//获得n个季度前的日期
Date.prototype.getBeforeMulQuarter = function (n) {
    var dt = new Date(this.getTime());
    dt.setMonth(dt.getMonth() - n * 3);
    return dt;
};
//得到本季度的起始月份
Date.prototype.getQuarterStartMonth = function () {
    var quarterStartMonth = 0;
    var nowMonth = this.getMonth();
    if (nowMonth < 3) {
        quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
        quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
        quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
};
//获得本季度的起始日期
Date.prototype.getQuarterStartDate = function () {
    return new Date(this.getFullYear(), this.getQuarterStartMonth(), 1);
};
//得到本季度的结束日期
Date.prototype.getQuarterEndDate = function () {
    var quarterEndMonth = this.getQuarterStartMonth() + 2;
    return new Date(this.getFullYear(), quarterEndMonth, this.getMonthDays(quarterEndMonth));
};
Date.prototype.getAfterMultiMonth = function (n) {
    var dt = new Date(this.getTime());
    dt.setMonth(dt.getMonth() + n | 0);
    return dt;
};
Date.prototype.getBeforeMultiMonth = function (n) {
    var dt = new Date(this.getTime());
    dt.setMonth(dt.getMonth() - n | 0);
    return dt;
};

Date.prototype.getAfterMulQuarter = function (n) {
    var dt = new Date(this.getTime());
    dt.setMonth(dt.getMonth() + n * 3);
    return dt;
};
//获得n个季度前的日期
Date.prototype.getBeforeMulQuarter = function (n) {
    var dt = new Date(this.getTime());
    dt.setMonth(dt.getMonth() - n * 3);
    return dt;
};
//得到本季度的起始月份
Date.prototype.getQuarterStartMonth = function () {
    var quarterStartMonth = 0;
    var nowMonth = this.getMonth();
    if (nowMonth < 3) {
        quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
        quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
        quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
};

//指定日期n个月之前或之后的日期
Date.prototype.getOffsetMonth = function (n) {
    var dt = new Date(this.getTime());
    var day = dt.getDate();
    var monthDay = new Date(dt.getFullYear(), dt.getMonth() + parseInt(n), 1).getMonthDays();
    if (day > monthDay) {
        day = monthDay;
    }
    dt.setDate(day);
    dt.setMonth(dt.getMonth() + parseInt(n));
    return dt;
};

//获得本周的起始日期
Date.prototype.getWeekStartDate = function () {
    var w = this.getDay();
    return this.getOffsetDate(-w);
};
//得到本周的结束日期
Date.prototype.getWeekEndDate = function () {
    var w = this.getDay();
    var offset = (w === 0 ? 6 : 6 - w);
    return this.getOffsetDate(offset);
};

//获得本季度的起始日期
Date.prototype.getQuarterStartDate = function () {
    return new Date(this.getFullYear(), this.getQuarterStartMonth(), 1);
};
//得到本季度的结束日期
Date.prototype.getQuarterEndDate = function () {
    var quarterEndMonth = this.getQuarterStartMonth() + 2;
    return new Date(this.getFullYear(), quarterEndMonth, this.getMonthDays(quarterEndMonth));
};
Date.prototype.getAfterMultiMonth = function (n) {
    var dt = new Date(this.getTime());
    dt.setMonth(dt.getMonth() + n | 0);
    return dt;
};
Date.prototype.getBeforeMultiMonth = function (n) {
    var dt = new Date(this.getTime());
    dt.setMonth(dt.getMonth() - n | 0);
    return dt;
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
    var MD = Date._MD.slice(0);
    MD[1] = Date.isLeap(YY) ? 29 : 28;
    return MM >= 1 && MM <= 12 && DD <= MD[MM - 1];
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
};
/*
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
};/*!
 * jLayout JQuery Plugin v0.11
 *
 * Licensed under the revised BSD License.
 * Copyright 2008, Bram Stein
 * All rights reserved.
 */
if (jQuery) {
    (function ($) {
        // richer:容器在其各个边缘留出的空间
        if (!$.fn.insets) {
            $.fn.insets = function () {
                var p = this.padding(),
                    b = this.border();
                return {
                    'top': p.top,
                    'bottom': p.bottom + b.bottom + b.top,
                    'left': p.left,
                    'right': p.right + b.right + b.left
                };
            };
        }

        // richer:获取 && 设置jQuery元素的边界
        if (!$.fn.bounds) {
            $.fn.bounds = function (value) {
                var tmp = {hasIgnoredBounds: true};

                if (value) {
                    if (!isNaN(value.x)) {
                        tmp.left = value.x;
                    }
                    if (!isNaN(value.y)) {
                        tmp.top = value.y;
                    }
                    if (value.width != null) {
                        tmp.width = (value.width - (this.outerWidth(true) - this.width()));
                        tmp.width = (tmp.width >= 0) ? tmp.width : value.width;
                        // fix chrome
                        //tmp.width = (tmp.width >= 0) ? tmp.width : 0;
                    }
                    if (value.height != null) {
                        tmp.height = value.height - (this.outerHeight(true) - this.height());
                        tmp.height = (tmp.height >= 0) ? tmp.height : value.height;
                        // fix chrome
                        //tmp.height = (tmp.height >= 0) ? tmp.height : value.0;
                    }
                    this.css(tmp);
                    return this;
                }
                else {
                    // richer:注意此方法只对可见元素有效
                    tmp = this.position();
                    return {
                        'x': tmp.left,
                        'y': tmp.top,
                        // richer:这里计算外部宽度和高度的时候，都不包括边框
                        'width': this.outerWidth(),
                        'height': this.outerHeight()
                    };
                }
            };
        }
    })(jQuery);
}
;if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== '0.000' ||
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
        return (t2 > t1) ? (r1 / r2) * pow(10, t2 - t1) : (r1 / r2) / pow(10, t1 - t2);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};/**
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
});(function (window, undefined) {
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

    var addEventListener = typeof document !== 'undefined' && document.addEventListener;
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
        if (addEventListener){
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

        } else {
            element.attachEvent('onresize', fn);
        }
    };

    var removeResizeListener = function (element, fn) {
        if (addEventListener) {
            element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if (!element.__resizeListeners__.length) {
                element.removeEventListener('scroll', scrollListener, true);
                element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
            }
        } else {
            element.detachEvent('onresize', fn);
        }
    };

    BI.ResizeDetector = {
        addResizeListener: function (widget, fn) {
            addResizeListener(widget.element[0], fn);
            return function () {
                removeResizeListener(widget.element[0], fn);
            }
        },
        removeResizeListener: function (widget, fn) {
            removeResizeListener(widget.element[0], fn);
        }
    };
}());
BI.EventListener = {
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
})();;
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
        config.url = BI.servletURL + '?op=' + config.op + '&resource=' + config.path;
        this.$import(config.url, config.type, config.must);
    },
    $import: function () {
        var _LOADED = {}; // alex:保存加载过的
        function loadReady(src, must) {
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

    p.has = function (key) {
        return this._keymap[key] != null;
    }
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

    BI.PrefixIntervalTree.empty = function (size) {
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
})();;
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
            } else {
                return [sNodes];
            }
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
            } else {
                return [sNodes];
            }
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
            })
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
BI.BehaviorFactory = {
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
 * guy
 *
 * @class BI.HighlightBehavior
 * @extends BI.Behavior
 */
BI.HighlightBehavior = BI.inherit(BI.Behavior, {
    _defaultConfig: function () {
        return BI.extend(BI.HighlightBehavior.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.HighlightBehavior.superclass._init.apply(this, arguments);

    },

    doBehavior: function (items) {
        var args = Array.prototype.slice.call(arguments, 1),
            o = this.options;
        BI.each(items, function (i, item) {
            if (item instanceof BI.Single) {
                var rule = o.rule(item.getValue(), item);

                function doBe(run) {
                    if (run === true) {
                        item.doHighLight.apply(item, args);
                    } else {
                        item.unHighLight.apply(item, args);
                    }
                }

                if (BI.isFunction(rule)) {
                    rule(doBe);
                } else {
                    doBe(rule);
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
    props: function () {
        return {
            scrollable: null, //true, false, null
            scrollx: false, //true, false
            scrolly: false, //true, false
            items: []
        };
    },

    render: function () {
        this._init4Margin();
        this._init4Scroll();
    },

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

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.element.append(frag);
        }
    },

    _getChildName: function (index) {
        return index + "";
    },

    _addElement: function (i, item) {
        var self = this, w;
        if (!this.hasWidget(this._getChildName(i))) {
            w = BI.createWidget(item);
            w.on(BI.Events.DESTROY, function () {
                BI.each(self._children, function (name, child) {
                    if (child === w) {
                        BI.remove(self._children, child);
                        self.removeItemAt(name | 0);
                    }
                });
            });
            this.addWidget(this._getChildName(i), w);
        } else {
            w = this.getWidgetByName(this._getChildName(i));
        }
        return w;
    },

    _getOptions: function (item) {
        if (item instanceof BI.Widget) {
            item = item.options;
        }
        item = BI.stripEL(item);
        if (item instanceof BI.Widget) {
            item = item.options;
        }
        return item;
    },

    _compare: function (item1, item2) {
        var self = this;
        return eq(item1, item2);

        //不比较函数
        function eq(a, b, aStack, bStack) {
            if (a === b) {
                return a !== 0 || 1 / a === 1 / b;
            }
            if (a == null || b == null) {
                return a === b;
            }
            var className = Object.prototype.toString.call(a);
            switch (className) {
                case '[object RegExp]':
                case '[object String]':
                    return '' + a === '' + b;
                case '[object Number]':
                    if (+a !== +a) {
                        return +b !== +b;
                    }
                    return +a === 0 ? 1 / +a === 1 / b : +a === +b;
                case '[object Date]':
                case '[object Boolean]':
                    return +a === +b;
            }

            var areArrays = className === '[object Array]';
            if (!areArrays) {
                if (BI.isFunction(a) && BI.isFunction(b)) {
                    return true;
                }
                a = self._getOptions(a);
                b = self._getOptions(b);
            }

            aStack = aStack || [];
            bStack = bStack || [];
            var length = aStack.length;
            while (length--) {
                if (aStack[length] === a) {
                    return bStack[length] === b;
                }
            }

            aStack.push(a);
            bStack.push(b);

            if (areArrays) {
                length = a.length;
                if (length !== b.length) {
                    return false;
                }
                while (length--) {
                    if (!eq(a[length], b[length], aStack, bStack)) {
                        return false;
                    }
                }
            } else {
                var keys = _.keys(a), key;
                length = keys.length;
                if (_.keys(b).length !== length) {
                    return false;
                }
                while (length--) {
                    key = keys[length];
                    if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) {
                        return false;
                    }
                }
            }
            aStack.pop();
            bStack.pop();
            return true;
        }
    },

    _getWrapper: function () {
        return this.element;
    },

    _addItemAt: function (index, item) {
        for (var i = this.options.items.length; i > index; i--) {
            this._children[this._getChildName(i)] = this._children[this._getChildName(i - 1)];
        }
        delete this._children[this._getChildName(index)];
        this.options.items.splice(index, 0, item);
    },

    _removeItemAt: function (index) {
        for (var i = index; i < this.options.items.length - 1; i++) {
            this._children[this._getChildName(i)] = this._children[this._getChildName(i + 1)];
        }
        delete this._children[this._getChildName(this.options.items.length - 1)];
        this.options.items.splice(index, 1);
    },

    /**
     * 添加一个子组件到容器中
     * @param {JSON/BI.Widget} item 子组件
     */
    addItem: function (item) {
        return this.addItemAt(this.options.items.length, item);
    },

    prependItem: function (item) {
        return this.addItemAt(0, item);
    },

    addItemAt: function (index, item) {
        if (index < 0 || index > this.options.items.length) {
            return;
        }
        this._addItemAt(index, item);
        var w = this._addElement(index, item);
        if (index > 0) {
            this._children[this._getChildName(index - 1)].element.after(w.element);
        } else {
            w.element.prependTo(this._getWrapper());
        }
        w._mount();
        return w;
    },

    removeItemAt: function (indexes) {
        indexes = BI.isArray(indexes) ? indexes : [indexes];
        var deleted = [];
        var newItems = [], newChildren = {};
        for (var i = 0, len = this.options.items.length; i < len; i++) {
            var child = this._children[this._getChildName(i)];
            if (indexes.contains(i)) {
                child && deleted.push(child);
            } else {
                newChildren[this._getChildName(newItems.length)] = child;
                newItems.push(this.options.items[i]);
            }
        }
        this.options.items = newItems;
        this._children = newChildren;
        BI.each(deleted, function (i, c) {
            c._destroy();
        });
    },

    updateItemAt: function (index, item) {
        if (index < 0 || index > this.options.items.length - 1) {
            return;
        }

        var child = this._children[this._getChildName(index)];
        var updated;
        if (updated = child.update(this._getOptions(item))) {
            return updated;
        }
        var del = this._children[this._getChildName(index)];
        delete this._children[this._getChildName(index)];
        this.options.items.splice(index, 1);
        var w = this._addElement(index, item);
        this.options.items.splice(index, 0, item);
        this._children[this._getChildName(index)] = w;
        if (index > 0) {
            this._children[this._getChildName(index - 1)].element.after(w.element);
        } else {
            w.element.prependTo(this._getWrapper());
        }
        del._destroy();
        w._mount();
    },

    addItems: function (items) {
        var self = this, o = this.options;
        var fragment = document.createDocumentFragment();
        var added = [];
        BI.each(items, function (i, item) {
            var w = self._addElement(o.items.length, item);
            self._children[self._getChildName(o.items.length)] = w;
            o.items.push(item);
            added.push(w);
            fragment.appendChild(w.element[0]);
        });
        this._getWrapper().append(fragment);
        BI.each(added, function (i, w) {
            w._mount();
        })
    },

    prependItems: function (items) {
        var self = this;
        items = items || [];
        var fragment = document.createDocumentFragment();
        var added = [];
        for (var i = items.length - 1; i >= 0; i--) {
            this._addItemAt(0, items[i]);
            var w = this._addElement(0, items[i]);
            self._children[self._getChildName(0)] = w;
            this.options.items.unshift(items[i]);
            added.push(w);
            fragment.appendChild(w.element[0]);
        }
        this._getWrapper().prepend(fragment);
        BI.each(added, function (i, w) {
            w._mount();
        })
    },

    getValue: function () {
        var self = this, value = [], child;
        BI.each(this.options.items, function (i) {
            if (child = self._children[self._getChildName(i)]) {
                var v = child.getValue();
                v = BI.isArray(v) ? v : [v];
                value = value.concat(v);
            }
        });
        return value;
    },

    setValue: function (v) {
        var self = this, child;
        BI.each(this.options.items, function (i) {
            if (child = self._children[self._getChildName(i)]) {
                child.setValue(v);
            }
        })
    },

    setText: function (v) {
        var self = this, child;
        BI.each(this.options.items, function (i) {
            if (child = self._children[self._getChildName(i)]) {
                child.setText(v);
            }
        })
    },

    update: function (item) {
        var o = this.options;
        var items = item.items || [];
        var updated, i, len;
        for (i = 0, len = Math.min(o.items.length, items.length); i < len; i++) {
            if (!this._compare(o.items[i], items[i])) {
                updated = this.updateItemAt(i, items[i]) || updated;
            }
        }
        if (o.items.length > items.length) {
            var deleted = [];
            for (i = items.length; i < o.items.length; i++) {
                deleted.push(this._children[this._getChildName(i)]);
                delete this._children[this._getChildName(i)];
            }
            o.items.splice(items.length);
            BI.each(deleted, function (i, w) {
                w._destroy();
            })
        } else if (items.length > o.items.length) {
            for (i = o.items.length; i < items.length; i++) {
                this.addItemAt(i, items[i]);
            }
        }
        return updated;
    },

    stroke: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                self._addElement(i, item);
            }
        });
    },

    removeWidget: function (nameOrWidget) {
        var removeIndex;
        if (BI.isWidget(nameOrWidget)) {
            BI.each(this._children, function (name, child) {
                if (child === nameOrWidget) {
                    removeIndex = name;
                }
            })
        } else {
            removeIndex = nameOrWidget;
        }
        if (removeIndex) {
            this._removeItemAt(removeIndex | 0);
        }
    },

    empty: function () {
        BI.Layout.superclass.empty.apply(this, arguments);
        this.options.items = [];
    },

    destroy: function () {
        BI.Layout.superclass.destroy.apply(this, arguments);
        this.options.items = [];
    },

    populate: function (items) {
        var self = this, o = this.options;
        items = items || [];
        if (this._isMounted) {
            this.update({items: items});
            return;
        }
        this.options.items = items;
        this.stroke(items);
    },

    resize: function () {

    }
});
BI.shortcut('bi.layout', BI.Layout);/**
 * absolute实现的居中布局
 * @class BI.AbsoluteCenterLayout
 * @extends BI.Layout
 */
BI.AbsoluteCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-absolute-center-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.AbsoluteCenterLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.absolute_center_adapt', BI.AbsoluteCenterLayout);/**
 * absolute实现的居中布局
 * @class BI.AbsoluteHorizontalLayout
 * @extends BI.Layout
 */
BI.AbsoluteHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteHorizontalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-absolute-horizontal-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.AbsoluteHorizontalLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.absolute_horizontal_adapt', BI.AbsoluteHorizontalLayout);/**
 * absolute实现的居中布局
 * @class BI.AbsoluteVerticalLayout
 * @extends BI.Layout
 */
BI.AbsoluteVerticalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteVerticalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-absolute-vertical-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.AbsoluteVerticalLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.absolute_vertical_adapt', BI.AbsoluteVerticalLayout);/**
 * 自适应水平和垂直方向都居中容器
 * @class BI.CenterAdaptLayout
 * @extends BI.Layout
 */
BI.CenterAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.CenterAdaptLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.CenterAdaptLayout.superclass.render.apply(this, arguments);
        this.$table = $("<table>").attr({"cellspacing": 0, "cellpadding": 0}).css({
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        });
        this.$tr = $("<tr>");
        this.$tr.appendTo(this.$table);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this._getChildName(i))) {
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
            this.addWidget(this._getChildName(i), td);
        } else {
            td = this.getWidgetByName(this._getChildName(i));
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

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$tr.append(frag);
            this.element.append(this.$table);
        }
    },

    resize: function () {
        // console.log("center_adapt布局不需要resize");
    },

    _getWrapper: function(){
        return this.$tr;
    },

    populate: function (items) {
        BI.CenterAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.center_adapt', BI.CenterAdaptLayout);/**
 * 水平方向居中容器
 * @class BI.HorizontalAdaptLayout
 * @extends BI.Layout
 */
BI.HorizontalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalAdaptLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.HorizontalAdaptLayout.superclass.render.apply(this, arguments);
        this.$table = $("<table>").attr({"cellspacing": 0, "cellpadding": 0}).css({
            "position": "relative",
            "width": "100%",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        });
        this.$tr = $("<tr>");
        this.$tr.appendTo(this.$table);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this._getChildName(i))) {
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
            this.addWidget(this._getChildName(i), td);
        } else {
            td = this.getWidgetByName(this._getChildName(i));
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

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$tr.append(frag);
            this.element.append(this.$table);
        }
    },

    resize: function () {
        // console.log("horizontal_adapt布局不需要resize");
    },

    _getWrapper: function () {
        return this.$tr;
    },

    populate: function (items) {
        BI.HorizontalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.horizontal_adapt', BI.HorizontalAdaptLayout);/**
 * 左右分离，垂直方向居中容器
 *          items:{
                left: [{el:{type:"bi.button"}}],
                right:[{el:{type:"bi.button"}}]
            }
 * @class BI.LeftRightVerticalAdaptLayout
 * @extends BI.Layout
 */
BI.LeftRightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.LeftRightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("left_right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
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
                element: this,
                items: [left]
            });
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
                element: this,
                items: [right]
            });
        }
    },

    populate: function (items) {
        BI.LeftRightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.left_right_vertical_adapt', BI.LeftRightVerticalAdaptLayout);


BI.LeftVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-left-vertical-adapt-layout",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    render: function () {
        BI.LeftVerticalAdaptLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("left_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
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
            element: this,
            items: [left]
        });
    },

    populate: function (items) {
        BI.LeftVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.left_vertical_adapt', BI.LeftVerticalAdaptLayout);

BI.RightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.RightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-right-vertical-adapt-layout",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    render: function () {
        BI.RightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {

    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
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
            element: this,
            items: [right]
        });
    },

    populate: function (items) {
        BI.RightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.right_vertical_adapt', BI.RightVerticalAdaptLayout);/**
 * 垂直方向居中容器
 * @class BI.VerticalAdaptLayout
 * @extends BI.Layout
 */
BI.VerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: {
        baseCls: "bi-vertical-adapt-layout",
        columnSize: [],
        hgap: 0,
        vgap: 0,
        lgap: 0,
        rgap: 0,
        tgap: 0,
        bgap: 0
    },
    render: function () {
        BI.VerticalAdaptLayout.superclass.render.apply(this, arguments);
        this.$table = $("<table>").attr({"cellspacing": 0, "cellpadding": 0}).css({
            "position": "relative",
            "height": "100%",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        });
        this.$tr = $("<tr>");
        this.$tr.appendTo(this.$table);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this._getChildName(i))) {
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
            this.addWidget(this._getChildName(i), td);
        } else {
            td = this.getWidgetByName(this._getChildName(i));
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

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$tr.append(frag);
            this.element.append(this.$table);
        }
    },

    _getWrapper: function(){
        return this.$tr;
    },

    resize: function () {
        // console.log("vertical_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.VerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.vertical_adapt', BI.VerticalAdaptLayout);/**
 * 水平方向居中自适应容器
 * @class BI.HorizontalAutoLayout
 * @extends BI.Layout
 */
BI.HorizontalAutoLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalAutoLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-horizon-auto-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.HorizontalAutoLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.horizontal_auto', BI.HorizontalAutoLayout);/**
 * 浮动的居中布局
 */
BI.FloatCenterAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatCenterAdaptLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.FloatCenterAdaptLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("float_center_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
    },

    mounted: function () {
        var self = this;
        var width = this.left.element.outerWidth(),
            height = this.left.element.outerHeight();
        this.left.element.width(width).height(height).css("float", "none");
        BI.remove(this._children, function (i, wi) {
            if (wi === self.container) {
                delete self._children[i];
            }
        });
        BI.createWidget({
            type: "bi.center_adapt",
            element: this,
            items: [this.left]
        });
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.left = BI.createWidget({
            type: "bi.vertical",
            items: items,
            hgap: o.hgap,
            vgap: o.vgap,
            tgap: o.tgap,
            bgap: o.bgap,
            lgap: o.lgap,
            rgap: o.rgap
        });

        this.container = BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.left]
        });

    },

    populate: function (items) {
        BI.FloatCenterAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.float_center_adapt', BI.FloatCenterAdaptLayout);/**
 * 浮动的水平居中布局
 */
BI.FloatHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatHorizontalLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.FloatHorizontalLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("float_horizontal_adapt布局不需要resize");
    },

    mounted: function () {
        var self = this;
        var width = this.left.element.width(),
            height = this.left.element.height();
        this.left.element.width(width).height(height).css("float", "none");
        BI.remove(this._children, function (i, wi) {
            if (wi === self.container) {
                delete self._children[i];
            }
        });
        BI.createWidget({
            type: "bi.horizontal_auto",
            element: this,
            items: [this.left]
        });
    },

    _addElement: function (i, item) {
        var self = this, o = this.options;
        this.left = BI.createWidget({
            type: "bi.vertical",
            items: [item],
            hgap: o.hgap,
            vgap: o.vgap,
            tgap: o.tgap,
            bgap: o.bgap,
            lgap: o.lgap,
            rgap: o.rgap
        });

        this.container = BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.left]
        });

        return this.left;
    },

    populate: function (items) {
        BI.HorizontalAutoLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.horizontal_float', BI.FloatHorizontalLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexCenterLayout
 * @extends BI.Layout
 */
BI.FlexCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-center-layout"
        });
    },
    render: function () {
        BI.FlexCenterLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.flex_center', BI.FlexCenterLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexHorizontalLayout
 * @extends BI.Layout
 */
BI.FlexHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexHorizontalLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.FlexHorizontalLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.flex_horizontal', BI.FlexHorizontalLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalCenter
 * @extends BI.Layout
 */
BI.FlexVerticalCenter = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexVerticalCenter.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.FlexVerticalCenter.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.flex_vertical_center', BI.FlexVerticalCenter);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexCenterLayout
 * @extends BI.Layout
 */
BI.FlexCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-wrapper-center-layout clearfix"
        });
    },
    render: function () {
        BI.FlexCenterLayout.superclass.render.apply(this, arguments);
        this.$wrapper = $("<div>").addClass("flex-wrapper-center-layout-wrapper");
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"});
        return w;
    },

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$wrapper.append(frag);
            this.element.append(this.$wrapper);
        }
    },

    _getWrapper: function(){
        return this.$wrapper;
    },

    resize: function () {
        // console.log("flex_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.flex_wrapper_center', BI.FlexCenterLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexHorizontalLayout
 * @extends BI.Layout
 */
BI.FlexHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexHorizontalLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.FlexHorizontalLayout.superclass.render.apply(this, arguments);
        var o = this.options;
        this.$wrapper = $("<div>").addClass("flex-wrapper-horizontal-layout-wrapper " + o.verticalAlign);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexHorizontalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"});
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

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$wrapper.append(frag);
            this.element.append(this.$wrapper);
        }
    },

    _getWrapper: function(){
        return this.$wrapper;
    },

    resize: function () {
        // console.log("flex_horizontal布局不需要resize");
    },

    populate: function (items) {
        BI.FlexHorizontalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.flex_wrapper_horizontal', BI.FlexHorizontalLayout);/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalCenter
 * @extends BI.Layout
 */
BI.FlexVerticalCenter = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexVerticalCenter.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.FlexVerticalCenter.superclass.render.apply(this, arguments);
        var o = this.options;
        this.$wrapper = $("<div>").addClass("flex-wrapper-vertical-center-wrapper");
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexVerticalCenter.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"});
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

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$wrapper.append(frag);
            this.element.append(this.$wrapper);
        }
    },

    _getWrapper: function(){
        return this.$wrapper;
    },

    resize: function () {
        // console.log("flex_vertical_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexVerticalCenter.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.flex_wrapper_vertical_center', BI.FlexVerticalCenter);/**
 * 固定子组件上下左右的布局容器
 * @class BI.AbsoluteLayout
 * @extends BI.Layout
 */
BI.AbsoluteLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-absolute-layout",
            hgap: null,
            vgap: null,
            lgap: null,
            rgap: null,
            tgap: null,
            bgap: null
        });
    },
    render: function () {
        BI.AbsoluteLayout.superclass.render.apply(this, arguments);
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
        this.options.items = items || [];
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                if (!BI.isWidget(item) && !item.el) {
                    throw new Error("el must be exist");
                }
                self._addElement(i, item);
            }
        });
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.absolute', BI.AbsoluteLayout);BI.AdaptiveLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AdaptiveLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-adaptive-layout",
            hgap: null,
            vgap: null,
            lgap: null,
            rgap: null,
            tgap: null,
            bgap: null
        });
    },
    render: function () {
        BI.AdaptiveLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.adaptive', BI.AdaptiveLayout);/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.BorderLayout
 * @extends BI.Layout
 */
BI.BorderLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.BorderLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-border-layout",
            items: {}
        });
    },
    render: function () {
        BI.BorderLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added")
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
        this._mount();
    }
});
BI.shortcut('bi.border', BI.BorderLayout);/**
 * 卡片布局，可以做到当前只显示一个组件，其他的都隐藏
 * @class BI.CardLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {String} options.defaultShowName 默认展示的子组件名
 */
BI.CardLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.CardLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-card-layout",
            items: []
        });
    },
    render: function () {
        BI.CardLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("default布局不需要resize");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.showIndex = void 0;
        BI.each(items, function (i, item) {
            if (!!item) {
                if (!self.hasWidget(item.cardName)) {
                    var w = BI.createWidget(item);
                    w.on(BI.Events.DESTROY, function () {
                        var index = BI.findIndex(o.items, function (i, tItem) {
                            return tItem.cardName == item.cardName;
                        });
                        if (index > -1) {
                            o.items.splice(index, 1);
                        }
                    });
                    self.addWidget(item.cardName, w);
                } else {
                    var w = self.getWidgetByName(item.cardName);
                }
                w.element.css({"position": "absolute", "top": "0", "right": "0", "bottom": "0", "left": "0"});
                w.setVisible(false);
            }
        });
    },

    update: function () {
    },

    empty: function () {
        BI.CardLayout.superclass.empty.apply(this, arguments);
        this.options.items = [];
    },

    populate: function (items) {
        BI.CardLayout.superclass.populate.apply(this, arguments);
        this._mount();
        this.options.defaultShowName && this.showCardByName(this.options.defaultShowName);
    },

    isCardExisted: function (cardName) {
        return BI.some(this.options.items, function (i, item) {
            return item.cardName == cardName && item.el;
        });
    },

    getCardByName: function (cardName) {
        if (!this.isCardExisted(cardName)) {
            throw new Error("cardName is not exist");
        }
        return this._children[cardName];
    },

    _deleteCardByName: function (cardName) {
        delete this._children[cardName];
        var index = BI.findIndex(this.options.items, function (i, item) {
            return item.cardName == cardName;
        });
        if (index > -1) {
            this.options.items.splice(index, 1);
        }
    },

    deleteCardByName: function (cardName) {
        if (!this.isCardExisted(cardName)) {
            throw new Error("cardName is not exist");
        }

        var child = this._children[cardName];
        this._deleteCardByName(cardName);
        child && child._destroy();
    },

    addCardByName: function (cardName, cardItem) {
        if (this.isCardExisted(cardName)) {
            throw new Error("cardName is already exist");
        }
        var widget = BI.createWidget(cardItem);
        widget.element.css({
            "position": "relative",
            "top": "0",
            "left": "0",
            "width": "100%",
            "height": "100%"
        }).appendTo(this.element);
        widget.invisible();
        this.addWidget(cardName, widget);
        this.options.items.push({el: cardItem, cardName: cardName});
        return widget;
    },

    showCardByName: function (name, action, callback) {
        var self = this;
        //name不存在的时候全部隐藏
        var exist = this.isCardExisted(name);
        if (this.showIndex != null) {
            this.lastShowIndex = this.showIndex;
        }
        this.showIndex = name;
        var flag = false;
        BI.each(this.options.items, function (i, item) {
            var el = self._children[item.cardName];
            if (el) {
                if (name != item.cardName) {
                    //动画效果只有在全部都隐藏的时候才有意义,且只要执行一次动画操作就够了
                    !flag && !exist && (BI.Action && action instanceof BI.Action) ? (action.actionBack(el), flag = true) : el.invisible();
                } else {
                    (BI.Action && action instanceof BI.Action) ? action.actionPerformed(void 0, el, callback) : (el.visible(), callback && callback())
                }
            }
        });
    },

    showLastCard: function () {
        var self = this;
        this.showIndex = this.lastShowIndex;
        BI.each(this.options.items, function (i, item) {
            self._children[item.cardName].setVisible(self.showIndex == i);
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
        var self = this;
        BI.each(this.options.items, function (i, item) {
            self._children[item.cardName].invisible();
        });
    },

    isAllCardHide: function () {
        var self = this;
        var flag = true;
        BI.some(this.options.items, function (i, item) {
            if (self._children[item.cardName].isVisible()) {
                flag = false;
                return false;
            }
        });
        return flag;
    },

    removeWidget: function (nameOrWidget) {
        var removeName;
        if (BI.isWidget(nameOrWidget)) {
            BI.each(this._children, function (name, child) {
                if (child === nameOrWidget) {
                    removeName = name;
                }
            })
        } else {
            removeName = nameOrWidget;
        }
        if (removeName) {
            this._deleteCardByName(removeName);
        }
    }
});
BI.shortcut('bi.card', BI.CardLayout);/**
 * 默认的布局方式
 *
 * @class BI.DefaultLayout
 * @extends BI.Layout
 */
BI.DefaultLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.DefaultLayout.superclass.props.apply(this, arguments), {
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: []
        });
    },
    render: function () {
        BI.DefaultLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.default', BI.DefaultLayout);/**
 * 分隔容器的控件，按照宽度和高度所占比平分整个容器
 *
 * @class BI.DivisionLayout
 * @extends BI.Layout
 */
BI.DivisionLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.DivisionLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.DivisionLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.opitons.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added")
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
                    throw new Error("item be required");
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
        this._mount();
    }
});
BI.shortcut('bi.division', BI.DivisionLayout);/**
 * 靠左对齐的自由浮动布局
 * @class BI.FloatLeftLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.FloatLeftLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatLeftLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-float-left-layout clearfix",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.FloatLeftLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.left', BI.FloatLeftLayout);

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
    props: function () {
        return BI.extend(BI.FloatRightLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-float-right-layout clearfix",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.FloatRightLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.right', BI.FloatRightLayout);/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.BorderLayout
 * @extends BI.Layout
 */
BI.GridLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.GridLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.GridLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("grid布局不需要resize")
    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
        var o = this.options;
        var rows = o.rows || o.items.length, columns = o.columns || ((o.items[0] && o.items[0].length) | 0);
        var width = 100 / columns, height = 100 / rows;
        var els = [];
        for (var i = 0; i < rows; i++) {
            els[i] = [];
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
        this._mount();
    }
});
BI.shortcut('bi.grid', BI.GridLayout);/**
 * 水平布局
 * @class BI.HorizontalLayout
 * @extends BI.Layout
 */
BI.HorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.HorizontalLayout.superclass.render.apply(this, arguments);
        this.$table = $("<table>").attr({"cellspacing": 0, "cellpadding": 0}).css({
            "position": "relative",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        });
        this.$tr = $("<tr>");
        this.$tr.appendTo(this.$table);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this._getChildName(i))) {
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
            this.addWidget(this._getChildName(i), td);
        } else {
            td = this.getWidgetByName(this._getChildName(i));
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

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$tr.append(frag);
            this.element.append(this.$table);
        }
    },


    resize: function () {
        // console.log("horizontal layout do not need to resize");
    },

    _getWrapper: function(){
        return this.$tr;
    },

    populate: function (items) {
        BI.HorizontalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.horizontal', BI.HorizontalLayout);

/**
 * 水平布局
 * @class BI.HorizontalCellLayout
 * @extends BI.Layout
 */
BI.HorizontalCellLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalCellLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.HorizontalCellLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.horizontal_cell', BI.HorizontalCellLayout);/**
 * 靠左对齐的自由浮动布局
 * @class BI.LatticeLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.LatticeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.LatticeLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-lattice-layout clearfix"
            //columnSize: [0.2, 0.2, 0.6],
        });
    },
    render: function () {
        BI.LatticeLayout.superclass.render.apply(this, arguments);
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

    addItemAt: function (item) {
        var w = BI.LatticeLayout.superclass.addItemAt.apply(this, arguments);
        this.resize();
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.LatticeLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.lattice', BI.LatticeLayout);/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.TableLayout
 * @extends BI.Layout
 */
BI.TableLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.TableLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.TableLayout.superclass.render.apply(this, arguments);
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
                throw new Error("item with fill can only be one");
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
            throw new Error("item must be array");
        }
        return BI.TableLayout.superclass.addItem.apply(this, arguments);
    },

    populate: function (items) {
        BI.TableLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.table', BI.TableLayout);/**
 * 水平tape布局
 * @class BI.HTapeLayout
 * @extends BI.Layout
 */
BI.HTapeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HTapeLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.HTapeLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },
    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added")
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
        this._mount();
    }
});
BI.shortcut('bi.htape', BI.HTapeLayout);

/**
 * 垂直tape布局
 * @class BI.VTapeLayout
 * @extends BI.Layout
 */
BI.VTapeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.VTapeLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.VTapeLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added")
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
        this._mount();
    }
});
BI.shortcut('bi.vtape', BI.VTapeLayout);/**
 * td布局
 * @class BI.TdLayout
 * @extends BI.Layout
 */
BI.TdLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.TdLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.TdLayout.superclass.render.apply(this, arguments);
        this.$table = $("<table>").attr({"cellspacing": 0, "cellpadding": 0}).css({
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        });
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
        this.addWidget(this.getName() + idx, tr);
        return tr;
    },

    _mountChildren: function(){
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$table.append(frag);
            this.element.append(this.$table);
        }
    },

    resize: function () {
        // console.log("td布局不需要resize");
    },

    addItem: function (arr) {
        if (!BI.isArray(arr)) {
            throw new Error("item must be array");
        }
        return BI.TdLayout.superclass.addItem.apply(this, arguments);
    },

    populate: function (items) {
        BI.TdLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.td', BI.TdLayout);/**
 * 垂直布局
 * @class BI.VerticalLayout
 * @extends BI.Layout
 */
BI.VerticalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.VerticalLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.VerticalLayout.superclass.render.apply(this, arguments);
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
        this._mount();
    }
});
BI.shortcut('bi.vertical', BI.VerticalLayout);/**
 *
 * @class BI.WindowLayout
 * @extends BI.Layout
 */
BI.WindowLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.WindowLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.WindowLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added")
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
                    throw new Error("item be required");
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
        this._mount();
    }
});
BI.shortcut('bi.window', BI.WindowLayout);/**
 * 水平和垂直方向都居中容器, 非自适应，用于宽度高度固定的面板
 * @class BI.CenterLayout
 * @extends BI.Layout
 */
BI.CenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.CenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.CenterLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("center布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("cannot be added");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: i,
                row: 0,
                el: BI.createWidget({
                    type: "bi.default",
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
                });
                list[i].el.addItem(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this,
            columns: list.length,
            rows: 1,
            items: list
        });
    },

    populate: function (items) {
        BI.CenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.center', BI.CenterLayout);/**
 * 浮动布局实现的居中容器
 * @class BI.FloatCenterLayout
 * @extends BI.Layout
 */
BI.FloatCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-float-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.FloatCenterLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("floatcenter布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        var list = [], width = 100 / items.length;
        BI.each(items, function (i) {
            var widget = BI.createWidget({
                type: "bi.default"
            });
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
                });
                list[i].el.addItem(w);
            }
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: list
        });
    },

    populate: function (items) {
        BI.FloatCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.float_center', BI.FloatCenterLayout);/**
 * 水平和垂直方向都居中容器, 非自适应，用于宽度高度固定的面板
 * @class BI.HorizontalCenterLayout
 * @extends BI.Layout
 */
BI.HorizontalCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-horizontal-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.HorizontalCenterLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("horizontal_center布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
        var o = this.options;
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: i,
                row: 0,
                el: BI.createWidget({
                    type: "bi.default",
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
                });
                list[i].el.addItem(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this,
            columns: list.length,
            rows: 1,
            items: list
        });
    },

    populate: function (items) {
        BI.HorizontalCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.horizontal_center', BI.HorizontalCenterLayout);/**
 * 垂直方向都居中容器, 非自适应，用于高度不固定的面板
 * @class BI.VerticalCenterLayout
 * @extends BI.Layout
 */
BI.VerticalCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.VerticalCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-vertical-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.VerticalCenterLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("vertical_center布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: 0,
                row: i,
                el: BI.createWidget({
                    type: "bi.default",
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
                });
                list[i].el.addItem(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this,
            columns: 1,
            rows: list.length,
            items: list
        });
    },

    populate: function (items) {
        BI.VerticalCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.vertical_center', BI.VerticalCenterLayout);/**
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
 * @class BI.ShowAction
 * @extends BI.Action
 */
BI.ShowAction = BI.inherit(BI.Action, {
    _defaultConfig: function () {
        return BI.extend(BI.ShowAction.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.ShowAction.superclass._init.apply(this, arguments);
    },

    actionPerformed: function (src, tar, callback) {
        tar = tar || this.options.tar;
        tar.setVisible(true);
        callback && callback();
    },

    actionBack: function (tar, src, callback) {
        tar = tar || this.options.tar;
        tar.setVisible(false);
        callback && callback();
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
        var self = this;
        if (!this._broadcasts[name]) {
            this._broadcasts[name] = [];
        }
        this._broadcasts[name].push(fn);
        return function () {
            self.remove(name, fn);
        }
    },

    send: function (name) {
        var args = [].slice.call(arguments, 1);
        BI.each(this._broadcasts[name], function (i, fn) {
            fn.apply(null, args);
        });
    },

    remove: function (name, fn) {
        if (fn) {
            this._broadcasts[name].remove(fn);
            if (this._broadcasts[name].length === 0) {
                delete this._broadcasts[name];
            }
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

    _getOffsetLeft: function (name, context, offsetStyle) {
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

    _getOffsetTop: function (name, context, offsetStyle) {
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

    _getLeftPosition: function (name, context, offsetStyle) {
        var position = $.getLeftPosition(context, this.get(name));
        position.top = this._getOffsetTop(name, context, offsetStyle);
        return position;
    },

    _getBottomPosition: function (name, context, offsetStyle) {
        var position = $.getBottomPosition(context, this.get(name));
        position.left = this._getOffsetLeft(name, context, offsetStyle);
        return position;
    },

    _getTopPosition: function (name, context, offsetStyle) {
        var position = $.getTopPosition(context, this.get(name));
        position.left = this._getOffsetLeft(name, context, offsetStyle);
        return position;
    },

    _getRightPosition: function (name, context, offsetStyle) {
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
        });
        this.set(name, this.storeBubbles[name]["top"]);
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
            });
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
                });
                this.set(name, this.storeBubbles[name]["right"]);
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

    hide: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.get(name).invisible();
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
        BI.each(this.storeBubbles[name], function (dir, bubble) {
            bubble.destroy();
        });
        delete this.storeBubbles[name];
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
        this.floatOpened = {};
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
            cls: "bi-popup-view",
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
        if (!this.floatOpened[name]) {
            this.floatOpened[name] = true;
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
        }
        return this;
    },

    close: function (name) {
        if (!this._check(name)) {
            return this;
        }
        if (this.floatOpened[name]) {
            delete this.floatOpened[name];
            this.floatContainer[name].invisible();
            this.modal && this.floatContainer[name].element.__releaseZIndexMask__(this.zindexMap[name]);
        }
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
        delete this.floatOpened[name];
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
            type: "bi.layout",
            cls: op.cls
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
            layout.element.addClass("bi-popup-view");
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
            throw new Error("name is already exist");
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
        return BI.extend(BI.MaskersController.superclass._defaultConfig.apply(this, arguments), {});
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
        var self = this;
        if (this.has(name)) {
            return this;
        }
        this.resizerManger[name] = resizer;
        return function () {
            self.remove(name);
        };
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
            stopEvent: true,
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
                self.remove(url, context);
            });
            context.on(BI.Events.UNMOUNT, function () {
                self.remove(url, context);
            });
            this.store[url].populate(view);
            this.views[url] = view;
            this.controller.add(url, this.store[url]);
            context && context.on("end:" + view.cid, function () {
                BI.nextTick(function () {
                    self.close(url);
//                    view.end();
                    (context.listenEnd.apply(context, isValid ? modelData.split('.') : [modelData]) !== false) && context.populate();
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
        if (this.controller) {
            this.controller.remove(url);
            delete this.store[url];
            this.views[url] && this.views[url].model.destroy();
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
        if (!BI.isKey(keyword) || (text + "").length > 100) {
            return this.text((text + "").replaceAll(" ", "　"));
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
                    .text(textLeft.substr(tidx, keyword.length).replaceAll(" ", "　")));

                textLeft = textLeft.substr(tidx + keyword.length);
                if (py != null) {
                    py = py.substr(tidx + keyword.length);
                }
            } else if (pidx != null && pidx >= 0 && Math.floor(pidx / text.length) === Math.floor((pidx + keyword.length - 1) / text.length)) {
                this.append(textLeft.substr(0, pidx));
                this.append($("<span>").addClass("bi-keyword-red-mark")
                    .text(textLeft.substr(pidx, keyword.length).replaceAll(" ", "　")));
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
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
            windowBounds = $("body").bounds();
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
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
            windowBounds = $("body").bounds();
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
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
            windowBounds = $("body").bounds();
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
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
            windowBounds = $("body").bounds();
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
        var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
            windowBounds = $("body").bounds();
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
        var bodyHeight = $("body").bounds().height - extraHeight;
        var maxHeight = Math.min(popup.attr("maxHeight") || bodyHeight, bodyHeight);
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
        if (needAdaptHeight === true) {
            popup.resetHeight && popup.resetHeight(Math.min(bodyHeight - position.top, maxHeight));
        }
        return position;
    }
});/**
 * 基本的函数
 * Created by GUY on 2015/6/24.
 */
BI.Func = {};
BI.extend(BI.Func, {

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

    isColor: function (color) {
        return color && (this.isRGBColor(color) || this.isHexColor(color));
    },

    isRGBColor: function (color) {
        if (!color) {
            return false;
        }
        return color.substr(0, 3) === "rgb";
    },

    isHexColor: function (color) {
        if (!color) {
            return false;
        }
        return color[0] === "#" && color.length === 7;
    },

    isDarkColor: function (hex) {
        if (!hex || !this.isHexColor(hex)) {
            return false;
        }
        var rgb = this.rgb2json(this.hex2rgb(hex));
        var grayLevel = Math.round(rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
        if (grayLevel < 192/**网上给的是140**/) {
            return true;
        }
        return false;
    },

    //获取对比颜色
    getContrastColor: function (color) {
        if (!color || !this.isColor(color)) {
            return "";
        }
        if (this.isDarkColor(color)) {
            return "#ffffff";
        }
        return "#1a1a1a";
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
        if (!this.isRGBColor(rgbColour)) {
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
        if (!this.isHexColor(color)) {
            return color;
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

    rgba2rgb: function (rgbColour, BGcolor) {
        if (BI.isNull(BGcolor)) {
            BGcolor = 1;
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

        return "rgb(" + Math.floor(255 * (BGcolor * (1 - A )) + R * A) + "," +
            Math.floor(255 * (BGcolor * (1 - A )) + G * A) + "," +
            Math.floor(255 * (BGcolor * (1 - A )) + B * A) + ")";
    },

    getTextSizeWidth: function (text, fontSize) {
        var span = $("<span></span>").addClass("text-width-span").appendTo($("body"));

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
            }).appendTo($("body"));
            this._scrollWidth = ul[0].offsetWidth - ul[0].clientWidth;
            ul.destroy();
        }
        return this._scrollWidth;
    }
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
                    throw new Error("value cannot be null");
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
 * style加载管理器
 *
 * Created by GUY on 2015/9/7.
 * @class
 */
BI.StyleLoaderManager = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.StyleLoaderManager.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.StyleLoaderManager.superclass._init.apply(this, arguments);
        this.stylesManager = {};
    },

    loadStyle: function (name, styleString) {
        var d = document, styles = d.createElement('style');
        d.getElementsByTagName('head')[0].appendChild(styles);
        styles.setAttribute('type', 'text/css');
        if (styles.styleSheet) {
            styles.styleSheet.cssText = styleString;
        } else {
            styles.appendChild(document.createTextNode(styleString));
        }
        this.stylesManager[name] = styles;

        return this;
    },

    get: function (name) {
        return this.stylesManager[name];
    },

    has: function (name) {
        return this.stylesManager[name] != null;
    },

    removeStyle: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.stylesManager[name].parentNode.removeChild(this.stylesManager[name]);
        delete this.stylesManager[name];
        return this;
    }
});/**
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
});/**
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
    //注册滚动条
    BI.Plugin.registerWidget("bi.grid_table_scrollbar", function (ob) {
        if (BI.isIE9Below()) {
            return BI.extend(ob, {type: "bi.native_table_scrollbar"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.grid_table_horizontal_scrollbar", function (ob) {
        if (BI.isIE9Below()) {
            return BI.extend(ob, {type: "bi.native_table_horizontal_scrollbar"});
        } else {
            return ob;
        }
    });

    //注册控件
    BI.Plugin.registerWidget("bi.grid_table", function (ob) {
        //非chrome下滚动条滑动效果不好，禁止掉
        if (!(BI.isChrome() && BI.isWindows() && !BI.isEdge())) {
            return BI.extend(ob, {type: "bi.quick_grid_table"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.collection_table", function (ob) {
        //非chrome下滚动条滑动效果不好，禁止掉
        if (!(BI.isChrome() && BI.isWindows() && !BI.isEdge())) {
            return BI.extend(ob, {type: "bi.quick_collection_table"});
        } else {
            return ob;
        }
    });
    //IE8下滚动条用原生的
    if (BI.isIE9Below()) {
        BI.GridTableScrollbar.SIZE = 18;
    }
});