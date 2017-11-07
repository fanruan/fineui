BI.CellSizeAndPositionManager = function (cellCount, cellSizeGetter, estimatedCellSize) {
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
};