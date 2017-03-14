/**
 * 分页控件
 *
 * Created by GUY on 2015/8/31.
 * @class BI.Pager
 * @extends BI.Widget
 */
BI.Pager = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Pager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-pager",
            behaviors: {},
            layouts: [{
                type: "bi.horizontal",
                hgap: 10,
                vgap: 0
            }],

            dynamicShow: true, //是否动态显示上一页、下一页、首页、尾页， 若为false，则指对其设置使能状态
            //dynamicShow为false时以下两个有用
            dynamicShowFirstLast: false,//是否动态显示首页、尾页
            dynamicShowPrevNext: false,//是否动态显示上一页、下一页
            pages: false, //总页数
            curr: function () {
                return 1;
            }, //初始化当前页
            groups: 0, //连续显示分页数
            jump: BI.emptyFn, //分页的回调函数

            first: false, //是否显示首页
            last: false, //是否显示尾页
            prev: "上一页",
            next: "下一页",

            firstPage: 1,
            lastPage: function () { //在万不得已时才会调用这个函数获取最后一页的页码,  主要作用于setValue方法
                return 1;
            },
            hasPrev: BI.emptyFn, //pages不可用时有效
            hasNext: BI.emptyFn  //pages不可用时有效
        })
    },
    _init: function () {
        BI.Pager.superclass._init.apply(this, arguments);
        var self = this;
        this.currPage = BI.result(this.options, "curr");
        //翻页太灵敏
        this._lock = false;
        this._debouce = BI.debounce(function () {
            self._lock = false;
        }, 300);
        this._populate();
    },

    populate: function () {
        this.currPage = BI.result(this.options, "curr");
        this._populate();
    },
    
    refresh: function () {
        this._populate();  
    },

    _populate: function () {
        var self = this, o = this.options, view = [], dict = {};
        this.empty();
        var pages = BI.result(o, "pages");
        var curr = BI.result(this, "currPage");
        var groups = BI.result(o, "groups");
        var first = BI.result(o, "first");
        var last = BI.result(o, "last");
        var prev = BI.result(o, "prev");
        var next = BI.result(o, "next");

        if (pages === false) {
            groups = 0;
            first = false;
            last = false;
        } else {
            groups > pages && (groups = pages);
        }

        //计算当前组
        dict.index = Math.ceil((curr + ((groups > 1 && groups !== pages) ? 1 : 0)) / (groups === 0 ? 1 : groups));

        //当前页非首页，则输出上一页
        if (((!o.dynamicShow && !o.dynamicShowPrevNext) || curr > 1) && prev !== false) {
            if (BI.isKey(prev)) {
                view.push({
                    text: prev,
                    value: "prev",
                    disabled: pages === false ? o.hasPrev(curr) === false : !(curr > 1 && prev !== false)
                })
            } else {
                view.push(BI.extend({
                    disabled: pages === false ? o.hasPrev(curr) === false : !(curr > 1 && prev !== false)
                }, prev));
            }
        }

        //当前组非首组，则输出首页
        if (((!o.dynamicShow && !o.dynamicShowFirstLast) || (dict.index > 1 && groups !== 0)) && first) {
            view.push({
                text: first,
                value: "first",
                disabled: !(dict.index > 1 && groups !== 0)
            });
            if (dict.index > 1 && groups !== 0) {
                view.push({
                    type: "bi.label",
                    cls: "page-ellipsis",
                    text: "\u2026"
                });
            }
        }

        //输出当前页组
        dict.poor = Math.floor((groups - 1) / 2);
        dict.start = dict.index > 1 ? curr - dict.poor : 1;
        dict.end = dict.index > 1 ? (function () {
            var max = curr + (groups - dict.poor - 1);
            return max > pages ? pages : max;
        }()) : groups;
        if (dict.end - dict.start < groups - 1) { //最后一组状态
            dict.start = dict.end - groups + 1;
        }
        var s = dict.start, e = dict.end;
        if (first && last && (dict.index > 1 && groups !== 0) && (pages > groups && dict.end < pages && groups !== 0)) {
            s++;
            e--;
        }
        for (; s <= e; s++) {
            if (s === curr) {
                view.push({
                    text: s,
                    value: s,
                    selected: true
                })
            } else {
                view.push({
                    text: s,
                    value: s
                })
            }
        }

        //总页数大于连续分页数，且当前组最大页小于总页，输出尾页
        if (((!o.dynamicShow && !o.dynamicShowFirstLast) || (pages > groups && dict.end < pages && groups !== 0)) && last) {
            if (pages > groups && dict.end < pages && groups !== 0) {
                view.push({
                    type: "bi.label",
                    cls: "page-ellipsis",
                    text: "\u2026"
                });
            }
            view.push({
                text: last,
                value: "last",
                disabled: !(pages > groups && dict.end < pages && groups !== 0)
            })
        }

        //当前页不为尾页时，输出下一页
        dict.flow = !prev && groups === 0;
        if (((!o.dynamicShow && !o.dynamicShowPrevNext) && next) || (curr !== pages && next || dict.flow)) {
            view.push((function () {
                if (BI.isKey(next)) {
                    if (pages === false) {
                        return {text: next, value: "next", disabled: o.hasNext(curr) === false}
                    }
                    return (dict.flow && curr === pages)
                        ?
                    {text: next, value: "next", disabled: true}
                        :
                    {text: next, value: "next", disabled: !(curr !== pages && next || dict.flow)};
                } else {
                    return BI.extend({
                        disabled: pages === false ? o.hasNext(curr) === false : !(curr !== pages && next || dict.flow)
                    }, next);
                }
            }()));
        }

        this.button_group = BI.createWidget({
            type: "bi.button_group",
            element: this.element,
            items: BI.createItems(view, {
                cls: "page-item",
                height: 23,
                hgap: 10
            }),
            behaviors: o.behaviors,
            layouts: o.layouts
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (self._lock === true) {
                return;
            }
            self._lock = true;
            self._debouce();
            if (type === BI.Events.CLICK) {
                var v = self.button_group.getValue()[0];
                switch (v) {
                    case "first":
                        self.currPage = 1;
                        break;
                    case "last":
                        self.currPage = pages;
                        break;
                    case "prev":
                        self.currPage--;
                        break;
                    case "next":
                        self.currPage++;
                        break;
                    default:
                        self.currPage = v;
                        break;
                }
                o.jump.apply(self, [{
                    pages: pages,
                    curr: self.currPage
                }]);
                self._populate();
                self.fireEvent(BI.Pager.EVENT_CHANGE, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.fireEvent(BI.Pager.EVENT_AFTER_POPULATE);
    },

    getCurrentPage: function () {
        return this.currPage;
    },

    setAllPages: function (pages) {
        this.options.pages = pages;
    },

    hasPrev: function (v) {
        v || (v = 1);
        var o = this.options;
        var pages = this.options.pages;
        return pages === false ? o.hasPrev(v) : v > 1;
    },

    hasNext: function (v) {
        v || (v = 1);
        var o = this.options;
        var pages = this.options.pages;
        return pages === false ? o.hasNext(v) : v < pages;
    },

    setValue: function (v) {
        var o = this.options;
        v = v | 0;
        v = v < 1 ? 1 : v;
        if (o.pages === false) {
            var lastPage = BI.result(o, "lastPage"), firstPage = 1;
            this.currPage = v > lastPage ? lastPage : ((firstPage = BI.result(o, "firstPage")), (v < firstPage ? firstPage : v));
        } else {
            v = v > o.pages ? o.pages : v;
            this.currPage = v;
        }
        this._populate();
    },

    getValue: function () {
        var val = this.button_group.getValue()[0];
        switch (val) {
            case "prev":
                return -1;
            case "next":
                return 1;
            case "first":
                return BI.MIN;
            case "last":
                return BI.MAX;
            default :
                return val;
        }
    }
});
BI.Pager.EVENT_CHANGE = "EVENT_CHANGE";
BI.Pager.EVENT_AFTER_POPULATE = "EVENT_AFTER_POPULATE";
$.shortcut("bi.pager", BI.Pager);