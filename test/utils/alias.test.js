/**
 * Created by windy on 2018/01/23.
 */
describe("aliasFunctionTest", function () {

    /**
     * test_author_windy
     */
    it("html编码和解码方法", function () {

        var targetString = "<a>1 2&</a>";
        var encodeString = BI.htmlEncode(targetString);
        expect(encodeString).to.equal("&lt;a&gt;1&nbsp;2&amp;&lt;/a&gt;");
        expect(BI.htmlDecode(encodeString)).to.equal(targetString);
    });
});
