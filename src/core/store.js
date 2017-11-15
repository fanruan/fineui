;(function () {
    var kv = {};
    BI.stores = function (xtype, cls) {
        if (kv[xtype] != null) {
            throw ("stores:[" + xtype + "] has been registed");
        }
        kv[xtype] = cls;
    };

    var stores = {};

    BI.Stores = {
        getStore: function (type, config) {
            if (stores[type]) {
                return stores[type];
            }
            return stores[type] = new kv[type](config);
        }
    }
})();
