/**
 * 用于设置背景图的区域
 * @class BI.BackgroundImage
 * @extends BI.Single
 */
BI.BackgroundImage = BI.inherit(BI.Single, {
    props: {
        baseCls: "bi-background-image",
        url: "",
        width: "100%",
        height: "100%"
    },

    render: function () {
        this.setUrl(this.options.url);
    },

    setUrl: function (url) {
        this.options.url = url;
        this.element.css({
            "background-image": "url(" + url + ")"
        });
    },

    getUrl: function () {
        return this.options.url;
    }
});

BI.shortcut("bi.background_image", BI.BackgroundImage);
