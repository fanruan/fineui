!(function () {
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
})();