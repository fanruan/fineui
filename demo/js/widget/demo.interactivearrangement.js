/**
 * Created by User on 2017/3/22.
 */
Demo.RelationView = BI.inherit(BI.Widget, {
    props: {
    },
    render: function () {
        return {
            type: "bi.interactive_arrangement",
        };
    }
});
BI.shortcut("demo.interactive_arrangement", Demo.RelationView);