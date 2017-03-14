/**
 * 基本的函数
 * Created by GUY on 2015/6/24.
 */
$(function () {
    BI.Func = {};
    var formulas = {};
    BI.extend(BI.Func, {
        /**
         * 创建唯一的名字
         * @param array
         * @param name
         * @returns {*}
         */
        createDistinctName: function (array, name) {
            var src = name, idx = 1;
            name = name || "";
            while (true) {
                if (!ArrayUtils.getItemByName(array, name)) {
                    break;
                }
                name = src + (idx++);
            }
            return name;
        },

        /**
         * 获取搜索结果
         * @param items
         * @param keyword
         * @param param  搜索哪个属性
         */
        getSearchResult: function (items, keyword, param) {
            var isArray = BI.isArray(items);
            items = isArray ? BI.flatten(items) : items;
            param || (param = "text");
            if (!BI.isKey(keyword)) {
                return {
                    finded: BI.deepClone(items),
                    matched: isArray ? [] : {}
                };
            }
            var t, text, py;
            keyword = BI.toUpperCase(keyword);
            var matched = isArray ? [] : {}, finded = isArray ? [] : {};
            BI.each(items, function (i, item) {
                item = BI.deepClone(item);
                t = BI.stripEL(item);
                text = t[param] || t.text || t.value || t.name || t;
                py = BI.makeFirstPY(text);
                text = BI.toUpperCase(text);
                py = BI.toUpperCase(py);
                var pidx;
                if (text.indexOf(keyword) > -1) {
                    if (text === keyword) {
                        isArray ? matched.push(item) : (matched[i] = item);
                    } else {
                        isArray ? finded.push(item) : (finded[i] = item);
                    }
                } else if (pidx = py.indexOf(keyword), (pidx > -1 && Math.floor(pidx / text.length) === Math.floor((pidx + keyword.length - 1) / text.length))) {
                    if (text === keyword || keyword.length === text.length) {
                        isArray ? matched.push(item) : (matched[i] = item);
                    } else {
                        isArray ? finded.push(item) : (finded[i] = item);
                    }
                }
            });
            return {
                matched: matched,
                finded: finded
            }
        },

        /**
         * 公式合法性验证
         */
        checkFormulaValidation: function (str) {
            if (!BI.isEmptyString(str)) {
                if (BI.has(formulas, str)) {
                    return formulas[str];
                }
                formulas[str] = false;
                var response = BI.requestSync("fr_bi_base", "check_validation_of_expression", {expression: str});
                if (response.validation === "invalid") {
                    formulas[str] = false;
                } else if (response.validation === "valid") {
                    formulas[str] = true;
                }
                return formulas[str];
            } else {
                return true;
            }
        },

        getFormulaStringFromFormulaValue: function (formulaValue) {
            var formulaString = "";
            var regx = /\$[\{][^\}]*[\}]|\w*\w|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)/g;
            var result = formulaValue.match(regx);
            BI.each(result, function (i, item) {
                var fieldRegx = /\$[\{][^\}]*[\}]/;
                var str = item.match(fieldRegx);
                if (BI.isNotEmptyArray(str)) {
                    formulaString = formulaString + str[0].substring(2, item.length - 1);
                } else {
                    formulaString = formulaString + item;
                }
            });
            return formulaString;
        },

        formatAddress: function (address) {
            var temp = '';
            var url1 = /[a-zA-z]+:\/\/[^\s]*/;
            var url2 = /\/[^\s]*/;
            if (address.match(url1) || address.match(url2)) {
                temp = address;
            } else if (BI.isNotEmptyString(address)) {
                temp = "http://" + address;
            }
            return temp;
        },

        getCompleteImageUrl: function (url) {
            return FR.servletURL + "?op=fr_bi&cmd=get_uploaded_image&image_id=" + url;
        }

    });

    /**
     * 对DOM操作的通用函数
     * @type {{}}
     */
    BI.DOM = {};
    BI.extend(BI.DOM, {

        /**
         * 把dom数组或元素悬挂起来,使其不对html产生影响
         * @param dom
         */
        hang: function (doms) {
            if (BI.isEmpty(doms)) {
                return;
            }
            var frag = document.createDocumentFragment();
            BI.each(doms, function (i, dom) {
                dom instanceof BI.Widget && (dom = dom.element);
                dom instanceof $ && dom[0] && frag.appendChild(dom[0]);
            });
            return frag;
        },

        isExist: function (obj) {
            return $("body").find(obj.element).length > 0;
        },

        //预加载图片
        preloadImages: function (srcArray, onload) {
            var count = 0, images = [];

            function complete() {
                count++;
                if (count >= srcArray.length) {
                    onload();
                }
            }

            BI.each(srcArray, function (i, src) {
                images[i] = new Image();
                images[i].src = src;
                images[i].onload = function () {
                    complete()
                };
                images[i].onerror = function () {
                    complete()
                };
            });
        },

        getImageWidthAndHeight: function (src) {
            return BI.requestSync("fr_bi_base", "get_image_size", {
                src: src
            });
        },

        isDarkColor: function (hex) {
            if (!hex) {
                return false;
            }
            var rgb = this.rgb2json(this.hex2rgb(hex));
            var grayLevel = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
            if (grayLevel < 192) {
                return true;
            }
            return false;
        },

        rgb2hex: function (rgbColour) {
            if (!rgbColour || rgbColour.substr(0, 3) != "rgb") {
                return "";
            }
            var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
            var red = BI.parseInt(rgbValues[0]);
            var green = BI.parseInt(rgbValues[1]);
            var blue = BI.parseInt(rgbValues[2]);

            var hexColour = "#" + this.int2hex(red) + this.int2hex(green) + this.int2hex(blue);

            return hexColour;
        },

        rgb2json: function (rgbColour) {
            if (!rgbColour) {
                return {};
            }
            var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
            return {
                r: BI.parseInt(rgbValues[0]),
                g: BI.parseInt(rgbValues[1]),
                b: BI.parseInt(rgbValues[2])
            };
        },

        rgba2json: function (rgbColour) {
            if (!rgbColour) {
                return {};
            }
            var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
            return {
                r: BI.parseInt(rgbValues[0]),
                g: BI.parseInt(rgbValues[1]),
                b: BI.parseInt(rgbValues[2]),
                a: BI.parseFloat(rgbValues[3])
            };
        },

        json2rgb: function (rgb) {
            if (!BI.isKey(rgb.r) || !BI.isKey(rgb.g) || !BI.isKey(rgb.b)) {
                return "";
            }
            return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        },

        json2rgba: function (rgba) {
            if (!BI.isKey(rgba.r) || !BI.isKey(rgba.g) || !BI.isKey(rgba.b)) {
                return "";
            }
            return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
        },

        int2hex: function (strNum) {
            var hexdig = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

            return hexdig[strNum >>> 4] + '' + hexdig[strNum & 15];
        },

        hex2rgb: function (color) {
            if (!color) {
                return "";
            }
            var tempValue = "rgb(", colorArray;

            if (color.length === 7) {
                colorArray = [BI.parseInt('0x' + color.substring(1, 3)),
                    BI.parseInt('0x' + color.substring(3, 5)),
                    BI.parseInt('0x' + color.substring(5, 7))];
            }
            else if (color.length === 4) {
                colorArray = [BI.parseInt('0x' + color.substring(1, 2)),
                    BI.parseInt('0x' + color.substring(2, 3)),
                    BI.parseInt('0x' + color.substring(3, 4))];
            }
            tempValue += colorArray[0] + ",";
            tempValue += colorArray[1] + ",";
            tempValue += colorArray[2] + ")";

            return tempValue;
        },

        rgba2rgb: function (rgbColour, BGcolur) {
            if (BI.isNull(BGcolur)) {
                BGcolur = 1;
            }
            if (rgbColour.substr(0, 4) != "rgba") {
                return "";
            }
            var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
            if (rgbValues.length < 4) {
                return "";
            }
            var R = BI.parseFloat(rgbValues[0]);
            var G = BI.parseFloat(rgbValues[1]);
            var B = BI.parseFloat(rgbValues[2]);
            var A = BI.parseFloat(rgbValues[3]);

            return "rgb(" + Math.floor(255 * (BGcolur * (1 - A )) + R * A) + "," +
                Math.floor(255 * (BGcolur * (1 - A )) + G * A) + "," +
                Math.floor(255 * (BGcolur * (1 - A )) + B * A) + ")";
        },

        getTextSizeWidth: function (text, fontSize) {
            var span = $("<span></span>").addClass("text-width-span").appendTo($("#container"));

            if (fontSize == null) {
                fontSize = 12;
            }
            fontSize = fontSize + "px";

            span.css("font-size", fontSize).text(text);

            var width = span.width();
            span.remove();

            return width;
        },

        //获取滚动条的宽度
        getScrollWidth: function () {
            if (this._scrollWidth == null) {
                var ul = $("<div>").width(50).height(50).css({
                    position: "absolute",
                    top: "-9999px",
                    overflow: "scroll"
                }).appendTo($("#container"));
                this._scrollWidth = ul[0].offsetWidth - ul[0].clientWidth;
                ul.destroy();
            }
            return this._scrollWidth;
        }
    });
});