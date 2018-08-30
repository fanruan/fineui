/**
 * style加载管理器
 *
 * Created by GUY on 2015/9/7.
 * @class
 */
BI.StyleLoaderManager = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.StyleLoaderManager.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.StyleLoaderManager.superclass._init.apply(this, arguments);
        this.stylesManager = {};
    },

    loadStyle: function (name, styleString) {
        if(!_global.document) {
            return;
        }
        var d = document, styles = d.createElement("style");
        d.getElementsByTagName("head")[0].appendChild(styles);
        styles.setAttribute("type", "text/css");
        if (styles.styleSheet) {
            styles.styleSheet.cssText = styleString;
        } else {
            styles.appendChild(document.createTextNode(styleString));
        }
        this.stylesManager[name] = styles;

        return this;
    },

    get: function (name) {
        return this.stylesManager[name];
    },

    has: function (name) {
        return this.stylesManager[name] != null;
    },

    removeStyle: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.stylesManager[name].parentNode.removeChild(this.stylesManager[name]);
        delete this.stylesManager[name];
        return this;
    }
});