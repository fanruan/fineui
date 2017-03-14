!(function () {
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
})();