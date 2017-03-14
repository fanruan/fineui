BI.ChartCombineFormatItemFactory = {
    combineItems: function (types, items) {
        var calItems = BI.values(items);
        return BI.map(calItems, function (idx, item) {
            return BI.ChartCombineFormatItemFactory.formatItems(types[idx], item);
        });
    },

    formatItems: function (type, items) {
        var item = {};
        switch (type) {
            case BICst.WIDGET.BAR:
            case BICst.WIDGET.ACCUMULATE_BAR:
            case BICst.WIDGET.COMPARE_BAR:
                item = BI.extend({"type": "bar"}, items);
                break;
            case BICst.WIDGET.BUBBLE:
            case BICst.WIDGET.FORCE_BUBBLE:
                item = BI.extend({"type": "bubble"}, items);
                break;
            case BICst.WIDGET.SCATTER:
                item = BI.extend({"type": "scatter"}, items);
                break;
            case BICst.WIDGET.AXIS:
            case BICst.WIDGET.ACCUMULATE_AXIS:
            case BICst.WIDGET.PERCENT_ACCUMULATE_AXIS:
            case BICst.WIDGET.COMPARE_AXIS:
            case BICst.WIDGET.FALL_AXIS:
                item = BI.extend({"type": "column"}, items);
                break;
            case BICst.WIDGET.LINE:
                item = BI.extend({"type": "line"}, items);
                break;
            case BICst.WIDGET.AREA:
            case BICst.WIDGET.ACCUMULATE_AREA:
            case BICst.WIDGET.COMPARE_AREA:
            case BICst.WIDGET.RANGE_AREA:
            case BICst.WIDGET.PERCENT_ACCUMULATE_AREA:
                item = BI.extend({"type": "area"}, items);
                break;
            case BICst.WIDGET.DONUT:
                item = BI.extend({"type": "pie"}, items);
                break;
            case BICst.WIDGET.RADAR:
            case BICst.WIDGET.ACCUMULATE_RADAR:
                item = BI.extend({"type": "radar"}, items);
                break;
            case BICst.WIDGET.PIE:
                item = BI.extend({"type": "pie"}, items);
                break;
            case BICst.WIDGET.DASHBOARD:
                item = BI.extend({"type": "gauge"}, items);
                break;
            case BICst.WIDGET.MAP:
                item = BI.extend({"type": "areaMap"}, items);
                break;
            case BICst.WIDGET.GIS_MAP:
                item = BI.extend({"type": "pointMap"}, items);
                break;
            default:
                item = BI.extend({"type": "column"}, items);
                break;
        }
        return item;
    },

    combineConfig: function () {
        return {
            "plotOptions": {
                "rotatable": false,
                "startAngle": 0,
                "borderRadius": 0,
                "endAngle": 360,
                "innerRadius": "0.0%",

                "layout": "horizontal",
                "hinge": "rgb(101,107,109)",
                "dataLabels": {
                    "style": {fontFamily: "inherit", color: "#808080", fontSize: "12px"},
                    "formatter": {
                        "identifier": "${VALUE}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat,
                        "XFormat": this._contentFormat2Decimal,
                        "YFormat": this._contentFormat2Decimal,
                        "sizeFormat": this._contentFormat2Decimal
                    },
                    "align": "outside",
                    "enabled": false
                },
                "percentageLabel": {
                    "formatter": {
                        "identifier": "${PERCENT}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "style": {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#808080", "fontSize": "12px"
                    },
                    "align": "bottom",
                    "enabled": true
                },
                "valueLabel": {
                    "formatter": {
                        "identifier": "${SERIES}${VALUE}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "backgroundColor": "rgb(255,255,0)",
                    "style": {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#808080", "fontSize": "12px"
                    },
                    "align": "inside",
                    "enabled": true
                },
                "hingeBackgroundColor": "rgb(220,242,249)",
                "seriesLabel": {
                    "formatter": {
                        "identifier": "${CATEGORY}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "style": {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#808080", "fontSize": "12px"
                    },
                    "align": "bottom",
                    "enabled": true
                },
                "style": "pointer",
                "paneBackgroundColor": "rgb(252,252,252)",
                "needle": "rgb(229,113,90)",


                "large": false,
                "connectNulls": false,
                "shadow": true,
                "curve": false,
                "sizeBy": "area",
                "tooltip": {
                    "formatter": {
                        "identifier": "${SERIES}${X}${Y}${SIZE}{CATEGORY}${SERIES}${VALUE}",
                        "valueFormat": "function(){return window.FR ? FR.contentFormat(arguments[0], '#.##') : arguments[0];}",
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat,
                        "XFormat": this._contentFormat2Decimal,
                        "sizeFormat": this._contentFormat2Decimal,
                        "YFormat": this._contentFormat2Decimal
                    },
                    "shared": false,
                    "padding": 5,
                    "backgroundColor": "rgba(0,0,0,0.4980392156862745)",
                    "borderColor": "rgb(0,0,0)",
                    "shadow": false,
                    "borderRadius": 2,
                    "borderWidth": 0,
                    "follow": false,
                    "enabled": true,
                    "animation": true,
                    style: {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3",
                        "color": "#c4c6c6",
                        "fontSize": "12px",
                        "fontWeight": ""
                    }
                },
                "maxSize": 80,
                "fillColorOpacity": 1.0,
                "step": false,
                "force": false,
                "minSize": 15,
                "displayNegative": true,
                "categoryGap": "16.0%",
                "borderColor": "rgb(255,255,255)",
                "borderWidth": 1,
                "gap": "22.0%",
                "animation": true,
                "lineWidth": 2,

                bubble: {
                    "large": false,
                    "connectNulls": false,
                    "shadow": true,
                    "curve": false,
                    "sizeBy": "area",
                    "maxSize": 80,
                    "minSize": 15,
                    "lineWidth": 0,
                    "animation": true,
                    "fillColorOpacity": 0.699999988079071,
                    "marker": {
                        "symbol": "circle",
                        "radius": 28.39695010101295,
                        "enabled": true
                    }
                }
            },
            dTools: {
                enabled: false,
                style: {
                    fontFamily: "Microsoft YaHei, Hiragino Sans GB W3",
                    color: "#1a1a1a",
                    fontSize: "12px"
                },
                backgroundColor: 'white'
            },
            dataSheet: {
                enabled: false,
                "borderColor": "rgb(0,0,0)",
                "borderWidth": 1,
                "formatter": this._contentFormat2Decimal,
                style: {
                    "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#808080", "fontSize": "12px"
                }
            },
            "borderColor": "rgb(238,238,238)",
            "shadow": false,
            "legend": {
                "borderColor": "rgb(204,204,204)",
                "borderRadius": 0,
                "shadow": false,
                "borderWidth": 0,
                "visible": true,
                "style": {
                    "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#1a1a1a", "fontSize": "12px"
                },
                "position": "right",
                "enabled": false
            },
            "rangeLegend": {
                "range": {
                    "min": 0,
                    "color": [
                        [
                            0,
                            "rgb(182,226,255)"
                        ],
                        [
                            0.5,
                            "rgb(109,196,255)"
                        ],
                        [
                            1,
                            "rgb(36,167,255)"
                        ]
                    ],
                    "max": 266393
                },
                "enabled": false
            },
            "zoom": {"zoomType": "xy", "zoomTool": {"visible": false, "resize": true, "from": "", "to": ""}},
            "plotBorderColor": "rgba(255,255,255,0)",
            "tools": {
                "hidden": true,
                "toImage": {"enabled": true},
                "sort": {"enabled": true},
                "enabled": false,
                "fullScreen": {"enabled": true}
            },
            "plotBorderWidth": 0,
            "colors": ["rgb(99,178,238)", "rgb(118,218,145)"],
            "borderRadius": 0,
            "borderWidth": 0,
            "style": "normal",
            "plotShadow": false,
            "plotBorderRadius": 0
        };
    },

    _contentFormat: function () {
        return BI.contentFormat(arguments[0], '')
    },

    _contentFormat2Decimal: function () {
        return BI.contentFormat(arguments[0], '#.##')
    },

    _contentFormatPercentage: function () {
        return BI.contentFormat(arguments[0], '#.##%')
    }
};