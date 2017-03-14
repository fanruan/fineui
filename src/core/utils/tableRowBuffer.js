;
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
