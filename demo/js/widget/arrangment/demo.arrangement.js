Demo.Arrangement = BI.inherit(BI.Widget, {

    beforeCreate: function () {
        this.index = 0;
    },

    _createItem: function () {
        var self = this;
        var item = BI.createWidget({
            type: "bi.text_button",
            id: this.index,
            text: "点我删掉",
            cls: "layout-bg" + BI.random(1, 8),
            handler: function () {
                self.arrangement.deleteRegion(this.attr("id"));
            }
        });
        this.index++;
        return item;
    },

    render: function () {
        var self = this;
        this.arrangement = BI.createWidget({
            type: "bi.arrangement",
            layoutType: BI.Arrangement.LAYOUT_TYPE.GRID,
            cls: "bi-border",
            width: 800,
            height: 400,
            items: []
        });
        var drag = BI.createWidget({
            type: "bi.label",
            cls: "bi-border",
            width: 70,
            height: 25,
            text: "drag me"
        });

        drag.element.draggable({
            revert: true,
            cursorAt: {left: 0, top: 0},
            drag: function (e, ui) {
                self.arrangement.setPosition({
                    left: ui.position.left,
                    top: ui.position.top
                }, {
                    width: 300,
                    height: 200
                })
            },
            stop: function (e, ui) {
                self.arrangement.addRegion({
                    el: self._createItem()
                });
            },
            helper: function (e) {
                var helper = self.arrangement.getHelper();
                return helper.element;
            }
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: drag,
                left: 30,
                top: 450
            }, {
                el: this.arrangement,
                left: 30,
                top: 30
            }, {
                el: {
                    type: "bi.button",
                    text: "getAllRegions",
                    height: 25,
                    handler: function () {
                        var items = [];
                        BI.each(self.arrangement.getAllRegions(), function (i, region) {
                            items.push({
                                id: region.id,
                                left: region.left,
                                top: region.top,
                                width: region.width,
                                height: region.height
                            });
                        });
                        BI.Msg.toast(JSON.stringify(items));
                    }
                },
                left: 230,
                top: 450
            }]
        });
    }
});

BI.shortcut("demo.arrangement", Demo.Arrangement);