!(function () {
    var i18nStore = {};
    _.extend(BI, {
        changeI18n: function (i18n) {
            if (i18n) {
                i18nStore = i18n;
            }
        },
        addI18n: function (i18n) {
            BI.extend(i18nStore, i18n);
        },
        i18nText: function (key) {
            var localeText = i18nStore[key] || (BI.i18n && BI.i18n[key]) || "";
            if (!localeText) {
                localeText = key;
            }
            var len = arguments.length;
            if (len > 1) {
                if (localeText.indexOf("{R1}") > -1) {
                    for (var i = 1; i < len; i++) {
                        var key = "{R" + i + "}";
                        localeText = BI.replaceAll(localeText, key, arguments[i] + "");
                    }
                } else {
                    var args = Array.prototype.slice.call(arguments);
                    var count = 1;
                    return BI.replaceAll(localeText, "\\{\\s*\\}", function () {
                        return args[count++] + "";
                    });
                }
            }
            return localeText;
        }
    });
})();
