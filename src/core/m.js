// BI.M = BI.inherit(BI.OB, {
//     validationError: null,
//
//     _init: function () {
//         BI.M.superclass._init.apply(this, arguments);
//         this.attributes = {};
//         _.extend(this, _.pick(this.options, ['rootURL', 'parent', 'data', 'id']));
//         this.set(this.options);
//         this.changed = {};
//     },
//
//     _validate: function (attrs, options) {
//         if (!options.validate || !this.validate) return true;
//         attrs = _.extend({}, this.attributes, attrs);
//         var error = this.validationError = this.validate(attrs, options) || null;
//         if (!error) return true;
//         this.fireEvent('invalid', error, this, _.extend(options, {validationError: error}));
//         return false;
//     },
//
//     toJSON: function (options) {
//         return _.clone(this.attributes);
//     },
//
//     get: function (attr) {
//         return this.attributes[attr];
//     },
//
//     has: function (attr) {
//         return _.has(this.attributes, attr);
//     },
//
//     matches: function (attrs) {
//         var keys = _.keys(attrs), length = keys.length;
//         var obj = Object(this.attributes);
//         for (var i = 0; i < length; i++) {
//             var key = keys[i];
//             if (!_.isEqual(attrs[key], obj[key]) || !(key in obj)) return false;
//         }
//         return true;
//     },
//
//     set: function (key, val, options) {
//         var attr, attrs, unset, changes, silent, changing, changed, prev, current;
//         if (key == null) return this;
//
//         // Handle both `"key", value` and `{key: value}` -style arguments.
//         if (typeof key === 'object') {
//             attrs = key;
//             options = val;
//         } else {
//             (attrs = {})[key] = val;
//         }
//
//         options || (options = {});
//
//         // Run validation.
//         if (!this._validate(attrs, options)) return false;
//
//         // Extract attributes and options.
//         unset = options.unset;
//         silent = options.silent;
//         changes = [];
//         changing = this._changing;
//         this._changing = true;
//
//         if (!changing) {
//             this._previousAttributes = _.clone(this.attributes);
//             this.changed = {};
//         }
//         current = this.attributes, prev = this._previousAttributes;
//
//         // Check for changes of `id`.
//         if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];
//
//         // For each `set` attribute, update or delete the current value.
//         for (attr in attrs) {
//             val = attrs[attr];
//             if (!_.isEqual(current[attr], val)) changes.push(attr);
//             if (!_.isEqual(prev[attr], val)) {
//                 this.changed[attr] = val;
//             } else {
//                 delete this.changed[attr];
//             }
//             unset ? delete current[attr] : current[attr] = val;
//         }
//
//         // Trigger all relevant attribute changes.
//         if (!silent) {
//             if (changes.length) this._pending = options;
//             for (var i = 0, length = changes.length; i < length; i++) {
//                 this.trigger('change:' + changes[i], this, current[changes[i]], options);
//             }
//         }
//
//         // You might be wondering why there's a `while` loop here. Changes can
//         // be recursively nested within `"change"` events.
//         if (changing) return this;
//         changed = BI.clone(this.changed);
//         if (!silent) {
//             while (this._pending) {
//                 options = this._pending;
//                 this._pending = false;
//                 this.trigger('change', changed, prev, this, options);
//             }
//         }
//         this._pending = false;
//         this._changing = false;
//         if (!silent && changes.length) this.trigger("changed", changed, prev, this, options);
//         return this;
//     },
//
//     unset: function (attr, options) {
//         return this.set(attr, void 0, _.extend({}, options, {unset: true}));
//     },
//
//     clear: function (options) {
//         var attrs = {};
//         for (var key in this.attributes) attrs[key] = void 0;
//         return this.set(attrs, _.extend({}, options, {unset: true}));
//     },
//
//     hasChanged: function (attr) {
//         if (attr == null) return !_.isEmpty(this.changed);
//         return _.has(this.changed, attr);
//     },
//
//     changedAttributes: function (diff) {
//         if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
//         var val, changed = false;
//         var old = this._changing ? this._previousAttributes : this.attributes;
//         for (var attr in diff) {
//             if (_.isEqual(old[attr], (val = diff[attr]))) continue;
//             (changed || (changed = {}))[attr] = val;
//         }
//         return changed;
//     },
//
//     // Get the previous value of an attribute, recorded at the time the last
//     // `"change"` event was fired.
//     previous: function (attr) {
//         if (attr == null || !this._previousAttributes) return null;
//         return this._previousAttributes[attr];
//     },
//
//     // Get all of the attributes of the model at the time of the previous
//     // `"change"` event.
//     previousAttributes: function () {
//         return _.clone(this._previousAttributes);
//     },
//
//     destroy: function (options) {
//         options = options ? _.clone(options) : {};
//         var model = this;
//         var success = options.success;
//
//         var destroy = function () {
//             model.stopListening();
//             model.trigger('destroy', model.collection, model, options);
//         };
//
//         options.success = function (resp) {
//             if (options.wait || model.isNew()) destroy();
//             if (success) success(resp, model, options);
//             if (!model.isNew()) model.trigger('sync', resp, model, options).trigger('delete', resp, model, options);
//         };
//
//         if (this.isNew()) {
//             options.success();
//             return false;
//         }
//         wrapError(this, options);
//
//         var xhr = this.sync('delete', this, options);
//         if (!options.wait) destroy();
//         return xhr;
//     },
// });