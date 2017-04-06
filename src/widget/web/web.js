/**
 * web组件
 * Created by GameJian on 2016/3/1.
 */
BI.WebPage = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.WebPage.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-web-page"
        })
    },

    _init: function () {
        BI.WebPage.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.iframe = BI.createWidget({
            type: "bi.iframe"
        });

        this.label = BI.createWidget({
            type: "bi.label",
            cls: "web-page-text-button-label",
            whiteSpace: "normal",
            text: BI.i18nText("BI-Not_Add_Url")
        });

        this.del = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.icon_button",
                cls: "web-page-button img-shutdown-font",
                title: BI.i18nText("BI-Basic_Delete"),
                height: 24,
                width: 24
            },
            popup: {
                type: "bi.bubble_bar_popup_view",
                buttons: [{
                    value: BI.i18nText(BI.i18nText("BI-Basic_Sure")),
                    handler: function () {
                        self.fireEvent(BI.WebPage.EVENT_DESTROY)
                    }
                }, {
                    value: BI.i18nText("BI-Basic_Cancel"),
                    level: "ignore",
                    handler: function () {
                        self.del.hideView();
                    }
                }],
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        type: "bi.label",
                        text: BI.i18nText("BI-Sure_Delete_Current_Component"),
                        cls: "web-page-delete-label",
                        textAlign: "left",
                        width: 300
                    }],
                    width: 300,
                    height: 100,
                    hgap: 20
                },
                maxHeight: 140,
                minWidth: 340
            },
            invisible: true,
            stopPropagation: true
        });


        this.href = BI.createWidget({
            type: "bi.image_button_href",
            cls: "web-page-button"
        });

        this.href.on(BI.ImageButtonHref.EVENT_CHANGE, function () {
            var url = this.getValue();
            self.setValue(this.getValue());
            self._checkUrl(url);
            self.fireEvent(BI.WebPage.EVENT_VALUE_CHANGE);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.iframe
            }, {
                el: this.del,
                right: 4,
                top: 8
            }, {
                el: this.href,
                right: 36,
                top: 8
            }, {
                el: this.label,
                top: 32,
                left: 0,
                bottom: 0,
                right: 0
            }]
        });

        this.setToolbarVisible(false);
        this._showLabel();
    },

    _checkUrl: function(url){
        BI.Bubbles.hide(this.getName());
        if(BI.isEmptyString(url)){
            BI.Bubbles.show(this.getName(), BI.i18nText("BI-Click_To_Add_Hyperlink"), this.href, {
                offsetStyle: "left"
            });
        }
    },

    _hideLabel: function () {
        this.label.invisible()
    },

    isSelected: function () {
        return this.href.isSelected();
    },

    _showLabel: function () {
        this.label.visible()
    },

    setToolbarVisible: function (v) {
        this.href.setVisible(v);
        this.del.setVisible(v);
    },

    getValue: function () {
        return this.href.getValue()
    },

    setValue: function (url) {
        var self = this;
        if (BI.isNotEmptyString(url)) {
            self._hideLabel();
        } else {
            this.setToolbarVisible(true);
            this.href.showView();
        }
        this.href.setValue(url);
        this.iframe.setSrc(BI.Func.formatAddress(url))
    }
});

BI.WebPage.EVENT_DESTROY = "EVENT_DESTROY";
BI.WebPage.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.shortcut("bi.web_page", BI.WebPage);