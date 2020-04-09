/**
 * Created by windy on 2018/01/24.
 */
describe("baseFunctionTest", function () {

    before(function () {

    });

    /**
     * test_author_windy
     */
    it("formatEl和stripEL", function () {
        var obj1 = {
            type: "a",
            pro: {},
            items: []
        };

        var obj2 = {
            el: {
                type: "a",
                pro: {},
                items: []
            }
        };
        expect(BI.formatEL(obj1)).to.deep.equal(obj2);
        expect(BI.formatEL(obj2)).to.deep.equal(obj2);
        expect(BI.stripEL(obj1)).to.deep.equal(obj1);
        expect(BI.stripEL(obj2)).to.deep.equal(obj1);
    });

    /**
     * test_author_windy
     */
    it("encodeURIComponent和decodeURIComponent", function () {
        var targetString = "tableName./\\";
        var encodeString = BI.encodeURIComponent(targetString);
        expect(encodeString).to.equal("tableName120");
        expect(BI.decodeURIComponent(encodeString)).to.equal(targetString);
    });

    /**
     * test_author_windy
     */
    it("count", function () {
        var a = [];
        expect(BI.count(1, 100)).to.equal(99);
        BI.count(0, 100, function (v) {
            a[v] = 0;
        });
        expect(a.length).to.equal(100);
    });

    /**
     * test_author_windy
     */
    it("concat", function () {
        expect(BI.concat([1], [2])).to.deep.equal([1, 2]);
        expect(BI.concat(1, 2)).to.equal("12");
        expect(BI.concat("1", "2")).to.equal("12");
        expect(BI.concat({a: 1}, {b: 1})).to.deep.equal({a: 1, b: 1});
    });

    /**
     * test_author_windy
     */
    it("remove", function () {
        var a = [1, 2, 3, 4, 5, 6];
        BI.remove(a, function (i, v) {
            return v === 4;
        });
        expect(a).to.deep.equal([1, 2, 3, 5, 6]);
        var b = {
            a: 1,
            b: 2
        };
        BI.remove(b, function (key) {
            return key === "a";
        });
        expect(b).to.deep.equal({
            b: 2
        });
    });

    /**
     * test_author_windy
     */
    it("removeAt", function () {
        var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        BI.removeAt(a, 2);
        expect(a).to.deep.equal([1, 2, 4, 5, 6, 7, 8, 9]);
        var b = {
            a: 1,
            b: 2
        };
        BI.removeAt(b, "a");
        expect(b).to.deep.equal({
            b: 2
        });
    });

    /**
     * test_author_windy
     */
    it("makeArray", function () {
        var a = BI.makeArray(2, 1);
        expect(a).to.deep.equal([1, 1]);
    });


    /**
     * test_author_windy
     */
    it("concat-string", function () {
        // concat-string
        expect(BI.concat("a", "b", "c")).to.equal("abc");

        // concat-array
        expect(BI.concat([1], [2], [3])).to.deep.equal([1, 2, 3]);

        // concat-object-array
        expect(BI.concat([{text: 1, value: 1}], [{text: 2, value: 2}], [{text: 3, value: 3}])).to.deep.equal([{text: 1, value: 1}, {text: 2, value: 2}, {text: 3, value: 3}]);

        // concat-object
        expect(BI.concat({a: 1}, {b: 2}, {c: 3})).to.deep.equal({
            a: 1,
            b: 2,
            c: 3
        });
    });

    /**
     * test_author_windy
     */
    it("assert-warning", function () {
        expect(BI.assert("a", "a")).to.equal(true);
        expect(BI.assert("a", function (v) {
            return v === "a";
        })).to.equal(true);
        var test = "";
        try {
            BI.assert("a", function (v) {
                return v === "c";
            });
        } catch (e) {
            test = true;
        }
        expect(test).to.equal(true);
    });

    /**
     * test_author_windy
     */
    it("packageItems", function () {
        expect(BI.packageItems([{
            type: "a",
            text: "b"
        }, {
            type: "b",
            text: "c"
        }], [{
            type: "bi.vertical"
        }, {
            type: "bi.center_adapt"
        }])).to.deep.equal([{
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [{
                        el: {
                            type: "a",
                            text: "b"
                        }
                    }]
                }
            }]
        }, {
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [{
                        el: {
                            type: "b",
                            text: "c"
                        }
                    }]
                }
            }]
        }]);
    });

    /**
     * test_author_windy
     */
    it("inverse", function () {
        expect(BI.inverse(7, 1)).to.equal(6);
    });

    /**
     * test_author_windy
     */
    it("key", function () {
        var a = {
            c: 1,
            d: 2
        };
        expect(BI.firstKey(a)).to.equal("c");
        expect(BI.lastKey(a)).to.equal("d");
        expect(BI.firstObject(a)).to.equal(1);
        expect(BI.lastObject(a)).to.equal(2);
    });


    /**
     * test_author_windy
     */
    it("back", function () {
        var a = [{
            c: 1,
            d: 2
        }, {
            c: 3,
            d: 4
        }, {
            c: 5,
            d: 6
        }];
        var c = [];
        BI.backEach(a, function (idx, v) {
            c.push(v.d);
        });
        expect(c).to.deep.equal([6, 4, 2]);
        expect(BI.backEvery(a, function (idx, v) {
            return v.c = 1;
        })).to.equal(true);
        expect(BI.backFindKey({
            c: 5,
            d: 6
        }, function (value, key) {
            return key === "c";
        })).to.equal("c");
        expect(BI.backFind({
            c: 5,
            d: 6
        }, function (v, key) {
            return v === 5;
        })).to.deep.equal(5);
    });


    /**
     * test_author_windy
     */
    it("abc", function () {
        expect(BI.abc2Int("B")).to.equal(2);
        expect(BI.int2Abc(2)).to.equal("B");
    });


});
