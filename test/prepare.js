!(function () {
    // 先把准备环境准备好
    while(BI.prepares && BI.prepares.length > 0) {
        BI.prepares.shift()();
    }
})();