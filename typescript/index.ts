import { Combo } from "./base/combination/combo";
import { ButtonGroup } from "./base/combination/group.button";
import { Tab } from "./base/combination/tab";
import { Pane } from "./base/pane";
import { BasicButton } from "./base/single/button/button.basic";
import { NodeButton } from "./base/single/button/button.node";
import { Button } from "./base/single/button/buttons/button";
import { TextButton } from "./base/single/button/buttons/button.text";
import { IconTextItem } from "./base/single/button/listitem/icontextitem";
import { Editor } from "./base/single/editor/editor";
import { Iframe } from "./base/single/iframe/iframe";
import { Checkbox } from "./base/single/input/checkbox";
import { Input } from "./base/single/input/input";
import { AbstractLabel } from "./base/single/label/abstract.label";
import { Label } from "./base/single/label/label";
import { Single } from "./base/single/single";
import { Text } from "./base/single/text";
import { Trigger } from "./base/single/trigger/trigger";
import { IconChangeButton } from "./case/button/icon/icon.change";
import { MultiSelectItem } from "./case/button/item.multiselect";
import { BubbleCombo } from "./case/combo/bubblecombo/combo.bubble";
import { TextValueCombo } from "./case/combo/combo.textvalue";
import { SearchTextValueCombo } from "./case/combo/searchtextvaluecombo/combo.searchtextvalue";
import { SignEditor } from "./case/editor/editor.sign";
import { LoadingPane } from "./case/loading/loading_pane";
import { AllValueMultiTextValueCombo } from "./component/allvaluemultitextvaluecombo/allvalue.multitextvalue.combo";
import { AbstractTreeValueChooser } from "./component/treevaluechooser/abstract.treevaluechooser";
import { AbstractListTreeValueChooser } from "./component/treevaluechooser/abstract.treevaluechooser.list";
import { Action, ActionFactory } from "./core/action/action";
import { ShowAction } from "./core/action/action.show";
import { _base } from "./core/base";
import { Behavior, BehaviorFactory } from "./core/behavior/behavior";
import { HighlightBehavior } from "./core/behavior/behavior.highlight";
import { RedMarkBehavior } from "./core/behavior/behavior.redmark";
import * as decorator from "./core/decorator/decorator";
import { _func } from "./core/func";
import { _i18n } from "./core/i18n";
import { _Plugin } from "./core/plugin";
import { _var } from "./core/var";
import { OB } from "./core/ob";
import { Widget } from "./core/widget";
import { _inject } from "./core/inject";
import { Layout } from "./core/wrapper/layout";
import { AbsoluteLayout } from "./core/wrapper/layout/layout.absolute";
import { HTapeLayout, VTapeLayout } from "./core/wrapper/layout/layout.tape";
import { VerticalLayout } from "./core/wrapper/layout/layout.vertical";
import { DefaultLayout } from "./core/wrapper/layout/layout.default";
import { DownListCombo } from "./widget/downlist/combo.downlist";
import { Icon } from "./base/single/icon/icon";
import { LeftVerticalAdaptLayout } from "./core/wrapper/layout/adapt/adapt.leftvertical";
import { LeftRightVerticalAdaptLayout, RightVerticalAdaptLayout } from "./core/wrapper/layout/adapt/adapt.leftrightvertical";
import { IconTextIconItem } from "./base/single/button/listitem/icontexticonitem";
import { HorizontalAutoLayout } from "./core/wrapper/layout/adapt/auto.horizontal";
import { InlineVerticalAdaptLayout } from "./core/wrapper/layout/adapt/inline.vertical";
import { TableAdaptLayout } from "./core/wrapper/layout/adapt/adapt.table";
import { IconButton } from "./base/single/button/buttons/button.icon";
import { TextEditor } from "./widget/editor/editor.text";
import { IconLabel } from "./base/single/label/icon.label";
import { Popover, BarPopover } from "./base/layer/layer.popover";
import { IconCombo } from "./case/combo/iconcombo/combo.icon";
import { DynamicDateCombo } from "./widget/dynamicdate/dynamicdate.combo";
import { CustomTree } from "./base/tree/customtree";
import { ButtonTree } from "./base/combination/tree.button";
import { IconArrowNode } from "./case/button/node/node.icon.arrow";
import { MidTreeLeafItem } from "./case/button/treeitem/item.mid.treeleaf";
import { FirstTreeLeafItem } from "./case/button/treeitem/item.first.treeleaf";
import { LastTreeLeafItem } from "./case/button/treeitem/item.last.treeleaf";
import { SmallTextEditor } from "./widget/editor/editor.text.small";
import { MultifileEditor } from "./widget/editor/editor.multifile";
import { AbsoluteCenterLayout } from "./core/wrapper/layout/adapt/absolute.center";
import { HorizontalAdaptLayout } from "./core/wrapper/layout/adapt/adapt.horizontal";
import { FloatLeftLayout, FloatRightLayout } from "./core/wrapper/layout/layout.flow";
import { CenterAdaptLayout } from "./core/wrapper/layout/adapt/adapt.center";
import { VerticalAdaptLayout } from "./core/wrapper/layout/adapt/adapt.vertical";
import { MultiSelectInsertCombo } from "./widget/multiselect/multiselect.insert.combo";
import { MultiSelectCombo } from "./widget/multiselect/multiselect.combo";
import { SearchEditor } from "./widget/editor/editor.search";
import { MultiLayerSingleLevelTree } from "./widget/multilayersingletree/multilayersingletree.leveltree";
import { SimpleColorChooser } from "./case/colorchooser/colorchooser.simple";
import { A } from "./base/a/a";
import { Html } from "./base/single/html/html";
import { Switcher } from "./base/combination/switcher";
import { Loader } from "./base/combination/loader";
import { ListPane } from "./case/layer/pane.list";
import { MultiSelectBar } from "./case/toolbar/toolbar.multiselect";
import { SelectList } from "./case/list/list.select";
import { AbstractAllValueChooser } from "./component/allvaluechooser/abstract.allvaluechooser";
import { AllValueChooserCombo } from "./component/allvaluechooser/combo.allvaluechooser";
import { TextAreaEditor } from "./base/single/editor/editor.textarea";
import { SingleSelectItem } from "./case/button/item.singleselect";
import { DynamicDateTimeCombo } from "./widget/dynamicdatetime/dynamicdatetime.combo";
import { MultiTreeCombo } from "./widget/multitree/multi.tree.combo";
import { CenterLayout } from "./core/wrapper/layout/middle/middle.center";
import { VirtualGroup } from "./base/combination/group.virtual";
import { GridLayout } from "./core/wrapper/layout/layout.grid";
import { TriggerIconButton } from "./case/button/icon/icon.trigger";
import { Searcher } from "./base/combination/searcher";
import { ListTreeValueChooserInsertCombo } from "./component/treevaluechooser/combo.listtreevaluechooser";
import { TreeValueChooserCombo } from "./component/treevaluechooser/combo.treevaluechooser";
import { TreeValueChooserInsertCombo } from "./component/treevaluechooser/combo.treevaluechooser.insert";
import { Radio } from "./base/single/input/radio/radio";
import { MultiLayerSelectTreePopup } from "./widget/multilayerselecttree/multilayerselecttree.popup";
import { MultiLayerSingleTreePopup } from "./widget/multilayersingletree/multilayersingletree.popup";
import { TreeView } from "./base/tree/ztree/treeview";
import { MultiTreePopup } from "./widget/multitree/multi.tree.popup";
import { SingleSelectRadioItem } from "./case/button/item.singleselect.radio";
import { SingleSelectInsertCombo } from "./widget/singleselect/singleselect.insert.combo";
import { SingleSelectCombo } from "./widget/singleselect/singleselect.combo";
import { CardLayout } from "./core/wrapper/layout/layout.card";
import { DynamicYearMonthCombo } from "./widget/yearmonth/combo.yearmonth";
import { TimeCombo } from "./widget/time/time.combo";
import { ListTreeView } from "./base/tree/ztree/list/listtreeview";
import { ListAsyncTree } from "./base/tree/ztree/list/listasynctree";
import { AsyncTree } from "./base/tree/ztree/asynctree";
import { MultiLayerSingleTreeCombo } from "./widget/multilayersingletree/multilayersingletree.combo";
import { MultiLayerSelectTreeCombo } from "./widget/multilayerselecttree/multilayerselecttree.combo";
import { MultiTreeListCombo } from "./widget/multitree/multi.tree.list.combo";
import { MultiTreeInsertCombo } from "./widget/multitree/multi.tree.insert.combo";
import { TextValueDownListCombo } from "./widget/textvaluedownlistcombo/combo.textvaluedownlist";
import { Switch } from "./case/button/switch";
import { HorizontalLayout } from "./core/wrapper/layout/layout.horizontal";
import { ShelterEditor } from "./case/editor/editor.shelter";
import { SelectTextTrigger } from "./case/trigger/trigger.text.select";
import { DateInterval } from "./widget/timeinterval/dateinterval";
import { DynamicDatePane } from "./widget/datepane/datepane";
import { AllCountPager } from "./case/pager/pager.all.count";
import { PopupView } from "./base/layer/layer.popup";
import { BubblePopupView, BubblePopupBarView, TextBubblePopupBarView } from "./case/combo/bubblecombo/popup.bubble";
import { ArrowTreeGroupNodeCheckbox } from "./case/checkbox/check.arrownode";
import { NumberInterval } from "./widget/numberinterval/numberinterval";
import { DynamicYearQuarterCombo } from "./widget/yearquarter/combo.yearquarter";
import { DynamicYearCombo } from "./widget/year/combo.year";
import { IntervalSlider } from "./widget/intervalslider/intervalslider";
import { MultiSelectInsertList } from "./widget/multiselectlist/multiselectlist.insert";
import { YearMonthInterval } from "./widget/yearmonthinterval/yearmonthinterval";
import { NumberEditor } from "./widget/numbereditor/numbereditor";
import { TextValueCheckCombo } from "./case/combo/textvaluecheckcombo/combo.textvaluecheck";
import { LinearSegment } from "./case/linersegment/linear.segment";
import { Img } from "./base/single/img/img";
import { EditorIconCheckCombo } from "./case/combo/editoriconcheckcombo/combo.editiconcheck";
import { IconTextValueCombo } from './case/combo/icontextvaluecombo/combo.icontextvalue';
import { ListView } from './base/list/listview';
import { FloatCenterLayout } from './core/wrapper/layout/middle/middle.float.center';
import { _msg } from './base/foundation/message';
import { _web } from './core/platform/web';
import { DynamicYearMonthPopup } from './widget/yearmonth/popup.yearmonth';
import { _utils } from './core/utils';
import { Controller } from "./core/controller/controller";
import { LayerController } from "./core/controller/controller.layer";
import { DateCalendarPopup } from "./widget/date/calendar/popup.calendar.date";
import { Tree, Node } from "./core/utils/tree";
import { TextNode } from "./base/single/button/node/textnode";
import { TextValueCheckComboPopup } from "./case/combo/textvaluecheckcombo/popup.textvaluecheck";
import { ImageButton } from './base/single/button/buttons/button.image';
import { History, Router } from "./router/router";
import { DateTimeCombo } from './widget/datetime/datetime.combo';


export interface BI extends _func, _i18n, _base, _inject, _var, _web, _utils {
    OB: typeof OB;
    Plugin: _Plugin;
    Widget: typeof Widget;
    Single: typeof Single;
    BasicButton: typeof BasicButton;
    NodeButton: typeof NodeButton;
    Checkbox: typeof Checkbox;
    Button: typeof Button;
    TextButton: typeof TextButton;
    IconChangeButton: typeof IconChangeButton;
    Trigger: typeof Trigger;
    Action: typeof Action;
    ActionFactory: typeof ActionFactory;
    ShowAction: typeof ShowAction;
    Controller: typeof Controller;
    LayerController: typeof LayerController;
    Behavior: typeof Behavior;
    BehaviorFactory: typeof BehaviorFactory;
    HighlightBehavior: typeof HighlightBehavior;
    RedMarkBehavior: typeof RedMarkBehavior;
    Pane: typeof Pane;
    LoadingPane: typeof LoadingPane;
    Tab: typeof Tab;
    ButtonGroup: typeof ButtonGroup;
    Combo: typeof Combo;
    TextValueCombo: typeof TextValueCombo;
    BubbleCombo: typeof BubbleCombo;
    AllValueMultiTextValueCombo: typeof AllValueMultiTextValueCombo;
    IconTextItem: typeof IconTextItem;
    MultiSelectItem: typeof MultiSelectItem;
    AbstractLabel: typeof AbstractLabel;
    Label: typeof Label;
    Text: typeof Text;
    Editor: typeof Editor;
    SignEditor: typeof SignEditor;
    Layout: typeof Layout;
    HTapeLayout: typeof HTapeLayout;
    VTapeLayout: typeof VTapeLayout;
    AbstractTreeValueChooser: typeof AbstractTreeValueChooser;
    AbstractListTreeValueChooser: typeof AbstractListTreeValueChooser;
    ListTreeValueChooserInsertCombo: typeof ListTreeValueChooserInsertCombo;
    TreeValueChooserCombo: typeof TreeValueChooserCombo;
    TreeValueChooserInsertCombo: typeof TreeValueChooserInsertCombo;
    MultiLayerSelectTreePopup: typeof MultiLayerSelectTreePopup;
    MultiLayerSingleTreePopup: typeof MultiLayerSingleTreePopup;
    TreeView: typeof TreeView;
    ListTreeView: typeof ListTreeView;
    ListAsyncTree: typeof ListAsyncTree;
    AsyncTree: typeof AsyncTree;
    MultiLayerSingleTreeCombo: typeof MultiLayerSingleTreeCombo;
    MultiLayerSelectTreeCombo: typeof MultiLayerSelectTreeCombo;
    MultiTreeListCombo: typeof MultiTreeListCombo;
    MultiTreeInsertCombo: typeof MultiTreeInsertCombo;
    Decorators: typeof decorator;
    DownListCombo: typeof DownListCombo;
    Iframe: typeof Iframe;
    AbsoluteLayout: typeof AbsoluteLayout;
    VerticalLayout: typeof VerticalLayout;
    DefaultLayout: typeof DefaultLayout;
    Input: typeof Input;
    SearchTextValueCombo: typeof SearchTextValueCombo;
    Icon: typeof Icon;
    LeftVerticalAdaptLayout: typeof LeftVerticalAdaptLayout;
    LeftRightVerticalAdaptLayout: typeof LeftRightVerticalAdaptLayout;
    IconTextIconItem: typeof IconTextIconItem;
    HorizontalAutoLayout: typeof HorizontalAutoLayout;
    InlineVerticalAdaptLayout: typeof InlineVerticalAdaptLayout;
    RightVerticalAdaptLayout: typeof RightVerticalAdaptLayout;
    TableAdaptLayout: typeof TableAdaptLayout;
    AbsoluteCenterLayout: typeof AbsoluteCenterLayout;
    HorizontalAdaptLayout: typeof HorizontalAdaptLayout;
    FloatLeftLayout: typeof FloatLeftLayout;
    FloatRightLayout: typeof FloatRightLayout;
    CenterAdaptLayout: typeof CenterAdaptLayout;
    VerticalAdaptLayout: typeof VerticalAdaptLayout;
    IconButton: typeof IconButton;
    TriggerIconButton: typeof TriggerIconButton;
    Searcher: typeof Searcher;
    TextEditor: typeof TextEditor;
    Radio: typeof Radio;
    A: typeof A;
    Html: typeof Html;
    Switcher: typeof Switcher;
    Loader: typeof Loader;
    ListPane: typeof ListPane;
    MultiSelectBar: typeof MultiSelectBar;
    SelectList: typeof SelectList;
    IconLabel: typeof IconLabel;
    Popover: typeof Popover;
    BarPopover: typeof BarPopover;
    IconCombo: typeof IconCombo;
    DynamicDateCombo: typeof DynamicDateCombo;
    CustomTree: typeof CustomTree;
    ButtonTree: typeof ButtonTree;
    IconArrowNode: typeof IconArrowNode;
    MidTreeLeafItem: typeof MidTreeLeafItem;
    FirstTreeLeafItem: typeof FirstTreeLeafItem;
    LastTreeLeafItem: typeof LastTreeLeafItem;
    SmallTextEditor: typeof SmallTextEditor;
    MultifileEditor: typeof MultifileEditor;
    MultiSelectInsertCombo: typeof MultiSelectInsertCombo;
    MultiSelectCombo: typeof MultiSelectCombo;
    SearchEditor: typeof SearchEditor;
    MultiLayerSingleLevelTree: typeof MultiLayerSingleLevelTree;
    SimpleColorChooser: typeof SimpleColorChooser;
    AbstractAllValueChooser: typeof AbstractAllValueChooser;
    AllValueChooserCombo: typeof AllValueChooserCombo;
    TextAreaEditor: typeof TextAreaEditor;
    SingleSelectItem: typeof SingleSelectItem;
    DynamicDateTimeCombo: typeof DynamicDateTimeCombo;
    MultiTreeCombo: typeof MultiTreeCombo;
    CenterLayout: typeof CenterLayout;
    VirtualGroup: typeof VirtualGroup;
    GridLayout: typeof GridLayout;
    MultiTreePopup: typeof MultiTreePopup;
    SingleSelectRadioItem: typeof SingleSelectRadioItem;
    SingleSelectInsertCombo: typeof SingleSelectInsertCombo;
    SingleSelectCombo: typeof SingleSelectCombo;
    CardLayout: typeof CardLayout;
    DynamicYearMonthCombo: typeof DynamicYearMonthCombo;
    TimeCombo: typeof TimeCombo;
    TextValueDownListCombo: typeof TextValueDownListCombo;
    Switch: typeof Switch;
    HorizontalLayout: typeof HorizontalLayout;
    ShelterEditor: typeof ShelterEditor;
    SelectTextTrigger: typeof SelectTextTrigger;
    DateInterval: typeof DateInterval;
    DynamicDatePane: typeof DynamicDatePane;
    AllCountPager: typeof AllCountPager;
    PopupView: typeof PopupView;
    BubblePopupView: typeof BubblePopupView;
    BubblePopupBarView: typeof BubblePopupBarView;
    TextBubblePopupBarView: typeof TextBubblePopupBarView;
    ArrowTreeGroupNodeCheckbox: typeof ArrowTreeGroupNodeCheckbox;
    NumberInterval: typeof NumberInterval;
    DynamicYearQuarterCombo: typeof DynamicYearQuarterCombo;
    DynamicYearCombo: typeof DynamicYearCombo;
    IntervalSlider: typeof IntervalSlider;
    MultiSelectInsertList: typeof MultiSelectInsertList;
    YearMonthInterval: typeof YearMonthInterval;
    TextValueCheckCombo: typeof TextValueCheckCombo;
    NumberEditor: typeof NumberEditor;
    LinearSegment: typeof LinearSegment;
    Img: typeof Img;
    EditorIconCheckCombo: typeof EditorIconCheckCombo;
    IconTextValueCombo: typeof IconTextValueCombo;
    ListView: typeof ListView;
    FloatCenterLayout: typeof FloatCenterLayout;
    Msg: _msg;
    DynamicYearMonthPopup: typeof DynamicYearMonthPopup;
    DateCalendarPopup: typeof DateCalendarPopup;
    TextNode: typeof TextNode;
    TextValueCheckComboPopup: typeof TextValueCheckComboPopup;
    ImageButton: typeof ImageButton;
    Router: typeof Router;
    history: History,
    DateTimeCombo: typeof DateTimeCombo;
}

export default {
    Decorators: decorator,
};
export {
    OB,
    Widget,
    Single,
    BasicButton,
    Checkbox,
    Icon,
    LeftVerticalAdaptLayout,
    LeftRightVerticalAdaptLayout,
    SearchTextValueCombo,
    Input,
    IconTextItem,
    AllValueMultiTextValueCombo,
    IconTextIconItem,
    Layout,
    HorizontalAutoLayout,
    InlineVerticalAdaptLayout,
    RightVerticalAdaptLayout,
    TableAdaptLayout,
    AbsoluteCenterLayout,
    HorizontalAdaptLayout,
    FloatLeftLayout,
    FloatRightLayout,
    VerticalLayout,
    AbsoluteLayout,
    DefaultLayout,
    HTapeLayout,
    CenterAdaptLayout,
    VTapeLayout,
    VerticalAdaptLayout,
    IconButton,
    Trigger,
    TriggerIconButton,
    Action,
    ActionFactory,
    ShowAction,
    Controller,
    LayerController,
    Behavior,
    BehaviorFactory,
    RedMarkBehavior,
    HighlightBehavior,
    LoadingPane,
    Searcher,
    AbstractLabel,
    Label,
    TextButton,
    DownListCombo,
    IconChangeButton,
    Button,
    TextEditor,
    A,
    Html,
    Switcher,
    BubbleCombo,
    Loader,
    ListPane,
    MultiSelectBar,
    SelectList,
    TextValueCombo,
    Editor,
    IconLabel,
    Popover,
    BarPopover,
    Tab,
    AbstractTreeValueChooser,
    AbstractListTreeValueChooser,
    ListTreeValueChooserInsertCombo,
    TreeValueChooserCombo,
    TreeValueChooserInsertCombo,
    MultiLayerSelectTreePopup,
    MultiLayerSingleTreePopup,
    TreeView,
    ListTreeView,
    ListAsyncTree,
    AsyncTree,
    MultiLayerSingleTreeCombo,
    MultiLayerSelectTreeCombo,
    MultiTreeListCombo,
    MultiTreeInsertCombo,
    Combo,
    IconCombo,
    DynamicDateCombo,
    Radio,
    MultiSelectItem,
    CustomTree,
    ButtonGroup,
    ButtonTree,
    NodeButton,
    IconArrowNode,
    MidTreeLeafItem,
    FirstTreeLeafItem,
    LastTreeLeafItem,
    SmallTextEditor,
    MultifileEditor,
    SignEditor,
    MultiSelectInsertCombo,
    MultiSelectCombo,
    SearchEditor,
    Text,
    Pane,
    MultiLayerSingleLevelTree,
    SimpleColorChooser,
    AbstractAllValueChooser,
    AllValueChooserCombo,
    TextAreaEditor,
    SingleSelectItem,
    DynamicDateTimeCombo,
    MultiTreeCombo,
    CenterLayout,
    VirtualGroup,
    GridLayout,
    MultiTreePopup,
    SingleSelectRadioItem,
    SingleSelectInsertCombo,
    SingleSelectCombo,
    CardLayout,
    DynamicYearMonthCombo,
    TimeCombo,
    Iframe,
    TextValueDownListCombo,
    Switch,
    HorizontalLayout,
    ShelterEditor,
    SelectTextTrigger,
    DateInterval,
    DynamicDatePane,
    AllCountPager,
    PopupView,
    BubblePopupView,
    BubblePopupBarView,
    TextBubblePopupBarView,
    ArrowTreeGroupNodeCheckbox,
    NumberInterval,
    DynamicYearQuarterCombo,
    DynamicYearCombo,
    IntervalSlider,
    MultiSelectInsertList,
    YearMonthInterval,
    TextValueCheckCombo,
    NumberEditor,
    LinearSegment,
    Img,
    EditorIconCheckCombo,
    IconTextValueCombo,
    ListView,
    FloatCenterLayout,
    DynamicYearMonthPopup,
    DateCalendarPopup,
    Tree,
    Node,
    TextNode,
    TextValueCheckComboPopup,
    ImageButton,
    Router,
    History,
    DateTimeCombo,
};
