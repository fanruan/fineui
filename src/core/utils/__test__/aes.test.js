/*
 * @Author: fay
 * @Date: 2020-03-02 16:50:24
 * @LastEditor: fay
 * @LastEditTime: 2020-03-02 16:56:43
 */
describe("aesDecrypt", function () {

    /**
     * test_author_fay
     */
    it("aesEncrypt", function () {
        var text = "test";

        expect(BI.aesEncrypt(text, "0123456789ABCDEF")).to.eql("0No4i/uz2cfoo6zQMHaL1A==");
    });

    /**
     * test_author_fay
     */
    it("aesDecrypt", function () {
        var text = "0No4i/uz2cfoo6zQMHaL1A==";

        expect(BI.aesDecrypt(text, "0123456789ABCDEF")).to.eql("test");
    });
});
