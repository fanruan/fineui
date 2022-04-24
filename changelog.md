# 更新日志
2.0(2022-01)
- 提供自定义表单

2.0(2021-12)
- 新增Context组件
- toast支持closable属性，可控制是否显示关闭按钮
- 新增气泡弹框控件
- BI.point支持widget添加埋点
- childContext废弃，替换成provide
- 支持BI.useContext获取上下文环境
- BI.Msg.alert支持message传json格式
- 支持BI.config(function(){})进行系统配置

2.0(2021-11)
- 限制了复选下拉框一次粘贴添加值个数最大2000

2.0(2021-10)
- combo增加window.blur事件触发隐藏

2.0(2021-09)
- 支持自动watch
- 支持h函数传递left、right，优化left_right_vertical_adapt布局的jsx写法
- 新增bi.virtual_group_list组件

2.0(2021-07)
- layout支持forceUpdate刷新方式
- width属性支持calc()
- 修改了颜色选择器交互
- 新增bi.horizontal_fill、bi.vertical_fill布局
- 增加module定义插件版本号
- bubble使用popper.js实现
- 优化了日期类型控件标红时的报错提示
- 支持虚拟dom
- 修复了树控件节点未初始化时调用树的getValue始终为空的问题

2.0(2021-05)
- 支持搜索的控件支持搜索包含空格的字符串
- 解决了树列表populate调用两次itemsCreator的问题

2.0(2021-03)
- 优化left_right_vertical_adapt布局，去掉float属性只使用flex
- inline布局支持用calc计算fill列宽度
- 时间类型控件无翻页限制
- 时间类型控件优化动态时间面板的交互

2.0(2021-02)
- 增加beforeRender生命周期函数

2.0(2021-01)
- 修改了日期下拉面板中的当前时间按钮的交互效果
- 新增年区间和年季度区间控件
- 日期类型控件不操作下拉面板收起不发Confirm事件
- 日期类型控件全系列可设置是否显示动态日期
- 日期类型控件全系列可设置最大最小日期
- 调整了combo的popup显示位置计算逻辑

2.0(2020-12)
- multi_layer_down_list_combo支持无限层级
- 新增不带全选的同步复选下拉框
- 日期选择控件为年月选择器子组件新增POPUP弹出前事件
- 文件上传控件新增API(setMaxFileLength)以动态设置最大上传文件数量
- 复选下拉树显示查看已选效果改成和复选下拉列表一致
- Pane系列提供small和big两种大小的加载动画
- 同步树列表系列支持不显示节点连接线和展开收起图标
- 规范了下拉树trigger中显示值的显示顺序
- bi.editor支持传入autocomplete
- [视觉]editor水印间距统一与文本域水印不可选中
- 修复bi.file的url参数拼接问题
- 修复了colorChooser选择透明后, 打开更多选色面板, 直接点保存会选中自动的问题
- bi.file支持限制上传文件数

2.0(2020-11)
- bi.file上传文件errorMsg默认调用国际化
- 修复了文本标签text传递空字符串后显示value值的问题
- 限制了title的最大高度
- bi.textarea_editor添加setWatermark方法
- 生命周期可以通过属性传递来操作
- 修复了颜色选择器hex框不能输入为空的问题
- 增加纯文本组件bi.pure_text
- store支持webworker,引入多线程机制
- 修复了Popover小屏幕上看不完整的问题
- 颜色选择器支持输入16进制颜色编号
- bi.textarea_editor支持气泡提示报错

2.0(2020-10)
- 支持Composition API
- pane和loadingPane支持加载时自定义提示文本

2.0(2020-09)
- combo增加click-blur(点击显示,blur消失)作为触发条件功能
- allCountPager支持是否显示总行数
- 修复区间滑块setEnable(false)滑块不灰化的问题
- 修复同步复选下拉框系列setValue所有值后触发器不显示全选的问题
- BI.Tree.traversal方法迭代函数增加父节点参数

2.0(2020-08)
- bi.sign_editor支持显示值居左/居中/居右显示
- bi.iframe新增EVENT_LOADED事件
- 修复了searcher在允许搜索的情况下输入空格直接退出搜索的问题
- 修复了复选下拉系列'点按空格添加完全匹配项'添加的是显示值而非实际值的问题
- search_text_value_combo支持水印
- BI.makeObject 方法支持传入iteratee

2.0(2020-07)
- 修复了日期类型控件先展开切换日期月份面板，再设置区间使得该月份不合法，查看该月份面板灰化不对的问题
- bi.file文件上传控件accept属性与 [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) 统一
- 修复了日期类型控件设置一个不在minDate和maxDate之间的日期值时，面板灰化与翻页按钮状态不对的问题
- BI.OB的on方法返回一个解除监听的函数
- 修复了grid_view执行_unMount时不调用子组件的_unMount的问题
- combo新增belowMouse属性,允许popup在点击处弹出
- combo新增hideWhenAnotherComboOpen属性,开启则其他combo下拉时当前combo收起
- 修复了datePicker在setValue的时候没有动态刷新可用月份的问题
- 同步复选下拉及其面板新增getAllValue获取所有已选值
- 同步复选下拉树及其面板新增getAllValue获取完整的选中树节点
- 修复date_picker最大值最小值与面板展示判断问题
- 复选下拉树和下拉列表添加showView和hideVIew方法
- number_editor支持自动检测数值与范围是否合法
- 修复了颜色选择器设置值为null的时候,trigger和popup表现不一致的问题

2.0(2020-06)
- 修复了复选下拉树半选节点的子节点未加载的时候，点选该半选节点是取消选中的问题
- 下拉树系列支持isNeedAdjustWidth以动态变化宽度
- 修复了新增值的下拉控件传递valueFormatter搜索完全匹配项提示新增
- 修复了选色控件历史记录没有选中的问题的问题
- 修复了单选下拉框新增值的时候没有发事件的问题
- 修复了单选标红combo类setValue为空字符串会标红的问题
- BI.history提供与注册路由对应的卸载路由方法unRoute
- 修复了单选标红combo类setValue为空和空数组行为不一致的问题
- 单选列表支持新增选项
- 增加组件shortcut未定义的错误提示

2.0(2020-05)
- 修复调用BI.history.navigate(XXX, {trigger: false})时, XXX包含中文空格等字符仍然触发回调的问题
- 新增BI.after和BI.before方法
- 修复bi.button设置宽度并配置iconCls后，文本很长的情况下显示截断的问题
- 填加bi-user-select-enable和bi-user-select-disable通用类名
- 修复树系列多层半选状态下,勾选祖先节点,后代节点不受影响的问题
- 修复上传控件多个title问题

2.0(2020-04)
- 修复树列表通过空格回到初始面板没有刷新的问题
- 下拉树系列添加下拉popup弹出前事件
- 修复了复选下拉勾选值和搜索结果中含有父子串关系时提示不正确的问题
- searcher提供可配是否支持搜索空格的allSearchBlank
- 修复了复选下拉全选状态下使用空格添加值trigger显示更新不对的问题
- 复选下拉树展开节点提供分页加载和滚动加载两种方式
- 修复了复选下拉列表初始化的时候发送执行两次itemsCreator的问题
- 修复了virtual_list重新populate无效的问题
- 复选下拉框新增值的时候外抛事件
- 空格不再编码成&nbsp
- 支持文本区域水印可滚动

2.0(2020-03)
- 修复了IE9下使用bi.file上传包含特殊字符的excel出错的问题
- 修复了下拉类型控件不允许编辑的时候没有title的问题
- 修复了连续多次调用BI.Msg.alert后只有最后弹出的可以关闭的问题
- 修复了time_combo设置格式为%M:%S后value设置大于30分钟的值时标红的问题
- 复选下拉树系列展开节点性能优化

2.0(2020-02)
- 拓展BI.concat,使其可以拼接多个数组
- 修复勾选节点不影响父子节点勾选状态的树搜索选中getValue不正常的问题

2.0(2020-01)
- 修复单值系滑块滑动松手后发两次EVENT_CHANGE的问题

2.0(2019-12)
- 修复多层级单选下拉树主动设置container后搜索面板弹出问题
- bi.search_editor支持搜索中间含有空格的字符串
- 修复了监听日期下拉框before_popup_view事件，调用setMinDate无效的问题
- 修复了数值滑块逆向排列滑块后populate显示效果不对的问题
- 不影响父节点勾选状态的复选树支持自定义水印和默认值
- 修复text组件重新设置文本后标红丢失问题
- 添加无全选按钮的复选下拉框组件

2.0(2019-11)
- 日期系列新增setMinDate和setMaxDate接口
- 修复了同步复选树设置节点默认open后, 叶子节点无法选中的问题
- 修复了连续多音字搜索可能导致结果异常或者标红异常的问题
- 新增BI.set(object, path, value)方法
- getSearchResult兼容了对null值的处理
- 增加了异步单选下拉树请求完数据后加载完节点后会自动调整宽高的逻辑

2.0(2019-10)
- 修改了下拉树展开图标模糊的问题
- 修复了下拉树搜索高亮字符与正常字符间存在间距的问题
- 复选下拉系列的计数器从trigger中拆分, 作为独立的部分
- 增加BI.createElement方法
- 统一了单选下拉和复选下拉添加自定义值的交互效果

2.0(2019-09)
- [视觉]popover弹出框增加圆角
- 文本列表通过复制粘贴的形式选中值的时候发送事件
- 修复tree_value_chooser选中节点的唯一子节点后搜索该子节点，无法取消选中的问题
- button的bubble创建的popup在收起的时候会destroy
- 修复了dynamic_date_pane在切换静态时间和动态时间的时候不会发事件的问题

2.0(2019-08)
- 修复valueChooser系列不支持value属性的问题
- 更新了若干icon-font的样式
- 修复了单选树同步搜索状态下父节点前可能没有展开符号的问题
- 单选树可展示并选中不存在的值
- 树类型下拉新增可搜索实际值的配置
- 可编辑的combo新增水印配置
- 单选下拉树同步状态下内置搜索

2.0(2019-07)
- 修改了下拉框控件默认值的配色
- input及其派生编辑控件在PAUSE事件之前会触发CHANGE事件

2.0(2019-06)
- 单选下拉树支持搜索与异步加载节点
- 提供了AES加密方法

2.0(2019-05)
- editor类控件新增EVENT_CHANGE_CONFIRM事件
- 复选下拉控件和树下拉控件支持trigger是否可编辑
- 时分秒控件支持自定义时间显示格式和是否可编辑
- 日期/时间/日期区间/时间区间支持自定义日期选择范围和是否可编辑
- 日期/时间/日期区间/时间区间支持自定义日期显示格式和是否可编辑
- 增加less函数: 字体资源添加函数addFontRes和字体激活函数activeFont

> @fontList: "dec", "report";
> .addFontRes("dec");
> .addFontRes("report");
> .activateFont(@fontList);

以上即可使用自定义的dec,report字体和fineui的资源字体

2.0(2019-04)
- 新增`bi.multi_tree_list_combo`控件, 此下拉树勾选节点时不会影响父子节点的勾选状态
- 新增`bi.multi_tree_insert_combo`控件, 此下拉树可以插入不存在的新值
- 新增`bi.list_tree_value_chooser_insert_combo`部件, 封装`bi.multi_tree_list_combo`数据处理逻辑
- 新增`bi.tree_value_chooser_insert_combo`部件, 封装`bi.multi_tree_insert_combo`数据处理逻辑
- 增加BI.DOM.ready方法

2.0(2019-03)
- 新增`bi.time_combo`时分秒控件和`bi.time_periods`时间选择区间，时间区间无有效值校验
- Label控件增加highlight参数, 可指定初始化标蓝

2.0(2019-01)
- 加载更多的单选下拉系列新增allowNoSelect参数配置, 使得可以不选任意一个值

2.0(2018-12)
- 增加Button的点击动画和Combo下拉时下拉图标动画


2.0(2018-11)
- 增加`bi.html`和`bi.html_label`类型，text支持html文本，不支持keyword


2.0(2018-10)
- popover增加高度自适应，即open的时候回根据内容高度调整popover的高度


2.0(2018-09)
- 增加Fix对configuable为false的对象的不内部构造响应式数据的性能优化处理，例如:

> this.model.json = Object.freeze({name: "zhang"});

只会对this.model.json进行响应式处理，不会对内部的name进行响应式处理


2.0(2018-08)
- 增加BI.mount方法，支持同构
