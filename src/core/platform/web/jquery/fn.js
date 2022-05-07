if (BI.jQuery) {
    (function ($) {
        // richer:容器在其各个边缘留出的空间
        if (!$.fn.insets) {
            $.fn.insets = function () {
                var p = this.padding(),
                    b = this.border();
                return {
                    top: p.top,
                    bottom: p.bottom + b.bottom + b.top,
                    left: p.left,
                    right: p.right + b.right + b.left
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
                        // tmp.width = (tmp.width >= 0) ? tmp.width : 0;
                    }
                    if (value.height != null) {
                        tmp.height = value.height - (this.outerHeight(true) - this.height());
                        tmp.height = (tmp.height >= 0) ? tmp.height : value.height;
                        // fix chrome
                        // tmp.height = (tmp.height >= 0) ? tmp.height : value.0;
                    }
                    this.css(tmp);
                    return this;
                }

                // richer:注意此方法只对可见元素有效
                tmp = this.position();
                return {
                    x: tmp.left,
                    y: tmp.top,
                    // richer:这里计算外部宽度和高度的时候，都不包括边框
                    width: this.outerWidth(),
                    height: this.outerHeight()
                };

            };
        }
    })(BI.jQuery);

    BI.extend(BI.jQuery.fn, {

        destroy: function () {
            this.remove();
            if (BI.isIE() === true) {
                this[0].outerHTML = "";
            }
        },
        /**
         * 高亮显示
         * @param text 必需
         * @param keyword
         * @param py
         * @returns {*}
         * @private
         * 原理:
         * 1、得到text的拼音py, 分别看是否匹配关键字keyword, 得到匹配索引tidx和pidx
         * 2、比较tidx和pidx, 取大于-1且较小的索引，标红[索引，索引 + keyword.length - 1]的文本
         * 3、text和py各自取tidx/pidx + keyword.length索引开始的子串作为新的text和py, 重复1, 直到text和py有一个为""
         */
        __textKeywordMarked__: function (text, keyword, py) {
            if (BI.isNull(text)) {
                text = "";
            }
            if (!BI.isKey(keyword) || (text + "").length > 100) {
                if (BI.isIE9Below()) {
                    return this.html(BI.htmlEncode(text));
                }
                // textContent性能更好,并且原生防xss
                this[0].textContent = text;
                return this;
            }
            keyword = keyword + "";
            keyword = BI.toUpperCase(keyword);
            var textLeft = text + "";
            py = (py || BI.makeFirstPY(text, {
                splitChar: "\u200b"
            })) + "";
            py = BI.toUpperCase(py);
            this.empty();
            // BI-48487 性能: makeFirstPY出来的py中包含多音字是必要的，但虽然此方法中做了限制。但是对于一个长度为60,包含14个多音字的字符串
            // 获取的的py长度将达到1966080, 远超过text的长度，到后面都是在做"".substring的无用功，所以此循环应保证py和textLeft长度不为0
            while (py.length > 0 && textLeft.length > 0) {
                var tidx = BI.toUpperCase(textLeft).indexOf(keyword);
                var pidx = py.indexOf(keyword);
                if (pidx >= 0) {
                    pidx = (pidx - Math.floor(pidx / (textLeft.length + 1))) % textLeft.length;
                }

                // BI-56945 场景: 对'啊a'标红, a为keyword, 此时tidx为1, pidx为0, 此时使用tidx显然'啊'就无法标红了
                if (tidx >= 0 && (pidx > tidx || pidx === -1)) {
                    // 标红的text未encode
                    this.append(BI.htmlEncode(textLeft.substr(0, tidx)));
                    this.append(BI.$("<span>").addClass("bi-keyword-red-mark")
                        .html(BI.htmlEncode(textLeft.substr(tidx, keyword.length))));

                    textLeft = textLeft.substr(tidx + keyword.length);
                    if (BI.isNotEmptyString(py)) {
                        // 每一组拼音都应该前进，而不是只是当前的
                        py = BI.map(py.split("\u200b"), function (idx, ps) {
                            return ps.slice(tidx + keyword.length);
                        }).join("\u200b");
                    }
                } else if (pidx >= 0) {
                    // BI-56386 这边两个pid / text.length是为了防止截取的首字符串不是完整的，但光这样做还不够，即时错位了，也不能说明就不符合条件
                    // 标红的text未encode
                    this.append(BI.htmlEncode(textLeft.substr(0, pidx)));
                    this.append(BI.$("<span>").addClass("bi-keyword-red-mark")
                        .html(BI.htmlEncode(textLeft.substr(pidx, keyword.length))));
                    if (BI.isNotEmptyString(py)) {
                        // 每一组拼音都应该前进，而不是只是当前的
                        py = BI.map(py.split("\u200b"), function (idx, ps) {
                            return ps.slice(pidx + keyword.length);
                        }).join("\u200b");
                    }
                    textLeft = textLeft.substr(pidx + keyword.length);
                } else {
                    // 标红的text未encode
                    this.append(BI.htmlEncode(textLeft));
                    break;
                }
            }

            return this;
        },

        getDomHeight: function (parent) {
            var clone = BI.$(this).clone();
            clone.appendTo(BI.$(parent || "body"));
            var height = clone.height();
            clone.remove();
            return height;
        },

        // 是否有竖直滚动条
        hasVerticalScroll: function () {
            return this.height() > 0 && this[0].clientWidth < this[0].offsetWidth;
        },

        // 是否有水平滚动条
        hasHorizonScroll: function () {
            return this.width() > 0 && this[0].clientHeight < this[0].offsetHeight;
        },

        // 获取计算后的样式
        getStyle: function (name) {
            var node = this[0];
            var computedStyle = void 0;

            // W3C Standard
            if (_global.getComputedStyle) {
                // In certain cases such as within an iframe in FF3, this returns null.
                computedStyle = _global.getComputedStyle(node, null);
                if (computedStyle) {
                    return computedStyle.getPropertyValue(BI.hyphenate(name));
                }
            }
            // Safari
            if (document.defaultView && document.defaultView.getComputedStyle) {
                computedStyle = document.defaultView.getComputedStyle(node, null);
                // A Safari bug causes this to return null for `display: none` elements.
                if (computedStyle) {
                    return computedStyle.getPropertyValue(BI.hyphenate(name));
                }
                if (name === "display") {
                    return "none";
                }
            }
            // Internet Explorer
            if (node.currentStyle) {
                if (name === "float") {
                    return node.currentStyle.cssFloat || node.currentStyle.styleFloat;
                }
                return node.currentStyle[BI.camelize(name)];
            }
            return node.style && node.style[BI.camelize(name)];
        },

        __isMouseInBounds__: function (e) {
            var offset2Body = this.get(0).getBoundingClientRect ? this.get(0).getBoundingClientRect() : this.offset();
            var width = offset2Body.width || this.outerWidth();
            var height = offset2Body.height || this.outerHeight();
            // offset2Body.left的值可能会有小数，导致某点出现false
            return !(e.pageX < Math.floor(offset2Body.left) || e.pageX > offset2Body.left + width
                || e.pageY < Math.floor(offset2Body.top) || e.pageY > offset2Body.top + height);
        },

        __hasZIndexMask__: function (zindex) {
            return zindex && this.zIndexMask[zindex] != null;
        },

        __buildZIndexMask__: function (zindex, domArray) {
            this.zIndexMask = this.zIndexMask || {};// 存储z-index的mask
            this.indexMask = this.indexMask || [];// 存储mask
            var mask = BI.createWidget({
                type: "bi.center_adapt",
                cls: "bi-z-index-mask",
                items: domArray
            });

            mask.element.css({"z-index": zindex});
            BI.createWidget({
                type: "bi.absolute",
                element: this,
                items: [{
                    el: mask,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            });
            this.indexMask.push(mask);
            zindex && (this.zIndexMask[zindex] = mask);
            return mask.element;
        },

        __releaseZIndexMask__: function (zindex) {
            if (zindex && this.zIndexMask[zindex]) {
                BI.remove(this.indexMask, this.zIndexMask[zindex]);
                this.zIndexMask[zindex].destroy();
                return;
            }
            this.indexMask = this.indexMask || [];
            var indexMask = this.indexMask.pop();
            indexMask && indexMask.destroy();
        }
    });
}
