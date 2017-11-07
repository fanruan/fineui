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
