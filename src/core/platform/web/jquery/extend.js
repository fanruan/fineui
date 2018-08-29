if(jQuery) {
    BI.extend(jQuery, {

        getLeftPosition: function (combo, popup, extraWidth) {
            return {
                left: combo.element.offset().left - popup.element.outerWidth() - (extraWidth || 0)
            };
        },

        getRightPosition: function (combo, popup, extraWidth) {
            var el = combo.element;
            return {
                left: el.offset().left + el.outerWidth() + (extraWidth || 0)
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
            return $.getLeftPosition(combo, popup, extraWidth).left >= 0;
        },

        isRightSpaceEnough: function (combo, popup, extraWidth) {
            var viewBounds = popup.element.bounds(), windowBounds = $("body").bounds();
            return $.getRightPosition(combo, popup, extraWidth).left + viewBounds.width <= windowBounds.width;
        },

        isTopSpaceEnough: function (combo, popup, extraHeight) {
            return $.getTopPosition(combo, popup, extraHeight).top >= 0;
        },

        isBottomSpaceEnough: function (combo, popup, extraHeight) {
            var viewBounds = popup.element.bounds(), windowBounds = $("body").bounds();
            return $.getBottomPosition(combo, popup, extraHeight).top + viewBounds.height <= windowBounds.height;
        },

        isRightSpaceLarger: function (combo) {
            var windowBounds = $("body").bounds();
            return windowBounds.width - combo.element.offset().left - combo.element.bounds().width >= combo.element.offset().left;
        },

        isBottomSpaceLarger: function (combo) {
            var windowBounds = $("body").bounds();
            return windowBounds.height - combo.element.offset().top - combo.element.bounds().height >= combo.element.offset().top;
        },

        getLeftAlignPosition: function (combo, popup, extraWidth) {
            var viewBounds = popup.element.bounds(), windowBounds = $("body").bounds();
            var left = combo.element.offset().left + extraWidth;
            if (left + viewBounds.width > windowBounds.width) {
                left = windowBounds.width - viewBounds.width;
            }
            if (left < 0) {
                left = 0;
            }
            return {
                left: left
            };
        },

        getLeftAdaptPosition: function (combo, popup, extraWidth) {
            if ($.isLeftSpaceEnough(combo, popup, extraWidth)) {
                return $.getLeftPosition(combo, popup, extraWidth);
            }
            return {
                left: 0
            };
        },

        getRightAlignPosition: function (combo, popup, extraWidth) {
            var comboBounds = combo.element.bounds(), viewBounds = popup.element.bounds();
            var left = combo.element.offset().left + comboBounds.width - viewBounds.width - extraWidth;
            if (left < 0) {
                left = 0;
            }
            return {
                left: left
            };
        },

        getRightAdaptPosition: function (combo, popup, extraWidth) {
            if ($.isRightSpaceEnough(combo, popup, extraWidth)) {
                return $.getRightPosition(combo, popup, extraWidth);
            }
            return {
                left: $("body").bounds().width - popup.element.bounds().width
            };
        },

        getTopAlignPosition: function (combo, popup, extraHeight, needAdaptHeight) {
            var comboOffset = combo.element.offset();
            var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
                windowBounds = $("body").bounds();
            var top, adaptHeight;
            if ($.isBottomSpaceEnough(combo, popup, -1 * comboBounds.height + extraHeight)) {
                top = comboOffset.top + extraHeight;
            } else if (needAdaptHeight) {
                top = comboOffset.top + extraHeight;
                adaptHeight = windowBounds.height - top;
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
                adaptHeight: adaptHeight
            } : {
                top: top
            };
        },

        getTopAdaptPosition: function (combo, popup, extraHeight, needAdaptHeight) {
            var popupBounds = popup.element.bounds(), windowBounds = $("body").bounds();
            if ($.isTopSpaceEnough(combo, popup, extraHeight)) {
                return $.getTopPosition(combo, popup, extraHeight);
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
                windowBounds = $("body").bounds();
            var top, adaptHeight;
            if ($.isTopSpaceEnough(combo, popup, -1 * comboBounds.height + extraHeight)) {
                top = comboOffset.top + comboBounds.height - popupBounds.height - extraHeight;
            } else if (needAdaptHeight) {
                top = 0;
                adaptHeight = comboOffset.top + comboBounds.height - extraHeight;
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
                adaptHeight: adaptHeight
            } : {
                top: top
            };
        },

        getBottomAdaptPosition: function (combo, popup, extraHeight, needAdaptHeight) {
            var comboOffset = combo.element.offset();
            var comboBounds = combo.element.bounds(), popupBounds = popup.element.bounds(),
                windowBounds = $("body").bounds();
            if ($.isBottomSpaceEnough(combo, popup, extraHeight)) {
                return $.getBottomPosition(combo, popup, extraHeight);
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
                windowBounds = $("body").bounds();
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
                windowBounds = $("body").bounds();
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
            var leftRight = [], topBottom = [];
            var isNeedAdaptHeight = false, tbFirst = false, lrFirst = false;
            var left, top, pos;
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
                }
            }
            for (i = 0; i < directions.length; i++) {
                direct = directions[i];
                switch (direct) {
                    case "left":
                        if (!isNeedAdaptHeight) {
                            var tW = tbFirst ? extraHeight : extraWidth, tH = tbFirst ? 0 : extraHeight;
                            if ($.isLeftSpaceEnough(combo, popup, tW)) {
                                left = $.getLeftPosition(combo, popup, tW).left;
                                if (topBottom[0] === "bottom") {
                                    pos = $.getTopAlignPosition(combo, popup, tH, needAdaptHeight);
                                    pos.dir = "left,bottom";
                                } else {
                                    pos = $.getBottomAlignPosition(combo, popup, tH, needAdaptHeight);
                                    pos.dir = "left,top";
                                }
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
                            if ($.isRightSpaceEnough(combo, popup, tW)) {
                                left = $.getRightPosition(combo, popup, tW).left;
                                if (topBottom[0] === "bottom") {
                                    pos = $.getTopAlignPosition(combo, popup, tH, needAdaptHeight);
                                    pos.dir = "right,bottom";
                                } else {
                                    pos = $.getBottomAlignPosition(combo, popup, tH, needAdaptHeight);
                                    pos.dir = "right,top";
                                }
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
                        if ($.isTopSpaceEnough(combo, popup, tH)) {
                            top = $.getTopPosition(combo, popup, tH).top;
                            if (leftRight[0] === "right") {
                                pos = $.getLeftAlignPosition(combo, popup, tW, needAdaptHeight);
                                pos.dir = "top,right";
                            } else {
                                pos = $.getRightAlignPosition(combo, popup, tW);
                                pos.dir = "top,left";
                            }
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
                        if ($.isBottomSpaceEnough(combo, popup, tH)) {
                            top = $.getBottomPosition(combo, popup, tH).top;
                            if (leftRight[0] === "right") {
                                pos = $.getLeftAlignPosition(combo, popup, tW, needAdaptHeight);
                                pos.dir = "bottom,right";
                            } else {
                                pos = $.getRightAlignPosition(combo, popup, tW);
                                pos.dir = "bottom,left";
                            }
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
                }
            }

            switch (directions[0]) {
                case "left":
                case "right":
                    if ($.isRightSpaceLarger(combo)) {
                        left = $.getRightAdaptPosition(combo, popup, extraWidth).left;
                    } else {
                        left = $.getLeftAdaptPosition(combo, popup, extraWidth).left;
                    }
                    if (topBottom[0] === "bottom") {
                        pos = $.getTopAlignPosition(combo, popup, extraHeight, needAdaptHeight);
                        pos.left = left;
                        pos.dir = directions[0] + ",bottom";
                        return pos;
                    }
                    pos = $.getBottomAlignPosition(combo, popup, extraHeight, needAdaptHeight);
                    pos.left = left;
                    pos.dir = directions[0] + ",top";
                    return pos;
                default :
                    if ($.isBottomSpaceLarger(combo)) {
                        pos = $.getBottomAdaptPosition(combo, popup, extraHeight, needAdaptHeight);
                    } else {
                        pos = $.getTopAdaptPosition(combo, popup, extraHeight, needAdaptHeight);
                    }
                    if (leftRight[0] === "right") {
                        left = $.getLeftAlignPosition(combo, popup, extraWidth, needAdaptHeight).left;
                        pos.left = left;
                        pos.dir = directions[0] + ",right";
                        return pos;
                    }
                    left = $.getRightAlignPosition(combo, popup, extraWidth).left;
                    pos.left = left;
                    pos.dir = directions[0] + ",left";
                    return pos;
            }
        },


        getComboPosition: function (combo, popup, extraWidth, extraHeight, needAdaptHeight, directions, offsetStyle) {
            extraWidth || (extraWidth = 0);
            extraHeight || (extraHeight = 0);
            var bodyHeight = $("body").bounds().height - extraHeight;
            var maxHeight = Math.min(popup.attr("maxHeight") || bodyHeight, bodyHeight);
            popup.resetHeight && popup.resetHeight(maxHeight);
            var position = $.getComboPositionByDirections(combo, popup, extraWidth, extraHeight, needAdaptHeight, directions || ["bottom", "top", "right", "left"]);
            switch (offsetStyle) {
                case "center":
                    if (position.change) {
                        var p = $.getMiddleAdaptPosition(combo, popup);
                        position.top = p.top;
                    } else {
                        var p = $.getCenterAdaptPosition(combo, popup);
                        position.left = p.left;
                    }
                    break;
                case "middle":
                    if (position.change) {
                        var p = $.getCenterAdaptPosition(combo, popup);
                        position.left = p.left;
                    } else {
                        var p = $.getMiddleAdaptPosition(combo, popup);
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
}