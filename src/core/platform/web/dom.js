/**
 * 对DOM操作的通用函数
 * @type {{}}
 */
!(function () {
    BI.DOM = BI.DOM || {};

    BI.extend(BI.DOM, {
        ready: function (fn) {
            BI.Widget._renderEngine.createElement(document).ready(fn);
        }
    });

    BI.extend(BI.DOM, {

        patchProps: function (fromElement, toElement) {
            var elemData = BI.jQuery._data(fromElement[0]);
            var events = elemData.events;
            BI.each(events, function (eventKey, event) {
                BI.each(event, function (i, handler) {
                    toElement.on(eventKey + (handler.namespace ? ("." + handler.namespace) : ""), handler);
                });
            });
            var fromChildren = fromElement.children(), toChildren = toElement.children();
            if (fromChildren.length !== toChildren.length) {
                throw new Error("不匹配");
            }
            BI.each(fromChildren, function (i, child) {
                BI.DOM.patchProps(BI.jQuery(child), BI.jQuery(toChildren[i]));
            });
            BI.each(fromElement.data("__widgets"), function (i, widget) {
                widget.element = toElement;
            });
        },
        /**
         * 把dom数组或元素悬挂起来,使其不对html产生影响
         * @param dom
         */
        hang: function (doms) {
            if (BI.isEmpty(doms)) {
                return;
            }
            var frag = BI.Widget._renderEngine.createFragment();
            BI.each(doms, function (i, dom) {
                dom instanceof BI.Widget && (dom = dom.element);
                dom instanceof BI.$ && dom[0] && frag.appendChild(dom[0]);
            });
            return frag;
        },

        isExist: function (obj) {
            return BI.Widget._renderEngine.createElement("body").find(obj.element).length > 0;
        },

        // 预加载图片
        preloadImages: function (srcArray, onload) {
            var count = 0, images = [];

            function complete () {
                count++;
                if (count >= srcArray.length) {
                    onload();
                }
            }

            BI.each(srcArray, function (i, src) {
                images[i] = new Image();
                images[i].src = src;
                images[i].onload = function () {
                    complete();
                };
                images[i].onerror = function () {
                    complete();
                };
            });
        },

        getTextSizeWidth: function (text, fontSize) {
            var span = BI.Widget._renderEngine.createElement("<span></span>").addClass("text-width-span").appendTo("body");

            if (fontSize == null) {
                fontSize = 12;
            }
            fontSize = fontSize + "px";

            span.css("font-size", fontSize).text(text);

            var width = span.width();
            span.remove();

            return width;
        },

        getTextSizeHeight: function (text, fontSize) {
            var span = BI.Widget._renderEngine.createElement("<span></span>").addClass("text-width-span").appendTo("body");

            if (fontSize == null) {
                fontSize = 12;
            }
            fontSize = fontSize + "px";

            span.css("font-size", fontSize).text(text);

            var height = span.height();
            span.remove();

            return height;
        },

        // 获取滚动条的宽度，页面display: none时候获取到的为0
        getScrollWidth: function () {
            if (BI.isNull(this._scrollWidth) || this._scrollWidth === 0) {
                var ul = BI.Widget._renderEngine.createElement("<div>").width(50).height(50).css({
                    position: "absolute",
                    top: "-9999px",
                    overflow: "scroll"
                }).appendTo("body");
                this._scrollWidth = ul[0].offsetWidth - ul[0].clientWidth;
                ul.destroy();
            }
            return this._scrollWidth;
        },

        getImage: function (param, fillStyle, backgroundColor) {
            var canvas = document.createElement("canvas");
            var ratio = 2;
            BI.Widget._renderEngine.createElement("body").append(canvas);

            var ctx = canvas.getContext("2d");
            ctx.font = "12px Helvetica Neue,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Heiti,黑体,sans-serif";
            var w = ctx.measureText(param).width + 4;
            canvas.width = w * ratio;
            canvas.height = 16 * ratio;
            ctx.font = 12 * ratio + "px Helvetica Neue,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Heiti,黑体,sans-serif";
            ctx.fillStyle = fillStyle || "#3685f2";
            ctx.textBaseline = "middle";
            // ctx.fillStyle = "#EAF2FD";
            ctx.fillText(param, 2 * ratio, 9 * ratio);
            BI.Widget._renderEngine.createElement(canvas).destroy();
            var backColor = backgroundColor || "rgba(54, 133, 242, 0.1)";
            // IE可以放大缩小所以要固定最大最小宽高
            return {
                width: w,
                height: 16,
                src: canvas.toDataURL("image/png"),
                style: "background-color: " + backColor + ";vertical-align: middle; margin: 0 1px; width:" + w + "px;height: 16px; max-width:" + w + "px;max-height: 16px; min-width:" + w + "px;min-height: 16px",
                param: param
            };
        }
    });

    BI.extend(BI.DOM, {

        getLeftPosition: function (combo, popup, extraWidth) {
            return {
                left: combo.element.offset().left - popup.element.outerWidth() - (extraWidth || 0)
            };
        },

        getInnerLeftPosition: function (combo, popup, extraWidth) {
            return {
                left: combo.element.offset().left + (extraWidth || 0)
            };
        },

        getRightPosition: function (combo, popup, extraWidth) {
            var el = combo.element;
            return {
                left: el.offset().left + el.outerWidth() + (extraWidth || 0)
            };
        },

        getInnerRightPosition: function (combo, popup, extraWidth) {
            var el = combo.element, viewBounds = popup.element.bounds();
            return {
                left: el.offset().left + el.outerWidth() - viewBounds.width - (extraWidth || 0)
            };
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
            return BI.DOM.getLeftPosition(combo, popup, extraWidth).left >= 0;
        },

        isInnerLeftSpaceEnough: function (combo, popup, extraWidth) {
            var viewBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            return BI.DOM.getInnerLeftPosition(combo, popup, extraWidth).left + viewBounds.width <= windowBounds.width;
        },

        isRightSpaceEnough: function (combo, popup, extraWidth) {
            var viewBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            return BI.DOM.getRightPosition(combo, popup, extraWidth).left + viewBounds.width <= windowBounds.width;
        },

        isInnerRightSpaceEnough: function (combo, popup, extraWidth) {
            return BI.DOM.getInnerRightPosition(combo, popup, extraWidth).left >= 0;
        },

        isTopSpaceEnough: function (combo, popup, extraHeight) {
            return BI.DOM.getTopPosition(combo, popup, extraHeight).top >= 0;
        },

        isBottomSpaceEnough: function (combo, popup, extraHeight) {
            var viewBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            return BI.DOM.getBottomPosition(combo, popup, extraHeight).top + viewBounds.height <= windowBounds.height;
        },

        isRightSpaceLarger: function (combo) {
            var windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            return windowBounds.width - combo.element.offset().left - combo.element.bounds().width >= combo.element.offset().left;
        },

        isBottomSpaceLarger: function (combo) {
            var windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            return windowBounds.height - combo.element.offset().top - combo.element.bounds().height >= combo.element.offset().top;
        },

        _getLeftAlignPosition: function (combo, popup, extraWidth) {
            var viewBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            var left = combo.element.offset().left + extraWidth;
            if (left + viewBounds.width > windowBounds.width) {
                left = windowBounds.width - viewBounds.width;
            }
            return left;
        },

        getLeftAlignPosition: function (combo, popup, extraWidth) {
            var left = this._getLeftAlignPosition(combo, popup, extraWidth);
            var dir = "";
            // 如果放不下，优先使用RightAlign, 如果RightAlign也放不下, 再使用left=0
            if (left < 0) {
                left = this._getRightAlignPosition(combo, popup, extraWidth);
                dir = "left";
            }
            if (left < 0) {
                left = 0;
            }
            return {
                left: left,
                dir: dir || "right"
            };
        },

        getLeftAdaptPosition: function (combo, popup, extraWidth) {
            if (BI.DOM.isLeftSpaceEnough(combo, popup, extraWidth)) {
                return BI.DOM.getLeftPosition(combo, popup, extraWidth);
            }
            return {
                left: 0
            };
        },

        _getRightAlignPosition: function (combo, popup, extraWidth) {
            var comboBounds = combo.element.bounds(), viewBounds = popup.element.bounds();
            return combo.element.offset().left + comboBounds.width - viewBounds.width - extraWidth;
        },

        getRightAlignPosition: function (combo, popup, extraWidth) {
            var left = this._getRightAlignPosition(combo, popup, extraWidth);
            var dir = "";
            // 如果放不下，优先使用LeftAlign, 如果LeftAlign也放不下, 再使用left=0
            if (left < 0) {
                left = this._getLeftAlignPosition(combo, popup, extraWidth);
                dir = "right";
            }
            if (left < 0) {
                left = 0;
            }
            return {
                left: left,
                dir: dir || "left"
            };
        },

        getRightAdaptPosition: function (combo, popup, extraWidth) {
            if (BI.DOM.isRightSpaceEnough(combo, popup, extraWidth)) {
                return BI.DOM.getRightPosition(combo, popup, extraWidth);
            }
            return {
                left: BI.Widget._renderEngine.createElement("body").bounds().width - popup.element.bounds().width
            };
        },

        getTopAlignPosition: function (combo, popup, extraHeight, needAdaptHeight) {
            var comboOffset = combo.element.offset();
            var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            var top, adaptHeight, dir;
            if (BI.DOM.isBottomSpaceEnough(combo, popup, -1 * comboBounds.height + extraHeight)) {
                top = comboOffset.top + extraHeight;
            } else if (needAdaptHeight) {
                top = comboOffset.top + extraHeight;
                adaptHeight = windowBounds.height - top;
            } else if (BI.DOM.isTopSpaceEnough(combo, popup, -1 * comboBounds.height + extraHeight)) {
                // 下方空间不足且不允许调整高度的情况下，优先使用上对齐
                top = comboOffset.top + comboBounds.height - popupBounds.height - extraHeight;
                dir = "top";
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
                adaptHeight: adaptHeight,
                dir: dir || "bottom"
            } : {
                top: top,
                dir: dir || "bottom"
            };
        },

        getTopAdaptPosition: function (combo, popup, extraHeight, needAdaptHeight) {
            var popupBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            if (BI.DOM.isTopSpaceEnough(combo, popup, extraHeight)) {
                return BI.DOM.getTopPosition(combo, popup, extraHeight);
            }
            if (needAdaptHeight) {
                return {
                    top: 0,
                    adaptHeight: combo.element.offset().top - extraHeight
                };
            }
            if (popupBounds.height + extraHeight > windowBounds.height) {
                return {
                    top: 0,
                    adaptHeight: windowBounds.height - extraHeight
                };
            }
            return {
                top: 0
            };
        },

        getBottomAlignPosition: function (combo, popup, extraHeight, needAdaptHeight) {
            var comboOffset = combo.element.offset();
            var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            var top, adaptHeight, dir;
            if (BI.DOM.isTopSpaceEnough(combo, popup, -1 * comboBounds.height + extraHeight)) {
                top = comboOffset.top + comboBounds.height - popupBounds.height - extraHeight;
            } else if (needAdaptHeight) {
                top = 0;
                adaptHeight = comboOffset.top + comboBounds.height - extraHeight;
            } else if (BI.DOM.isBottomSpaceEnough(combo, popup, -1 * comboBounds.height + extraHeight)) {
                // 上方空间不足且不允许调整高度的情况下，优先使用下对齐
                top = comboOffset.top + extraHeight;
                dir = "bottom";
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
                adaptHeight: adaptHeight,
                dir: dir || "top"
            } : {
                top: top,
                dir: dir || "top"
            };
        },

        getBottomAdaptPosition: function (combo, popup, extraHeight, needAdaptHeight) {
            var comboOffset = combo.element.offset();
            var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
            if (BI.DOM.isBottomSpaceEnough(combo, popup, extraHeight)) {
                return BI.DOM.getBottomPosition(combo, popup, extraHeight);
            }
            if (needAdaptHeight) {
                return {
                    top: comboOffset.top + comboBounds.height + extraHeight,
                    adaptHeight: windowBounds.height - comboOffset.top - comboBounds.height - extraHeight
                };
            }
            if (popupBounds.height + extraHeight > windowBounds.height) {
                return {
                    top: extraHeight,
                    adaptHeight: windowBounds.height - extraHeight
                };
            }
            return {
                top: windowBounds.height - popupBounds.height - extraHeight
            };
        },

        getCenterAdaptPosition: function (combo, popup) {
            var comboOffset = combo.element.offset();
            var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
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
            };
        },

        getMiddleAdaptPosition: function (combo, popup) {
            var comboOffset = combo.element.offset();
            var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
                windowBounds = BI.Widget._renderEngine.createElement("body").bounds();
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
            };
        },

        getComboPositionByDirections: function (combo, popup, extraWidth, extraHeight, needAdaptHeight, directions) {
            extraWidth || (extraWidth = 0);
            extraHeight || (extraHeight = 0);
            var i, direct;
            var leftRight = [], topBottom = [], innerLeftRight = [];
            var isNeedAdaptHeight = false, tbFirst = false, lrFirst = false;
            var left, top, pos, firstDir = directions[0];
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
                    case "innerLeft":
                        innerLeftRight.push(direct);
                        break;
                    case "innerRight":
                        innerLeftRight.push(direct);
                        break;
                }
            }
            for (i = 0; i < directions.length; i++) {
                direct = directions[i];
                switch (direct) {
                    case "left":
                        if (!isNeedAdaptHeight) {
                            var tW = tbFirst ? extraHeight : extraWidth, tH = tbFirst ? 0 : extraHeight;
                            if (BI.DOM.isLeftSpaceEnough(combo, popup, tW)) {
                                left = BI.DOM.getLeftPosition(combo, popup, tW).left;
                                if (topBottom[0] === "bottom") {
                                    pos = BI.DOM.getTopAlignPosition(combo, popup, tH, needAdaptHeight);
                                } else {
                                    pos = BI.DOM.getBottomAlignPosition(combo, popup, tH, needAdaptHeight);
                                }
                                pos.dir = "left," + pos.dir;
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
                            if (BI.DOM.isRightSpaceEnough(combo, popup, tW)) {
                                left = BI.DOM.getRightPosition(combo, popup, tW).left;
                                if (topBottom[0] === "bottom") {
                                    pos = BI.DOM.getTopAlignPosition(combo, popup, tH, needAdaptHeight);
                                } else {
                                    pos = BI.DOM.getBottomAlignPosition(combo, popup, tH, needAdaptHeight);
                                }
                                pos.dir = "right," + pos.dir;
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
                        if (BI.DOM.isTopSpaceEnough(combo, popup, tH)) {
                            top = BI.DOM.getTopPosition(combo, popup, tH).top;
                            if (leftRight[0] === "right") {
                                pos = BI.DOM.getLeftAlignPosition(combo, popup, tW, needAdaptHeight);
                            } else {
                                pos = BI.DOM.getRightAlignPosition(combo, popup, tW);
                            }
                            pos.dir = "top," + pos.dir;
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
                        if (BI.DOM.isBottomSpaceEnough(combo, popup, tH)) {
                            top = BI.DOM.getBottomPosition(combo, popup, tH).top;
                            if (leftRight[0] === "right") {
                                pos = BI.DOM.getLeftAlignPosition(combo, popup, tW, needAdaptHeight);
                            } else {
                                pos = BI.DOM.getRightAlignPosition(combo, popup, tW);
                            }
                            pos.dir = "bottom," + pos.dir;
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
                    case "innerLeft":
                        if (!isNeedAdaptHeight) {
                            var tW = tbFirst ? extraHeight : extraWidth, tH = tbFirst ? 0 : extraHeight;
                            if (BI.DOM.isInnerLeftSpaceEnough(combo, popup, tW)) {
                                left = BI.DOM.getInnerLeftPosition(combo, popup, tW).left;
                                if (topBottom[0] === "bottom") {
                                    pos = BI.DOM.getTopAlignPosition(combo, popup, tH, needAdaptHeight);
                                } else {
                                    pos = BI.DOM.getBottomAlignPosition(combo, popup, tH, needAdaptHeight);
                                }
                                pos.dir = "innerLeft," + pos.dir;
                                if (tbFirst) {
                                    pos.change = "innerLeft";
                                }
                                pos.left = left;
                                return pos;
                            }
                        }
                        lrFirst = true;
                        break;
                    case "innerRight":
                        if (!isNeedAdaptHeight) {
                            var tW = tbFirst ? extraHeight : extraWidth, tH = tbFirst ? extraWidth : extraHeight;
                            if (BI.DOM.isInnerRightSpaceEnough(combo, popup, tW)) {
                                left = BI.DOM.getInnerRightPosition(combo, popup, tW).left;
                                if (topBottom[0] === "bottom") {
                                    pos = BI.DOM.getTopAlignPosition(combo, popup, tH, needAdaptHeight);
                                } else {
                                    pos = BI.DOM.getBottomAlignPosition(combo, popup, tH, needAdaptHeight);
                                }
                                pos.dir = "innerLeft," + pos.dir;
                                if (tbFirst) {
                                    pos.change = "innerRight";
                                }
                                pos.left = left;
                                return pos;
                            }
                        }
                        break;

                }
            }

            // 此处为四个方向放不下时挑空间最大的方向去放置, 也就是说我设置了弹出方向为"bottom,left",
            // 最后发现实际弹出方向可能是"top,left"，那么此时外界获取popup的方向应该是"top,left"
            switch (directions[0]) {
                case "left":
                case "right":
                    if (BI.DOM.isRightSpaceLarger(combo)) {
                        left = BI.DOM.getRightAdaptPosition(combo, popup, extraWidth).left;
                        firstDir = "right";
                    } else {
                        left = BI.DOM.getLeftAdaptPosition(combo, popup, extraWidth).left;
                        firstDir = "left";
                    }
                    if (topBottom[0] === "bottom") {
                        pos = BI.DOM.getTopAlignPosition(combo, popup, extraHeight, needAdaptHeight);
                        pos.left = left;
                        pos.dir = firstDir + "," + pos.dir;
                        return pos;
                    }
                    pos = BI.DOM.getBottomAlignPosition(combo, popup, extraHeight, needAdaptHeight);
                    pos.left = left;
                    pos.dir = firstDir + "," + pos.dir;
                    return pos;
                default :
                    if (BI.DOM.isBottomSpaceLarger(combo)) {
                        top = BI.DOM.getBottomAdaptPosition(combo, popup, extraHeight, needAdaptHeight).top;
                        firstDir = "bottom";
                    } else {
                        top = BI.DOM.getTopAdaptPosition(combo, popup, extraHeight, needAdaptHeight).top;
                        firstDir = "top";
                    }
                    if (leftRight[0] === "right") {
                        pos = BI.DOM.getLeftAlignPosition(combo, popup, extraWidth, needAdaptHeight);
                        pos.top = top;
                        pos.dir = firstDir + "," + pos.dir;
                        return pos;
                    }
                    pos = BI.DOM.getRightAlignPosition(combo, popup, extraWidth);
                    pos.top = top;
                    pos.dir = firstDir + "," + pos.dir;
                    return pos;
            }
        },


        getComboPosition: function (combo, popup, extraWidth, extraHeight, needAdaptHeight, directions, offsetStyle) {
            extraWidth || (extraWidth = 0);
            extraHeight || (extraHeight = 0);
            var bodyHeight = BI.Widget._renderEngine.createElement("body").bounds().height - extraHeight;
            var maxHeight = Math.min(popup.attr("maxHeight") || bodyHeight, bodyHeight);
            popup.resetHeight && popup.resetHeight(maxHeight);
            var position = BI.DOM.getComboPositionByDirections(combo, popup, extraWidth, extraHeight, needAdaptHeight, directions || ["bottom", "top", "right", "left"]);
            switch (offsetStyle) {
                case "center":
                    if (position.change) {
                        var p = BI.DOM.getMiddleAdaptPosition(combo, popup);
                        position.top = p.top;
                    } else {
                        var p = BI.DOM.getCenterAdaptPosition(combo, popup);
                        position.left = p.left;
                    }
                    break;
                case "middle":
                    if (position.change) {
                        var p = BI.DOM.getCenterAdaptPosition(combo, popup);
                        position.left = p.left;
                    } else {
                        var p = BI.DOM.getMiddleAdaptPosition(combo, popup);
                        position.top = p.top;
                    }
                    break;
            }
            if (needAdaptHeight === true) {
                popup.resetHeight && popup.resetHeight(Math.min(bodyHeight - position.top, maxHeight));
            }
            return position;
        }
    });
})();
