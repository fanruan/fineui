/**
 * Created by roy on 15/9/14.
 */
BI.FunctionPane = BI.inherit(BI.Widget, {
    constants: {
        search_height: 20,
        height: 200,
        width: 370,
        column_size_editor: 170,
        column_size_right: 200,
        row_size: 30,
        hgap: 10,
        vgap: 10,
        hgap_offset: 5
    },
    _defaultConfig: function () {
        var conf = BI.FunctionPane.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-formula-function-pane",
            width: 320,
            height: 200,
            items: []
        })
    },
    _init: function () {
        BI.FunctionPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this.constants;


        this.desLabel = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "normal",
            textWidth: 180
        });

        this.searchFunctionTree = BI.createWidget({
            type: "bi.function_tree",
            cls: "style-top",
            redmark: function (val, ob) {
                return true
            }
        });

        this.functiontree = BI.createWidget({
            type: "bi.function_tree",
            cls: "style-top",
            items: o.items
        });


        this.searcher = BI.createWidget({
            type: "bi.searcher",
            adapter: this.functiontree,
            isAutoSearch: false,
            onSearch: function (op, populate) {
                var keyword = op.keyword.toLowerCase();
                var resultArray = [];
                BI.each(o.items, function (i, item) {
                    if (item.value.toLowerCase().indexOf(keyword) > -1 && !BI.isEmptyString(keyword)) {
                        resultArray.push(item);
                    }
                });
                populate(resultArray, keyword);
            },
            el: {
                type: "bi.small_search_editor"
            },
            popup: {
                type: "bi.function_searcher_pane",
                searcher: self.searchFunctionTree
            },
            height: 25,
            width: 160
        });


        this.functionLabel = BI.createWidget({
            type: "bi.label"
        });

        BI.createWidget({
            element: this,
            type: "bi.window",
            width: c.width,
            cls: "style-out",
            columns: 2,
            rows: 2,
            columnSize: [c.column_size_editor, c.column_size_right],
            rowSize: [c.row_size, 'fill'],
            items: [
                [
                    {

                        el: {
                            type: "bi.center_adapt",
                            hgap: c.hgap_offset,
                            items: [
                                {
                                    el: self.searcher
                                }
                            ]


                        }
                    },
                    {
                        el: {
                            type: "bi.center_adapt",
                            cls: "style-left",
                            items: [
                                {
                                    type: "bi.left",
                                    hgap: c.hgap,
                                    items: [
                                        {
                                            el: self.functionLabel
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ], [
                    {
                        el: self.functiontree
                    },
                    {
                        el: {
                            type: "bi.absolute",
                            cls: "style-inner",
                            items: [
                                {
                                    el: self.desLabel,
                                    left: c.hgap,
                                    right: c.hgap,
                                    top: c.hgap,
                                    bottom: c.hgap
                                }
                            ]
                        }
                    }
                ]
            ]
        });

        self.functiontree.on(BI.FunctionTree.FUNCTION_INSERT, function (value) {
            self.fireEvent(BI.FunctionPane.EVENT_INSET, value)
        });

        self.functiontree.on(BI.FunctionTree.EVENT_DESCRIPTION_CHANGE, function (v) {
            self.desLabel.setText(v);
        });

        self.functiontree.on(BI.FunctionTree.EVENT_CHANGE, function (v) {
            self.functionLabel.setText(v);
        });

        self.searchFunctionTree.on(BI.FunctionTree.FUNCTION_INSERT, function (value) {
            self.fireEvent(BI.FunctionPane.EVENT_INSET, value)
        });

        self.searchFunctionTree.on(BI.FunctionTree.EVENT_DESCRIPTION_CHANGE, function (v) {
            self.desLabel.setText(v);
        });

        self.searchFunctionTree.on(BI.FunctionTree.EVENT_CHANGE, function (v) {
            self.functionLabel.setText(v);
        });

    }

});
BI.FunctionPane.EVENT_INSET = "EVENT_INSET";
$.shortcut("bi.function_pane", BI.FunctionPane);