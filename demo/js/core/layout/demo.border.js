/**
 * Created by User on 2017/3/22.
 */
Demo.BorderLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-border"
    },

    _createNorth: function(){
        return BI.createWidget({
            type: "bi.label",
            text: "North",
            cls: "layout-bg1",
            height: 30
        })
    },

    _createWest: function(){
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg2",
            items:[{
                type: "bi.label",
                text: "West",
                whiteSpace: "normal"
            }]
        })
    },

    _createCenter: function(){
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg3",
            items: [{
                type: "bi.label",
                text: "Center",
                whiteSpace: "normal"
            }]
        })
    },

    _createEast: function(){
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg5",
            items: [{
                type: "bi.label",
                text: "East",
                whiteSpace: "normal"
            }]
        })
    },

    _createSouth: function(){
        return BI.createWidget({
            type: "bi.label",
            text: "South",
            cls: "layout-bg6",
            height: 50
        })
    },

    render: function () {
        return {
            type: "bi.border",
            cls: "",
            items: {
                north: {
                    el: this._createNorth(),
                    height: 30,
                    top: 20,
                    left: 20,
                    right: 20
                },
                south: {
                    el: this._createSouth(),
                    height: 50,
                    bottom: 20,
                    left: 20,
                    right: 20
                },
                west: {
                    el: this._createWest(),
                    width: 200,
                    left: 20
                },
                east: {
                    el: this._createEast(),
                    width: 300,
                    right: 20
                },
                center: this._createCenter()
            }
        }
    }
});
$.shortcut("demo.border", Demo.BorderLayout);