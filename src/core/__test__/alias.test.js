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
        expect(encodeString).to.equal("&lt;a&gt;1 2&amp;&lt;/a&gt;");
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
});
