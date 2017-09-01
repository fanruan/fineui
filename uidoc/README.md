# FineUIdocs
FineUI的交互、前端以及视觉文档规范

####1. 控件都会提供setValue, getValue, populate这几个方法来设置值，获取值(展示类控件除外)和刷新控件
####2. 控件都会提供setEnable, setVisible, setValid这几个方法来设置使能，是否可见，是否有效状态，并且在fineui2.0之后，会自动给子组件设置同样的状态，不要重写这些方法，一些需要在设置状态时的额外操作可以通过重写_setXXX来实现
####3. 使用populate来清空或者重置布局，不要使用empty, 慎用resize
####4. 谨慎监听和触发BI.Controller.EVENT_CHANGE事件，一般来说，控件都会有一个BI.ClassName.EVENT_CHANGE事件,一些特殊的事件会在对应控件文档中列出