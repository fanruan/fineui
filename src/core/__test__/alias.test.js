/**
 * Created by windy on 2018/01/23.
 */
describe("aliasFunctionTest", function () {

    before(function () {
        BI.specialCharsMap = {
            "\\\\": "0",
            ".": "1",
            "/": "2"
        };
    });

    /**
     * test_author_windy
     */
    it("htmlEncode和htmlDecode", function () {

        var targetString = "<a>1 2&</a>";
        var encodeString = BI.htmlEncode(targetString);
        expect(encodeString).to.equal("&lt;a&gt;1&nbsp;2&amp;&lt;/a&gt;");
        expect(BI.htmlDecode(encodeString)).to.equal(targetString);
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
     *   test_author_kobi
     **/
    it("cjkEncode 和 cjkDecode ", function () {
        expect(BI.cjkEncode("测试")).to.eql("[6d4b][8bd5]");
        expect(BI.cjkEncode(123)).to.eql(123);
        expect(BI.cjkDecode("[6d4b][8bd5]")).to.eql("测试");
        expect(BI.cjkDecode("6d4b 8bd5")).to.eql("6d4b 8bd5");
        expect(BI.cjkDecode(null)).to.eql("");
    });

    /**
     *   test_author_kobi
     **/
    it("jsonEncode 和 jsonDecode", function () {
        var jsonString = '{"a":1,"b":"测\\"试","c":[5,6],"d":null,"e":false}';
        var obj = {
            a: 1,
            b: '测"试',
            c: [5, 6],
            d: null,
            e: false,
        };
        expect(BI.jsonEncode(obj)).to.eql(jsonString);
        expect(BI.jsonDecode(jsonString)).to.eql(obj);

        expect(BI.jsonEncode({ a: function(){return 1} })).to.eql('{"a":function(){return 1}}');
        expect(BI.jsonDecode("{__time__:878313600000}")).to.eql(new Date(878313600000));
    });

    /**
     *   test_author_kobi
     **/
    it("getEncodeURL", function () {
        expect(BI.getEncodeURL("design/{tableName}/{fieldName}",{tableName: "A", fieldName: "a"})).to.eql("design/A/a");
    });

    /**
     *   test_author_kobi
     **/
    it("contentFormat", function () {
        expect(BI.contentFormat("", "DTyyyy-MM-dd")).to.eql("");
        expect(BI.contentFormat(878313600000, "")).to.eql("878313600000");
        expect(BI.contentFormat("test", "T")).to.eql("test");
        expect(BI.contentFormat(878313600000, "E")).to.eql("9E11");
        expect(BI.contentFormat(1000.23456789, "0,000.####")).to.eql("1,000.2346");
        expect(BI.contentFormat(879051600000, "DTyyyy-MM-dd")).to.eql("1997-11-09");
        expect(BI.contentFormat(879051600000, "DTyyyy-MM-dd HH:mm:ss a")).to.eql("1997-11-09 13:00:00 pm");
        expect(BI.contentFormat(879051600000, "DTyyyy-MM-dd hh:mm:ss a")).to.eql("1997-11-09 01:00:00 pm");
        expect(BI.contentFormat(879051600000, "DTyyy-M-d H:m:s a")).to.eql("97-11-9 13:0:0 pm");
        expect(BI.contentFormat(879048000000, "DTyyy-M-d h:m:s a")).to.eql("97-11-9 12:0:0 pm");
    });

    /**
     *   test_author_kobi
     **/
    it("parseFmt", function () {
        expect(BI.parseFmt("yyyy-MM-dd HH:mm:ss")).to.eql("%Y-%X-%d %H:%M:%S");
        expect(BI.parseFmt("yyyy-MM-d hh:mm:ss")).to.eql("%Y-%X-%e %I:%M:%S");
        expect(BI.parseFmt("")).to.eql("");
    });

    /**
     *   test_author_kobi
     **/
    it("str2Date", function () {
        expect(BI.str2Date('2013-12-12', 'yyyy-MM-dd')).to.eql(new Date(2013, 11, 12));
        expect(BI.str2Date('2013-12-12', 123)).to.eql(null);
    });

    /**
     *   test_author_kobi
     **/
    it("object2Number", function () {
        expect(BI.object2Number(null)).to.eql(0);
        expect(BI.object2Number(123)).to.eql(123);
        expect(BI.object2Number("1.23")).to.eql(1.23);
        expect(BI.object2Number({ a: 2 })).to.eql(NaN);
    });

    /**
     *   test_author_kobi
     **/
    it("object2Date", function () {
        expect(BI.object2Date(null)).to.eql(new Date());
        expect(BI.object2Date(new Date(1997, 10, 9))).to.eql(new Date(1997, 10, 9));
        expect(BI.object2Date(879051600000)).to.eql(new Date(879051600000));
        expect(BI.object2Time("1997-11-09")).to.eql(new Date(1997, 10, 9));
        expect(BI.object2Date({ a: 2 })).to.eql(new Date());
    });

    /**
     *   test_author_kobi
     **/
    it("object2Time", function () {
        expect(BI.object2Time(null)).to.eql(new Date());
        expect(BI.object2Time(new Date(1997, 11, 9))).to.eql(new Date(1997, 11, 9));
        expect(BI.object2Time("1997-11-09 13:00:00")).to.eql(new Date(1997, 10, 9, 13, 0, 0));
        expect(BI.object2Time("13:00:00")).to.eql(new Date(1970, 0, 1, 13, 0, 0));
    });
});
