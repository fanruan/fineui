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
    it("others", function () {
        expect(BI.abc2Int("B")).to.equal(2);
        expect(BI.int2Abc(2)).to.equal("B");
        expect(BI.has({a: "1", b: "2"}, "a")).to.equal(true);
        expect(Object.isFrozen(BI.freeze({a: "1", b: "2"}))).to.equal(true);
        expect(BI.isCapitalEqual("A", "a")).to.equal(true);
        expect(BI.isEmptyString("a")).to.equal(false);
        expect(BI.isNotEmptyString("a")).to.equal(true);
        expect(BI.isWindow("a")).to.equal(false);
    });

    /**
     * test_author_windy
     */
    it("deepFunc", function () {
        expect(BI.isDeepMatch({b: {c: {e: 3}}, d:2}, {b: {c: {e: 3}}, d:2})).to.equal(true);
        expect(BI.deepIndexOf([{a: 1}, {b: 2}, {c: 3}], {c: 3})).to.equal(2);
        var remove = [{a: 1}, {b: 2}, {c: 3}];
        BI.deepRemove(remove, {c: 3});
        expect(remove).to.deep.equal([{a: 1}, {b: 2}]);
        expect(BI.deepWithout([{a: 1}, {b: 2}, {c: 3}], {c: 3})).to.deep.equal([{a: 1}, {b: 2}]);
        expect(BI.deepUnique([{c: 3}, {a: 1}, {b: 2}, {c: 3}, {c: 3}])).to.deep.equal([{c: 3}, {a: 1}, {b: 2}]);
        expect(BI.deepDiff({a: 1, b: 2}, {a: 1, c: 2})).to.deep.equal(["b", "c"]);
    });

    /**
     * test_author_windy
     */
    it("number", function () {
        expect(BI.parseSafeInt(9007199254740992)).to.equal(9007199254740991);
        expect(BI.isNegativeInteger(-3)).to.equal(true);
        expect(BI.isFloat(1.2)).to.equal(true);
        expect(BI.isOdd(1)).to.equal(true);
        expect(BI.isOdd("a")).to.equal(false);
        expect(BI.isEven("a")).to.equal(false);
        expect(BI.isEven(2)).to.equal(true);
        expect(BI.sum([1, 2, 3, 4, 5, 6, 7])).to.equal(28);
        expect(BI.average([1, 2, 3, 4, 5, 6, 7])).to.equal(4);
    });

    /**
     * test_author_windy
     */
    it("string", function () {
        expect(BI.toLowerCase("AAAAA")).to.equal("aaaaa");
        expect(BI.isLiteral("AAAAA")).to.equal(false);
        expect(BI.stripQuotes("AAAAA")).to.equal("AAAAA");
        expect(BI.camelize("background-color")).to.equal("backgroundColor");
        expect(BI.escape("'\\")).to.equal("\\'\\\\");
        expect(BI.leftPad("123", 5, "0")).to.equal("00123");
        const cls = "my-class", text = "Some text";
        expect(BI.format("<div class=\"{0}\">{1}</div>", cls, text)).to.equal("<div class=\"my-class\">Some text</div>");
    });

    /**
     *   test_author_kobi
     **/
    it("checkDateVoid", function () {
        const minDate = "1900-02-02";
        const maxDate = "2099-11-29";
        expect(BI.checkDateVoid(1899, 2, 2, minDate, maxDate)).to.eql(["y"]);
        expect(BI.checkDateVoid(2100, 2, 2, minDate, maxDate)).to.eql(["y", 1]);
        expect(BI.checkDateVoid(1900, 1, 2, minDate, maxDate)).to.eql(["m"]);
        expect(BI.checkDateVoid(2099, 12, 2, minDate, maxDate)).to.eql(["m", 1]);
        expect(BI.checkDateVoid(1900, 2, 1, minDate, maxDate)).to.eql(["d"]);
        expect(BI.checkDateVoid(2099, 11, 30, minDate, maxDate)).to.eql(["d", 1]);
    });

    /**
     *   test_author_kobi
     **/
    it("parseDateTime", function () {
        expect(BI.parseDateTime("19971109", "%y%x%d")).to.eql(BI.getDate(1997, 10, 9));
        expect(BI.parseDateTime("12:34:56", "%H:%M:%S")).to.eql(BI.getDate(1935, 0, 25, 12, 34, 56));
        expect(BI.parseDateTime("1997-11-09 3:23:23 pm", "%y-%x-%d %H:%M:%S %P")).to.eql(BI.getDate(1997, 10, 9, 15, 23, 23));
        expect(BI.parseDateTime("1997-11-09 15:23:23 am", "%y-%x-%d %H:%M:%S %P")).to.eql(BI.getDate(1997, 10, 9, 3, 23, 23));
        expect(BI.parseDateTime("a-b-c d:e:f", "%y-%x-%d %H:%M:%S").toString()).to.eql(BI.getDate().toString());
    });

    /**
     *   test_author_kobi
     **/
    it("getDate 和 getTime", function () {
        expect(BI.getDate().toString()).to.eql(new Date().toString());
        expect(BI.getDate(1997)).to.eql(new Date(1997));
        expect(BI.getDate(1997, 10)).to.eql(new Date(1997, 10));
        expect(BI.getDate(1997, 10, 9)).to.eql(new Date(1997, 10, 9));
        expect(BI.getDate(1997, 10, 9, 12)).to.eql(new Date(1997, 10, 9, 12));
        expect(BI.getDate(1997, 10, 9, 12, 34)).to.eql(new Date(1997, 10, 9, 12, 34));
        expect(BI.getDate(1997, 10, 9, 12, 34, 56)).to.eql(new Date(1997, 10, 9, 12, 34, 56));
        expect(BI.getDate(1997, 10, 9, 12, 34, 56, 78)).to.eql(new Date(1997, 10, 9, 12, 34, 56, 78));
        expect(BI.getTime()).to.eql(new Date().getTime());
        expect(BI.getTime(1997)).to.eql(new Date(1997).getTime());
        expect(BI.getTime(1997, 10)).to.eql(new Date(1997, 10).getTime());
        expect(BI.getTime(1997, 10, 9)).to.eql(new Date(1997, 10, 9).getTime());
        expect(BI.getTime(1997, 10, 9, 12)).to.eql(new Date(1997, 10, 9, 12).getTime());
        expect(BI.getTime(1997, 10, 9, 12, 34)).to.eql(new Date(1997, 10, 9, 12, 34).getTime());
        expect(BI.getTime(1997, 10, 9, 12, 34, 56)).to.eql(new Date(1997, 10, 9, 12, 34, 56).getTime());
        expect(BI.getTime(1997, 10, 9, 12, 34, 56, 78)).to.eql(new Date(1997, 10, 9, 12, 34, 56, 78).getTime());
    });

    /**
     *   test_author_kobi
     **/
    it("数字相关方法补充", function () {
        const iteratee = function (a, b) {
            return a > b ? a : b;
        };
        expect(BI.isNaturalNumber(1.25)).to.eql(false);
        expect(BI.isPositiveInteger(-15)).to.eql(false);
        expect(BI.isNegativeInteger(+15)).to.eql(false);
        expect(BI.isFloat(15)).to.eql(false);
        expect(BI.sum([4, 3, 2, 1], iteratee)).to.eql(12);
    });

    /**
     *   test_author_kobi
     **/
    it("集合相关方法补充", function () {
        const array = [{
            user: "barney",
            active: true,
        }, {
            user: "fred",
            active: false,
        }, {
            user: "pebbles",
            active: false,
        }];
        expect(BI.backEvery(array, (index, value) => value.user === "kobi")).to.eql(false);
        expect(BI.backFind(array, ["active", false])).to.eql(array[2]);
        expect(BI.abc2Int("ABCD999")).to.eql(0);
        expect(BI.int2Abc(0)).to.eql("");
        expect(BI.int2Abc(26)).to.eql("Z");
    });

    /**
     *   test_author_kobi
     **/
    it("数组相关方法补充", function () {
        expect(BI.makeArrayByArray([], 5)).to.eql([]);
        expect(BI.uniq(null, true, (a, b) => a > b)).to.eql([]);
    });

    /**
     *   test_author_kobi
     **/
    it("对象相关方法补充", function () {
        var obj = {
            a: 1,
            b: 2,
            c: 3,
        };
        expect(BI.has(obj, [])).to.eql(false);
        expect(BI.has(obj, ["a", "b"])).to.eql(true);
        expect(BI.freeze("1")).to.eql("1");
    });

    /**
     *   test_author_kobi
     **/
    it("deep方法补充", function () {
        var obj = {
            a: 1,
            b: 2,
            c: {
                d: 3,
                e: {
                    f: 4,
                },
            },
        };
        expect(BI.isDeepMatch(null, { d: 3, e: { f: 4 } })).to.eql(false);
        expect(BI.isDeepMatch(obj, { d: 3, e: { f: 5 } })).to.eql(false);
        expect(BI.deepIndexOf(obj, { d: 3, e: { f: 5 } })).to.eql(-1);
        expect(BI.deepRemove(obj, { d: 3, e: { f: 4 } })).to.eql(true);
        expect(BI.deepWithout(obj, { d: 3, e: { f: 4 } })).to.eql({ a: 1, b: 2 });
    });

    /**
     * test_author_teller
     * 只传一个时分秒format的时间进去后,在某些情况下,返回的是当前时间,然而想要的是返回正确的时分秒
    */
    it("parseDateTime2", function () {
        var date = BI.getDate();
        expect(BI.parseDateTime("14:13:16", "%H:%M:%S").getTime()).to.eql(BI.getDate(date.getFullYear(), date.getMonth(), 14, 14, 13, 16).getTime());
    });
});
