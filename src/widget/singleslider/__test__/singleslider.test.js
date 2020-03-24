/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/24
 */

describe("SingleSlider", function () {

    /**
     * test_author_windy
     */
    it("singleSlider", function () {
        var widget = BI.Test.createWidget({
            type: "bi.single_slider",
            digit: 0,
            width: 300,
            height: 50
        });
        widget.setMinAndMax({
            min: 10,
            max: 120
        });
        widget.setValue(30);
        widget.populate();
        expect(widget.element.find(".blue-track").width() > 0).to.equal(true);
        widget.destroy();
    });

    /**
     * test_author_windy
     */
    it("singleSlidernormal", function () {
        var widget = BI.Test.createWidget({
            type: "bi.single_slider_normal",
            digit: 0,
            width: 300,
            height: 50
        });
        widget.setMinAndMax({
            min: 10,
            max: 120
        });
        widget.setValue(30);
        widget.populate();
        expect(widget.element.find(".blue-track").width() > 0).to.equal(true);
        widget.destroy();
    });


    /**
     * test_author_windy
     */
    it("singleSliderlabel", function () {
        var widget = BI.Test.createWidget({
            type: "bi.single_slider_label",
            width: 300,
            height: 50,
            digit: 0,
            unit: "个",
            cls: "layout-bg-white"
        });
        widget.setMinAndMax({
            min: 10,
            max: 120
        });
        widget.setValue(30);
        widget.populate();
        expect(widget.element.find(".blue-track").width() > 0).to.equal(true);
        widget.destroy();
    });
});