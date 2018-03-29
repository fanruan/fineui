/**
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
        var view = new (this.parsePath(viewFunc)(window))(_.extend({}, vData, {
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

    // Create local references to array methods we'll want to use later.
    var array = [];
    var slice = array.slice;

    // For BI's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
    // the `$` variable.
    BI.$ = $;

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
    var Events = {

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
            changed = _.clone(this.changed);
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
            this.$el = el instanceof BI.$ ? el : (BI.isWidget(el) ? el.element : BI.$(el));
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
    BI.ajax = BI.ajax || $.ajax;

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
BI.WRouter = BI.inherit(BI.Router, {
    add: function (route, callback) {
        this.handlers || (this.handlers = []);
        this.handlers.unshift({route: route, callback: callback})
    },

    route: function (route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];
        var self = this;
        this.add(route, function (fragment) {
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

    execute: function (callback, args, name) {
        if (callback) return callback.apply(this, args);
        return name;
    },

    get: function (fragment) {
        var result = null;
        _.some(this.handlers, function (handler) {
            if (handler.route.test(fragment)) {
                result = handler.callback(fragment);
                return true;
            }
        });
        return result;
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
        return BI.isFunction(sta[attr]) ? sta[attr].apply(this, Array.prototype.slice.apply(arguments, [1])) : sta[attr];
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

    createView: function (url, modelData, viewData, context) {
        return BI.Factory.createView(url, this.get(url), modelData, viewData, context);
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
            var view = this.createView(this.rootURL + "/" + cardName, data, viewData, this);
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
});

BI.View.registerVMRouter = function (viewRouter, modelRouter) {
    //配置View
    BI.View.createView = BI.View.prototype.createView = function (url, modelData, viewData, context) {
        return BI.Factory.createView(url, viewRouter.get(url), _.extend({}, modelRouter.get(url), modelData), viewData || {}, context);
    };
};/**
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
 * 有确定取消按钮的弹出层
 * @class BI.BarFloatSection
 * @extends BI.FloatSection
 * @abstract
 */
BI.BarFloatSection = BI.inherit(BI.FloatSection, {
    _defaultConfig: function () {
        return BI.extend(BI.BarFloatSection.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText(BI.i18nText("BI-Basic_Sure")), BI.i18nText("BI-Basic_Cancel")]
        })
    },

    _init: function () {
        BI.BarFloatSection.superclass._init.apply(this, arguments);
        var self = this;
        var flatten = ["_init", "_defaultConfig", "_vessel", "_render", "getName", "listenEnd", "local", "refresh", "load", "change"];
        flatten = BI.makeObject(flatten, true);
        BI.each(this.constructor.caller.caller.caller.caller.prototype, function (key) {
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

    rebuildSouth: function (south) {
        var self = this, o = this.options;
        this.sure = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[0],
            height: 30,
            value: 0,
            handler: function (v) {
                self.end();
                self.close(v);
            }
        });
        this.cancel = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[1],
            height: 30,
            value: 1,
            level: 'ignore',
            handler: function (v) {
                self.close(v);
            }
        });
        BI.createWidget({
            type: 'bi.right_vertical_adapt',
            element: south,
            hgap: 5,
            items: [this.cancel, this.sure]
        });
    }
});
/**
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
});BI.Fix = {
    version: "1.0"
};