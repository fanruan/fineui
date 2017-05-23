/*!
 * jLayout JQuery Plugin v0.11
 *
 * Licensed under the revised BSD License.
 * Copyright 2008, Bram Stein
 * All rights reserved.
 */
if (jQuery) {
    (function ($) {
        // richer:容器在其各个边缘留出的空间
        if (!$.fn.insets) {
            $.fn.insets = function () {
                var p = this.padding(),
                    b = this.border();
                return {
                    'top': p.top,
                    'bottom': p.bottom + b.bottom + b.top,
                    'left': p.left,
                    'right': p.right + b.right + b.left
                };
            };
        }

        // richer:获取 && 设置jQuery元素的边界
        if (!$.fn.bounds) {
            $.fn.bounds = function (value) {
                var tmp = {hasIgnoredBounds: true};

                if (value) {
                    if (!isNaN(value.x)) {
                        tmp.left = value.x;
                    }
                    if (!isNaN(value.y)) {
                        tmp.top = value.y;
                    }
                    if (value.width != null) {
                        tmp.width = (value.width - (this.outerWidth(true) - this.width()));
                        tmp.width = (tmp.width >= 0) ? tmp.width : value.width;
                        // fix chrome
                        //tmp.width = (tmp.width >= 0) ? tmp.width : 0;
                    }
                    if (value.height != null) {
                        tmp.height = value.height - (this.outerHeight(true) - this.height());
                        tmp.height = (tmp.height >= 0) ? tmp.height : value.height;
                        // fix chrome
                        //tmp.height = (tmp.height >= 0) ? tmp.height : value.0;
                    }
                    this.css(tmp);
                    return this;
                }
                else {
                    // richer:注意此方法只对可见元素有效
                    tmp = this.position();
                    return {
                        'x': tmp.left,
                        'y': tmp.top,
                        // richer:这里计算外部宽度和高度的时候，都不包括边框
                        'width': this.outerWidth(),
                        'height': this.outerHeight()
                    };
                }
            };
        }
    })(jQuery);
}
;