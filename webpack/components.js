const grunt = require("grunt");

function uniq (names) {
    return [...new Set(names)];
}

function sync (patterns) {
    return uniq(grunt.file.expand({filter: path => !new RegExp(/__test__/g).test(path)}, patterns)).map(name => `./${name}`);
}

const basicAttachmentMap = {
    single: sync(["src/base/single/**/*.js"]),
    button_group: sync(["src/base/combination/group.button.js"]),
    buttons: sync(["src/case/button/**/*.js"]),
    combos: sync(["src/case/combo/**/*.js"]),
    editors: sync(["src/case/editor/**/*.js"]),
    triggers: sync(["src/case/trigger/**/*.js"]),
    calendar: sync(["src/case/calendar/**/*.js"]),
    color_chooser: sync(["src/case/colorchooser/**/*.js"]),
    segment: sync(["src/case/segment/**/*.js"]),
    linear_segment: sync(["src/case/linearsegment/**/*.js"]),
    date: sync(["src/widget/date/**/*.js"]),
    down_list: sync(["src/widget/downlist/**/*.js"]),
    text_value_down_list_combo: sync(["src/widget/textvaluedownlistcombo/**/*.js"])
};

module.exports = {
    single: basicAttachmentMap.single,
    button_group: basicAttachmentMap.button_group,
    buttons: basicAttachmentMap.buttons,
    combos: basicAttachmentMap.combos,
    editors: basicAttachmentMap.editors,
    triggers: basicAttachmentMap.triggers,
    calendar: basicAttachmentMap.calendar,
    color_chooser: basicAttachmentMap.color_chooser,
    segment: basicAttachmentMap.segment,
    line_segment: basicAttachmentMap.line_segment,
    date: basicAttachmentMap.date,
    down_list: basicAttachmentMap.down_list,
    text_value_down_list_combo: basicAttachmentMap.text_value_down_list_combo
};
