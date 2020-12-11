import { _Combo, _ComboStatic } from "./base/combination/combo";
import { _ButtonGroup, _ButtonGroupChooseType, _ButtonGroupStatic } from "./base/combination/group.button";
import { _Tab, _TabStatic } from "./base/combination/tab";
import { _Pane, _PaneStatic } from "./base/pane";
import { _BasicButton, _BasicButtonStatic, BasicButton } from "./base/single/button/button.basic";
import { _NodeButton } from "./base/single/button/button.node";
import { _Button, _ButtonStatic } from "./base/single/button/buttons/button";
import { _TextButton, _TextButtonStatic } from "./base/single/button/buttons/button.text";
import { _IconTextItem, _IconTextItemStatic } from "./base/single/button/listitem/icontextitem";
import { _Editor, _EditorStatic } from "./base/single/editor/editor";
import { _Iframe } from "./base/single/iframe/iframe";
import { _Checkbox, _CheckboxStatic } from "./base/single/input/checkbox";
import { _Input, _InputStatic } from "./base/single/input/input";
import { _AbstractLabel, AbstractLabel } from "./base/single/label/abstract.label";
import { _Label, Label } from "./base/single/label/label";
import { _Single, Single } from "./base/single/single";
import { _Text } from "./base/single/text";
import { _Trigger } from "./base/single/trigger/trigger";
import { _IconChangeButton, _IconChangeButtonStatic } from "./case/button/icon/icon.change";
import { _MultiSelectItem, _MultiSelectItemStatic } from "./case/button/item.multiselect";
import { _BubbleCombo, _BubbleComboStatic } from "./case/combo/bubblecombo/combo.bubble";
import { _TextValueCombo, _TextValueComboStatic } from "./case/combo/combo.textvalue";
import { _SearchTextValueCombo, _SearchTextValueComboStatic } from "./case/combo/searchtextvaluecombo/combo.searchtextvalue";
import { _SignEditor, _SignEditorStatic } from "./case/editor/editor.sign";
import { _LoadingPane } from "./case/loading/loading_pane";
import { _AllValueMultiTextValueCombo, _AllValueMultiTextValueComboStatic } from "./component/allvaluemultitextvaluecombo/allvalue.multitextvalue.combo";
import { _AbstractTreeValueChooser } from "./component/treevaluechooser/abstract.treevaluechooser";
import { _AbstractListTreeValueChooser } from "./component/treevaluechooser/abstract.treevaluechooser.list";
import { _Action, _ActionFactory } from "./core/action/action";
import { _ShowAction } from "./core/action/action.show";
import { _base } from "./core/base";
import { _Behavior, _BehaviorFactory } from "./core/behavior/behavior";
import { _HighlightBehavior } from "./core/behavior/behavior.highlight";
import { _RedMarkBehavior } from "./core/behavior/behavior.redmark";
import * as decorator from "./core/decorator/decorator";
import { _func } from "./core/func";
import { _i18n } from "./core/i18n";
import { _Plugin } from "./core/plugin";
import { _OB } from "./core/ob";
import { _Widget, _WidgetStatic, Widget } from "./core/widget";
import { _inject } from "./core/inject";
import { _Layout } from "./core/wrapper/layout";
import { _AbsoluteLayout } from "./core/wrapper/layout/layout.absolute";
import { _HTapeLayout, _VTapeLayout } from "./core/wrapper/layout/layout.tape";
import { _VerticalLayout } from "./core/wrapper/layout/layout.vertical";
import { _DefaultLayout } from "./core/wrapper/layout/layout.default";
import { _DownListCombo, _DownListComboStatic } from "./widget/downlist/combo.downlist";
import { Icon } from "./base/single/icon/icon";
import { _LeftVerticalAdapt } from "./core/wrapper/layout/adapt/adapt.leftvertical";
import { LeftRightVerticalAdaptLayout, RightVerticalAdaptLayout } from "./core/wrapper/layout/adapt/adapt.leftrightvertical";
import { IconTextIconItem } from "./base/single/button/listitem/icontexticonitem";
import { HorizontalAutoLayout } from "./core/wrapper/layout/adapt/auto.horizontal";
import { InlineVerticalAdaptLayout } from "./core/wrapper/layout/adapt/inline.vertical";
import { TableAdaptLayout } from "./core/wrapper/layout/adapt/adapt.table";
import { IconButton } from "./base/single/button/buttons/button.icon";


type ClassConstructor<T extends {}> = T & {
    new(config: any): T;
    (config: any): T;
    readonly prototype: T;
    readonly xtype: string;
}

export interface BI extends _func, _i18n, _base, _inject {
    OB: ClassConstructor<_OB>;
    Plugin: _Plugin;
    Widget: ClassConstructor<_Widget> & _WidgetStatic;
    Single: ClassConstructor<_Single>;
    BasicButton: ClassConstructor<_BasicButton> & _BasicButtonStatic;
    NodeButton: ClassConstructor<_NodeButton>;
    Checkbox: ClassConstructor<_Checkbox> & _CheckboxStatic;
    Button: ClassConstructor<_Button> & _ButtonStatic;
    TextButton: ClassConstructor<_TextButton> & _TextButtonStatic;
    IconChangeButton: ClassConstructor<_IconChangeButton> & _IconChangeButtonStatic;
    Trigger: ClassConstructor<_Trigger>;
    Action: ClassConstructor<_Action>;
    ActionFactory: ClassConstructor<_ActionFactory>;
    ShowAction: ClassConstructor<_ShowAction>;
    Behavior: ClassConstructor<_Behavior>;
    BehaviorFactory: ClassConstructor<_BehaviorFactory>;
    HighlightBehavior: ClassConstructor<_HighlightBehavior>;
    RedMarkBehavior: ClassConstructor<_RedMarkBehavior>;
    Pane: ClassConstructor<_Pane> & _PaneStatic;
    LoadingPane: ClassConstructor<_LoadingPane>;
    Tab: ClassConstructor<_Tab> & _TabStatic;
    ButtonGroup: ClassConstructor<_ButtonGroup> & _ButtonGroupChooseType & _ButtonGroupStatic;
    Combo: ClassConstructor<_Combo> & _ComboStatic;
    TextValueCombo: ClassConstructor<_TextValueCombo> & _TextValueComboStatic;
    BubbleCombo: ClassConstructor<_BubbleCombo> & _BubbleComboStatic;
    AllValueMultiTextValueCombo: ClassConstructor<_AllValueMultiTextValueCombo> & _AllValueMultiTextValueComboStatic;
    IconTextItem: ClassConstructor<_IconTextItem> & _IconTextItemStatic;
    MultiSelectItem: ClassConstructor<_MultiSelectItem> & _MultiSelectItemStatic;
    AbstractLabel: ClassConstructor<_AbstractLabel>;
    Label: ClassConstructor<_Label>;
    Text: ClassConstructor<_Text>;
    Editor: ClassConstructor<_Editor> & _EditorStatic;
    SignEditor: ClassConstructor<_SignEditor> & _SignEditorStatic;
    Layout: ClassConstructor<_Layout>;
    HTapeLayout: ClassConstructor<_HTapeLayout>;
    VTapeLayout: ClassConstructor<_VTapeLayout>;
    AbstractTreeValueChooser: ClassConstructor<_AbstractTreeValueChooser>;
    AbstractListTreeValueChooser: ClassConstructor<_AbstractListTreeValueChooser>;
    Decorators: typeof decorator;
    DownListCombo: ClassConstructor<_DownListCombo> & _DownListComboStatic;
    Iframe: ClassConstructor<_Iframe>;
    AbsoluteLayout: ClassConstructor<_AbsoluteLayout>;
    VerticalLayout: ClassConstructor<_VerticalLayout>;
    DefaultLayout: ClassConstructor<_DefaultLayout>;
    Input: ClassConstructor<_Input> & _InputStatic;
    SearchTextValueCombo: ClassConstructor<_SearchTextValueCombo> & _SearchTextValueComboStatic;
    Icon: typeof Icon;
    LeftVerticalAdaptLayout: ClassConstructor<_LeftVerticalAdapt>;
    LeftRightVerticalAdaptLayout: typeof LeftRightVerticalAdaptLayout;
    IconTextIconItem: typeof IconTextIconItem;
    HorizontalAutoLayout: typeof HorizontalAutoLayout;
    InlineVerticalAdaptLayout: typeof InlineVerticalAdaptLayout;
    RightVerticalAdaptLayout: typeof RightVerticalAdaptLayout;
    TableAdaptLayout: typeof TableAdaptLayout;
    IconButton: typeof IconButton;
}

export default {
    Decorators: decorator,
};
export {
    Widget,
    Single,
    BasicButton,
    Icon,
    LeftRightVerticalAdaptLayout,
    IconTextIconItem,
    HorizontalAutoLayout,
    InlineVerticalAdaptLayout,
    RightVerticalAdaptLayout,
    TableAdaptLayout,
    IconButton,
    AbstractLabel,
    Label,
};
