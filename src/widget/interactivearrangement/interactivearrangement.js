/**
 * 交互行为布局
 *
 *
 * Created by GUY on 2016/7/23.
 * @class BI.InteractiveArrangement
 * @extends BI.Widget
 */
BI.InteractiveArrangement = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.InteractiveArrangement.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-interactive-arrangement",
            resizable: true,
            isNeedReLayout: true,
            isNeedResizeContainer: true,
            layoutType: BI.Arrangement.LAYOUT_TYPE.FREE,
            items: []
        });
    },

    _init: function () {
        BI.InteractiveArrangement.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.arrangement = BI.createWidget({
            type: "bi.adaptive_arrangement",
            element: this,
            resizable: o.resizable,
            isNeedReLayout: o.isNeedReLayout,
            isNeedResizeContainer: o.isNeedResizeContainer,
            layoutType: o.layoutType,
            items: o.items
        });
        this.arrangement.on(BI.AdaptiveArrangement.EVENT_RESIZE, function () {
            self.fireEvent(BI.InteractiveArrangement.EVENT_RESIZE, arguments);
        });

        this.arrangement.on(BI.AdaptiveArrangement.EVENT_ELEMENT_RESIZE, function (id, size) {
            var p = self._getRegionClientPosition(id);
            self.draw({
                left: p.left,
                top: p.top
            }, size, id);
        });
        this.arrangement.on(BI.AdaptiveArrangement.EVENT_ELEMENT_STOP_RESIZE, function (id, size) {
            self.stopDraw();
            self.setRegionSize(id, size);
        });

        this.tags = [];

    },

    _isEqual: function (num1, num2) {
        return this.arrangement._isEqual(num1, num2);
    },

    _getScrollOffset: function () {
        return this.arrangement._getScrollOffset();
    },

    _positionAt: function (position, regions) {
        var self = this;
        regions = regions || this.getAllRegions();
        var left = [], center = [], right = [], top = [], middle = [], bottom = [];
        BI.each(regions, function (i, region) {
            var client = self._getRegionClientPosition(region.id);
            if (Math.abs(client.left - position.left) <= 3) {
                left.push(region);
            }
            if (Math.abs(client.left + client.width / 2 - position.left) <= 3) {
                center.push(region);
            }
            if (Math.abs(client.left + client.width - position.left) <= 3) {
                right.push(region);
            }
            if (Math.abs(client.top - position.top) <= 3) {
                top.push(region);
            }
            if (Math.abs(client.top + client.height / 2 - position.top) <= 3) {
                middle.push(region);
            }
            if (Math.abs(client.top + client.height - position.top) <= 3) {
                bottom.push(region);
            }
        });
        return {
            left: left,
            center: center,
            right: right,
            top: top,
            middle: middle,
            bottom: bottom
        }
    },

    _getRegionClientPosition: function (name) {
        var region = this.getRegionByName(name);
        var offset = this.arrangement._getScrollOffset();
        return {
            top: region.top - offset.top,
            left: region.left - offset.left,
            width: region.width,
            height: region.height,
            id: region.id
        }
    },

    _vAlign: function (position, regions) {
        var self = this;
        var vs = this._positionAt(position, regions);
        var positions = [];
        var l;
        if (vs.left.length > 0) {
            l = this._getRegionClientPosition(vs.left[0].id).left;
        } else if (vs.right.length > 0) {
            var temp = this._getRegionClientPosition(vs.right[0].id);
            l = temp.left + temp.width;
        }
        var rs = vs.left.concat(vs.right);
        BI.each(rs, function (i, region) {
            var p = self._getRegionClientPosition(region.id);
            if (self._isEqual(p.left, l) || self._isEqual(p.left + p.width, l)) {
                var topPoint = {
                    top: p.top + p.height / 2,
                    left: l
                };
                positions.push({
                    id: region.id,
                    start: topPoint,
                    end: {
                        left: l,
                        top: position.top
                    }
                });
            }
        });
        return positions;
    },

    _leftAlign: function (position, size, regions) {
        var self = this;
        return this._vAlign({
            left: position.left,
            top: position.top + size.height / 2
        }, regions);
    },

    _rightAlign: function (position, size, regions) {
        var self = this;
        return this._vAlign({
            left: position.left + size.width,
            top: position.top + size.height / 2
        }, regions);
    },

    _hAlign: function (position, regions) {
        var self = this;
        var hs = this._positionAt(position, regions);
        var positions = [];
        var t;
        if (hs.top.length > 0) {
            var temp = this._getRegionClientPosition(hs.top[0].id);
            t = temp.top;
        } else if (hs.bottom.length > 0) {
            var temp = this._getRegionClientPosition(hs.bottom[0].id);
            t = temp.top + temp.height;
        }
        var rs = hs.top.concat(hs.bottom);
        BI.each(rs, function (i, region) {
            var p = self._getRegionClientPosition(region.id);
            if (self._isEqual(p.top, t) || self._isEqual(p.top + p.height, t)) {
                var leftPoint = {
                    top: t,
                    left: p.left + p.width / 2
                };
                positions.push({
                    id: p.id,
                    start: leftPoint,
                    end: {
                        left: position.left,
                        top: t
                    }
                });
            }
        });
        return positions;
    },

    _topAlign: function (position, size, regions) {
        var self = this;
        return this._hAlign({
            left: position.left + size.width / 2,
            top: position.top
        }, regions);
    },

    _bottomAlign: function (position, size, regions) {
        var self = this;
        return this._hAlign({
            left: position.left + size.width / 2,
            top: position.top + size.height
        }, regions);
    },

    _centerAlign: function (position, size, regions) {
        var self = this;
        var cs = this._positionAt({
            left: position.left + size.width / 2,
            top: position.top + size.height / 2
        }, regions);
        var positions = [];
        var l;
        if (cs.center.length > 0) {
            var temp = this._getRegionClientPosition(cs.center[0].id);
            l = temp.left + temp.width / 2;
        }
        BI.each(cs.center, function (i, region) {
            var p = self._getRegionClientPosition(region.id);
            if (self._isEqual(p.left + p.width / 2, l)) {
                var topPoint = {
                    top: p.top + p.height / 2,
                    left: p.left + p.width / 2
                };
                positions.push({
                    id: p.id,
                    start: topPoint,
                    end: {
                        left: l,
                        top: position.top + size.height / 2
                    }
                });
            }
        });
        return positions;
    },

    _middleAlign: function (position, size, regions) {
        var self = this;
        var cs = this._positionAt({
            left: position.left + size.width / 2,
            top: position.top + size.height / 2
        }, regions);
        var positions = [];
        var t;
        if (cs.middle.length > 0) {
            var temp = this._getRegionClientPosition(cs.middle[0].id);
            t = temp.top + temp.height / 2;
        }
        BI.each(cs.middle, function (i, region) {
            var p = self._getRegionClientPosition(region.id);
            if (self._isEqual(p.top + p.height / 2, t)) {
                var topPoint = {
                    top: p.top + p.height / 2,
                    left: p.left + p.width / 2
                };
                positions.push({
                    id: p.id,
                    start: topPoint,
                    end: {
                        left: position.left + size.width / 2,
                        top: t
                    }
                });
            }
        });
        return positions;
    },


    _drawOneTag: function (start, end) {
        var s = BI.createWidget({
            type: "bi.icon_button",
            //invisible: true,
            width: 13,
            height: 13,
            cls: "drag-tag-font interactive-arrangement-dragtag-icon"
        });
        var e = BI.createWidget({
            type: "bi.icon_button",
            //invisible: true,
            width: 13,
            height: 13,
            cls: "drag-tag-font interactive-arrangement-dragtag-icon"
        });
        if (this._isEqual(start.left, end.left)) {
            var line = BI.createWidget({
                type: "bi.layout",
                //invisible: true,
                cls: "interactive-arrangement-dragtag-line",
                width: 1,
                height: Math.abs(start.top - end.top)
            });
        } else {
            var line = BI.createWidget({
                type: "bi.layout",
                //invisible: true,
                cls: "interactive-arrangement-dragtag-line",
                height: 1,
                width: Math.abs(start.left - end.left)
            });
        }
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: s,
                left: start.left - 6,
                top: start.top - 7
            }, {
                el: e,
                left: end.left - 6,
                top: end.top - 7
            }, {
                el: line,
                left: Math.min(start.left, end.left),
                top: Math.min(start.top, end.top)
            }]
        });
        this.tags.push(s);
        this.tags.push(e);
        this.tags.push(line);
    },

    stopDraw: function () {
        BI.each(this.tags, function (i, w) {
            w.destroy();
        });
        this.tags = [];
    },

    _getRegionExcept: function (name, regions) {
        var other = [];
        BI.each(regions || this.getAllRegions(), function (i, region) {
            if (!(name && region.id === name)) {
                other.push(region);
            }
        });
        return other;
    },

    getClientWidth: function () {
        return this.arrangement.getClientWidth();
    },

    getClientHeight: function () {
        return this.arrangement.getClientHeight();
    },

    getPosition: function (name, position, size) {
        var regions = this.getAllRegions();
        var me;
        if (name) {
            me = this._getRegionClientPosition(name);
        }
        var other = this._getRegionExcept(name, regions);
        position = position || {
                left: me.left,
                top: me.top
            };
        size = size || {
                width: me.width,
                height: me.height
            };
        var left = this._leftAlign(position, size, other);
        var right = this._rightAlign(position, size, other);
        var top = this._topAlign(position, size, other, other);
        var bottom = this._bottomAlign(position, size, other);
        var center = this._centerAlign(position, size, other);
        var middle = this._middleAlign(position, size, other);

        BI.each(center, function (i, pos) {
            position.left = pos.end.left - size.width / 2;
        });
        BI.each(right, function (i, pos) {
            position.left = pos.end.left - size.width;
        });
        BI.each(left, function (i, pos) {
            position.left = pos.end.left;
        });
        BI.each(middle, function (i, pos) {
            position.top = pos.end.top - size.height / 2;
        });
        BI.each(bottom, function (i, pos) {
            position.top = pos.end.top - size.height;
        });
        BI.each(top, function (i, pos) {
            position.top = pos.end.top;
        });
        return position;
    },

    //position不动 变size
    getSize: function (name, position, size) {
        var regions = this.getAllRegions();
        var me;
        if (name) {
            me = this._getRegionClientPosition(name);
        }
        var other = this._getRegionExcept(name, regions);
        position = position || {
                left: me.left,
                top: me.top
            };
        size = size || {
                width: me.width,
                height: me.height
            };
        var left = this._leftAlign(position, size, other);
        var right = this._rightAlign(position, size, other);
        var top = this._topAlign(position, size, other, other);
        var bottom = this._bottomAlign(position, size, other);
        var center = this._centerAlign(position, size, other);
        var middle = this._middleAlign(position, size, other);

        BI.each(center, function (i, pos) {
            size.width = (pos.end.left - position.left) * 2;
        });
        BI.each(right, function (i, pos) {
            size.width = pos.end.left - position.left;
        });
        BI.each(left, function (i, pos) {
        });
        BI.each(middle, function (i, pos) {
            size.height = (pos.end.top - position.top) * 2;
        });
        BI.each(bottom, function (i, pos) {
            size.height = pos.end.top - position.top;
        });
        BI.each(top, function (i, pos) {
        });
        return size;
    },

    draw: function (position, size, name) {
        var self = this;
        this.stopDraw();
        switch (this.getLayoutType()) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                var other = this._getRegionExcept(name);
                var left = this._leftAlign(position, size, other);
                var right = this._rightAlign(position, size, other);
                var top = this._topAlign(position, size, other);
                var bottom = this._bottomAlign(position, size, other);
                var center = this._centerAlign(position, size, other);
                var middle = this._middleAlign(position, size, other);

                BI.each(center, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(right, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(left, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(middle, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(bottom, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(top, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                break;
        }
    },

    getDirectRelativeRegions: function (name, direction) {
        return this.arrangement.getDirectRelativeRegions(name, direction);
    },

    addRegion: function (region, position) {
        this.stopDraw();
        return this.arrangement.addRegion(region, position);
    },

    deleteRegion: function (name) {
        return this.arrangement.deleteRegion(name);
    },

    setRegionSize: function (name, size) {
        size = this.getSize(name, null, size);
        return this.arrangement.setRegionSize(name, size);
    },

    setPosition: function (position, size) {
        var self = this;
        this.stopDraw();
        if (position.left > 0 && position.top > 0) {
            switch (this.getLayoutType()) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    position = this.getPosition(null, position, size);
                    this.draw(position, size);
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    break;
            }
        }
        var at = this.arrangement.setPosition(position, size);
        return at;
    },

    setRegionPosition: function (name, position) {
        if (position.left > 0 && position.top > 0) {
            switch (this.getLayoutType()) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    position = this.getPosition(name, position);
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    break;
            }
        }
        return this.arrangement.setRegionPosition(name, position);
    },

    zoom: function (ratio) {
        this.arrangement.zoom(ratio);
    },

    resize: function () {
        return this.arrangement.resize();
    },

    relayout: function () {
        return this.arrangement.relayout();
    },

    setLayoutType: function (type) {
        this.arrangement.setLayoutType(type);
    },

    getLayoutType: function () {
        return this.arrangement.getLayoutType();
    },

    getLayoutRatio: function () {
        return this.arrangement.getLayoutRatio();
    },

    getHelper: function () {
        return this.arrangement.getHelper();
    },

    getRegionByName: function (name) {
        return this.arrangement.getRegionByName(name);
    },

    getAllRegions: function () {
        return this.arrangement.getAllRegions();
    },

    revoke: function () {
        return this.arrangement.revoke();
    },

    populate: function (items) {
        var self = this;
        this.arrangement.populate(items);
    }
});
BI.InteractiveArrangement.EVENT_RESIZE = "InteractiveArrangement.EVENT_RESIZE";
BI.shortcut('bi.interactive_arrangement', BI.InteractiveArrangement);