const { sync, uniq } = require("./utils");

const basicAttachmentMap = {
    single: sync(["src/base/single/**/*.js"]),
    layer: sync(["src/base/layer/**/*.js"]),
    pane: sync(["src/base/1.pane.js"]),
    button_group: sync(["src/base/combination/group.button.js"]),
    buttons: sync(["src/case/button/**/*.js"]),
    checkboxes: sync(["src/case/checkbox/**/*.js"]),
    combos: sync(["src/case/combo/**/*.js"]),
    editors: sync(["src/case/editor/**/*.js"]),
    triggers: sync(["src/case/trigger/**/*.js"]),
    calendar: sync(["src/case/calendar/**/*.js"]),
    color_chooser: sync(["src/case/colorchooser/**/*.js"]),
    segment: sync(["src/case/segment/**/*.js"]),
    linear_segment: sync(["src/case/linearsegment/**/*.js"]),
    date: sync(["src/widget/date/**/*.js"]),
    down_list: sync(["src/widget/downlist/**/*.js"]),
    text_value_down_list_combo: sync(["src/widget/textvaluedownlistcombo/**/*.js"]),
};

module.exports = {
    single: basicAttachmentMap.single,
    layer: basicAttachmentMap.layer,
    pane: basicAttachmentMap.pane,
    button_group: basicAttachmentMap.button_group,
    buttons: basicAttachmentMap.buttons,
    checkboxes: basicAttachmentMap.checkboxes,
    combos: basicAttachmentMap.combos,
    editors: basicAttachmentMap.editors,
    triggers: basicAttachmentMap.triggers,
    calendar: basicAttachmentMap.calendar,
    color_chooser: basicAttachmentMap.color_chooser,
    segment: basicAttachmentMap.segment,
    linear_segment: basicAttachmentMap.linear_segment,
    date: basicAttachmentMap.date,
    down_list: basicAttachmentMap.down_list,
    text_value_down_list_combo: basicAttachmentMap.text_value_down_list_combo,
};
