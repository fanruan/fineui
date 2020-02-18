/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/3
 */

describe("DownListCombo", function () {

    /**
     * test_author_windy
     */
    it("defaultValue", function () {
        var downListCombo = BI.Test.createWidget({
            type: "bi.down_list_combo",
            adjustLength: 10,
            items: [[{"el":{"text":"column 1111","iconCls1":"dot-e-font","value":12},"children":[{"text":"column 1.1","value":21,"cls":"dot-e-font"},{"text":"column 1.2","value":22,"cls":"dot-e-font"}]}],[{"el":{"text":"column 1111","iconCls1":"dot-e-font","value":11},"children":[{"text":"column 1.1","value":21,"cls":"dot-e-font"},{"text":"column 1.2","value":22,"cls":"dot-e-font"}]}]]
        });
        downListCombo.setValue([{value: 12, childValue: 21}]);
        expect(downListCombo.getValue()).to.deep.equal([ { childValue: 21, value: 12 } ]);
        downListCombo.destroy();
    });


    /**
     * test_author_windy
     */
    it("点击父亲选值", function (done) {
        var downListCombo = BI.Test.createWidget({
            type: "bi.down_list_combo",
            height: 30,
            width: 30,
            items: [[{"el":{"text":"column 1111","iconCls1":"dot-e-font","value":12},"children":[{"text":"column 1.1","value":21,"cls":"dot-e-font"},{"text":"column 1.2","value":22,"cls":"dot-e-font"}]}],[{"el":{"text":"column 1111","iconCls1":"dot-e-font","value":11},"children":[{"text":"column 1.1","value":21,"cls":"dot-e-font"},{"text":"column 1.2","value":22,"cls":"dot-e-font"}]}], [{"text": "column 1122", value: 32}, {"text": "column 1133", value: 33}]]
        });
        downListCombo.element.children(".pull-down-font").click();
        BI.nextTick(function () {
            downListCombo.element.find(".bi-down-list-group:last-child .bi-down-list-item").click();
            expect(downListCombo.getValue()).to.deep.equal([ { value: 33 } ]);
            downListCombo.destroy();
            done();
        });
    });


    /**
     * test_author_windy
     */
    it("点击儿子选值", function (done) {
        var downListCombo = BI.Test.createWidget({
            type: "bi.down_list_combo",
            height: 30,
            width: 30,
            items: [[{"el":{"text":"column 1111","iconCls1":"dot-e-font","value":12},"children":[{"text":"column 1.1","value":21,"cls":"dot-e-font"},{"text":"column 1.2","value":22,"cls":"dot-e-font"}]}],[{"el":{"text":"column 1111","iconCls1":"dot-e-font","value":11},"children":[{"text":"column 1.1","value":21,"cls":"dot-e-font"},{"text":"column 1.2","value":22,"cls":"dot-e-font"}]}]]
        });
        downListCombo.element.children(".pull-down-font").click();
        BI.Test.triggerMouseover(downListCombo.element.find(".bi-down-list-group:first-child .bi-down-list-group-item"), function () {
            BI.nextTick(function () {
                downListCombo.element.find(".child-down-list-item:first-child").click();
                expect(downListCombo.getValue()).to.deep.equal([ { childValue: 21, value: 12 } ]);
                downListCombo.destroy();
                done();
            });
        });
    });
});