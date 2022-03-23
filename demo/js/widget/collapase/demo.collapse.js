Demo.Collapse = BI.inherit(BI.Widget, {
  props: {
    baseCls: "demo-collapse"
  },

  render: function () {
    var self = this;
    
    var items = [{
      value: "test",
      popup: {
          cls: "mvc-border",
          items: BI.createItems([{
              text: "项目1",
              value: 1
          }, {
              text: "项目2",
              value: 2
          }, {
              text: "项目3",
              value: 3
          }, {
              text: "项目4",
              value: 4
          }], {
              type: "bi.single_select_item",
              height: 25
          })
      }
    }, {
      value: 2,
      popup: {
          type: "bi.label",
          value: "给岁月以文明，而不是给文明以岁月"
      }
    }, {
      value: 3,
      popup: {
          type: "bi.label",
          value: "漂流瓶隐没于黑暗里，在一千米见方的宇宙中，只有生态球里的小太阳发出一点光芒。在这个小小的生命世界中，几只清澈的水球在零重力环境中静静地飘浮着，有一条小鱼从一只水球中蹦出，跃入另一只水球，轻盈地穿游于绿藻之间。"
      }
    }];
    
    return {
      type: "bi.vertical",
      items: [{
        type: "bi.collapse",
        accordion: true,
        items: items,
        value: [2],
      }],
      width: '60%',
      tgap: 100,
      hgap: 100
    };
  }
});

BI.shortcut("demo.collapse", Demo.Collapse);
