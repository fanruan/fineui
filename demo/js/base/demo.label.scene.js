/**
 * 整理所有label场景
 */
Demo.LabelScene = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-label"
    },
    render: function () {
        var items = [];

        items.push(this.createExpander("1.1.1 文字居中,有宽度和高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg6",
            text: "设置了textWidth,则一定是嵌套结构,因此需要用center_adapt布局容纳一下.为了实现不足一行时文字水平居中,超出一行时左对齐,需要设置maxWidth.",
            whiteSpace: "normal",
            height: 50,
            width: 500,
            textWidth: 200,
            textAlign: "center"
        }));

        items.push(this.createExpander("1.1.2 居中,有宽度和高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg6",
            text: "居中,有宽度高度,有文字宽度,whiteSpace为nowrap,maxWidth会限制文字",
            whiteSpace: "nowrap",
            height: 50,
            width: 500,
            textWidth: 350,
            textAlign: "center"
        }));

        items.push((this.createExpander("1.2.1 居中,有宽度无高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg6",
            text: "居中,有宽度无高度,有文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            width: 500,
            textWidth: 200,
            textAlign: "center"
        })));

        items.push((this.createExpander("1.2.1 居中,有宽度无高度,有文字宽度,whiteSpace为normal,高度被父容器拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg6",
                        text: "此时虽然没有对label设置高度,但由于使用了center_adapt布局,依然会垂直方向居中",
                        whiteSpace: "normal",
                        width: 500,
                        textWidth: 200,
                        textAlign: "center"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.2.2 居中,有宽度无高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg6",
            text: "居中,有宽度无高度,有文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            width: 500,
            textWidth: 350,
            textAlign: "center"
        })));

        items.push((this.createExpander("1.3.1 居中,有宽度和高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,有宽度高度,无文字宽度,whiteSpace为normal,只需用center_adapt布局包一下即可.度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,whiteSpace为normal",
            width: 500,
            whiteSpace: "normal",
            textAlign: "center",
            height: 50
        })));

        items.push((this.createExpander("1.3.2 居中,有宽度无高度,无文字宽度,whiteSpace为normal", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,有宽度无高度,无文字宽度,whiteSpace为normal,只需用center_adapt布局包一下即可.度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,whiteSpace为normal",
                        width: 500,
                        whiteSpace: "normal",
                        textAlign: "center"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.4 居中,有宽度和高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,有宽度500有高度50,无文字宽度,whiteSpace为nowrap,此处无需两层div,设置text即可,然后设置line-height为传入高度即可实现垂直方向居中",
            width: 500,
            whiteSpace: "nowrap",
            textAlign: "center",
            height: 50
        })));

        items.push((this.createExpander("1.5.1 居中,有宽度无高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,有宽度500无高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            width: 500,
            whiteSpace: "nowrap",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.5.2 居中,有宽度无高度,无文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 50,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,有宽度500无高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        width: 500,
                        whiteSpace: "nowrap",
                        textAlign: "center"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.6.1 居中,无宽度无高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度,有文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            textWidth: 500,
            whiteSpace: "nowrap",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.6.2 居中,无宽度无高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度,有文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            textWidth: 500,
            whiteSpace: "normal",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.6.3 居中,无宽度无,有文字宽度,whiteSpace为normal,被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,无宽度,有文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        textWidth: 500,
                        whiteSpace: "normal",
                        textAlign: "center"
                    },
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.7.1 居中,无宽度无高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度无高度,无文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.7.2 居中,无宽度无高度,无文字宽度,whiteSpace为normal,被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,无宽度无高度,无文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "center"
                    },
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.7.3 居中,无宽度有高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度有高度,无文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            height: 50,
            textAlign: "center"
        })));

        items.push((this.createExpander("1.8 居中,无宽度有高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度有高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            height: 50,
            textAlign: "center"
        })));

        items.push((this.createExpander("1.9 居中,无宽度无高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度无高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.9.1 居中,无宽度无高度,无文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 50,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,无宽度无高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "center"
                    },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("2.1.1 居左,有宽度有高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度有高度,有文字宽度,whiteSpace为normal，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            textWidth: 300,
            height: 50,
            width: 500
        })));

        items.push((this.createExpander("2.1.2 居左,有宽度有高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度有高度,有文字宽度,whiteSpace为normal，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left",
            textWidth: 300,
            height: 50,
            width: 500
        })));

        items.push((this.createExpander("2.2.1 居左,有宽度无高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度无高度,有文字宽度,whiteSpace为normal，不设置高度，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            textWidth: 300,
            width: 500
        })));

        items.push((this.createExpander("2.2.2 居左,有宽度无高度,有文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,有宽度无高度,有文字宽度,whiteSpace为normal，不设置高度，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left",
                        textWidth: 300,
                        width: 500
                    },
                    top: 0,
                    bottom: 0,
                    left: 0
                }
            ]
        })));

        items.push((this.createExpander("2.2.3 居左,有宽度无高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度无高度,有文字宽度,whiteSpace为nowrap，不设置高度，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left",
            textWidth: 300,
            width: 500
        })));

        items.push((this.createExpander("2.2.4 居左,有宽度无高度,有文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,有宽度无高度,有文字宽度,whiteSpace为nowrap，不设置高度，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                        textWidth: 300,
                        width: 500
                    },
                    top: 0,
                    bottom: 0,
                    left: 0
                }
            ]
        })));

        items.push((this.createExpander("2.3.1 居左,有宽度有高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度有高度,无文字宽度,whiteSpace为nowrap，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left",
            height: 50,
            vgap: 5,
            width: 500
        })));

        items.push((this.createExpander("2.3.2 居左,有宽度有高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度有高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            height: 50,
            width: 500
        })));

        items.push((this.createExpander("2.4.1 居左,有宽度无高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            width: 500
        })));

        items.push((this.createExpander("2.4.2 居左,有宽度无高度,无文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg1",
                        text: "居左,有宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left",
                        width: 500
                    },
                    top: 0,
                    left: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("2.5.1 居左,无宽度无高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度无高度,有文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            textWidth: 300
        })));

        items.push((this.createExpander("2.5.2 居左,无宽度无高度,有文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,有文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left",
                        textWidth: 300
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.5.3 居左,无宽度无高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度无高度,有文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left",
            textWidth: 300
        })));

        items.push((this.createExpander("2.5.4 居左,无宽度无高度,有文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,有文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                        textWidth: 300
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.6.1 居左,无宽度有高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度有高度,无文字宽度,whiteSpace为nowrap，注意这个是设置了vgap的,为了实现居中,lineHeight要做计算,才能准确的垂直居中",
            whiteSpace: "nowrap",
            textAlign: "left",
            vgap: 10,
            height: 50
        })));

        items.push((this.createExpander("2.6.2 居左,无宽度有高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度有高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            height: 50
        })));

        items.push((this.createExpander("2.7.1 居左,无宽度无高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left"
        })));

        items.push((this.createExpander("2.7.2 居左,无宽度无高度,无文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.7.3 居左,无宽度无高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度无高度,无文字宽度,whiteSpace为nowrap，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left"
        })));

        items.push((this.createExpander("2.7.4 居左,无宽度无高度,无文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,无文字宽度,whiteSpace为nowrap，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "left"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.8 居左,无宽度无高度,无文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,无文字宽度,whiteSpace为nowrap，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "left"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.8.2 居左,无宽度无高度,无文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        return {
            type: "bi.vertical",
            items: items,
            hgap: 300,
            vgap: 20
        };
    },

    createExpander: function (text, popup) {
        return {
            type: "bi.vertical",
            items: [
                {
                    type: "bi.label",
                    cls: "demo-font-weight-bold",
                    textAlign: "left",
                    text: text,
                    height: 30
                }, {
                    el: popup
                }
            ]
        };
    }
});
BI.shortcut("demo.label_scene", Demo.LabelScene);