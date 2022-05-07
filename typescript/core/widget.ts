import { OB, _OB } from "./ob";

export interface _WidgetStatic {

    /**
     * 注册渲染引擎
     * @param engine 引擎
     */
    registerRenderEngine(engine: RenderEngine): void;
}

export interface _Widget extends _OB {

    /**
     * 出现loading的锁
     */
    __asking: boolean;

    /**
     * 同步锁
     */
    __async: boolean;

    /**
     * widget类标识符
     */
    widgetName: string | null;

    /**
     * 是否为根节点
     */
    _isRoot: boolean;

    /**
     * 父节点
     */
    _parent: _Widget | null;
    // TODO: 完成jquery文件夹后把这块改了
    /**
     * 真实dom的类jQuery对象
     */
    element: {
        width(): number;
        height(): number;
        width(width: number | string): _Widget['element'];
        height(height: number | string): _Widget['element'];
        [key: string]: any;
    };

    /**
     * 子元素
     */
    _children: {
        [key: string]: _Widget;
    };

    /**
     * 是否已挂载
     */
    _isMounted: boolean;

    /**
     * 手动设置enable
     */
    _manualSetEnable: boolean;

    /**
     * 手动设置valid
     */
    _manualSetValid: boolean;

    /**
     * 渲染引擎
     */
    _renderEngine: RenderEngine;

    _store(): void;

    // 生命周期函数
    /**
     * 初始化前
     */
    beforeInit?(cb: Function): void;

    /**
     * 创建前
     */
    beforeCreate?(): void;

    /**
     * 创建
     */
    created?(): void;

    /**
     * 渲染
     */
    render?(): any;

    /**
     * 挂载前
     */
    beforeMount?(): void;

    /**
     * 挂载
     */
    mounted?(): void;

    /**
     * 更新前
     */
    shouldUpdate?(): void;

    /**
     * 更新
     */
    update?(...args: any[]): void;

    /**
     * 销毁前
     */
    beforeDestroy?(): void;

    /**
     * 销毁
     */
    destroyed?(): void;

    /**
     * 初始化render函数
     */
    _initRender: () => void;

    /**
     * 内部主render函数
     */
    _render: () => void;

    /**
     * 初始化根节点
     */
    _initRoot: () => void;

    /**
     * 初始化元素宽度
     */
    _initElementWidth: () => void;

    /**
     * 初始化元素高度
     */
    _initElementHeight: () => void;

    /**
     * 初始化元素可见
     */
    _initVisual: () => void;

    /**
     * 初始化元素可用不可用
     */
    _initEffects: () => void;

    /**
     * 设置mounted锁
     */
    _initState: () => void;

    /**
     * 生成真实dom
     */
    _initElement: () => void;

    /**
     * 设置父节点
     */
    _setParent: () => void;

    /**
     * @param force 是否强制挂载子节点
     * @param deep 子节点是否也是按照当前force处理
     * @param lifeHook 生命周期钩子触不触发，默认触发
     * @param predicate 递归每个widget的回调
     */
    _mount(force?: boolean, deep?: boolean, lifeHook?: boolean, predicate?: Function): boolean;

    /**
     * 挂载子节点
     */
    _mountChildren?(): void;

    /**
     * 是否已挂载
     */
    isMounted(): boolean;

    /**
     * 设置宽度
     */
    setWidth(w: number): void;

    /**
     * 设置高度
     */
    setHeight(h: number): void;

    /**
     * 设置可用
     */
    _setEnable(enable: boolean): void;

    /**
     * 设置合法
     */
    _setValid(valid: boolean): void;

    /**
     * 设置可见
     */
    _setVisible(visible: boolean): void;

    /**
     * 设置是否可用
     */
    setEnable(enable: boolean): void;

    /**
     * 设置是否可见
     */
    setVisible(visible: boolean): void;

    /**
     * 设置是否合法
     */
    setValid(valid: boolean): void;

    /**
     * 设置反馈效果
     * @param args arguments参数
     */
    doBehavior(...args: any[]): void;

    /**
     * 获取宽度
     */
    getWidth(): number;

    /**
     * 获取高度
     */
    getHeight(): number;

    /**
     * 是否合法
     */
    isValid(): boolean;

    /**
     * 新增子元素
     */
    addWidget(_name: any, _widget: _Widget): _Widget;

    /**
     * 根据wigetname获取子元素实例
     */
    getWidgetByName(_name: string): _Widget | undefined;

    /**
     * 移除子元素
     * @param nameOrWidget widgetName或widget实例
     */
    removeWidget(nameOrWidget: string | _Widget): void;

    /**
     * 是否有某个子元素
     */
    hasWidget(name: string): boolean;

    /**
     * 获取widgetName
     */
    getName(): string;

    /**
     * 设置tag
     * @param tag html tag
     */
    setTag(tag: string): void;

    /**
     * 获取tag
     */
    getTag(): string;

    /**
     * 设置属性
     * @param key 键
     * @param value 值
     */
    attr(key: string | { [key: string]: any }, value?: any): any;

    /**
     * 获取text
     */
    getText(): string;

    /**
     * 设置text
     */
    setText(text: string): void;

    /**
     * 获取值
     */
    getValue(): any;

    /**
     * 设置值
     */
    setValue(...args: any[]): void;

    /**
     * 获取是否enable
     */
    isEnabled(): boolean;

    /**
     * 是否可见
     */
    isVisible(): boolean;

    /**
     * disable元素
     */
    disable(): void;

    /**
     * enable元素
     */
    enable(): void;

    /**
     * 是widget合法
     */
    valid(): void;

    /**
     * 使元素不合法
     */
    invalid(): void;

    /**
     * 使不可见
     */
    invisible(..._args: any[]): void;

    /**
     * 可见
     */
    visible(..._args: any[]): void;

    /**
     * 清除子元素
     */
    __d(): void;

    /**
     * 取消挂载
     */
    _unMount(): void;

    /**
     * hang元素
     */
    isolate(): void;

    /**
     * 请除元素
     */
    empty(): void;

    /**
     * 刷新控件
     */
    reset(): void;

    /**
     * 内部destory方法
     */
    _destroy(): void;

    /**
     * destory元素
     */
    destroy(): void;
}

interface RenderEngine {
    // TODO: 完成jquery文件夹后把这块改了
    /**
     * 创建元素方法，返回的类jQuery对象
     * @param widget widget对象
     */
    createElement: (widget: any) => any;

    /**
     * 创建DocumentFragment对象
     */
    createFragment: () => DocumentFragment;
}

export declare class Widget extends OB {
    //
    /**
     * 注册渲染引擎
     * @param engine 引擎
     */
    static registerRenderEngine(engine: RenderEngine): void;

    /**
     * 出现loading的锁
     */
    __asking: boolean;

    /**
     * 同步锁
     */
    __async: boolean;

    /**
     * widget类标识符
     */
    widgetName: string | null;

    /**
     * 是否为根节点
     */
    _isRoot: boolean;

    /**
     * 父节点
     */
    _parent: _Widget | null;
    // TODO: 完成jquery文件夹后把这块改了
    /**
     * 真实dom的类jQuery对象
     */
    element: {
        width(): number;
        height(): number;
        width(width: number | string): Widget['element'];
        height(height: number | string): Widget['element'];
        [key: string]: any;
    };

    /**
     * 子元素
     */
    _children: {
        [key: string]: _Widget;
    };

    /**
     * 是否已挂载
     */
    _isMounted: boolean;

    /**
     * 手动设置enable
     */
    _manualSetEnable: boolean;

    /**
     * 手动设置valid
     */
    _manualSetValid: boolean;

    /**
     * 渲染引擎
     */
    _renderEngine: RenderEngine;

    _store(): void;

    // 生命周期函数
    /**
     * 初始化前
     */
    beforeInit?(cb: Function): void;

    /**
     * 渲染前
     */
    beforeRender?(cb: Function): void;

    /**
     * 创建前
     */
    beforeCreate?(): void;

    /**
     * 创建
     */
    created?(): void;

    /**
     * 渲染
     */
    render?(): any;

    /**
     * 挂载前
     */
    beforeMount?(): void;

    /**
     * 挂载
     */
    mounted?(): void;

    /**
     * 更新前
     */
    shouldUpdate?(): void;

    /**
     * 更新
     */
    update?(...args: any[]): void;

    /**
     * 销毁前
     */
    beforeDestroy?(): void;

    /**
     * 销毁
     */
    destroyed?(): void;

    /**
     * 初始化render函数
     */
    _initRender: () => void;

    /**
     * 内部主render函数
     */
    _render: () => void;

    /**
     * 初始化根节点
     */
    _initRoot: () => void;

    /**
     * 初始化元素宽度
     */
    _initElementWidth: () => void;

    /**
     * 初始化元素高度
     */
    _initElementHeight: () => void;

    /**
     * 初始化元素可见
     */
    _initVisual: () => void;

    /**
     * 初始化元素可用不可用
     */
    _initEffects: () => void;

    /**
     * 设置mounted锁
     */
    _initState: () => void;

    /**
     * 生成真实dom
     */
    _initElement: () => void;

    /**
     * 设置父节点
     */
    _setParent: () => void;

    /**
     * @param force 是否强制挂载子节点
     * @param deep 子节点是否也是按照当前force处理
     * @param lifeHook 生命周期钩子触不触发，默认触发
     * @param predicate 递归每个widget的回调
     */
    _mount(force?: boolean, deep?: boolean, lifeHook?: boolean, predicate?: Function): boolean;

    /**
     * 挂载子节点
     */
    _mountChildren?(): void;

    /**
     * 是否已挂载
     */
    isMounted(): boolean;

    /**
     * 设置宽度
     */
    setWidth(w: number | string): void;

    /**
     * 设置高度
     */
    setHeight(h: number | string): void;

    /**
     * 设置可用
     */
    _setEnable(enable: boolean): void;

    /**
     * 设置合法
     */
    _setValid(valid: boolean): void;

    /**
     * 设置可见
     */
    _setVisible(visible: boolean): void;

    /**
     * 设置是否可用
     */
    setEnable(enable: boolean): void;

    /**
     * 设置是否可见
     */
    setVisible(visible: boolean): void;

    /**
     * 设置是否合法
     */
    setValid(valid: boolean): void;

    /**
     * 设置反馈效果
     * @param args arguments参数
     */
    doBehavior(...args: any[]): void;

    /**
     * 获取宽度
     */
    getWidth(): number;

    /**
     * 获取高度
     */
    getHeight(): number;

    /**
     * 是否合法
     */
    isValid(): boolean;

    /**
     * 新增子元素
     */
    addWidget(widget: _Widget): _Widget;
    addWidget(_name: any, _widget: _Widget): _Widget;

    /**
     * 根据wigetname获取子元素实例
     */
    getWidgetByName(_name: string): _Widget | undefined;

    /**
     * 移除子元素
     * @param nameOrWidget widgetName或widget实例
     */
    removeWidget(nameOrWidget: string | _Widget): void;

    /**
     * 是否有某个子元素
     */
    hasWidget(name: string): boolean;

    /**
     * 获取widgetName
     */
    getName(): string;

    /**
     * 设置tag
     * @param tag html tag
     */
    setTag(tag: string): void;

    /**
     * 获取tag
     */
    getTag(): string;

    /**
     * 设置属性
     * @param key 键
     * @param value 值
     */
    attr(key: string | { [key: string]: any }, value?: any): any;

    /**
     * 获取text
     */
    getText(): string;

    /**
     * 设置text
     */
    setText(text: string): void;

    /**
     * 获取值
     */
    getValue(): any;

    /**
     * 设置值
     */
    setValue(...args: any[]): void;

    /**
     * 获取是否enable
     */
    isEnabled(): boolean;

    /**
     * 是否可见
     */
    isVisible(): boolean;

    /**
     * disable元素
     */
    disable(): void;

    /**
     * enable元素
     */
    enable(): void;

    /**
     * 是widget合法
     */
    valid(): void;

    /**
     * 使元素不合法
     */
    invalid(): void;

    /**
     * 使不可见
     */
    invisible(..._args: any[]): void;

    /**
     * 可见
     */
    visible(..._args: any[]): void;

    /**
     * 清除子元素
     */
    __d(): void;

    /**
     * 取消挂载
     */
    _unMount(): void;

    /**
     * hang元素
     */
    isolate(): void;

    /**
     * 请除元素
     */
    empty(): void;

    /**
     * 刷新控件
     */
    reset(): void;

    /**
     * 内部destory方法
     */
    _destroy(): void;

    /**
     * destory元素
     */
    destroy(): void;
}
