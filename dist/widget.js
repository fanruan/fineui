/**
 *
 * Created by GUY on 2016/5/26.
 * @class BI.SequenceTableTreeNumber
 * @extends BI.Widget
 */
BI.SequenceTableTreeNumber = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTableTreeNumber.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sequence-table-tree-number",
            isNeedFreeze: false,
            startSequence: 1, // 开始的序号
            scrollTop: 0,
            headerRowSize: 25,
            rowSize: 25,

            sequenceHeaderCreator: null,

            header: [],
            items: [], // 二维数组

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.SequenceTableTreeNumber.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.vCurr = 1;
        this.hCurr = 1;
        this.tasks = [];
        this.renderedCells = [];
        this.renderedKeys = [];

        this.container = BI.createWidget({
            type: "bi.absolute",
            width: 60,
            scrollable: false
        });

        this.scrollContainer = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.container]
        });

        this.headerContainer = BI.createWidget({
            type: "bi.absolute",
            cls: "bi-border",
            width: 58,
            scrollable: false
        });

        this.layout = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.headerContainer,
                height: this._getHeaderHeight() - 2
            }, {el: {type: "bi.layout"}, height: 2}, {
                el: this.scrollContainer
            }]
        });
        // 缓存第一行对应的序号
        this.start = this.options.startSequence;
        this.cache = {};
        this._nextState();

        this._populate();
    },

    _getNextSequence: function (nodes) {
        var self = this;
        var start = this.start;
        var cnt = this.start;

        function track (node) {
            // 如果已经有缓存了就不改计数了，复杂表会出现这种情况
            self.cache[node.text || node.value] || (self.cache[node.text || node.value] = cnt);
            cnt++;
        }

        BI.each(nodes, function (i, node) {
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    if (index === 0) {
                        if (self.cache[child.text || child.value]) {
                            start = cnt = self.cache[child.text || child.value];
                        }
                    }
                    track(child);
                });
            }
        });
        this.start = cnt;
        return start;
    },

    _getStart: function (nodes) {
        var self = this;
        var start = this.start;
        BI.some(nodes, function (i, node) {
            if (BI.isNotEmptyArray(node.children)) {
                return BI.some(node.children, function (index, child) {
                    if (index === 0) {
                        if (self.cache[child.text || child.value]) {
                            start = self.cache[child.text || child.value];
                            return true;
                        }
                    }
                });
            }
        });
        return start;
    },

    _formatNumber: function (nodes) {
        var self = this, o = this.options;
        var result = [];
        var count = this._getStart(nodes);

        function getLeafCount (node) {
            var cnt = 0;
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    cnt += getLeafCount(child);
                });
                if (/** node.children.length > 1 && **/BI.isNotEmptyArray(node.values)) {
                    cnt++;
                }
            } else {
                cnt++;
            }
            return cnt;
        }

        var start = 0, top = 0;
        BI.each(nodes, function (i, node) {
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var cnt = getLeafCount(child);
                    result.push({
                        text: count++,
                        start: start,
                        top: top,
                        cnt: cnt,
                        index: index,
                        height: cnt * o.rowSize
                    });
                    start += cnt;
                    top += cnt * o.rowSize;
                });
                if (BI.isNotEmptyArray(node.values)) {
                    result.push({
                        text: BI.i18nText("BI-Summary_Values"),
                        start: start++,
                        top: top,
                        cnt: 1,
                        isSummary: true,
                        height: o.rowSize
                    });
                    top += o.rowSize;
                }
            }
        });
        return result;
    },

    _layout: function () {
        var self = this, o = this.options;
        var headerHeight = this._getHeaderHeight() - 2;
        var items = this.layout.attr("items");
        if (o.isNeedFreeze === false) {
            items[0].height = 0;
            items[1].height = 0;
        } else if (o.isNeedFreeze === true) {
            items[0].height = headerHeight;
            items[1].height = 2;
        }
        this.layout.attr("items", items);
        this.layout.resize();
        try {
            this.scrollContainer.element.scrollTop(o.scrollTop);
        } catch (e) {

        }
    },

    _getHeaderHeight: function () {
        var o = this.options;
        return o.headerRowSize * (o.crossHeader.length + (o.header.length > 0 ? 1 : 0));
    },

    _nextState: function () {
        var o = this.options;
        this._getNextSequence(o.items);
    },

    _prevState: function () {
        var self = this, o = this.options;
        var firstChild;
        BI.some(o.items, function (i, node) {
            if (BI.isNotEmptyArray(node.children)) {
                return BI.some(node.children, function (j, child) {
                    firstChild = child;
                    return true;
                });
            }
        });
        if (firstChild && BI.isNotEmptyObject(this.cache)) {
            this.start = this.cache[firstChild.text || firstChild.value];
        } else {
            this.start = 1;
        }
        this._nextState();
    },

    _getMaxScrollTop: function (numbers) {
        var cnt = 0;
        BI.each(numbers, function (i, number) {
            cnt += number.cnt;
        });
        return Math.max(0, cnt * this.options.rowSize - (this.options.height - this._getHeaderHeight()) + BI.DOM.getScrollWidth());
    },

    _createHeader: function () {
        var o = this.options;
        BI.createWidget({
            type: "bi.absolute",
            element: this.headerContainer,
            items: [{
                el: o.sequenceHeaderCreator || {
                    type: "bi.table_style_cell",
                    cls: "sequence-table-title-cell",
                    styleGetter: o.headerCellStyleGetter,
                    text: BI.i18nText("BI-Number_Index")
                },
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }]
        });
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;

        var renderedCells = [], renderedKeys = [];
        var numbers = this._formatNumber(o.items);
        var intervalTree = BI.PrefixIntervalTree.uniform(numbers.length, 0);
        BI.each(numbers, function (i, number) {
            intervalTree.set(i, number.height);
        });
        var scrollTop = BI.clamp(o.scrollTop, 0, this._getMaxScrollTop(numbers));
        var index = intervalTree.greatestLowerBound(scrollTop);
        var offsetTop = -(scrollTop - (index > 0 ? intervalTree.sumTo(index - 1) : 0));
        var height = offsetTop;
        var bodyHeight = o.height - this._getHeaderHeight();
        while (height < bodyHeight && index < numbers.length) {
            renderedKeys.push(index);
            offsetTop += numbers[index].height;
            height += numbers[index].height;
            index++;
        }

        BI.each(renderedKeys, function (i, key) {
            var index = BI.deepIndexOf(self.renderedKeys, key);
            if (index > -1) {
                if (numbers[key].height !== self.renderedCells[index]._height) {
                    self.renderedCells[index]._height = numbers[key].height;
                    self.renderedCells[index].el.setHeight(numbers[key].height);
                }
                if (numbers[key].top !== self.renderedCells[index].top) {
                    self.renderedCells[index].top = numbers[key].top;
                    self.renderedCells[index].el.element.css("top", numbers[key].top + "px");
                }
                renderedCells.push(self.renderedCells[index]);
            } else {
                var child = BI.createWidget(BI.extend({
                    type: "bi.table_style_cell",
                    cls: "sequence-table-number-cell bi-border-left bi-border-right bi-border-bottom",
                    width: 60,
                    styleGetter: numbers[key].isSummary === true ? function () {
                        return o.summaryCellStyleGetter(true);
                    } : function (key) {
                        return function () {
                            return o.sequenceCellStyleGetter(key);
                        };
                    }(numbers[key].index)
                }, numbers[key]));
                renderedCells.push({
                    el: child,
                    left: 0,
                    top: numbers[key].top,
                    _height: numbers[key].height
                });
            }
        });

        // 已存在的， 需要添加的和需要删除的
        var existSet = {}, addSet = {}, deleteArray = [];
        BI.each(renderedKeys, function (i, key) {
            if (BI.deepContains(self.renderedKeys, key)) {
                existSet[i] = key;
            } else {
                addSet[i] = key;
            }
        });
        BI.each(this.renderedKeys, function (i, key) {
            if (BI.deepContains(existSet, key)) {
                return;
            }
            if (BI.deepContains(addSet, key)) {
                return;
            }
            deleteArray.push(i);
        });
        BI.each(deleteArray, function (i, index) {
            self.renderedCells[index].el.destroy();
        });
        var addedItems = [];
        BI.each(addSet, function (index) {
            addedItems.push(renderedCells[index]);
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: addedItems
        });
        this.renderedCells = renderedCells;
        this.renderedKeys = renderedKeys;

        this.container.setHeight(intervalTree.sumUntil(numbers.length));
    },

    _restore: function () {
        BI.each(this.renderedCells, function (i, cell) {
            cell.el.destroy();
        });
        this.renderedCells = [];
        this.renderedKeys = [];
    },

    _populate: function () {
        var self = this;
        BI.each(this.tasks, function (i, task) {
            task.apply(self);
        });
        this.tasks = [];
        this.headerContainer.empty();
        this._createHeader();
        this._layout();
        this._calculateChildrenToRender();
    },

    setVerticalScroll: function (scrollTop) {
        if (this.options.scrollTop !== scrollTop) {
            this.options.scrollTop = scrollTop;
            try {
                this.scrollContainer.element.scrollTop(scrollTop);
            } catch (e) {

            }
        }
    },

    getVerticalScroll: function () {
        return this.options.scrollTop;
    },

    setVPage: function (v) {
        if (v <= 1) {
            this.cache = {};
            this.start = this.options.startSequence;
            this._restore();
            this.tasks.push(this._nextState);
        } else if (v === this.vCurr + 1) {
            this.tasks.push(this._nextState);
        } else if (v === this.vCurr - 1) {
            this.tasks.push(this._prevState);
        }
        this.vCurr = v;
    },

    setHPage: function (v) {
        if (v !== this.hCurr) {
            this.tasks.push(this._prevState);
        }
        this.hCurr = v;
    },

    restore: function () {
        this._restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items && items !== this.options.items) {
            o.items = items;
            this._restore();
            this.tasks.push(this._prevState);
        }
        if (header && header !== this.options.header) {
            o.header = header;
        }
        if (crossItems && crossItems !== this.options.crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader && crossHeader !== this.options.crossHeader) {
            o.crossHeader = crossHeader;
        }
        this._populate();
    }
});
BI.shortcut("bi.sequence_table_tree_number", BI.SequenceTableTreeNumber);/**
 * 日期控件中的月份下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.MonthDateCombo
 * @extends BI.Trigger
 */
BI.MonthDateCombo = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        return BI.extend( BI.MonthDateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-month-combo",
            height: 25
        });
    },
    _init: function () {
        BI.MonthDateCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_triangle_trigger"
        });

        this.popup = BI.createWidget({
            type: "bi.month_popup"
        });

        this.popup.on(BI.YearPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
        });


        this.combo = BI.createWidget({
            type: "bi.combo",
            offsetStyle: "center",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: this.popup
            }
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            self.combo.hideView();
            self.fireEvent(BI.MonthDateCombo.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.MonthDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.month_date_combo", BI.MonthDateCombo);/**
 * 年份下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.YearDateCombo
 * @extends BI.Trigger
 */
BI.YearDateCombo = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        return BI.extend( BI.YearDateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-combo",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            height: 25
        });
    },
    _init: function () {
        BI.YearDateCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_triangle_trigger"
        });

        this.popup = BI.createWidget({
            type: "bi.year_popup",
            min: o.min,
            max: o.max
        });

        this.popup.on(BI.YearPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.YearDateCombo.EVENT_CHANGE);
        });


        this.combo = BI.createWidget({
            type: "bi.combo",
            offsetStyle: "center",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: this.popup
            }
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            self.fireEvent(BI.YearDateCombo.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.YearDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.year_date_combo", BI.YearDateCombo);/**
 * Created by GUY on 2015/9/7.
 * @class BI.DatePicker
 * @extends BI.Widget
 */
BI.DatePicker = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.DatePicker.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-picker bi-background",
            height: 40,
            min: "1900-01-01", // 最小日期
            max: "2099-12-31" // 最大日期
        });
    },

    _init: function () {
        BI.DatePicker.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._year = BI.getDate().getFullYear();
        this._month = BI.getDate().getMonth();
        this.left = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 25,
            height: 25
        });
        this.left.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self._month === 0) {
                self.setValue({
                    year: self.year.getValue() - 1,
                    month: 12
                });
            } else {
                self.setValue({
                    year: self.year.getValue(),
                    month: self.month.getValue() - 1
                });
            }
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
            self._checkLeftValid();
            self._checkRightValid();
        });

        this.right = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 25,
            height: 25
        });

        this.right.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self._month === 11) {
                self.setValue({
                    year: self.year.getValue() + 1,
                    month: 0
                });
            } else {
                self.setValue({
                    year: self.year.getValue(),
                    month: self.month.getValue() + 1
                });
            }
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
            self._checkLeftValid();
            self._checkRightValid();
        });

        this.year = BI.createWidget({
            type: "bi.year_date_combo",
            min: o.min,
            max: o.max
        });
        this.year.on(BI.YearDateCombo.EVENT_CHANGE, function () {
            self.setValue({
                year: self.year.getValue(),
                month: self.month.getValue()
            });
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });
        this.month = BI.createWidget({
            type: "bi.month_date_combo"
        });
        this.month.on(BI.MonthDateCombo.EVENT_CHANGE, function () {
            self.setValue({
                year: self.year.getValue(),
                month: self.month.getValue()
            });
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [this.left]
                },
                width: 25
            }, {
                type: "bi.center_adapt",
                items: [{
                    type: "bi.horizontal",
                    width: 100,
                    items: [this.year, this.month]
                }]
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.right]
                },
                width: 25
            }]
        });
        this.setValue({
            year: this._year,
            month: this._month
        });
    },

    _checkLeftValid: function () {
        var o = this.options;
        var valid = !(this._month === 1 && this._year === BI.parseDateTime(o.min, "%Y-%X-%d").getFullYear());
        this.left.setEnable(valid);
        return valid;
    },

    _checkRightValid: function () {
        var o = this.options;
        var valid = !(this._month === 12 && this._year === BI.parseDateTime(o.max, "%Y-%X-%d").getFullYear());
        this.right.setEnable(valid);
        return valid;
    },



    setValue: function (ob) {
        this._year = ob.year;
        this._month = ob.month;
        this.year.setValue(ob.year);
        this.month.setValue(ob.month);
        this._checkLeftValid();
        this._checkRightValid();
    },

    getValue: function () {
        return {
            year: this.year.getValue(),
            month: this.month.getValue()
        };
    }
});
BI.DatePicker.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.date_picker", BI.DatePicker);/**
 * Created by GUY on 2015/9/7.
 * @class BI.YearPicker
 * @extends BI.Widget
 */
BI.YearPicker = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.YearPicker.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-year-picker bi-background",
            height: 40,
            min: "1900-01-01", // 最小日期
            max: "2099-12-31" // 最大日期
        });
    },

    _init: function () {
        BI.YearPicker.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._year = BI.getDate().getFullYear();
        this.left = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 25,
            height: 25
        });
        this.left.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue(self.year.getValue() - 1);
            self.fireEvent(BI.YearPicker.EVENT_CHANGE);
            self._checkLeftValid();
            self._checkRightValid();
        });

        this.right = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 25,
            height: 25
        });

        this.right.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue(self.year.getValue() + 1);
            self.fireEvent(BI.YearPicker.EVENT_CHANGE);
            self._checkLeftValid();
            self._checkRightValid();
        });

        this.year = BI.createWidget({
            type: "bi.year_date_combo",
            min: o.min,
            max: o.max
        });
        this.year.on(BI.YearDateCombo.EVENT_CHANGE, function () {
            self.setValue(self.year.getValue());
            self.fireEvent(BI.YearPicker.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [this.left]
                },
                width: 25
            }, {
                type: "bi.center_adapt",
                items: [this.year]
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.right]
                },
                width: 25
            }]
        });
        this.setValue({
            year: this._year
        });
    },

    _checkLeftValid: function () {
        var o = this.options;
        var valid = !(this._year === BI.parseDateTime(o.min, "%Y-%X-%d").getFullYear());
        this.left.setEnable(valid);
        return valid;
    },

    _checkRightValid: function () {
        var o = this.options;
        var valid = !(this._year === BI.parseDateTime(o.max, "%Y-%X-%d").getFullYear());
        this.right.setEnable(valid);
        return valid;
    },



    setValue: function (v) {
        this._year = v;
        this.year.setValue(v);
        this._checkLeftValid();
        this._checkRightValid();
    },

    getValue: function () {
        return this.year.getValue();
    }
});
BI.YearPicker.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.year_picker", BI.YearPicker);/**
 * Created by GUY on 2015/9/7.
 * @class BI.DateCalendarPopup
 * @extends BI.Widget
 */
BI.DateCalendarPopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.DateCalendarPopup.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-calendar-popup",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            selectedTime: null
        });
    },

    _createNav: function (v) {
        var date = BI.Calendar.getDateJSONByPage(v);
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: true
            },
            min: this.options.min,
            max: this.options.max,
            year: date.year,
            month: date.month,
            day: this.selectedTime.day
        });
        return calendar;
    },

    _init: function () {
        BI.DateCalendarPopup.superclass._init.apply(this, arguments);
        var self = this,
            o = this.options;
        this.today = BI.getDate();
        this._year = this.today.getFullYear();
        this._month = this.today.getMonth();
        this._day = this.today.getDate();

        this.selectedTime = o.selectedTime || {
            year: this._year,
            month: this._month,
            day: this._day
        };
        this.datePicker = BI.createWidget({
            type: "bi.date_picker",
            min: o.min,
            max: o.max
        });

        this.calendar = BI.createWidget({
            direction: "top",
            element: this,
            logic: {
                dynamic: true
            },
            type: "bi.navigation",
            tab: this.datePicker,
            cardCreator: BI.bind(this._createNav, this),

            afterCardCreated: function () {

            },

            afterCardShow: function () {
                this.setValue(self.selectedTime);
            }
        });

        this.datePicker.on(BI.DatePicker.EVENT_CHANGE, function () {
            self.selectedTime = self.datePicker.getValue();
            self.selectedTime.day = 1;
            self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
        });

        this.calendar.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedTime = self.calendar.getValue();
            self.setValue(self.selectedTime);
            self.fireEvent(BI.DateCalendarPopup.EVENT_CHANGE);
        });
    },

    setValue: function (timeOb) {
        this.datePicker.setValue(timeOb);
        this.calendar.setSelect(BI.Calendar.getPageByDateJSON(timeOb));
        this.calendar.setValue(timeOb);
        this.selectedTime = timeOb;
    },

    getValue: function () {
        return this.selectedTime;
    }
});
BI.DateCalendarPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.date_calendar_popup", BI.DateCalendarPopup);/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.YearPopup
 * @extends BI.Trigger
 */
BI.YearPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.YearPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-popup",
            behaviors: {},
            min: "1900-01-01", // 最小日期
            max: "2099-12-31" // 最大日期
        });
    },

    _createYearCalendar: function (v) {
        var o = this.options, y = this._year;

        var calendar = BI.createWidget({
            type: "bi.year_calendar",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max,
            logic: {
                dynamic: true
            },
            year: y + v * 12
        });
        calendar.setValue(this._year);
        return calendar;
    },

    _init: function () {
        BI.YearPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.selectedYear = this._year = BI.getDate().getFullYear();

        var backBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 25,
            height: 25,
            value: -1
        });

        var preBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 25,
            height: 25,
            value: 1
        });

        this.navigation = BI.createWidget({
            type: "bi.navigation",
            element: this,
            single: true,
            logic: {
                dynamic: true
            },
            tab: {
                cls: "year-popup-navigation bi-high-light bi-border-top",
                height: 25,
                items: [backBtn, preBtn]
            },
            cardCreator: BI.bind(this._createYearCalendar, this),

            afterCardShow: function () {
                this.setValue(self.selectedYear);
                var calendar = this.getSelectedCard();
                backBtn.setEnable(!calendar.isFrontYear());
                preBtn.setEnable(!calendar.isFinalYear());
            }
        });

        this.navigation.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedYear = this.getValue();
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            self.fireEvent(BI.YearPopup.EVENT_CHANGE, self.selectedYear);
        });

        if(BI.isKey(o.value)){
            this.setValue(o.value);
        }
    },

    getValue: function () {
        return this.selectedYear;
    },

    setValue: function (v) {
        var o = this.options;
        if (BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]) {
            v = BI.getDate().getFullYear();
            this.selectedYear = "";
            this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
            this.navigation.setValue("");
        } else {
            this.selectedYear = v;
            this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
            this.navigation.setValue(v);
        }
    }
});
BI.YearPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.year_popup", BI.YearPopup);/**
 * 日期控件中的年份或月份trigger
 *
 * Created by GUY on 2015/9/7.
 * @class BI.DateTriangleTrigger
 * @extends BI.Trigger
 */
BI.DateTriangleTrigger = BI.inherit(BI.Trigger, {
    _const: {
        height: 25,
        iconWidth: 16,
        iconHeight: 13
    },

    _defaultConfig: function () {
        return BI.extend( BI.DateTriangleTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-triangle-trigger pull-down-ha-font cursor-pointer",
            height: 25
        });
    },
    _init: function () {
        BI.DateTriangleTrigger.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "right",
            text: o.text,
            value: o.value,
            height: c.height
        });
        this.icon = BI.createWidget({
            type: "bi.icon",
            width: c.iconWidth,
            height: c.iconHeight
        });

        BI.createWidget({
            type: "bi.center_adapt",
            element: this,
            items: [{
                type: "bi.center_adapt",
                width: 50,
                height: c.height,
                items: [this.text, this.icon]
            }]
        });
    },

    setValue: function (v) {
        this.text.setValue(v);
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function (v) {
        this.text.setText(v);
    },

    getText: function () {
        return this.item.getText();
    },

    getKey: function () {

    }
});
BI.shortcut("bi.date_triangle_trigger", BI.DateTriangleTrigger);/**
 * 日期下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.DateCombo
 * @extends BI.Widget
 */
BI.DateCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-combo bi-border",
            height: 25
        });
    },
    _init: function () {
        BI.DateCombo.superclass._init.apply(this, arguments);
        var self = this,
            o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_trigger"
        });

        this.trigger.on(BI.DateTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });

        this.popup = BI.createWidget({
            type: "bi.date_calendar_popup"
        });

        this.popup.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                width: 270,
                el: this.popup,
                stopPropagation: false
            }
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.shortcut("bi.date_combo", BI.DateCombo);BI.DateTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        yearLength: 4,
        yearMonthLength: 7
    },

    _defaultConfig: function () {
        return BI.extend(BI.DateTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-date-trigger",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            height: 24
        });
    },
    _init: function () {
        BI.DateTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                var date = v.match(/\d+/g);
                self._autoAppend(v, date);
                return self._dateCheck(v) && BI.checkDateLegal(v) && self._checkVoid({
                    year: date[0],
                    month: date[1],
                    day: date[2]
                });
            },
            quitChecker: function () {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function () {
                if (self.editor.isEditing()) {
                    return BI.i18nText("BI-Date_Trigger_Error_Text");
                }
                return BI.i18nText("BI-Year_Trigger_Invalid_Text");
            }
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DateTrigger.EVENT_KEY_DOWN);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DateTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DateTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.DateTrigger.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DateTrigger.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setState(value);
            }

            if (BI.isNotEmptyString(value)) {
                var date = value.split("-");
                self.store_value = {
                    type: BI.DateTrigger.MULTI_DATE_CALENDAR,
                    value: {
                        year: date[0] | 0,
                        month: date[1] - 1,
                        day: date[2] | 0
                    }
                };
            }
            self.fireEvent(BI.DateTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DateTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTrigger.EVENT_CHANGE);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: BI.createWidget(),
                width: 30
            }, {
                el: this.editor
            }]
        });
        this.setValue(o.value);
    },
    _dateCheck: function (date) {
        return BI.parseDateTime(date, "%Y-%x-%d").print("%Y-%x-%d") == date || BI.parseDateTime(date, "%Y-%X-%d").print("%Y-%X-%d") == date || BI.parseDateTime(date, "%Y-%x-%e").print("%Y-%x-%e") == date || BI.parseDateTime(date, "%Y-%X-%e").print("%Y-%X-%e") == date;
    },
    _checkVoid: function (obj) {
        return !BI.checkDateVoid(obj.year, obj.month, obj.day, this.options.min, this.options.max)[0];
    },
    _autoAppend: function (v, dateObj) {
        var self = this;
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        var yearCheck = function (v) {
            return BI.parseDateTime(v, "%Y").print("%Y") == v && date >= self.options.min && date <= self.options.max;
        };
        var monthCheck = function (v) {
            return BI.parseDateTime(v, "%Y-%X").print("%Y-%X") == v && date >= self.options.min && date <= self.options.max;
        };
        if (BI.isNotNull(dateObj) && BI.checkDateLegal(v)) {
            switch (v.length) {
                case this._const.yearLength:
                    if (yearCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
                case this._const.yearMonthLength:
                    if (monthCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
            }
        }
    },

    setValue: function (v) {
        var type, value, self = this;
        var date = BI.getDate();
        this.store_value = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DateTrigger.MULTI_DATE_CALENDAR; value = v.value;
            if(BI.isNull(value)) {
                value = v;
            }
        }
        var _setInnerValue = function (date, text) {
            var dateStr = date.print("%Y-%x-%e");
            self.editor.setState(dateStr);
            self.editor.setValue(dateStr);
            self.setTitle(text + ":" + dateStr);
        };
        switch (type) {
            case BI.DateTrigger.MULTI_DATE_YEAR_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_PREV];
                date = BI.getDate((date.getFullYear() - 1 * value), date.getMonth(), date.getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_AFTER];
                date = BI.getDate((date.getFullYear() + 1 * value), date.getMonth(), date.getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_BEGIN];
                date = BI.getDate(date.getFullYear(), 0, 1);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_END];
                date = BI.getDate(date.getFullYear(), 11, 31);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_PREV];
                date = BI.getDate().getOffsetQuarter(-value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_AFTER];
                date = BI.getDate().getOffsetQuarter(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN];
                date = BI.getDate().getQuarterStartDate();
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_END];
                date = BI.getDate().getQuarterEndDate();
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_PREV];
                date = BI.getDate().getOffsetMonth(-value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_AFTER];
                date = BI.getDate().getOffsetMonth(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_BEGIN];
                date = BI.getDate(date.getFullYear(), date.getMonth(), 1);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_END];
                date = BI.getDate(date.getFullYear(), date.getMonth(), (date.getLastDateOfMonth()).getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_WEEK_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_PREV];
                date = date.getOffsetDate(-7 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_WEEK_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_AFTER];
                date = date.getOffsetDate(7 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_PREV];
                date = date.getOffsetDate(-1 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_AFTER];
                date = date.getOffsetDate(1 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_TODAY:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_TODAY];
                date = BI.getDate();
                _setInnerValue(date, text);
                break;
            default:
                if (BI.isNull(value) || BI.isNull(value.day)) {
                    this.editor.setState("");
                    this.editor.setValue("");
                    this.setTitle("");
                } else {
                    var dateStr = value.year + "-" + (value.month + 1) + "-" + value.day;
                    this.editor.setState(dateStr);
                    this.editor.setValue(dateStr);
                    this.setTitle(dateStr);
                }
                break;
        }
    },

    getKey: function () {
        return this.editor.getValue();
    },
    getValue: function () {
        return this.store_value;
    }

});

BI.DateTrigger.MULTI_DATE_YEAR_PREV = 1;
BI.DateTrigger.MULTI_DATE_YEAR_AFTER = 2;
BI.DateTrigger.MULTI_DATE_YEAR_BEGIN = 3;
BI.DateTrigger.MULTI_DATE_YEAR_END = 4;

BI.DateTrigger.MULTI_DATE_MONTH_PREV = 5;
BI.DateTrigger.MULTI_DATE_MONTH_AFTER = 6;
BI.DateTrigger.MULTI_DATE_MONTH_BEGIN = 7;
BI.DateTrigger.MULTI_DATE_MONTH_END = 8;

BI.DateTrigger.MULTI_DATE_QUARTER_PREV = 9;
BI.DateTrigger.MULTI_DATE_QUARTER_AFTER = 10;
BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN = 11;
BI.DateTrigger.MULTI_DATE_QUARTER_END = 12;

BI.DateTrigger.MULTI_DATE_WEEK_PREV = 13;
BI.DateTrigger.MULTI_DATE_WEEK_AFTER = 14;

BI.DateTrigger.MULTI_DATE_DAY_PREV = 15;
BI.DateTrigger.MULTI_DATE_DAY_AFTER = 16;
BI.DateTrigger.MULTI_DATE_DAY_TODAY = 17;

BI.DateTrigger.MULTI_DATE_PARAM = 18;
BI.DateTrigger.MULTI_DATE_CALENDAR = 19;

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM = {};
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_PREV] = BI.i18nText("BI-Multi_Date_Year_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_AFTER] = BI.i18nText("BI-Multi_Date_Year_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_BEGIN] = BI.i18nText("BI-Multi_Date_Year_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_END] = BI.i18nText("BI-Multi_Date_Year_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_PREV] = BI.i18nText("BI-Multi_Date_Quarter_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_AFTER] = BI.i18nText("BI-Multi_Date_Quarter_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN] = BI.i18nText("BI-Multi_Date_Quarter_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_END] = BI.i18nText("BI-Multi_Date_Quarter_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_PREV] = BI.i18nText("BI-Multi_Date_Month_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_AFTER] = BI.i18nText("BI-Multi_Date_Month_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_BEGIN] = BI.i18nText("BI-Multi_Date_Month_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_END] = BI.i18nText("BI-Multi_Date_Month_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_PREV] = BI.i18nText("BI-Multi_Date_Week_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_AFTER] = BI.i18nText("BI-Multi_Date_Week_Next");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_PREV] = BI.i18nText("BI-Multi_Date_Day_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_AFTER] = BI.i18nText("BI-Multi_Date_Day_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_TODAY] = BI.i18nText("BI-Multi_Date_Today");

BI.DateTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DateTrigger.EVENT_START = "EVENT_START";
BI.DateTrigger.EVENT_STOP = "EVENT_STOP";
BI.DateTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DateTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateTrigger.EVENT_VALID = "EVENT_VALID";
BI.DateTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DateTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.DateTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.shortcut("bi.date_trigger", BI.DateTrigger);/**
 * Created by zcf on 2017/2/20.
 */
BI.StaticDatePaneCard = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.StaticDatePaneCard.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-pane",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            selectedTime: null
        });
    },
    _init: function () {
        BI.StaticDatePaneCard.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.today = BI.getDate();
        this._year = this.today.getFullYear();
        this._month = this.today.getMonth();

        this.selectedTime = o.selectedTime || {
            year: this._year,
            month: this._month
        };

        this.datePicker = BI.createWidget({
            type: "bi.date_picker",
            min: o.min,
            max: o.max
        });
        this.datePicker.on(BI.DatePicker.EVENT_CHANGE, function () {
            var value = self.datePicker.getValue();
            var monthDay = BI.getDate(value.year, value.month - 1, 1).getMonthDays();
            var day = self.selectedTime.day || 0;
            if (day > monthDay) {
                day = monthDay;
            }
            self.selectedTime = {
                year: value.year,
                month: value.month,
                day: day
            };
            self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
            self.calendar.setValue(self.selectedTime);
        });

        this.calendar = BI.createWidget({
            direction: "top",
            element: this,
            logic: {
                dynamic: false
            },
            type: "bi.navigation",
            tab: this.datePicker,
            cardCreator: BI.bind(this._createNav, this)
        });
        this.calendar.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedTime = self.calendar.getValue();
            self.calendar.empty();
            self.setValue(self.selectedTime);
            self.fireEvent(BI.DateCalendarPopup.EVENT_CHANGE);
        });
        this.setValue(o.selectedTime);

    },

    _createNav: function (v) {
        var date = BI.Calendar.getDateJSONByPage(v);
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: false
            },
            min: this.options.min,
            max: this.options.max,
            year: date.year,
            month: date.month,
            day: this.selectedTime.day
        });
        return calendar;
    },

    _getNewCurrentDate: function () {
        var today = BI.getDate();
        return {
            year: today.getFullYear(),
            month: today.getMonth()
        };
    },

    _setCalenderValue: function (date) {
        this.calendar.setSelect(BI.Calendar.getPageByDateJSON(date));
        this.calendar.setValue(date);
        this.selectedTime = date;
    },

    _setDatePicker: function (timeOb) {
        if (BI.isNull(timeOb) || BI.isNull(timeOb.year) || BI.isNull(timeOb.month)) {
            this.datePicker.setValue(this._getNewCurrentDate());
        } else {
            this.datePicker.setValue(timeOb);
        }
    },

    _setCalendar: function (timeOb) {
        if (BI.isNull(timeOb) || BI.isNull(timeOb.day)) {
            this.calendar.empty();
            this._setCalenderValue(this._getNewCurrentDate());
        } else {
            this._setCalenderValue(timeOb);
        }
    },

    setValue: function (timeOb) {
        this._setDatePicker(timeOb);
        this._setCalendar(timeOb);
    },

    getValue: function () {
        return this.selectedTime;
    }

});
BI.shortcut("bi.static_date_pane_card", BI.StaticDatePaneCard);BI.DynamicDatePane = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-dynamic-date-pane"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                el: {
                    type: "bi.linear_segment",
                    cls: "bi-border-bottom",
                    height: 30,
                    items: BI.createItems([{
                        text: BI.i18nText("BI-Multi_Date_YMD"),
                        value: BI.DynamicDatePane.Static
                    }, {
                        text: BI.i18nText("BI-Basic_Dynamic_Title"),
                        value: BI.DynamicDatePane.Dynamic
                    }], {
                        textAlign: "center"
                    }),
                    listeners: [{
                        eventName: BI.ButtonGroup.EVENT_CHANGE,
                        action: function () {
                            var value = this.getValue()[0];
                            self.dateTab.setSelect(value);
                            switch (value) {
                                case BI.DynamicDatePane.Static:
                                    var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                                    self.ymd.setValue({
                                        year: date.getFullYear(),
                                        month: date.getMonth(),
                                        day: date.getDate()
                                    });
                                    break;
                                case BI.DynamicDatePane.Dynamic:
                                    self.dynamicPane.setValue({
                                        year: 0
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }
                    }],
                    ref: function () {
                        self.switcher = this;
                    }
                },
                height: 30
            }, {
                type: "bi.tab",
                ref: function () {
                    self.dateTab = this;
                },
                showIndex: BI.DynamicDatePane.Static,
                cardCreator: function (v) {
                    switch (v) {
                        case BI.DynamicDatePane.Static:
                            return {
                                type: "bi.static_date_pane_card",
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self.fireEvent("EVENT_CHANGE");
                                    }
                                }],
                                ref: function () {
                                    self.ymd = this;
                                }
                            };
                        case BI.DynamicDatePane.Dynamic:
                        default:
                            return {
                                type: "bi.dynamic_date_card",
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self.fireEvent("EVENT_CHANGE");
                                    }
                                }],
                                ref: function () {
                                    self.dynamicPane = this;
                                }
                            };
                    }
                }
            }]
        };
    },

    mounted: function () {
        this.setValue(this.options.value);
    },

    _checkValueValid: function (value) {
        return BI.isNull(value) || BI.isEmptyObject(value) || BI.isEmptyString(value);
    },

    setValue: function (v) {
        v = v || {};
        var type = v.type || BI.DynamicDateCombo.Static;
        var value = v.value || v;
        this.switcher.setValue(type);
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.dynamicPane.setValue(value);
                break;
            case BI.DynamicDateCombo.Static:
            default:
                if (this._checkValueValid(value)) {
                    var date = BI.getDate();
                    this.ymd.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth()
                    });
                } else {
                    this.ymd.setValue(value);
                }
                break;
        }
    },

    getValue: function () {
        return {
            type: this.dateTab.getSelect(),
            value: this.dateTab.getValue()
        };
    }
});
BI.shortcut("bi.dynamic_date_pane", BI.DynamicDatePane);

BI.extend(BI.DynamicDatePane, {
    Static: 1,
    Dynamic: 2
});/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimeCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 290,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1,
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },
    _defaultConfig: function () {
        return BI.extend(BI.DateTimeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-time-combo bi-border",
            width: 200,
            height: 24
        });
    },
    _init: function () {
        BI.DateTimeCombo.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        var date = BI.getDate();
        this.storeValue = BI.isNotNull(opts.value) ? opts.value : {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
        this.trigger = BI.createWidget({
            type: "bi.date_time_trigger",
            min: this.constants.DATE_MIN_VALUE,
            max: this.constants.DATE_MAX_VALUE,
            value: opts.value
        });

        this.popup = BI.createWidget({
            type: "bi.date_time_popup",
            min: this.constants.DATE_MIN_VALUE,
            max: this.constants.DATE_MAX_VALUE,
            value: opts.value
        });
        self.setValue(this.storeValue);

        this.popup.on(BI.DateTimePopup.BUTTON_CANCEL_EVENT_CHANGE, function () {
            self.setValue(self.storeValue);
            self.hidePopupView();
            self.fireEvent(BI.DateTimeCombo.EVENT_CANCEL);
        });
        this.popup.on(BI.DateTimePopup.BUTTON_OK_EVENT_CHANGE, function () {
            self.storeValue = self.popup.getValue();
            self.setValue(self.storeValue);
            self.hidePopupView();
            self.fireEvent(BI.DateTimeCombo.EVENT_CONFIRM);
        });
        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            adjustLength: this.constants.comboAdjustHeight,
            popup: {
                el: this.popup,
                width: this.constants.popupWidth,
                stopPropagation: false
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.DateTimeCombo.EVENT_BEFORE_POPUPVIEW);
        });

        var triggerBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "bi-trigger-icon-button date-font bi-border-right",
            width: 24,
            height: 24
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: this.combo,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, {
                    el: triggerBtn,
                    top: 0,
                    left: 0
                }]
            }]
        });
    },

    setValue: function (v) {
        this.storeValue = v;
        this.popup.setValue(v);
        this.trigger.setValue(v);
    },
    getValue: function () {
        return this.storeValue;
    },

    hidePopupView: function () {
        this.combo.hideView();
    }
});

BI.DateTimeCombo.EVENT_CANCEL = "EVENT_CANCEL";
BI.DateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DateTimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateTimeCombo.EVENT_BEFORE_POPUPVIEW = "BI.DateTimeCombo.EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.date_time_combo", BI.DateTimeCombo);
/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimePopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateTimePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-time-popup",
            width: 268,
            height: 374
        });
    },
    _init: function () {
        BI.DateTimePopup.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.cancelButton = BI.createWidget({
            type: "bi.text_button",
            forceCenter: true,
            cls: "multidate-popup-button bi-border-top bi-border-right",
            shadow: true,
            text: BI.i18nText("BI-Basic_Cancel")
        });
        this.cancelButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.BUTTON_CANCEL_EVENT_CHANGE);
        });

        this.okButton = BI.createWidget({
            type: "bi.text_button",
            forceCenter: true,
            cls: "multidate-popup-button bi-border-top",
            shadow: true,
            text: BI.i18nText("BI-Basic_OK")
        });
        this.okButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.BUTTON_OK_EVENT_CHANGE);
        });

        this.dateCombo = BI.createWidget({
            type: "bi.date_calendar_popup",
            min: self.options.min,
            max: self.options.max
        });
        self.dateCombo.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
        });

        this.dateSelect = BI.createWidget({
            type: "bi.vertical_adapt",
            cls: "bi-border-top",
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Basic_Time"),
                width: 45
            }, {
                type: "bi.date_time_select",
                max: 23,
                min: 0,
                width: 60,
                height: 30,
                listeners: [{
                    eventName: BI.DateTimeSelect.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
                    }
                }],
                ref: function (_ref) {
                    self.hour = _ref;
                }
            }, {
                type: "bi.label",
                text: ":",
                width: 15
            }, {
                type: "bi.date_time_select",
                max: 59,
                min: 0,
                width: 60,
                height: 30,
                listeners: [{
                    eventName: BI.DateTimeSelect.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
                    }
                }],
                ref: function (_ref) {
                    self.minute = _ref;
                }
            }, {
                type: "bi.label",
                text: ":",
                width: 15
            }, {
                type: "bi.date_time_select",
                max: 59,
                min: 0,
                width: 60,
                height: 30,
                listeners: [{
                    eventName: BI.DateTimeSelect.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
                    }
                }],
                ref: function (_ref) {
                    self.second = _ref;
                }
            }]
        });

        this.setValue(opts.value);

        this.dateButton = BI.createWidget({
            type: "bi.grid",
            items: [[this.cancelButton, this.okButton]]
        });
        BI.createWidget({
            element: this,
            type: "bi.vtape",
            items: [{
                el: this.dateCombo
            }, {
                el: this.dateSelect,
                height: 50
            }, {
                el: this.dateButton,
                height: 30
            }]
        });
    },

    setValue: function (v) {
        var value = v, date;
        if (BI.isNull(value)) {
            date = BI.getDate();
            this.dateCombo.setValue({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            });
            this.hour.setValue(date.getHours());
            this.minute.setValue(date.getMinutes());
            this.second.setValue(date.getSeconds());
        } else {
            this.dateCombo.setValue({
                year: value.year,
                month: value.month,
                day: value.day
            });
            this.hour.setValue(value.hour);
            this.minute.setValue(value.minute);
            this.second.setValue(value.second);
        }
    },

    getValue: function () {
        return {
            year: this.dateCombo.getValue().year,
            month: this.dateCombo.getValue().month,
            day: this.dateCombo.getValue().day,
            hour: this.hour.getValue(),
            minute: this.minute.getValue(),
            second: this.second.getValue()
        };
    }
});
BI.DateTimePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DateTimePopup.BUTTON_CANCEL_EVENT_CHANGE = "BUTTON_CANCEL_EVENT_CHANGE";
BI.DateTimePopup.CALENDAR_EVENT_CHANGE = "CALENDAR_EVENT_CHANGE";
BI.shortcut("bi.date_time_popup", BI.DateTimePopup);
/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimeSelect = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateTimeSelect.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-time-select bi-border",
            max: 23,
            min: 0
        });
    },

    _init: function () {
        BI.DateTimeSelect.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            value: this._alertInEditorValue(o.min),
            allowBlank: false,
            errorText: BI.i18nText("BI-Please_Input_Natural_Number"),
            validationChecker: function (v) {
                return BI.isNaturalNumber(v);
            }
        });
        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self._finetuning(0);
            self.fireEvent(BI.DateTimeSelect.EVENT_CONFIRM);
        });
        this.topBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "column-pre-page-h-font top-button bi-border-left bi-border-bottom"
        });
        this.topBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(1);
            self.fireEvent(BI.DateTimeSelect.EVENT_CONFIRM);
        });
        this.bottomBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "column-next-page-h-font bottom-button bi-border-left"
        });
        this.bottomBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(-1);
            self.fireEvent(BI.DateTimeSelect.EVENT_CONFIRM);
        });
        this._finetuning(0);
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [this.editor, {
                el: {
                    type: "bi.grid",
                    columns: 1,
                    rows: 2,
                    items: [{
                        column: 0,
                        row: 0,
                        el: this.topBtn
                    }, {
                        column: 0,
                        row: 1,
                        el: this.bottomBtn
                    }]
                },
                width: 30
            }]
        });
    },

    _alertOutEditorValue: function (v) {
        if (v > this.options.max) {
            v = this.options.min;
        }
        if (v < this.options.min) {
            v = this.options.max;
        }
        return BI.parseInt(v);
    },

    _alertInEditorValue: function (v) {
        if (v > this.options.max) {
            v = this.options.min;
        }
        if (v < this.options.min) {
            v = this.options.max;
        }
        v = v < 10 ? "0" + v : v;
        return v;
    },

    _finetuning: function (add) {
        var v = BI.parseInt(this._alertOutEditorValue(this.editor.getValue()));
        this.editor.setValue(this._alertInEditorValue(v + add));
    },

    getValue: function () {
        var v = this.editor.getValue();
        return this._alertOutEditorValue(v);
    },

    setValue: function (v) {
        this.editor.setValue(this._alertInEditorValue(v));
        this._finetuning(0);
    }

});
BI.DateTimeSelect.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.date_time_select", BI.DateTimeSelect);/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimeTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.DateTimeTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-date-time-trigger",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            height: 24,
            width: 200
        });
    },
    _init: function () {
        BI.DateTimeTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            height: o.height,
            width: o.width,
            hgap: c.hgap
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: BI.createWidget(),
                width: o.height
            }, {
                el: this.text
            }]
        });
        this.setValue(o.value);
    },

    _printTime: function (v) {
        return v < 10 ? "0" + v : v;
    },

    setValue: function (v) {
        var self = this;
        var value = v, dateStr;
        if(BI.isNull(value)) {
            value = BI.getDate();
            dateStr = value.print("%Y-%X-%d %H:%M:%S");
        } else {
            var date = BI.getDate(value.year, value.month - 1, value.day, value.hour, value.minute, value.second);
            dateStr = date.print("%Y-%X-%d %H:%M:%S");

        }
        this.text.setText(dateStr);
        this.text.setTitle(dateStr);
    }

});
BI.shortcut("bi.date_time_trigger", BI.DateTimeTrigger);BI.StaticDateTimePaneCard = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.StaticDateTimePaneCard.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-time-pane",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            selectedTime: null
        });
    },
    _init: function () {
        BI.StaticDateTimePaneCard.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.today = BI.getDate();
        this._year = this.today.getFullYear();
        this._month = this.today.getMonth();

        this.selectedTime = o.selectedTime || {
            year: this._year,
            month: this._month
        };

        this.datePicker = BI.createWidget({
            type: "bi.date_picker",
            min: o.min,
            max: o.max
        });
        this.datePicker.on(BI.DatePicker.EVENT_CHANGE, function () {
            self.selectedTime = BI.extend(self.datePicker.getValue(), self.timeSelect.getValue());
            self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
        });

        this.calendar = BI.createWidget({
            direction: "top",
            logic: {
                dynamic: false
            },
            type: "bi.navigation",
            tab: this.datePicker,
            cardCreator: BI.bind(this._createNav, this)
        });
        this.calendar.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedTime = BI.extend(self.calendar.getValue(), self.timeSelect.getValue());
            self.calendar.empty();
            self.setValue(self.selectedTime);
            self.fireEvent(BI.DateCalendarPopup.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [this.calendar, {
                el: {
                    type: "bi.dynamic_date_time_select",
                    ref: function () {
                        self.timeSelect = this;
                    }
                },
                height: 40
            }]
        });
        this.setValue(o.selectedTime);

    },

    _createNav: function (v) {
        var date = BI.Calendar.getDateJSONByPage(v);
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: false
            },
            min: this.options.min,
            max: this.options.max,
            year: date.year,
            month: date.month,
            day: this.selectedTime.day
        });
        return calendar;
    },

    _getNewCurrentDate: function () {
        var today = BI.getDate();
        return {
            year: today.getFullYear(),
            month: today.getMonth()
        };
    },

    _setCalenderValue: function (date) {
        this.calendar.setSelect(BI.Calendar.getPageByDateJSON(date));
        this.calendar.setValue(date);
        this.selectedTime = BI.extend(date, this.timeSelect.getValue());
    },

    _setDatePicker: function (timeOb) {
        if (BI.isNull(timeOb) || BI.isNull(timeOb.year) || BI.isNull(timeOb.month)) {
            this.datePicker.setValue(this._getNewCurrentDate());
        } else {
            this.datePicker.setValue(timeOb);
        }
    },

    _setCalendar: function (timeOb) {
        if (BI.isNull(timeOb) || BI.isNull(timeOb.day)) {
            this.calendar.empty();
            this._setCalenderValue(this._getNewCurrentDate());
        } else {
            this._setCalenderValue(timeOb);
        }
    },

    setValue: function (timeOb) {
        timeOb = timeOb || {};
        this._setDatePicker(timeOb);
        this._setCalendar(timeOb);
        this.timeSelect.setValue({
            hour: timeOb.hour,
            minute: timeOb.minute,
            second: timeOb.second
        });
    },

    getValue: function () {
        return this.selectedTime;
    }

});
BI.shortcut("bi.static_date_time_pane_card", BI.StaticDateTimePaneCard);BI.DynamicDateTimePane = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-dynamic-date-pane"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                el: {
                    type: "bi.linear_segment",
                    cls: "bi-border-bottom",
                    height: 30,
                    items: BI.createItems([{
                        text: BI.i18nText("BI-Multi_Date_YMD"),
                        value: BI.DynamicDateTimePane.Static
                    }, {
                        text: BI.i18nText("BI-Basic_Dynamic_Title"),
                        value: BI.DynamicDateTimePane.Dynamic
                    }], {
                        textAlign: "center"
                    }),
                    listeners: [{
                        eventName: BI.ButtonGroup.EVENT_CHANGE,
                        action: function () {
                            var value = this.getValue()[0];
                            self.dateTab.setSelect(value);
                            switch (value) {
                                case BI.DynamicDateTimePane.Static:
                                    var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                                    self.ymd.setValue({
                                        year: date.getFullYear(),
                                        month: date.getMonth(),
                                        day: date.getDate()
                                    });
                                    break;
                                case BI.DynamicDateTimePane.Dynamic:
                                    self.dynamicPane.setValue({
                                        year: 0
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }
                    }],
                    ref: function () {
                        self.switcher = this;
                    }
                },
                height: 30
            }, {
                type: "bi.tab",
                ref: function () {
                    self.dateTab = this;
                },
                showIndex: BI.DynamicDateTimePane.Static,
                cardCreator: function (v) {
                    switch (v) {
                        case BI.DynamicDateTimePane.Static:
                            return {
                                type: "bi.static_date_time_pane_card",
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self.fireEvent("EVENT_CHANGE");
                                    }
                                }],
                                ref: function () {
                                    self.ymd = this;
                                }
                            };
                        case BI.DynamicDateTimePane.Dynamic:
                        default:
                            return {
                                type: "bi.dynamic_date_card",
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self.fireEvent("EVENT_CHANGE");
                                    }
                                }],
                                ref: function () {
                                    self.dynamicPane = this;
                                }
                            };
                    }
                }
            }]
        };
    },

    mounted: function () {
        this.setValue(this.options.value);
    },

    _checkValueValid: function (value) {
        return BI.isNull(value) || BI.isEmptyObject(value) || BI.isEmptyString(value);
    },

    setValue: function (v) {
        v = v || {};
        var type = v.type || BI.DynamicDateTimePane.Static;
        var value = v.value || v;
        this.switcher.setValue(type);
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateTimePane.Dynamic:
                this.dynamicPane.setValue(value);
                break;
            case BI.DynamicDateTimePane.Static:
            default:
                if (this._checkValueValid(value)) {
                    var date = BI.getDate();
                    this.ymd.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth()
                    });
                } else {
                    this.ymd.setValue(value);
                }
                break;
        }
    },

    getValue: function () {
        return {
            type: this.dateTab.getSelect(),
            value: this.dateTab.getValue()
        };
    }
});
BI.shortcut("bi.dynamic_date_time_pane", BI.DynamicDateTimePane);

BI.extend(BI.DynamicDateTimePane, {
    Static: 1,
    Dynamic: 2
});/**
 * Created by roy on 15/8/14.
 */
BI.DownListCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DownListCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-combo",
            height: 24,
            items: [],
            adjustLength: 0,
            direction: "bottom",
            trigger: "click",
            container: null,
            stopPropagation: false,
            el: {}
        });
    },

    _init: function () {
        BI.DownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popupview = BI.createWidget({
            type: "bi.down_list_popup",
            items: o.items,
            chooseType: o.chooseType,
            value: o.value
        });

        this.popupview.on(BI.DownListPopup.EVENT_CHANGE, function (value) {
            self.fireEvent(BI.DownListCombo.EVENT_CHANGE, value);
            self.downlistcombo.hideView();
        });

        this.popupview.on(BI.DownListPopup.EVENT_SON_VALUE_CHANGE, function (value, fatherValue) {
            self.fireEvent(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, value, fatherValue);
            self.downlistcombo.hideView();
        });


        this.downlistcombo = BI.createWidget({
            element: this,
            type: "bi.combo",
            trigger: o.trigger,
            isNeedAdjustWidth: false,
            container: o.container,
            adjustLength: o.adjustLength,
            direction: o.direction,
            stopPropagation: o.stopPropagation,
            el: BI.createWidget(o.el, {
                type: "bi.icon_trigger",
                extraCls: o.iconCls ? o.iconCls : "pull-down-font",
                width: o.width,
                height: o.height
            }),
            popup: {
                el: this.popupview,
                stopPropagation: true,
                maxHeight: 1000
            }
        });

        this.downlistcombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.DownListCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    hideView: function () {
        this.downlistcombo.hideView();
    },

    showView: function () {
        this.downlistcombo.showView();
    },

    populate: function (items) {
        this.popupview.populate(items);
    },

    setValue: function (v) {
        this.popupview.setValue(v);
    },
    getValue: function () {
        return this.popupview.getValue();
    }
});
BI.DownListCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DownListCombo.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.DownListCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.down_list_combo", BI.DownListCombo);/**
 * Created by roy on 15/9/6.
 */
BI.DownListGroup = BI.inherit(BI.Widget, {
    constants: {
        iconCls: "check-mark-ha-font"
    },
    _defaultConfig: function () {
        return BI.extend(BI.DownListGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-group",
            items: [
                {
                    el: {}
                }
            ]
        });
    },
    _init: function () {
        BI.DownListGroup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;

        this.downlistgroup = BI.createWidget({
            element: this,
            type: "bi.button_tree",
            items: o.items,
            chooseType: 0, // 0单选，1多选
            layouts: [{
                type: "bi.vertical",
                hgap: 0,
                vgap: 0
            }],
            value: o.value
        });
        this.downlistgroup.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if(type === BI.Events.CLICK) {
                self.fireEvent(BI.DownListGroup.EVENT_CHANGE, arguments);
            }
        });
    },
    getValue: function () {
        return this.downlistgroup.getValue();
    },
    setValue: function (v) {
        this.downlistgroup.setValue(v);
    }


});
BI.DownListGroup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_group", BI.DownListGroup);BI.DownListItem = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.DownListItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-item bi-list-item-active",
            cls: "",
            height: 25,
            logic: {
                dynamic: true
            },
            selected: false,
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.DownListItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.icon_text_item",
            element: this,
            height: o.height,
            text: o.text,
            value: o.value,
            logic: o.logic,
            selected: o.selected,
            disabled: o.disabled,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            textHgap: o.textHgap,
            textVgap: o.textVgap,
            textLgap: o.textLgap,
            textRgap: o.textRgap,
            father: o.father,
            bubble: o.bubble
        });
        this.text.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.text.on(BI.IconTextItem.EVENT_CHANGE, function () {
            self.fireEvent(BI.DownListItem.EVENT_CHANGE);
        });
        // this.setSelected(o.selected);
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    isSelected: function () {
        return this.text.isSelected();
    },

    setSelected: function (b) {
        this.text.setSelected(b);
        // if (b === true) {
        //     this.element.addClass("dot-e-font");
        // } else {
        //     this.element.removeClass("dot-e-font");
        // }
    },

    setValue: function (v) {
        this.text.setValue(v);
    },

    getValue: function () {
        return this.text.getValue();
    }
});
BI.DownListItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_item", BI.DownListItem);BI.DownListGroupItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.DownListGroupItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-down-list-group-item",
            logic: {
                dynamic: false
            },
            // invalid: true,
            iconCls1: "dot-e-font",
            iconCls2: "pull-right-e-font"
        });
    },
    _init: function () {
        BI.DownListGroupItem.superclass._init.apply(this, arguments);
        var o = this.options;
        var self = this;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-group-item-text",
            textAlign: "left",
            text: o.text,
            value: o.value,
            height: o.height
        });

        this.icon1 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls1,
            width: 25,
            forceNotSelected: true,
            selected: this._digest(o.value)
        });

        this.icon2 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls2,
            width: 25,
            forceNotSelected: true
        });

        var blank = BI.createWidget({
            type: "bi.layout",
            width: 25
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.icon2,
                top: 0,
                bottom: 0,
                right: 0
            }]
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", this.icon1, this.text, blank)
        }))));

        this.element.hover(function () {
            if (self.isEnabled()) {
                self.hover();
            }
        }, function () {
            if (self.isEnabled()) {
                self.dishover();
            }
        });
    },

    _digest: function (v) {
        var self = this, o = this.options;
        v = BI.isArray(v) ? v : [v];
        return BI.any(v, function (idx, value) {
            return BI.contains(o.childValues, value);
        });
    },

    hover: function () {
        BI.DownListGroupItem.superclass.hover.apply(this, arguments);
        this.icon1.element.addClass("hover");
        this.icon2.element.addClass("hover");

    },

    dishover: function () {
        BI.DownListGroupItem.superclass.dishover.apply(this, arguments);
        this.icon1.element.removeClass("hover");
        this.icon2.element.removeClass("hover");
    },

    doClick: function () {
        BI.DownListGroupItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.DownListGroupItem.EVENT_CHANGE, this.getValue());
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    setValue: function (v) {
        this.icon1.setSelected(this._digest(v));
    }
});
BI.DownListGroupItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_group_item", BI.DownListGroupItem);/**
 * Created by roy on 15/9/8.
 * 处理popup中的item分组样式
 * 一个item分组中的成员大于一时，该分组设置为单选，并且默认状态第一个成员设置为已选择项
 */
BI.DownListPopup = BI.inherit(BI.Pane, {
    constants: {
        nextIcon: "pull-right-e-font",
        height: 25,
        iconHeight: 12,
        iconWidth: 12,
        hgap: 0,
        vgap: 0,
        border: 1
    },
    _defaultConfig: function () {
        var conf = BI.DownListPopup.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-popup",
            items: [],
            chooseType: BI.Selection.Multi
        });
    },
    _init: function () {
        BI.DownListPopup.superclass._init.apply(this, arguments);
        this.singleValues = [];
        this.childValueMap = {};
        this.fatherValueMap = {};
        var self = this, o = this.options, children = this._createChildren(o.items);
        this.popup = BI.createWidget({
            type: "bi.button_tree",
            items: BI.createItems(children,
                {}, {
                    adjustLength: -2
                }
            ),
            layouts: [{
                type: "bi.vertical",
                hgap: this.constants.hgap,
                vgap: this.constants.vgap
            }],
            value: this._digest(o.value),
            chooseType: o.chooseType
        });

        this.popup.on(BI.ButtonTree.EVENT_CHANGE, function (value, object) {
            var changedValue = value;
            if (BI.isNotNull(self.childValueMap[value])) {
                changedValue = self.childValueMap[value];
                self.fireEvent(BI.DownListPopup.EVENT_SON_VALUE_CHANGE, changedValue, self.fatherValueMap[value]);
            } else {
                self.fireEvent(BI.DownListPopup.EVENT_CHANGE, changedValue, object);
            }


            if (!self.singleValues.contains(changedValue)) {
                var item = self.getValue();
                var result = [];
                BI.each(item, function (i, valueObject) {
                    if (valueObject.value != changedValue) {
                        result.push(valueObject);
                    }
                });
                self.setValue(result);
            }

        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });

    },
    _createChildren: function (items) {
        var self = this, result = [];
        // 不能修改populate进来的item的引用
        BI.each(BI.deepClone(items), function (i, it) {
            var item_done = {
                type: "bi.down_list_group",
                items: []
            };

            BI.each(it, function (i, item) {
                if (BI.isNotEmptyArray(item.children) && !BI.isEmpty(item.el)) {
                    item.type = "bi.combo_group";
                    item.cls = "down-list-group";
                    item.trigger = "hover";
                    item.isNeedAdjustWidth = false;
                    item.el.title = item.el.title || item.el.text;
                    item.el.type = "bi.down_list_group_item";
                    item.el.logic = {
                        dynamic: true
                    };
                    item.el.height = self.constants.height;
                    item.el.iconCls2 = self.constants.nextIcon;
                    item.popup = {
                        lgap: 4,
                        el: {
                            type: "bi.button_tree",
                            chooseType: 0,
                            layouts: [{
                                type: "bi.vertical"
                            }]

                        }
                    };
                    item.el.childValues = [];
                    BI.each(item.children, function (i, child) {
                        var fatherValue = BI.deepClone(item.el.value);
                        var childValue = BI.deepClone(child.value);
                        self.singleValues.push(child.value);
                        child.type = "bi.down_list_item";
                        child.extraCls = " child-down-list-item";
                        child.title = child.title || child.text;
                        child.textRgap = 10;
                        child.isNeedAdjustWidth = false;
                        child.logic = {
                            dynamic: true
                        };
                        child.father = fatherValue;
                        self.fatherValueMap[self._createChildValue(fatherValue, childValue)] = fatherValue;
                        self.childValueMap[self._createChildValue(fatherValue, childValue)] = childValue;
                        child.value = self._createChildValue(fatherValue, childValue);
                        item.el.childValues.push(child.value);
                    });
                } else {
                    item.type = "bi.down_list_item";
                    item.title = item.title || item.text;
                    item.textRgap = 10;
                    item.isNeedAdjustWidth = false;
                    item.logic = {
                        dynamic: true
                    };
                }
                var el_done = {};
                el_done.el = item;
                item_done.items.push(el_done);
            });
            if (self._isGroup(item_done.items)) {
                BI.each(item_done.items, function (i, item) {
                    self.singleValues.push(item.el.value);
                });
            }

            result.push(item_done);
            if (self._needSpliter(i, items.length)) {
                var spliter_container = BI.createWidget({
                    type: "bi.vertical",
                    items: [{
                        el: {
                            type: "bi.layout",
                            cls: "bi-down-list-spliter bi-border-top cursor-pointer",
                            height: 0
                        }

                    }],
                    cls: "bi-down-list-spliter-container cursor-pointer",
                    lgap: 10,
                    rgap: 10
                });
                result.push(spliter_container);
            }
        });
        return result;
    },

    _isGroup: function (i) {
        return i.length > 1;
    },

    _needSpliter: function (i, itemLength) {
        return i < itemLength - 1;
    },

    _createChildValue: function (fatherValue, childValue) {
        return fatherValue + "_" + childValue;
    },

    _digest: function (valueItem) {
        var self = this;
        var valueArray = [];
        BI.each(valueItem, function (i, item) {
                var value;
                if (BI.isNotNull(item.childValue)) {
                    value = self._createChildValue(item.value, item.childValue);
                } else {
                    value = item.value;
                }
                valueArray.push(value);
            }
        );
        return valueArray;
    },

    _checkValues: function (values) {
        var self = this, o = this.options;
        var value = [];
        BI.each(o.items, function (idx, itemGroup) {
            BI.each(itemGroup, function (id, item) {
                if(BI.isNotNull(item.children)) {
                    var childValues = BI.map(item.children, "value");
                    var v = joinValue(childValues, values[idx]);
                    if(BI.isNotEmptyString(v)) {
                        value.push(v);
                    }
                }else{
                    if(item.value === values[idx][0]) {
                        value.push(values[idx][0]);
                    }
                }
            });
        });
        return value;

        function joinValue (sources, targets) {
            var value = "";
            BI.some(sources, function (idx, s) {
                return BI.some(targets, function (id, t) {
                    if(s === t) {
                        value = s;
                        return true;
                    }
                });
            });
            return value;
        }
    },

    populate: function (items) {
        BI.DownListPopup.superclass.populate.apply(this, arguments);
        var self = this;
        self.childValueMap = {};
        self.fatherValueMap = {};
        self.singleValues = [];
        var children = self._createChildren(items);
        var popupItem = BI.createItems(children,
            {}, {
                adjustLength: -2
            }
        );
        self.popup.populate(popupItem);
    },

    setValue: function (valueItem) {
        this.popup.setValue(this._digest(valueItem));
    },

    _getValue: function () {
        var v = [];
        BI.each(this.popup.getAllButtons(), function (i, item) {
            i % 2 === 0 && v.push(item.getValue());
        });
        return v;
    },

    getValue: function () {
        var self = this, result = [];
        var values = this._checkValues(this._getValue());
        BI.each(values, function (i, value) {
            var valueItem = {};
            if (BI.isNotNull(self.childValueMap[value])) {
                var fartherValue = self.fatherValueMap[value];
                valueItem.childValue = self.childValueMap[value];
                valueItem.value = fartherValue;
            } else {
                valueItem.value = value;
            }
            result.push(valueItem);
        });
        return result;
    }


});

BI.DownListPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.DownListPopup.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.shortcut("bi.down_list_popup", BI.DownListPopup);/**
 * 汇总表格帮助类
 * Created by Young's on 2017/1/19.
 */
!(function () {
    BI.DynamicDateHelper = {};
    BI.extend(BI.DynamicDateHelper, {
        getCalculation: function (obj) {
            var date = BI.getDate();
            if (BI.isNotNull(obj.year)) {
                date = BI.getDate((date.getFullYear() + BI.parseInt(obj.year)), date.getMonth(), date.getDate());
            }
            if (BI.isNotNull(obj.quarter)) {
                date = date.getOffsetQuarter(BI.parseInt(obj.quarter));
            }
            if (BI.isNotNull(obj.month)) {
                date = date.getOffsetMonth(BI.parseInt(obj.month));
            }
            if (BI.isNotNull(obj.week)) {
                date = date.getOffsetDate(BI.parseInt(obj.week) * 7);
            }
            if (BI.isNotNull(obj.day)) {
                date = date.getOffsetDate(BI.parseInt(obj.day));
            }
            if (BI.isNotNull(obj.workDay)) {
                // todo 根据工作日做偏移 暂时按天偏移
                date = date.getOffsetDate(BI.parseInt(obj.workDay));
            }
            if (BI.isNotNull(obj.position) && obj.position !== BI.DynamicDateCard.OFFSET.CURRENT) {
                date = this.getBeginDate(date, obj);
            }
            return date;
        },

        getBeginDate: function (date, obj) {
            if (BI.isNotNull(obj.day)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), date.getMonth(), 1) : BI.getDate(date.getFullYear(), date.getMonth(), (date.getLastDateOfMonth()).getDate());
            }
            if (BI.isNotNull(obj.week)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? date.getWeekStartDate() : date.getWeekEndDate();
            }
            if (BI.isNotNull(obj.month)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), date.getMonth(), 1) : BI.getDate(date.getFullYear(), date.getMonth(), (date.getLastDateOfMonth()).getDate());
            }
            if (BI.isNotNull(obj.quarter)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? date.getQuarterStartDate() : date.getQuarterEndDate();
            }
            if (BI.isNotNull(obj.year)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), 0, 1) : BI.getDate(date.getFullYear(), 11, 31);
            }
        }
    });
})();BI.DynamicDateCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-dynamic-date-card"
    },

    render: function () {
        var self = this;
        this.position = BI.DynamicDateCard.OFFSET.CURRENT;
        return {
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.label",
                    text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
                    textAlign: "left",
                    height: 24,
                    lgap: 10
                }
            }, {
                type: "bi.button_group",
                ref: function () {
                    self.checkgroup = this;
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                value: [BI.DynamicDateCard.TYPE.YEAR],
                items: BI.createItems([{
                    text: BI.i18nText("BI-Basic_Year"),
                    value: BI.DynamicDateCard.TYPE.YEAR
                }, {
                    text: BI.i18nText("BI-Basic_Single_Quarter"),
                    value: BI.DynamicDateCard.TYPE.QUARTER
                }, {
                    text: BI.i18nText("BI-Basic_Month"),
                    value: BI.DynamicDateCard.TYPE.MONTH
                }, {
                    text: BI.i18nText("BI-Basic_Week"),
                    value: BI.DynamicDateCard.TYPE.WEEK
                }, {
                    text: BI.i18nText("BI-Basic_Day"),
                    value: BI.DynamicDateCard.TYPE.DAY
                }], {
                    type: "bi.multi_select_item",
                    logic: {
                        dynamic: true
                    }
                }),
                layouts: [{
                    type: "bi.left"
                }],
                listeners: [{
                    eventName: BI.ButtonGroup.EVENT_CHANGE,
                    action: function () {
                        var value = self.checkgroup.getValue();
                        if(value.length !== 0) {
                            self.workDayBox.setSelected(false);
                        }

                        var plainValue = {};
                        BI.each(self.resultPane.getAllButtons(), function (idx, button) {
                            var value = button.getValue();
                            if(BI.isNotNull(value.dateType)) {
                                plainValue[value.dateType] = {
                                    value: value.value,
                                    offset: value.offset
                                };
                            }
                        });
                        self.resultPane.populate(self._getParamJson(BI.map(self.checkgroup.getValue(), function (idx, v) {
                            var obj = {
                                dateType: v
                            };
                            if(BI.has(plainValue, v)) {
                                obj.value = plainValue[v].value;
                                obj.offset = plainValue[v].offset;
                            }
                            return obj;
                        })));
                        self.position = BI.DynamicDateCard.OFFSET.CURRENT;
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }, {
                type: "bi.vertical_adapt",
                items: [{
                    type: "bi.multi_select_item",
                    ref: function () {
                        self.workDayBox = this;
                    },
                    logic: {
                        dynamic: true
                    },
                    text: BI.i18nText("BI-Basic_Work_Day"),
                    value: BI.DynamicDateCard.TYPE.WORK_DAY,
                    listeners: [{
                        eventName: BI.MultiSelectItem.EVENT_CHANGE,
                        action: function () {
                            if(this.isSelected()) {
                                self.checkgroup.setValue();
                            }
                            self.resultPane.populate(this.isSelected() ? self._getParamJson([{
                                dateType: BI.DynamicDateCard.TYPE.WORK_DAY
                            }]) : []);
                            self.position = BI.DynamicDateCard.OFFSET.CURRENT;
                            self.fireEvent("EVENT_CHANGE");
                        }
                    }]
                }],
                ref: function () {
                    self.workDay = this;
                }
            }, {
                type: "bi.button_group",
                items: this._getParamJson([{
                    dateType: BI.DynamicDateCard.TYPE.YEAR
                }]),
                ref: function () {
                    self.resultPane = this;
                },
                layouts: [{
                    type: "bi.vertical",
                    vgap: 10,
                    hgap: 10
                }]
            }]
        };
    },

    _getParamJson: function (values, positionValue) {
        var self = this;
        var items = BI.map(values, function (idx, value) {
            return {
                type: "bi.dynamic_date_param_item",
                dateType: value.dateType,
                value: value.value,
                offset: value.offset,
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            };
        });

        if(values.length === 1 && values[0] === BI.DynamicDateCard.TYPE.DAY) {
            items.push = [{
                type: "bi.text_value_combo",
                height: 24,
                items: this._getText(BI.DynamicDateCard.TYPE.MONTH),
                value: positionValue || BI.DynamicDateCard.OFFSET.CURRENT,
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.position = this.getValue()[0];
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }];
        }else{
            if(values.length !== 0 && BI.last(values).dateType !== BI.DynamicDateCard.TYPE.DAY && BI.last(values).dateType !== BI.DynamicDateCard.TYPE.WORK_DAY) {
                items.push({
                    type: "bi.text_value_combo",
                    height: 24,
                    items: this._getText(BI.last(values).dateType),
                    value: positionValue || BI.DynamicDateCard.OFFSET.CURRENT,
                    listeners: [{
                        eventName: "EVENT_CHANGE",
                        action: function () {
                            self.position = this.getValue()[0];
                            self.fireEvent("EVENT_CHANGE");
                        }
                    }]
                });

            }
        }

        return items;
    },

    _getText: function (lastValue) {
        switch (lastValue) {
            case BI.DynamicDateCard.TYPE.YEAR:
                return [{
                    text: BI.i18nText("BI-Basic_Current_Day"),
                    value: BI.DynamicDateCard.OFFSET.CURRENT
                }, {
                    text: BI.i18nText("BI-Basic_Year_Begin"),
                    value: BI.DynamicDateCard.OFFSET.BEGIN
                }, {
                    text: BI.i18nText("BI-Basic_Year_End"),
                    value: BI.DynamicDateCard.OFFSET.END
                }];
            case BI.DynamicDateCard.TYPE.QUARTER:
                return [{
                    text: BI.i18nText("BI-Basic_Current_Day"),
                    value: BI.DynamicDateCard.OFFSET.CURRENT
                }, {
                    text: BI.i18nText("BI-Basic_Quarter_Begin"),
                    value: BI.DynamicDateCard.OFFSET.BEGIN
                }, {
                    text: BI.i18nText("BI-Basic_Quarter_End"),
                    value: BI.DynamicDateCard.OFFSET.END
                }];
            case BI.DynamicDateCard.TYPE.MONTH:
                return [{
                    text: BI.i18nText("BI-Basic_Current_Day"),
                    value: BI.DynamicDateCard.OFFSET.CURRENT
                }, {
                    text: BI.i18nText("BI-Basic_Month_Begin"),
                    value: BI.DynamicDateCard.OFFSET.BEGIN
                }, {
                    text: BI.i18nText("BI-Basic_Month_End"),
                    value: BI.DynamicDateCard.OFFSET.END
                }];
            case BI.DynamicDateCard.TYPE.WEEK:
            default:
                return [{
                    text: BI.i18nText("BI-Basic_Current_Day"),
                    value: BI.DynamicDateCard.OFFSET.CURRENT
                }, {
                    text: BI.i18nText("BI-Basic_Week_Begin"),
                    value: BI.DynamicDateCard.OFFSET.BEGIN
                }, {
                    text: BI.i18nText("BI-Basic_Week_End"),
                    value: BI.DynamicDateCard.OFFSET.END
                }];
        }
    },

    _createValue: function (type, v) {
        return {
            dateType: type,
            value: Math.abs(v),
            offset: v > 0 ? 1 : 0
        };
    },

    setValue: function (v) {
        v = v || {};
        var values = [];
        var valuesItems = [];
        if(BI.isNotNull(v.year)) {
            values.push(BI.DynamicDateCard.TYPE.YEAR);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.YEAR, v.year));
        }
        if(BI.isNotNull(v.quarter)) {
            values.push(BI.DynamicDateCard.TYPE.QUARTER);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.QUARTER, v.quarter));
        }
        if(BI.isNotNull(v.month)) {
            values.push(BI.DynamicDateCard.TYPE.MONTH);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.MONTH, v.month));
        }
        if(BI.isNotNull(v.week)) {
            values.push(BI.DynamicDateCard.TYPE.WEEK);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.WEEK, v.week));
        }
        if(BI.isNotNull(v.day)) {
            values.push(BI.DynamicDateCard.TYPE.DAY);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.DAY, v.day));
        }
        if(BI.isNotNull(v.workDay)) {
            values.push(BI.DynamicDateCard.TYPE.WORK_DAY);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.WORK_DAY, v.workDay));
        }
        this.checkgroup.setValue(values);
        this.workDayBox.setSelected(BI.isNotNull(v.workDay));
        this.resultPane.populate(this._getParamJson(valuesItems, v.position));
    },

    getValue: function () {
        var self = this;
        var valueMap = {};
        var selectValues = this.checkgroup.getValue();
        var buttons = this.resultPane.getAllButtons();
        if(selectValues.length !== 0) {
            BI.each(buttons, function (idx, button) {
                var value = button.getValue();
                switch (value.dateType) {
                    case BI.DynamicDateCard.TYPE.YEAR:
                        valueMap.year = (value.offset === 0 ? -value.value : value.value);
                        break;
                    case BI.DynamicDateCard.TYPE.QUARTER:
                        valueMap.quarter = (value.offset === 0 ? -value.value : value.value);
                        break;
                    case BI.DynamicDateCard.TYPE.MONTH:
                        valueMap.month = (value.offset === 0 ? -value.value : value.value);
                        break;
                    case BI.DynamicDateCard.TYPE.WEEK:
                        valueMap.week = (value.offset === 0 ? -value.value : value.value);
                        break;
                    case BI.DynamicDateCard.TYPE.DAY:
                        valueMap.day = (value.offset === 0 ? -value.value : value.value);
                        break;
                    default:
                        break;
                }
                if(BI.isNull(value.dateType)) {
                    valueMap.position = self.position || BI.DynamicDateCard.OFFSET.CURRENT;
                }
            });
        }
        if(this.workDayBox.isSelected()) {
            var value = buttons[0].getValue();
            valueMap.workDay = (value.offset === 0 ? -value.value : value.value);
        }
        return valueMap;
    }

});
BI.shortcut("bi.dynamic_date_card", BI.DynamicDateCard);

BI.extend(BI.DynamicDateCard, {
    TYPE: {
        YEAR: 1,
        QUARTER: 2,
        MONTH: 3,
        WEEK: 4,
        DAY: 5,
        WORK_DAY: 6
    },
    OFFSET: {
        CURRENT: 1,
        BEGIN: 2,
        END: 3
    }

});BI.DynamicDateCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 259,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1,
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },

    props: {
        baseCls: "bi-dynamic-date-combo bi-border",
        height: 24
    },


    render: function () {
        var self = this, opts = this.options;
        this.storeTriggerValue = "";
        var date = BI.getDate();
        this.storeValue = opts.value;
        return {
            type: "bi.htape",
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "bi-trigger-icon-button date-change-h-font",
                    width: 24,
                    height: 24,
                    ref: function () {
                        self.changeIcon = this;
                    }
                },
                width: 24
            }, {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.combo",
                        ref: function () {
                            self.combo = this;
                        },
                        toggle: false,
                        isNeedAdjustHeight: false,
                        isNeedAdjustWidth: false,
                        el: {
                            type: "bi.dynamic_date_trigger",
                            min: this.constants.DATE_MIN_VALUE,
                            max: this.constants.DATE_MAX_VALUE,
                            value: opts.value,
                            ref: function () {
                                self.trigger = this;
                            },
                            listeners: [{
                                eventName: BI.DynamicDateTrigger.EVENT_KEY_DOWN,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        self.combo.hideView();
                                    }
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_STOP,
                                action: function () {
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_TRIGGER_CLICK,
                                action: function () {
                                    self.combo.toggle();
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_FOCUS,
                                action: function () {
                                    self.storeTriggerValue = self.trigger.getKey();
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_FOCUS);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_ERROR,
                                action: function () {
                                    self.storeValue = {
                                        year: date.getFullYear(),
                                        month: date.getMonth() + 1
                                    };
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_ERROR);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_VALID,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_VALID);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CHANGE);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_CONFIRM,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        return;
                                    }
                                    var dateStore = self.storeTriggerValue;
                                    var dateObj = self.trigger.getKey();
                                    if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                                        self.storeValue = self.trigger.getValue();
                                        self.setValue(self.trigger.getValue());
                                    } else if (BI.isEmptyString(dateObj)) {
                                        self.storeValue = null;
                                        self.trigger.setValue();
                                    }
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                }
                            }]
                        },
                        adjustLength: this.constants.comboAdjustHeight,
                        popup: {
                            el: {
                                type: "bi.dynamic_date_popup",
                                min: this.constants.DATE_MIN_VALUE,
                                max: this.constants.DATE_MAX_VALUE,
                                value: opts.value,
                                ref: function () {
                                    self.popup = this;
                                },
                                listeners: [{
                                    eventName: BI.DynamicDatePopup.BUTTON_CLEAR_EVENT_CHANGE,
                                    action: function () {
                                        self.setValue();
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDatePopup.BUTTON_lABEL_EVENT_CHANGE,
                                    action: function () {
                                        var date = BI.getDate();
                                        self.setValue({
                                            year: date.getFullYear(),
                                            month: date.getMonth() + 1,
                                            day: date.getDate()
                                        });
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDatePopup.BUTTON_OK_EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(self.popup.getValue());
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDatePopup.EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(self.popup.getValue());
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                    }
                                }]
                            },
                            stopPropagation: false
                        },
                        listeners: [{
                            eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                            action: function () {
                                self.popup.setValue(self.storeValue);
                                self.fireEvent(BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW);
                            }
                        }]
                    },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, {
                    el: {
                        type: "bi.icon_button",
                        cls: "bi-trigger-icon-button date-font",
                        width: 24,
                        height: 24,
                        listeners: [{
                            eventName: BI.IconButton.EVENT_CHANGE,
                            action: function () {
                                if (self.combo.isViewVisible()) {
                                    self.combo.hideView();
                                } else {
                                    self.combo.showView();
                                }
                            }
                        }]
                    },
                    top: 0,
                    right: 0
                }]
            }],
            ref: function (_ref) {
                self.comboWrapper = _ref;
            }
        };
    },

    mounted: function () {
        this._checkDynamicValue(this.options.value);
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[0].width = 24;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[0].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
        this._checkDynamicValue(v);
    },
    getValue: function () {
        return this.storeValue;
    },
    getKey: function () {
        return this.trigger.getKey();
    },
    hidePopupView: function () {
        this.combo.hideView();
    }
});

BI.DynamicDateCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicDateCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicDateCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW = "BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.dynamic_date_combo", BI.DynamicDateCombo);

BI.extend(BI.DynamicDateCombo, {
    Static: 1,
    Dynamic: 2
});BI.DynamicDateParamItem = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-dynamic-date-param-item",
        dateType: BI.DynamicDateCard.TYPE.YEAR,
        value: 0,
        offset: 0,
        height: 24
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.htape",
            items: [{
                el: {
                    type: "bi.sign_editor",
                    cls: "bi-border",
                    height: 22,
                    validationChecker: function (v) {
                        return BI.isNaturalNumber(v);
                    },
                    value: o.value,
                    ref: function () {
                        self.editor = this;
                    },
                    errorText: function (v) {
                        if(BI.isEmptyString(v)) {
                            return BI.i18nText("BI-Basic_Please_Input_Content");
                        }
                        return BI.i18nText("BI-Please_Input_Positive_Integer");
                    },
                    allowBlank: false,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CONFIRM,
                        action: function () {
                            self.fireEvent(BI.DynamicDateParamItem.EVENT_CHANGE);
                        }
                    }]
                },
                width: 60
            }, {
                el: {
                    type: "bi.label",
                    height: 24,
                    text: this._getText()
                },
                width: 20
            }, {
                type: "bi.text_value_combo",
                height: 24,
                items: [{
                    text: BI.i18nText("BI-Basic_Front"),
                    value: 0
                }, {
                    text: BI.i18nText("BI-Basic_Behind"),
                    value: 1
                }],
                ref: function () {
                    self.offsetCombo = this;
                },
                value: o.offset,
                listeners: [{
                    eventName: BI.TextValueCombo.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.DynamicDateParamItem.EVENT_CHANGE);
                    }
                }]
            }]
        };
    },

    _getText: function () {
        var text = "";
        switch (this.options.dateType) {
            case BI.DynamicDateCard.TYPE.YEAR:
                text = BI.i18nText("BI-Basic_Year");
                break;
            case BI.DynamicDateCard.TYPE.QUARTER:
                text = BI.i18nText("BI-Basic_Single_Quarter");
                break;
            case BI.DynamicDateCard.TYPE.MONTH:
                text = BI.i18nText("BI-Basic_Month");
                break;
            case BI.DynamicDateCard.TYPE.WEEK:
                text = BI.i18nText("BI-Basic_Week");
                break;
            case BI.DynamicDateCard.TYPE.DAY:
            default:
                text = BI.i18nText("BI-Basic_Day");
                break;
        }
        return text;
    },

    setValue: function (v) {
        v = v || {};
        v.value = v.value || 0;
        v.offset = v.offset || 0;
        this.editor.setValue(v.value);
        this.offsetCombo.setValue(v.offset);
    },

    getValue: function () {
        return {
            dateType: this.options.dateType,
            value: this.editor.getValue(),
            offset: this.offsetCombo.getValue()[0]
        };
    }

});
BI.DynamicDateParamItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_date_param_item", BI.DynamicDateParamItem);BI.DynamicDatePopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 30
    },
    
    props: {
        baseCls: "bi-dynamic-date-popup",
        width: 248,
        height: 344
    },
    
    _init: function () {
        BI.DynamicDatePopup.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.storeValue = {type: BI.DynamicDateCombo.Static};
        BI.createWidget({
            element: this,
            type: "bi.vtape",
            items: [{
                el: this._getTabJson()
            }, {
                el: {
                    type: "bi.grid",
                    items: [[{
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-high-light bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Clear"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicDatePopup.BUTTON_CLEAR_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-left bi-border-right bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Multi_Date_Today"),
                        ref: function () {
                            self.textButton = this;
                        },
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicDatePopup.BUTTON_lABEL_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-high-light bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_OK"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicDatePopup.BUTTON_OK_EVENT_CHANGE);
                            }
                        }]
                    }]]
                },
                height: 24
            }]
        });
        this.setValue(opts.value);
    },

    _getTabJson: function () {
        var self = this;
        return {
            type: "bi.tab",
            showIndex: BI.DynamicDateCombo.Static,
            ref: function () {
                self.dateTab = this;
            },
            tab: {
                type: "bi.linear_segment",
                cls: "bi-border-bottom",
                height: this.constants.tabHeight,
                items: BI.createItems([{
                    text: BI.i18nText("BI-Multi_Date_YMD"),
                    value: BI.DynamicDateCombo.Static
                }, {
                    text: BI.i18nText("BI-Basic_Dynamic_Title"),
                    value: BI.DynamicDateCombo.Dynamic
                }], {
                    textAlign: "center"
                })
            },
            cardCreator: function (v) {
                switch (v) {
                    case BI.DynamicDateCombo.Dynamic:
                        return {
                            type: "bi.dynamic_date_card",
                            listeners: [{
                                eventName: "EVENT_CHANGE",
                                action: function () {
                                    self._setInnerValue(self.year, v);
                                }
                            }],
                            ref: function () {
                                self.dynamicPane = this;
                            }
                        };
                    case BI.DynamicDateCombo.Static:
                    default:
                        return {
                            type: "bi.date_calendar_popup",
                            min: self.options.min,
                            max: self.options.max,
                            listeners: [{
                                eventName: BI.DateCalendarPopup.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicDatePopup.EVENT_CHANGE);
                                }
                            }],
                            ref: function () {
                                self.ymd = this;
                            }
                        };
                }
            },
            listeners: [{
                eventName: BI.Tab.EVENT_CHANGE,
                action: function () {
                    var v = self.dateTab.getSelect();
                    switch (v) {
                        case BI.DynamicDateCombo.Static:
                            var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                            self.ymd.setValue({
                                year: date.getFullYear(),
                                month: date.getMonth(),
                                day: date.getDate()
                            });
                            self._setInnerValue();
                            break;
                        case BI.DynamicDateCombo.Dynamic:
                        default:
                            if(self.storeValue && self.storeValue.type === BI.DynamicDateCombo.Dynamic) {
                                self.dynamicPane.setValue(self.storeValue.value);
                            }else{
                                self.dynamicPane.setValue({
                                    year: 0
                                });
                            }
                            self._setInnerValue();
                            break;
                    }
                }
            }]
        };
    },

    _setInnerValue: function () {
        if (this.dateTab.getSelect() === BI.DynamicDateCombo.Static) {
            this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
            this.textButton.setEnable(true);
        } else {
            var date = BI.DynamicDateHelper.getCalculation(this.dynamicPane.getValue());
            date = date.print("%Y-%x-%e");
            this.textButton.setValue(date);
            this.textButton.setEnable(false);
        }
    },

    _checkValueValid: function (value) {
        return BI.isNull(value) || BI.isEmptyObject(value) || BI.isEmptyString(value);
    },

    setValue: function (v) {
        this.storeValue = v;
        var self = this;
        var type, value;
        v = v || {};
        type = v.type || BI.DynamicDateCombo.Static;
        value = v.value || v;
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.dynamicPane.setValue(value);
                self._setInnerValue();
                break;
            case BI.DynamicDateCombo.Static:
            default:
                if (this._checkValueValid(value)) {
                    var date = BI.getDate();
                    this.ymd.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate()
                    });
                    this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                } else {
                    this.ymd.setValue(value);
                    this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                }
                this.textButton.setEnable(true);
                break;
        }
    },

    getValue: function () {
        return {
            type: this.dateTab.getSelect(),
            value: this.dateTab.getValue()
        };
    }
});
BI.DynamicDatePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDatePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DynamicDatePopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
BI.DynamicDatePopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
BI.shortcut("bi.dynamic_date_popup", BI.DynamicDatePopup);BI.DynamicDateTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        yearLength: 4,
        yearMonthLength: 7
    },

    props: {
        extraCls: "bi-date-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicDateTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                var date = v.match(/\d+/g);
                self._autoAppend(v, date);
                return self._dateCheck(v) && BI.checkDateLegal(v) && self._checkVoid({
                    year: date[0],
                    month: date[1],
                    day: date[2]
                });
            },
            quitChecker: function () {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function () {
                if (self.editor.isEditing()) {
                    return BI.i18nText("BI-Date_Trigger_Error_Text");
                }
                return BI.i18nText("BI-Year_Trigger_Invalid_Text");
            }
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_KEY_DOWN);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setState(value);
            }

            if (BI.isNotEmptyString(value)) {
                var date = value.split("-");
                self.storeValue = {
                    type: BI.DynamicDateCombo.Static,
                    value: {
                        year: date[0] | 0,
                        month: date[1],
                        day: date[2] | 0
                    }
                };
            }
            self.fireEvent(BI.DynamicDateTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_CHANGE);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.editor
            }, {
                el: BI.createWidget(),
                width: 30
            }]
        });
        this.setValue(o.value);
    },
    _dateCheck: function (date) {
        return BI.parseDateTime(date, "%Y-%x-%d").print("%Y-%x-%d") === date ||
            BI.parseDateTime(date, "%Y-%X-%d").print("%Y-%X-%d") === date ||
            BI.parseDateTime(date, "%Y-%x-%e").print("%Y-%x-%e") === date ||
            BI.parseDateTime(date, "%Y-%X-%e").print("%Y-%X-%e") === date;
    },
    _checkVoid: function (obj) {
        return !BI.checkDateVoid(obj.year, obj.month, obj.day, this.options.min, this.options.max)[0];
    },
    _autoAppend: function (v, dateObj) {
        if (BI.isNotNull(dateObj) && BI.checkDateLegal(v)) {
            switch (v.length) {
                case this._const.yearLength:
                    if (this._yearCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
                case this._const.yearMonthLength:
                    if (this._monthCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
            }
        }
    },

    _yearCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y").print("%Y") === v && date >= this.options.min && date <= this.options.max;
    },

    _monthCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y-%X").print("%Y-%X") === v && date >= this.options.min && date <= this.options.max;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y-%x-%e");
        this.editor.setState(dateStr);
        this.editor.setValue(dateStr);
        this.setTitle(BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr));
    },

    _getText: function (obj) {
        var value = "";
        var endText = "";
        if(BI.isNotNull(obj.year) && BI.parseInt(obj.year) !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = getPositionText(BI.i18nText("BI-Basic_Year"), obj.position);
        }
        if(BI.isNotNull(obj.quarter) && BI.parseInt(obj.quarter) !== 0) {
            value += Math.abs(obj.quarter) + BI.i18nText("BI-Basic_Single_Quarter") + (obj.quarter < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = getPositionText(BI.i18nText("BI-Basic_Single_Quarter"), obj.position);
        }
        if(BI.isNotNull(obj.month) && BI.parseInt(obj.month) !== 0) {
            value += Math.abs(obj.month) + BI.i18nText("BI-Basic_Month") + (obj.month < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = getPositionText(BI.i18nText("BI-Basic_Month"), obj.position);
        }
        if(BI.isNotNull(obj.week) && BI.parseInt(obj.week) !== 0) {
            value += Math.abs(obj.week) + BI.i18nText("BI-Basic_Week") + (obj.week < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = getPositionText(BI.i18nText("BI-Basic_Week"), obj.position);
        }
        if(BI.isNotNull(obj.day) && BI.parseInt(obj.day) !== 0) {
            value += Math.abs(obj.day) + BI.i18nText("BI-Basic_Day") + (obj.day < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = BI.size(obj) === 1 ? getPositionText(BI.i18nText("BI-Basic_Month"), obj.position) : "";
        }
        if(BI.isNotNull(obj.workDay) && BI.parseInt(obj.workDay) !== 0) {
            value += Math.abs(obj.workDay) + BI.i18nText("BI-Basic_Work_Day") + (obj.workDay < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value + endText;

        function getPositionText (baseText, position) {
            switch (position) {
                case BI.DynamicDateCard.OFFSET.BEGIN:
                    return baseText + BI.i18nText("BI-Basic_Begin_Start");
                case BI.DynamicDateCard.OFFSET.END:
                    return baseText + BI.i18nText("BI-Basic_End_Stop");
                case BI.DynamicDateCard.OFFSET.CURRENT:
                default:
                    return BI.i18nText("BI-Basic_Current_Day");
            }
        }
    },

    setValue: function (v) {
        var type, value, self = this;
        var date = BI.getDate();
        this.storeValue = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DynamicDateCombo.Static;
            value = v.value || v;
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                var text = this._getText(value);
                date = BI.DynamicDateHelper.getCalculation(value);
                this._setInnerValue(date, text);
                break;
            case BI.DynamicDateCombo.Static:
            default:
                if (BI.isNull(value) || BI.isNull(value.day)) {
                    this.editor.setState("");
                    this.editor.setValue("");
                    this.setTitle("");
                } else {
                    var dateStr = value.year + "-" + (value.month) + "-" + value.day;
                    this.editor.setState(dateStr);
                    this.editor.setValue(dateStr);
                    this.setTitle(dateStr);
                }
                break;
        }
    },

    getKey: function () {
        return this.editor.getValue();
    },
    getValue: function () {
        return this.storeValue;
    }

});

BI.DynamicDateTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicDateTrigger.EVENT_START = "EVENT_START";
BI.DynamicDateTrigger.EVENT_STOP = "EVENT_STOP";
BI.DynamicDateTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicDateTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateTrigger.EVENT_VALID = "EVENT_VALID";
BI.DynamicDateTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicDateTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.DynamicDateTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.shortcut("bi.dynamic_date_trigger", BI.DynamicDateTrigger);BI.DynamicDateTimeCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 259,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1,
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },

    props: {
        baseCls: "bi-dynamic-date-combo bi-border",
        height: 24
    },


    render: function () {
        var self = this, opts = this.options;
        this.storeTriggerValue = "";
        var date = BI.getDate();
        this.storeValue = opts.value;
        return {
            type: "bi.htape",
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "bi-trigger-icon-button date-change-h-font",
                    width: 24,
                    height: 24,
                    ref: function () {
                        self.changeIcon = this;
                    }
                },
                width: 24
            }, {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.combo",
                        ref: function () {
                            self.combo = this;
                        },
                        toggle: false,
                        isNeedAdjustHeight: false,
                        isNeedAdjustWidth: false,
                        el: {
                            type: "bi.dynamic_date_time_trigger",
                            min: this.constants.DATE_MIN_VALUE,
                            max: this.constants.DATE_MAX_VALUE,
                            value: opts.value,
                            ref: function () {
                                self.trigger = this;
                            },
                            listeners: [{
                                eventName: BI.DynamicDateTimeTrigger.EVENT_KEY_DOWN,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        self.combo.hideView();
                                    }
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_STOP,
                                action: function () {
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_TRIGGER_CLICK,
                                action: function () {
                                    self.combo.toggle();
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_FOCUS,
                                action: function () {
                                    self.storeTriggerValue = self.trigger.getKey();
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_FOCUS);
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_ERROR,
                                action: function () {
                                    self.storeValue = {
                                        year: date.getFullYear(),
                                        month: date.getMonth() + 1
                                    };
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_ERROR);
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_VALID,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_VALID);
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CHANGE);
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_CONFIRM,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        return;
                                    }
                                    var dateStore = self.storeTriggerValue;
                                    var dateObj = self.trigger.getKey();
                                    if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                                        self.storeValue = self.trigger.getValue();
                                        self.setValue(self.trigger.getValue());
                                    } else if (BI.isEmptyString(dateObj)) {
                                        self.storeValue = null;
                                        self.trigger.setValue();
                                    }
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                }
                            }]
                        },
                        adjustLength: this.constants.comboAdjustHeight,
                        popup: {
                            el: {
                                type: "bi.dynamic_date_time_popup",
                                min: this.constants.DATE_MIN_VALUE,
                                max: this.constants.DATE_MAX_VALUE,
                                value: opts.value,
                                ref: function () {
                                    self.popup = this;
                                },
                                listeners: [{
                                    eventName: BI.DynamicDateTimePopup.BUTTON_CLEAR_EVENT_CHANGE,
                                    action: function () {
                                        self.setValue();
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDateTimePopup.BUTTON_lABEL_EVENT_CHANGE,
                                    action: function () {
                                        var date = BI.getDate();
                                        self.setValue({
                                            year: date.getFullYear(),
                                            month: date.getMonth() + 1,
                                            day: date.getDate(),
                                            hour: 0,
                                            minute: 0,
                                            second: 0
                                        });
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDateTimePopup.BUTTON_OK_EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(self.popup.getValue());
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDateTimePopup.EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(self.popup.getValue());
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                    }
                                }]
                            },
                            stopPropagation: false
                        },
                        listeners: [{
                            eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                            action: function () {
                                self.popup.setValue(self.storeValue);
                                self.fireEvent(BI.DynamicDateTimeCombo.EVENT_BEFORE_POPUPVIEW);
                            }
                        }]
                    },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, {
                    el: {
                        type: "bi.icon_button",
                        cls: "bi-trigger-icon-button date-font",
                        width: 24,
                        height: 24,
                        listeners: [{
                            eventName: BI.IconButton.EVENT_CHANGE,
                            action: function () {
                                if (self.combo.isViewVisible()) {
                                    self.combo.hideView();
                                } else {
                                    self.combo.showView();
                                }
                            }
                        }]
                    },
                    top: 0,
                    right: 0
                }]
            }],
            ref: function (_ref) {
                self.comboWrapper = _ref;
            }
        };
    },

    mounted: function () {
        this._checkDynamicValue(this.options.value);
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicDateTimeCombo.Dynamic:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[0].width = 24;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[0].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
        this._checkDynamicValue(v);
    },
    getValue: function () {
        return this.storeValue;
    },
    getKey: function () {
        return this.trigger.getKey();
    },
    hidePopupView: function () {
        this.combo.hideView();
    }
});

BI.DynamicDateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicDateTimeCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicDateTimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateTimeCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicDateTimeCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicDateTimeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.dynamic_date_time_combo", BI.DynamicDateTimeCombo);

BI.extend(BI.DynamicDateTimeCombo, {
    Static: 1,
    Dynamic: 2
});BI.DynamicDateTimePopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 30
    },

    props: {
        baseCls: "bi-dynamic-date-time-popup",
        width: 248,
        height: 385
    },

    _init: function () {
        BI.DynamicDateTimePopup.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.storeValue = {type: BI.DynamicDateCombo.Static};
        BI.createWidget({
            element: this,
            type: "bi.vtape",
            items: [{
                el: this._getTabJson()
            }, {
                el: {
                    type: "bi.grid",
                    items: [[{
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-high-light bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Clear"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicDateTimePopup.BUTTON_CLEAR_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-left bi-border-right bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Multi_Date_Today"),
                        ref: function () {
                            self.textButton = this;
                        },
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicDateTimePopup.BUTTON_lABEL_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-high-light bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_OK"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicDateTimePopup.BUTTON_OK_EVENT_CHANGE);
                            }
                        }]
                    }]]
                },
                height: 24
            }]
        });
        this.setValue(opts.value);
    },

    _getTabJson: function () {
        var self = this;
        return {
            type: "bi.tab",
            showIndex: BI.DynamicDateCombo.Static,
            ref: function () {
                self.dateTab = this;
            },
            tab: {
                type: "bi.linear_segment",
                cls: "bi-border-bottom",
                height: this.constants.tabHeight,
                items: BI.createItems([{
                    text: BI.i18nText("BI-Multi_Date_YMD"),
                    value: BI.DynamicDateCombo.Static
                }, {
                    text: BI.i18nText("BI-Basic_Dynamic_Title"),
                    value: BI.DynamicDateCombo.Dynamic
                }], {
                    textAlign: "center"
                })
            },
            cardCreator: function (v) {
                switch (v) {
                    case BI.DynamicDateCombo.Dynamic:
                        return {
                            type: "bi.dynamic_date_card",
                            listeners: [{
                                eventName: "EVENT_CHANGE",
                                action: function () {
                                    self._setInnerValue(self.year, v);
                                }
                            }],
                            ref: function () {
                                self.dynamicPane = this;
                            }
                        };
                    case BI.DynamicDateCombo.Static:
                    default:
                        return {
                            type: "bi.vtape",
                            items: [{
                                type: "bi.date_calendar_popup",
                                min: self.options.min,
                                max: self.options.max,
                                ref: function () {
                                    self.ymd = this;
                                }
                            }, {
                                el: {
                                    type: "bi.dynamic_date_time_select",
                                    ref: function () {
                                        self.timeSelect = this;
                                    },
                                    listeners: [{
                                        eventName: BI.DynamicDateTimeSelect.EVENT_CONFIRM,
                                        action: function () {

                                        }
                                    }]
                                },
                                height: 40
                            }]
                        };
                }
            },
            listeners: [{
                eventName: BI.Tab.EVENT_CHANGE,
                action: function () {
                    var v = self.dateTab.getSelect();
                    switch (v) {
                        case BI.DynamicDateCombo.Static:
                            var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                            self.ymd.setValue({
                                year: date.getFullYear(),
                                month: date.getMonth(),
                                day: date.getDate()
                            });
                            self.timeSelect.setValue();
                            self._setInnerValue();
                            break;
                        case BI.DynamicDateCombo.Dynamic:
                        default:
                            if(self.storeValue && self.storeValue.type === BI.DynamicDateCombo.Dynamic) {
                                self.dynamicPane.setValue(self.storeValue.value);
                            }else{
                                self.dynamicPane.setValue({
                                    year: 0
                                });
                            }
                            self._setInnerValue();
                            break;
                    }
                }
            }]
        };
    },

    _setInnerValue: function () {
        if (this.dateTab.getSelect() === BI.DynamicDateCombo.Static) {
            this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
            this.textButton.setEnable(true);
        } else {
            var date = BI.DynamicDateHelper.getCalculation(this.dynamicPane.getValue());
            date = date.print("%Y-%x-%e");
            this.textButton.setValue(date);
            this.textButton.setEnable(false);
        }
    },

    _checkValueValid: function (value) {
        return BI.isNull(value) || BI.isEmptyObject(value) || BI.isEmptyString(value);
    },

    setValue: function (v) {
        this.storeValue = v;
        var self = this;
        var type, value;
        v = v || {};
        type = v.type || BI.DynamicDateCombo.Static;
        value = v.value || v;
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.dynamicPane.setValue(value);
                self._setInnerValue();
                break;
            case BI.DynamicDateCombo.Static:
            default:
                if (this._checkValueValid(value)) {
                    var date = BI.getDate();
                    this.ymd.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate()
                    });
                    this.timeSelect.setValue();
                    this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                } else {
                    this.ymd.setValue(value);
                    this.timeSelect.setValue({
                        hour: value.hour,
                        minute: value.minute,
                        second: value.second
                    });
                    this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                }
                this.textButton.setEnable(true);
                break;
        }
    },

    getValue: function () {
        var type = this.dateTab.getSelect();
        return {
            type: type,
            value: type === BI.DynamicDateTimeCombo.Static ? BI.extend(this.ymd.getValue(), this.timeSelect.getValue()) : this.dynamicPane.getValue()
        };
    }
});
BI.DynamicDateTimePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateTimePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DynamicDateTimePopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
BI.DynamicDateTimePopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
BI.shortcut("bi.dynamic_date_time_popup", BI.DynamicDateTimePopup);BI.DynamicDateTimeSelect = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-date-time-select bi-border-top"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.center_adapt",
            items: [{
                type: "bi.vertical_adapt",
                items: [{
                    el: {
                        type: "bi.number_editor",
                        ref: function () {
                            self.hour = this;
                        },
                        validationChecker: function (v) {
                            return BI.isNaturalNumber(v) && BI.parseInt(v) < 24;
                        },
                        errorText: function () {
                            return BI.i18nText("BI-Basic_Input_From_To_Number", "\"00-23\"");
                        },
                        listeners: [{
                            eventName: BI.SignEditor.EVENT_CONFIRM,
                            action: function () {
                                this.setValue(self._formatValueToDoubleDigit(this.getValue()));
                                self.fireEvent(BI.DynamicDateTimeSelect.EVENT_CONFIRM);
                            }
                        }, {
                            eventName: BI.SignEditor.EVENT_CHANGE,
                            action: function () {
                                var value = self._autoSwitch(this.getValue(), BI.DynamicDateTimeSelect.HOUR);
                                this.setValue(value);
                            }
                        }],
                        width: 60,
                        height: 24
                    },
                    lgap: 14
                }, {
                    type: "bi.label",
                    text: ":",
                    width: 20
                }, {
                    type: "bi.number_editor",
                    ref: function () {
                        self.minute = this;
                    },
                    validationChecker: function (v) {
                        return BI.isNaturalNumber(v) && BI.parseInt(v) < 60;
                    },
                    errorText: function () {
                        return BI.i18nText("BI-Basic_Input_From_To_Number", "\"00-59\"");
                    },
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CONFIRM,
                        action: function () {
                            this.setValue(self._formatValueToDoubleDigit(this.getValue()), BI.DynamicDateTimeSelect.MINUTE);
                            self.fireEvent(BI.DynamicDateTimeSelect.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            var value = self._autoSwitch(this.getValue(), BI.DynamicDateTimeSelect.MINUTE);
                            this.setValue(value);
                        }
                    }],
                    width: 60,
                    height: 24
                }, {
                    type: "bi.label",
                    text: ":",
                    width: 20
                }, {
                    type: "bi.number_editor",
                    ref: function () {
                        self.second = this;
                    },
                    validationChecker: function (v) {
                        return BI.isNaturalNumber(v) && BI.parseInt(v) < 60;
                    },
                    errorText: function () {
                        return BI.i18nText("BI-Basic_Input_From_To_Number", "\"00-59\"");
                    },
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CONFIRM,
                        action: function () {
                            this.setValue(self._formatValueToDoubleDigit(this.getValue()));
                            self.fireEvent(BI.DynamicDateTimeSelect.EVENT_CONFIRM);
                        }
                    }],
                    width: 60,
                    height: 24
                }]
            }]
        };
    },

    _autoSwitch: function (v, type) {
        var limit = 0;
        var value = v;
        switch (type) {
            case BI.DynamicDateTimeSelect.HOUR:
                limit = 2;
                break;
            case BI.DynamicDateTimeSelect.MINUTE:
                limit = 6;
                break;
            default:
                break;
        }
        if(v.length === 1 && BI.parseInt(v) > limit) {
            value = "0" + value;
        }
        if (value.length === 2) {
            type === BI.DynamicDateTimeSelect.HOUR ? this.minute.focus() : this.second.focus();
        }
        return value;
    },

    _formatValueToDoubleDigit: function (v) {
        if(BI.isNull(v) || BI.isEmptyString(v)) {
            v = 0;
        }
        var value = BI.parseInt(v);
        if(value < 10) {
            value = "0" + value;
        }
        return value;
    },

    _assertValue: function (v) {
        v = v || {};
        v.hour = this._formatValueToDoubleDigit(v.hour) || "00";
        v.minute = this._formatValueToDoubleDigit(v.minute) || "00";
        v.second = this._formatValueToDoubleDigit(v.second) || "00";
        return v;
    },

    getValue: function () {
        return {
            hour: BI.parseInt(this.hour.getValue()),
            minute: BI.parseInt(this.minute.getValue()),
            second: BI.parseInt(this.second.getValue())
        };
    },

    setValue: function (v) {
        v = this._assertValue(v);
        this.hour.setValue(v.hour);
        this.minute.setValue(v.minute);
        this.second.setValue(v.second);
    }

});
BI.DynamicDateTimeSelect.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.dynamic_date_time_select", BI.DynamicDateTimeSelect);

BI.extend(BI.DynamicDateTimeSelect, {
    HOUR: 1,
    MINUTE: 2
});BI.DynamicDateTimeTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        yearLength: 4,
        yearMonthLength: 7
    },

    props: {
        extraCls: "bi-date-time-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicDateTimeTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                var date = v.match(/\d+/g);
                self._autoAppend(v, date);
                return self._dateCheck(v) && BI.checkDateLegal(v) && self._checkVoid({
                    year: date[0],
                    month: date[1],
                    day: date[2]
                });
            },
            quitChecker: function () {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function () {
                if (self.editor.isEditing()) {
                    return BI.i18nText("BI-Basic_Date_Time_Error_Text");
                }
                return BI.i18nText("BI-Year_Trigger_Invalid_Text");
            }
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DynamicDateTimeTrigger.EVENT_KEY_DOWN);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicDateTimeTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicDateTimeTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.DynamicDateTimeTrigger.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicDateTimeTrigger.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setState(value);
            }

            if (BI.isNotEmptyString(value)) {
                var date = value.split(/-|\s|:/);
                self.storeValue = {
                    type: BI.DynamicDateCombo.Static,
                    value: {
                        year: date[0] | 0,
                        month: date[1],
                        day: date[2] | 0,
                        hour: date[3] | 0,
                        minute: date[4] | 0,
                        second: date[5] | 0
                    }
                };
            }
            self.fireEvent(BI.DynamicDateTimeTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicDateTimeTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.DynamicDateTimeTrigger.EVENT_CHANGE);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.editor
            }, {
                el: BI.createWidget(),
                width: 30
            }]
        });
        this.setValue(o.value);
    },
    _dateCheck: function (date) {
        return BI.parseDateTime(date, "%Y-%x-%d %H:%M:%S").print("%Y-%x-%d %H:%M:%S") === date ||
            BI.parseDateTime(date, "%Y-%X-%d %H:%M:%S").print("%Y-%X-%d %H:%M:%S") === date ||
            BI.parseDateTime(date, "%Y-%x-%e %H:%M:%S").print("%Y-%x-%e %H:%M:%S") === date ||
            BI.parseDateTime(date, "%Y-%X-%e %H:%M:%S").print("%Y-%X-%e %H:%M:%S") === date ||

            BI.parseDateTime(date, "%Y-%x-%d").print("%Y-%x-%d") === date ||
            BI.parseDateTime(date, "%Y-%X-%d").print("%Y-%X-%d") === date ||
            BI.parseDateTime(date, "%Y-%x-%e").print("%Y-%x-%e") === date ||
            BI.parseDateTime(date, "%Y-%X-%e").print("%Y-%X-%e") === date;
    },
    _checkVoid: function (obj) {
        return !BI.checkDateVoid(obj.year, obj.month, obj.day, this.options.min, this.options.max)[0];
    },
    _autoAppend: function (v, dateObj) {
        if (BI.isNotNull(dateObj) && BI.checkDateLegal(v)) {
            switch (v.length) {
                case this._const.yearLength:
                    if (this._yearCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
                case this._const.yearMonthLength:
                    if (this._monthCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
            }
        }
    },

    _yearCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y").print("%Y") === v && date >= this.options.min && date <= this.options.max;
    },

    _monthCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y-%X").print("%Y-%X") === v && date >= this.options.min && date <= this.options.max;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y-%x-%e %H:%M:%S");
        this.editor.setState(dateStr);
        this.editor.setValue(dateStr);
        this.setTitle(BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr));
    },

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year) && BI.parseInt(obj.year) !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind")) + getPositionText(BI.i18nText("BI-Basic_Year"), obj.position);
        }
        if(BI.isNotNull(obj.quarter) && BI.parseInt(obj.quarter) !== 0) {
            value += Math.abs(obj.quarter) + BI.i18nText("BI-Basic_Single_Quarter") + (obj.quarter < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind")) + getPositionText(BI.i18nText("BI-Basic_Year"), obj.position);
        }
        if(BI.isNotNull(obj.month) && BI.parseInt(obj.month) !== 0) {
            value += Math.abs(obj.month) + BI.i18nText("BI-Basic_Month") + (obj.month < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind")) + getPositionText(BI.i18nText("BI-Basic_Month"), obj.position);
        }
        if(BI.isNotNull(obj.week) && BI.parseInt(obj.week) !== 0) {
            value += Math.abs(obj.week) + BI.i18nText("BI-Basic_Week") + (obj.week < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind")) + getPositionText(BI.i18nText("BI-Basic_Week"), obj.position);
        }
        if(BI.isNotNull(obj.day) && BI.parseInt(obj.day) !== 0) {
            value += Math.abs(obj.day) + BI.i18nText("BI-Basic_Day") + (obj.day < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind")) + BI.size(obj) === 1 ? getPositionText(BI.i18nText("BI-Basic_Month"), obj.position) : "";
        }
        if(BI.isNotNull(obj.workDay) && BI.parseInt(obj.workDay) !== 0) {
            value += Math.abs(obj.workDay) + BI.i18nText("BI-Basic_Work_Day") + (obj.workDay < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;

        function getPositionText (baseText, position) {
            switch (position) {
                case BI.DynamicDateCard.OFFSET.BEGIN:
                    return baseText + BI.i18nText("BI-Basic_Begin_Start");
                case BI.DynamicDateCard.OFFSET.END:
                    return baseText + BI.i18nText("BI-Basic_End_Stop");
                case BI.DynamicDateCard.OFFSET.CURRENT:
                default:
                    return BI.i18nText("BI-Basic_Current_Day");
            }
        }
    },

    setValue: function (v) {
        var type, value, self = this;
        var date = BI.getDate();
        this.storeValue = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DynamicDateCombo.Static;
            value = v.value || v;
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                var text = this._getText(value);
                date = BI.DynamicDateHelper.getCalculation(value);
                this._setInnerValue(date, text);
                break;
            case BI.DynamicDateCombo.Static:
            default:
                if (BI.isNull(value) || BI.isNull(value.day)) {
                    this.editor.setState("");
                    this.editor.setValue("");
                    this.setTitle("");
                } else {
                    var dateStr = BI.getDate(value.year, (value.month - 1), value.day, value.hour || 0, value.minute || 0,
                        value.second || 0).print("%Y-%X-%d %H:%M:%S");
                    this.editor.setState(dateStr);
                    this.editor.setValue(dateStr);
                    this.setTitle(dateStr);
                }
                break;
        }
    },

    getKey: function () {
        return this.editor.getValue();
    },
    getValue: function () {
        return this.storeValue;
    }

});

BI.DynamicDateTimeTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicDateTimeTrigger.EVENT_START = "EVENT_START";
BI.DynamicDateTimeTrigger.EVENT_STOP = "EVENT_STOP";
BI.DynamicDateTimeTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicDateTimeTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateTimeTrigger.EVENT_VALID = "EVENT_VALID";
BI.DynamicDateTimeTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicDateTimeTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.DynamicDateTimeTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.shortcut("bi.dynamic_date_time_trigger", BI.DynamicDateTimeTrigger);/**
 * Created by roy on 15/9/14.
 */
BI.SearchEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SearchEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-search-editor bi-border",
            height: 24,
            errorText: "",
            watermark: BI.i18nText("BI-Basic_Search"),
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn
        });
    },
    _init: function () {
        this.options.height -= 2;
        BI.SearchEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            errorText: o.errorText,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker
        });
        this.clear = BI.createWidget({
            type: "bi.icon_button",
            stopEvent: true,
            cls: "search-close-h-font"
        });
        this.clear.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue("");
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT);
            self.fireEvent(BI.SearchEditor.EVENT_CLEAR);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: {
                        type: "bi.center_adapt",
                        cls: "search-font",
                        items: [{
                            el: {
                                type: "bi.icon"
                            }
                        }]
                    },
                    width: 25
                },
                {
                    el: self.editor
                },
                {
                    el: this.clear,
                    width: 25
                }
            ]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SearchEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SearchEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self._checkClear();
            self.fireEvent(BI.SearchEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SearchEditor.EVENT_KEY_DOWN, v);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_BACKSPACE);
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SearchEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.SearchEditor.EVENT_ERROR);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SearchEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SearchEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self._checkClear();
            self.fireEvent(BI.SearchEditor.EVENT_EMPTY);
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_REMOVE);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SearchEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SearchEditor.EVENT_STOP);
        });

        this.clear.invisible();
    },

    _checkClear: function () {
        if (!this.getValue()) {
            this.clear.invisible();
        } else {
            this.clear.visible();
        }
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    getValue: function () {
        if (this.isValid()) {
            var res = this.editor.getValue().match(/[\S]+/g);
            return BI.isNull(res) ? "" : res[res.length - 1];
        }
    },

    getKeywords: function () {
        var val = this.editor.getValue();
        var keywords = val.match(/[\S]+/g);
        if (BI.isEndWithBlank(val)) {
            return keywords.concat([" "]);
        }
        return keywords;
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setValue: function (v) {
        this.editor.setValue(v);
        if (BI.isKey(v)) {
            this.clear.visible();
        }
    },
    
    isEditing: function () {
        return this.editor.isEditing();
    },

    isValid: function () {
        return this.editor.isValid();
    }
});
BI.SearchEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SearchEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SearchEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SearchEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SearchEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SearchEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SearchEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";
BI.SearchEditor.EVENT_CLEAR = "EVENT_CLEAR";

BI.SearchEditor.EVENT_START = "EVENT_START";
BI.SearchEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SearchEditor.EVENT_STOP = "EVENT_STOP";
BI.SearchEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SearchEditor.EVENT_VALID = "EVENT_VALID";
BI.SearchEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SearchEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SearchEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SearchEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.SearchEditor.EVENT_EMPTY = "EVENT_EMPTY";
BI.shortcut("bi.search_editor", BI.SearchEditor);/**
 * 小号搜索框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallSearchEditor
 * @extends BI.SearchEditor
 */
BI.SmallSearchEditor = BI.inherit(BI.SearchEditor, {
    _defaultConfig: function () {
        var conf = BI.SmallSearchEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-small-search-editor",
            height: 24
        });
    },

    _init: function () {
        BI.SmallSearchEditor.superclass._init.apply(this, arguments);
    }
});
BI.shortcut("bi.small_search_editor", BI.SmallSearchEditor);/**
 * guy
 * @class BI.TextEditor
 * @extends BI.Single
 */
BI.TextEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.TextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-text-editor bi-border",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: false,
            watermark: "",
            errorText: "",
            height: 24
        });
    },

    _init: function () {
        BI.TextEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNumber(o.height)) {
            this.element.css({height: o.height - 2});
        }
        if (BI.isNumber(o.width)) {
            this.element.css({width: o.width - 2});
        }
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height - 2,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            title: o.title,
            tipType: o.tipType,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.TextEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.TextEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.TextEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_KEY_DOWN);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_BACKSPACE);
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.TextEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.TextEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_REMOVE);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.TextEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.TextEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.TextEditor.EVENT_STOP);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.TextEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.TextEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.TextEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.TextEditor.EVENT_EMPTY);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        return this.editor.getValue();
    }
});
BI.TextEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.TextEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.TextEditor.EVENT_BLUR = "EVENT_BLUR";
BI.TextEditor.EVENT_CLICK = "EVENT_CLICK";
BI.TextEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.TextEditor.EVENT_SPACE = "EVENT_SPACE";
BI.TextEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";

BI.TextEditor.EVENT_START = "EVENT_START";
BI.TextEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.TextEditor.EVENT_STOP = "EVENT_STOP";
BI.TextEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.TextEditor.EVENT_VALID = "EVENT_VALID";
BI.TextEditor.EVENT_ERROR = "EVENT_ERROR";
BI.TextEditor.EVENT_ENTER = "EVENT_ENTER";
BI.TextEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.TextEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.TextEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.text_editor", BI.TextEditor);/**
 * 小号搜索框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallTextEditor
 * @extends BI.SearchEditor
 */
BI.SmallTextEditor = BI.inherit(BI.TextEditor, {
    _defaultConfig: function () {
        var conf = BI.SmallTextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-small-text-editor",
            height: 25
        });
    },

    _init: function () {
        BI.SmallTextEditor.superclass._init.apply(this, arguments);
    }
});
BI.shortcut("bi.small_text_editor", BI.SmallTextEditor);/**
 * 文件管理控件组
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerButtonGroup
 * @extends BI.Widget
 */
BI.FileManagerButtonGroup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerButtonGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-button_group",
            items: []
        });
    },

    _init: function () {
        BI.FileManagerButtonGroup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button_group = BI.createWidget({
            type: "bi.button_tree",
            element: this,
            chooseType: BI.Selection.Multi,
            items: this._formatItems(o.items),
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _formatItems: function (items) {
        var self = this, o = this.options;
        BI.each(items, function (i, item) {
            if (item.children && item.children.length > 0) {
                item.type = "bi.file_manager_folder_item";
            } else {
                item.type = "bi.file_manager_file_item";
            }
        });
        return items;
    },

    setValue: function (v) {
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getNotSelectedValue: function () {
        return this.button_group.getNotSelectedValue();
    },

    getAllLeaves: function () {
        return this.button_group.getAllLeaves();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    getSelectedButtons: function () {
        return this.button_group.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.button_group.getNotSelectedButtons();
    },

    populate: function (items) {
        this.button_group.populate(this._formatItems(items));
    }
});
BI.FileManagerButtonGroup.EVENT_CHANGE = "FileManagerButtonGroup.EVENT_CHANGE";
BI.shortcut("bi.file_manager_button_group", BI.FileManagerButtonGroup);/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManager
 * @extends BI.Widget
 */
BI.FileManager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager",
            el: {},
            items: []
        });
    },

    _init: function () {
        BI.FileManager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tree = new BI.Tree();
        var items = BI.Tree.transformToTreeFormat(o.items);
        this.tree.initTree(items);
        this.selectedValues = [];
        this.nav = BI.createWidget({
            type: "bi.file_manager_nav",
            items: BI.deepClone(items)
        });
        this.nav.on(BI.FileManagerNav.EVENT_CHANGE, function (value, obj) {
            if (value == "-1") {// 根节点
                self.populate({children: self.tree.toJSON()});
            } else {
                var node = self.tree.search(obj.attr("id"));
                self.populate(BI.extend({id: node.id}, node.get("data"), {children: self.tree.toJSON(node)}));
            }
            self.setValue(self.selectedValues);
        });
        this.list = BI.createWidget(o.el, {
            type: "bi.file_manager_list",
            items: items
        });
        this.list.on(BI.Controller.EVENT_CHANGE, function (type, selected, obj) {
            if (type === BI.Events.CHANGE) {
                var node = self.tree.search(obj.attr("id"));
                self.populate(BI.extend({id: node.id}, node.get("data"), {children: self.tree.toJSON(node)}));
            } else if (type === BI.Events.CLICK) {
                var values = [];
                if (obj instanceof BI.MultiSelectBar) {
                    var t = self.list.getValue();
                    selected = t.type === BI.Selection.All;
                    values = BI.concat(t.assist, t.value);
                } else {
                    values = obj.getAllLeaves();
                }
                BI.each(values, function (i, v) {
                    if (selected === true) {
                        self.selectedValues.pushDistinct(v);
                    } else {
                        self.selectedValues.remove(v);
                    }
                });
            }
            self.setValue(self.selectedValues);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.list,
                left: 0,
                right: 0,
                top: 0,
                bottom: 10
            }, {
                el: this.nav,
                left: 40,
                right: 100,
                top: 0
            }]
        });
    },

    setValue: function (value) {
        this.selectedValues = value || [];
        this.list.setValue(this.selectedValues);
    },

    getValue: function () {
        var obj = this.list.getValue();
        var res = obj.type === BI.Selection.All ? obj.assist : obj.value;
        res.pushDistinctArray(this.selectedValues);
        return res;
    },

    _populate: function (items) {
        this.list.populate(items);
    },

    getSelectedValue: function () {
        return this.nav.getValue()[0];
    },

    getSelectedId: function () {
        return this.nav.getId()[0];
    },

    populate: function (node) {
        var clone = BI.deepClone(node);
        this._populate(node.children);
        this.nav.populate(clone);
    }
});
BI.FileManager.EVENT_CHANGE = "FileManager.EVENT_CHANGE";
BI.shortcut("bi.file_manager", BI.FileManager);/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerFileItem
 * @extends BI.Single
 */
BI.FileManagerFileItem = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerFileItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-file-item bi-list-item bi-border-bottom",
            height: 30
        });
    },

    _init: function () {
        BI.FileManagerFileItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checked = BI.createWidget({
            type: "bi.multi_select_bar",
            text: "",
            width: 36,
            height: o.height
        });
        this.checked.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.checked,
                width: 36
            }, {
                el: {
                    type: "bi.icon_button",
                    cls: "create-by-me-file-font"
                },
                width: 20
            }, {
                el: {
                    type: "bi.label",
                    textAlign: "left",
                    height: o.height,
                    text: o.text,
                    value: o.value
                }
            }]
        });
    },

    getAllLeaves: function () {
        return [this.options.value];
    },

    isSelected: function () {
        return this.checked.isSelected();
    },

    setSelected: function (v) {
        this.checked.setSelected(v);
    }
});
BI.FileManagerFileItem.EVENT_CHANGE = "FileManagerFileItem.EVENT_CHANGE";
BI.shortcut("bi.file_manager_file_item", BI.FileManagerFileItem);/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerFolderItem
 * @extends BI.Single
 */
BI.FileManagerFolderItem = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerFolderItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-folder-item bi-list-item bi-border-bottom",
            height: 30
        });
    },

    _init: function () {
        BI.FileManagerFolderItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checked = BI.createWidget({
            type: "bi.multi_select_bar",
            text: "",
            width: 36,
            height: o.height
        });
        this.checked.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button = BI.createWidget({
            type: "bi.text_button",
            textAlign: "left",
            height: o.height,
            text: o.text,
            value: o.value
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CHANGE, o.value, self);
        });

        this.tree = new BI.Tree();
        this.tree.initTree([{
            id: o.id,
            children: o.children
        }]);
        this.selectValue = [];

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.checked,
                width: 36
            }, {
                el: {
                    type: "bi.icon_button",
                    cls: "create-by-me-folder-font"
                },
                width: 20
            }, {
                el: this.button
            }]
        });
    },

    setAllSelected: function (v) {
        this.checked.setSelected(v);
        this.selectValue = [];
    },

    setHalfSelected: function (v) {
        this.checked.setHalfSelected(v);
        if(!v) {
            this.selectValue = [];
        }
    },

    setValue: function (v) {
        var self = this, o = this.options;
        var isHalf = false;
        var selectValue = [];
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                if (BI.contains(v, node.get("data").value)) {
                    selectValue.push(node.get("data").value);
                } else {
                    isHalf = true;
                }
            }
        });
        this.setAllSelected(selectValue.length > 0 && !isHalf);
        this.setHalfSelected(selectValue.length > 0 && isHalf);
        if (this.checked.isHalfSelected()) {
            this.selectValue = selectValue;
        }
    },

    getAllButtons: function () {
        return [this];
    },

    getAllLeaves: function () {
        var o = this.options;
        var res = [];
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                res.push(node.get("data").value);
            }
        });
        return res;
    },

    getNotSelectedValue: function () {
        var self = this, o = this.options;
        var res = [];
        var isAllSelected = this.checked.isSelected();
        if (isAllSelected === true) {
            return res;
        }
        var isHalfSelected = this.checked.isHalfSelected();
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                var v = node.get("data").value;
                if (isHalfSelected === true) {
                    if (!BI.contains(self.selectValue, node.get("data").value)) {
                        res.push(v);
                    }
                } else {
                    res.push(v);
                }
            }
        });
        return res;
    },

    getValue: function () {
        var res = [];
        if (this.checked.isSelected()) {
            this.tree.traverse(function (node) {
                if (node.isLeaf()) {
                    res.push(node.get("data").value);
                }
            });
            return res;
        }
        if (this.checked.isHalfSelected()) {
            return this.selectValue;
        }
        return [];
    }
});
BI.FileManagerFolderItem.EVENT_CHANGE = "FileManagerFolderItem.EVENT_CHANGE";
BI.shortcut("bi.file_manager_folder_item", BI.FileManagerFolderItem);/**
 * 文件管理控件列表
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerList
 * @extends BI.Widget
 */
BI.FileManagerList = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-list",
            el: {},
            items: []
        });
    },

    _init: function () {
        BI.FileManagerList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.list = BI.createWidget({
            type: "bi.select_list",
            element: this,
            items: o.items,
            toolbar: {
                type: "bi.multi_select_bar",
                height: 40,
                text: ""
            },
            el: {
                type: "bi.list_pane",
                el: BI.isWidget(o.el) ? o.el : BI.extend({
                    type: "bi.file_manager_button_group"
                }, o.el)
            }
        });
        this.list.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    setValue: function (v) {
        this.list.setValue({
            value: v
        });
    },

    getValue: function () {
        return this.list.getValue();
    },

    populate: function (items) {
        this.list.populate(items);
        this.list.setToolBarVisible(true);
    }
});
BI.FileManagerList.EVENT_CHANGE = "FileManagerList.EVENT_CHANGE";
BI.shortcut("bi.file_manager_list", BI.FileManagerList);/**
 * 文件管理导航按钮
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerNavButton
 * @extends BI.Widget
 */
BI.FileManagerNavButton = BI.inherit(BI.Widget, {

    _const: {
        normal_color: "#ffffff",
        select_color: "#eff1f4"
    },
    _defaultConfig: function () {
        return BI.extend(BI.FileManagerNavButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-nav-button",
            selected: false,
            height: 40
        });
    },

    _init: function () {
        BI.FileManagerNavButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.button = BI.createWidget({
            type: "bi.text_button",
            cls: "file-manager-nav-button-text bi-card",
            once: true,
            selected: o.selected,
            text: o.text,
            title: o.text,
            value: o.value,
            height: o.height,
            lgap: 20,
            rgap: 10
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        var svg = BI.createWidget({
            type: "bi.svg",
            cls: "file-manager-nav-button-triangle",
            width: 15,
            height: o.height
        });
        var path = svg.path("M0,0L15,20L0,40").attr({
            stroke: c.select_color,
            fill: o.selected ? c.select_color : c.normal_color
        });
        this.button.on(BI.TextButton.EVENT_CHANGE, function () {
            if (this.isSelected()) {
                path.attr("fill", c.select_color);
            } else {
                path.attr("fill", c.normal_color);
            }
        });
        BI.createWidget({
            type: "bi.default",
            element: this,
            items: [this.button]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: svg,
                right: -15,
                top: 0,
                bottom: 0
            }]
        });
    },

    isSelected: function () {
        return this.button.isSelected();
    },

    setValue: function (v) {
        this.button.setValue(v);
    },

    getValue: function () {
        return this.button.getValue();
    },

    populate: function (items) {

    }
});
BI.FileManagerNavButton.EVENT_CHANGE = "FileManagerNavButton.EVENT_CHANGE";
BI.shortcut("bi.file_manager_nav_button", BI.FileManagerNavButton);/**
 * 文件管理导航
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerNav
 * @extends BI.Widget
 */
BI.FileManagerNav = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerNav.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-nav bi-border-left",
            height: 40,
            items: []
        });
    },

    _init: function () {
        BI.FileManagerNav.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tree = new BI.Tree();
        this.refreshTreeData(o.items);
        this.tree.getRoot().set("data", {
            text: BI.i18nText("BI-Created_By_Me"),
            value: BI.FileManagerNav.ROOT_CREATE_BY_ME,
            id: BI.FileManagerNav.ROOT_CREATE_BY_ME
        });
        this.button_group = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: [{
                type: "bi.file_manager_nav_button",
                text: BI.i18nText("BI-Created_By_Me"),
                selected: true,
                id: BI.FileManagerNav.ROOT_CREATE_BY_ME,
                value: BI.FileManagerNav.ROOT_CREATE_BY_ME
            }],
            layouts: [{
                type: "bi.horizontal"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
            self.fireEvent(BI.FileManagerNav.EVENT_CHANGE, arguments);
        });
    },

    _getAllParents: function (id) {
        var node, res = [];
        if (!id) {
            node = this.tree.getRoot();
        } else {
            node = this.tree.search(id);
        }
        while (node.parent) {
            res.push(node);
            node = node.parent;
        }
        res.push(node);
        return res.reverse();
    },

    _formatNodes: function (nodes) {
        var res = [];
        BI.each(nodes, function (i, node) {
            res.push(BI.extend({
                type: "bi.file_manager_nav_button",
                id: node.id
            }, node.get("data")));
        });
        BI.last(res).selected = true;
        return res;
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getId: function () {
        var ids = [];
        BI.each(this.button_group.getSelectedButtons(), function (i, btn) {
            ids.push(btn.attr("id"));
        });
        return ids;
    },

    refreshTreeData: function (items) {
        this.tree.initTree(BI.Tree.transformToTreeFormat(items));
        this.tree.getRoot().set("data", {
            text: BI.i18nText("BI-Created_By_Me"),
            value: BI.FileManagerNav.ROOT_CREATE_BY_ME,
            id: BI.FileManagerNav.ROOT_CREATE_BY_ME
        });
    },

    populate: function (node) {
        var parents = BI.isNull(node) ? [this.tree.getRoot()] : this._getAllParents(node.id);
        this.button_group.populate(this._formatNodes(parents));
    }
});
BI.extend(BI.FileManagerNav, {
    ROOT_CREATE_BY_ME: "-1"
});
BI.FileManagerNav.EVENT_CHANGE = "FileManagerNav.EVENT_CHANGE";
BI.shortcut("bi.file_manager_nav", BI.FileManagerNav);/**
 * 过滤条件抽象类
 *
 * @class BI.AbstractFilterItem
 * @extend BI.Widget
 */
BI.AbstractFilterItem = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-filter-item bi-border-right bi-border-bottom"
    },

    isSelectedCondition: function () {
        return this.emptyItem && this.emptyItem.isVisible();
    },

    setSelectedCondition: function (b) {
        if (b) {
            if (!this.emptyItem) {
                this.emptyItem = BI.createWidget({
                    type: "bi.absolute",
                    height: 40,
                    cls: "filter-item-empty-item bi-border-top",
                    items: [{
                        el: {
                            type: "bi.center_adapt",
                            cls: "empty-filter-item-leaf"
                        }
                    }],
                    hgap: 10,
                    vgap: 5
                });
                BI.createWidget({
                    type: "bi.vertical",
                    element: this,
                    items: [this.emptyItem],
                    scrolly: false
                });
            }
        }
        this.emptyItem && this.emptyItem.setVisible(b);
    }
});
BI.extend(BI.AbstractFilterItem, {
    FILTER_OPERATION_FORMULA: 1,
    FILTER_OPERATION_CONDITION: 2,
    FILTER_OPERATION_CONDITION_AND: 3,
    FILTER_OPERATION_CONDITION_OR: 4,
    FILTER_OPERATION_FORMULA_AND: 5,
    FILTER_OPERATION_FORMULA_OR: 6
});/**
 * Created by Urthur on 2017/11/21.
 */
!(function () {
    var Expander = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-filter-expander",
            el: {},
            popup: {}
        },

        render: function () {
            var self = this, o = this.options;
            return {
                type: "bi.filter_expander",
                el: o.el,
                popup: o.popup,
                id: o.id,
                value: o.value,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    }
                }],
                ref: function (_ref) {
                    self.expander = _ref;
                }
            };
        },

        populate: function () {
            this.expander.populate.apply(this.expander, arguments);
        },

        getValue: function () {
            var val = this.expander.getValue();
            return {
                filterType: val.type,
                filterValue: val.value,
                id: val.id
            };
        }
    });
    BI.shortcut("bi.and.or.filter.expander", Expander);
}());/**
 * @class BI.FilterExpander
 * @extend BI.AbstractFilterItem
 * 过滤树的一个expander节点
 */
!(function () {
    var FilterExpander = BI.inherit(BI.AbstractFilterItem, {
        _constant: {
            EXPANDER_WIDTH: 20
        },

        props: {
            baseCls: "bi-filter-item bi-filter-expander",
            el: {},
            popup: {}
        },

        render: function () {
            var self = this, o = this.options;
            var value = o.el.value, text = "";
            if (value === BI.Filter.FILTER_TYPE.AND) {
                text = BI.i18nText("BI-Basic_And");
            } else {
                text = BI.i18nText("BI-Basic_Or");
            }
            return {
                type: "bi.horizontal_adapt",
                cls: "filter-item-empty-item",
                verticalAlign: BI.VerticalAlign.Middle,
                items: [{
                    type: "bi.text_button",
                    cls: "condition-and-or",
                    text: text,
                    value: value,
                    id: o.id,
                    width: this._constant.EXPANDER_WIDTH,
                    height: "100%",
                    ref: function (_ref) {
                        self.expander = _ref;
                    },
                    listeners: [{
                        eventName: BI.TextButton.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, "", self);
                        }
                    }]
                }, BI.extend(o.popup, {
                    ref: function (_ref) {
                        self.conditionsView = _ref;
                    },
                    listeners: [{
                        eventName: BI.Controller.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                        }
                    }]
                })]
            };
        },

        getValue: function () {
            return {
                type: this.expander.getValue(),
                value: this.conditionsView.getValue(),
                id: this.options.id
            };
        },

        populate: function () {
            this.conditionsView.populate.apply(this.conditionsView, arguments);
        }
    });
    BI.shortcut("bi.filter_expander", FilterExpander);
}());/**
 * Created by Urthur on 2017/12/21.
 */
!(function () {
    BI.constant("bi.constant.component.filter", {
        FORMULA_COMBO: [{
            text: BI.i18nText("BI-Conf_Formula_And"),
            value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND
        }, {
            text: BI.i18nText("BI-Conf_Formula_Or"),
            value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR
        }],
        CONDITION_COMBO: [{
            text: BI.i18nText("BI-Conf_Condition_And"),
            value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND
        }, {
            text: BI.i18nText("BI-Conf_Condition_Or"),
            value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR
        }]
    });
}());/**
 * 过滤
 *
 * Created by GUY on 2015/11/20.
 * @class BI.Filter
 * @extend BI.Widget
 */
BI.Filter = BI.inherit(BI.Widget, {

    constants: {
        FIELD_TYPE_NUMBER: 1,
        FIELD_TYPE_STRING: 0,
        FIELD_TYPE_DATE: 2
    },

    props: {
        baseCls: "bi-filter",
        expander: {},
        items: [],
        el: {},
        itemCreator: BI.empty
    },

    render: function () {
        var self = this, o = this.options;
        return BI.extend({
            type: "bi.filter_operation",
            expander: o.expander,
            listeners: [{
                eventName: "EVENT_OPERATION",
                action: function (type) {
                    switch (type) {
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND:
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_CONDITION);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR:
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_CONDITION, 1);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND:
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_FORMULA);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR:
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_FORMULA, 1);
                            break;
                    }
                }
            }, {
                eventName: "BI.FilterOperation.EVENT_DESTROY_ITEM",
                action: function (id) {
                    self._removeCondition(id);
                }
            }],
            ref: function (_ref) {
                self.filter = _ref;
            }
        }, o.el);
    },

    mounted: function () {
        this.tree = new BI.Tree();
        this.tree.initTree(this.options.items);
        this._populate(this.tree.toJSONWithNode());
    },

    _createEmptyNode: function (type) {
        var node = new BI.Node(BI.UUID());
        node.set("data", {
            value: type
        });
        return node;
    },

    _insertAndOrCondition: function (id, formulaOrField, type) {
        var ANDOR = ["AND", "OR"];
        type || (type = 0);
        var finded = this.tree.search(id);
        if (BI.isNotNull(finded)) {
            var data = finded.get("data");
            var parent = finded.getParent();
            var index = parent.getChildIndex(finded.id);
            var pdata = parent.get("data") || {};
            var node = this._createEmptyNode(formulaOrField);
            if (data.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                this.tree.addNode(finded, node);
                return;
            }
            if (data.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]]) {
                if (pdata.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                    parent.addChild(node, index + 1);
                    return;
                }
            }
            if ((data.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]] && pdata.value !== BI.Filter.FILTER_TYPE[ANDOR[type]])
                || pdata.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]]
                || (pdata.value !== BI.Filter.FILTER_TYPE.AND && pdata.value !== BI.Filter.FILTER_TYPE.OR)) {
                var andor = new BI.Node(BI.UUID());
                andor.set("data", {
                    value: BI.Filter.FILTER_TYPE[ANDOR[type]],
                    children: [finded.get("data"), node.get("data")]
                });
                parent.removeChildByIndex(index);
                parent.addChild(andor, index);
                andor.addChild(finded);
                andor.addChild(node);
                return;
            }
            parent.addChild(node, index + 1);
        }
    },

    _removeCondition: function (id) {
        var finded = this.tree.search(id);
        if (BI.isNotNull(finded)) {
            var parent = finded.getParent();
            parent.removeChild(id);
            if (parent.getChildrenLength() <= 1) {
                var prev = parent.getParent();
                if (BI.isNotNull(prev)) {
                    var index = prev.getChildIndex(parent.id);
                    prev.removeChildByIndex(index);
                    if (parent.getChildrenLength() === 1) {
                        prev.addChild(parent.getFirstChild(), index);
                    }
                }
            }
            this._populate(this.tree.toJSONWithNode());
            this.fireEvent("EVENT_CHANGE");
        }
    },

    _addAndOrCondition: function (formulaOrField, type) {
        var ANDOR = ["AND", "OR"];
        type || (type = 0);
        var currentSelectItem = this.filter.getCurrentSelectItem();
        if (BI.isNotNull(currentSelectItem)) {
            var id = currentSelectItem.attr("id");
            this._insertAndOrCondition(id, formulaOrField, type);
        } else {
            var node = this._createEmptyNode(formulaOrField);
            var root = this.tree.getRoot();
            var child = root.getLastChild();
            if (BI.isNotNull(child)) {
                var data = child.get("data");
                if (data.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                    this.tree.addNode(child, node);
                } else {
                    var andor = new BI.Node(BI.UUID());
                    andor.set("data", {
                        value: BI.Filter.FILTER_TYPE[ANDOR[type]],
                        children: [child.get("data"), node.get("data")]
                    });
                    root.removeChild(child.id);
                    this.tree.addNode(andor);
                    this.tree.addNode(andor, child);
                    this.tree.addNode(andor, node);
                }
            } else {
                this.tree.addNode(node);
            }
        }
        this._populate(this.tree.toJSONWithNode());
        this.fireEvent("EVENT_CHANGE");
    },

    _populate: function (items) {
        this.filter.defaultState();
        var o = this.options;
        o.items = items;
        BI.Tree.traversal(items, function (i, item) {
            o.itemCreator(item);
        });
        this.filter.populate.apply(this.filter, [items]);
    },

    populate: function (conditions) {
        this.tree.initTree(conditions);
        this._populate(this.tree.toJSONWithNode());
    },

    getValue: function () {
        return this.filter.getValue();
    }
});

BI.shortcut("bi.filter", BI.Filter);

BI.Filter.FILTER_TYPE = {};
BI.Filter.FILTER_TYPE.FORMULA = 33;
BI.Filter.FILTER_TYPE.AND = 34;
BI.Filter.FILTER_TYPE.OR = 35;
BI.Filter.FILTER_TYPE.EMPTY_FORMULA = 36;
BI.Filter.FILTER_TYPE.EMPTY_CONDITION = 37;
/**
 * Created by windy on 2017/3/28.
 */
!(function () {
    var FilterList = BI.inherit(BI.ButtonTree, {
        props: {
            baseCls: "bi-button-map"
        },

        _createBtns: function (items) {
            var o = this.options;
            var buttons = BI.createWidgets(BI.createItems(items, {type: "bi.text_button", once: o.chooseType === 0}));
            var keys = BI.map(items, function (i, item) {
                item = BI.stripEL(item);
                if (!(item.id || item.value)) {
                    throw new Error("item must have 'id' or 'value' as its property");
                }
                return item.id || item.value;
            });
            return BI.zipObject(keys, buttons);
        },

        setValue: function (v) {
            v = BI.isArray(v) ? v : [v];
            BI.each(this.buttons, function (val, item) {
                if (!BI.isFunction(item.setSelected)) {
                    item.setValue(v);
                    return;
                }
                if (v.contains(val)) {
                    item.setSelected && item.setSelected(true);
                } else {
                    item.setSelected && item.setSelected(false);
                }
            });
        },

        setNotSelectedValue: function (v) {
            v = BI.isArray(v) ? v : [v];
            BI.each(this.buttons, function (val, item) {
                if (!BI.isFunction(item.setSelected)) {
                    item.setNotSelectedValue(v);
                    return;
                }
                if (v.contains(val)) {
                    item.setSelected && item.setSelected(false);
                } else {
                    item.setSelected && item.setSelected(true);
                }
            });
        },

        populate: function (items) {
            var self = this;
            var args = [].slice.call(arguments);
            var linkHashMap = new BI.LinkHashMap();
            var val = function (item) {
                return item.id || item.value;
            };
            if (!this.buttons) {
                this.buttons = {};
            }
            // 所有已存在的和新添加的
            var willCreated = [];
            BI.each(items, function (i, item) {
                item = BI.stripEL(item);
                if (self.buttons[val(item)]) {
                    var ob = self.buttons[val(item)];
                    args[0] = item.items;
                    args[2] = item;
                    ob.populate && ob.populate.apply(ob, args);
                } else {
                    willCreated.push(item);
                }
            });
            // 创建新元素
            args[0] = willCreated;
            var newBtns = this._btnsCreator.apply(this, args);

            // 整理
            var array = [];
            BI.each(items, function (i, item) {
                item = BI.stripEL(item);
                var button = self.buttons[val(item)] || newBtns[val(item)];
                linkHashMap.add(val(item), button);
                array.push(button);
            });
            this.buttons = linkHashMap.map;

            BI.DOM.hang(this.buttons);
            this.element.empty();

            var packages = this._packageItems(items, this._packageBtns(array));
            BI.createWidget(BI.extend({element: this}, this._packageLayout(packages)));
        },

        getIndexByValue: function () {
            throw new Error("Can not use getIndexByValue");
        }
    });
    BI.shortcut("bi.filter_list", FilterList);
}());/**
 * 过滤条件
 *
 * Created by GUY on 2015/9/25.
 * @class BI.FilterOperation
 * @extend BI.Widget
 */
!(function () {
    var OPERATION_ADD_CONDITION = 0, OPERATION_ADD_ANDOR_CONDITION = 1;
    var FilterOperation = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-filter-operation",
            expander: {},
            items: [],
            selections: [BI.AbstractFilterItem.FILTER_OPERATION_CONDITION, BI.AbstractFilterItem.FILTER_OPERATION_FORMULA],
            itemsCreator: BI.emptyFn
        },

        render: function () {
            var self = this, o = this.options;
            this.currentSelected = null;

            return {
                type: "bi.vtape",
                items: [{
                    el: {
                        type: "bi.tab",
                        showIndex: OPERATION_ADD_CONDITION,
                        cardCreator: BI.bind(this._createTabs, this),
                        ref: function (_ref) {
                            self.buttonComboTab = _ref;
                        }
                    },
                    height: 40
                }, {
                    el: {
                        type: "bi.absolute",
                        scrollable: true,
                        items: [{
                            el: {
                                type: "bi.left",
                                items: [{
                                    type: "bi.filter_pane",
                                    expander: o.expander,
                                    items: o.items,
                                    itemsCreator: o.itemsCreator,
                                    listeners: [{
                                        eventName: "EVENT_CHANGE",
                                        action: function (type, value, obj) {
                                            if (type === BI.Events.CLICK) {
                                                if (BI.isNotNull(self.currentSelected) && self.currentSelected === obj) {
                                                    obj.setSelectedCondition(!obj.isSelectedCondition());
                                                } else {
                                                    if (BI.isNotNull(self.currentSelected)) {
                                                        self.currentSelected.setSelectedCondition(false);
                                                    }
                                                    self.currentSelected = obj;
                                                    obj.setSelectedCondition(true);
                                                }
                                                if (self.currentSelected.isSelectedCondition()) {
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_ANDOR_CONDITION);
                                                } else {
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
                                                }
                                            }
                                            if (type === BI.Events.DESTROY) {
                                                if (self.currentSelected === obj) {
                                                    self.currentSelected = null;
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
                                                }
                                                self.fireEvent("BI.FilterOperation.EVENT_DESTROY_ITEM", value, obj);
                                            }
                                        }
                                    }],
                                    ref: function (_ref) {
                                        self.filter = _ref;
                                    }
                                }]
                            },
                            top: 0,
                            right: 2,
                            bottom: 0,
                            left: 0
                        }]
                    }
                }]
            };
        },

        _createTabs: function (v) {
            var self = this;
            switch (v) {
                case OPERATION_ADD_CONDITION:
                    return {
                        type: "bi.button_group",
                        items: BI.createItems(self._createButtons(), {
                            type: "bi.icon_text_item",
                            height: 30,
                            width: 100
                        }),
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                        layouts: [{
                            type: "bi.left",
                            vgap: 5
                        }],
                        listeners: [{
                            eventName: BI.ButtonGroup.EVENT_CHANGE,
                            action: function (value, obj) {
                                if (BI.isEmptyArray(self.filter.getValue())) {
                                    self.filter.element.addClass("bi-border-top bi-border-left");
                                }
                                self.fireEvent("EVENT_OPERATION", obj.getValue());
                                self.defaultState();
                            }
                        }]
                    };
                case OPERATION_ADD_ANDOR_CONDITION:
                    return {
                        type: "bi.button_group",
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                        items: self._buildOperationButton(),
                        layouts: [{
                            type: "bi.left",
                            vgap: 5
                        }]
                    };
            }
        },

        _createButtons: function () {
            var buttons = [];
            BI.each(this.options.selections, function (i, type) {
                switch (type) {
                    case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                        buttons.push({
                            text: BI.i18nText("BI-Conf_Add_Formula"),
                            value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA,
                            cls: "operation-trigger filter-formula-font"
                        });
                        break;
                    case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                        buttons.push({
                            text: BI.i18nText("BI-Conf_Add_Condition"),
                            value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION,
                            cls: "operation-trigger filter-condition-font"
                        });
                        break;
                }
            });
            return buttons;
        },

        _buildOperationButton: function () {
            var self = this, combos = [];
            BI.each(this.options.selections, function (i, type) {
                var text = "", cls = "", items = [];
                switch (type) {
                    case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                        text = BI.i18nText("BI-Conf_Add_Formula");
                        cls = "filter-formula-font";
                        items = BI.Constants.getConstant("bi.constant.component.filter").FORMULA_COMBO;
                        break;
                    case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                    default:
                        text = BI.i18nText("BI-Conf_Add_Condition");
                        cls = "filter-condition-font";
                        items = BI.Constants.getConstant("bi.constant.component.filter").CONDITION_COMBO;
                        break;
                }

                var trigger = BI.createWidget({
                    type: "bi.icon_text_item",
                    cls: "operation-trigger " + cls,
                    text: text,
                    height: 30,
                    width: 100
                });
                combos.push({
                    type: "bi.combo",
                    el: trigger,
                    popup: {
                        el: {
                            type: "bi.button_group",
                            chooseType: BI.ButtonGroup.CHOOSE_TYPE_NONE,
                            items: BI.createItems(items, {
                                type: "bi.single_select_item",
                                height: 25
                            }),
                            layouts: [{
                                type: "bi.vertical"
                            }]
                        }
                    },
                    listeners: [{
                        eventName: BI.Combo.EVENT_CHANGE,
                        action: function (value, obj) {
                            if (BI.isEmptyArray(self.filter.getValue())) {
                                self.filter.element.addClass("bi-border-top bi-border-left");
                            }

                            switch (value) {
                                case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND:
                                case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR:
                                    trigger.setText(BI.i18nText("BI-Conf_Add_Condition"));
                                    break;
                                case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND:
                                case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR:
                                    trigger.setText(BI.i18nText("BI-Conf_Add_Formula"));
                                    break;
                                default:
                                    trigger.setText();
                            }
                            self.fireEvent("EVENT_OPERATION", obj.getValue());
                            self.defaultState();
                            this.hideView();
                        }
                    }]
                });
            });
            return combos;
        },

        defaultState: function () {
            if (BI.isNotNull(this.currentSelected)) {
                this.currentSelected.setSelectedCondition(false);
            }
            this.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
        },

        getCurrentSelectItem: function () {
            if (BI.isNotNull(this.currentSelected) && this.currentSelected.isSelectedCondition()) {
                return this.currentSelected;
            }
        },

        populate: function (items) {
            this.filter.populate.apply(this.filter, arguments);
        },

        getValue: function () {
            return this.filter.getValue();
        }
    });
    BI.shortcut("bi.filter_operation", FilterOperation);
}());
/**
 * @class BI.FilterPane
 * @extend BI.Widget
 * 过滤面板
 */
!(function () {
    var FilterPane = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-filter-pane",
            expander: {},
            items: [],
            itemsCreator: BI.emptyFn
        },

        render: function () {
            var self = this, o = this.options;
            return {
                type: "bi.custom_tree",
                cls: BI.isNotEmptyArray(o.items) ? "bi-border-top bi-border-left" : "",
                expander: BI.extend({
                    type: "bi.filter_expander",
                    el: {},
                    popup: {
                        type: "bi.custom_tree"
                    }
                }, o.expander),
                el: {
                    type: "bi.filter_list",
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                    layouts: [{
                        type: "bi.vertical",
                        scrolly: false
                    }]
                },
                items: o.items,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent("EVENT_CHANGE", arguments);
                    }
                }],
                ref: function (_ref) {
                    self.tree = _ref;
                }
            };
        },

        populate: function (items) {
            if (BI.isNotEmptyArray(items)) {
                this.element.addClass("bi-border-top bi-border-left");
            } else {
                this.element.removeClass("bi-border-top bi-border-left");
            }
            this.tree.populate.apply(this.tree, arguments);
        },

        getValue: function () {
            return this.tree.getValue();
        }
    });
    BI.shortcut("bi.filter_pane", FilterPane);
}());/**
 * Created by zcf on 2016/9/26.
 */
BI.IntervalSlider = BI.inherit(BI.Widget, {
    _constant: {
        EDITOR_WIDTH: 58,
        EDITOR_R_GAP: 60,
        EDITOR_HEIGHT: 30,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },

    _defaultConfig: function () {
        return BI.extend(BI.IntervalSlider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-interval-slider bi-slider-track",
            digit: false,
            unit: ""
        });
    },

    _init: function () {
        BI.IntervalSlider.superclass._init.apply(this, arguments);

        var self = this;
        var c = this._constant;
        this.enable = false;
        this.valueOne = "";
        this.valueTwo = "";
        this.calculation = new BI.AccurateCalculationModel();

        // this.backgroundTrack = BI.createWidget({
        //     type: "bi.layout",
        //     cls: "background-track",
        //     height: c.TRACK_HEIGHT
        // });
        this.grayTrack = BI.createWidget({
            type: "bi.layout",
            cls: "gray-track",
            height: 6
        });
        this.blueTrack = BI.createWidget({
            type: "bi.layout",
            cls: "blue-track bi-high-light-background",
            height: 6
        });
        this.track = this._createTrackWrapper();

        this.labelOne = BI.createWidget({
            type: "bi.sign_text_editor",
            cls: "slider-editor-button",
            text: this.options.unit,
            errorText: "",
            allowBlank: false,
            width: c.EDITOR_WIDTH,
            validationChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.labelOne.element.hover(function () {
            self.labelOne.element.removeClass("bi-border").addClass("bi-border");
        }, function () {
            self.labelOne.element.removeClass("bi-border");
        });
        this.labelOne.on(BI.Editor.EVENT_CONFIRM, function () {
            var v = BI.parseFloat(this.getValue());
            self.valueOne = v;
            var percent = self._getPercentByValue(v);
            var significantPercent = BI.parseFloat(percent.toFixed(1));// 分成1000份
            self._setLabelOnePosition(significantPercent);
            self._setSliderOnePosition(significantPercent);
            self._setBlueTrack();
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
        });

        this.labelTwo = BI.createWidget({
            type: "bi.sign_text_editor",
            cls: "slider-editor-button",
            errorText: "",
            text: this.options.unit,
            allowBlank: false,
            width: c.EDITOR_WIDTH,
            validationChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.labelTwo.element.hover(function () {
            self.labelTwo.element.removeClass("bi-border").addClass("bi-border");
        }, function () {
            self.labelTwo.element.removeClass("bi-border");
        });
        this.labelTwo.on(BI.Editor.EVENT_CONFIRM, function () {
            var v = BI.parseFloat(this.getValue());
            self.valueTwo = v;
            var percent = self._getPercentByValue(v);
            var significantPercent = BI.parseFloat(percent.toFixed(1));
            self._setLabelTwoPosition(significantPercent);
            self._setSliderTwoPosition(significantPercent);
            self._setBlueTrack();
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
        });

        this.sliderOne = BI.createWidget({
            type: "bi.single_slider_button"
        });
        this.sliderTwo = BI.createWidget({
            type: "bi.single_slider_button"
        });
        this._draggable(this.sliderOne, true);
        this._draggable(this.sliderTwo, false);
        this._setVisible(false);

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.track,
                            width: "100%",
                            height: c.TRACK_HEIGHT
                        }]
                    }],
                    hgap: 7,
                    height: c.TRACK_HEIGHT
                },
                top: 23,
                left: 0,
                width: "100%"
            },
            this._createLabelWrapper(),
            this._createSliderWrapper()
            ]
        });
    },

    _rePosBySizeAfterMove: function (size, isLeft) {
        var o = this.options;
        var percent = size * 100 / (this._getGrayTrackLength());
        var significantPercent = BI.parseFloat(percent.toFixed(1));
        var v = this._getValueByPercent(significantPercent);
        v = this._assertValue(v);
        v = o.digit === false ? v : v.toFixed(o.digit);
        if(isLeft) {
            this._setLabelOnePosition(significantPercent);
            this._setSliderOnePosition(significantPercent);
            this.labelOne.setValue(v);
            this.valueOne = v;
        }else{
            this._setLabelTwoPosition(significantPercent);
            this._setSliderTwoPosition(significantPercent);
            this.labelTwo.setValue(v);
            this.valueTwo = v;
        }
        this._setBlueTrack();
    },

    _rePosBySizeAfterStop: function (size, isLeft) {
        var percent = size * 100 / (this._getGrayTrackLength());
        var significantPercent = BI.parseFloat(percent.toFixed(1));
        isLeft ? this._setSliderOnePosition(significantPercent) : this._setSliderTwoPosition(significantPercent);
    },

    _draggable: function (widget, isLeft) {
        var self = this, o = this.options;
        var startDrag = false;
        var size = 0, offset = 0, defaultSize = 0;
        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX) {
            if (mouseMoveTracker.isDragging()) {
                startDrag = true;
                offset += deltaX;
                size = optimizeSize(defaultSize + offset);
                widget.element.addClass("dragging");
                self._rePosBySizeAfterMove(size, isLeft);
            }
        }, function () {
            if (startDrag === true) {
                size = optimizeSize(size);
                self._rePosBySizeAfterStop(size, isLeft);
                size = 0;
                offset = 0;
                defaultSize = size;
                startDrag = false;
            }
            widget.element.removeClass("dragging");
            mouseMoveTracker.releaseMouseMoves();
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
        }, window);
        widget.element.on("mousedown", function (event) {
            if(!widget.isEnabled()) {
                return;
            }
            defaultSize = this.offsetLeft;
            optimizeSize(defaultSize);
            mouseMoveTracker.captureMouseMoves(event);
        });

        function optimizeSize (s) {
            return BI.clamp(s, 0, self._getGrayTrackLength());
        }
    },

    _createLabelWrapper: function () {
        var c = this._constant;
        return {
            el: {
                type: "bi.vertical",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: this.labelOne,
                        top: 0,
                        left: "0%"
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: this.labelTwo,
                        top: 0,
                        left: "100%"
                    }]
                }],
                rgap: c.EDITOR_R_GAP,
                height: 70
            },
            top: 0,
            left: 0,
            width: "100%"
        };
    },

    _createSliderWrapper: function () {
        var c = this._constant;
        return {
            el: {
                type: "bi.vertical",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: this.sliderOne,
                        top: 0,
                        left: "0%"
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: this.sliderTwo,
                        top: 0,
                        left: "100%"
                    }]
                }],
                hgap: c.SLIDER_WIDTH_HALF,
                height: c.SLIDER_HEIGHT
            },
            top: 20,
            left: 0,
            width: "100%"
        };
    },

    _createTrackWrapper: function () {
        return BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.grayTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }, {
                            el: this.blueTrack,
                            top: 0,
                            left: 0,
                            width: "0%"
                        }]
                    }],
                    hgap: 8,
                    height: 8
                },
                top: 8,
                left: 0,
                width: "100%"
            }]
        });
    },

    _checkValidation: function (v) {
        var o = this.options;
        var valid = false;
        // 像90.这样的既不属于整数又不属于小数，是不合法的值
        var dotText = (v + "").split(".")[1];
        if (BI.isEmptyString(dotText)) {
        }else{
            if (BI.isNumeric(v) && !(BI.isNull(v) || v < this.min || v > this.max)) {
                if(o.digit === false) {
                    valid = true;
                }else{
                    dotText = dotText || "";
                    valid = (dotText.length === o.digit);
                }
            }
        }
        return valid;
    },

    _checkOverlap: function () {
        var labelOneLeft = this.labelOne.element[0].offsetLeft;
        var labelTwoLeft = this.labelTwo.element[0].offsetLeft;
        if (labelOneLeft <= labelTwoLeft) {
            if ((labelTwoLeft - labelOneLeft) < 90) {
                this.labelTwo.element.css({top: 40});
            } else {
                this.labelTwo.element.css({top: 0});
            }
        } else {
            if ((labelOneLeft - labelTwoLeft) < 90) {
                this.labelTwo.element.css({top: 40});
            } else {
                this.labelTwo.element.css({top: 0});
            }
        }
    },

    _setLabelOnePosition: function (percent) {
        this.labelOne.element.css({left: percent + "%"});
        this._checkOverlap();
    },

    _setLabelTwoPosition: function (percent) {
        this.labelTwo.element.css({left: percent + "%"});
        this._checkOverlap();
    },

    _setSliderOnePosition: function (percent) {
        this.sliderOne.element.css({left: percent + "%"});
    },

    _setSliderTwoPosition: function (percent) {
        this.sliderTwo.element.css({left: percent + "%"});
    },

    _setBlueTrackLeft: function (percent) {
        this.blueTrack.element.css({left: percent + "%"});
    },

    _setBlueTrackWidth: function (percent) {
        this.blueTrack.element.css({width: percent + "%"});
    },

    _setBlueTrack: function () {
        var percentOne = this._getPercentByValue(this.labelOne.getValue());
        var percentTwo = this._getPercentByValue(this.labelTwo.getValue());
        if (percentOne <= percentTwo) {
            this._setBlueTrackLeft(percentOne);
            this._setBlueTrackWidth(percentTwo - percentOne);
        } else {
            this._setBlueTrackLeft(percentTwo);
            this._setBlueTrackWidth(percentOne - percentTwo);
        }
    },

    _setAllPosition: function (one, two) {
        this._setSliderOnePosition(one);
        this._setLabelOnePosition(one);
        this._setSliderTwoPosition(two);
        this._setLabelTwoPosition(two);
        this._setBlueTrack();
    },

    _setVisible: function (visible) {
        this.sliderOne.setVisible(visible);
        this.sliderTwo.setVisible(visible);
        this.labelOne.setVisible(visible);
        this.labelTwo.setVisible(visible);
    },

    _setErrorText: function () {
        var errorText = BI.i18nText("BI-Please_Enter") + this.min + "-" + this.max + BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Basic_Number");
        this.labelOne.setErrorText(errorText);
        this.labelTwo.setErrorText(errorText);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth;
    },

    // 其中取max-min后保留4为有效数字后的值的小数位数为最终value的精度
    _getValueByPercent: function (percent) {// return (((max-min)*percent)/100+min)
        var sub = this.calculation.accurateSubtraction(this.max, this.min);
        var mul = this.calculation.accurateMultiplication(sub, percent);
        var div = this.calculation.accurateDivisionTenExponent(mul, 2);
        if(this.precision < 0) {
            var value = BI.parseFloat(this.calculation.accurateAddition(div, this.min));
            var reduceValue = Math.round(this.calculation.accurateDivisionTenExponent(value, -this.precision));
            return this.calculation.accurateMultiplication(reduceValue, Math.pow(10, -this.precision));
        }
        return BI.parseFloat(this.calculation.accurateAddition(div, this.min).toFixed(this.precision));

    },

    _getPercentByValue: function (v) {
        return (v - this.min) * 100 / (this.max - this.min);
    },

    _setDraggableEnable: function (enable) {
        this.sliderOne.setEnable(enable);
        this.sliderTwo.setEnable(enable);
    },

    _getPrecision: function () {
        // 计算每一份值的精度(最大值和最小值的差值保留4为有效数字后的精度)
        // 如果差值的整数位数大于4,toPrecision(4)得到的是科学计数法123456 => 1.235e+5
        // 返回非负值: 保留的小数位数
        // 返回负值: 保留的10^n精度中的n
        var sub = this.calculation.accurateSubtraction(this.max, this.min);
        var pre = sub.toPrecision(4);
        // 科学计数法
        var eIndex = pre.indexOf("e");
        var arr = [];
        if(eIndex > -1) {
            arr = pre.split("e");
            var decimalPartLength = BI.size(arr[0].split(".")[1]);
            var sciencePartLength = BI.parseInt(arr[1].substring(1));
            return decimalPartLength - sciencePartLength;
        }
        arr = pre.split(".");
        return arr.length > 1 ? arr[1].length : 0;

    },

    _assertValue: function (value) {
        if(value <= this.min) {
            return this.min;
        }
        if(value >= this.max) {
            return this.max;
        }
        return value;
    },

    getValue: function () {
        if (this.valueOne <= this.valueTwo) {
            return {min: this.valueOne, max: this.valueTwo};
        }
        return {min: this.valueTwo, max: this.valueOne};

    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber >= minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
            this.valueOne = minNumber;
            this.valueTwo = maxNumber;
            this.precision = this._getPrecision();
            this._setDraggableEnable(true);
        }
        if (maxNumber === minNumber) {
            this._setDraggableEnable(false);
        }
    },

    setValue: function (v) {
        var o = this.options;
        var valueOne = BI.parseFloat(v.min);
        var valueTwo = BI.parseFloat(v.max);
        valueOne = o.digit === false ? valueOne : valueOne.toFixed(o.digit);
        valueTwo = o.digit === false ? valueTwo : valueTwo.toFixed(o.digit);
        if (!isNaN(valueOne) && !isNaN(valueTwo)) {
            if (this._checkValidation(valueOne)) {
                this.valueOne = valueOne;
            }
            if (this._checkValidation(valueTwo)) {
                this.valueTwo = valueTwo;
            }
            if (valueOne < this.min) {
                this.valueOne = this.min;
            }
            if (valueTwo > this.max) {
                this.valueTwo = this.max;
            }
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.valueOne = "";
        this.valueTwo = "";
        this.min = NaN;
        this.max = NaN;
        this._setBlueTrackWidth(0);
    },

    populate: function () {
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this.enable = true;
            this._setVisible(true);
            this._setErrorText();
            if ((BI.isNumeric(this.valueOne) || BI.isNotEmptyString(this.valueOne)) && (BI.isNumeric(this.valueTwo) || BI.isNotEmptyString(this.valueTwo))) {
                this.labelOne.setValue(this.valueOne);
                this.labelTwo.setValue(this.valueTwo);
                this._setAllPosition(this._getPercentByValue(this.valueOne), this._getPercentByValue(this.valueTwo));
            } else {
                this.labelOne.setValue(this.min);
                this.labelTwo.setValue(this.max);
                this._setAllPosition(0, 100);
            }
        }
    }
});
BI.IntervalSlider.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.interval_slider", BI.IntervalSlider);/**
 * Created by zcf on 2017/3/1.
 * 万恶的IEEE-754
 * 使用字符串精确计算含小数加法、减法、乘法和10的指数倍除法，支持负数
 */
BI.AccurateCalculationModel = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.AccurateCalculationModel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: ""
        });
    },

    _init: function () {
        BI.AccurateCalculationModel.superclass._init.apply(this, arguments);
    },

    _getMagnitude: function (n) {
        var magnitude = "1";
        for (var i = 0; i < n; i++) {
            magnitude += "0";
        }
        return BI.parseInt(magnitude);
    },

    _formatDecimal: function (stringNumber1, stringNumber2) {
        if (stringNumber1.numDecimalLength === stringNumber2.numDecimalLength) {
            return;
        }
        var magnitudeDiff = stringNumber1.numDecimalLength - stringNumber2.numDecimalLength;
        if (magnitudeDiff > 0) {
            var needAddZero = stringNumber2;
        } else {
            var needAddZero = stringNumber1;
            magnitudeDiff = (0 - magnitudeDiff);
        }
        for (var i = 0; i < magnitudeDiff; i++) {
            if (needAddZero.numDecimal === "0" && i === 0) {
                continue;
            }
            needAddZero.numDecimal += "0";
        }
    },

    _stringNumberFactory: function (num) {
        var strNum = num.toString();
        var numStrArray = strNum.split(".");
        var numInteger = numStrArray[0];
        if (numStrArray.length === 1) {
            var numDecimal = "0";
            var numDecimalLength = 0;
        } else {
            var numDecimal = numStrArray[1];
            var numDecimalLength = numStrArray[1].length;
        }
        return {
            numInteger: numInteger,
            numDecimal: numDecimal,
            numDecimalLength: numDecimalLength
        };
    },

    _accurateSubtraction: function (num1, num2) {// num1-num2 && num1>num2
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        // 整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) - BI.parseInt(stringNumber2.numInteger);
        // 小数部分
        this._formatDecimal(stringNumber1, stringNumber2);
        var decimalMaxLength = getDecimalMaxLength(stringNumber1, stringNumber2);

        if (BI.parseInt(stringNumber1.numDecimal) >= BI.parseInt(stringNumber2.numDecimal)) {
            var decimalResultTemp = (BI.parseInt(stringNumber1.numDecimal) - BI.parseInt(stringNumber2.numDecimal)).toString();
            var decimalResult = addZero(decimalResultTemp, decimalMaxLength);
        } else {// 否则借位
            integerResult--;
            var borrow = this._getMagnitude(decimalMaxLength);
            var decimalResultTemp = (borrow + BI.parseInt(stringNumber1.numDecimal) - BI.parseInt(stringNumber2.numDecimal)).toString();
            var decimalResult = addZero(decimalResultTemp, decimalMaxLength);
        }
        var result = integerResult + "." + decimalResult;
        return BI.parseFloat(result);

        function getDecimalMaxLength (num1, num2) {
            if (num1.numDecimal.length >= num2.numDecimal.length) {
                return num1.numDecimal.length;
            }
            return num2.numDecimal.length;
        }

        function addZero (resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp;
        }
    },

    _accurateAddition: function (num1, num2) {// 加法结合律
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        // 整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) + BI.parseInt(stringNumber2.numInteger);
        // 小数部分
        this._formatDecimal(stringNumber1, stringNumber2);

        var decimalResult = (BI.parseInt(stringNumber1.numDecimal) + BI.parseInt(stringNumber2.numDecimal)).toString();

        if (decimalResult !== "0") {
            if (decimalResult.length <= stringNumber1.numDecimal.length) {
                decimalResult = addZero(decimalResult, stringNumber1.numDecimal.length);
            } else {
                integerResult++;// 进一
                decimalResult = decimalResult.slice(1);
            }
        }
        var result = integerResult + "." + decimalResult;
        return BI.parseFloat(result);

        function addZero (resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp;
        }
    },

    _accurateMultiplication: function (num1, num2) {// 乘法分配律
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        // 整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) * BI.parseInt(stringNumber2.numInteger);
        // num1的小数和num2的整数
        var dec1Int2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numDecimal) * BI.parseInt(stringNumber2.numInteger), stringNumber1.numDecimalLength);
        // num1的整数和num2的小数
        var int1dec2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numInteger) * BI.parseInt(stringNumber2.numDecimal), stringNumber2.numDecimalLength);
        // 小数*小数
        var dec1dec2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numDecimal) * BI.parseInt(stringNumber2.numDecimal), (stringNumber1.numDecimalLength + stringNumber2.numDecimalLength));

        return this._accurateAddition(this._accurateAddition(this._accurateAddition(integerResult, dec1Int2), int1dec2), dec1dec2);
    },

    _accurateDivisionTenExponent: function (num, n) {// num/10^n && n>0
        var stringNumber = this._stringNumberFactory(num);
        if (stringNumber.numInteger.length > n) {
            var integerResult = stringNumber.numInteger.slice(0, (stringNumber.numInteger.length - n));
            var partDecimalResult = stringNumber.numInteger.slice(-n);
        } else {
            var integerResult = "0";
            var partDecimalResult = addZero(stringNumber.numInteger, n);
        }
        var result = integerResult + "." + partDecimalResult + stringNumber.numDecimal;
        return BI.parseFloat(result);

        function addZero (resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp;
        }
    },

    accurateSubtraction: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            if (num1 >= num2) {
                return this._accurateSubtraction(num1, num2);
            }
            return -this._accurateSubtraction(num2, num1);
        }
        if (num1 >= 0 && num2 < 0) {
            return this._accurateAddition(num1, -num2);
        }
        if (num1 < 0 && num2 >= 0) {
            return -this._accurateAddition(-num1, num2);
        }
        if (num1 < 0 && num2 < 0) {
            if (num1 >= num2) {
                return this._accurateSubtraction(-num2, -num1);
            }
            return this._accurateSubtraction(-num1, -num2);
        }
    },

    accurateAddition: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            return this._accurateAddition(num1, num2);
        }
        if (num1 >= 0 && num2 < 0) {
            return this.accurateSubtraction(num1, -num2);
        }
        if (num1 < 0 && num2 >= 0) {
            return this.accurateSubtraction(num2, -num1);
        }
        if (num1 < 0 && num2 < 0) {
            return -this._accurateAddition(-num1, -num2);
        }
    },

    accurateMultiplication: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            return this._accurateMultiplication(num1, num2);
        }
        if (num1 >= 0 && num2 < 0) {
            return -this._accurateMultiplication(num1, -num2);
        }
        if (num1 < 0 && num2 >= 0) {
            return -this._accurateMultiplication(-num1, num2);
        }
        if (num1 < 0 && num2 < 0) {
            return this._accurateMultiplication(-num1, -num2);
        }
    },

    accurateDivisionTenExponent: function (num1, n) {
        if (num1 >= 0) {
            return this._accurateDivisionTenExponent(num1, n);
        }
        return -this._accurateDivisionTenExponent(-num1, n);
    }
});/**
 * 月份下拉框
 *
 * Created by GUY on 2015/8/28.
 * @class BI.MonthCombo
 * @extends BI.Trigger
 */
BI.MonthCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MonthCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-month-combo",
            behaviors: {},
            height: 25
        });
    },
    _init: function () {
        BI.MonthCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.month_trigger",
            value: o.value
        });

        this.trigger.on(BI.MonthTrigger.EVENT_CONFIRM, function (v) {
            if (self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getValue());
            } else if (!this.getKey()) {
                self.setValue();
            }
            self.fireEvent(BI.MonthCombo.EVENT_CONFIRM);
        });
        this.trigger.on(BI.MonthTrigger.EVENT_FOCUS, function () {
            self.storeValue = this.getKey();
        });
        this.trigger.on(BI.MonthTrigger.EVENT_START, function () {
            self.combo.hideView();
        });
        this.trigger.on(BI.MonthTrigger.EVENT_STOP, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.popup = BI.createWidget({
            type: "bi.month_popup",
            behaviors: o.behaviors,
            value: o.value
        });
        this.popup.on(BI.MonthPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MonthCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                el: this.popup
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.MonthCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        if (BI.isNull(this.popup)) {
            return this.options.value || "";
        } else {
            return this.popup.getValue() || "";
        }
    }
});

BI.MonthCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.MonthCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.month_combo", BI.MonthCombo);/**
 * 月份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.MonthPopup
 * @extends BI.Trigger
 */
BI.MonthPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MonthPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-month-popup",
            behaviors: {}
        });
    },

    _init: function () {
        BI.MonthPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        // 纵向排列月
        var month = [1, 7, 2, 8, 3, 9, 4, 10, 5, 11, 6, 12];
        var items = [];
        items.push(month.slice(0, 2));
        items.push(month.slice(2, 4));
        items.push(month.slice(4, 6));
        items.push(month.slice(6, 8));
        items.push(month.slice(8, 10));
        items.push(month.slice(10, 12));
        items = BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return {
                    type: "bi.text_item",
                    cls: "bi-list-item-active",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    once: false,
                    forceSelected: true,
                    height: 23,
                    width: 38,
                    value: td,
                    text: td
                };
            });
        });

        this.month = BI.createWidget({
            type: "bi.button_group",
            element: this,
            behaviors: o.behaviors,
            items: BI.createItems(items, {}),
            layouts: [BI.LogicFactory.createLogic("table", BI.extend({
                dynamic: true
            }, {
                columns: 2,
                rows: 6,
                columnSize: [1 / 2, 1 / 2],
                rowSize: 25
            })), {
                type: "bi.center_adapt",
                vgap: 1,
                hgap: 2
            }],
            value: o.value
        });

        this.month.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MonthPopup.EVENT_CHANGE);
            }
        });
    },

    getValue: function () {
        return this.month.getValue()[0];
    },

    setValue: function (v) {
        this.month.setValue([v]);
    }
});
BI.MonthPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.month_popup", BI.MonthPopup);/**
 * 月份trigger
 *
 * Created by GUY on 2015/8/21.
 * @class BI.MonthTrigger
 * @extends BI.Trigger
 */
BI.MonthTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        errorText: BI.i18nText("BI-Month_Trigger_Error_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.MonthTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-month-trigger bi-border",
            height: 24
        });
    },
    _init: function () {
        BI.MonthTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                return v === "" || (BI.isPositiveInteger(v) && v >= 1 && v <= 12);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            errorText: c.errorText
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.MonthTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.MonthTrigger.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
                self.editor.setTitle(value);
            }
            self.fireEvent(BI.MonthTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.MonthTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.MonthTrigger.EVENT_STOP);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.text_button",
                        text: BI.i18nText("BI-Multi_Date_Month"),
                        baseCls: "bi-trigger-month-text",
                        width: o.height
                    },
                    width: o.height
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        width: o.height
                    },
                    width: o.height
                }
            ]
        });
        this.setValue(o.value);
    },
    setValue: function (v) {
        if(BI.isNotNull(v)) {
            this.editor.setState(v + 1);
            this.editor.setValue(v + 1);
            this.editor.setTitle(v + 1);
            return;
        }
        this.editor.setState("");
        this.editor.setValue("");
        this.editor.setTitle("");
    },
    getKey: function () {
        return this.editor.getValue() | 0;
    },
    getValue: function () {
        return this.editor.getValue() - 1;
    }
});
BI.MonthTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.MonthTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.MonthTrigger.EVENT_START = "EVENT_START";
BI.MonthTrigger.EVENT_STOP = "EVENT_STOP";
BI.MonthTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.month_trigger", BI.MonthTrigger);/**
 * Created by roy on 15/8/14.
 */
BI.DownListCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DownListCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-down-list-combo",
            height: 24,
            items: [],
            adjustLength: 0,
            direction: "bottom",
            trigger: "click",
            container: null,
            stopPropagation: false,
            el: {}
        });
    },

    _init: function () {
        BI.DownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popupview = BI.createWidget({
            type: "bi.multi_layer_down_list_popup",
            items: o.items,
            chooseType: o.chooseType,
            value: o.value
        });

        this.popupview.on(BI.DownListPopup.EVENT_CHANGE, function (value) {
            self.fireEvent(BI.DownListCombo.EVENT_CHANGE, value);
            self.downlistcombo.hideView();
        });

        this.popupview.on(BI.DownListPopup.EVENT_SON_VALUE_CHANGE, function (value, fatherValue) {
            self.fireEvent(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, value, fatherValue);
            self.downlistcombo.hideView();
        });


        this.downlistcombo = BI.createWidget({
            element: this,
            type: "bi.combo",
            trigger: o.trigger,
            isNeedAdjustWidth: false,
            container: o.container,
            adjustLength: o.adjustLength,
            direction: o.direction,
            stopPropagation: o.stopPropagation,
            el: BI.createWidget(o.el, {
                type: "bi.icon_trigger",
                extraCls: o.iconCls ? o.iconCls : "pull-down-font",
                width: o.width,
                height: o.height
            }),
            popup: {
                el: this.popupview,
                stopPropagation: true,
                maxHeight: 1000
            }
        });

        this.downlistcombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.DownListCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    hideView: function () {
        this.downlistcombo.hideView();
    },

    showView: function () {
        this.downlistcombo.showView();
    },

    populate: function (items) {
        this.popupview.populate(items);
    },

    setValue: function (v) {
        this.popupview.setValue(v);
    },
    getValue: function () {
        return this.popupview.getValue();
    }
});
BI.DownListCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DownListCombo.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.DownListCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.multi_layer_down_list_combo", BI.DownListCombo);/**
 * Created by roy on 15/9/8.
 * 处理popup中的item分组样式
 * 一个item分组中的成员大于一时，该分组设置为单选，并且默认状态第一个成员设置为已选择项
 */
BI.MultiLayerDownListPopup = BI.inherit(BI.Pane, {
    constants: {
        nextIcon: "pull-right-e-font",
        height: 25,
        iconHeight: 12,
        iconWidth: 12,
        hgap: 0,
        vgap: 0,
        border: 1
    },
    _defaultConfig: function () {
        var conf = BI.MultiLayerDownListPopup.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-popup",
            items: [],
            chooseType: BI.Selection.Multi
        });
    },
    _init: function () {
        BI.MultiLayerDownListPopup.superclass._init.apply(this, arguments);
        this.singleValues = [];
        this.childValueMap = {};
        this.fatherValueMap = {};
        var self = this, o = this.options, children = this._createPopupItems(o.items);
        this.popup = BI.createWidget({
            type: "bi.button_tree",
            items: BI.createItems(children,
                {}, {
                    adjustLength: -2
                }
            ),
            layouts: [{
                type: "bi.vertical",
                hgap: this.constants.hgap,
                vgap: this.constants.vgap
            }],
            value: this._digest(o.value),
            chooseType: o.chooseType
        });

        this.popup.on(BI.ButtonTree.EVENT_CHANGE, function (value, object) {
            var changedValue = value;
            if (BI.isNotNull(self.childValueMap[value])) {
                changedValue = self.childValueMap[value];
                var fatherValue = self.fatherValueMap[value];
                var fatherArrayValue = (fatherValue + "").split("_");
                self.fireEvent(BI.MultiLayerDownListPopup.EVENT_SON_VALUE_CHANGE, changedValue, fatherArrayValue.length > 1 ? fatherArrayValue : fatherValue);
            } else {
                self.fireEvent(BI.MultiLayerDownListPopup.EVENT_CHANGE, changedValue, object);
            }


            if (!self.singleValues.contains(changedValue)) {
                var item = self.getValue();
                var result = [];
                BI.each(item, function (i, valueObject) {
                    if (valueObject.value != changedValue) {
                        result.push(valueObject);
                    }
                });
                self.setValue(result);
            }

        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });

    },
    _createPopupItems: function (items) {
        var self = this, result = [];
        BI.each(items, function (i, it) {
            var item_done = {
                type: "bi.down_list_group",
                items: []
            };

            BI.each(it, function (i, item) {
                if (BI.isNotEmptyArray(item.children) && !BI.isEmpty(item.el)) {
                    item.type = "bi.combo_group";
                    item.cls = "down-list-group";
                    item.trigger = "hover";
                    item.isNeedAdjustWidth = false;
                    item.el.title = item.el.title || item.el.text;
                    item.el.type = "bi.down_list_group_item";
                    item.el.logic = {
                        dynamic: true
                    };
                    item.el.height = self.constants.height;
                    item.el.iconCls2 = self.constants.nextIcon;
                    item.popup = {
                        lgap: 4,
                        el: {
                            type: "bi.button_tree",
                            chooseType: 0,
                            layouts: [{
                                type: "bi.vertical"
                            }]

                        }
                    };
                    item.el.childValues = [];
                    BI.each(item.children, function (i, child) {
                        child = child.el ? BI.extend(child.el, {children: child.children}) : child;
                        var fatherValue = BI.deepClone(item.el.value);
                        var childValue = BI.deepClone(child.value);
                        self.singleValues.push(child.value);
                        child.type = "bi.down_list_item";
                        child.extraCls = " child-down-list-item";
                        child.title = child.title || child.text;
                        child.textRgap = 10;
                        child.isNeedAdjustWidth = false;
                        child.logic = {
                            dynamic: true
                        };
                        child.father = fatherValue;
                        self.fatherValueMap[self._createChildValue(fatherValue, childValue)] = fatherValue;
                        self.childValueMap[self._createChildValue(fatherValue, childValue)] = childValue;
                        child.value = self._createChildValue(fatherValue, childValue);
                        item.el.childValues.push(child.value);
                        if (BI.isNotEmptyArray(child.children)) {
                            child.type = "bi.down_list_group_item";
                            self._createChildren(child);
                            child.height = self.constants.height;
                            child.iconCls2 = self.constants.nextIcon;
                            item.el.childValues = BI.concat(item.el.childValues, child.childValues);
                        }
                    });
                } else {
                    item.type = "bi.down_list_item";
                    item.title = item.title || item.text;
                    item.textRgap = 10;
                    item.isNeedAdjustWidth = false;
                    item.logic = {
                        dynamic: true
                    };
                }
                var el_done = {};
                el_done.el = item;
                item_done.items.push(el_done);
            });
            if (self._isGroup(item_done.items)) {
                BI.each(item_done.items, function (i, item) {
                    self.singleValues.push(item.el.value);
                });
            }

            result.push(item_done);
            if (self._needSpliter(i, items.length)) {
                var spliter_container = BI.createWidget({
                    type: "bi.vertical",
                    items: [{
                        el: {
                            type: "bi.layout",
                            cls: "bi-down-list-spliter bi-border-top cursor-pointer",
                            height: 0
                        }

                    }],
                    cls: "bi-down-list-spliter-container cursor-pointer",
                    lgap: 10,
                    rgap: 10
                });
                result.push(spliter_container);
            }
        });
        return result;
    },

    _createChildren: function (child) {
        var self = this;
        child.childValues = [];
        BI.each(child.children, function (i, c) {
            var fatherValue = BI.deepClone(child.value);
            var childValue = BI.deepClone(c.value);
            c.type = "bi.down_list_item";
            c.title = c.title || c.text;
            c.textRgap = 10;
            c.isNeedAdjustWidth = false;
            c.logic = {
                dynamic: true
            };
            c.father = fatherValue;
            self.fatherValueMap[self._createChildValue(fatherValue, childValue)] = fatherValue;
            self.childValueMap[self._createChildValue(fatherValue, childValue)] = childValue;
            c.value = self._createChildValue(fatherValue, childValue);
            child.childValues.push(c.value);
        });
    },

    _isGroup: function (i) {
        return i.length > 1;
    },

    _needSpliter: function (i, itemLength) {
        return i < itemLength - 1;
    },

    _createChildValue: function (fatherValue, childValue) {
        var fValue = fatherValue;
        if(BI.isArray(fatherValue)) {
            fValue = fatherValue.join("_");
        }
        return fValue + "_" + childValue;
    },

    _digest: function (valueItem) {
        var self = this;
        var valueArray = [];
        BI.each(valueItem, function (i, item) {
                var value;
                if (BI.isNotNull(item.childValue)) {
                    value = self._createChildValue(item.value, item.childValue);
                } else {
                    value = item.value;
                }
                valueArray.push(value);
            }
        );
        return valueArray;
    },

    _checkValues: function (values) {
        var self = this, o = this.options;
        var value = [];
        BI.each(o.items, function (idx, itemGroup) {
            BI.each(itemGroup, function (id, item) {
                if(BI.isNotNull(item.children)) {
                    var childValues = getChildrenValue(item);
                    var v = joinValue(childValues, values[idx]);
                    if(BI.isNotEmptyString(v)) {
                        value.push(v);
                    }
                }else{
                    if(item.value === values[idx][0]) {
                        value.push(values[idx][0]);
                    }
                }
            });
        });
        return value;

        function joinValue (sources, targets) {
            var value = "";
            BI.some(sources, function (idx, s) {
                return BI.some(targets, function (id, t) {
                    if(s === t) {
                        value = s;
                        return true;
                    }
                });
            });
            return value;
        }

        function getChildrenValue (item) {
            var children = [];
            if(BI.isNotNull(item.children)) {
                BI.each(item.children, function (idx, child) {
                    children = BI.concat(children, getChildrenValue(child));
                });
            } else {
                children.push(item.value);
            }
            return children;
        }
    },

    populate: function (items) {
        BI.MultiLayerDownListPopup.superclass.populate.apply(this, arguments);
        var self = this;
        self.childValueMap = {};
        self.fatherValueMap = {};
        self.singleValues = [];
        var children = self._createPopupItems(items);
        var popupItem = BI.createItems(children,
            {}, {
                adjustLength: -2
            }
        );
        self.popup.populate(popupItem);
    },

    setValue: function (valueItem) {
        this.popup.setValue(this._digest(valueItem));
    },

    _getValue: function () {
        var v = [];
        BI.each(this.popup.getAllButtons(), function (i, item) {
            i % 2 === 0 && v.push(item.getValue());
        });
        return v;
    },

    getValue: function () {
        var self = this, result = [];
        var values = this._checkValues(this._getValue());
        BI.each(values, function (i, value) {
            var valueItem = {};
            if (BI.isNotNull(self.childValueMap[value])) {
                var fartherValue = self.fatherValueMap[value];
                valueItem.childValue = self.childValueMap[value];
                var fatherArrayValue = (fartherValue + "").split("_");
                valueItem.value = fatherArrayValue.length > 1 ? fatherArrayValue : fartherValue;
            } else {
                valueItem.value = value;
            }
            result.push(valueItem);
        });
        return result;
    }


});

BI.MultiLayerDownListPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiLayerDownListPopup.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.shortcut("bi.multi_layer_down_list_popup", BI.MultiLayerDownListPopup);/**
 * @class BI.MultiLayerSelectTreeCombo
 * @extends BI.Widget
 */
BI.MultiLayerSelectTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSelectTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer_select_tree-combo",
            isDefaultInit: false,
            height: 30,
            text: "",
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.MultiLayerSelectTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items,
            value: o.value
        });

        this.popup = BI.createWidget({
            type: "bi.multilayer_select_tree_popup",
            isDefaultInit: o.isDefaultInit,
            items: o.items,
            value: o.value
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.popup.on(BI.MultiLayerSelectTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});
BI.MultiLayerSelectTreeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_select_tree_combo", BI.MultiLayerSelectTreeCombo);/**
 * guy
 * 二级树
 * @class BI.MultiLayerSelectLevelTree
 * @extends BI.Select
 */
BI.MultiLayerSelectLevelTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSelectLevelTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-select-level-tree",
            isDefaultInit: false,
            items: [],
            itemsCreator: BI.emptyFn,
            value: ""
        });
    },

    _init: function () {
        BI.MultiLayerSelectLevelTree.superclass._init.apply(this, arguments);

        this.initTree(this.options.items);
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {};
            node.layer = layer;
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.multilayer_select_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.multilayer_select_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.multilayer_select_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);

                self._formatItems(node.children, layer + 1);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.multilayer_single_tree_last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.multilayer_single_tree_mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _assertId: function (sNodes) {
        BI.each(sNodes, function (i, node) {
            node.id = node.id || BI.UUID();
        });
    },

    // 构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        this.empty();
        this._assertId(nodes);
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            cls: "tree-view display-inline",
            expander: {
                type: "bi.select_tree_expander",
                isDefaultInit: o.isDefaultInit,
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            items: this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0),
            itemsCreator: o.itemsCreator,
            value: o.value,

            el: {
                type: "bi.button_tree",
                chooseType: BI.Selection.Single,
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MultiLayerSelectLevelTree.EVENT_CHANGE, arguments);
            }
        });

        BI.createWidget({
            type: "bi.adaptive",
            element: this,
            scrollable: true,
            items: [this.tree]
        })
    },

    populate: function (nodes) {
        this.tree.populate(this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0));
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        return BI.uniq(this.tree.getValue());
    },

    getAllLeaves: function () {
        return this.tree.getAllLeaves();
    },

    getNodeById: function (id) {
        return this.tree.getNodeById(id);
    },

    getNodeByValue: function (id) {
        return this.tree.getNodeByValue(id);
    }
});
BI.MultiLayerSelectLevelTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.multilayer_select_level_tree", BI.MultiLayerSelectLevelTree);/**
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSelectTreePopup
 * @extends BI.Pane
 */

BI.MultiLayerSelectTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-select-tree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            isDefaultInit: false,
            itemsCreator: BI.emptyFn,
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.MultiLayerSelectTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: "bi.multilayer_select_level_tree",
            isDefaultInit: o.isDefaultInit,
            items: o.items,
            value: o.value,
            itemsCreator: o.itemsCreator
        });

        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            scrollable: true,
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.MultiLayerSelectLevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiLayerSelectTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.MultiLayerSelectTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.MultiLayerSelectTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_select_tree_popup", BI.MultiLayerSelectTreePopup);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSelectTreeFirstPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSelectTreeFirstPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSelectTreeFirstPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-select-tree-first-plus-group-node bi-list-item-active",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSelectTreeFirstPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.select_tree_first_plus_group_node",
            cls: "bi-list-item-none",
            stopPropagation: true,
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.setSelected(self.isSelected());
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    isSelected: function () {
        return this.node.isSelected();
    },

    setSelected: function (b) {
        BI.MultiLayerSelectTreeFirstPlusGroupNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSelectTreeFirstPlusGroupNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

BI.shortcut("bi.multilayer_select_tree_first_plus_group_node", BI.MultiLayerSelectTreeFirstPlusGroupNode);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSelectTreeLastPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSelectTreeLastPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSelectTreeLastPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-select-tree-last-plus-group-node bi-list-item-active",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSelectTreeLastPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.select_tree_last_plus_group_node",
            cls: "bi-list-item-none",
            stopPropagation: true,
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.setSelected(self.isSelected());
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    isSelected: function () {
        return this.node.isSelected();
    },

    setSelected: function (b) {
        BI.MultiLayerSelectTreeLastPlusGroupNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.MultiLayerSelectTreeLastPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSelectTreeLastPlusGroupNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

BI.shortcut("bi.multilayer_select_tree_last_plus_group_node", BI.MultiLayerSelectTreeLastPlusGroupNode);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSelectTreeMidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSelectTreeMidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSelectTreeMidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-select-tree-mid-plus-group-node bi-list-item-active",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.select_tree_mid_plus_group_node",
            cls: "bi-list-item-none",
            stopPropagation: true,
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.setSelected(self.isSelected());
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    isSelected: function () {
        return this.node.isSelected();
    },

    setSelected: function (b) {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

BI.shortcut("bi.multilayer_select_tree_mid_plus_group_node", BI.MultiLayerSelectTreeMidPlusGroupNode);/**
 * 多层级下拉单选树
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreeCombo
 * @extends BI.Widget
 */
BI.MultiLayerSingleTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-singletree-combo",
            isDefaultInit: false,
            height: 30,
            text: "",
            itemsCreator: BI.emptyFn,
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.MultiLayerSingleTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items,
            value: o.value
        });

        this.popup = BI.createWidget({
            type: "bi.multilayer_single_tree_popup",
            isDefaultInit: o.isDefaultInit,
            itemsCreator: o.itemsCreator,
            items: o.items,
            value: o.value
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.popup.on(BI.MultiLayerSingleTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});

BI.MultiLayerSingleTreeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_combo", BI.MultiLayerSingleTreeCombo);/**
 * guy
 * 二级树
 * @class BI.MultiLayerSingleLevelTree
 * @extends BI.Single
 */
BI.MultiLayerSingleLevelTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleLevelTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-single-level-tree",
            isDefaultInit: false,
            items: [],
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiLayerSingleLevelTree.superclass._init.apply(this, arguments);

        this.initTree(this.options.items);
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {};
            node.layer = layer;
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.multilayer_single_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.multilayer_single_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.multilayer_single_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);

                self._formatItems(node.children, layer + 1);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.multilayer_single_tree_last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.multilayer_single_tree_mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _assertId: function (sNodes) {
        BI.each(sNodes, function (i, node) {
            node.id = node.id || BI.UUID();
        });
    },

    // 构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        this.empty();
        this._assertId(nodes);
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            cls: "tree-view display-inline",
            expander: {
                isDefaultInit: o.isDefaultInit,
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            items: this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0),
            value: o.value,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (items) {
                    callback(BI.Tree.transformToTreeFormat(items), 0);
                });
            },

            el: {
                type: "bi.button_tree",
                chooseType: BI.Selection.Single,
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type, v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MultiLayerSingleLevelTree.EVENT_CHANGE, v);
            }
        });

        BI.createWidget({
            type: "bi.adaptive",
            element: this,
            scrollable: true,
            items: [this.tree]
        })
    },

    populate: function (nodes) {
        this.tree.populate(this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0));
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        return BI.filter(BI.uniq(this.tree.getValue()), function (idx, value) {
            return BI.isNotNull(value);
        });

    },

    getAllLeaves: function () {
        return this.tree.getAllLeaves();
    },

    getNodeById: function (id) {
        return this.tree.getNodeById(id);
    },

    getNodeByValue: function (id) {
        return this.tree.getNodeByValue(id);
    }
});
BI.MultiLayerSingleLevelTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.multilayer_single_level_tree", BI.MultiLayerSingleLevelTree);
/**
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreePopup
 * @extends BI.Pane
 */

BI.MultiLayerSingleTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-singletree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            isDefaultInit: false,
            itemsCreator: BI.emptyFn,
            items: []
        });
    },

    _init: function () {
        BI.MultiLayerSingleTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: "bi.multilayer_single_level_tree",
            isDefaultInit: o.isDefaultInit,
            items: o.items,
            itemsCreator: o.itemsCreator,
            value: o.value
        });

        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            scrollable: true,
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.MultiLayerSingleLevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiLayerSingleTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.MultiLayerSingleTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.MultiLayerSingleTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_popup", BI.MultiLayerSingleTreePopup);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeFirstPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSingleTreeFirstPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSingleTreeFirstPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-single-tree-first-plus-group-node bi-list-item",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreeFirstPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.first_plus_group_node",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {// 本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    doClick: function () {
        BI.MultiLayerSingleTreeFirstPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSingleTreeFirstPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.node)) {
            this.node.setOpened(v);
        }
    }
});

BI.shortcut("bi.multilayer_single_tree_first_plus_group_node", BI.MultiLayerSingleTreeFirstPlusGroupNode);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeLastPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSingleTreeLastPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSingleTreeLastPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-single-tree-last-plus-group-node bi-list-item",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreeLastPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.last_plus_group_node",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {// 本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    doClick: function () {
        BI.MultiLayerSingleTreeLastPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSingleTreeLastPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.node)) {
            this.node.setOpened(v);
        }
    }
});

BI.shortcut("bi.multilayer_single_tree_last_plus_group_node", BI.MultiLayerSingleTreeLastPlusGroupNode);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeMidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSingleTreeMidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSingleTreeMidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-single-tree-mid-plus-group-node bi-list-item",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.mid_plus_group_node",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {// 本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    doClick: function () {
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.node)) {
            this.node.setOpened(v);
        }
    }
});

BI.shortcut("bi.multilayer_single_tree_mid_plus_group_node", BI.MultiLayerSingleTreeMidPlusGroupNode);/**
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeFirstTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerSingleTreeFirstTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeFirstTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-single-tree-first-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            layer: 0,
            id: "",
            pId: "",
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreeFirstTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.first_tree_leaf_item",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
        this.item.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {// 本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.item);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doHighLight: function () {
        this.item.doHighLight.apply(this.item, arguments);
    },

    unHighLight: function () {
        this.item.unHighLight.apply(this.item, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MultiLayerSingleTreeFirstTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.item.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MultiLayerSingleTreeFirstTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.item.setSelected(v);
    }
});

BI.shortcut("bi.multilayer_single_tree_first_tree_leaf_item", BI.MultiLayerSingleTreeFirstTreeLeafItem);/**
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeLastTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerSingleTreeLastTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeLastTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-single-tree-last-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            layer: 0,
            id: "",
            pId: "",
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.last_tree_leaf_item",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
        this.item.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {// 本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.item);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doHighLight: function () {
        this.item.doHighLight.apply(this.item, arguments);
    },

    unHighLight: function () {
        this.item.unHighLight.apply(this.item, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.item.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.item.setSelected(v);
    }
});

BI.shortcut("bi.multilayer_single_tree_last_tree_leaf_item", BI.MultiLayerSingleTreeLastTreeLeafItem);/**
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeMidTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerSingleTreeMidTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeMidTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-single-tree-mid-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            layer: 0,
            id: "",
            pId: "",
            height: 25
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreeMidTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.mid_tree_leaf_item",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
        this.item.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {// 本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            });
        });
        items.push(this.item);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doHighLight: function () {
        this.item.doHighLight.apply(this.item, arguments);
    },

    unHighLight: function () {
        this.item.unHighLight.apply(this.item, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MultiLayerSingleTreeMidTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.item.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MultiLayerSingleTreeMidTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.item.setSelected(v);
    }
});

BI.shortcut("bi.multilayer_single_tree_mid_tree_leaf_item", BI.MultiLayerSingleTreeMidTreeLeafItem);/**
 *
 * @class BI.MultiSelectCheckPane
 * @extends BI.Widget
 */
BI.MultiSelectCheckPane = BI.inherit(BI.Widget, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-check-pane bi-background",
            items: [],
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            onClickContinueSelect: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectCheckPane.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.storeValue = opts.value || {};
        this.display = BI.createWidget({
            type: "bi.display_selected_list",
            items: opts.items,
            itemsCreator: function (op, callback) {
                op = BI.extend(op || {}, {
                    selectedValues: self.storeValue.value
                });
                if (self.storeValue.type === BI.Selection.Multi) {
                    callback({
                        items: BI.map(self.storeValue.value, function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt
                            };
                        })
                    });
                    return;
                }
                opts.itemsCreator(op, callback);
            }
        });

        this.continueSelect = BI.createWidget({
            type: "bi.text_button",
            text: BI.i18nText("BI-Continue_Select"),
            cls: "multi-select-check-selected bi-high-light"
        });

        this.continueSelect.on(BI.TextButton.EVENT_CHANGE, function () {
            opts.onClickContinueSelect();
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                height: this.constants.height,
                el: {
                    type: "bi.left",
                    cls: "multi-select-continue-select",
                    items: [
                        {
                            el: {
                                type: "bi.label",
                                text: BI.i18nText("BI-Selected_Data")
                            },
                            lgap: this.constants.lgap,
                            tgap: this.constants.tgap
                        },
                        {
                            el: this.continueSelect,
                            lgap: this.constants.lgap,
                            tgap: this.constants.tgap
                        }]
                }
            }, {
                height: "fill",
                el: this.display
            }]
        });
    },

    setValue: function (v) {
        this.storeValue = v || {};
    },

    empty: function () {
        this.display.empty();
    },

    populate: function () {
        this.display.populate.apply(this.display, arguments);
    }
});

BI.shortcut("bi.multi_select_check_pane", BI.MultiSelectCheckPane);/**
 *
 *
 * 查看已选弹出层的展示面板
 * @class BI.DisplaySelectedList
 * @extends BI.Widget
 */
BI.DisplaySelectedList = BI.inherit(BI.Pane, {

    constants: {
        height: 25,
        lgap: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.DisplaySelectedList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-display-list",
            itemsCreator: BI.emptyFn,
            items: []
        });
    },

    _init: function () {
        BI.DisplaySelectedList.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.hasNext = false;

        this.button_group = BI.createWidget({
            type: "bi.list_pane",
            element: this,
            el: {
                type: "bi.loader",
                isDefaultInit: false,
                logic: {
                    dynamic: true,
                    scrolly: true
                },
                items: this._createItems(opts.items),
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical",
                    lgap: 10
                }]
            },
            itemsCreator: function (options, callback) {

                opts.itemsCreator(options, function (ob) {
                    self.hasNext = !!ob.hasNext;
                    callback(self._createItems(ob.items));
                });
            },
            hasNext: function () {
                return self.hasNext;
            }
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.icon_text_item",
            cls: "cursor-default check-font display-list-item bi-tips",
            once: true,
            invalid: true,
            selected: true,
            height: this.constants.height,
            logic: {
                dynamic: true
            }
        });
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        if (arguments.length === 0) {
            this.button_group.populate();
        } else {
            this.button_group.populate(this._createItems(items));
        }
    }
});

BI.shortcut("bi.display_selected_list", BI.DisplaySelectedList);/**
 *
 * @class BI.MultiSelectInsertCombo
 * @extends BI.Single
 */
BI.MultiSelectInsertCombo = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectInsertCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-insert-combo",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 28
        });
    },

    _init: function () {
        BI.MultiSelectInsertCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var assertShowValue = function () {
            BI.isKey(self._startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](self._startValue);
            self.trigger.getSearcher().setState(self.storeValue);
            self.trigger.getCounter().setButtonChecked(self.storeValue);
        };
        this.storeValue = {};
        // 标记正在请求数据
        this.requesting = false;

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            // adapter: this.popup,
            masker: {
                offset: {
                    left: 1,
                    top: 1,
                    right: 2,
                    bottom: 33
                }
            },
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (res) {
                    if (op.times === 1 && BI.isNotNull(op.keywords)) {
                        // 预防trigger内部把当前的storeValue改掉
                        self.trigger.setValue(BI.deepClone(self.getValue()));
                    }
                    callback.apply(self, arguments);
                });
            },
            value: o.value
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self._setStartValue("");
            this.getSearcher().setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self._setStartValue("");
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_PAUSE, function () {
            // if (this.getSearcher().hasMatched()) {
            var keyword = this.getSearcher().getKeyword();
            self._join({
                type: BI.Selection.Multi,
                value: [keyword]
            }, function () {
                // 如果在不选的状态下直接把该值添加进来
                if (self.storeValue.type === BI.Selection.Multi) {
                    self.storeValue.value.pushDistinct(keyword);
                }
                self.combo.setValue(self.storeValue);
                self._setStartValue(keyword);
                assertShowValue();
                self.populate();
                self._setStartValue("");
            });
            // }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_SEARCHING, function (keywords) {
            var last = BI.last(keywords);
            keywords = BI.initial(keywords || []);
            if (keywords.length > 0) {
                self._joinKeywords(keywords, function () {
                    if (BI.isEndWithBlank(last)) {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                        self.combo.populate();
                        self._setStartValue("");
                    } else {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                    }
                });
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function (value, obj) {
            if (obj instanceof BI.MultiSelectBar) {
                self._joinAll(this.getValue(), function () {
                    assertShowValue();
                });
            } else {
                self._join(this.getValue(), function () {
                    assertShowValue();
                });
            }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW, function () {
            this.getCounter().setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: "bi.multi_select_popup_view",
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.MultiSelectPopupView.EVENT_CHANGE,
                    action: function () {
                        self.storeValue = this.getValue();
                        self._adjust(function () {
                            assertShowValue();
                        });
                    }
                }, {
                    eventName: BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self._defaultState();
                    }
                }, {
                    eventName: BI.MultiSelectPopupView.EVENT_CLICK_CLEAR,
                    action: function () {
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: o.itemsCreator,
                valueFormatter: o.valueFormatter,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.combo.adjustWidth();
                        self.combo.adjustHeight();
                        self.trigger.getCounter().adjustView();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            },
            value: o.value,
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            }
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            this.setValue(self.storeValue);
            BI.nextTick(function () {
                self.populate();
            });
        });
        // 当退出的时候如果还在处理请求，则等请求结束后再对外发确定事件
        this.wants2Quit = false;
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            // important:关闭弹出时又可能没有退出编辑状态
            self.trigger.stopEditing();
            if (self.requesting === true) {
                self.wants2Quit = true;
            } else {
                self.fireEvent(BI.MultiSelectInsertCombo.EVENT_CONFIRM);
            }
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "multi-select-trigger-icon-button"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            self.trigger.getCounter().hideView();
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        this.requesting = true;
        o.itemsCreator({
            type: BI.MultiSelectInsertCombo.REQ_GET_ALL_DATA,
            keywords: keywords
        }, function (ob) {
            var values = BI.map(ob.items, "value");
            digest(values);
        });

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value[self.storeValue.type === BI.Selection.Multi ? "pushDistinct" : "remove"](val);
                }
            });
            self._adjust(callback);
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this.requesting = true;
        o.itemsCreator({
            type: BI.MultiSelectInsertCombo.REQ_GET_ALL_DATA,
            keywords: [this.trigger.getKey()]
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                self._adjust(callback);
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            self._adjust(callback);
        });
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        adjust();
        callback();
        function adjust () {
            if (self.wants2Quit === true) {
                self.fireEvent(BI.MultiSelectInsertCombo.EVENT_CONFIRM);
                self.wants2Quit = false;
            }
            self.requesting = false;
        }
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            self._adjust(callback);
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.popup.setStartValue(value);
    },

    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.combo.setValue(this.storeValue);
    },

    getValue: function () {
        return BI.deepClone(this.storeValue);
    },

    populate: function () {
        this.combo.populate.apply(this.combo, arguments);
    }
});

BI.extend(BI.MultiSelectInsertCombo, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.MultiSelectInsertCombo.EVENT_CONFIRM = "EVENT_CONFIRM";

BI.shortcut("bi.multi_select_insert_combo", BI.MultiSelectInsertCombo);/**
 *
 * @class BI.MultiSelectCombo
 * @extends BI.Single
 */
BI.MultiSelectCombo = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-combo",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 28
        });
    },

    _init: function () {
        BI.MultiSelectCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var assertShowValue = function () {
            BI.isKey(self._startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](self._startValue);
            self.trigger.getSearcher().setState(self.storeValue);
            self.trigger.getCounter().setButtonChecked(self.storeValue);
        };
        this.storeValue = o.value || {};
        
        this._assertValue(this.storeValue);
        
        // 标记正在请求数据
        this.requesting = false;

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            // adapter: this.popup,
            masker: {
                offset: {
                    left: 1,
                    top: 1,
                    right: 2,
                    bottom: 33
                }
            },
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (res) {
                    if (op.times === 1 && BI.isNotNull(op.keywords)) {
                        // 预防trigger内部把当前的storeValue改掉
                        self.trigger.setValue(BI.deepClone(self.getValue()));
                    }
                    callback.apply(self, arguments);
                });
            },
            value: this.storeValue
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self._setStartValue("");
            this.getSearcher().setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self._setStartValue("");
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_PAUSE, function () {
            if (this.getSearcher().hasMatched()) {
                var keyword = this.getSearcher().getKeyword();
                self._join({
                    type: BI.Selection.Multi,
                    value: [keyword]
                }, function () {
                    self.combo.setValue(self.storeValue);
                    self._setStartValue(keyword);
                    assertShowValue();
                    self.populate();
                    self._setStartValue("");
                });
            }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_SEARCHING, function (keywords) {
            var last = BI.last(keywords);
            keywords = BI.initial(keywords || []);
            if (keywords.length > 0) {
                self._joinKeywords(keywords, function () {
                    if (BI.isEndWithBlank(last)) {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                        self.combo.populate();
                        self._setStartValue("");
                    } else {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                    }
                });
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function (value, obj) {
            if (obj instanceof BI.MultiSelectBar) {
                self._joinAll(this.getValue(), function () {
                    assertShowValue();
                });
            } else {
                self._join(this.getValue(), function () {
                    assertShowValue();
                });
            }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW, function () {
            this.getCounter().setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: "bi.multi_select_popup_view",
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.MultiSelectPopupView.EVENT_CHANGE,
                    action: function () {
                        self.storeValue = this.getValue();
                        self._adjust(function () {
                            assertShowValue();
                        });
                    }
                }, {
                    eventName: BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self._defaultState();
                    }
                }, {
                    eventName: BI.MultiSelectPopupView.EVENT_CLICK_CLEAR,
                    action: function () {
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: o.itemsCreator,
                valueFormatter: o.valueFormatter,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.combo.adjustWidth();
                        self.combo.adjustHeight();
                        self.trigger.getCounter().adjustView();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            },
            value: o.value,
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            }
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            this.setValue(self.storeValue);
            BI.nextTick(function () {
                self.populate();
            });
        });
        // 当退出的时候如果还在处理请求，则等请求结束后再对外发确定事件
        this.wants2Quit = false;
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            // important:关闭弹出时又可能没有退出编辑状态
            self.trigger.stopEditing();
            if (self.requesting === true) {
                self.wants2Quit = true;
            } else {
                self.fireEvent(BI.MultiSelectCombo.EVENT_CONFIRM);
            }
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "multi-select-trigger-icon-button"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            self.trigger.getCounter().hideView();
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        this.requesting = true;
        o.itemsCreator({
            type: BI.MultiSelectCombo.REQ_GET_ALL_DATA,
            keywords: keywords
        }, function (ob) {
            var values = BI.map(ob.items, "value");
            digest(values);
        });

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value[self.storeValue.type === BI.Selection.Multi ? "pushDistinct" : "remove"](val);
                }
            });
            self._adjust(callback);
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this.requesting = true;
        o.itemsCreator({
            type: BI.MultiSelectCombo.REQ_GET_ALL_DATA,
            keywords: [this.trigger.getKey()]
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                self._adjust(callback);
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            self._adjust(callback);
        });
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        if (!this._count) {
            o.itemsCreator({
                type: BI.MultiSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                self._count = res.count;
                adjust();
                callback();
            });
        } else {
            adjust();
            callback();

        }

        function adjust () {
            if (self.storeValue.type === BI.Selection.All && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.Multi,
                    value: []
                };
            } else if (self.storeValue.type === BI.Selection.Multi && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.All,
                    value: []
                };
            }
            if (self.wants2Quit === true) {
                self.fireEvent(BI.MultiSelectCombo.EVENT_CONFIRM);
                self.wants2Quit = false;
            }
            self.requesting = false;
        }
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            self._adjust(callback);
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.popup.setStartValue(value);
    },

    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.combo.setValue(this.storeValue);
    },

    getValue: function () {
        return BI.deepClone(this.storeValue);
    },

    populate: function () {
        this._count = null;
        this.combo.populate.apply(this.combo, arguments);
    }
});

BI.extend(BI.MultiSelectCombo, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.MultiSelectCombo.EVENT_CONFIRM = "EVENT_CONFIRM";

BI.shortcut("bi.multi_select_combo", BI.MultiSelectCombo);/**
 * 多选加载数据面板
 * Created by guy on 15/11/2.
 * @class BI.MultiSelectLoader
 * @extends Widget
 */
BI.MultiSelectLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-loader",
            logic: {
                dynamic: true
            },
            el: {
                height: 400
            },
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;

        this.storeValue = opts.value || {};
        this._assertValue(this.storeValue);

        this.button_group = BI.createWidget({
            type: "bi.select_list",
            element: this,
            logic: opts.logic,
            el: BI.extend({
                onLoaded: opts.onLoaded,
                el: {
                    type: "bi.loader",
                    isDefaultInit: false,
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            }, opts.el),
            itemsCreator: function (op, callback) {
                var startValue = self._startValue;
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: BI.isKey(startValue) && self.storeValue.type === BI.Selection.Multi
                        ? self.storeValue.value.concat(startValue) : self.storeValue.value
                }));
                opts.itemsCreator(op, function (ob) {
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = BI.map(self.storeValue.value, function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt,
                                selected: self.storeValue.type === BI.Selection.Multi
                            };
                        });
                        if (BI.isKey(self._startValue) && !self.storeValue.value.contains(self._startValue)) {
                            var txt = opts.valueFormatter(startValue) || startValue;
                            json.unshift({
                                text: txt,
                                value: startValue,
                                title: txt,
                                selected: true
                            });
                        }
                        firstItems = self._createItems(json);
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), ob.keyword || "");
                    if (op.times === 1 && self.storeValue) {
                        BI.isKey(startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](startValue);
                        self.setValue(self.storeValue);
                    }
                    (op.times === 1) && self._scrollToTop();
                });
            },
            hasNext: function () {
                return hasNext;
            },
            value: this.storeValue
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            logic: this.options.logic,
            height: 25,
            selected: this.isAllSelected()
        });
    },

    _scrollToTop: function () {
        var self = this;
        BI.delay(function () {
            self.button_group.element.scrollTop(0);
        }, 30);
    },

    isAllSelected: function () {
        return this.button_group.isAllSelected();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    setStartValue: function (v) {
        this._startValue = v;
    },

    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.button_group.setValue(this.storeValue);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.MultiSelectLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_loader", BI.MultiSelectLoader);/**
 * 带加载的多选下拉面板
 * @class BI.MultiSelectPopupView
 * @extends Widget
 */
BI.MultiSelectPopupView = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-popup-view",
            maxWidth: "auto",
            minWidth: 135,
            maxHeight: 400,
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectPopupView.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;

        this.loader = BI.createWidget({
            type: "bi.multi_select_loader",
            itemsCreator: opts.itemsCreator,
            valueFormatter: opts.valueFormatter,
            onLoaded: opts.onLoaded,
            value: opts.value
        });

        this.popupView = BI.createWidget({
            type: "bi.multi_popup_view",
            stopPropagation: false,
            maxWidth: opts.maxWidth,
            minWidth: opts.minWidth,
            maxHeight: opts.maxHeight,
            element: this,
            buttons: [BI.i18nText("BI-Basic_Clears"), BI.i18nText("BI-Basic_Sure")],
            el: this.loader,
            value: opts.value
        });

        this.popupView.on(BI.MultiPopupView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectPopupView.EVENT_CHANGE);
        });
        this.popupView.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.fireEvent(BI.MultiSelectPopupView.EVENT_CLICK_CLEAR);
                    break;
                case 1:
                    self.fireEvent(BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM);
                    break;
            }
        });
    },

    isAllSelected: function () {
        return this.loader.isAllSelected();
    },

    setStartValue: function (v) {
        this.loader.setStartValue(v);
    },

    setValue: function (v) {
        this.popupView.setValue(v);
    },

    getValue: function () {
        return this.popupView.getValue();
    },

    populate: function (items) {
        this.popupView.populate.apply(this.popupView, arguments);
    },

    resetHeight: function (h) {
        this.popupView.resetHeight(h);
    },

    resetWidth: function (w) {
        this.popupView.resetWidth(w);
    }
});

BI.MultiSelectPopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiSelectPopupView.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";


BI.shortcut("bi.multi_select_popup_view", BI.MultiSelectPopupView);/**
 *
 * 复选下拉框
 * @class BI.MultiSelectTrigger
 * @extends BI.Trigger
 */

BI.MultiSelectTrigger = BI.inherit(BI.Trigger, {

    constants: {
        height: 14,
        rgap: 4,
        lgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-trigger bi-border",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            searcher: {},
            switcher: {},

            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiSelectTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        if (o.height) {
            this.setHeight(o.height - 2);
        }

        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.multi_select_searcher",
            height: o.height,
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            popup: {},
            adapter: o.adapter,
            masker: o.masker,
            value: o.value
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_START, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_START);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_PAUSE, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_PAUSE);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_SEARCHING, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_SEARCHING, arguments);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_STOP);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_CHANGE, arguments);
        });
        this.numberCounter = BI.createWidget(o.switcher, {
            type: "bi.multi_select_check_selected_switcher",
            valueFormatter: o.valueFormatter,
            itemsCreator: o.itemsCreator,
            adapter: o.adapter,
            masker: o.masker,
            value: o.value
        });
        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK);
        });
        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW);
        });

        var wrapNumberCounter = BI.createWidget({
            type: "bi.right_vertical_adapt",
            hgap: 4,
            items: [{
                el: this.numberCounter
            }]
        });

        var wrapper = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [
                {
                    el: this.searcher,
                    width: "fill"
                }, {
                    el: wrapNumberCounter,
                    width: 0
                }, {
                    el: BI.createWidget(),
                    width: 30
                }]
        });

        this.numberCounter.on(BI.Events.VIEW, function (b) {
            BI.nextTick(function () {// 自动调整宽度
                wrapper.attr("items")[1].width = (b === true ? self.numberCounter.element.outerWidth() + 8 : 0);
                wrapper.resize();
            });
        });

        this.element.click(function (e) {
            if (self.element.__isMouseInBounds__(e) && !self.numberCounter.element.__isMouseInBounds__(e)) {
                self.numberCounter.hideView();
            }
        });
    },

    getCounter: function () {
        return this.numberCounter;
    },

    getSearcher: function () {
        return this.searcher;
    },

    stopEditing: function () {
        this.searcher.stopSearch();
        this.numberCounter.hideView();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
        this.numberCounter.setAdapter(adapter);
    },

    setValue: function (ob) {
        this.searcher.setValue(ob);
        this.numberCounter.setValue(ob);
    },

    getKey: function () {
        return this.searcher.getKey();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});

BI.MultiSelectTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.MultiSelectTrigger.EVENT_COUNTER_CLICK = "EVENT_COUNTER_CLICK";
BI.MultiSelectTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectTrigger.EVENT_START = "EVENT_START";
BI.MultiSelectTrigger.EVENT_STOP = "EVENT_STOP";
BI.MultiSelectTrigger.EVENT_PAUSE = "EVENT_PAUSE";
BI.MultiSelectTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW = "EVENT_BEFORE_COUNTER_POPUPVIEW";

BI.shortcut("bi.multi_select_trigger", BI.MultiSelectTrigger);/**
 * 多选加载数据搜索loader面板
 * Created by guy on 15/11/4.
 * @class BI.MultiSelectSearchLoader
 * @extends Widget
 */
BI.MultiSelectSearchLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearchLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-search-loader",
            itemsCreator: BI.emptyFn,
            keywordGetter: BI.emptyFn,
            valueFormatter: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectSearchLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;
        this.storeValue = BI.deepClone(opts.value);
        this.button_group = BI.createWidget({
            type: "bi.select_list",
            element: this,
            logic: {
                dynamic: false
            },
            value: opts.value,
            el: {
                tipText: BI.i18nText("BI-No_Select"),
                el: {
                    type: "bi.loader",
                    isDefaultInit: false,
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            },
            itemsCreator: function (op, callback) {
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: self.storeValue.value
                }));
                opts.itemsCreator(op, function (ob) {
                    var keyword = ob.keyword = opts.keywordGetter();
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = self._filterValues(self.storeValue);
                        firstItems = self._createItems(json);
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), keyword);
                    if (op.times === 1 && self.storeValue) {
                        self.setValue(self.storeValue);
                    }
                });
            },
            hasNext: function () {
                return hasNext;
            }
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectSearchLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            logic: {
                dynamic: false
            },
            height: 25,
            selected: this.isAllSelected()
        });
    },

    isAllSelected: function () {
        return this.button_group.isAllSelected();
    },

    _filterValues: function (src) {
        var o = this.options;
        var keyword = o.keywordGetter();
        var values = BI.deepClone(src.value) || [];
        var newValues = BI.map(values, function (i, v) {
            return {
                text: o.valueFormatter(v) || v,
                value: v
            };
        });
        if (BI.isKey(keyword)) {
            var search = BI.Func.getSearchResult(newValues, keyword);
            values = search.match.concat(search.find);
        }
        return BI.map(values, function (i, v) {
            return {
                text: v.text,
                title: v.text,
                value: v.value,
                selected: src.type === BI.Selection.All
            };
        });
    },

    setValue: function (v) {
        // 暂存的值一定是新的值，不然v改掉后，storeValue也跟着改了
        this.storeValue = BI.deepClone(v);
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.MultiSelectSearchLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_search_loader", BI.MultiSelectSearchLoader);/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiSelectSearchPane
 * @extends Widget
 */

BI.MultiSelectSearchPane = BI.inherit(BI.Widget, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-search-pane bi-card",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectSearchPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.tooltipClick = BI.createWidget({
            type: "bi.label",
            invisible: true,
            text: BI.i18nText("BI-Click_Blank_To_Select"),
            cls: "multi-select-toolbar",
            height: this.constants.height
        });

        this.loader = BI.createWidget({
            type: "bi.multi_select_search_loader",
            keywordGetter: o.keywordGetter,
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator.apply(self, [op, function (res) {
                    callback(res);
                    self.setKeyword(o.keywordGetter());
                }]);
            },
            value: o.value
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.resizer = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.tooltipClick,
                height: 0
            }, {
                el: this.loader
            }]
        });
        this.tooltipClick.setVisible(false);
    },

    setKeyword: function (keyword) {
        var btn;
        var isVisible = this.loader.getAllButtons().length > 0 && (btn = this.loader.getAllButtons()[0]) && (keyword === btn.getValue());
        if (isVisible !== this.tooltipClick.isVisible()) {
            this.tooltipClick.setVisible(isVisible);
            this.resizer.attr("items")[0].height = (isVisible ? this.constants.height : 0);
            this.resizer.resize();
        }
    },

    isAllSelected: function () {
        return this.loader.isAllSelected();
    },

    hasMatched: function () {
        return this.tooltipClick.isVisible();
    },

    setValue: function (v) {
        this.loader.setValue(v);
    },

    getValue: function () {
        return this.loader.getValue();
    },

    empty: function () {
        this.loader.empty();
    },

    populate: function (items) {
        this.loader.populate.apply(this.loader, arguments);
    }
});

BI.MultiSelectSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.multi_select_search_pane", BI.MultiSelectSearchPane);/**
 * 查看已选按钮
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectCheckSelectedButton
 * @extends BI.Single
 */
BI.MultiSelectCheckSelectedButton = BI.inherit(BI.Single, {

    _const: {
        checkSelected: BI.i18nText("BI-Check_Selected")
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckSelectedButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-check-selected-button bi-high-light",
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectCheckSelectedButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.numberCounter = BI.createWidget({
            type: "bi.text_button",
            element: this,
            hgap: 4,
            text: "0",
            textAlign: "center",
            textHeight: 15
        });
        this.numberCounter.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.numberCounter.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedButton.EVENT_CHANGE, arguments);
        });

        this.numberCounter.element.hover(function () {
            self.numberCounter.setTag(self.numberCounter.getText());
            self.numberCounter.setText(self._const.checkSelected);
        }, function () {
            self.numberCounter.setText(self.numberCounter.getTag());
        });
        this.setVisible(false);
        if(BI.isNotNull(o.value)){
            this.setValue(o.value);
        }
    },

    setValue: function (ob) {
        var self = this, o = this.options;
        ob || (ob = {});
        ob.type || (ob.type = BI.Selection.Multi);
        ob.value || (ob.value = []);
        if (ob.type === BI.Selection.All) {
            o.itemsCreator({
                type: BI.MultiSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                var length = res.count - ob.value.length;
                BI.nextTick(function () {
                    self.numberCounter.setText(length);
                    self.setVisible(length > 0);
                });
            });
            return;
        }
        BI.nextTick(function () {
            self.numberCounter.setText(ob.value.length);
            self.setVisible(ob.value.length > 0);
        });
    },

    getValue: function () {

    }
});

BI.MultiSelectCheckSelectedButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_check_selected_button", BI.MultiSelectCheckSelectedButton);/**
 * 多选输入框
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectEditor
 * @extends Widget
 */
BI.MultiSelectEditor = BI.inherit(BI.Widget, {

    _const: {
        checkSelected: BI.i18nText("BI-Check_Selected")
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-editor",
            el: {}
        });
    },

    _init: function () {
        BI.MultiSelectEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.state_editor",
            element: this,
            height: o.height,
            watermark: BI.i18nText("BI-Basic_Search"),
            allowBlank: true,
            value: o.value
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.StateEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.MultiSelectEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.StateEditor.EVENT_CLICK_LABEL, function () {

        });
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setState: function (state) {
        this.editor.setState(state);
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        var v = this.editor.getState();
        if (BI.isArray(v) && v.length > 0) {
            return v[v.length - 1];
        }
        return "";
        
    },

    getKeywords: function () {
        var val = this.editor.getLastValidValue();
        var keywords = val.match(/[\S]+/g);
        if (BI.isEndWithBlank(val)) {
            return keywords.concat([" "]);
        }
        return keywords;
    },

    populate: function (items) {

    }
});
BI.MultiSelectEditor.EVENT_PAUSE = "MultiSelectEditor.EVENT_PAUSE";
BI.shortcut("bi.multi_select_editor", BI.MultiSelectEditor);/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectSearcher
 * @extends Widget
 */
BI.MultiSelectSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-searcher",
            itemsCreator: BI.emptyFn,
            el: {},
            popup: {},
            valueFormatter: BI.emptyFn,
            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiSelectSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.multi_select_editor",
            height: o.height
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            element: this,
            height: o.height,
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            el: this.editor,

            popup: BI.extend({
                type: "bi.multi_select_search_pane",
                valueFormatter: o.valueFormatter,
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    var keyword = self.editor.getValue();
                    op.keywords = [keyword];
                    this.setKeyword(keyword);
                    o.itemsCreator(op, callback);
                },
                value: o.value
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.MultiSelectSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.Searcher.EVENT_SEARCHING, function () {
            var keywords = this.getKeywords();
            self.fireEvent(BI.MultiSelectSearcher.EVENT_SEARCHING, keywords);
        });
        if(BI.isNotNull(o.value)){
            this.setState(o.value);
        }
    },

    adjustView: function () {
        this.searcher.adjustView();
    },

    isSearching: function () {
        return this.searcher.isSearching();
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    getKeyword: function () {
        return this.editor.getValue();
    },

    hasMatched: function () {
        return this.searcher.hasMatched();
    },

    hasChecked: function () {
        return this.searcher.getView() && this.searcher.getView().hasChecked();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    setState: function (ob) {
        var o = this.options;
        ob || (ob = {});
        ob.value || (ob.value = []);
        if (ob.type === BI.Selection.All) {
            if (ob.value.length === 0) {
                this.editor.setState(BI.Selection.All);
            } else if (BI.size(ob.assist) <= 20) {
                var state = "";
                BI.each(ob.assist, function (i, v) {
                    if (i === 0) {
                        state += "" + (o.valueFormatter(v + "") || v);
                    } else {
                        state += "," + (o.valueFormatter(v + "") || v);
                    }
                });
                this.editor.setState(state);
            } else {
                this.editor.setState(BI.Selection.Multi);
            }
        } else {
            if (ob.value.length === 0) {
                this.editor.setState(BI.Selection.None);
            } else if (BI.size(ob.value) <= 20) {
                var state = "";
                BI.each(ob.value, function (i, v) {
                    if (i === 0) {
                        state += "" + (o.valueFormatter(v + "") || v);
                    } else {
                        state += "," + (o.valueFormatter(v + "") || v);
                    }
                });
                this.editor.setState(state);
            } else {
                this.editor.setState(BI.Selection.Multi);
            }
        }
    },

    setValue: function (ob) {
        this.setState(ob);
        this.searcher.setValue(ob);
    },

    getKey: function () {
        return this.editor.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function (items) {
        this.searcher.populate.apply(this.searcher, arguments);
    }
});

BI.MultiSelectSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiSelectSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectSearcher.EVENT_START = "EVENT_START";
BI.MultiSelectSearcher.EVENT_STOP = "EVENT_STOP";
BI.MultiSelectSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.MultiSelectSearcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.shortcut("bi.multi_select_searcher", BI.MultiSelectSearcher);/**
 * 查看已选switcher
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectCheckSelectedSwitcher
 * @extends Widget
 */
BI.MultiSelectCheckSelectedSwitcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckSelectedSwitcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-check-selected-switcher",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            el: {},
            popup: {},
            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiSelectCheckSelectedSwitcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.button = BI.createWidget(o.el, {
            type: "bi.multi_select_check_selected_button",
            itemsCreator: o.itemsCreator,
            value: o.value
        });
        this.button.on(BI.Events.VIEW, function () {
            self.fireEvent(BI.Events.VIEW, arguments);
        });
        this.switcher = BI.createWidget({
            type: "bi.switcher",
            toggle: false,
            element: this,
            el: this.button,
            popup: BI.extend({
                type: "bi.multi_select_check_pane",
                valueFormatter: o.valueFormatter,
                itemsCreator: o.itemsCreator,
                onClickContinueSelect: function () {
                    self.switcher.hideView();
                },
                value: o.value
            }, o.popup),
            adapter: o.adapter,
            masker: o.masker
        });
        this.switcher.on(BI.Switcher.EVENT_TRIGGER_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE);
        });
        this.switcher.on(BI.Switcher.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW);
        });
        this.switcher.on(BI.Switcher.EVENT_AFTER_POPUPVIEW, function () {
            var me = this;
            BI.nextTick(function () {
                me.populate();
            });
        });

        this.switcher.element.click(function (e) {
            e.stopPropagation();
        });
    },

    adjustView: function () {
        this.switcher.adjustView();
    },

    hideView: function () {
        this.switcher.empty();
        this.switcher.hideView();
    },

    setAdapter: function (adapter) {
        this.switcher.setAdapter(adapter);
    },

    setValue: function (v) {
        this.switcher.setValue(v);
    },

    setButtonChecked: function (v) {
        this.button.setValue(v);
    },

    getValue: function () {

    },

    populate: function (items) {
        this.switcher.populate.apply(this.switcher, arguments);
    }
});

BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE = "MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE";
BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW = "MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.multi_select_check_selected_switcher", BI.MultiSelectCheckSelectedSwitcher);/**
 * Created by zcf_1 on 2017/5/2.
 */
BI.MultiSelectInsertList = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectInsertList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-insert-list",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn
        });
    },
    _init: function () {
        BI.MultiSelectInsertList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        this.storeValue = {};

        var assertShowValue = function () {
            BI.isKey(self._startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](self._startValue);
            // self.trigger.setValue(self.storeValue);
        };

        this.adapter = BI.createWidget({
            type: "bi.multi_select_loader",
            cls: "popup-multi-select-list bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            logic: {
                dynamic: false
            },
            // onLoaded: o.onLoaded,
            el: {}
        });
        this.adapter.on(BI.MultiSelectLoader.EVENT_CHANGE, function () {
            self.storeValue = this.getValue();
            assertShowValue();
            self.fireEvent(BI.MultiSelectInsertList.EVENT_CHANGE);
        });

        this.searcherPane = BI.createWidget({
            type: "bi.multi_select_search_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            valueFormatter: o.valueFormatter,
            keywordGetter: function () {
                return self.trigger.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keyword = self.trigger.getKeyword();
                this.setKeyword(op.keyword);
                o.itemsCreator(op, callback);
            }
        });
        this.searcherPane.setVisible(false);

        this.trigger = BI.createWidget({
            type: "bi.searcher",
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            height: 200,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    self._setStartValue("");
                    this.setValue(BI.deepClone(self.storeValue));
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    self._setStartValue("");
                    self.adapter.setValue(self.storeValue);
                    // 需要刷新回到初始界面，否则搜索的结果不能放在最前面
                    self.adapter.populate();
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    var keyword = this.getKeyword();
                    if (this.hasMatched()) {
                        self._join({
                            type: BI.Selection.Multi,
                            value: [keyword]
                        }, function () {
                            if (self.storeValue.type === BI.Selection.Multi) {
                                self.storeValue.value.pushDistinct(keyword);
                            }
                            self._showAdapter();
                            self.adapter.setValue(self.storeValue);
                            self._setStartValue(keyword);
                            assertShowValue();
                            self.adapter.populate();
                            self._setStartValue("");
                            self.fireEvent(BI.MultiSelectInsertList.EVENT_CHANGE);
                        });
                    } else {
                        if (self.storeValue.type === BI.Selection.Multi) {
                            self.storeValue.value.pushDistinct(keyword);
                        }
                        self._showAdapter();
                        self.adapter.setValue(self.storeValue);
                        self.adapter.populate();
                        if (self.storeValue.type === BI.Selection.Multi) {
                            self.fireEvent(BI.MultiSelectInsertList.EVENT_CHANGE);
                        }
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_SEARCHING,
                action: function () {
                    var keywords = this.getKeywords();
                    var last = BI.last(keywords);
                    keywords = BI.initial(keywords || []);
                    if (keywords.length > 0) {
                        self._joinKeywords(keywords, function () {
                            if (BI.isEndWithBlank(last)) {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                                self.adapter.populate();
                                self._setStartValue("");
                            } else {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                            }
                        });
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function (value, obj) {
                    if (obj instanceof BI.MultiSelectBar) {
                        self._joinAll(this.getValue(), function () {
                            assertShowValue();
                            self.fireEvent(BI.MultiSelectInsertList.EVENT_CHANGE);
                        });
                    } else {
                        self._join(this.getValue(), function () {
                            assertShowValue();
                            self.fireEvent(BI.MultiSelectInsertList.EVENT_CHANGE);
                        });
                    }
                }
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.trigger,
                height: 24
            }, {
                el: this.adapter,
                height: "fill"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.searcherPane,
                top: 30,
                bottom: 0,
                left: 0,
                right: 0
            }]
        });
    },

    _showAdapter: function () {
        this.adapter.setVisible(true);
        this.searcherPane.setVisible(false);
    },

    _showSearcherPane: function () {
        this.searcherPane.setVisible(true);
        this.adapter.setVisible(false);
    },

    _defaultState: function () {
        this.trigger.stopEditing();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        if (!this._allData) {
            o.itemsCreator({
                type: BI.MultiSelectInsertList.REQ_GET_ALL_DATA
            }, function (ob) {
                self._allData = BI.map(ob.items, "value");
                digest(self._allData);
            });
        } else {
            digest(this._allData);
        }

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value[self.storeValue.type === BI.Selection.Multi ? "pushDistinct" : "remove"](val);
                }
            });
            callback();
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        o.itemsCreator({
            type: BI.MultiSelectInsertList.REQ_GET_ALL_DATA,
            keyword: self.trigger.getKeyword()
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                callback();
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            callback();
        });
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            callback();
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.adapter.setStartValue(value);
    },

    isAllSelected: function () {
        return this.adapter.isAllSelected();
    },

    resize: function () {
        // this.trigger.getCounter().adjustView();
        // this.trigger.adjustView();
    },
    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.adapter.setValue(this.storeValue);
        this.trigger.setValue(this.storeValue);
    },

    getValue: function () {
        return BI.deepClone(this.storeValue);
    },

    populate: function () {
        this._count = null;
        this._allData = null;
        this.adapter.populate.apply(this.adapter, arguments);
        this.trigger.populate.apply(this.trigger, arguments);
    }
});

BI.extend(BI.MultiSelectInsertList, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.MultiSelectInsertList.EVENT_CHANGE = "BI.MultiSelectInsertList.EVENT_CHANGE";
BI.shortcut("bi.multi_select_insert_list", BI.MultiSelectInsertList);/**
 * Created by zcf_1 on 2017/5/2.
 */
BI.MultiSelectList = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-list",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn
        });
    },
    _init: function () {
        BI.MultiSelectList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        this.storeValue = {};

        var assertShowValue = function () {
            BI.isKey(self._startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](self._startValue);
            // self.trigger.setValue(self.storeValue);
        };

        this.adapter = BI.createWidget({
            type: "bi.multi_select_loader",
            cls: "popup-multi-select-list bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            logic: {
                dynamic: false
            },
            // onLoaded: o.onLoaded,
            el: {}
        });
        this.adapter.on(BI.MultiSelectLoader.EVENT_CHANGE, function () {
            self.storeValue = this.getValue();
            self._adjust(function () {
                assertShowValue();
                self.fireEvent(BI.MultiSelectList.EVENT_CHANGE);
            });
        });

        this.searcherPane = BI.createWidget({
            type: "bi.multi_select_search_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            valueFormatter: o.valueFormatter,
            keywordGetter: function () {
                return self.trigger.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keyword = self.trigger.getKeyword();
                this.setKeyword(op.keyword);
                o.itemsCreator(op, callback);
            }
        });
        this.searcherPane.setVisible(false);

        this.trigger = BI.createWidget({
            type: "bi.searcher",
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            height: 200,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    self._setStartValue("");
                    this.setValue(BI.deepClone(self.storeValue));
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    self._setStartValue("");
                    self.adapter.setValue(self.storeValue);
                    // 需要刷新回到初始界面，否则搜索的结果不能放在最前面
                    self.adapter.populate();
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    var keyword = this.getKeyword();
                    if (this.hasMatched()) {
                        self._join({
                            type: BI.Selection.Multi,
                            value: [keyword]
                        }, function () {
                            self._showAdapter();
                            self.adapter.setValue(self.storeValue);
                            self._setStartValue(keyword);
                            assertShowValue();
                            self.adapter.populate();
                            self._setStartValue("");
                            self.fireEvent(BI.MultiSelectList.EVENT_CHANGE);
                        });
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_SEARCHING,
                action: function () {
                    var keywords = this.getKeyword();
                    var last = BI.last(keywords);
                    keywords = BI.initial(keywords || []);
                    if (keywords.length > 0) {
                        self._joinKeywords(keywords, function () {
                            if (BI.isEndWithBlank(last)) {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                                self.adapter.populate();
                                self._setStartValue("");
                            } else {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                            }
                        });
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function (value, obj) {
                    if (obj instanceof BI.MultiSelectBar) {
                        self._joinAll(this.getValue(), function () {
                            assertShowValue();
                            self.fireEvent(BI.MultiSelectList.EVENT_CHANGE);
                        });
                    } else {
                        self._join(this.getValue(), function () {
                            assertShowValue();
                            self.fireEvent(BI.MultiSelectList.EVENT_CHANGE);
                        });
                    }
                }
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.trigger,
                height: 24
            }, {
                el: this.adapter,
                height: "fill"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.searcherPane,
                top: 30,
                bottom: 0,
                left: 0,
                right: 0
            }]
        });
    },

    _showAdapter: function () {
        this.adapter.setVisible(true);
        this.searcherPane.setVisible(false);
    },

    _showSearcherPane: function () {
        this.searcherPane.setVisible(true);
        this.adapter.setVisible(false);
    },

    _defaultState: function () {
        this.trigger.stopEditing();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        if (!this._allData) {
            o.itemsCreator({
                type: BI.MultiSelectList.REQ_GET_ALL_DATA
            }, function (ob) {
                self._allData = BI.map(ob.items, "value");
                digest(self._allData);
            });
        } else {
            digest(this._allData);
        }

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value[self.storeValue.type === BI.Selection.Multi ? "pushDistinct" : "remove"](val);
                }
            });
            self._adjust(callback);
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        o.itemsCreator({
            type: BI.MultiSelectList.REQ_GET_ALL_DATA,
            keyword: self.trigger.getKeyword()
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                self._adjust(callback);
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            self._adjust(callback);
        });
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        if (!this._count) {
            o.itemsCreator({
                type: BI.MultiSelectList.REQ_GET_DATA_LENGTH
            }, function (res) {
                self._count = res.count;
                adjust();
                callback();
            });
        } else {
            adjust();
            callback();
        }

        function adjust () {
            if (self.storeValue.type === BI.Selection.All && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.Multi,
                    value: []
                };
            } else if (self.storeValue.type === BI.Selection.Multi && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.All,
                    value: []
                };
            }
        }
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            self._adjust(callback);
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.adapter.setStartValue(value);
    },

    isAllSelected: function () {
        return this.adapter.isAllSelected();
    },

    resize: function () {
        // this.trigger.getCounter().adjustView();
        // this.trigger.adjustView();
    },
    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.adapter.setValue(this.storeValue);
        this.trigger.setValue(this.storeValue);
    },

    getValue: function () {
        return BI.deepClone(this.storeValue);
    },

    populate: function () {
        this._count = null;
        this._allData = null;
        this.adapter.populate.apply(this.adapter, arguments);
        this.trigger.populate.apply(this.trigger, arguments);
    }
});

BI.extend(BI.MultiSelectList, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.MultiSelectList.EVENT_CHANGE = "BI.MultiSelectList.EVENT_CHANGE";
BI.shortcut("bi.multi_select_list", BI.MultiSelectList);/**
 * Created by zcf_1 on 2017/5/11.
 */
BI.MultiSelectTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-tree",
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = {value: {}};

        this.adapter = BI.createWidget({
            type: "bi.multi_select_tree_popup",
            itemsCreator: o.itemsCreator
        });
        this.adapter.on(BI.MultiSelectTreePopup.EVENT_CHANGE, function () {
            if (self.searcher.isSearching()) {
                self.storeValue = {value: self.searcherPane.getValue()};
            } else {
                self.storeValue = {value: self.adapter.getValue()};
            }
            self.setSelectedValue(self.storeValue.value);
            self.fireEvent(BI.MultiSelectTree.EVENT_CHANGE);
        });

        // 搜索中的时候用的是parttree，同adapter中的synctree不一样
        this.searcherPane = BI.createWidget({
            type: "bi.multi_tree_search_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            keywordGetter: function () {
                return self.searcher.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keyword = self.searcher.getKeyword();
                o.itemsCreator(op, callback);
            }
        });
        this.searcherPane.setVisible(false);

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback({
                    keyword: self.searcher.getKeyword()
                });
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    // self.storeValue = {value: self.adapter.getValue()};
                    // self.searcherPane.setSelectedValue(self.storeValue.value);
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    // self.storeValue = {value: self.searcherPane.getValue()};
                    // self.adapter.setSelectedValue(self.storeValue.value);
                    BI.nextTick(function () {
                        self.adapter.populate();
                    });
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function () {
                    if (self.searcher.isSearching()) {
                        self.storeValue = {value: self.searcherPane.getValue()};
                    } else {
                        self.storeValue = {value: self.adapter.getValue()};
                    }
                    self.setSelectedValue(self.storeValue.value);
                    self.fireEvent(BI.MultiSelectTree.EVENT_CHANGE);
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    self._showAdapter();
                }
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.searcher,
                height: 24
            }, {
                el: this.adapter,
                height: "fill"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.searcherPane,
                top: 30,
                bottom: 0,
                left: 0,
                right: 0
            }]
        });

    },

    _showAdapter: function () {
        this.adapter.setVisible(true);
        this.searcherPane.setVisible(false);
    },

    _showSearcherPane: function () {
        this.searcherPane.setVisible(true);
        this.adapter.setVisible(false);
    },

    resize: function () {

    },

    setSelectedValue: function (v) {
        this.storeValue.value = v || {};
        this.adapter.setSelectedValue(v);
        this.searcherPane.setSelectedValue(v);
        this.searcher.setValue({
            value: v || {}
        });
    },

    setValue: function (v) {
        this.adapter.setValue(v);
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    updateValue: function (v) {
        this.adapter.updateValue(v);
    },

    getValue: function () {
        return this.storeValue.value;
    },

    populate: function () {
        this.searcher.populate.apply(this.searcher, arguments);
        this.adapter.populate.apply(this.adapter, arguments);
    }
});
BI.MultiSelectTree.EVENT_CHANGE = "BI.MultiSelectTree.EVENT_CHANGE";
BI.shortcut("bi.multi_select_tree", BI.MultiSelectTree);/**
 * Created by zcf on 2016/12/21.
 */
BI.MultiSelectTreePopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-tree-popup bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: BI.emptyFn
        });
    },
    _init: function () {
        BI.MultiSelectTreePopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popup = BI.createWidget({
            type: "bi.async_tree",
            element: this,
            itemsCreator: o.itemsCreator
        });
        this.popup.on(BI.TreeView.EVENT_AFTERINIT, function () {
            self.fireEvent(BI.MultiSelectTreePopup.EVENT_AFTER_INIT);
        });
        this.popup.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectTreePopup.EVENT_CHANGE);
        });
    },

    hasChecked: function () {
        return this.popup.hasChecked();
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        v || (v = {});
        this.popup.setValue(v);
    },

    setSelectedValue: function (v) {
        v || (v = {});
        this.popup.setSelectedValue(v);
    },

    updateValue: function (v) {
        this.popup.updateValue(v);
        this.popup.refresh();
    },

    populate: function (config) {
        this.popup.stroke(config);
    }

});
BI.MultiSelectTreePopup.EVENT_AFTER_INIT = "BI.MultiSelectTreePopup.EVENT_AFTER_INIT";
BI.MultiSelectTreePopup.EVENT_CHANGE = "BI.MultiSelectTreePopup.EVENT_CHANGE";
BI.shortcut("bi.multi_select_tree_popup", BI.MultiSelectTreePopup);/**
 *
 * @class BI.MultiTreeCheckPane
 * @extends BI.Pane
 */
BI.MultiTreeCheckPane = BI.inherit(BI.Pane, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeCheckPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-check-pane bi-background",
            onClickContinueSelect: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreeCheckPane.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.selectedValues = {};

        var continueSelect = BI.createWidget({
            type: "bi.text_button",
            text: BI.i18nText("BI-Continue_Select"),
            cls: "multi-tree-check-selected"
        });
        continueSelect.on(BI.TextButton.EVENT_CHANGE, function () {
            opts.onClickContinueSelect();
            BI.nextTick(function () {
                self.empty();
            });
        });

        var backToPopup = BI.createWidget({
            type: "bi.left",
            cls: "multi-tree-continue-select",
            items: [
                {
                    el: {
                        type: "bi.label",
                        text: BI.i18nText("BI-Selected_Data")
                    },
                    lgap: this.constants.lgap,
                    tgap: this.constants.tgap
                },
                {
                    el: continueSelect,
                    lgap: this.constants.lgap,
                    tgap: this.constants.tgap
                }]
        });

        this.display = BI.createWidget({
            type: "bi.display_tree",
            cls: "bi-multi-tree-display",
            itemsCreator: function (op, callback) {
                op.type = BI.TreeView.REQ_TYPE_GET_SELECTED_DATA;
                opts.itemsCreator(op, callback);
            },
            value: (opts.value || {}).value
        });

        this.display.on(BI.Events.AFTERINIT, function () {
            self.fireEvent(BI.Events.AFTERINIT);
        });

        this.display.on(BI.TreeView.EVENT_INIT, function () {
            backToPopup.setVisible(false);
        });

        this.display.on(BI.TreeView.EVENT_AFTERINIT, function () {
            backToPopup.setVisible(true);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                height: this.constants.height,
                el: backToPopup
            }, {
                height: "fill",
                el: this.display
            }]
        });

    },

    empty: function () {
        this.display.empty();
    },

    populate: function (configs) {
        this.display.stroke(configs);
    },

    setValue: function (v) {
        v || (v = {});
        this.display.setSelectedValue(v.value);
    },

    getValue: function () {

    }
});

BI.MultiTreeCheckPane.EVENT_CONTINUE_CLICK = "EVENT_CONTINUE_CLICK";


BI.shortcut("bi.multi_tree_check_pane", BI.MultiTreeCheckPane);/**
 *
 * @class BI.MultiTreeCombo
 * @extends BI.Single
 */

BI.MultiTreeCombo = BI.inherit(BI.Single, {

    constants: {
        offset: {
            top: 1,
            left: 1,
            right: 2,
            bottom: 33
        }
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-combo",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 25
        });
    },

    _init: function () {
        BI.MultiTreeCombo.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        var isInit = false;
        var want2showCounter = false;

        this.storeValue = {value: o.value || {}};

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            valueFormatter: o.valueFormatter,
            // adapter: this.popup,
            masker: {
                offset: this.constants.offset
            },
            searcher: {
                type: "bi.multi_tree_searcher",
                itemsCreator: o.itemsCreator
            },
            switcher: {
                el: {
                    type: "bi.multi_tree_check_selected_button"
                },
                popup: {
                    type: "bi.multi_tree_check_pane",
                    itemsCreator: o.itemsCreator
                }
            },
            value: {value: o.value || {}}

        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: "bi.multi_tree_popup_view",
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.MultiTreePopup.EVENT_AFTERINIT,
                    action: function () {
                        self.trigger.getCounter().adjustView();
                        isInit = true;
                        if (want2showCounter === true) {
                            showCounter();
                        }
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CHANGE,
                    action: function () {
                        change = true;
                        var val = {
                            type: BI.Selection.Multi,
                            value: this.hasChecked() ? this.getValue() : {}
                        };
                        self.trigger.getSearcher().setState(val);
                        self.trigger.getCounter().setButtonChecked(val);
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self.combo.hideView();
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CLICK_CLEAR,
                    action: function () {
                        clear = true;
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: o.itemsCreator,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.trigger.getCounter().adjustView();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            },
            value: {value: o.value || {}},
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            }
        });
        
        var change = false;
        var clear = false;          // 标识当前是否点击了清空

        var isSearching = function () {
            return self.trigger.getSearcher().isSearching();
        };

        var isPopupView = function () {
            return self.combo.isViewVisible();
        };

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self.storeValue = {value: self.combo.getValue()};
            this.setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self.storeValue = {value: this.getValue()};
            self.combo.setValue(self.storeValue);
            BI.nextTick(function () {
                if (isPopupView()) {
                    self.combo.populate();
                }
            });
        });

        function showCounter () {
            if (isSearching()) {
                self.storeValue = {value: self.trigger.getValue()};
            } else if (isPopupView()) {
                self.storeValue = {value: self.combo.getValue()};
            }
            self.trigger.setValue(self.storeValue);
        }

        this.trigger.on(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW, function () {
            if (want2showCounter === false) {
                want2showCounter = true;
            }
            if (isInit === true) {
                want2showCounter = null;
                showCounter();
            }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function () {
            var checked = this.getSearcher().hasChecked();
            var val = {
                type: BI.Selection.Multi,
                value: checked ? {1: 1} : {}
            };
            this.getSearcher().setState(checked ? BI.Selection.Multi : BI.Selection.None);
            this.getCounter().setButtonChecked(val);
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            if (isSearching()) {
                return;
            }
            if (change === true) {
                self.storeValue = {value: self.combo.getValue()};
                change = false;
            }
            self.combo.setValue(self.storeValue);
            self.populate();

        });
        this.combo.on(BI.Combo.EVENT_BEFORE_HIDEVIEW, function () {
            if (isSearching()) {
                self.trigger.stopEditing();
                self.fireEvent(BI.MultiTreeCombo.EVENT_CONFIRM);
            } else {
                if (isPopupView()) {
                    self.trigger.stopEditing();
                    self.storeValue = {value: self.combo.getValue()};
                    if (clear === true) {
                        self.storeValue = {value: {}};
                    }
                    self.fireEvent(BI.MultiTreeCombo.EVENT_CONFIRM);
                }
            }
            clear = false;
            change = false;
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "multi-select-trigger-icon-button"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            self.trigger.getCounter().hideView();
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    setValue: function (v) {
        this.storeValue.value = v || {};
        this.combo.setValue({
            value: v || {}
        });
    },

    getValue: function () {
        return this.storeValue.value;
    },

    populate: function () {
        this.combo.populate.apply(this.combo, arguments);
    }
});

BI.MultiTreeCombo.EVENT_CONFIRM = "MultiTreeCombo.EVENT_CONFIRM";

BI.shortcut("bi.multi_tree_combo", BI.MultiTreeCombo);/**
 * 带加载的多选下拉面板
 * @class BI.MultiTreePopup
 * @extends BI.Pane
 */
BI.MultiTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-popup",
            maxWidth: "auto",
            minWidth: 100,
            maxHeight: 400,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreePopup.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.selectedValues = {};

        this.tree = BI.createWidget({
            type: "bi.async_tree",
            height: 400,
            cls: "popup-view-tree",
            itemsCreator: opts.itemsCreator,
            onLoaded: opts.onLoaded,
            value: opts.value || {}
        });

        this.popupView = BI.createWidget({
            type: "bi.multi_popup_view",
            element: this,
            stopPropagation: false,
            maxWidth: opts.maxWidth,
            minWidth: opts.minWidth,
            maxHeight: opts.maxHeight,
            buttons: [BI.i18nText("BI-Basic_Clears"), BI.i18nText("BI-Basic_Sure")],
            el: this.tree
        });

        this.popupView.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.fireEvent(BI.MultiTreePopup.EVENT_CLICK_CLEAR);
                    break;
                case 1:
                    self.fireEvent(BI.MultiTreePopup.EVENT_CLICK_CONFIRM);
                    break;
            }
        });

        this.tree.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiTreePopup.EVENT_CHANGE);
        });

        this.tree.on(BI.TreeView.EVENT_AFTERINIT, function () {
            self.fireEvent(BI.MultiTreePopup.EVENT_AFTERINIT);
        });

    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v || (v = {});
        this.tree.setSelectedValue(v.value);
    },

    populate: function (config) {
        this.tree.stroke(config);
    },

    hasChecked: function () {
        return this.tree.hasChecked();
    },

    resetHeight: function (h) {
        this.popupView.resetHeight(h);
    },

    resetWidth: function (w) {
        this.popupView.resetWidth(w);
    }
});

BI.MultiTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiTreePopup.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiTreePopup.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";
BI.MultiTreePopup.EVENT_AFTERINIT = "EVENT_AFTERINIT";


BI.shortcut("bi.multi_tree_popup_view", BI.MultiTreePopup);/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiTreeSearchPane
 * @extends BI.Pane
 */

BI.MultiTreeSearchPane = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-search-pane bi-card",
            itemsCreator: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreeSearchPane.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.partTree = BI.createWidget({
            type: "bi.part_tree",
            element: this,
            tipText: BI.i18nText("BI-No_Select"),
            itemsCreator: function (op, callback) {
                op.keyword = opts.keywordGetter();
                opts.itemsCreator(op, callback);
            },
            value: opts.value
        });

        this.partTree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.partTree.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiTreeSearchPane.EVENT_CHANGE);
        });
    },

    hasChecked: function () {
        return this.partTree.hasChecked();
    },

    setValue: function (v) {
        this.setSelectedValue(v.value);
    },

    setSelectedValue: function (v) {
        v || (v = {});
        this.partTree.setSelectedValue(v);
    },

    getValue: function () {
        return this.partTree.getValue();
    },

    empty: function () {
        this.partTree.empty();
    },

    populate: function (op) {
        this.partTree.stroke.apply(this.partTree, arguments);
    }
});

BI.MultiTreeSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.MultiTreeSearchPane.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiTreeSearchPane.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";

BI.shortcut("bi.multi_tree_search_pane", BI.MultiTreeSearchPane);/**
 * 查看已选按钮
 * Created by guy on 15/11/3.
 * @class BI.MultiTreeCheckSelectedButton
 * @extends BI.Single
 */
BI.MultiTreeCheckSelectedButton = BI.inherit(BI.Single, {

    _const: {
        checkSelected: BI.i18nText("BI-Check_Selected")
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeCheckSelectedButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-check-selected-button",
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreeCheckSelectedButton.superclass._init.apply(this, arguments);
        var self = this;
        this.indicator = BI.createWidget({
            type: "bi.icon_button",
            cls: "check-font trigger-check-selected",
            width: 15,
            height: 15,
            stopPropagation: true
        });

        this.checkSelected = BI.createWidget({
            type: "bi.text_button",
            cls: "trigger-check-selected",
            invisible: true,
            hgap: 4,
            text: this._const.checkSelected,
            textAlign: "center",
            textHeight: 15
        });
        this.checkSelected.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.checkSelected.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedButton.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.horizontal",
            element: this,
            items: [this.indicator, this.checkSelected]
        });

        this.element.hover(function () {
            self.indicator.setVisible(false);
            self.checkSelected.setVisible(true);
        }, function () {
            self.indicator.setVisible(true);
            self.checkSelected.setVisible(false);
        });
        this.setVisible(false);
    },

    setValue: function (v) {
        v || (v = {});
        this.setVisible(BI.size(v.value) > 0);
    }
});

BI.MultiTreeCheckSelectedButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_tree_check_selected_button", BI.MultiTreeCheckSelectedButton);/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.MultiTreeSearcher
 * @extends Widget
 */
BI.MultiTreeSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-searcher",
            itemsCreator: BI.emptyFn,
            valueFormatter: function (v) {
                return v;
            },
            popup: {},

            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiTreeSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.multi_select_editor",
            height: o.height,
            el: {
                type: "bi.simple_state_editor",
                height: o.height
            }
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            element: this,
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback({
                    keyword: self.editor.getValue()
                });
            },
            el: this.editor,

            popup: BI.extend({
                type: "bi.multi_tree_search_pane",
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    op.keyword = self.editor.getValue();
                    o.itemsCreator(op, callback);
                },
                value: o.value
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.MultiTreeSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_CHANGE, arguments);
        });
        if (BI.isNotNull(o.value)) {
            this.setState(o.value);
        }
    },

    adjustView: function () {
        this.searcher.adjustView();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    isSearching: function () {
        return this.searcher.isSearching();
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    getKeyword: function () {
        return this.editor.getValue();
    },

    hasMatched: function () {
        return this.searcher.hasMatched();
    },

    hasChecked: function () {
        return this.searcher.getView() && this.searcher.getView().hasChecked();
    },

    setState: function (ob) {
        var o = this.options;
        ob || (ob = {});
        ob.value || (ob.value = {});
        if (BI.isNumber(ob)) {
            this.editor.setState(ob);
        } else if (BI.size(ob.value) === 0) {
            this.editor.setState(BI.Selection.None);
        } else {
            var text = "";
            BI.each(ob.value, function (name, children) {
                var childNodes = getChildrenNode(children);
                text += (o.valueFormatter(name + "") || name) + (childNodes === "" ? "" : (":" + childNodes)) + "; ";
            });
            this.editor.setState(text);
        }

        function getChildrenNode (ob) {
            var text = "";
            var index = 0, size = BI.size(ob);
            BI.each(ob, function (name, children) {
                index++;
                var childNodes = getChildrenNode(children);
                text += (o.valueFormatter(name + "") || name) + (childNodes === "" ? "" : (":" + childNodes)) + (index === size ? "" : ",");
            });
            return text;
        }
    },

    setValue: function (ob) {
        this.setState(ob);
        this.searcher.setValue(ob);
    },

    getKey: function () {
        return this.editor.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function (items) {
        this.searcher.populate.apply(this.searcher, arguments);
    }
});

BI.MultiTreeSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiTreeSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiTreeSearcher.EVENT_START = "EVENT_START";
BI.MultiTreeSearcher.EVENT_STOP = "EVENT_STOP";
BI.MultiTreeSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.shortcut("bi.multi_tree_searcher", BI.MultiTreeSearcher);/**
 * Created by windy on 2017/3/13.
 * 数值微调器
 */
BI.NumberEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.NumberEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-number-editor bi-border",
            validationChecker: function () {
                return true;
            },
            valueFormatter: function (v) {
                return v;
            },
            value: 0,
            allowBlank: false,
            errorText: "",
            step: 1
        });
    },

    _init: function () {
        BI.NumberEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            allowBlank: o.allowBlank,
            value: o.valueFormatter(o.value),
            validationChecker: o.validationChecker,
            errorText: o.errorText
        });
        this.editor.on(BI.TextEditor.EVENT_CHANGE, function () {
            o.value = this.getValue();
            self.fireEvent(BI.NumberEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            this.setValue(BI.parseFloat(this.getValue()));
            self.fireEvent(BI.NumberEditor.EVENT_CONFIRM);
        });
        this.topBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            cls: "column-pre-page-h-font top-button bi-border-left bi-border-bottom"
        });
        this.topBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(o.step);
            self.fireEvent(BI.NumberEditor.EVENT_CHANGE);
            self.fireEvent(BI.NumberEditor.EVENT_CONFIRM);
        });
        this.bottomBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            cls: "column-next-page-h-font bottom-button bi-border-left bi-border-top"
        });
        this.bottomBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(-o.step);
            self.fireEvent(BI.NumberEditor.EVENT_CHANGE);
            self.fireEvent(BI.NumberEditor.EVENT_CONFIRM);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [this.editor, {
                el: {
                    type: "bi.grid",
                    columns: 1,
                    rows: 2,
                    items: [{
                        column: 0,
                        row: 0,
                        el: this.topBtn
                    }, {
                        column: 0,
                        row: 1,
                        el: this.bottomBtn
                    }]
                },
                width: 23
            }]
        });
    },

    focus: function () {
        this.editor.focus();
    },

    // 微调
    _finetuning: function (add) {
        var v = BI.parseFloat(this.getValue());
        this.setValue(v.add(add));
    },

    setUpEnable: function (v) {
        this.topBtn.setEnable(!!v);
    },

    setDownEnable: function (v) {
        this.bottomBtn.setEnable(!!v);
    },

    getValue: function () {
        return this.options.value;
    },

    setValue: function (v) {
        var o = this.options;
        o.value = v;
        this.editor.setValue(o.valueFormatter(v));
    }

});
BI.NumberEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.NumberEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.number_editor", BI.NumberEditor);// 小于号的值为：0，小于等于号的值为:1
// closeMIn：最小值的符号，closeMax：最大值的符号
/**
 * Created by roy on 15/9/17.
 *
 */
BI.NumberInterval = BI.inherit(BI.Single, {
    constants: {
        typeError: "typeBubble",
        numberError: "numberBubble",
        signalError: "signalBubble",
        editorWidth: 114,
        columns: 5,
        width: 30,
        rows: 1,
        numberErrorCls: "number-error",
        border: 1,
        less: 0,
        less_equal: 1,
        numTip: ""
    },
    _defaultConfig: function () {
        var conf = BI.NumberInterval.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-number-interval",
            height: 25,
            validation: "valid"
        });
    },
    _init: function () {
        var self = this, c = this.constants, o = this.options;
        BI.NumberInterval.superclass._init.apply(this, arguments);
        this.smallEditor = BI.createWidget({
            type: "bi.editor",
            height: o.height - 2,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            allowBlank: true,
            value: o.min,
            level: "warning",
            tipType: "warning",
            quitChecker: function () {
                return false;
            },
            validationChecker: function (v) {
                if (!BI.isNumeric(v)) {
                    self.smallEditorBubbleType = c.typeError;
                    return false;
                }
                return true;
            },
            cls: "number-interval-small-editor bi-border-top bi-border-bottom bi-border-left"
        });

        this.smallTip = BI.createWidget({
            type: "bi.label",
            text: o.numTip,
            height: o.height - 2,
            invisible: true
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.smallEditor.element,
            items: [{
                el: this.smallTip,
                top: 0,
                right: 5
            }]
        });

        this.bigEditor = BI.createWidget({
            type: "bi.editor",
            height: o.height - 2,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            allowBlank: true,
            value: o.max,
            level: "warning",
            tipType: "warning",
            quitChecker: function () {
                return false;
            },
            validationChecker: function (v) {
                if (!BI.isNumeric(v)) {
                    self.bigEditorBubbleType = c.typeError;
                    return false;
                }
                return true;
            },
            cls: "number-interval-big-editor bi-border-top bi-border-bottom bi-border-right"
        });

        this.bigTip = BI.createWidget({
            type: "bi.label",
            text: o.numTip,
            height: o.height - 2,
            invisible: true
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.bigEditor.element,
            items: [{
                el: this.bigTip,
                top: 0,
                right: 5
            }]
        });

        // this.smallCombo = BI.createWidget({
        //    type: "bi.number_interval_combo",
        //    cls: "number-interval-small-combo",
        //    height: o.height,
        //    value: o.closemin ? 1 : 0,
        //    offsetStyle: "left"
        // });
        //
        // this.bigCombo = BI.createWidget({
        //    type: "bi.number_interval_combo",
        //    cls: "number-interval-big-combo",
        //    height: o.height,
        //    value: o.closemax ? 1 : 0,
        //    offsetStyle: "left"
        // });
        this.smallCombo = BI.createWidget({
            type: "bi.icon_combo",
            cls: "number-interval-small-combo bi-border",
            height: o.height - 2,
            isShowDown: false,
            items: [{
                text: "(" + BI.i18nText("BI-Less_Than") + ")",
                iconCls: "less-font",
                value: 0
            }, {
                text: "(" + BI.i18nText("BI-Less_And_Equal") + ")",
                value: 1,
                iconCls: "less-equal-font"
            }]
        });
        if (o.closeMin === true) {
            this.smallCombo.setValue(1);
        } else {
            this.smallCombo.setValue(0);
        }
        this.bigCombo = BI.createWidget({
            type: "bi.icon_combo",
            cls: "number-interval-big-combo bi-border",
            isShowDown: false,
            height: o.height - 2,
            items: [{
                text: "(" + BI.i18nText("BI-Less_Than") + ")",
                iconCls: "less-font",
                value: 0
            }, {
                text: "(" + BI.i18nText("BI-Less_And_Equal") + ")",
                value: 1,
                iconCls: "less-equal-font"
            }]
        });
        if (o.closeMax === true) {
            this.bigCombo.setValue(1);
        } else {
            this.bigCombo.setValue(0);
        }
        this.label = BI.createWidget({
            type: "bi.label",
            text: BI.i18nText("BI-Basic_Value"),
            textHeight: o.height - c.border * 2,
            width: c.width - c.border * 2,
            height: o.height - c.border * 2,
            level: "warning",
            tipType: "warning"
        });
        this.left = BI.createWidget({
            type: "bi.htape",
            items: [{
                el: self.smallEditor
            }, {
                el: self.smallCombo,
                width: c.width - c.border * 2
            }]

        });
        this.right = BI.createWidget({
            type: "bi.htape",
            items: [{
                el: self.bigCombo,
                width: c.width - c.border * 2
            }, {
                el: self.bigEditor
            }]
        });


        BI.createWidget({
            element: self,
            type: "bi.center",
            hgap: 15,
            height: o.height,
            items: [
                {
                    type: "bi.absolute",
                    items: [{
                        el: self.left,
                        left: -15,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: self.right,
                        left: 0,
                        right: -15,
                        top: 0,
                        bottom: 0
                    }]
                }
            ]
        });

        BI.createWidget({
            element: self,
            type: "bi.horizontal_auto",
            items: [
                self.label
            ]
        });


        self._setValidEvent(self.bigEditor, c.bigEditor);
        self._setValidEvent(self.smallEditor, c.smallEditor);
        self._setErrorEvent(self.bigEditor, c.bigEditor);
        self._setErrorEvent(self.smallEditor, c.smallEditor);
        self._setBlurEvent(self.bigEditor);
        self._setBlurEvent(self.smallEditor);
        self._setFocusEvent(self.bigEditor);
        self._setFocusEvent(self.smallEditor);
        self._setComboValueChangedEvent(self.bigCombo);
        self._setComboValueChangedEvent(self.smallCombo);
        self._setEditorValueChangedEvent(self.bigEditor);
        self._setEditorValueChangedEvent(self.smallEditor);
    },

    _checkValidation: function () {
        var self = this, c = this.constants, o = this.options;
        self._setTitle("");
        BI.Bubbles.hide(c.typeError);
        BI.Bubbles.hide(c.numberError);
        BI.Bubbles.hide(c.signalError);
        if (!self.smallEditor.isValid() || !self.bigEditor.isValid()) {
            self.element.removeClass("number-error");
            o.validation = "invalid";
            return c.typeError;
        }
        if (BI.isEmptyString(self.smallEditor.getValue()) || BI.isEmptyString(self.bigEditor.getValue())) {
            self.element.removeClass("number-error");
            o.validation = "valid";
            return "";
        }
        var smallValue = parseFloat(self.smallEditor.getValue()), bigValue = parseFloat(self.bigEditor.getValue()),
            bigComboValue = self.bigCombo.getValue(), smallComboValue = self.smallCombo.getValue();
        if (bigComboValue[0] === c.less_equal && smallComboValue[0] === c.less_equal) {
            if (smallValue > bigValue) {
                self.element.addClass("number-error");
                o.validation = "invalid";
                return c.numberError;
            }
            self.element.removeClass("number-error");
            o.validation = "valid";
            return "";

        }
        if (smallValue > bigValue) {
            self.element.addClass("number-error");
            o.validation = "invalid";
            return c.numberError;
        } else if (smallValue === bigValue) {
            self.element.addClass("number-error");
            o.validation = "invalid";
            return c.signalError;
        }
        self.element.removeClass("number-error");
        o.validation = "valid";
        return "";





    },

    _setTitle: function (v) {
        var self = this;
        self.bigEditor.setTitle(v);
        self.smallEditor.setTitle(v);
        self.label.setTitle(v);
    },

    _setFocusEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.Editor.EVENT_FOCUS, function () {
            self._setTitle("");
            switch (self._checkValidation()) {
                case c.typeError:
                    BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                default :
                    return;
            }

        });
    },
    _setBlurEvent: function (w) {
        var c = this.constants, self = this;
        w.on(BI.Editor.EVENT_BLUR, function () {
            BI.Bubbles.hide(c.typeError);
            BI.Bubbles.hide(c.numberError);
            BI.Bubbles.hide(c.signalError);
            switch (self._checkValidation()) {
                case c.typeError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Input_Data"));
                    break;
                case c.numberError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Number_Value"));
                    break;
                case c.signalError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Signal_Value"));
                    break;
                default:
                    self._setTitle("");
            }
        });
    },

    _setErrorEvent: function (w) {
        var c = this.constants, self = this;
        w.on(BI.Editor.EVENT_ERROR, function () {
            self._checkValidation();
            BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                offsetStyle: "center"
            });
            self.fireEvent(BI.NumberInterval.EVENT_ERROR);
        });
    },


    _setValidEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.Editor.EVENT_VALID, function () {
            switch (self._checkValidation()) {
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    self.fireEvent(BI.NumberInterval.EVENT_ERROR);
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    self.fireEvent(BI.NumberInterval.EVENT_ERROR);
                    break;
                default:
                    self.fireEvent(BI.NumberInterval.EVENT_VALID);
            }
        });
    },


    _setEditorValueChangedEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.Editor.EVENT_CHANGE, function () {
            switch (self._checkValidation()) {
                case c.typeError:
                    BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                default :
                    break;
            }
            self.fireEvent(BI.NumberInterval.EVENT_CHANGE);
        });
        w.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.NumberInterval.EVENT_CONFIRM);
        });
    },

    _setComboValueChangedEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.IconCombo.EVENT_CHANGE, function () {
            switch (self._checkValidation()) {
                case c.typeError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Input_Data"));
                    self.fireEvent(BI.NumberInterval.EVENT_ERROR);
                    break;
                case c.numberError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Number_Value"));
                    self.fireEvent(BI.NumberInterval.EVENT_ERROR);
                    break;
                case c.signalError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Signal_Value"));
                    self.fireEvent(BI.NumberInterval.EVENT_ERROR);
                    break;
                default :
                    self.fireEvent(BI.NumberInterval.EVENT_CHANGE);
                    self.fireEvent(BI.NumberInterval.EVENT_CONFIRM);
                    self.fireEvent(BI.NumberInterval.EVENT_VALID);
            }
        });
    },

    isStateValid: function () {
        return this.options.validation === "valid";
    },

    setMinEnable: function (b) {
        this.smallEditor.setEnable(b);
    },

    setCloseMinEnable: function (b) {
        this.smallCombo.setEnable(b);
    },

    setMaxEnable: function (b) {
        this.bigEditor.setEnable(b);
    },

    setCloseMaxEnable: function (b) {
        this.bigCombo.setEnable(b);
    },

    showNumTip: function () {
        this.smallTip.setVisible(true);
        this.bigTip.setVisible(true);
    },

    hideNumTip: function () {
        this.smallTip.setVisible(false);
        this.bigTip.setVisible(false);
    },

    setNumTip: function (numTip) {
        this.smallTip.setText(numTip);
        this.bigTip.setText(numTip);
    },

    getNumTip: function () {
        return this.smallTip.getText();
    },

    setValue: function (data) {
        data = data || {};
        var self = this, combo_value;
        if (BI.isNumeric(data.min) || BI.isEmptyString(data.min)) {
            self.smallEditor.setValue(data.min);
        }

        if (!BI.isNotNull(data.min)) {
            self.smallEditor.setValue("");
        }

        if (BI.isNumeric(data.max) || BI.isEmptyString(data.max)) {
            self.bigEditor.setValue(data.max);
        }

        if (!BI.isNotNull(data.max)) {
            self.bigEditor.setValue("");
        }

        if (!BI.isNull(data.closeMin)) {
            if (data.closeMin === true) {
                combo_value = 1;
            } else {
                combo_value = 0;
            }
            self.smallCombo.setValue(combo_value);
        }

        if (!BI.isNull(data.closeMax)) {
            if (data.closeMax === true) {
                combo_value = 1;
            } else {
                combo_value = 0;
            }
            self.bigCombo.setValue(combo_value);
        }
    },


    getValue: function () {
        var self = this, value = {}, minComboValue = self.smallCombo.getValue(), maxComboValue = self.bigCombo.getValue();
        value.min = self.smallEditor.getValue();
        value.max = self.bigEditor.getValue();
        if (minComboValue[0] === 0) {
            value.closeMin = false;
        } else {
            value.closeMin = true;
        }

        if (maxComboValue[0] === 0) {
            value.closeMax = false;
        } else {
            value.closeMax = true;
        }
        return value;
    }
});
BI.NumberInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.NumberInterval.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.NumberInterval.EVENT_VALID = "EVENT_VALID";
BI.NumberInterval.EVENT_ERROR = "EVENT_ERROR";
BI.shortcut("bi.number_interval", BI.NumberInterval);/**
 *
 * 表格
 *
 * Created by GUY on 2015/9/22.
 * @class BI.PageTableCell
 * @extends BI.Single
 */
BI.PageTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.PageTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-page-table-cell",
            text: "",
            title: ""
        });
    },

    _init: function () {
        BI.PageTableCell.superclass._init.apply(this, arguments);
        var label = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            whiteSpace: "nowrap",
            height: this.options.height,
            text: this.options.text,
            title: this.options.title,
            value: this.options.value,
            lgap: 5,
            rgap: 5
        });

        if (BI.isNotNull(this.options.styles) && BI.isObject(this.options.styles)) {
            this.element.css(this.options.styles);
        }
    }
});

BI.shortcut("bi.page_table_cell", BI.PageTableCell);/**
 * 分页表格
 *
 * Created by GUY on 2016/2/15.
 * @class BI.PageTable
 * @extends BI.Widget
 */
BI.PageTable = BI.inherit(BI.Widget, {

    _const: {
        scrollWidth: 18,
        minScrollWidth: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.PageTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-page-table",
            el: {
                type: "bi.sequence_table"
            },
            pager: {
                horizontal: {
                    pages: false, // 总页数
                    curr: 1, // 初始化当前页， pages为数字时可用

                    hasPrev: BI.emptyFn,
                    hasNext: BI.emptyFn,
                    firstPage: 1,
                    lastPage: BI.emptyFn
                },
                vertical: {
                    pages: false, // 总页数
                    curr: 1, // 初始化当前页， pages为数字时可用

                    hasPrev: BI.emptyFn,
                    hasNext: BI.emptyFn,
                    firstPage: 1,
                    lastPage: BI.emptyFn
                }
            },

            itemsCreator: BI.emptyFn,

            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false, // 是否需要合并单元格
            mergeCols: [], // 合并的单元格列号
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [], // 二维数组

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.PageTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.hCurr = 1;
        this.vCurr = 1;

        this.table = BI.createWidget(o.el, {
            type: "bi.sequence_table",
            width: o.width,
            height: o.height && o.height - 30,

            isNeedResize: true,
            isResizeAdapt: false,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter,

            header: o.header,
            items: o.items,
            // 交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });

        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });

        this.pager = BI.createWidget(o.pager, {
            type: "bi.direction_pager",
            height: 30
        });
        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            var vpage = this.getVPage && this.getVPage();
            if (BI.isNull(vpage)) {
                vpage = this.getCurrentPage();
            }
            var hpage = this.getHPage && this.getHPage();
            o.itemsCreator({
                vpage: vpage,
                hpage: hpage
            }, function (items, header, crossItems, crossHeader) {
                self.table.setVPage ? self.table.setVPage(vpage) : self.table.setValue(vpage);
                self.table.setHPage && self.table.setHPage(hpage);
                self.populate.apply(self, arguments);
            });
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.table,
                left: 0,
                top: 0
            }, {
                el: this.pager,
                left: 0,
                right: 0,
                bottom: 0
            }]
        });
    },

    setHPage: function (v) {
        this.hCurr = v;
        this.pager.setHPage && this.pager.setHPage(v);
        this.table.setHPage && this.table.setHPage(v);
    },

    setVPage: function (v) {
        this.vCurr = v;
        this.pager.setVPage && this.pager.setVPage(v);
        this.table.setVPage && this.table.setVPage(v);
    },

    getHPage: function () {
        var hpage = this.pager.getHPage && this.pager.getHPage();
        if (BI.isNotNull(hpage)) {
            return hpage;
        }
        hpage = this.pager.getCurrentPage && this.pager.getCurrentPage();
        if (BI.isNotNull(hpage)) {
            return hpage;
        }
        return this.hpage;
    },

    getVPage: function () {
        var vpage = this.pager.getVPage && this.pager.getVPage();
        if (BI.isNotNull(vpage)) {
            return vpage;
        }
        vpage = this.pager.getCurrentPage && this.pager.getCurrentPage();
        if (BI.isNotNull(vpage)) {
            return vpage;
        }
        return this.vpage;
    },

    setWidth: function (width) {
        BI.PageTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.PageTable.superclass.setHeight.apply(this, arguments);
        var showPager = false;
        if (this.pager.alwaysShowPager) {
            showPager = true;
        } else if (this.pager.hasHNext && this.pager.hasHNext()) {
            showPager = true;
        } else if (this.pager.hasHPrev && this.pager.hasHPrev()) {
            showPager = true;
        } else if (this.pager.hasVNext && this.pager.hasVNext()) {
            showPager = true;
        } else if (this.pager.hasVPrev && this.pager.hasVPrev()) {
            showPager = true;
        } else if (this.pager.hasNext && this.pager.hasNext()) {
            showPager = true;
        } else if (this.pager.hasPrev && this.pager.hasPrev()) {
            showPager = true;
        }
        this.table.setHeight(height - (showPager ? 30 : 0));
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    restore: function () {
        this.table.restore();
    },

    attr: function () {
        BI.PageTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    populate: function () {
        this.pager.populate();
        this.table.populate.apply(this.table, arguments);
    },

    destroy: function () {
        this.table.destroy();
        this.pager && this.pager.destroy();
        BI.PageTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut("bi.page_table", BI.PageTable);/**
 * 预览表列
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTableCell
 * @extends BI.Widget
 */
BI.PreviewTableCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table-cell",
            text: ""
        });
    },

    _init: function () {
        BI.PreviewTableCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            whiteSpace: "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        });
    }
});
BI.shortcut("bi.preview_table_cell", BI.PreviewTableCell);/**
 * 预览表
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTableHeaderCell
 * @extends BI.Widget
 */
BI.PreviewTableHeaderCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table-header-cell",
            text: ""
        });
    },

    _init: function () {
        BI.PreviewTableHeaderCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            whiteSpace: "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        });
    }
});
BI.shortcut("bi.preview_table_header_cell", BI.PreviewTableHeaderCell);/**
 * 预览表
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTable
 * @extends BI.Widget
 */
BI.PreviewTable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table",
            isNeedFreeze: false,
            freezeCols: [],
            rowSize: null,
            columnSize: [],
            headerRowSize: 30,
            header: [],
            items: []
        });
    },

    _init: function () {
        BI.PreviewTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this,
            isNeedResize: false,

            isResizeAdapt: false,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            rowSize: o.rowSize,
            columnSize: o.columnSize,
            headerRowSize: o.headerRowSize,

            header: BI.map(o.header, function (i, items) {
                return BI.map(items, function (j, item) {
                    return BI.extend({
                        type: "bi.preview_table_header_cell"
                    }, item);
                });
            }),
            items: BI.map(o.items, function (i, items) {
                return BI.map(items, function (j, item) {
                    return BI.extend({
                        type: "bi.preview_table_cell"
                    }, item);
                });
            })
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self._adjustColumns();
        });
        this._adjustColumns();
    },

    // 是否有自适应调节的列，即列宽为""
    _hasAdaptCol: function (columnSize) {
        return BI.any(columnSize, function (i, size) {
            return size === "";
        });
    },

    _isPercentage: function (columnSize) {
        return columnSize[0] <= 1;
    },

    _adjustColumns: function () {
        var self = this, o = this.options;
        if (o.isNeedFreeze === true) {
            // 如果存在百分比的情况
            if (this._isPercentage(o.columnSize)) {
                if (this._hasAdaptCol(o.columnSize)) {
                    var findCols = [], remain = 0;
                    BI.each(o.columnSize, function (i, size) {
                        if (size === "") {
                            findCols.push(i);
                        } else {
                            remain += size;
                        }
                    });
                    remain = 1 - remain;
                    var average = remain / findCols.length;
                    BI.each(findCols, function (i, col) {
                        o.columnSize[col] = average;
                    });
                }
                var isRight = BI.first(o.freezeCols) !== 0;
                var freezeSize = [], notFreezeSize = [];
                BI.each(o.columnSize, function (i, size) {
                    if (o.freezeCols.contains(i)) {
                        freezeSize.push(size);
                    } else {
                        notFreezeSize.push(size);
                    }
                });
                var sumFreezeSize = BI.sum(freezeSize), sumNotFreezeSize = BI.sum(notFreezeSize);
                BI.each(freezeSize, function (i, size) {
                    freezeSize[i] = size / sumFreezeSize;
                });
                BI.each(notFreezeSize, function (i, size) {
                    notFreezeSize[i] = size / sumNotFreezeSize;
                });
                this.table.setRegionColumnSize(isRight ? ["fill", sumFreezeSize] : [sumFreezeSize, "fill"]);
                this.table.setColumnSize(isRight ? (notFreezeSize.concat(freezeSize)) : (freezeSize.concat(notFreezeSize)));
            }
        } else {
            // 如果存在自适应宽度的列或者是百分比计算的列，需要将整个表宽设为100%
            if (this._hasAdaptCol(o.columnSize) || this._isPercentage(o.columnSize)) {
                this.table.setRegionColumnSize(["100%"]);
            }
        }
    },

    setColumnSize: function (columnSize) {
        return this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        return this.table.setHeaderColumnSize(columnSize);
    },

    setRegionColumnSize: function (columnSize) {
        return this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        return this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        return this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        return this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    getColumns: function () {
        return this.table.getColumns();
    },

    populate: function (items, header) {
        this.table.populate(items, header);
        this._adjustColumns();
    }
});
BI.PreviewTable.EVENT_CHANGE = "PreviewTable.EVENT_CHANGE";
BI.shortcut("bi.preview_table", BI.PreviewTable);/**
 * 季度下拉框
 *
 * Created by GUY on 2015/8/28.
 * @class BI.QuarterCombo
 * @extends BI.Widget
 */
BI.QuarterCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.QuarterCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-quarter-combo",
            behaviors: {},
            height: 25
        });
    },
    _init: function () {
        BI.QuarterCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = "";
        this.trigger = BI.createWidget({
            type: "bi.quarter_trigger",
            value: o.value
        });

        this.trigger.on(BI.QuarterTrigger.EVENT_FOCUS, function () {
            self.storeValue = this.getKey();
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_STOP, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getKey());
            } else if (!this.getKey()) {
                self.setValue();
            }
            self.fireEvent(BI.QuarterCombo.EVENT_CONFIRM);
        });
        this.popup = BI.createWidget({
            type: "bi.quarter_popup",
            behaviors: o.behaviors,
            value: o.value
        });

        this.popup.on(BI.QuarterPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.QuarterCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                el: this.popup
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.QuarterCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        if (BI.isNull(this.popup)) {
            return this.options.value || "";
        } else {
            return this.popup.getValue() || "";
        }
    }
});

BI.QuarterCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.QuarterCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.quarter_combo", BI.QuarterCombo);/**
 * 季度展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.QuarterPopup
 * @extends BI.Trigger
 */
BI.QuarterPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.QuarterPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-quarter-popup",
            behaviors: {}
        });
    },

    _init: function () {
        BI.QuarterPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var items = [{
            text: Date._QN[1],
            value: 1
        }, {
            text: Date._QN[2],
            value: 2
        }, {
            text: Date._QN[3],
            value: 3
        }, {
            text: Date._QN[4],
            value: 4
        }];
        items = BI.map(items, function (j, item) {
            return BI.extend(item, {
                type: "bi.text_item",
                cls: "bi-list-item-active",
                textAlign: "left",
                whiteSpace: "nowrap",
                once: false,
                forceSelected: true,
                height: 25
            });
        });

        this.quarter = BI.createWidget({
            type: "bi.button_group",
            element: this,
            behaviors: o.behaviors,
            items: BI.createItems(items, {}),
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });

        this.quarter.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MonthPopup.EVENT_CHANGE);
            }
        });
    },

    getValue: function () {
        return this.quarter.getValue()[0];
    },

    setValue: function (v) {
        this.quarter.setValue([v]);
    }
});
BI.QuarterPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.quarter_popup", BI.QuarterPopup);/**
 * 季度trigger
 *
 * Created by GUY on 2015/8/21.
 * @class BI.QuarterTrigger
 * @extends BI.Trigger
 */
BI.QuarterTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        textWidth: 40,
        errorText: BI.i18nText("BI-Quarter_Trigger_Error_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.QuarterTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-quarter-trigger bi-border",
            height: 24
        });
    },
    _init: function () {
        BI.QuarterTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                return v === "" || (BI.isPositiveInteger(v) && v >= 1 && v <= 4);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            errorText: c.errorText
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
                self.editor.setTitle(value);
            }
            self.fireEvent(BI.QuarterTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_STOP);
        });

        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.text_button",
                        baseCls: "bi-trigger-quarter-text",
                        text: BI.i18nText("BI-Multi_Date_Quarter"),
                        width: c.textWidth
                    },
                    width: c.textWidth
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        width: o.height
                    },
                    width: o.height
                }
            ]
        });
        this.setValue(o.value);
    },

    setValue: function (v) {
        v = v || "";
        this.editor.setState(v);
        this.editor.setValue(v);
        this.editor.setTitle(v);
    },

    getKey: function () {
        return this.editor.getValue();
    }
});
BI.QuarterTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.QuarterTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.QuarterTrigger.EVENT_START = "EVENT_START";
BI.QuarterTrigger.EVENT_STOP = "EVENT_STOP";
BI.QuarterTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.quarter_trigger", BI.QuarterTrigger);/**
 * 自适应宽度的表格
 *
 * Created by GUY on 2016/2/3.
 * @class BI.ResponisveTable
 * @extends BI.Widget
 */
BI.ResponisveTable = BI.inherit(BI.Widget, {

    _const: {
        perColumnSize: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.ResponisveTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-responsive-table",
            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为true时生效
            logic: { // 冻结的页面布局逻辑
                dynamic: false
            },

            isNeedMerge: false, // 是否需要合并单元格
            mergeCols: [], // 合并的单元格列号
            mergeRule: function (row1, row2) { // 合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: false,

            header: [],
            footer: false,
            items: [], // 二维数组

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.ResponisveTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this,
            logic: o.logic,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            header: o.header,
            footer: o.footer,
            items: o.items,
            // 交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self._initRegionSize();
            self.table.resize();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self._resizeRegion();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_REGION_RESIZE, function () {
            // important:在冻结并自适应列宽的情况下要随时变更表头宽度
            if (o.isNeedResize === true && self._isAdaptiveColumn()) {
                self._resizeHeader();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });

        this.table.on(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, function () {
            self._resizeBody();
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self._resizeRegion();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _initRegionSize: function () {
        var o = this.options;
        if (o.isNeedFreeze === true) {
            var regionColumnSize = this.table.getRegionColumnSize();
            var maxWidth = this.table.element.width();
            if (!regionColumnSize[0] || (regionColumnSize[0] === "fill") || regionColumnSize[0] > maxWidth || regionColumnSize[1] > maxWidth) {
                var freezeCols = o.freezeCols;
                if (freezeCols.length === 0) {
                    this.table.setRegionColumnSize([0, "fill"]);
                } else if (freezeCols.length > 0 && freezeCols.length < o.columnSize.length) {
                    var size = maxWidth / 3;
                    if (freezeCols.length > o.columnSize.length / 2) {
                        size = maxWidth * 2 / 3;
                    }
                    this.table.setRegionColumnSize([size, "fill"]);
                } else {
                    this.table.setRegionColumnSize(["fill", 0]);
                }
            }
        }
    },

    _getBlockSize: function () {
        var o = this.options;
        var columnSize = this.table.getCalculateColumnSize();
        if (o.isNeedFreeze === true) {
            var columnSizeLeft = [], columnSizeRight = [];
            BI.each(columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    columnSizeLeft.push(size);
                } else {
                    columnSizeRight.push(size);
                }
            });
            // 因为有边框，所以加上数组长度的参数调整
            var sumLeft = BI.sum(columnSizeLeft) + columnSizeLeft.length,
                sumRight = BI.sum(columnSizeRight) + columnSizeRight.length;
            return {
                sumLeft: sumLeft,
                sumRight: sumRight,
                left: columnSizeLeft,
                right: columnSizeRight
            };
        }
        return {
            size: columnSize,
            sum: BI.sum(columnSize) + columnSize.length
        };
    },

    _isAdaptiveColumn: function (columnSize) {
        return !(BI.last(columnSize || this.table.getColumnSize()) > 1.05);
    },

    _resizeHeader: function () {
        var self = this, o = this.options;
        if (o.isNeedFreeze === true) {
            // 若是当前处于自适应调节阶段
            if (this._isAdaptiveColumn()) {
                var columnSize = this.table.getCalculateColumnSize();
                this.table.setHeaderColumnSize(columnSize);
            } else {
                var regionColumnSize = this.table.getClientRegionColumnSize();
                var block = this._getBlockSize();
                var sumLeft = block.sumLeft, sumRight = block.sumRight;
                var columnSizeLeft = block.left, columnSizeRight = block.right;
                columnSizeLeft[columnSizeLeft.length - 1] += regionColumnSize[0] - sumLeft;
                columnSizeRight[columnSizeRight.length - 1] += regionColumnSize[1] - sumRight;

                var newLeft = BI.clone(columnSizeLeft), newRight = BI.clone(columnSizeRight);
                newLeft[newLeft.length - 1] = "";
                newRight[newRight.length - 1] = "";
                this.table.setColumnSize(newLeft.concat(newRight));

                block = self._getBlockSize();
                if (columnSizeLeft[columnSizeLeft.length - 1] < block.left[block.left.length - 1]) {
                    columnSizeLeft[columnSizeLeft.length - 1] = block.left[block.left.length - 1];
                }
                if (columnSizeRight[columnSizeRight.length - 1] < block.right[block.right.length - 1]) {
                    columnSizeRight[columnSizeRight.length - 1] = block.right[block.right.length - 1];
                }

                self.table.setColumnSize(columnSizeLeft.concat(columnSizeRight));
            }
        } else {
            if (!this._isAdaptiveColumn()) {
                var regionColumnSize = this.table.getClientRegionColumnSize();
                var block = this._getBlockSize();
                var sum = block.sum;
                var size = block.size;

                size[size.length - 1] += regionColumnSize[0] - sum;

                var newSize = BI.clone(size);
                newSize[newSize.length - 1] = "";
                this.table.setColumnSize(newSize);
                block = this._getBlockSize();

                if (size[size.length - 1] < block.size[block.size.length - 1]) {
                    size[size.length - 1] = block.size[block.size.length - 1];
                }
                this.table.setColumnSize(size);
            }
        }
    },

    _resizeBody: function () {
        if (this._isAdaptiveColumn()) {
            var columnSize = this.table.getCalculateColumnSize();
            this.setColumnSize(columnSize);
        }
    },

    _adjustRegion: function () {
        var o = this.options;
        var regionColumnSize = this.table.getCalculateRegionColumnSize();
        if (o.isNeedFreeze === true && o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
            var block = this._getBlockSize();
            var sumLeft = block.sumLeft, sumRight = block.sumRight;
            if (sumLeft < regionColumnSize[0] || regionColumnSize[0] >= (sumLeft + sumRight)) {
                this.table.setRegionColumnSize([sumLeft, "fill"]);
            }
            this._resizeRegion();
        }
    },

    _resizeRegion: function () {
        var o = this.options;
        var regionColumnSize = this.table.getCalculateRegionColumnSize();
        if (o.isNeedFreeze === true && o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
            var maxWidth = this.table.element.width();
            if (regionColumnSize[0] < 15 || regionColumnSize[1] < 15) {
                var freezeCols = o.freezeCols;
                var size = maxWidth / 3;
                if (freezeCols.length > o.columnSize.length / 2) {
                    size = maxWidth * 2 / 3;
                }
                this.table.setRegionColumnSize([size, "fill"]);
            }
        }
    },


    resize: function () {
        this.table.resize();
        this._resizeRegion();
        this._resizeHeader();
    },

    setColumnSize: function (columnSize) {
        this.table.setColumnSize(columnSize);
        this._adjustRegion();
        this._resizeHeader();
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        this.table.setHeaderColumnSize(columnSize);
        this._adjustRegion();
        this._resizeHeader();
    },

    setRegionColumnSize: function (columnSize) {
        this.table.setRegionColumnSize(columnSize);
        this._resizeHeader();
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    getColumns: function () {
        return this.table.getColumns();
    },

    attr: function () {
        BI.ResponisveTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    populate: function (items) {
        var self = this, o = this.options;
        this.table.populate.apply(this.table, arguments);
        if (o.isNeedFreeze === true) {
            BI.nextTick(function () {
                self._initRegionSize();
                self.table.resize();
                self._resizeHeader();
            });
        }
    }
});
BI.shortcut("bi.responsive_table", BI.ResponisveTable);/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.SelectTreeFirstPlusGroupNode
 * @extends BI.NodeButton
 */
BI.SelectTreeFirstPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.SelectTreeFirstPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-select-tree-first-plus-group-node bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.SelectTreeFirstPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.first_tree_node_checkbox",
            stopPropagation: true
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 25,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
    },

    setOpened: function (v) {
        BI.SelectTreeFirstPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.select_tree_first_plus_group_node", BI.SelectTreeFirstPlusGroupNode);/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.SelectTreeLastPlusGroupNode
 * @extends BI.NodeButton
 */
BI.SelectTreeLastPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.SelectTreeLastPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-select-tree-last-plus-group-node bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.SelectTreeLastPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.last_tree_node_checkbox",
            stopPropagation: true
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 25,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
    },

    setOpened: function (v) {
        BI.SelectTreeLastPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.select_tree_last_plus_group_node", BI.SelectTreeLastPlusGroupNode);/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.SelectTreeMidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.SelectTreeMidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.SelectTreeMidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-select-tree-mid-plus-group-node bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        });
    },
    _init: function () {
        BI.SelectTreeMidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.mid_tree_node_checkbox",
            stopPropagation: true
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 25,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
    },

    setOpened: function (v) {
        BI.SelectTreeMidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.select_tree_mid_plus_group_node", BI.SelectTreeMidPlusGroupNode);/**
 * @class BI.SelectTreeCombo
 * @extends BI.Widget
 */
BI.SelectTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-tree-combo",
            height: 30,
            text: "",
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.SelectTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items,
            value: o.value
        });

        this.popup = BI.createWidget({
            type: "bi.select_level_tree",
            items: o.items,
            value: o.value
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.popup.on(BI.SingleTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});


BI.shortcut("bi.select_tree_combo", BI.SelectTreeCombo);/**
 * @class BI.SelectTreeExpander
 * @extends BI.Widget
 */
BI.SelectTreeExpander = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTreeExpander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-tree-expander",
            trigger: "click",
            toggle: true,
            direction: "bottom",
            isDefaultInit: true,
            el: {},
            popup: {}
        });
    },

    _init: function () {
        BI.SelectTreeExpander.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget(BI.extend({stopPropagation: true}, o.el));
        this.trigger.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.expander.setValue([]);
                }
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.expander = BI.createWidget({
            type: "bi.expander",
            element: this,
            trigger: o.trigger,
            toggle: o.toggle,
            direction: o.direction,
            isDefaultInit: o.isDefaultInit,
            el: this.trigger,
            popup: o.popup
        });
        this.expander.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.trigger.setSelected(false);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    setValue: function (v) {
        if (BI.contains(v, this.trigger.getValue())) {
            this.trigger.setSelected(true);
            this.expander.setValue([]);
        } else {
            this.trigger.setSelected(false);
            this.expander.setValue(v);
        }
    },

    getValue: function () {
        if (this.trigger.isSelected()) {
            return [this.trigger.getValue()];
        }
        return this.expander.getValue();
    },

    populate: function (items) {
        this.expander.populate(items);
    }
});

BI.shortcut("bi.select_tree_expander", BI.SelectTreeExpander);/**
 * @class BI.SelectTreePopup
 * @extends BI.Pane
 */

BI.SelectTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-level-tree",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            items: [],
            value: ""
        });
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {layer: layer};
            node.id = node.id || BI.UUID();
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.select_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.select_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.select_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);
                self._formatItems(node.children);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _init: function () {
        BI.SelectTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: "bi.level_tree",
            expander: {
                type: "bi.select_tree_expander",
                isDefaultInit: true
            },
            items: this._formatItems(BI.Tree.transformToTreeFormat(o.items)),
            value: o.value,
            chooseType: BI.Selection.Single
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.SelectTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(this._formatItems(BI.Tree.transformToTreeFormat(items)));
    }
});

BI.SelectTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.select_level_tree", BI.SelectTreePopup);/**
 *
 * Created by GUY on 2016/8/10.
 * @class BI.SequenceTableDynamicNumber
 * @extends BI.SequenceTableTreeNumber
 */
BI.SequenceTableDynamicNumber = BI.inherit(BI.SequenceTableTreeNumber, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTableDynamicNumber.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-sequence-table-dynamic-number"
        });
    },

    _init: function () {
        BI.SequenceTableDynamicNumber.superclass._init.apply(this, arguments);
    },

    _formatNumber: function (nodes) {
        var self = this, o = this.options;
        var result = [];
        var count = this._getStart(nodes);

        function getLeafCount (node) {
            var cnt = 0;
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    cnt += getLeafCount(child);
                });
                if (node.children.length > 1 && BI.isNotEmptyArray(node.values)) {
                    cnt++;
                }
            } else {
                cnt++;
            }
            return cnt;
        }

        var start = 0, top = 0;
        BI.each(nodes, function (i, node) {
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var cnt = getLeafCount(child);
                    result.push({
                        text: count++,
                        start: start,
                        top: top,
                        cnt: cnt,
                        index: index,
                        height: cnt * o.rowSize
                    });
                    start += cnt;
                    top += cnt * o.rowSize;
                });
                if (BI.isNotEmptyArray(node.values)) {
                    result.push({
                        text: BI.i18nText("BI-Summary_Values"),
                        start: start++,
                        top: top,
                        cnt: 1,
                        isSummary: true,
                        height: o.rowSize
                    });
                    top += o.rowSize;
                }
            }
        });
        return result;
    }
});
BI.shortcut("bi.sequence_table_dynamic_number", BI.SequenceTableDynamicNumber);/**
 *
 * Created by GUY on 2016/5/26.
 * @class BI.SequenceTableListNumber
 * @extends BI.Widget
 */
BI.SequenceTableListNumber = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTableListNumber.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sequence-table-list-number",
            isNeedFreeze: false,
            scrollTop: 0,
            startSequence: 1, // 开始的序号
            headerRowSize: 25,
            rowSize: 25,

            sequenceHeaderCreator: null,

            header: [],
            items: [], // 二维数组

            // 交叉表头
            crossHeader: [],
            crossItems: [],

            pageSize: 20
        });
    },

    _init: function () {
        BI.SequenceTableListNumber.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.start = o.startSequence;
        this.renderedCells = [];
        this.renderedKeys = [];

        this.container = BI.createWidget({
            type: "bi.absolute",
            width: 60,
            scrollable: false
        });

        this.scrollContainer = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.container]
        });

        this.headerContainer = BI.createWidget({
            type: "bi.absolute",
            cls: "bi-border",
            width: 58,
            scrollable: false
        });

        this.layout = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.headerContainer,
                height: o.headerRowSize * o.header.length - 2
            }, {
                el: {type: "bi.layout"},
                height: 2
            }, {
                el: this.scrollContainer
            }]
        });
        this._populate();
    },

    _layout: function () {
        var self = this, o = this.options;
        var headerHeight = o.headerRowSize * o.header.length - 2;
        var items = this.layout.attr("items");
        if (o.isNeedFreeze === false) {
            items[0].height = 0;
            items[1].height = 0;
        } else if (o.isNeedFreeze === true) {
            items[0].height = headerHeight;
            items[1].height = 2;
        }
        this.layout.attr("items", items);
        this.layout.resize();
        this.container.setHeight(o.items.length * o.rowSize);
        try {
            this.scrollContainer.element.scrollTop(o.scrollTop);
        } catch (e) {

        }
    },

    _createHeader: function () {
        var o = this.options;
        BI.createWidget({
            type: "bi.absolute",
            element: this.headerContainer,
            items: [{
                el: o.sequenceHeaderCreator || {
                    type: "bi.table_style_cell",
                    cls: "sequence-table-title-cell",
                    styleGetter: o.headerCellStyleGetter,
                    text: BI.i18nText("BI-Number_Index")
                },
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }]
        });
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;
        var scrollTop = BI.clamp(o.scrollTop, 0, o.rowSize * o.items.length - (o.height - o.header.length * o.headerRowSize) + BI.DOM.getScrollWidth());
        var start = Math.floor(scrollTop / o.rowSize);
        var end = start + Math.floor((o.height - o.header.length * o.headerRowSize) / o.rowSize);
        var renderedCells = [], renderedKeys = [];
        for (var i = start, cnt = 0; i <= end && i < o.items.length; i++, cnt++) {
            var index = BI.deepIndexOf(this.renderedKeys, this.start + i);
            var top = i * o.rowSize;
            if (index > -1) {
                if (o.rowSize !== this.renderedCells[index]._height) {
                    this.renderedCells[index]._height = o.rowSize;
                    this.renderedCells[index].el.setHeight(o.rowSize);
                }
                if (this.renderedCells[index].top !== top) {
                    this.renderedCells[index].top = top;
                    this.renderedCells[index].el.element.css("top", top + "px");
                }
                renderedCells.push(this.renderedCells[index]);
            } else {
                var child = BI.createWidget(BI.extend({
                    type: "bi.table_style_cell",
                    cls: "sequence-table-number-cell bi-border-left bi-border-right bi-border-bottom",
                    width: 60,
                    height: o.rowSize,
                    text: this.start + i,
                    styleGetter: function (index) {
                        return function () {
                            return o.sequenceCellStyleGetter(self.start + i - 1);
                        };
                    }(cnt)
                }));
                renderedCells.push({
                    el: child,
                    left: 0,
                    top: top,
                    _height: o.rowSize
                });
            }
            renderedKeys.push(this.start + i);
        }

        // 已存在的， 需要添加的和需要删除的
        var existSet = {}, addSet = {}, deleteArray = [];
        BI.each(renderedKeys, function (i, key) {
            if (BI.deepContains(self.renderedKeys, key)) {
                existSet[i] = key;
            } else {
                addSet[i] = key;
            }
        });
        BI.each(this.renderedKeys, function (i, key) {
            if (BI.deepContains(existSet, key)) {
                return;
            }
            if (BI.deepContains(addSet, key)) {
                return;
            }
            deleteArray.push(i);
        });
        BI.each(deleteArray, function (i, index) {
            self.renderedCells[index].el.destroy();
        });
        var addedItems = [];
        BI.each(addSet, function (index) {
            addedItems.push(renderedCells[index]);
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: addedItems
        });
        this.renderedCells = renderedCells;
        this.renderedKeys = renderedKeys;
    },

    _populate: function () {
        this.headerContainer.empty();
        this._createHeader();
        this._layout();
        this._calculateChildrenToRender();
    },

    setVerticalScroll: function (scrollTop) {
        if (this.options.scrollTop !== scrollTop) {
            this.options.scrollTop = scrollTop;
            try {
                this.scrollContainer.element.scrollTop(scrollTop);
            } catch (e) {

            }
        }
    },

    getVerticalScroll: function () {
        return this.options.scrollTop;
    },

    setVPage: function (v) {
        v = v < 1 ? 1 : v;
        var o = this.options;
        this.start = (v - 1) * o.pageSize + 1;
    },

    _restore: function () {
        var o = this.options;
        BI.each(this.renderedCells, function (i, cell) {
            cell.el.destroy();
        });
        this.renderedCells = [];
        this.renderedKeys = [];
    },

    restore: function () {
        this._restore();
    },

    populate: function (items, header) {
        var o = this.options;
        if (items && items !== this.options.items) {
            o.items = items;
            this._restore();
        }
        if (header && header !== this.options.header) {
            o.header = header;
        }
        this._populate();
    }
});
BI.shortcut("bi.sequence_table_list_number", BI.SequenceTableListNumber);/**
 * 带有序号的表格
 *
 * Created by GUY on 2016/5/26.
 * @class BI.SequenceTable
 * @extends BI.Widget
 */
BI.SequenceTable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sequence-table",
            el: {
                type: "bi.adaptive_table"
            },

            sequence: {},

            isNeedResize: true,
            isResizeAdapt: false,

            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false, // 是否需要合并单元格
            mergeCols: [], // 合并的单元格列号
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [], // 二维数组

            // 交叉表头
            crossHeader: [],
            crossItems: [],

            showSequence: false,
            startSequence: 1// 开始的序号
        });
    },

    _init: function () {
        BI.SequenceTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.sequence = BI.createWidget(o.sequence, {
            type: "bi.sequence_table_list_number",
            invisible: o.showSequence === false,
            startSequence: o.startSequence,
            isNeedFreeze: o.isNeedFreeze,
            header: o.header,
            items: o.items,
            crossHeader: o.crossHeader,
            crossItems: o.crossItems,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            width: 60,
            height: o.height && o.height - BI.GridTableScrollbar.SIZE,

            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter
        });
        this.table = BI.createWidget(o.el, {
            type: "bi.adaptive_table",
            width: o.showSequence === true ? o.width - 60 : o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter,

            header: o.header,
            items: o.items,
            // 交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });

        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function (scroll) {
            if (self.sequence.getVerticalScroll() !== this.getVerticalScroll()) {
                self.sequence.setVerticalScroll(this.getVerticalScroll());
                self.sequence.populate();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });

        this.htape = BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.sequence,
                left: 0,
                top: 0
            }, {
                el: this.table,
                top: 0,
                left: o.showSequence === true ? 60 : 0
            }]
        });
        this._populate();
    },

    _populate: function () {
        var o = this.options;
        if (o.showSequence === true) {
            this.sequence.setVisible(true);
            this.table.element.css("left", "60px");
            this.table.setWidth(o.width - 60);
        } else {
            this.sequence.setVisible(false);
            this.table.element.css("left", "0px");
            this.table.setWidth(o.width);
        }
    },

    setWidth: function (width) {
        BI.PageTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(this.options.showSequence ? width - 60 : width);
    },

    setHeight: function (height) {
        BI.PageTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
        this.sequence.setHeight(height - BI.GridTableScrollbar.SIZE);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    hasLeftHorizontalScroll: function () {
        return this.table.hasLeftHorizontalScroll();
    },

    hasRightHorizontalScroll: function () {
        return this.table.hasRightHorizontalScroll();
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
        this.sequence.setVerticalScroll(scrollTop);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    setVPage: function (page) {
        this.sequence.setVPage && this.sequence.setVPage(page);
    },

    setHPage: function (page) {
        this.sequence.setHPage && this.sequence.setHPage(page);
    },

    attr: function () {
        BI.SequenceTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
        this.sequence.attr.apply(this.sequence, arguments);
    },

    restore: function () {
        this.table.restore();
        this.sequence.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items;
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        this._populate();
        this.table.populate.apply(this.table, arguments);
        this.sequence.populate.apply(this.sequence, arguments);
        this.sequence.setVerticalScroll(this.table.getVerticalScroll());
    },

    destroy: function () {
        this.table.destroy();
        BI.SequenceTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut("bi.sequence_table", BI.SequenceTable);/**
 * 单选加载数据搜索loader面板
 * Created by guy on 15/11/4.
 * @class BI.SingleSelectSearchLoader
 * @extends Widget
 */
BI.SingleSelectSearchLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearchLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-search-loader",
            itemsCreator: BI.emptyFn,
            keywordGetter: BI.emptyFn,
            valueFormatter: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectSearchLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;

        this.button_group = BI.createWidget({
            type: "bi.single_select_list",
            element: this,
            logic: {
                dynamic: false
            },
            value: opts.value,
            el: {
                tipText: BI.i18nText("BI-No_Select"),
                el: {
                    type: "bi.loader",
                    isDefaultInit: false,
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            },
            itemsCreator: function (op, callback) {
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: [self.storeValue]
                }));
                opts.itemsCreator(op, function (ob) {
                    var keyword = ob.keyword = opts.keywordGetter();
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = BI.map([self.storeValue], function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt,
                                selected: false
                            };
                        });
                        firstItems = self._createItems(json);
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), keyword);
                    if (op.times === 1 && self.storeValue) {
                        self.setValue(self.storeValue);
                    }
                });
            },
            hasNext: function () {
                return hasNext;
            }
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SingleSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectSearchLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.single_select_radio_item",
            logic: {
                dynamic: false
            },
            height: 25,
            selected: false
        });
    },

    _filterValues: function (src) {
        var o = this.options;
        var keyword = o.keywordGetter();
        var values = BI.deepClone(src.value) || [];
        var newValues = BI.map(values, function (i, v) {
            return {
                text: o.valueFormatter(v) || v,
                value: v
            };
        });
        if (BI.isKey(keyword)) {
            var search = BI.Func.getSearchResult(newValues, keyword);
            values = search.match.concat(search.find);
        }
        return BI.map(values, function (i, v) {
            return {
                text: v.text,
                title: v.text,
                value: v.value,
                selected: false
            };
        });
    },

    setValue: function (v) {
        // 暂存的值一定是新的值，不然v改掉后，storeValue也跟着改了
        this.storeValue = v;
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.SingleSelectSearchLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_search_loader", BI.SingleSelectSearchLoader);/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.SingleSelectSearchPane
 * @extends Widget
 */

BI.SingleSelectSearchPane = BI.inherit(BI.Widget, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-search-pane bi-card",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectSearchPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.tooltipClick = BI.createWidget({
            type: "bi.label",
            invisible: true,
            text: BI.i18nText("BI-Click_Blank_To_Select"),
            cls: "single-select-toolbar",
            height: this.constants.height
        });

        this.loader = BI.createWidget({
            type: "bi.single_select_search_loader",
            keywordGetter: o.keywordGetter,
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator.apply(self, [op, function (res) {
                    callback(res);
                    self.setKeyword(o.keywordGetter());
                }]);
            },
            value: o.value
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.resizer = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.tooltipClick,
                height: 0
            }, {
                el: this.loader
            }]
        });
        this.tooltipClick.setVisible(false);
    },

    setKeyword: function (keyword) {
        var btn;
        var isVisible = this.loader.getAllButtons().length > 0 && (btn = this.loader.getAllButtons()[0]) && (keyword === btn.getValue());
        if (isVisible !== this.tooltipClick.isVisible()) {
            this.tooltipClick.setVisible(isVisible);
            this.resizer.attr("items")[0].height = (isVisible ? this.constants.height : 0);
            this.resizer.resize();
        }
    },

    hasMatched: function () {
        return this.tooltipClick.isVisible();
    },

    setValue: function (v) {
        this.loader.setValue(v);
    },

    getValue: function () {
        return this.loader.getValue();
    },

    empty: function () {
        this.loader.empty();
    },

    populate: function (items) {
        this.loader.populate.apply(this.loader, arguments);
    }
});

BI.SingleSelectSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.single_select_search_pane", BI.SingleSelectSearchPane);/**
 *
 * @class BI.SingleSelectCombo
 * @extends BI.Single
 */
BI.SingleSelectCombo = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-combo",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 28
        });
    },

    _init: function () {
        BI.SingleSelectCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var assertShowValue = function () {
            BI.isKey(self._startValue) && (self.storeValue = self._startValue);
            self.trigger.getSearcher().setState(self.storeValue);
        };
        this.storeValue = o.value;
        // 标记正在请求数据
        this.requesting = false;

        this.trigger = BI.createWidget({
            type: "bi.single_select_trigger",
            height: o.height,
            // adapter: this.popup,
            masker: {
                offset: {
                    left: 1,
                    top: 1,
                    right: 2,
                    bottom: 33
                }
            },
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (res) {
                    if (op.times === 1 && BI.isNotNull(op.keywords)) {
                        // 预防trigger内部把当前的storeValue改掉
                        self.trigger.setValue(self.getValue());
                    }
                    callback.apply(self, arguments);
                });
            },
            value: this.storeValue
        });

        this.trigger.on(BI.SingleSelectTrigger.EVENT_START, function () {
            self._setStartValue("");
            this.getSearcher().setValue(self.storeValue);
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_STOP, function () {
            self._setStartValue("");
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_PAUSE, function () {
            if (this.getSearcher().hasMatched()) {
                var keyword = this.getSearcher().getKeyword();
                self._join({
                    type: BI.Selection.Multi,
                    value: [keyword]
                }, function () {
                    self.combo.setValue(self.storeValue);
                    self._setStartValue(keyword);
                    assertShowValue();
                    self.populate();
                    self._setStartValue("");
                });
            }
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_SEARCHING, function (keywords) {
            var last = BI.last(keywords);
            keywords = BI.initial(keywords || []);
            if (keywords.length > 0) {
                self._joinKeywords(keywords, function () {
                    if (BI.isEndWithBlank(last)) {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                        self.combo.populate();
                        self._setStartValue("");
                    } else {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                    }
                });
            }
        });

        this.trigger.on(BI.SingleSelectTrigger.EVENT_CHANGE, function (value, obj) {
            self.storeValue = this.getValue();
            assertShowValue();
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: "bi.single_select_popup_view",
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.SingleSelectPopupView.EVENT_CHANGE,
                    action: function () {
                        self.storeValue = this.getValue();
                        self._adjust(function () {
                            assertShowValue();
                        });
                    }
                }, {
                    eventName: BI.SingleSelectPopupView.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self._defaultState();
                    }
                }, {
                    eventName: BI.SingleSelectPopupView.EVENT_CLICK_CLEAR,
                    action: function () {
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: o.itemsCreator,
                valueFormatter: o.valueFormatter,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.combo.adjustWidth();
                        self.combo.adjustHeight();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            },
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            },
            value: o.value
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            this.setValue(self.storeValue);
            BI.nextTick(function () {
                self.populate();
            });
        });
        // 当退出的时候如果还在处理请求，则等请求结束后再对外发确定事件
        this.wants2Quit = false;
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            // important:关闭弹出时又可能没有退出编辑状态
            self.trigger.stopEditing();
            if (self.requesting === true) {
                self.wants2Quit = true;
            } else {
                self.fireEvent(BI.SingleSelectCombo.EVENT_CONFIRM);
            }
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "single-select-trigger-icon-button"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    _assertValue: function (val) {
        val || (val = "");
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        this.requesting = true;
        o.itemsCreator({
            type: BI.SingleSelectCombo.REQ_GET_ALL_DATA,
            keywords: keywords
        }, function (ob) {
            var values = BI.map(ob.items, "value");
            digest(values);
        });

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value["remove"](val);
                }
            });
            self._adjust(callback);
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this.requesting = true;
        o.itemsCreator({
            type: BI.SingleSelectCombo.REQ_GET_ALL_DATA,
            keywords: [this.trigger.getKey()]
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                self._adjust(callback);
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            self._adjust(callback);
        });
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        if (!this._count) {
            o.itemsCreator({
                type: BI.SingleSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                self._count = res.count;
                adjust();
                callback();
            });
        } else {
            adjust();
            callback();

        }

        function adjust () {
            if (self.wants2Quit === true) {
                self.fireEvent(BI.SingleSelectCombo.EVENT_CONFIRM);
                self.wants2Quit = false;
            }
            self.requesting = false;
        }
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            self._adjust(callback);
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.popup.setStartValue(value);
    },

    setValue: function (v) {
        this.storeValue = v;
        this._assertValue(this.storeValue);
        this.combo.setValue(this.storeValue);
    },

    getValue: function () {
        return this.storeValue;
    },

    populate: function () {
        this._count = null;
        this.combo.populate.apply(this.combo, arguments);
    }
});

BI.extend(BI.SingleSelectCombo, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.SingleSelectCombo.EVENT_CONFIRM = "EVENT_CONFIRM";

BI.shortcut("bi.single_select_combo", BI.SingleSelectCombo);
/**
 * 选择列表
 *
 * Created by GUY on 2015/11/1.
 * @class BI.SingleSelectList
 * @extends BI.Widget
 */
BI.SingleSelectList = BI.inherit(BI.Widget, {
    
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-list",
            direction: BI.Direction.Top, // toolbar的位置
            logic: {
                dynamic: true
            },
            items: [],
            itemsCreator: BI.emptyFn,
            hasNext: BI.emptyFn,
            onLoaded: BI.emptyFn,
            el: {
                type: "bi.list_pane"
            }
        });
    },
    _init: function () {
        BI.SingleSelectList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
    
        this.list = BI.createWidget(o.el, {
            type: "bi.list_pane",
            items: o.items,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (items) {
                    callback.apply(self, arguments);
                });
            },
            onLoaded: o.onLoaded,
            hasNext: o.hasNext,
            value: o.value
        });
    
        this.list.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.SingleSelectList.EVENT_CHANGE, value, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({
            scrolly: true
        }, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.list)
        }))));
    
    },
    
    hasPrev: function () {
        return this.list.hasPrev();
    },
    
    hasNext: function () {
        return this.list.hasNext();
    },
    
    prependItems: function (items) {
        this.list.prependItems.apply(this.list, arguments);
    },
    
    addItems: function (items) {
        this.list.addItems.apply(this.list, arguments);
    },
    
    setValue: function (v) {
        this.list.setValue([v]);
    },
    
    getValue: function () {
        return this.list.getValue()[0];
    },
    
    empty: function () {
        this.list.empty();
    },
    
    populate: function (items) {
        this.list.populate.apply(this.list, arguments);
    },
    
    resetHeight: function (h) {
        this.list.resetHeight ? this.list.resetHeight(h) :
            this.list.element.css({"max-height": h + "px"});
    },
    
    setNotSelectedValue: function () {
        this.list.setNotSelectedValue.apply(this.list, arguments);
    },
    
    getNotSelectedValue: function () {
        return this.list.getNotSelectedValue();
    },
    
    getAllButtons: function () {
        return this.list.getAllButtons();
    },
    
    getAllLeaves: function () {
        return this.list.getAllLeaves();
    },
    
    getSelectedButtons: function () {
        return this.list.getSelectedButtons();
    },
    
    getNotSelectedButtons: function () {
        return this.list.getNotSelectedButtons();
    },
    
    getIndexByValue: function (value) {
        return this.list.getIndexByValue(value);
    },
    
    getNodeById: function (id) {
        return this.list.getNodeById(id);
    },
    
    getNodeByValue: function (value) {
        return this.list.getNodeByValue(value);
    }
});
BI.SingleSelectList.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_list", BI.SingleSelectList);/**
 * 单选加载数据面板
 * Created by guy on 15/11/2.
 * @class BI.SingleSelectLoader
 * @extends Widget
 */
BI.SingleSelectLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-loader",
            logic: {
                dynamic: true
            },
            el: {
                height: 400
            },
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;

        this.button_group = BI.createWidget({
            type: "bi.single_select_list",
            element: this,
            logic: opts.logic,
            el: BI.extend({
                onLoaded: opts.onLoaded,
                el: {
                    type: "bi.loader",
                    isDefaultInit: false,
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            }, opts.el),
            itemsCreator: function (op, callback) {
                var startValue = self._startValue;
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: [self.storeValue]
                }));
                opts.itemsCreator(op, function (ob) {
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = BI.map([self.storeValue], function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt,
                                selected: false
                            };
                        });
                        firstItems = self._createItems(json);
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), ob.keyword || "");
                    if (op.times === 1 && self.storeValue) {
                        BI.isKey(startValue) && (self.storeValue = startValue);
                        self.setValue(self.storeValue);
                    }
                    (op.times === 1) && self._scrollToTop();
                });
            },
            hasNext: function () {
                return hasNext;
            },
            value: this.storeValue
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SingleSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.single_select_radio_item",
            logic: this.options.logic,
            height: 25,
            selected: false
        });
    },

    _scrollToTop: function () {
        var self = this;
        BI.delay(function () {
            self.button_group.element.scrollTop(0);
        }, 30);
    },

    _assertValue: function (val) {
        val || (val = "");
    },

    setStartValue: function (v) {
        this._startValue = v;
    },

    setValue: function (v) {
        this.storeValue = v || "";
        this._assertValue(this.storeValue);
        this.button_group.setValue(this.storeValue);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.SingleSelectLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_loader", BI.SingleSelectLoader);/**
 * 带加载的单选下拉面板
 * @class BI.SingleSelectPopupView
 * @extends Widget
 */
BI.SingleSelectPopupView = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-popup-view",
            maxWidth: "auto",
            minWidth: 135,
            maxHeight: 400,
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectPopupView.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;

        this.loader = BI.createWidget({
            type: "bi.single_select_loader",
            itemsCreator: opts.itemsCreator,
            valueFormatter: opts.valueFormatter,
            onLoaded: opts.onLoaded,
            value: opts.value
        });

        this.popupView = BI.createWidget({
            type: "bi.multi_popup_view",
            stopPropagation: false,
            maxWidth: opts.maxWidth,
            minWidth: opts.minWidth,
            maxHeight: opts.maxHeight,
            element: this,
            buttons: [BI.i18nText("BI-Basic_Clears"), BI.i18nText("BI-Basic_Sure")],
            el: this.loader,
            value: opts.value
        });

        this.popupView.on(BI.MultiPopupView.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectPopupView.EVENT_CHANGE);
        });
        this.popupView.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.fireEvent(BI.SingleSelectPopupView.EVENT_CLICK_CLEAR);
                    break;
                case 1:
                    self.fireEvent(BI.SingleSelectPopupView.EVENT_CLICK_CONFIRM);
                    break;
            }
        });
    },

    setStartValue: function (v) {
        this.loader.setStartValue(v);
    },

    setValue: function (v) {
        this.popupView.setValue(v);
    },

    getValue: function () {
        return this.popupView.getValue();
    },

    populate: function (items) {
        this.popupView.populate.apply(this.popupView, arguments);
    },

    resetHeight: function (h) {
        this.popupView.resetHeight(h);
    },

    resetWidth: function (w) {
        this.popupView.resetWidth(w);
    }
});

BI.SingleSelectPopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.SingleSelectPopupView.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.SingleSelectPopupView.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";


BI.shortcut("bi.single_select_popup_view", BI.SingleSelectPopupView);/**
 *
 * 单选下拉框
 * @class BI.SingleSelectTrigger
 * @extends BI.Trigger
 */

BI.SingleSelectTrigger = BI.inherit(BI.Trigger, {

    constants: {
        height: 14,
        rgap: 4,
        lgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-trigger bi-border",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            searcher: {},
            switcher: {},

            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.SingleSelectTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        if (o.height) {
            this.setHeight(o.height - 2);
        }

        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.single_select_searcher",
            height: o.height,
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            popup: {},
            adapter: o.adapter,
            masker: o.masker,
            value: o.value
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_START, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_START);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_PAUSE, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_PAUSE);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_SEARCHING, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_SEARCHING, arguments);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_STOP, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_STOP);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_CHANGE, arguments);
        });

        var wrapper = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [
                {
                    el: this.searcher,
                    width: "fill"
                }, {
                    el: BI.createWidget(),
                    width: 30
                }]
        });
    },

    getSearcher: function () {
        return this.searcher;
    },

    stopEditing: function () {
        this.searcher.stopSearch();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    setValue: function (v) {
        this.searcher.setValue(v);
    },

    getKey: function () {
        return this.searcher.getKey();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});

BI.SingleSelectTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.SingleSelectTrigger.EVENT_COUNTER_CLICK = "EVENT_COUNTER_CLICK";
BI.SingleSelectTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.SingleSelectTrigger.EVENT_START = "EVENT_START";
BI.SingleSelectTrigger.EVENT_STOP = "EVENT_STOP";
BI.SingleSelectTrigger.EVENT_PAUSE = "EVENT_PAUSE";
BI.SingleSelectTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.SingleSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW = "EVENT_BEFORE_COUNTER_POPUPVIEW";

BI.shortcut("bi.single_select_trigger", BI.SingleSelectTrigger);/**
 * @author: Teller
 * @createdAt: 2018/3/28
 * @Description
*/
BI.SingleSelectInsertList = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectInsertList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-insert-list",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn
        });
    },
    _init: function () {
        BI.SingleSelectInsertList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        this.storeValue = {};

        var assertShowValue = function () {
            BI.isKey(self._startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](self._startValue);
            // self.trigger.setValue(self.storeValue);
        };

        this.adapter = BI.createWidget({
            type: "bi.single_select_loader",
            cls: "popup-single-select-list bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            logic: {
                dynamic: false
            },
            // onLoaded: o.onLoaded,
            el: {}
        });
        this.adapter.on(BI.SingleSelectLoader.EVENT_CHANGE, function () {
            self.storeValue = this.getValue();
            assertShowValue();
            self.fireEvent(BI.SingleSelectInsertList.EVENT_CHANGE);
        });

        this.searcherPane = BI.createWidget({
            type: "bi.single_select_search_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            valueFormatter: o.valueFormatter,
            keywordGetter: function () {
                return self.trigger.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keyword = self.trigger.getKeyword();
                this.setKeyword(op.keyword);
                o.itemsCreator(op, callback);
            }
        });
        this.searcherPane.setVisible(false);

        this.trigger = BI.createWidget({
            type: "bi.searcher",
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            height: 200,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    self._setStartValue("");
                    this.setValue(BI.deepClone(self.storeValue));
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    self._setStartValue("");
                    self.adapter.setValue(self.storeValue);
                    // 需要刷新回到初始界面，否则搜索的结果不能放在最前面
                    self.adapter.populate();
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    var keyword = this.getKeyword();
                    if (this.hasMatched()) {
                        self._join({
                            type: BI.Selection.Single,
                            value: [keyword]
                        }, function () {
                            if (self.storeValue.type === BI.Selection.Single) {
                                self.storeValue.value.pushDistinct(keyword);
                            }
                            self._showAdapter();
                            self.adapter.setValue(self.storeValue);
                            self._setStartValue(keyword);
                            assertShowValue();
                            self.adapter.populate();
                            self._setStartValue("");
                            self.fireEvent(BI.SingleSelectInsertList.EVENT_CHANGE);
                        });
                    } else {
                        if (self.storeValue.type === BI.Selection.Single) {
                            self.storeValue.value.pushDistinct(keyword);
                        }
                        self._showAdapter();
                        self.adapter.setValue(self.storeValue);
                        self.adapter.populate();
                        if (self.storeValue.type === BI.Selection.Single) {
                            self.fireEvent(BI.SingleSelectInsertList.EVENT_CHANGE);
                        }
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_SEARCHING,
                action: function () {
                    var keywords = this.getKeyword();
                    var last = BI.last(keywords);
                    keywords = BI.initial(keywords || []);
                    if (keywords.length > 0) {
                        self._joinKeywords(keywords, function () {
                            if (BI.isEndWithBlank(last)) {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                                self.adapter.populate();
                                self._setStartValue("");
                            } else {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                            }
                        });
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function (value, obj) {
                    if (obj instanceof BI.MultiSelectBar) {
                        self._joinAll(this.getValue(), function () {
                            assertShowValue();
                            self.fireEvent(BI.SingleSelectInsertList.EVENT_CHANGE);
                        });
                    } else {
                        self._join(this.getValue(), function () {
                            assertShowValue();
                            self.fireEvent(BI.SingleSelectInsertList.EVENT_CHANGE);
                        });
                    }
                }
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.trigger,
                height: 24
            }, {
                el: this.adapter,
                height: "fill"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.searcherPane,
                top: 30,
                bottom: 0,
                left: 0,
                right: 0
            }]
        });
    },

    _showAdapter: function () {
        this.adapter.setVisible(true);
        this.searcherPane.setVisible(false);
    },

    _showSearcherPane: function () {
        this.searcherPane.setVisible(true);
        this.adapter.setVisible(false);
    },

    _defaultState: function () {
        this.trigger.stopEditing();
    },

    _assertValue: function (val) {
        val || (val = "");
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        if (!this._allData) {
            o.itemsCreator({
                type: BI.SingleSelectInsertList.REQ_GET_ALL_DATA
            }, function (ob) {
                self._allData = BI.map(ob.items, "value");
                digest(self._allData);
            });
        } else {
            digest(this._allData);
        }

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value[self.storeValue.type === BI.Selection.Single ? "pushDistinct" : "remove"](val);
                }
            });
            callback();
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        o.itemsCreator({
            type: BI.SingleSelectInsertList.REQ_GET_ALL_DATA,
            keyword: self.trigger.getKeyword()
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                callback();
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            callback();
        });
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            callback();
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.adapter.setStartValue(value);
    },

    isAllSelected: function () {
        return this.adapter.isAllSelected();
    },

    resize: function () {
        // this.trigger.getCounter().adjustView();
        // this.trigger.adjustView();
    },
    setValue: function (v) {
        this.storeValue = v || "";
        this.adapter.setValue(this.storeValue);
        this.trigger.setValue(this.storeValue);
    },

    getValue: function () {
        return BI.deepClone(this.storeValue);
    },

    populate: function () {
        this._count = null;
        this._allData = null;
        this.adapter.populate.apply(this.adapter, arguments);
        this.trigger.populate.apply(this.trigger, arguments);
    }
});

BI.extend(BI.SingleSelectInsertList, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.SingleSelectInsertList.EVENT_CHANGE = "BI.SingleSelectInsertList.EVENT_CHANGE";
BI.shortcut("bi.single_select_insert_list", BI.SingleSelectInsertList);
/**
 * 单选输入框
 * Created by guy on 15/11/3.
 * @class BI.SingleSelectEditor
 * @extends Widget
 */
BI.SingleSelectEditor = BI.inherit(BI.Widget, {

    _const: {
        checkSelected: BI.i18nText("BI-Check_Selected")
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-editor",
            el: {}
        });
    },

    _init: function () {
        BI.SingleSelectEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.state_editor",
            element: this,
            height: o.height,
            watermark: BI.i18nText("BI-Basic_Search"),
            allowBlank: true,
            value: o.value
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.StateEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SingleSelectEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.StateEditor.EVENT_CLICK_LABEL, function () {

        });
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setState: function (state) {
        this.editor.setState(state);
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        var v = this.editor.getState();
        if (BI.isArray(v) && v.length > 0) {
            return v[v.length - 1];
        }
        return "";
        
    },

    getKeywords: function () {
        var val = this.editor.getLastValidValue();
        var keywords = val.match(/[\S]+/g);
        if (BI.isEndWithBlank(val)) {
            return keywords.concat([" "]);
        }
        return keywords;
    },

    populate: function (items) {

    }
});
BI.SingleSelectEditor.EVENT_PAUSE = "SingleSelectEditor.EVENT_PAUSE";
BI.shortcut("bi.single_select_editor", BI.SingleSelectEditor);/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.SingleSelectSearcher
 * @extends Widget
 */
BI.SingleSelectSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-searcher",
            itemsCreator: BI.emptyFn,
            el: {},
            popup: {},
            valueFormatter: BI.emptyFn,
            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.SingleSelectSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.single_select_editor",
            height: o.height
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            element: this,
            height: o.height,
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            el: this.editor,

            popup: BI.extend({
                type: "bi.single_select_search_pane",
                valueFormatter: o.valueFormatter,
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    op.keyword = self.editor.getValue();
                    this.setKeyword(op.keyword);
                    o.itemsCreator(op, callback);
                },
                value: o.value
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.SingleSelectSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.Searcher.EVENT_SEARCHING, function () {
            var keywords = this.getKeywords();
            self.fireEvent(BI.SingleSelectSearcher.EVENT_SEARCHING, keywords);
        });

        if(BI.isNotNull(o.value)){
            this.setState(o.value);
        }
    },

    adjustView: function () {
        this.searcher.adjustView();
    },

    isSearching: function () {
        return this.searcher.isSearching();
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    getKeyword: function () {
        return this.editor.getValue();
    },

    hasMatched: function () {
        return this.searcher.hasMatched();
    },

    hasChecked: function () {
        return this.searcher.getView() && this.searcher.getView().hasChecked();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    setState: function (v) {
        var o = this.options;
        v || (v = "");
        if (v === "") {
            this.editor.setState(BI.Selection.None);
        } else {
            this.editor.setState(o.valueFormatter(v + "") || (v + ""));
        }
    },

    setValue: function (ob) {
        this.setState(ob);
        this.searcher.setValue(ob);
    },

    getKey: function () {
        return this.editor.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function (items) {
        this.searcher.populate.apply(this.searcher, arguments);
    }
});

BI.SingleSelectSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.SingleSelectSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.SingleSelectSearcher.EVENT_START = "EVENT_START";
BI.SingleSelectSearcher.EVENT_STOP = "EVENT_STOP";
BI.SingleSelectSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.SingleSelectSearcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.shortcut("bi.single_select_searcher", BI.SingleSelectSearcher);/**
 * 单选加载数据搜索loader面板
 * Created by guy on 15/11/4.
 * @class BI.SingleSelectSearchLoader
 * @extends Widget
 */
BI.SingleSelectSearchLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearchLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-search-loader",
            itemsCreator: BI.emptyFn,
            keywordGetter: BI.emptyFn,
            valueFormatter: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectSearchLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;

        this.button_group = BI.createWidget({
            type: "bi.single_select_list",
            element: this,
            logic: {
                dynamic: false
            },
            el: {
                tipText: BI.i18nText("BI-No_Select"),
                el: {
                    type: "bi.loader",
                    isDefaultInit: false,
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            },
            itemsCreator: function (op, callback) {
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: [self.storeValue]
                }));
                opts.itemsCreator(op, function (ob) {
                    var keyword = ob.keyword = opts.keywordGetter();
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = BI.map([self.storeValue], function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt,
                                selected: false
                            };
                        });
                        firstItems = self._createItems(json);
                    }
                    if(keyword) {
                        var flag = false;
                        for(var i = 0; i < ob.items.length; i++) {
                            if(BI.contains(ob.items[i], keyword)) {
                                flag = true;
                            }
                        }
                        if(!flag) {
                            var preItems = self._createItems([{
                                text: keyword,
                                value: keyword,
                                title: keyword,
                                selected: false
                            }]);
                            firstItems = firstItems.concat(preItems);
                        }
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), keyword);
                    if (op.times === 1 && self.storeValue) {
                        self.setValue(self.storeValue);
                    }
                });
            },
            hasNext: function () {
                return hasNext;
            }
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SingleSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectSearchLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.single_select_radio_item",
            logic: {
                dynamic: false
            },
            height: 25,
            selected: false
        });
    },

    _filterValues: function (src) {
        var o = this.options;
        var keyword = o.keywordGetter();
        var values = BI.deepClone(src.value) || [];
        var newValues = BI.map(values, function (i, v) {
            return {
                text: o.valueFormatter(v) || v,
                value: v
            };
        });
        if (BI.isKey(keyword)) {
            var search = BI.Func.getSearchResult(newValues, keyword);
            values = search.match.concat(search.find);
        }
        return BI.map(values, function (i, v) {
            return {
                text: v.text,
                title: v.text,
                value: v.value,
                selected: false
            };
        });
    },

    setValue: function (v) {
        // 暂存的值一定是新的值，不然v改掉后，storeValue也跟着改了
        this.storeValue = v;
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.SingleSelectSearchLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_search_add_loader", BI.SingleSelectSearchLoader);/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.SingleSelectSearchPane
 * @extends Widget
 */

BI.SingleSelectSearchPane = BI.inherit(BI.Widget, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-search-pane bi-card",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectSearchPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.tooltipClick = BI.createWidget({
            type: "bi.label",
            invisible: true,
            text: BI.i18nText("BI-Click_Blank_To_Select"),
            cls: "single-select-toolbar",
            height: this.constants.height
        });

        this.loader = BI.createWidget({
            type: "bi.single_select_search_add_loader",
            keywordGetter: o.keywordGetter,
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator.apply(self, [op, function (res) {
                    callback(res);
                    self.setKeyword(o.keywordGetter());
                }]);
            }
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.resizer = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.tooltipClick,
                height: 0
            }, {
                el: this.loader
            }]
        });
        this.tooltipClick.setVisible(false);
    },

    setKeyword: function (keyword) {
        var btn;
        var isVisible = this.loader.getAllButtons().length > 0 && (btn = this.loader.getAllButtons()[0]) && (keyword === btn.getValue());
        if (isVisible !== this.tooltipClick.isVisible()) {
            this.tooltipClick.setVisible(isVisible);
            this.resizer.attr("items")[0].height = (isVisible ? this.constants.height : 0);
            this.resizer.resize();
        }
    },

    hasMatched: function () {
        return this.tooltipClick.isVisible();
    },

    setValue: function (v) {
        this.loader.setValue(v);
    },

    getValue: function () {
        return this.loader.getValue();
    },

    empty: function () {
        this.loader.empty();
    },

    populate: function (items) {
        this.loader.populate.apply(this.loader, arguments);
    }
});

BI.SingleSelectSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.single_select_search_add_pane", BI.SingleSelectSearchPane);/**
 *
 * @class BI.SingleSelectCombo
 * @extends BI.Single
 */
BI.SingleSelectCombo = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-combo",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 28
        });
    },

    _init: function () {
        BI.SingleSelectCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var assertShowValue = function () {
            BI.isKey(self._startValue) && (self.storeValue = self._startValue);
            self.trigger.getSearcher().setState(self.storeValue);
        };
        this.storeValue = "";
        // 标记正在请求数据
        this.requesting = false;

        this.trigger = BI.createWidget({
            type: "bi.single_select_add_trigger",
            height: o.height,
            // adapter: this.popup,
            masker: {
                offset: {
                    left: 1,
                    top: 1,
                    right: 2,
                    bottom: 33
                }
            },
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (res) {
                    if (op.times === 1 && BI.isNotNull(op.keywords)) {
                        // 预防trigger内部把当前的storeValue改掉
                        self.trigger.setValue(self.getValue());
                    }
                    callback.apply(self, arguments);
                });
            }
        });

        this.trigger.on(BI.SingleSelectTrigger.EVENT_START, function () {
            self._setStartValue("");
            this.getSearcher().setValue(self.storeValue);
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_STOP, function () {
            self._setStartValue("");
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_PAUSE, function () {
            if (this.getSearcher().hasMatched()) {
                var keyword = this.getSearcher().getKeyword();
                self._join({
                    type: BI.Selection.Multi,
                    value: [keyword]
                }, function () {
                    self.combo.setValue(self.storeValue);
                    self._setStartValue(keyword);
                    assertShowValue();
                    self.populate();
                    self._setStartValue("");
                });
            }
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_SEARCHING, function (keywords) {
            var last = BI.last(keywords);
            keywords = BI.initial(keywords || []);
            if (keywords.length > 0) {
                self._joinKeywords(keywords, function () {
                    if (BI.isEndWithBlank(last)) {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                        self.combo.populate();
                        self._setStartValue("");
                    } else {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                    }
                });
            }
        });

        this.trigger.on(BI.SingleSelectTrigger.EVENT_CHANGE, function (value, obj) {
            self.storeValue = this.getValue();
            assertShowValue();
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: "bi.single_select_popup_view",
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.SingleSelectPopupView.EVENT_CHANGE,
                    action: function () {
                        self.storeValue = this.getValue();
                        self._adjust(function () {
                            assertShowValue();
                        });
                    }
                }, {
                    eventName: BI.SingleSelectPopupView.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self._defaultState();
                    }
                }, {
                    eventName: BI.SingleSelectPopupView.EVENT_CLICK_CLEAR,
                    action: function () {
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: o.itemsCreator,
                valueFormatter: o.valueFormatter,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.combo.adjustWidth();
                        self.combo.adjustHeight();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            },
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            }
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            this.setValue(self.storeValue);
            BI.nextTick(function () {
                self.populate();
            });
        });
        // 当退出的时候如果还在处理请求，则等请求结束后再对外发确定事件
        this.wants2Quit = false;
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            // important:关闭弹出时又可能没有退出编辑状态
            self.trigger.stopEditing();
            if (self.requesting === true) {
                self.wants2Quit = true;
            } else {
                self.fireEvent(BI.SingleSelectCombo.EVENT_CONFIRM);
            }
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "single-select-trigger-icon-button"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    _assertValue: function (val) {
        val || (val = "");
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        this.requesting = true;
        o.itemsCreator({
            type: BI.SingleSelectCombo.REQ_GET_ALL_DATA,
            keywords: keywords
        }, function (ob) {
            var values = BI.map(ob.items, "value");
            digest(values);
        });

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value["remove"](val);
                }
            });
            self._adjust(callback);
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this.requesting = true;
        o.itemsCreator({
            type: BI.SingleSelectCombo.REQ_GET_ALL_DATA,
            keywords: [this.trigger.getKey()]
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                self._adjust(callback);
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            self._adjust(callback);
        });
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        if (!this._count) {
            o.itemsCreator({
                type: BI.SingleSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                self._count = res.count;
                adjust();
                callback();
            });
        } else {
            adjust();
            callback();

        }

        function adjust () {
            if (self.wants2Quit === true) {
                self.fireEvent(BI.SingleSelectCombo.EVENT_CONFIRM);
                self.wants2Quit = false;
            }
            self.requesting = false;
        }
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            self._adjust(callback);
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.popup.setStartValue(value);
    },

    setValue: function (v) {
        this.storeValue = v || "";
        this._assertValue(this.storeValue);
        this.combo.setValue(this.storeValue);
    },

    getValue: function () {
        return this.storeValue;
    },

    populate: function () {
        this._count = null;
        this.combo.populate.apply(this.combo, arguments);
    }
});

BI.extend(BI.SingleSelectCombo, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.SingleSelectCombo.EVENT_CONFIRM = "EVENT_CONFIRM";

BI.shortcut("bi.single_select_add_combo", BI.SingleSelectCombo);/**
 *
 * 单选下拉框
 * @class BI.SingleSelectTrigger
 * @extends BI.Trigger
 */

BI.SingleSelectTrigger = BI.inherit(BI.Trigger, {

    constants: {
        height: 14,
        rgap: 4,
        lgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-trigger bi-border",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            searcher: {},
            switcher: {},

            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.SingleSelectTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        if (o.height) {
            this.setHeight(o.height - 2);
        }

        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.single_select_add_searcher",
            height: o.height,
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            popup: {},
            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_START, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_START);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_PAUSE, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_PAUSE);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_SEARCHING, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_SEARCHING, arguments);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_STOP, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_STOP);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_CHANGE, arguments);
        });

        var wrapper = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [
                {
                    el: this.searcher,
                    width: "fill"
                }, {
                    el: BI.createWidget(),
                    width: 30
                }]
        });
    },

    getSearcher: function () {
        return this.searcher;
    },

    stopEditing: function () {
        this.searcher.stopSearch();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    setValue: function (v) {
        this.searcher.setValue(v);
    },

    getKey: function () {
        return this.searcher.getKey();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});

BI.SingleSelectTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.SingleSelectTrigger.EVENT_COUNTER_CLICK = "EVENT_COUNTER_CLICK";
BI.SingleSelectTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.SingleSelectTrigger.EVENT_START = "EVENT_START";
BI.SingleSelectTrigger.EVENT_STOP = "EVENT_STOP";
BI.SingleSelectTrigger.EVENT_PAUSE = "EVENT_PAUSE";
BI.SingleSelectTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.SingleSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW = "EVENT_BEFORE_COUNTER_POPUPVIEW";

BI.shortcut("bi.single_select_add_trigger", BI.SingleSelectTrigger);/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.SingleSelectSearcher
 * @extends Widget
 */
BI.SingleSelectSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-searcher",
            itemsCreator: BI.emptyFn,
            el: {},
            popup: {},
            valueFormatter: BI.emptyFn,
            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.SingleSelectSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.single_select_editor",
            height: o.height
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            element: this,
            height: o.height,
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            el: this.editor,

            popup: BI.extend({
                type: "bi.single_select_search_add_pane",
                valueFormatter: o.valueFormatter,
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    op.keyword = self.editor.getValue();
                    this.setKeyword(op.keyword);
                    o.itemsCreator(op, callback);
                }
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.SingleSelectSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.Searcher.EVENT_SEARCHING, function () {
            var keywords = this.getKeywords();
            self.fireEvent(BI.SingleSelectSearcher.EVENT_SEARCHING, keywords);
        });
    },

    adjustView: function () {
        this.searcher.adjustView();
    },

    isSearching: function () {
        return this.searcher.isSearching();
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    getKeyword: function () {
        return this.editor.getValue();
    },

    hasMatched: function () {
        return this.searcher.hasMatched();
    },

    hasChecked: function () {
        return this.searcher.getView() && this.searcher.getView().hasChecked();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    setState: function (v) {
        var o = this.options;
        v || (v = "");
        if (v === "") {
            this.editor.setState(BI.Selection.None);
        } else {
            this.editor.setState(o.valueFormatter(v + "") || (v + ""));
        }
    },

    setValue: function (ob) {
        this.setState(ob);
        this.searcher.setValue(ob);
    },

    getKey: function () {
        return this.editor.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function (items) {
        this.searcher.populate.apply(this.searcher, arguments);
    }
});

BI.SingleSelectSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.SingleSelectSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.SingleSelectSearcher.EVENT_START = "EVENT_START";
BI.SingleSelectSearcher.EVENT_STOP = "EVENT_STOP";
BI.SingleSelectSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.SingleSelectSearcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.shortcut("bi.single_select_add_searcher", BI.SingleSelectSearcher);/**
 * Created by User on 2017/11/16.
 */
BI.SignTextEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SignTextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-sign-initial-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: "",
            text: "",
            height: 24
        });
    },

    _init: function () {
        BI.SignTextEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "sign-editor-text",
            title: o.title,
            warningTitle: o.warningTitle,
            tipType: o.tipType,
            textAlign: "left",
            height: o.height,
            hgap: 4,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.selectAll();
            }
        });
        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SignTextEditor.EVENT_CLICK_LABEL);
            });
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.text,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self.fireEvent(BI.SignTextEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self._checkText();
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
        this._showHint();
        self._checkText();
    },

    _checkText: function () {
        var o = this.options;
        BI.nextTick(BI.bind(function () {
            if (this.editor.getValue() === "") {
                this.text.setValue(o.watermark || "");
                this.text.element.addClass("bi-water-mark");
            } else {
                var v = this.editor.getValue();
                v = (BI.isEmpty(v) || v == o.text) ? o.text : v + o.text;
                this.text.setValue(v);
                this.text.element.removeClass("bi-water-mark");
            }
        }, this));
    },

    _showInput: function () {
        this.editor.visible();
        this.text.invisible();
    },

    _showHint: function () {
        this.editor.invisible();
        this.text.visible();
    },

    setTitle: function (title) {
        this.text.setTitle(title);
    },

    setWarningTitle: function (title) {
        this.text.setWarningTitle(title);
    },

    focus: function () {
        this._showInput();
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
        this._showHint();
        this._checkText();
    },

    doRedMark: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setValue: function (v) {
        this.editor.setValue(v);
        this._checkText();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.text.getValue();
    },

    setState: function (v) {
        var o = this.options;
        this._showHint();
        v = (BI.isEmpty(v) || v == o.text) ? o.text : v + o.text;
        this.text.setValue(v);
    }
});
BI.SignTextEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SignTextEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.shortcut("bi.sign_text_editor", BI.SignTextEditor);/**
 * Created by zcf on 2016/9/22.
 */
BI.SliderIconButton = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SliderIconButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider-button"
        });
    },
    _init: function () {
        BI.extend(BI.SliderIconButton.superclass._init.apply(this, arguments));
        this.slider = BI.createWidget({
            type: "bi.icon_button",
            cls: "slider-icon slider-button",
            iconWidth: 14,
            iconHeight: 14,
            height: 14,
            width: 14
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.slider,
                top: 7,
                left: -7
            }],
            width: 0,
            height: 14
        });
    }
});
BI.shortcut("bi.single_slider_button", BI.SliderIconButton);/**
 * Created by zcf on 2016/9/22.
 */
BI.SingleSlider = BI.inherit(BI.Widget, {
    _constant: {
        EDITOR_WIDTH: 90,
        EDITOR_HEIGHT: 30,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },
    _defaultConfig: function () {
        return BI.extend(BI.SingleSlider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider bi-slider-track",
            digit: false,
            unit: ""
        });
    },
    _init: function () {
        BI.SingleSlider.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        var c = this._constant;
        this.enable = false;
        this.value = "";

        this.grayTrack = BI.createWidget({
            type: "bi.layout",
            cls: "gray-track",
            height: 6
        });
        this.blueTrack = BI.createWidget({
            type: "bi.layout",
            cls: "blue-track bi-high-light-background",
            height: 6
        });
        this.track = this._createTrackWrapper();

        this.slider = BI.createWidget({
            type: "bi.single_slider_button"
        });
        this._draggable(this.slider);
        var sliderVertical = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.absolute",
                items: [this.slider]
            }],
            hgap: c.SLIDER_WIDTH_HALF,
            height: c.SLIDER_HEIGHT
        });
        sliderVertical.element.click(function (e) {
            if (self.enable) {
                var offset = e.clientX - self.element.offset().left - c.SLIDER_WIDTH_HALF;
                var trackLength = self.track.element[0].scrollWidth;
                var percent = 0;
                if (offset < 0) {
                    percent = 0;
                }
                if (offset > 0 && offset < (trackLength - c.SLIDER_WIDTH)) {
                    percent = offset * 100 / self._getGrayTrackLength();
                }
                if (offset > (trackLength - c.SLIDER_WIDTH)) {
                    percent = 100;
                }
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setAllPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                v = o.digit === false ? v : v.toFixed(o.digit);
                self.label.setValue(v);
                self.value = v;
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });
        this.label = BI.createWidget({
            type: "bi.sign_text_editor",
            cls: "slider-editor-button",
            errorText: "",
            text: o.unit,
            width: c.EDITOR_WIDTH - 2,
            allowBlank: false,
            validationChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.label.element.hover(function () {
            self.label.element.removeClass("bi-border").addClass("bi-border");
        }, function () {
            self.label.element.removeClass("bi-border");
        });
        this.label.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var v = BI.parseFloat(this.getValue());
            var percent = self._getPercentByValue(v);
            var significantPercent = BI.parseFloat(percent.toFixed(1));
            self._setAllPosition(significantPercent);
            this.setValue(v);
            self.value = v;
            self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
        });
        this._setVisible(false);
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.track,
                            width: "100%",
                            height: c.TRACK_HEIGHT
                        }]
                    }],
                    hgap: 7,
                    height: c.TRACK_HEIGHT
                },
                top: 23,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 20,
                left: 0,
                width: "100%"
            }, {
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [this.label]
                    }],
                    rgap: c.EDITOR_WIDTH,
                    height: c.EDITOR_HEIGHT
                },
                top: 0,
                left: 0,
                width: "100%"
            }]
        });
    },

    _draggable: function (widget) {
        var self = this, o = this.options;
        var startDrag = false;
        var size = 0, offset = 0, defaultSize = 0;
        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX) {
            if (mouseMoveTracker.isDragging()) {
                startDrag = true;
                offset += deltaX;
                size = optimizeSize(defaultSize + offset);
                widget.element.addClass("dragging");
                var percent = size * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));// 直接对计算出来的百分数保留到小数点后一位，相当于分成了1000份。
                self._setBlueTrack(significantPercent);
                self._setLabelPosition(significantPercent);
                self._setSliderPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                v = o.digit === false ? v : v.toFixed(o.digit);
                self.label.setValue(v);
                self.value = v;
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        }, function () {
            if (startDrag === true) {
                size = optimizeSize(size);
                var percent = size * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                size = 0;
                offset = 0;
                defaultSize = size;
                startDrag = false;
            }
            widget.element.removeClass("dragging");
            mouseMoveTracker.releaseMouseMoves();
            self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
        }, window);
        widget.element.on("mousedown", function (event) {
            if(!widget.isEnabled()) {
                return;
            }
            defaultSize = this.offsetLeft;
            optimizeSize(defaultSize);
            mouseMoveTracker.captureMouseMoves(event);
        });

        function optimizeSize (s) {
            return BI.clamp(s, 0, self._getGrayTrackLength());
        }
    },

    _createTrackWrapper: function () {
        return BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.grayTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }, {
                            el: this.blueTrack,
                            top: 0,
                            left: 0,
                            width: "0%"
                        }]
                    }],
                    hgap: 8,
                    height: 8
                },
                top: 8,
                left: 0,
                width: "100%"
            }]
        });
    },

    _checkValidation: function (v) {
        var o = this.options;
        var valid = false;
        if (BI.isNumeric(v) && !(BI.isNull(v) || v < this.min || v > this.max)) {
            if(o.digit === false) {
                valid = true;
            }else{
                var dotText = (v + "").split(".")[1] || "";
                valid = (dotText.length === o.digit);
            }
        }
        return valid;
    },

    _setBlueTrack: function (percent) {
        this.blueTrack.element.css({width: percent + "%"});
    },

    _setLabelPosition: function (percent) {
        this.label.element.css({left: percent + "%"});
    },

    _setSliderPosition: function (percent) {
        this.slider.element.css({left: percent + "%"});
    },

    _setAllPosition: function (percent) {
        this._setSliderPosition(percent);
        this._setLabelPosition(percent);
        this._setBlueTrack(percent);
    },

    _setVisible: function (visible) {
        this.slider.setVisible(visible);
        this.label.setVisible(visible);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth;
    },

    _getValueByPercent: function (percent) {
        var thousandth = BI.parseInt(percent * 10);
        return (((this.max - this.min) * thousandth) / 1000 + this.min);
    },

    _getPercentByValue: function (v) {
        return (v - this.min) * 100 / (this.max - this.min);
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (v) {
        var o = this.options;
        v = BI.parseFloat(v);
        v = o.digit === false ? v : v.toFixed(o.digit);
        if ((!isNaN(v))) {
            if (this._checkValidation(v)) {
                this.value = v;
            }
            if (v > this.max) {
                this.value = this.max;
            }
            if (v < this.min) {
                this.value = this.min;
            }
        }
    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber > minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.value = "";
        this.min = 0;
        this.max = 0;
        this._setBlueTrack(0);

    },

    populate: function () {
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this._setVisible(true);
            this.enable = true;
            this.label.setErrorText(BI.i18nText("BI-Please_Enter") + this.min + "-" + this.max + BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Basic_Number"));
            if (BI.isNumeric(this.value) || BI.isNotEmptyString(this.value)) {
                this.label.setValue(this.value);
                this._setAllPosition(this._getPercentByValue(this.value));
            } else {
                this.label.setValue(this.max);
                this._setAllPosition(100);
            }
        }
    }
});
BI.SingleSlider.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_slider", BI.SingleSlider);/**
 * Created by Urthur on 2017/9/12.
 */
BI.SingleSliderLabel = BI.inherit(BI.Widget, {
    _constant: {
        EDITOR_WIDTH: 90,
        EDITOR_HEIGHT: 20,
        HEIGHT: 20,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },
    _defaultConfig: function () {
        return BI.extend(BI.SingleSliderLabel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider-label bi-slider-track",
            digit: false,
            unit: ""
        });
    },
    _init: function () {
        BI.SingleSliderLabel.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        var c = this._constant;
        this.enable = false;
        this.value = "";

        this.grayTrack = BI.createWidget({
            type: "bi.layout",
            cls: "gray-track",
            height: 6
        });
        this.blueTrack = BI.createWidget({
            type: "bi.layout",
            cls: "blue-track bi-high-light-background",
            height: 6
        });
        this.track = this._createTrackWrapper();

        this.slider = BI.createWidget({
            type: "bi.single_slider_button"
        });
        this._draggable(this.slider);
        var sliderVertical = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.absolute",
                items: [this.slider]
            }],
            hgap: c.SLIDER_WIDTH_HALF,
            height: c.SLIDER_HEIGHT
        });
        sliderVertical.element.click(function (e) {
            if (self.enable) {
                var offset = e.clientX - self.element.offset().left - c.SLIDER_WIDTH_HALF;
                var trackLength = self.track.element[0].scrollWidth;
                var percent = 0;
                if (offset < 0) {
                    percent = 0;
                }
                if (offset > 0 && offset < (trackLength - c.SLIDER_WIDTH)) {
                    percent = offset * 100 / self._getGrayTrackLength();
                }
                if (offset > (trackLength - c.SLIDER_WIDTH)) {
                    percent = 100;
                }
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setAllPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                v = o.digit === false ? v : v.toFixed(o.digit);
                self.label.setText(v + o.unit);
                self.value = v;
                self.fireEvent(BI.SingleSliderLabel.EVENT_CHANGE);
            }
        });
        this.label = BI.createWidget({
            type: "bi.label",
            height: c.HEIGHT,
            width: c.EDITOR_WIDTH - 2
        });

        this._setVisible(false);
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.track,
                            width: "100%",
                            height: c.TRACK_HEIGHT
                        }]
                    }],
                    hgap: 7,
                    height: c.TRACK_HEIGHT
                },
                top: 13,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 10,
                left: 0,
                width: "100%"
            }, {
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [this.label]
                    }],
                    rgap: c.EDITOR_WIDTH,
                    height: c.EDITOR_HEIGHT
                },
                top: 0,
                left: 0,
                width: "100%"
            }]
        });
    },

    _draggable: function (widget) {
        var self = this, o = this.options;
        var startDrag = false;
        var size = 0, offset = 0, defaultSize = 0;
        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX) {
            if (mouseMoveTracker.isDragging()) {
                startDrag = true;
                offset += deltaX;
                size = optimizeSize(defaultSize + offset);
                widget.element.addClass("dragging");
                var percent = size * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));// 直接对计算出来的百分数保留到小数点后一位，相当于分成了1000份。
                self._setBlueTrack(significantPercent);
                self._setLabelPosition(significantPercent);
                self._setSliderPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                v = o.digit === false ? v : v.toFixed(o.digit);
                self.label.setValue(v);
                self.value = v;
                self.fireEvent(BI.SingleSliderLabel.EVENT_CHANGE);
            }
        }, function () {
            if (startDrag === true) {
                size = optimizeSize(size);
                var percent = size * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                size = 0;
                offset = 0;
                defaultSize = size;
                startDrag = false;
            }
            widget.element.removeClass("dragging");
            mouseMoveTracker.releaseMouseMoves();
            self.fireEvent(BI.SingleSliderLabel.EVENT_CHANGE);
        }, window);
        widget.element.on("mousedown", function (event) {
            if(!widget.isEnabled()) {
                return;
            }
            defaultSize = this.offsetLeft;
            optimizeSize(defaultSize);
            mouseMoveTracker.captureMouseMoves(event);
        });

        function optimizeSize (s) {
            return BI.clamp(s, 0, self._getGrayTrackLength());
        }
    },

    _createTrackWrapper: function () {
        return BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.grayTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }, {
                            el: this.blueTrack,
                            top: 0,
                            left: 0,
                            width: "0%"
                        }]
                    }],
                    hgap: 8,
                    height: 8
                },
                top: 8,
                left: 0,
                width: "100%"
            }]
        });
    },

    _checkValidation: function (v) {
        return BI.isNumeric(v) && !(BI.isNull(v) || v < this.min || v > this.max);
    },

    _setBlueTrack: function (percent) {
        this.blueTrack.element.css({width: percent + "%"});
    },

    _setLabelPosition: function (percent) {
        this.label.element.css({left: percent + "%"});
    },

    _setSliderPosition: function (percent) {
        this.slider.element.css({left: percent + "%"});
    },

    _setAllPosition: function (percent) {
        this._setSliderPosition(percent);
        this._setLabelPosition(percent);
        this._setBlueTrack(percent);
    },

    _setVisible: function (visible) {
        this.slider.setVisible(visible);
        this.label.setVisible(visible);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth;
    },

    _getValueByPercent: function (percent) {
        var thousandth = BI.parseInt(percent * 10);
        return (((this.max - this.min) * thousandth) / 1000 + this.min);
    },

    _getPercentByValue: function (v) {
        return (v - this.min) * 100 / (this.max - this.min);
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (v) {
        var o = this.options;
        v = BI.parseFloat(v);
        v = o.digit === false ? v : v.toFixed(o.digit);
        if ((!isNaN(v))) {
            if (this._checkValidation(v)) {
                this.value = v;
            }
            if (v > this.max) {
                this.value = this.max;
            }
            if (v < this.min) {
                this.value = this.min;
            }
        }
    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber > minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.value = "";
        this.min = 0;
        this.max = 0;
        this._setBlueTrack(0);
    },

    populate: function () {
        var o = this.options;
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this._setVisible(true);
            this.enable = true;
            if (BI.isNumeric(this.value) || BI.isNotEmptyString(this.value)) {
                this.label.setValue(this.value + o.unit);
                this._setAllPosition(this._getPercentByValue(this.value));
            } else {
                this.label.setValue(this.max + o.unit);
                this._setAllPosition(100);
            }
        }
    }
});
BI.SingleSliderLabel.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_slider_label", BI.SingleSliderLabel);/**
 * normal single slider
 * Created by Young on 2017/6/21.
 */
BI.SingleSliderNormal = BI.inherit(BI.Widget, {

    _constant: {
        HEIGHT: 28,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },

    props: {
        baseCls: "bi-single-slider-normal bi-slider-track",
        minMax: {
            min: 0,
            max: 100
        }
        // color: "#3f8ce8"
    },

    render: function () {
        var self = this;
        var c = this._constant;
        var track = this._createTrack();
        this.slider = BI.createWidget({
            type: "bi.single_slider_button"
        });
        this._draggable(this.slider);

        var sliderVertical = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.absolute",
                items: [this.slider]
            }],
            hgap: c.SLIDER_WIDTH_HALF,
            height: c.SLIDER_HEIGHT
        });
        sliderVertical.element.click(function (e) {
            if (self.enable) {
                var offset = e.clientX - self.element.offset().left - c.SLIDER_WIDTH_HALF;
                var trackLength = self.track.element[0].scrollWidth;
                var percent = 0;
                if (offset < 0) {
                    percent = 0;
                }
                if (offset > 0 && offset < (trackLength - c.SLIDER_WIDTH)) {
                    percent = offset * 100 / self._getGrayTrackLength();
                }
                if (offset > (trackLength - c.SLIDER_WIDTH)) {
                    percent = 100;
                }
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setAllPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.value = v;
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });

        return {
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: track,
                            width: "100%",
                            height: c.TRACK_HEIGHT
                        }]
                    }],
                    hgap: 7,
                    height: c.TRACK_HEIGHT
                },
                top: 3,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 0,
                left: 0,
                width: "100%"
            }]
        };
    },

    _draggable: function (widget) {
        var self = this, o = this.options;
        var startDrag = false;
        var size = 0, offset = 0, defaultSize = 0;
        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX) {
            if (mouseMoveTracker.isDragging()) {
                startDrag = true;
                offset += deltaX;
                size = optimizeSize(defaultSize + offset);
                widget.element.addClass("dragging");
                var percent = size * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));// 直接对计算出来的百分数保留到小数点后一位，相当于分成了1000份。
                self._setBlueTrack(significantPercent);
                self._setSliderPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                v = o.digit === false ? v : v.toFixed(o.digit);
                self.value = v;
                self.fireEvent(BI.SingleSliderNormal.EVENT_DRAG, v);
            }
        }, function () {
            if (startDrag === true) {
                size = optimizeSize(size);
                var percent = size * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                size = 0;
                offset = 0;
                defaultSize = size;
                startDrag = false;
            }
            widget.element.removeClass("dragging");
            mouseMoveTracker.releaseMouseMoves();
            self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
        }, window);
        widget.element.on("mousedown", function (event) {
            if(!widget.isEnabled()) {
                return;
            }
            defaultSize = this.offsetLeft;
            optimizeSize(defaultSize);
            mouseMoveTracker.captureMouseMoves(event);
        });

        function optimizeSize (s) {
            return BI.clamp(s, 0, self._getGrayTrackLength());
        }
    },

    _createTrack: function () {
        var self = this;
        var c = this._constant;
        this.grayTrack = BI.createWidget({
            type: "bi.layout",
            cls: "gray-track",
            height: 6
        });
        this.blueTrack = BI.createWidget({
            type: "bi.layout",
            cls: "blue-track bi-high-light-background",
            height: 6
        });
        if (this.options.color) {
            this.blueTrack.element.css({"background-color": this.options.color});
        }

        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.grayTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }, {
                            el: this.blueTrack,
                            top: 0,
                            left: 0,
                            width: "0%"
                        }]
                    }],
                    hgap: 8,
                    height: 8
                },
                top: 8,
                left: 0,
                width: "100%"
            }],
            ref: function (ref) {
                self.track = ref;
            }
        };
    },

    _checkValidation: function (v) {
        return !(BI.isNull(v) || v < this.min || v > this.max);
    },

    _setBlueTrack: function (percent) {
        this.blueTrack.element.css({width: percent + "%"});
    },

    _setSliderPosition: function (percent) {
        this.slider.element.css({left: percent + "%"});
    },

    _setAllPosition: function (percent) {
        this._setSliderPosition(percent);
        this._setBlueTrack(percent);
    },

    _setVisible: function (visible) {
        this.slider.setVisible(visible);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth;
    },

    _getValueByPercent: function (percent) {
        var thousandth = BI.parseInt(percent * 10);
        return (((this.max - this.min) * thousandth) / 1000 + this.min);
    },

    _getPercentByValue: function (v) {
        return (v - this.min) * 100 / (this.max - this.min);
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (v) {
        var value = BI.parseFloat(v);
        if ((!isNaN(value))) {
            if (this._checkValidation(value)) {
                this.value = value;
            }
            if (value > this.max) {
                this.value = this.max;
            }
            if (value < this.min) {
                this.value = this.min;
            }
        }
    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber > minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.value = "";
        this.min = 0;
        this.max = 0;
        this._setBlueTrack(0);
    },

    populate: function () {
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this._setVisible(true);
            this.enable = true;
            if (BI.isNumeric(this.value) || BI.isNotEmptyString(this.value)) {
                this._setAllPosition(this._getPercentByValue(this.value));
            } else {
                this._setAllPosition(100);
            }
        }
    }
});
BI.SingleSliderNormal.EVENT_DRAG = "EVENT_DRAG";
BI.shortcut("bi.single_slider_normal", BI.SingleSliderNormal);/**
 * @class BI.SingleTreeCombo
 * @extends BI.Widget
 */
BI.SingleTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-tree-combo",
            trigger: {},
            height: 24,
            text: "",
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.SingleTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget(BI.extend({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items,
            value: o.value
        }, o.trigger));

        this.popup = BI.createWidget({
            type: "bi.single_level_tree",
            items: o.items,
            value: o.value
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.SingleTreeCombo.EVENT_BEFORE_POPUPVIEW, arguments);
        });

        this.popup.on(BI.SingleTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.SingleTreeCombo.EVENT_CHANGE);
        });
    },

    populate: function (items) {
        this.combo.populate(items);
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});

BI.SingleTreeCombo.EVENT_CHANGE = "SingleTreeCombo.EVENT_CHANGE";
BI.SingleTreeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.single_tree_combo", BI.SingleTreeCombo);/**
 * @class BI.SingleTreePopup
 * @extends BI.Pane
 */

BI.SingleTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-level-tree",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.SingleTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        
        this.tree = BI.createWidget({
            type: "bi.level_tree",
            expander: {
                isDefaultInit: true
            },
            items: o.items,
            value: o.value,
            chooseType: BI.Selection.Single
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.SingleTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.SingleTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_level_tree", BI.SingleTreePopup);/**
 * @class BI.SingleTreeTrigger
 * @extends BI.Trigger
 */

BI.SingleTreeTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleTreeTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-tree-trigger",
            height: 24,
            text: "",
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.SingleTreeTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            element: this,
            text: o.text,
            items: o.items,
            height: o.height,
            value: o.value
        });
    },

    _checkTitle: function () {
        var self = this, val = this.getValue();
        BI.any(this.options.items, function (i, item) {
            if (val.contains(item.value)) {
                self.trigger.setTitle(item.text || item.value);
                return true;
            }
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.options.value = v;
        this.trigger.setValue(v);
        this._checkTitle();
    },

    getValue: function () {
        return this.options.value || [];
    },

    populate: function (items) {
        BI.SingleTreeTrigger.superclass.populate.apply(this, arguments);
        this.trigger.populate(items);
    }

});

BI.shortcut("bi.single_tree_trigger", BI.SingleTreeTrigger);/**
 * 可以单选多选切换的树
 *
 * Created by GUY on 2015/12/21.
 * @class BI.SwitchTree
 * @extends BI.Widget
 */
BI.SwitchTree = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SwitchTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-switch-tree",
            items: []
        });
    },

    _init: function () {
        BI.SwitchTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tab = BI.createWidget({
            type: "bi.tab",
            element: this,
            tab: null,
            showIndex: BI.SwitchTree.SelectType.SingleSelect,
            cardCreator: BI.bind(this._createTree, this)
        });
    },

    _createTree: function (type) {
        var self = this, o = this.options;
        switch (type) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.levelTree = BI.createWidget({
                    type: "bi.multilayer_single_level_tree",
                    isDefaultInit: true,
                    items: BI.deepClone(o.items),
                    value: o.value
                });
                this.levelTree.on(BI.LevelTree.EVENT_CHANGE, function () {
                    self.fireEvent(BI.SwitchTree.EVENT_CHANGE, arguments);
                });
                return this.levelTree;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.tree = BI.createWidget({
                    type: "bi.simple_tree",
                    items: this._removeIsParent(BI.deepClone(o.items)),
                    value: o.value
                });
                this.tree.on(BI.SimpleTreeView.EVENT_CHANGE, function () {
                    self.fireEvent(BI.SwitchTree.EVENT_CHANGE, arguments);
                });
                return this.tree;
        }
    },

    _removeIsParent: function (items) {
        BI.each(items, function (i, item) {
            BI.isNotNull(item.isParent) && delete item.isParent;
        });
        return items;
    },

    switchSelect: function () {
        switch (this.getSelect()) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.setSelect(BI.SwitchTree.SelectType.MultiSelect);
                break;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.setSelect(BI.SwitchTree.SelectType.SingleSelect);
                break;
        }
    },

    setSelect: function (v) {
        this.tab.setSelect(v);
    },

    getSelect: function () {
        return this.tab.getSelect();
    },

    setValue: function (v) {
        this.storeValue = v;
        switch (this.getSelect()) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.levelTree.setValue(v);
                break;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.tree.setValue(v);
                break;
        }
    },

    getValue: function () {
        return this.tab.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        if (BI.isNotNull(this.levelTree)) {
            this.levelTree.populate(BI.deepClone(items));
        }
        if (BI.isNotNull(this.tree)) {
            this.tree.populate(this._removeIsParent(BI.deepClone(items)));
        }
    }
});
BI.SwitchTree.EVENT_CHANGE = "SwitchTree.EVENT_CHANGE";
BI.SwitchTree.SelectType = {
    SingleSelect: BI.Selection.Single,
    MultiSelect: BI.Selection.Multi
};
BI.shortcut("bi.switch_tree", BI.SwitchTree);
/**
 * Created by Baron on 2015/10/19.
 */
BI.DateInterval = BI.inherit(BI.Single, {
    constants: {
        height: 25,
        width: 25,
        lgap: 15,
        offset: -15,
        timeErrorCls: "time-error",
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },
    _defaultConfig: function () {
        var conf = BI.DateInterval.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-date-interval"
        });
    },
    _init: function () {
        var self = this, o = this.options;
        BI.DateInterval.superclass._init.apply(this, arguments);

        o.value = o.value || {};
        this.left = this._createCombo(o.value.start);
        this.right = this._createCombo(o.value.end);
        this.label = BI.createWidget({
            type: "bi.label",
            height: this.constants.height,
            width: this.constants.width,
            text: "-"
        });
        BI.createWidget({
            element: self,
            type: "bi.center",
            hgap: 15,
            height: this.constants.height,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: self.left,
                    left: this.constants.offset,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            }, {
                type: "bi.absolute",
                items: [{
                    el: self.right,
                    left: 0,
                    right: this.constants.offset,
                    top: 0,
                    bottom: 0
                }]
            }]
        });
        BI.createWidget({
            type: "bi.horizontal_auto",
            element: this,
            items: [
                self.label
            ]
        });
    },

    _createCombo: function (v) {
        var self = this;
        var combo = BI.createWidget({
            type: "bi.dynamic_date_combo",
            value: v
        });
        combo.on(BI.DynamicDateCombo.EVENT_ERROR, function () {
            self._clearTitle();
            self.element.removeClass(self.constants.timeErrorCls);
            self.fireEvent(BI.DateInterval.EVENT_ERROR);
        });

        combo.on(BI.DynamicDateCombo.EVENT_VALID, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.DateInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.DynamicDateCombo.EVENT_FOCUS, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.DateInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.left.hidePopupView();
            self.right.hidePopupView();
        });

        combo.on(BI.DynamicDateCombo.EVENT_CONFIRM, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                self.fireEvent(BI.DateInterval.EVENT_ERROR);
            }else{
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
                self.fireEvent(BI.DateInterval.EVENT_CHANGE);
            }
        });
        return combo;
    },
    _dateCheck: function (date) {
        return BI.parseDateTime(date, "%Y-%x-%d").print("%Y-%x-%d") === date ||
            BI.parseDateTime(date, "%Y-%X-%d").print("%Y-%X-%d") === date ||
            BI.parseDateTime(date, "%Y-%x-%e").print("%Y-%x-%e") === date ||
            BI.parseDateTime(date, "%Y-%X-%e").print("%Y-%X-%e") === date;
    },
    _checkVoid: function (obj) {
        return !BI.checkDateVoid(obj.year, obj.month, obj.day, this.constants.DATE_MIN_VALUE, this.constants.DATE_MAX_VALUE)[0];
    },
    _check: function (smallDate, bigDate) {
        var smallObj = smallDate.match(/\d+/g), bigObj = bigDate.match(/\d+/g);
        return this._dateCheck(smallDate) && BI.checkDateLegal(smallDate) && this._checkVoid({
            year: smallObj[0],
            month: smallObj[1],
            day: smallObj[2]
        }) && this._dateCheck(bigDate) && BI.checkDateLegal(bigDate) && this._checkVoid({
            year: bigObj[0],
            month: bigObj[1],
            day: bigObj[2]
        });
    },
    _compare: function (smallDate, bigDate) {
        smallDate = BI.parseDateTime(smallDate, "%Y-%X-%d").print("%Y-%X-%d");
        bigDate = BI.parseDateTime(bigDate, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.isNotNull(smallDate) && BI.isNotNull(bigDate) && smallDate > bigDate;
    },
    _setTitle: function (v) {
        this.left.setTitle(v);
        this.right.setTitle(v);
        this.label.setTitle(v);
    },
    _clearTitle: function () {
        this.left.setTitle("");
        this.right.setTitle("");
        this.label.setTitle("");
    },
    setValue: function (date) {
        date = date || {};
        this.left.setValue(date.start);
        this.right.setValue(date.end);
    },
    getValue: function () {
        return {start: this.left.getValue(), end: this.right.getValue()};
    }
});
BI.DateInterval.EVENT_VALID = "EVENT_VALID";
BI.DateInterval.EVENT_ERROR = "EVENT_ERROR";
BI.DateInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.date_interval", BI.DateInterval);/**
 * Created by Baron on 2015/10/19.
 */
BI.TimeInterval = BI.inherit(BI.Single, {
    constants: {
        height: 25,
        width: 25,
        lgap: 15,
        offset: -15,
        timeErrorCls: "time-error",
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },
    _defaultConfig: function () {
        var conf = BI.TimeInterval.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-time-interval"
        });
    },
    _init: function () {
        var self = this, o = this.options;
        BI.TimeInterval.superclass._init.apply(this, arguments);

        o.value = o.value || {};
        this.left = this._createCombo(o.value.start);
        this.right = this._createCombo(o.value.end);
        this.label = BI.createWidget({
            type: "bi.label",
            height: this.constants.height,
            width: this.constants.width,
            text: "-"
        });
        BI.createWidget({
            element: self,
            type: "bi.center",
            hgap: 15,
            height: this.constants.height,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: self.left,
                    left: this.constants.offset,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            }, {
                type: "bi.absolute",
                items: [{
                    el: self.right,
                    left: 0,
                    right: this.constants.offset,
                    top: 0,
                    bottom: 0
                }]
            }]
        });
        BI.createWidget({
            type: "bi.horizontal_auto",
            element: this,
            items: [
                self.label
            ]
        });
    },

    _createCombo: function (v) {
        var self = this;
        var combo = BI.createWidget({
            type: "bi.dynamic_date_time_combo",
            value: v
        });
        combo.on(BI.DynamicDateTimeCombo.EVENT_ERROR, function () {
            self._clearTitle();
            self.element.removeClass(self.constants.timeErrorCls);
            self.fireEvent(BI.TimeInterval.EVENT_ERROR);
        });

        combo.on(BI.DynamicDateTimeCombo.EVENT_VALID, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.TimeInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.DynamicDateTimeCombo.EVENT_FOCUS, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.TimeInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.DynamicDateTimeCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.left.hidePopupView();
            self.right.hidePopupView();
        });
        // combo.on(BI.DynamicDateTimeCombo.EVENT_CHANGE, function () {
        //    BI.Bubbles.hide("error");
        //    var smallDate = self.left.getKey(), bigDate = self.right.getKey();
        //    if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
        //        self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
        //        self.element.addClass(self.constants.timeErrorCls);
        //        BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
        //            offsetStyle: "center"
        //        });
        //        self.fireEvent(BI.TimeInterval.EVENT_ERROR);
        //    } else {
        //        self._clearTitle();
        //        self.element.removeClass(self.constants.timeErrorCls);
        //    }
        // });

        combo.on(BI.DynamicDateTimeCombo.EVENT_CONFIRM, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                self.fireEvent(BI.TimeInterval.EVENT_ERROR);
            }else{
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
                self.fireEvent(BI.TimeInterval.EVENT_CHANGE);
            }
        });
        return combo;
    },
    _dateCheck: function (date) {
        return BI.parseDateTime(date, "%Y-%x-%d %H:%M:%S").print("%Y-%x-%d %H:%M:%S") === date ||
            BI.parseDateTime(date, "%Y-%X-%d %H:%M:%S").print("%Y-%X-%d %H:%M:%S") === date ||
            BI.parseDateTime(date, "%Y-%x-%e %H:%M:%S").print("%Y-%x-%e %H:%M:%S") === date ||
            BI.parseDateTime(date, "%Y-%X-%e %H:%M:%S").print("%Y-%X-%e %H:%M:%S") === date;
    },
    _checkVoid: function (obj) {
        return !BI.checkDateVoid(obj.year, obj.month, obj.day, this.constants.DATE_MIN_VALUE, this.constants.DATE_MAX_VALUE)[0];
    },
    _check: function (smallDate, bigDate) {
        var smallObj = smallDate.match(/\d+/g), bigObj = bigDate.match(/\d+/g);
        return this._dateCheck(smallDate) && BI.checkDateLegal(smallDate) && this._checkVoid({
            year: smallObj[0],
            month: smallObj[1],
            day: smallObj[2]
        }) && this._dateCheck(bigDate) && BI.checkDateLegal(bigDate) && this._checkVoid({
            year: bigObj[0],
            month: bigObj[1],
            day: bigObj[2]
        });
    },
    _compare: function (smallDate, bigDate) {
        smallDate = BI.parseDateTime(smallDate, "%Y-%X-%d %H:%M:%S").print("%Y-%X-%d %H:%M:%S");
        bigDate = BI.parseDateTime(bigDate, "%Y-%X-%d %H:%M:%S").print("%Y-%X-%d %H:%M:%S");
        return BI.isNotNull(smallDate) && BI.isNotNull(bigDate) && smallDate > bigDate;
    },
    _setTitle: function (v) {
        this.left.setTitle(v);
        this.right.setTitle(v);
        this.label.setTitle(v);
    },
    _clearTitle: function () {
        this.left.setTitle("");
        this.right.setTitle("");
        this.label.setTitle("");
    },
    setValue: function (date) {
        date = date || {};
        this.left.setValue(date.start);
        this.right.setValue(date.end);
    },
    getValue: function () {
        return {start: this.left.getValue(), end: this.right.getValue()};
    }
});
BI.TimeInterval.EVENT_VALID = "EVENT_VALID";
BI.TimeInterval.EVENT_ERROR = "EVENT_ERROR";
BI.TimeInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.time_interval", BI.TimeInterval);/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.YearCard
 * @extends BI.Trigger
 */
BI.DynamicYearCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-card"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
                textAlign: "left",
                height: 24
            }, {
                type: "bi.dynamic_date_param_item",
                ref: function () {
                    self.item = this;
                },
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }],
            vgap: 10,
            hgap: 10
        };
    },

    _createValue: function (type, v) {
        return {
            dateType: type,
            value: Math.abs(v),
            offset: v > 0 ? 1 : 0
        };
    },

    setValue: function (v) {
        v = v || {year: 0};
        this.item.setValue(this._createValue(BI.DynamicDateCard.TYPE.YEAR, v.year));
    },

    getValue: function () {
        var value = this.item.getValue();
        return {
            year: (value.offset === 0 ? -value.value : value.value)
        };
    }
});
BI.DynamicYearCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_card", BI.DynamicYearCard);/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.StaticYearCard
 * @extends BI.Trigger
 */
BI.StaticYearCard = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.StaticYearCard.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-card",
            behaviors: {},
            min: "1900-01-01", // 最小日期
            max: "2099-12-31" // 最大日期
        });
    },

    _createYearCalendar: function (v) {
        var o = this.options, y = this._year;

        var calendar = BI.createWidget({
            type: "bi.year_calendar",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max,
            logic: {
                dynamic: true
            },
            year: y + v * 12
        });
        calendar.setValue(this._year);
        return calendar;
    },

    _init: function () {
        BI.StaticYearCard.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.selectedYear = this._year = BI.getDate().getFullYear();

        this.backBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 25,
            height: 25,
            value: -1,
            listeners: [{
                eventName: BI.IconButton.EVENT_CHANGE,
                action: function () {
                    self.navigation.setSelect(self.navigation.getSelect() - 1);
                    self._checkLeftValid();
                    self._checkRightValid();
                }
            }]
        });

        this.preBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 25,
            height: 25,
            value: 1,
            listeners: [{
                eventName: BI.IconButton.EVENT_CHANGE,
                action: function () {
                    self.navigation.setSelect(self.navigation.getSelect() + 1);
                    self._checkLeftValid();
                    self._checkRightValid();
                }
            }]
        });

        this.navigation = BI.createWidget({
            type: "bi.navigation",
            direction: "top",
            element: this,
            single: true,
            logic: {
                dynamic: true
            },
            tab: {
                type: "bi.htape",
                cls: "bi-border-top bi-border-bottom",
                height: 30,
                items: [{
                    el: {
                        type: "bi.center_adapt",
                        items: [self.backBtn]
                    },
                    width: 25
                }, {
                    type: "bi.layout"
                }, {
                    el: {
                        type: "bi.center_adapt",
                        items: [self.preBtn]
                    },
                    width: 25
                }]
            },
            cardCreator: BI.bind(this._createYearCalendar, this),

            afterCardShow: function () {
                this.setValue(self.selectedYear);
                var calendar = this.getSelectedCard();
                self.backBtn.setEnable(!calendar.isFrontYear());
                self.preBtn.setEnable(!calendar.isFinalYear());
            }
        });

        this.navigation.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedYear = this.getValue();
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            self.fireEvent(BI.StaticYearCard.EVENT_CHANGE, self.selectedYear);
        });

        if(BI.isKey(o.value)){
            this.setValue(o.value);
        }
    },

    _checkLeftValid: function () {
        var o = this.options;
        var valid = true;
        this.backBtn.setEnable(valid);
        return valid;
    },

    _checkRightValid: function () {
        var o = this.options;
        var valid = true;
        this.preBtn.setEnable(valid);
        return valid;
    },

    getValue: function () {
        return {
            year: this.selectedYear
        };
    },

    setValue: function (obj) {
        var o = this.options;
        obj = obj || {};
        var v = obj.year;
        if (BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]) {
            v = BI.getDate().getFullYear();
            this.selectedYear = "";
            this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
            this.navigation.setValue("");
        } else {
            this.selectedYear = BI.parseInt(v);
            this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
            this.navigation.setValue(this.selectedYear);
        }
        this._checkLeftValid();
        this._checkRightValid();
    }
});
BI.StaticYearCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_year_card", BI.StaticYearCard);BI.DynamicYearCombo = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-combo bi-border",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicYearCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = o.value;
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_trigger",
            min: o.min,
            max: o.max,
            value: o.value || ""
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_FOCUS, function () {
            self.storeTriggerValue = this.getKey();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeTriggerValue) {
                self.storeValue = self.trigger.getValue();
                self.setValue(self.storeValue);
            } else if (!this.getKey()) {
                self.storeValue = null;
                self.setValue();
            }
            self.fireEvent(BI.DynamicYearCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: {
                    type: "bi.dynamic_year_popup",
                    ref: function () {
                        self.popup = this;
                    },
                    listeners: [{
                        eventName: BI.DynamicYearPopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearPopup.BUTTON_CLEAR_EVENT_CHANGE,
                        action: function () {
                            self.setValue();
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearPopup.BUTTON_lABEL_EVENT_CHANGE,
                        action: function () {
                            var date = BI.getDate();
                            self.setValue({year: date.getFullYear()});
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearPopup.BUTTON_OK_EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }],
                    behaviors: o.behaviors,
                    min: o.min,
                    max: o.max
                },
                value: o.value || ""
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.DynamicYearCombo.EVENT_BEFORE_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            ref: function () {
                self.comboWrapper = this;
            },
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "bi-trigger-icon-button date-change-h-font",
                    width: 24,
                    height: 24,
                    ref: function () {
                        self.changeIcon = this;
                    }
                },
                width: 24
            }, this.combo]
        });
        this._checkDynamicValue(o.value);
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicYearCombo.Dynamic:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[0].width = 24;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[0].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
        this._checkDynamicValue(v);
    },

    getValue: function () {
        return this.storeValue;
    }

});
BI.DynamicYearCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.dynamic_year_combo", BI.DynamicYearCombo);

BI.extend(BI.DynamicYearCombo, {
    Static: 1,
    Dynamic: 2
});/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.DynamicYearPopup
 * @extends BI.Trigger
 */
BI.DynamicYearPopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 30
    },

    props: {
        baseCls: "bi-year-popup",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期,
        width: 180,
        height: 240
    },

    render: function () {
        var self = this, opts = this.options;
        this.storeValue = {type: BI.DynamicYearCombo.Static};
        return {
            type: "bi.vtape",
            items: [{
                el: this._getTabJson()
            }, {
                el: {
                    type: "bi.grid",
                    items: [[{
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-top bi-high-light",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Clear"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearPopup.BUTTON_CLEAR_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-left bi-border-right bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Current_Year"),
                        ref: function () {
                            self.textButton = this;
                        },
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearPopup.BUTTON_lABEL_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-top bi-high-light",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_OK"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearPopup.BUTTON_OK_EVENT_CHANGE);
                            }
                        }]
                    }]]
                },
                height: 24
            }]
        };
    },

    _setInnerValue: function () {
        if (this.dateTab.getSelect() === BI.DynamicDateCombo.Static) {
            this.textButton.setValue(BI.i18nText("BI-Basic_Current_Year"));
            this.textButton.setEnable(true);
        } else {
            var date = BI.DynamicDateHelper.getCalculation(this.dynamicPane.getValue());
            date = date.print("%Y");
            this.textButton.setValue(date);
            this.textButton.setEnable(false);
        }
    },

    _getTabJson: function () {
        var self = this, o = this.options;
        return {
            type: "bi.tab",
            ref: function () {
                self.dateTab = this;
            },
            tab: {
                type: "bi.linear_segment",
                cls: "bi-border-bottom",
                height: this.constants.tabHeight,
                items: BI.createItems([{
                    text: BI.i18nText("BI-Basic_Year_Fen"),
                    value: BI.DynamicYearCombo.Static
                }, {
                    text: BI.i18nText("BI-Basic_Dynamic_Title"),
                    value: BI.DynamicYearCombo.Dynamic
                }], {
                    textAlign: "center"
                })
            },
            cardCreator: function (v) {
                switch (v) {
                    case BI.DynamicYearCombo.Dynamic:
                        return {
                            type: "bi.dynamic_year_card",
                            listeners: [{
                                eventName: "EVENT_CHANGE",
                                action: function () {
                                    self._setInnerValue(self.year, v);
                                }
                            }],
                            ref: function () {
                                self.dynamicPane = this;
                            }
                        };
                    case BI.DynamicYearCombo.Static:
                    default:
                        return {
                            type: "bi.static_year_card",
                            behaviors: o.behaviors,
                            min: self.options.min,
                            max: self.options.max,
                            listeners: [{
                                eventName: BI.StaticYearCard.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicYearPopup.EVENT_CHANGE);
                                }
                            }],
                            ref: function () {
                                self.year = this;
                            }
                        };
                }
            },
            listeners: [{
                eventName: BI.Tab.EVENT_CHANGE,
                action: function () {
                    var v = self.dateTab.getSelect();
                    switch (v) {
                        case BI.DynamicYearCombo.Static:
                            var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                            self.year.setValue({year: date.getFullYear()});
                            self._setInnerValue();
                            break;
                        case BI.DynamicYearCombo.Dynamic:
                        default:
                            if(self.storeValue && self.storeValue.type === BI.DynamicYearCombo.Dynamic) {
                                self.dynamicPane.setValue(self.storeValue.value);
                            }else{
                                self.dynamicPane.setValue({
                                    year: 0
                                });
                            }
                            self._setInnerValue();
                            break;
                    }
                }
            }]
        };
    },

    setValue: function (v) {
        this.storeValue = v;
        var self = this;
        var type, value;
        v = v || {};
        type = v.type || BI.DynamicDateCombo.Static;
        value = v.value || v;
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.dynamicPane.setValue(value);
                self._setInnerValue();
                break;
            case BI.DynamicDateCombo.Static:
            default:
                this.year.setValue(value);
                this.textButton.setValue(BI.i18nText("BI-Basic_Current_Year"));
                this.textButton.setEnable(true);
                break;
        }
    },

    getValue: function () {
        return {
            type: this.dateTab.getSelect(),
            value: this.dateTab.getValue()
        };
    }

});
BI.DynamicYearPopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
BI.DynamicYearPopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
BI.DynamicYearPopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DynamicYearPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_popup", BI.DynamicYearPopup);BI.DynamicYearTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        errorText: BI.i18nText("BI-Please_Input_Positive_Integer"),
        errorTextInvalid: BI.i18nText("BI-Year_Trigger_Invalid_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.DynamicYearTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-year-trigger",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            height: 24
        });
    },
    _init: function () {
        BI.DynamicYearTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                return v === "" || (BI.isPositiveInteger(v) && !BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            allowBlank: true,
            errorText: function (v) {
                return !BI.isPositiveInteger(v) ? c.errorText : c.errorTextInvalid;
            }
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
            }
            if (BI.isNotEmptyString(value)) {
                self.storeValue = {
                    type: BI.DynamicDateCombo.Static,
                    value: {
                        year: value
                    }
                };
            }

            self.fireEvent(BI.DynamicYearTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_ERROR);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [{
                el: this.editor
            }, {
                el: {
                    type: "bi.text_button",
                    baseCls: "bi-trigger-year-text",
                    text: BI.i18nText("BI-Multi_Date_Year"),
                    width: o.height
                },
                width: o.height
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    width: o.height
                },
                width: o.height
            }]
        });
        this.setValue(o.value);
    },

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year) && BI.parseInt(obj.year) !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y");
        this.editor.setState(dateStr);
        this.editor.setValue(dateStr);
        this.setTitle(BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr));
    },
    
    setValue: function (v) {
        var type, value;
        var date = BI.getDate();
        this.storeValue = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DynamicDateCombo.Static;
            value = v.value || v;
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                var text = this._getText(value);
                date = BI.DynamicDateHelper.getCalculation(value);
                this._setInnerValue(date, text);
                break;
            case BI.DynamicDateCombo.Static:
            default:
                value = value || {};
                this.editor.setState(value.year);
                this.editor.setValue(value.year);
                this.setTitle(value.year);
                break;
        }
    },

    getValue: function () {
        return this.storeValue;
    },

    getKey: function () {
        return this.editor.getValue() | 0;
    }
});
BI.DynamicYearTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearTrigger.EVENT_START = "EVENT_START";
BI.DynamicYearTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearTrigger.EVENT_STOP = "EVENT_STOP";
BI.shortcut("bi.dynamic_year_trigger", BI.DynamicYearTrigger);/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.YearCard
 * @extends BI.Trigger
 */
BI.DynamicYearMonthCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-month-card"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
                textAlign: "left",
                height: 24
            }, {
                type: "bi.dynamic_date_param_item",
                ref: function () {
                    self.year = this;
                },
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }, {
                type: "bi.dynamic_date_param_item",
                dateType: BI.DynamicDateCard.TYPE.MONTH,
                ref: function () {
                    self.month = this;
                },
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }],
            vgap: 10,
            hgap: 10
        };
    },

    _createValue: function (type, v) {
        return {
            dateType: type,
            value: Math.abs(v),
            offset: v > 0 ? 1 : 0
        };
    },

    setValue: function (v) {
        v = v || {year: 0, month: 0};
        this.year.setValue(this._createValue(BI.DynamicDateCard.TYPE.YEAR, v.year));
        this.month.setValue(this._createValue(BI.DynamicDateCard.TYPE.MONTH, v.month));
    },

    getValue: function () {
        var year = this.year.getValue();
        var month = this.month.getValue();
        return {
            year: (year.offset === 0 ? -year.value : year.value),
            month: (month.offset === 0 ? -month.value : month.value)
        };
    }
});
BI.DynamicYearMonthCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_month_card", BI.DynamicYearMonthCard);BI.StaticYearMonthCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-static-year-month-card",
        behaviors: {}
    },

    _createMonths: function () {
        // 纵向排列月
        var month = [1, 7, 2, 8, 3, 9, 4, 10, 5, 11, 6, 12];
        var items = [];
        items.push(month.slice(0, 2));
        items.push(month.slice(2, 4));
        items.push(month.slice(4, 6));
        items.push(month.slice(6, 8));
        items.push(month.slice(8, 10));
        items.push(month.slice(10, 12));
        return BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return {
                    type: "bi.text_item",
                    cls: "bi-list-item-active",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    once: false,
                    forceSelected: true,
                    height: 23,
                    width: 38,
                    value: td,
                    text: td
                };
            });
        });
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.year_picker",
                ref: function () {
                    self.yearPicker = this;
                },
                height: 30,
                listeners: [{
                    eventName: BI.YearPicker.EVENT_CHANGE,
                    action: function () {
                        var value = this.getValue();
                        self.setValue({
                            year: value,
                            month: self.selectedMonth
                        });
                    }
                }]
            }, {
                type: "bi.button_group",
                behaviors: o.behaviors,
                ref: function () {
                    self.month = this;
                },
                items: this._createMonths(),
                layouts: [BI.LogicFactory.createLogic("table", BI.extend({
                    dynamic: true
                }, {
                    columns: 2,
                    rows: 6,
                    columnSize: [1 / 2, 1 / 2],
                    rowSize: 25
                })), {
                    type: "bi.center_adapt",
                    vgap: 1,
                    hgap: 2
                }],
                value: o.value,
                listeners: [{
                    eventName: BI.ButtonGroup.EVENT_CHANGE,
                    action: function () {
                        self.selectedYear = self.yearPicker.getValue();
                        self.selectedMonth = this.getValue()[0];
                        self.fireEvent(BI.StaticYearMonthCard.EVENT_CHANGE);
                    }
                }]
            }]
        };
    },


    getValue: function () {
        return {
            year: this.selectedYear,
            month: this.selectedMonth
        };
    },

    setValue: function (obj) {
        var o = this.options;
        obj = obj || {};
        obj.year = obj.year || 0;
        obj.month = obj.month || 0;
        if (BI.checkDateVoid(obj.year, obj.month, 1, o.min, o.max)[0]) {
            var year = BI.getDate().getFullYear();
            this.selectedYear = "";
            this.selectedMonth = "";
            this.yearPicker.setValue(year);
            this.month.setValue();
        } else {
            this.selectedYear = BI.parseInt(obj.year);
            this.selectedMonth = BI.parseInt(obj.month);
            this.yearPicker.setValue(this.selectedYear);
            this.month.setValue(this.selectedMonth);
        }
    }
});
BI.StaticYearMonthCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_year_month_card", BI.StaticYearMonthCard);BI.DynamicYearMonthCombo = BI.inherit(BI.Single, {

    props: {
        baseCls: "bi-year-month-combo  bi-border",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicYearMonthCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = o.value;
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_month_trigger",
            min: o.min,
            max: o.max,
            value: o.value || ""
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_ERROR);
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_VALID, function () {
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_VALID);
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            self.storeValue = self.trigger.getValue();
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_CONFIRM);
        });
        this.trigger.on(BI.DynamicYearMonthCombo.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_FOCUS);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: {
                    type: "bi.dynamic_year_month_popup",
                    ref: function () {
                        self.popup = this;
                    },
                    listeners: [{
                        eventName: BI.DynamicYearMonthPopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearMonthPopup.BUTTON_CLEAR_EVENT_CHANGE,
                        action: function () {
                            self.setValue();
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearMonthPopup.BUTTON_lABEL_EVENT_CHANGE,
                        action: function () {
                            var date = BI.getDate();
                            self.setValue({year: date.getFullYear(), month: date.getMonth() + 1});
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearMonthPopup.BUTTON_OK_EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }],
                    behaviors: o.behaviors,
                    min: o.min,
                    max: o.max
                },
                value: o.value || ""
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_BEFORE_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            ref: function () {
                self.comboWrapper = this;
            },
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "bi-trigger-icon-button date-change-h-font",
                    width: 24,
                    height: 24,
                    ref: function () {
                        self.changeIcon = this;
                    }
                },
                width: 24
            }, this.combo]
        });
        this._checkDynamicValue(o.value);
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicYearMonthCombo.Dynamic:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[0].width = 24;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[0].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    hideView: function () {
        this.combo.hideView();
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
        this._checkDynamicValue(v);
    },

    getValue: function () {
        return this.storeValue;
    },

    getKey: function () {
        return this.trigger.getKey();
    }

});
BI.DynamicYearMonthCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearMonthCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicYearMonthCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearMonthCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearMonthCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.dynamic_year_month_combo", BI.DynamicYearMonthCombo);

BI.extend(BI.DynamicYearMonthCombo, {
    Static: 1,
    Dynamic: 2
});/**
 * 年月
 *
 * Created by GUY on 2015/9/2.
 * @class BI.DynamicYearMonthPopup
 * @extends BI.Trigger
 */
BI.DynamicYearMonthPopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 30
    },

    props: {
        baseCls: "bi-year-month-popup",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期,
        width: 180,
        height: 240
    },

    render: function () {
        var self = this, opts = this.options;
        this.storeValue = {type: BI.DynamicYearMonthCombo.Static};
        return {
            type: "bi.vtape",
            items: [{
                el: this._getTabJson()
            }, {
                el: {
                    type: "bi.grid",
                    items: [[{
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-top bi-high-light",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Clear"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearMonthPopup.BUTTON_CLEAR_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-left bi-border-right bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Current_Month"),
                        ref: function () {
                            self.textButton = this;
                        },
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearMonthPopup.BUTTON_lABEL_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-top bi-high-light",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_OK"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearMonthPopup.BUTTON_OK_EVENT_CHANGE);
                            }
                        }]
                    }]]
                },
                height: 24
            }]
        };
    },

    _setInnerValue: function () {
        if (this.dateTab.getSelect() === BI.DynamicDateCombo.Static) {
            this.textButton.setValue(BI.i18nText("BI-Basic_Current_Month"));
            this.textButton.setEnable(true);
        } else {
            var date = BI.DynamicDateHelper.getCalculation(this.dynamicPane.getValue());
            date = date.print("%Y-%x");
            this.textButton.setValue(date);
            this.textButton.setEnable(false);
        }
    },

    _getTabJson: function () {
        var self = this, o = this.options;
        return {
            type: "bi.tab",
            ref: function () {
                self.dateTab = this;
            },
            tab: {
                type: "bi.linear_segment",
                cls: "bi-border-bottom",
                height: this.constants.tabHeight,
                items: BI.createItems([{
                    text: BI.i18nText("BI-Basic_Year_Month"),
                    value: BI.DynamicYearCombo.Static
                }, {
                    text: BI.i18nText("BI-Basic_Dynamic_Title"),
                    value: BI.DynamicYearCombo.Dynamic
                }], {
                    textAlign: "center"
                })
            },
            cardCreator: function (v) {
                switch (v) {
                    case BI.DynamicYearCombo.Dynamic:
                        return {
                            type: "bi.dynamic_year_month_card",
                            listeners: [{
                                eventName: "EVENT_CHANGE",
                                action: function () {
                                    self._setInnerValue(self.year, v);
                                }
                            }],
                            ref: function () {
                                self.dynamicPane = this;
                            }
                        };
                    case BI.DynamicYearCombo.Static:
                    default:
                        return {
                            type: "bi.static_year_month_card",
                            behaviors: o.behaviors,
                            min: self.options.min,
                            max: self.options.max,
                            listeners: [{
                                eventName: BI.StaticYearMonthCard.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicYearMonthPopup.EVENT_CHANGE);
                                }
                            }],
                            ref: function () {
                                self.year = this;
                            }
                        };
                }
            },
            listeners: [{
                eventName: BI.Tab.EVENT_CHANGE,
                action: function () {
                    var v = self.dateTab.getSelect();
                    switch (v) {
                        case BI.DynamicYearCombo.Static:
                            var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                            self.year.setValue({year: date.getFullYear(), month: date.getMonth()});
                            self._setInnerValue();
                            break;
                        case BI.DynamicYearCombo.Dynamic:
                        default:
                            if(self.storeValue && self.storeValue.type === BI.DynamicYearCombo.Dynamic) {
                                self.dynamicPane.setValue(self.storeValue.value);
                            }else{
                                self.dynamicPane.setValue({
                                    year: 0
                                });
                            }
                            self._setInnerValue();
                            break;
                    }
                }
            }]
        };
    },

    setValue: function (v) {
        this.storeValue = v;
        var self = this;
        var type, value;
        v = v || {};
        type = v.type || BI.DynamicDateCombo.Static;
        value = v.value || v;
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.dynamicPane.setValue(value);
                self._setInnerValue();
                break;
            case BI.DynamicDateCombo.Static:
            default:
                this.year.setValue(value);
                this.textButton.setValue(BI.i18nText("BI-Basic_Current_Month"));
                this.textButton.setEnable(true);
                break;
        }
    },

    getValue: function () {
        return {
            type: this.dateTab.getSelect(),
            value: this.dateTab.getValue()
        };
    }

});
BI.DynamicYearMonthPopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
BI.DynamicYearMonthPopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
BI.DynamicYearMonthPopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DynamicYearMonthPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_month_popup", BI.DynamicYearMonthPopup);BI.DynamicYearMonthTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        errorText: BI.i18nText("BI-Please_Input_Positive_Integer"),
        errorTextInvalid: BI.i18nText("BI-Year_Trigger_Invalid_Text")
    },

    props: {
        extraCls: "bi-year-month-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicYearMonthTrigger.superclass._init.apply(this, arguments);
        var o = this.options;

        this.yearEditor = this._createEditor(true);
        this.monthEditor = this._createEditor(false);

        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [{
                type: "bi.center",
                items: [{
                    type: "bi.htape",
                    items: [this.yearEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Year"),
                            width: o.height
                        },
                        width: o.height
                    }]
                }, {
                    type: "bi.htape",
                    items: [this.monthEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Month"),
                            width: o.height
                        },
                        width: o.height}]
                }]
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    width: o.height
                },
                width: o.height
            }]
        });
        this.setValue(o.value);
    },

    _createEditor: function (isYear) {
        var self = this, o = this.options, c = this._const;
        var editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                if(isYear) {
                    return v === "" || (BI.isPositiveInteger(v) && !BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]);
                }
                return v === "" || ((v >= 1 && v <= 12) && !BI.checkDateVoid(BI.getDate().getFullYear(), v, 1, o.min, o.max)[0]);
            },
            quitChecker: function () {
                return false;
            },
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function (v) {
                return !BI.isPositiveInteger(v) ? c.errorText : c.errorTextInvalid;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true
        });
        editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_FOCUS);
        });
        editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_STOP);
        });
        editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = editor.getValue();
            if (BI.isNotNull(value)) {
                editor.setValue(value);
            }
            if (BI.isNotEmptyString(value)) {
                var monthValue = self.monthEditor.getValue();
                self.storeValue = {
                    type: BI.DynamicDateCombo.Static,
                    value: {
                        year: self.yearEditor.getValue(),
                        month: BI.isEmptyString(self.monthEditor.getValue()) ? "" : monthValue
                    }
                };
            }
            self.setTitle(self._getStaticTitle(self.storeValue.value));

            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_CONFIRM);
        });
        editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (editor.isValid()) {
                editor.blur();
            }
        });
        editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_START);
        });
        editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_ERROR);
        });
        editor.on(BI.SignEditor.EVENT_VALID, function () {
            var year = self.yearEditor.getValue();
            var month = self.monthEditor.getValue();
            if(BI.isNotEmptyString(year) && BI.isNotEmptyString(month)) {
                if(BI.isPositiveInteger(year) && month >= 1 && month <= 12 && !BI.checkDateVoid(year, month, 1, o.min, o.max)[0]) {
                    self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_VALID);
                }
            }
        });
        editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            if(isYear) {
                self._autoSwitch(editor.getValue());
            }
        });

        return editor;
    },

    _yearCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y").print("%Y") === v && date >= this.options.min && date <= this.options.max;
    },

    _autoSwitch: function (v) {
        if (BI.checkDateLegal(v)) {
            if (v.length === 4 && this._yearCheck(v)) {
                this.monthEditor.focus();
            }
        }
    },

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year) && BI.parseInt(obj.year) !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        if(BI.isNotNull(obj.month) && BI.parseInt(obj.month) !== 0) {
            value += Math.abs(obj.month) + BI.i18nText("BI-Basic_Month") + (obj.month < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y-%x");
        this.yearEditor.setValue(date.getFullYear());
        this.monthEditor.setValue(date.getMonth() + 1);
        this.setTitle(BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr));
    },

    _getStaticTitle: function (value) {
        value = value || {};
        var yearStr = (BI.isNull(value.year) || BI.isEmptyString(value.year)) ? "" : value.year + "-";
        var monthStr = (BI.isNull(value.month) || BI.isEmptyString(value.month)) ? "" : value.month;
        return yearStr + monthStr;
    },

    setValue: function (v) {
        var type, value;
        var date = BI.getDate();
        this.storeValue = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DynamicDateCombo.Static;
            value = v.value || v;
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                var text = this._getText(value);
                date = BI.DynamicDateHelper.getCalculation(value);
                this._setInnerValue(date, text);
                break;
            case BI.DynamicDateCombo.Static:
            default:
                value = value || {};
                var month = BI.isNull(value.month) ? null : value.month;
                this.yearEditor.setValue(value.year);
                this.yearEditor.setTitle(value.year);
                this.monthEditor.setValue(month);
                this.monthEditor.setTitle(month);
                this.setTitle(this._getStaticTitle(value));
                break;
        }
    },

    getValue: function () {
        return this.storeValue;
    },

    getKey: function () {
        return this.yearEditor.getValue() + "-" + this.monthEditor.getValue();
    }
});
BI.DynamicYearMonthTrigger.EVENT_VALID = "EVENT_FOCUS";
BI.DynamicYearMonthTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearMonthTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearMonthTrigger.EVENT_START = "EVENT_START";
BI.DynamicYearMonthTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearMonthTrigger.EVENT_STOP = "EVENT_STOP";
BI.shortcut("bi.dynamic_year_month_trigger", BI.DynamicYearMonthTrigger);BI.YearMonthInterval = BI.inherit(BI.Single, {
    constants: {
        height: 25,
        width: 25,
        lgap: 15,
        offset: -15,
        timeErrorCls: "time-error",
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },

    props: {
        extraCls: "bi-year-month-interval"
    },

    _init: function () {
        var self = this, o = this.options;
        BI.YearMonthInterval.superclass._init.apply(this, arguments);

        o.value = o.value || {};
        this.left = this._createCombo(o.value.start);
        this.right = this._createCombo(o.value.end);
        this.label = BI.createWidget({
            type: "bi.label",
            height: this.constants.height,
            width: this.constants.width,
            text: "-"
        });
        BI.createWidget({
            element: self,
            type: "bi.center",
            hgap: 15,
            height: this.constants.height,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: self.left,
                    left: this.constants.offset,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            }, {
                type: "bi.absolute",
                items: [{
                    el: self.right,
                    left: 0,
                    right: this.constants.offset,
                    top: 0,
                    bottom: 0
                }]
            }]
        });
        BI.createWidget({
            type: "bi.horizontal_auto",
            element: this,
            items: [
                self.label
            ]
        });
    },

    _createCombo: function (v) {
        var self = this;
        var combo = BI.createWidget({
            type: "bi.dynamic_year_month_combo",
            value: v
        });
        combo.on(BI.DynamicYearMonthCombo.EVENT_ERROR, function () {
            self._clearTitle();
            self.element.removeClass(self.constants.timeErrorCls);
            self.fireEvent(BI.YearMonthInterval.EVENT_ERROR);
        });

        combo.on(BI.DynamicYearMonthCombo.EVENT_VALID, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.YearMonthInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.DynamicYearMonthCombo.EVENT_FOCUS, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.YearMonthInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.DynamicYearMonthCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.left.hideView();
            self.right.hideView();
        });

        combo.on(BI.DynamicYearMonthCombo.EVENT_CONFIRM, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                self.fireEvent(BI.YearMonthInterval.EVENT_ERROR);
            }else{
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
                self.fireEvent(BI.YearMonthInterval.EVENT_CHANGE);
            }
        });
        return combo;
    },


    _dateCheck: function (date) {
        return BI.parseDateTime(date, "%Y-%x").print("%Y-%x") === date || BI.parseDateTime(date, "%Y-%X").print("%Y-%X") === date;
    },


    // 判是否在最大最小之间
    _checkVoid: function (obj) {
        return !BI.checkDateVoid(obj.year, obj.month, 1, this.constants.DATE_MIN_VALUE, this.constants.DATE_MAX_VALUE)[0];
    },

    // 判格式合法
    _check: function (smallDate, bigDate) {
        var smallObj = smallDate.match(/\d+/g), bigObj = bigDate.match(/\d+/g);
        return this._dateCheck(smallDate) && BI.checkDateLegal(smallDate) && this._checkVoid({
            year: smallObj[0],
            month: smallObj[1],
            day: 1
        }) && this._dateCheck(bigDate) && BI.checkDateLegal(bigDate) && this._checkVoid({
            year: bigObj[0],
            month: bigObj[1],
            day: 1
        });
    },

    _compare: function (smallDate, bigDate) {
        smallDate = BI.parseDateTime(smallDate, "%Y-%X").print("%Y-%X");
        bigDate = BI.parseDateTime(bigDate, "%Y-%X").print("%Y-%X");
        return BI.isNotNull(smallDate) && BI.isNotNull(bigDate) && smallDate > bigDate;
    },
    _setTitle: function (v) {
        this.left.setTitle(v);
        this.right.setTitle(v);
        this.label.setTitle(v);
    },
    _clearTitle: function () {
        this.left.setTitle("");
        this.right.setTitle("");
        this.label.setTitle("");
    },
    setValue: function (date) {
        date = date || {};
        this.left.setValue(date.start);
        this.right.setValue(date.end);
    },
    getValue: function () {
        return {start: this.left.getValue(), end: this.right.getValue()};
    }
});
BI.YearMonthInterval.EVENT_VALID = "EVENT_VALID";
BI.YearMonthInterval.EVENT_ERROR = "EVENT_ERROR";
BI.YearMonthInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.year_month_interval", BI.YearMonthInterval);/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.YearCard
 * @extends BI.Trigger
 */
BI.DynamicYearQuarterCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-month-card"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
                textAlign: "left",
                height: 24
            }, {
                type: "bi.dynamic_date_param_item",
                ref: function () {
                    self.year = this;
                },
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }, {
                type: "bi.dynamic_date_param_item",
                dateType: BI.DynamicDateCard.TYPE.QUARTER,
                ref: function () {
                    self.quarter = this;
                },
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }],
            vgap: 10,
            hgap: 10
        };
    },

    _createValue: function (type, v) {
        return {
            dateType: type,
            value: Math.abs(v),
            offset: v > 0 ? 1 : 0
        };
    },

    setValue: function (v) {
        v = v || {year: 0, month: 0};
        this.year.setValue(this._createValue(BI.DynamicDateCard.TYPE.YEAR, v.year));
        this.quarter.setValue(this._createValue(BI.DynamicDateCard.TYPE.QUARTER, v.quarter));
    },

    getValue: function () {
        var year = this.year.getValue();
        var quarter = this.quarter.getValue();
        return {
            year: (year.offset === 0 ? -year.value : year.value),
            quarter: (quarter.offset === 0 ? -quarter.value : quarter.value)
        };
    }
});
BI.DynamicYearQuarterCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_quarter_card", BI.DynamicYearQuarterCard);BI.StaticYearQuarterCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-static-year-quarter-card",
        behaviors: {}
    },

    _createQuarter: function () {

        var items = [{
            text: Date._QN[1],
            value: 1
        }, {
            text: Date._QN[2],
            value: 2
        }, {
            text: Date._QN[3],
            value: 3
        }, {
            text: Date._QN[4],
            value: 4
        }];
        return BI.map(items, function (j, item) {
            return BI.extend(item, {
                type: "bi.text_item",
                cls: "bi-list-item-active",
                textAlign: "center",
                whiteSpace: "nowrap",
                once: false,
                forceSelected: true,
                height: 24
            });
        });
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.year_picker",
                ref: function () {
                    self.yearPicker = this;
                },
                height: 30,
                listeners: [{
                    eventName: BI.YearPicker.EVENT_CHANGE,
                    action: function () {
                        var value = this.getValue();
                        self.setValue({
                            year: value,
                            quarter: self.selectedQuarter
                        });
                    }
                }]
            }, {
                type: "bi.button_group",
                behaviors: o.behaviors,
                ref: function () {
                    self.quarter = this;
                },
                items: this._createQuarter(),
                layouts: [{
                    type: "bi.vertical",
                    vgap: 10
                }],
                value: o.value,
                listeners: [{
                    eventName: BI.ButtonGroup.EVENT_CHANGE,
                    action: function () {
                        self.selectedYear = self.yearPicker.getValue();
                        self.selectedQuarter = this.getValue()[0];
                        self.fireEvent(BI.StaticYearQuarterCard.EVENT_CHANGE);
                    }
                }]
            }]
        };
    },


    getValue: function () {
        return {
            year: this.selectedYear,
            quarter: this.selectedQuarter
        };
    },

    setValue: function (obj) {
        var o = this.options;
        obj = obj || {};
        obj.year = obj.year || 0;
        obj.quarter = obj.quarter || 0;
        if (BI.checkDateVoid(obj.year, obj.quarter, 1, o.min, o.max)[0]) {
            var year = BI.getDate().getFullYear();
            this.selectedYear = "";
            this.selectedQuarter = "";
            this.yearPicker.setValue(year);
            this.quarter.setValue();
        } else {
            this.selectedYear = BI.parseInt(obj.year);
            this.selectedQuarter = BI.parseInt(obj.quarter);
            this.yearPicker.setValue(this.selectedYear);
            this.quarter.setValue(this.selectedQuarter);
        }
    }
});
BI.StaticYearQuarterCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_year_quarter_card", BI.StaticYearQuarterCard);BI.DynamicYearQuarterCombo = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-quarter-combo bi-border",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicYearQuarterCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = o.value;
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_quarter_trigger",
            min: o.min,
            max: o.max,
            value: o.value || ""
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            self.storeValue = self.trigger.getValue();
            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: {
                    type: "bi.dynamic_year_quarter_popup",
                    ref: function () {
                        self.popup = this;
                    },
                    listeners: [{
                        eventName: BI.DynamicYearQuarterPopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearQuarterPopup.BUTTON_CLEAR_EVENT_CHANGE,
                        action: function () {
                            self.setValue();
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearQuarterPopup.BUTTON_lABEL_EVENT_CHANGE,
                        action: function () {
                            var date = BI.getDate();
                            self.setValue({year: date.getFullYear(), quarter: date.getQuarter()});
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearQuarterPopup.BUTTON_OK_EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }],
                    behaviors: o.behaviors,
                    min: o.min,
                    max: o.max
                },
                value: o.value || ""
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_BEFORE_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            ref: function () {
                self.comboWrapper = this;
            },
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "bi-trigger-icon-button date-change-h-font",
                    width: 24,
                    height: 24,
                    ref: function () {
                        self.changeIcon = this;
                    }
                },
                width: 24
            }, this.combo]
        });
        this._checkDynamicValue(o.value);
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicYearQuarterCombo.Dynamic:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[0].width = 24;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[0].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
        this._checkDynamicValue(v);
    },

    getValue: function () {
        return this.storeValue;
    }

});
BI.DynamicYearQuarterCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearQuarterCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.dynamic_year_quarter_combo", BI.DynamicYearQuarterCombo);

BI.extend(BI.DynamicYearQuarterCombo, {
    Static: 1,
    Dynamic: 2
});BI.DynamicYearQuarterPopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 30
    },

    props: {
        baseCls: "bi-year-quarter-popup",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期,
        width: 180,
        height: 240
    },

    render: function () {
        var self = this, opts = this.options;
        this.storeValue = {type: BI.DynamicYearQuarterCombo.Static};
        return {
            type: "bi.vtape",
            items: [{
                el: this._getTabJson()
            }, {
                el: {
                    type: "bi.grid",
                    items: [[{
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-top bi-high-light",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Clear"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearQuarterPopup.BUTTON_CLEAR_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-left bi-border-right bi-border-top",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Current_Quarter"),
                        ref: function () {
                            self.textButton = this;
                        },
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearQuarterPopup.BUTTON_lABEL_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        forceCenter: true,
                        cls: "bi-border-top bi-high-light",
                        shadow: true,
                        text: BI.i18nText("BI-Basic_OK"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearQuarterPopup.BUTTON_OK_EVENT_CHANGE);
                            }
                        }]
                    }]]
                },
                height: 24
            }]
        };
    },

    _setInnerValue: function () {
        if (this.dateTab.getSelect() === BI.DynamicYearQuarterCombo.Static) {
            this.textButton.setValue(BI.i18nText("BI-Basic_Current_Quarter"));
            this.textButton.setEnable(true);
        } else {
            var date = BI.DynamicDateHelper.getCalculation(this.dynamicPane.getValue());
            date = date.print("%Y-%x");
            this.textButton.setValue(date);
            this.textButton.setEnable(false);
        }
    },

    _getTabJson: function () {
        var self = this, o = this.options;
        return {
            type: "bi.tab",
            ref: function () {
                self.dateTab = this;
            },
            tab: {
                type: "bi.linear_segment",
                cls: "bi-border-bottom",
                height: this.constants.tabHeight,
                items: BI.createItems([{
                    text: BI.i18nText("BI-Basic_Year_Quarter"),
                    value: BI.DynamicYearQuarterCombo.Static
                }, {
                    text: BI.i18nText("BI-Basic_Dynamic_Title"),
                    value: BI.DynamicYearQuarterCombo.Dynamic
                }], {
                    textAlign: "center"
                })
            },
            cardCreator: function (v) {
                switch (v) {
                    case BI.DynamicYearQuarterCombo.Dynamic:
                        return {
                            type: "bi.dynamic_year_quarter_card",
                            listeners: [{
                                eventName: "EVENT_CHANGE",
                                action: function () {
                                    self._setInnerValue(self.year, v);
                                }
                            }],
                            ref: function () {
                                self.dynamicPane = this;
                            }
                        };
                    case BI.DynamicYearQuarterCombo.Static:
                    default:
                        return {
                            type: "bi.static_year_quarter_card",
                            behaviors: o.behaviors,
                            min: self.options.min,
                            max: self.options.max,
                            listeners: [{
                                eventName: BI.DynamicYearCard.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicYearQuarterPopup.EVENT_CHANGE);
                                }
                            }],
                            ref: function () {
                                self.year = this;
                            }
                        };
                }
            },
            listeners: [{
                eventName: BI.Tab.EVENT_CHANGE,
                action: function () {
                    var v = self.dateTab.getSelect();
                    switch (v) {
                        case BI.DynamicYearQuarterCombo.Static:
                            var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                            self.year.setValue({year: date.getFullYear(), quarter: date.getQuarter()});
                            self._setInnerValue();
                            break;
                        case BI.DynamicYearQuarterCombo.Dynamic:
                        default:
                            if(self.storeValue && self.storeValue.type === BI.DynamicYearQuarterCombo.Dynamic) {
                                self.dynamicPane.setValue(self.storeValue.value);
                            }else{
                                self.dynamicPane.setValue({
                                    year: 0
                                });
                            }
                            self._setInnerValue();
                            break;
                    }
                }
            }]
        };
    },

    setValue: function (v) {
        this.storeValue = v;
        var self = this;
        var type, value;
        v = v || {};
        type = v.type || BI.DynamicDateCombo.Static;
        value = v.value || v;
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.dynamicPane.setValue(value);
                self._setInnerValue();
                break;
            case BI.DynamicDateCombo.Static:
            default:
                this.year.setValue(value);
                this.textButton.setValue(BI.i18nText("BI-Basic_Current_Quarter"));
                this.textButton.setEnable(true);
                break;
        }
    },

    getValue: function () {
        return {
            type: this.dateTab.getSelect(),
            value: this.dateTab.getValue()
        };
    }

});
BI.DynamicYearQuarterPopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
BI.DynamicYearQuarterPopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
BI.DynamicYearQuarterPopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DynamicYearQuarterPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_quarter_popup", BI.DynamicYearQuarterPopup);BI.DynamicYearQuarterTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        errorText: BI.i18nText("BI-Please_Input_Positive_Integer"),
        errorTextInvalid: BI.i18nText("BI-Year_Trigger_Invalid_Text")
    },

    props: {
        extraCls: "bi-year-quarter-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicYearQuarterTrigger.superclass._init.apply(this, arguments);
        var o = this.options;

        this.yearEditor = this._createEditor(true);
        this.quarterEditor = this._createEditor(false);

        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [{
                type: "bi.center",
                items: [{
                    type: "bi.htape",
                    items: [this.yearEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Year"),
                            width: o.height
                        },
                        width: o.height
                    }]
                }, {
                    type: "bi.htape",
                    items: [this.quarterEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Quarter"),
                            width: o.height
                        },
                        width: o.height}]
                }]
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    width: o.height
                },
                width: o.height
            }]
        });
        this.setValue(o.value);
    },

    _createEditor: function (isYear) {
        var self = this, o = this.options, c = this._const;
        var editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                if(isYear) {
                    return v === "" || (BI.isPositiveInteger(v) && !BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]);
                }
                return v === "" || ((v >= 1 && v <= 4) && !BI.checkDateVoid(BI.getDate().getFullYear(), v, 1, o.min, o.max)[0]);
            },
            quitChecker: function () {
                return false;
            },
            errorText: function (v) {
                return !BI.isPositiveInteger(v) ? c.errorText : c.errorTextInvalid;
            },
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true
        });
        editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_FOCUS);
        });
        editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_STOP);
        });
        editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = editor.getValue();
            if (BI.isNotNull(value)) {
                editor.setValue(value);
            }
            if (BI.isNotEmptyString(value)) {
                var quarterValue = self.quarterEditor.getValue();
                self.storeValue = {
                    type: BI.DynamicYearQuarterCombo.Static,
                    value: {
                        year: self.yearEditor.getValue(),
                        quarter: BI.isEmptyString(self.quarterEditor.getValue()) ? "" : quarterValue
                    }
                };
            }
            self.setTitle(self._getStaticTitle(self.storeValue.value));

            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_CONFIRM);
        });
        editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (editor.isValid()) {
                editor.blur();
            }
        });
        editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_START);
        });
        editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_ERROR);
        });
        editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            if(isYear) {
                self._autoSwitch(editor.getValue());
            }
        });

        return editor;
    },

    _yearCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y").print("%Y") === v && date >= this.options.min && date <= this.options.max;
    },

    _autoSwitch: function (v) {
        if (BI.checkDateLegal(v)) {
            if (v.length === 4 && this._yearCheck(v)) {
                this.quarterEditor.focus();
            }
        }
    },

    _getStaticTitle: function (value) {
        value = value || {};
        var yearStr = (BI.isNull(value.year) || BI.isEmptyString(value.year)) ? "" : value.year + "-";
        var quarterStr = (BI.isNull(value.quarter) || BI.isEmptyString(value.quarter)) ? "" : value.quarter;
        return yearStr + quarterStr;
    },

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year) && BI.parseInt(obj.year) !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        if(BI.isNotNull(obj.quarter) && BI.parseInt(obj.quarter) !== 0) {
            value += Math.abs(obj.quarter) + BI.i18nText("BI-Basic_Single_Quarter") + (obj.quarter < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y-%x");
        this.yearEditor.setValue(date.getFullYear());
        this.quarterEditor.setValue(date.getQuarter());
        this.setTitle(BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr));
    },

    setValue: function (v) {
        var type, value;
        var date = BI.getDate();
        this.storeValue = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DynamicYearQuarterCombo.Static;
            value = v.value || v;
        }
        switch (type) {
            case BI.DynamicYearQuarterCombo.Dynamic:
                var text = this._getText(value);
                date = BI.DynamicDateHelper.getCalculation(value);
                this._setInnerValue(date, text);
                break;
            case BI.DynamicYearQuarterCombo.Static:
            default:
                value = value || {};
                var quarter = BI.isNull(value.quarter) ? null : value.quarter;
                this.yearEditor.setValue(value.year);
                this.yearEditor.setTitle(value.year);
                this.quarterEditor.setValue(quarter);
                this.quarterEditor.setTitle(quarter);
                this.setTitle(this._getStaticTitle(value));
                break;
        }
    },

    getValue: function () {
        return this.storeValue;
    }
});
BI.DynamicYearQuarterTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearQuarterTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearQuarterTrigger.EVENT_START = "EVENT_START";
BI.DynamicYearQuarterTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearQuarterTrigger.EVENT_STOP = "EVENT_STOP";
BI.shortcut("bi.dynamic_year_quarter_trigger", BI.DynamicYearQuarterTrigger);/**
 * 简单的复选下拉框控件, 适用于数据量少的情况， 与valuechooser的区别是allvaluechooser setValue和getValue返回的是所有值
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AbstractAllValueChooser
 * @extends BI.Widget
 */
BI.AbstractAllValueChooser = BI.inherit(BI.Widget, {

    _const: {
        perPage: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractAllValueChooser.superclass._defaultConfig.apply(this, arguments), {
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _valueFormatter: function (v) {
        var text = v;
        if (BI.isNotNull(this.items)) {
            BI.some(this.items, function (i, item) {
                // 把value都换成字符串
                if (item.value + "" === v) {
                    text = item.text;
                    return true;
                }
            });
        }
        return text;
    },

    _itemsCreator: function (options, callback) {
        var self = this, o = this.options;
        if (!o.cache || !this.items) {
            o.itemsCreator({}, function (items) {
                self.items = items;
                call(items);
            });
        } else {
            call(this.items);
        }
        function call (items) {
            var keywords = (options.keywords || []).slice();
            if (options.keyword) {
                keywords.push(options.keyword);
            }
            BI.each(keywords, function (i, kw) {
                var search = BI.Func.getSearchResult(items, kw);
                items = search.match.concat(search.find);
            });
            if (options.selectedValues) {// 过滤
                var filter = BI.makeObject(options.selectedValues, true);
                items = BI.filter(items, function (i, ob) {
                    return !filter[ob.value];
                });
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
                callback({
                    items: items
                });
                return;
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
                callback({count: items.length});
                return;
            }
            callback({
                items: items,
                hasNext: false
            });
        }
    }
});/**
 * 简单的复选下拉框控件, 适用于数据量少的情况， 与valuechooser的区别是allvaluechooser setValue和getValue返回的是所有值
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AllValueChooserCombo
 * @extends BI.AbstractAllValueChooser
 */
BI.AllValueChooserCombo = BI.inherit(BI.AbstractAllValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.AllValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-all-value-chooser-combo",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.AllValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.combo = BI.createWidget({
            type: "bi.multi_select_combo",
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height,
            value: {
                type: BI.Selection.Multi,
                value: o.value || []
            }
        });

        this.combo.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.AllValueChooserCombo.EVENT_CONFIRM);
        });
    },

    setValue: function (v) {
        this.combo.setValue({
            type: BI.Selection.Multi,
            value: v || []
        });
    },

    getValue: function () {
        var val = this.combo.getValue() || {};
        if (val.type === BI.Selection.All) {
            return val.assist;
        }
        return val.value || [];
    },

    populate: function () {
        this.combo.populate.apply(this, arguments);
    }
});
BI.AllValueChooserCombo.EVENT_CONFIRM = "AllValueChooserCombo.EVENT_CONFIRM";
BI.shortcut("bi.all_value_chooser_combo", BI.AllValueChooserCombo);/**
 * 简单的复选下拉框控件, 适用于数据量少的情况， 与valuechooser的区别是allvaluechooser setValue和getValue返回的是所有值
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AllValueChooserPane
 * @extends BI.AbstractAllValueChooser
 */
BI.AllValueChooserPane = BI.inherit(BI.AbstractAllValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.AllValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-all-value-chooser-pane",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.AllValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.list = BI.createWidget({
            type: "bi.multi_select_list",
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height
        });

        this.list.on(BI.MultiSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.AllValueChooserPane.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        this.list.setValue({
            type: BI.Selection.Multi,
            value: v || []
        });
    },

    getValue: function () {
        var val = this.list.getValue() || {};
        if (val.type === BI.Selection.All) {
            return val.assist;
        }
        return val.value || [];
    },

    populate: function () {
        this.list.populate.apply(this.list, arguments);
    }
});
BI.AllValueChooserPane.EVENT_CHANGE = "AllValueChooserPane.EVENT_CHANGE";
BI.shortcut("bi.all_value_chooser_pane", BI.AllValueChooserPane);BI.AbstractTreeValueChooser = BI.inherit(BI.Widget, {

    _const: {
        perPage: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractTreeValueChooser.superclass._defaultConfig.apply(this, arguments), {
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _valueFormatter: function (v) {
        var text = v;
        if (BI.isNotNull(this.items)) {
            BI.some(this.items, function (i, item) {
                if (item.value + "" === v) {
                    text = item.text;
                    return true;
                }
            });
        }
        return text;
    },

    _initData: function (items) {
        this.items = items;
        var nodes = BI.Tree.treeFormat(items);
        this.tree = new BI.Tree();
        this.tree.initTree(nodes);
    },

    _itemsCreator: function (options, callback) {
        var self = this, o = this.options;
        if (!this.items) {
            o.itemsCreator({}, function (items) {
                self._initData(items);
                call();
            });
        } else {
            call();
        }
        function call () {
            switch (options.type) {
                case BI.TreeView.REQ_TYPE_INIT_DATA:
                    self._reqInitTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_ADJUST_DATA:
                    self._reqAdjustTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_SELECT_DATA:
                    self._reqSelectedTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_GET_SELECTED_DATA:
                    self._reqDisplayTreeNode(options, callback);
                    break;
                default :
                    self._reqTreeNode(options, callback);
                    break;
            }
        }
    },

    _reqDisplayTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var selectedValues = op.selectedValues;

        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }

        doCheck([], this.tree.getRoot(), selectedValues);

        callback({
            items: result
        });

        function doCheck (parentValues, node, selected) {
            if (selected == null || BI.isEmpty(selected)) {
                BI.each(node.getChildren(), function (i, child) {
                    var newParents = BI.clone(parentValues);
                    newParents.push(child.value);
                    var llen = self._getChildCount(newParents);
                    createOneJson(child, node.id, llen);
                    doCheck(newParents, child, {});
                });
                return;
            }
            BI.each(selected, function (k) {
                var node = self._getTreeNode(parentValues, k);
                var newParents = BI.clone(parentValues);
                newParents.push(node.value);
                createOneJson(node, node.parent && node.parent.id, getCount(selected[k], newParents));
                doCheck(newParents, node, selected[k]);
            });
        }

        function getCount (jo, parentValues) {
            if (jo == null) {
                return 0;
            }
            if (BI.isEmpty(jo)) {
                return self._getChildCount(parentValues);
            }

            return BI.size(jo);
        }

        function createOneJson (node, pId, llen) {
            result.push({
                id: node.id,
                pId: pId,
                text: node.text + (llen > 0 ? ("(" + BI.i18nText("BI-Basic_Altogether") + llen + BI.i18nText("BI-Basic_Count") + ")") : ""),
                value: node.value,
                open: true
            });
        }
    },

    _reqSelectedTreeNode: function (op, callback) {
        var self = this;
        var selectedValues = BI.deepClone(op.selectedValues);
        var notSelectedValue = op.notSelectedValue || {};
        var keyword = op.keyword || "";
        var parentValues = op.parentValues || [];

        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }

        dealWithSelectedValues(selectedValues);
        callback(selectedValues);


        function dealWithSelectedValues (selectedValues) {
            var p = parentValues.concat(notSelectedValue);
            // 存储的值中存在这个值就把它删掉
            // 例如选中了中国-江苏-南京， 取消中国或江苏或南京
            if (canFindKey(selectedValues, p)) {
                // 如果搜索的值在父亲链中
                if (isSearchValueInParent(p)) {
                    // 例如选中了 中国-江苏， 搜索江苏， 取消江苏
                    // 例如选中了 中国-江苏， 搜索江苏， 取消中国
                    self._deleteNode(selectedValues, p);
                } else {
                    var searched = [];
                    var find = search(parentValues, notSelectedValue, [], searched);
                    if (find && BI.isNotEmptyArray(searched)) {
                        BI.each(searched, function (i, arr) {
                            var node = self._getNode(selectedValues, arr);
                            if (node) {
                                // 例如选中了 中国-江苏-南京，搜索南京，取消中国
                                self._deleteNode(selectedValues, arr);
                            } else {
                                // 例如选中了 中国-江苏，搜索南京，取消中国
                                expandSelectedValue(selectedValues, arr, BI.last(arr));
                            }
                        });
                    }
                }
            }

            // 存储的值中不存在这个值，但父亲节点是全选的情况
            // 例如选中了中国-江苏，取消南京
            // important 选中了中国-江苏，取消了江苏，但是搜索的是南京
            if (isChild(selectedValues, p)) {
                var result = [], find = false;
                // 如果parentValues中有匹配的值，说明搜索结果不在当前值下
                if (isSearchValueInParent(p)) {
                    find = true;
                } else {
                    // 从当前值开始搜
                    find = search(parentValues, notSelectedValue, result);
                    p = parentValues;
                }

                if (find === true) {
                    // 去掉点击的节点之后的结果集
                    expandSelectedValue(selectedValues, p, notSelectedValue);
                    // 添加去掉搜索的结果集
                    if (result.length > 0) {
                        BI.each(result, function (i, strs) {
                            self._buildTree(selectedValues, strs);
                        });
                    }
                }
            }

        }

        function expandSelectedValue (selectedValues, parents, notSelectedValue) {
            var next = selectedValues;
            var childrenCount = [];
            var path = [];
            // 去掉点击的节点之后的结果集
            BI.some(parents, function (i, v) {
                var t = next[v];
                if (t == null) {
                    if (i === 0) {
                        return true;
                    }
                    if (BI.isEmpty(next)) {
                        var split = parents.slice(0, i);
                        var expanded = self._getChildren(split);
                        path.push(split);
                        childrenCount.push(expanded.length);
                        // 如果只有一个值且取消的就是这个值
                        if (i === parents.length - 1 && expanded.length === 1 && expanded[0] === notSelectedValue) {
                            for (var j = childrenCount.length - 1; j >= 0; j--) {
                                if (childrenCount[j] === 1) {
                                    self._deleteNode(selectedValues, path[j]);
                                } else {
                                    break;
                                }
                            }
                        } else {
                            BI.each(expanded, function (m, child) {
                                if (i === parents.length - 1 && child.value === notSelectedValue) {
                                    return true;
                                }
                                next[child.value] = {};
                            });
                        }
                        next = next[v];
                    } else {
                        return true;
                        // next = {};
                        // next[v] = {};
                    }
                } else {
                    next = t;
                }
            });
        }

        function search (parents, current, result, searched) {
            var newParents = BI.clone(parents);
            newParents.push(current);
            if (self._isMatch(parents, current, keyword)) {
                searched && searched.push(newParents);
                return true;
            }

            var children = self._getChildren(newParents);

            var notSearch = [];
            var can = false;

            BI.each(children, function (i, child) {
                if (search(newParents, child.value, result, searched)) {
                    can = true;
                } else {
                    notSearch.push(child.value);
                }
            });
            if (can === true) {
                BI.each(notSearch, function (i, v) {
                    var next = BI.clone(newParents);
                    next.push(v);
                    result.push(next);
                });
            }
            return can;
        }

        function isSearchValueInParent (parentValues) {
            for (var i = 0, len = parentValues.length; i < len; i++) {
                if (self._isMatch(parentValues.slice(0, parentValues.length - 1), parentValues[i], keyword)) {
                    return true;
                }
            }
            return false;
        }

        function canFindKey (selectedValues, parents) {
            var t = selectedValues;
            for (var i = 0; i < parents.length; i++) {
                var v = parents[i];
                t = t[v];
                if (t == null) {
                    return false;
                }
            }
            return true;
        }

        function isChild (selectedValues, parents) {
            var t = selectedValues;
            for (var i = 0; i < parents.length; i++) {
                var v = parents[i];
                if (!BI.has(t, v)) {
                    return false;
                }
                t = t[v];
                if (BI.isEmpty(t)) {
                    return true;
                }
            }
            return false;
        }
    },

    _reqAdjustTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var selectedValues = op.selectedValues;
        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }
        BI.each(selectedValues, function (k, v) {
            result.push([k]);
        });

        dealWithSelectedValues(selectedValues, []);

        var jo = {};
        BI.each(result, function (i, strs) {
            self._buildTree(jo, strs);
        });
        callback(jo);

        function dealWithSelectedValues (selected, parents) {
            if (selected == null || BI.isEmpty(selected)) {
                return true;
            }
            var can = true;
            BI.each(selected, function (k, v) {
                var p = BI.clone(parents);
                p.push(k);
                if (!dealWithSelectedValues(selected[k], p)) {
                    BI.each(selected[k], function (nk, nv) {
                        var t = BI.clone(p);
                        t.push(nk);
                        result.push(t);
                    });
                    can = false;
                }
            });
            return can && isAllSelected(selected, parents);
        }

        function isAllSelected (selected, parents) {
            return BI.isEmpty(selected) || self._getChildCount(parents) === BI.size(selected);
        }
    },

    _reqInitTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var keyword = op.keyword || "";
        var selectedValues = op.selectedValues;
        var lastSearchValue = op.lastSearchValue || "";
        var output = search();
        BI.nextTick(function () {
            callback({
                hasNext: output.length > self._const.perPage,
                items: result,
                lastSearchValue: BI.last(output)
            });
        });

        function search () {
            var children = self._getChildren([]);
            var start = children.length;
            if (lastSearchValue !== "") {
                for (var j = 0, len = start; j < len; j++) {
                    if (children[j].value === lastSearchValue) {
                        start = j + 1;
                        break;
                    }
                }
            } else {
                start = 0;
            }
            var output = [];
            for (var i = start, len = children.length; i < len; i++) {
                if (output.length < self._const.perPage) {
                    var find = nodeSearch(1, [], children[i].value, false, result);
                } else if (output.length === self._const.perPage) {
                    var find = nodeSearch(1, [], children[i].value, false, []);
                }
                if (find[0] === true) {
                    output.push(children[i].value);
                }
                if (output.length > self._const.perPage) {
                    break;
                }
            }
            return output;
        }

        function nodeSearch (deep, parentValues, current, isAllSelect, result) {
            if (self._isMatch(parentValues, current, keyword)) {
                var checked = isAllSelect || isSelected(parentValues, current);
                createOneJson(parentValues, current, false, checked, !isAllSelect && isHalf(parentValues, current), true, result);
                return [true, checked];
            }
            var newParents = BI.clone(parentValues);
            newParents.push(current);
            var children = self._getChildren(newParents);

            var can = false, checked = false;

            var isCurAllSelected = isAllSelect || isAllSelected(parentValues, current);
            BI.each(children, function (i, child) {
                var state = nodeSearch(deep + 1, newParents, child.value, isCurAllSelected, result);
                if (state[1] === true) {
                    checked = true;
                }
                if (state[0] === true) {
                    can = true;
                }
            });
            if (can === true) {
                checked = isCurAllSelected || (isSelected(parentValues, current) && checked);
                createOneJson(parentValues, current, true, checked, false, false, result);
            }
            return [can, checked];
        }

        function createOneJson (parentValues, value, isOpen, checked, half, flag, result) {
            var node = self._getTreeNode(parentValues, value);
            result.push({
                id: node.id,
                pId: node.pId,
                text: node.text,
                value: node.value,
                title: node.title,
                isParent: node.getChildrenLength() > 0,
                open: isOpen,
                checked: checked,
                halfCheck: half,
                flag: flag
            });
        }

        function isHalf (parentValues, value) {
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return null;
            }
            return BI.any(find, function (v, ob) {
                if (v === value) {
                    if (ob != null && !BI.isEmpty(ob)) {
                        return true;
                    }
                }
            });
        }

        function isAllSelected (parentValues, value) {
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return null;
            }
            return BI.any(find, function (v, ob) {
                if (v === value) {
                    if (ob != null && BI.isEmpty(ob)) {
                        return true;
                    }
                }
            });
        }

        function isSelected (parentValues, value) {
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return false;
            }
            return BI.any(find, function (v) {
                if (v === value) {
                    return true;
                }
            });
        }

        function findSelectedObj (parentValues) {
            var find = selectedValues;
            if (find == null) {
                return null;
            }
            BI.every(parentValues, function (i, v) {
                find = find[v];
                if (find == null) {
                    return false;
                }
                return true;
            });
            return find;
        }
    },

    _reqTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var times = op.times;
        var checkState = op.checkState || {};
        var parentValues = op.parentValues || [];
        var selectedValues = op.selectedValues || {};
        var valueMap = {};
        // if (judgeState(parentValues, selectedValues, checkState)) {
        valueMap = dealWidthSelectedValue(parentValues, selectedValues);
        // }
        var nodes = this._getChildren(parentValues);
        for (var i = (times - 1) * this._const.perPage; nodes[i] && i < times * this._const.perPage; i++) {
            var state = getCheckState(nodes[i].value, parentValues, valueMap, checkState);
            result.push({
                id: nodes[i].id,
                pId: nodes[i].pId,
                value: nodes[i].value,
                text: nodes[i].text,
                times: 1,
                isParent: nodes[i].getChildrenLength() > 0,
                checked: state[0],
                halfCheck: state[1]
            });
        }
        BI.nextTick(function () {
            callback({
                items: result,
                hasNext: nodes.length > times * self._const.perPage
            });
        });

        function judgeState (parentValues, selected_value, checkState) {
            var checked = checkState.checked, half = checkState.half;
            if (parentValues.length > 0 && !checked) {
                return false;
            }
            return (parentValues.length === 0 || (checked && half) && !BI.isEmpty(selected_value));
        }

        function dealWidthSelectedValue (parentValues, selectedValues) {
            var valueMap = {};
            BI.each(parentValues, function (i, v) {
                selectedValues = selectedValues[v] || {};
            });
            BI.each(selectedValues, function (value, obj) {
                if (BI.isNull(obj)) {
                    valueMap[value] = [0, 0];
                    return;
                }
                if (BI.isEmpty(obj)) {
                    valueMap[value] = [2, 0];
                    return;
                }
                var nextNames = {};
                BI.each(obj, function (t, o) {
                    if (BI.isNull(o) || BI.isEmpty(o)) {
                        nextNames[t] = true;
                    }
                });
                valueMap[value] = [1, BI.size(nextNames)];
            });
            return valueMap;
        }

        function getCheckState (current, parentValues, valueMap, checkState) {
            var checked = checkState.checked, half = checkState.half;
            var tempCheck = false, halfCheck = false;
            if (BI.has(valueMap, current)) {
                // 可能是半选
                if (valueMap[current][0] === 1) {
                    var values = BI.clone(parentValues);
                    values.push(current);
                    var childCount = self._getChildCount(values);
                    if (childCount > 0 && childCount !== valueMap[current][1]) {
                        halfCheck = true;
                    }
                } else if (valueMap[current][0] === 2) {
                    tempCheck = true;
                }
            }
            var check;
            if (!checked && !halfCheck && !tempCheck) {
                check = BI.has(valueMap, current);
            } else {
                check = ((tempCheck || checked) && !half) || BI.has(valueMap, current);
            }
            return [check, halfCheck];
        }
    },

    _getNode: function (selectedValues, parentValues) {
        var pNode = selectedValues;
        for (var i = 0, len = parentValues.length; i < len; i++) {
            if (pNode == null) {
                return null;
            }
            pNode = pNode[parentValues[i]];
        }
        return pNode;
    },

    _deleteNode: function (selectedValues, values) {
        var name = values[values.length - 1];
        var p = values.slice(0, values.length - 1);
        var pNode = this._getNode(selectedValues, p);
        if (pNode != null && pNode[name]) {
            delete pNode[name];
            // 递归删掉空父节点
            while (p.length > 0 && BI.isEmpty(pNode)) {
                name = p[p.length - 1];
                p = p.slice(0, p.length - 1);
                pNode = this._getNode(selectedValues, p);
                if (pNode != null) {
                    delete pNode[name];
                }
            }
        }
    },

    _buildTree: function (jo, values) {
        var t = jo;
        BI.each(values, function (i, v) {
            if (!BI.has(t, v)) {
                t[v] = {};
            }
            t = t[v];
        });
    },

    _isMatch: function (parentValues, value, keyword) {
        var node = this._getTreeNode(parentValues, value);
        var find = BI.Func.getSearchResult([node.text || node.value], keyword);
        return find.find.length > 0 || find.match.length > 0;
    },

    _getTreeNode: function (parentValues, v) {
        var self = this;
        var findParentNode;
        var index = 0;
        this.tree.traverse(function (node) {
            if (self.tree.isRoot(node)) {
                return;
            }
            if (index > parentValues.length) {
                return false;
            }
            if (index === parentValues.length && node.value === v) {
                findParentNode = node;
                return false;
            }
            if (node.value === parentValues[index]) {
                index++;
                return;
            }
            return true;
        });
        return findParentNode;
    },

    _getChildren: function (parentValues) {
        if (parentValues.length > 0) {
            var value = BI.last(parentValues);
            var parent = this._getTreeNode(parentValues.slice(0, parentValues.length - 1), value);
        } else {
            var parent = this.tree.getRoot();
        }
        return parent.getChildren();
    },

    _getChildCount: function (parentValues) {
        return this._getChildren(parentValues).length;
    }
});/**
 * 简单的复选下拉树控件, 适用于数据量少的情况
 *
 * Created by GUY on 2015/10/29.
 * @class BI.TreeValueChooserCombo
 * @extends BI.Widget
 */
BI.TreeValueChooserCombo = BI.inherit(BI.AbstractTreeValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.TreeValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-value-chooser-combo",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.TreeValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this._initData(o.items);
        }
        this.combo = BI.createWidget({
            type: "bi.multi_tree_combo",
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height
        });

        this.combo.on(BI.MultiTreeCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.TreeValueChooserCombo.EVENT_CONFIRM);
        });
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    populate: function () {
        this.combo.populate.apply(this.combo, arguments);
    }
});
BI.TreeValueChooserCombo.EVENT_CONFIRM = "TreeValueChooserCombo.EVENT_CONFIRM";
BI.shortcut("bi.tree_value_chooser_combo", BI.TreeValueChooserCombo);/**
 * 简单的复选下拉树控件, 适用于数据量少的情况
 *
 * Created by GUY on 2015/10/29.
 * @class BI.TreeValueChooserPane
 * @extends BI.AbstractTreeValueChooser
 */
BI.TreeValueChooserPane = BI.inherit(BI.AbstractTreeValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.TreeValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-value-chooser-pane",
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.TreeValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.pane = BI.createWidget({
            type: "bi.multi_select_tree",
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this)
        });

        this.pane.on(BI.MultiSelectTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.TreeValueChooserPane.EVENT_CHANGE);
        });
        if (BI.isNotNull(o.items)) {
            this._initData(o.items);
            this.populate();
        }
    },

    setSelectedValue: function (v) {
        this.pane.setSelectedValue(v);
    },

    setValue: function (v) {
        this.pane.setValue(v);
    },

    getValue: function () {
        return this.pane.getValue();
    },

    populate: function () {
        this.pane.populate.apply(this.pane, arguments);
    }
});
BI.TreeValueChooserPane.EVENT_CHANGE = "TreeValueChooserPane.EVENT_CHANGE";
BI.shortcut("bi.tree_value_chooser_pane", BI.TreeValueChooserPane);/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AbstractValueChooser
 * @extends BI.Widget
 */
BI.AbstractValueChooser = BI.inherit(BI.Widget, {

    _const: {
        perPage: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractValueChooser.superclass._defaultConfig.apply(this, arguments), {
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _valueFormatter: function (v) {
        var text = v;
        if (BI.isNotNull(this.items)) {
            BI.some(this.items, function (i, item) {
                // 把value都换成字符串
                if (item.value + "" === v) {
                    text = item.text;
                    return true;
                }
            });
        }
        return text;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * this._const.perPage; items[i] && i < times * this._const.perPage; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * this._const.perPage < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this, o = this.options;
        if (!o.cache || !this.items) {
            o.itemsCreator({}, function (items) {
                self.items = items;
                call(items);
            });
        } else {
            call(this.items);
        }
        function call (items) {
            var keywords = (options.keywords || []).slice();
            BI.each(keywords, function (i, kw) {
                var search = BI.Func.getSearchResult(items, kw);
                items = search.match.concat(search.find);
            });
            if (options.selectedValues) {// 过滤
                var filter = BI.makeObject(options.selectedValues, true);
                items = BI.filter(items, function (i, ob) {
                    return !filter[ob.value];
                });
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
                callback({
                    items: items
                });
                return;
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
                callback({count: items.length});
                return;
            }
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }
    }
});/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.ValueChooserCombo
 * @extends BI.Widget
 */
BI.ValueChooserCombo = BI.inherit(BI.AbstractValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.ValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-value-chooser-combo",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.ValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.combo = BI.createWidget({
            type: "bi.multi_select_combo",
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height
        });

        this.combo.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.ValueChooserCombo.EVENT_CONFIRM);
        });
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        var val = this.combo.getValue() || {};
        return {
            type: val.type,
            value: val.value
        };
    },

    populate: function () {
        this.combo.populate.apply(this, arguments);
    }
});
BI.ValueChooserCombo.EVENT_CONFIRM = "ValueChooserCombo.EVENT_CONFIRM";
BI.shortcut("bi.value_chooser_combo", BI.ValueChooserCombo);/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.ValueChooserPane
 * @extends BI.Widget
 */
BI.ValueChooserPane = BI.inherit(BI.AbstractValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.ValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-value-chooser-pane",
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.ValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.list = BI.createWidget({
            type: "bi.multi_select_list",
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this)
        });

        this.list.on(BI.MultiSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.ValueChooserPane.EVENT_CHANGE);
        });
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
            this.populate();
        }
    },

    setValue: function (v) {
        this.list.setValue(v);
    },

    getValue: function () {
        var val = this.list.getValue() || {};
        return {
            type: val.type,
            value: val.value
        };
    },

    populate: function () {
        this.list.populate.apply(this.list, arguments);
    }
});
BI.ValueChooserPane.EVENT_CHANGE = "ValueChooserPane.EVENT_CHANGE";
BI.shortcut("bi.value_chooser_pane", BI.ValueChooserPane);