/**
 * Created by guy on 2018/01/23.
 */
describe("contextTest", function () {

    before(function () {
    });

    /**
     * test_author_guy
     */
    it("context测试", function () {

        var ParentStore = BI.inherit(Fix.Model, {
            state: function () {
                return {
                    context: "默认context"
                };
            },
            childContext: ["context"]
        });
        BI.model("demo.model.parent_store", ParentStore);

        var ChildStore = BI.inherit(Fix.Model, {
            context: ["context"],
            computed: {
                currContext: function () {
                    return this.model.context;
                }
            },
            actions: {
                changeContext: function () {
                    this.model.context = "改变后的context";
                }
            }
        });
        BI.model("demo.model.child_store", ChildStore);

        var Label = BI.inherit(BI.Widget, {
            _store: function () {
                return BI.Models.getModel("demo.model.child_store");
            },
            render: function () {
                return {
                    type: "bi.label",
                    text: this.model.currContext
                };
            }
        });
        BI.shortcut("demo.label", Label);

        var Demo = BI.inherit(BI.Widget, {
            _store: function () {
                return BI.Models.getModel("demo.model.parent_store");
            },

            render: function () {
                var self = this;
                return {
                    type: "demo.label",
                    ref: function (_ref) {
                        self.child = _ref;
                    }
                };
            }
        });
        BI.shortcut("demo.demo", Demo);

        var demo = BI.Test.createWidget({
            type: "demo.demo"
        });

        expect(demo.child.model.currContext).to.equal("默认context");
        demo.child.store.changeContext();
        expect(demo.model.context).to.equal("改变后的context");
        demo.destroy();

    });

    /**
     * test_author_guy
     */
    it("异步context测试-loader的populate测试", function (done) {

        var ParentStore = BI.inherit(Fix.Model, {
            state: function () {
                return {
                    context: "默认context"
                };
            },
            childContext: ["context"]
        });
        BI.model("demo.model.parent_store", ParentStore);

        var ChildStore = BI.inherit(Fix.Model, {
            context: ["context"],
            computed: {
                currContext: function () {
                    return this.model.context;
                }
            },
            actions: {
                changeContext: function () {
                    this.model.context = "改变后的context";
                }
            }
        });
        BI.model("demo.model.child_store", ChildStore);

        var Label = BI.inherit(BI.Widget, {
            _store: function () {
                return BI.Models.getModel("demo.model.child_store");
            },
            render: function () {
                return {
                    type: "bi.label",
                    text: this.model.currContext
                };
            }
        });
        BI.shortcut("demo.label", Label);

        var Demo = BI.inherit(BI.Widget, {
            _store: function () {
                return BI.Models.getModel("demo.model.parent_store");
            },

            render: function () {
                var items = BI.map([1, 2, 3], function (i, v) {
                    return {
                        text: v,
                        value: v,
                        title: v
                    };
                });
                var self = this;
                this.labels = {};
                return {
                    type: "bi.loader",
                    ref: function (_ref) {
                        self.child = _ref;
                    },
                    itemsCreator: function (options, populate) {
                        setTimeout(function () {
                            populate(BI.map(items.slice((options.times - 1) * 10, options.times * 10), function (i, v) {
                                return BI.extend(v, {
                                    type: "demo.label",
                                    ref: function (_ref) {
                                        self.labels[i] = _ref;
                                    },
                                    height: 25
                                });
                            }));
                        }, 0);
                    },
                    hasNext: function (options) {
                        return options.times * 10 < items.length;
                    }
                };
            }
        });
        BI.shortcut("demo.demo", Demo);

        var demo = BI.Test.createWidget({
            type: "demo.demo"
        });
        demo.child.populate();

        setTimeout(function () {
            expect(demo.labels[0].model.currContext).to.equal("默认context");
            demo.destroy();
            done();
        }, 0);
    });

    /**
     * test_author_guy
     */
    it("异步context测试-beforeInit测试", function (done) {

        var ParentStore = BI.inherit(Fix.Model, {
            state: function () {
                return {
                    context: "默认context"
                };
            },
            childContext: ["context"]
        });
        BI.model("demo.model.parent_store", ParentStore);

        var ChildStore = BI.inherit(Fix.Model, {
            context: ["context"],
            computed: {
                currContext: function () {
                    return this.model.context;
                }
            },
            actions: {
                changeContext: function () {
                    this.model.context = "改变后的context";
                }
            }
        });
        BI.model("demo.model.child_store", ChildStore);

        var Label = BI.inherit(BI.Widget, {
            _store: function () {
                return BI.Models.getModel("demo.model.child_store");
            },
            render: function () {
                return {
                    type: "bi.label",
                    text: this.model.currContext
                };
            }
        });
        BI.shortcut("demo.label", Label);

        var Demo = BI.inherit(BI.Widget, {
            _store: function () {
                return BI.Models.getModel("demo.model.parent_store");
            },

            beforeInit: function (callback) {
                setTimeout(callback, 0);
            },

            render: function () {
                var self = this;
                return {
                    type: "demo.label",
                    ref: function (_ref) {
                        self.child = _ref;
                    }
                };
            }
        });
        BI.shortcut("demo.demo", Demo);

        var demo = BI.Test.createWidget({
            type: "demo.demo"
        });

        setTimeout(function () {
            expect(demo.child.model.currContext).to.equal("默认context");
            demo.destroy();
            done();
        }, 0);
    });

    /**
     * test_author_guy
     */
    it("inject测试", function () {

        var ParentStore = BI.inherit(Fix.Model, {
            state: function () {
                return {
                    context: "默认context"
                };
            },
            childContext: ["context"]
        });
        BI.model("demo.model.parent_store", ParentStore);

        var ChildStore = BI.inherit(Fix.Model, {
            inject: ["context"],
            computed: {
                currContext: function () {
                    return this.model.context;
                }
            },
            actions: {
                changeContext: function () {
                    this.model.context = "改变后的context";
                }
            }
        });
        BI.model("demo.model.child_store", ChildStore);

        var Label = BI.inherit(BI.Widget, {
            _store: function () {
                return BI.Models.getModel("demo.model.child_store");
            },
            render: function () {
                return {
                    type: "bi.label",
                    text: this.model.currContext
                };
            }
        });
        BI.shortcut("demo.label", Label);

        var Demo = BI.inherit(BI.Widget, {
            _store: function () {
                return BI.Models.getModel("demo.model.parent_store");
            },

            render: function () {
                var self = this;
                return {
                    type: "demo.label",
                    ref: function (_ref) {
                        self.child = _ref;
                    }
                };
            }
        });
        BI.shortcut("demo.demo", Demo);

        var demo = BI.Test.createWidget({
            type: "demo.demo"
        });

        expect(demo.child.model.currContext).to.equal("默认context");
        demo.child.store.changeContext();
        expect(demo.model.context).to.equal("默认context");
        demo.destroy();

    });

});
