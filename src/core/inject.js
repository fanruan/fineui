;(function () {
    var constantInjection = {};
    BI.constant = function (xtype, cls) {
        if (constantInjection[xtype] != null) {
            throw ("constant:[" + xtype + "] has been registed");
        }
        constantInjection[xtype] = cls;
    };

    var modelInjection = {};
    BI.model = function (xtype, cls) {
        if (modelInjection[xtype] != null) {
            throw ("model:[" + xtype + "] has been registed");
        }
        modelInjection[xtype] = cls;
    };

    var storeInjection = {};
    BI.store = function (xtype, cls) {
        if (storeInjection[xtype] != null) {
            throw ("store:[" + xtype + "] has been registed");
        }
        storeInjection[xtype] = cls;
    };

    var providerInjection = {};
    BI.provider = function (xtype, cls) {
        if (providerInjection[xtype] != null) {
            throw ("provider:[" + xtype + "] has been registed");
        }
        providerInjection[xtype] = cls;
    };

    BI.config = function (type, configFn) {
        if (constantInjection[type]) {
            return constantInjection[type] = configFn(constantInjection[type]);
        }
        if (providerInjection[type]) {
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            return configFn(providers[type])
        }
    }

    BI.Constants = {
        getConstant: function (type) {
            return constantInjection[type];
        }
    }

    BI.Models = {
        getModel: function (type, config) {
            return new modelInjection[type](config);
        }
    }

    var stores = {};

    BI.Stores = {
        getStore: function (type, config) {
            if (stores[type]) {
                return stores[type];
            }
            return stores[type] = new storeInjection[type](config);
        }
    }

    var providers = {}, providerInstance = {}

    BI.Providers = {
        getProvider: function (type, config) {
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            if (!providerInstance[type]) {
                providerInstance[type] = new providers[type].$get()(config);
            }
            return providerInstance[type];
        }
    }
})();
