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
})();