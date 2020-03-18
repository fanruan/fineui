/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/17
 */

describe("PopoverTest", function () {

    /**
     * test_author_windy
     */
    it("BarPopover", function (done) {
        var id = BI.UUID();
        BI.Popovers.remove(id);
        BI.Popovers.create(id, {
            type: "bi.bar_popover",
            size: "normal",
            header: {
                type: "bi.label",
                text: "这个是header"
            },
            body: {
                type: "bi.label",
                text: "这个是body"
            }
        }).open(id);
        BI.delay(function () {
            expect(BI.Widget._renderEngine.createElement("body").find(".bi-popup-view .bi-z-index-mask").length).to.equal(1);
            BI.Popovers.remove(id);
            done();
        }, 100);
    });
});