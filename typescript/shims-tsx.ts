declare const React: any;

interface UIProps {
    width: number | string;
    height: number | string;
    top: number;
    left: number;
    bottom: number;
    right: number;
    rgap: number;
    lgap: number;
    tgap: number;
    bgap: number;
    vgap: number;
    hgap: number;
}

// 一些布局的附加属性
interface AdditionalProps {
    column: number;
    row: number;
}

interface ElementClassProps<T> extends UIProps {
    cls: string;
    extraCls: string;
    ref: (ref: T) => void;
    listeners: {
        eventName: string;
        action: (...args: any[]) => any;
        once?: boolean;
    }[];
    disabled: boolean;
    invisible: boolean;
    invalid: boolean;
    attributes: {
        [key: string]: any;
    };
    css: {
        [key: string]: any;
    };
    tagName: string;
    element: any;
    $testId: string;
    $point: any;
    $value: any;
    $scope: any;

    beforeRender(callback: () => void): void;
    beforeInit(callback: () => void): void;
    render(): any;
    beforeCreate(): void;
    created(): void;
    beforeMount(): void;
    mounted(): void;
    shouldUpdate(): void;
    update(): void;
    beforeUpdate(): void;
    updated(): void;
    beforeDestroy(): void;
    destroyed(): void;
}

declare namespace JSX {
    // for undefined
    interface IntrinsicElements {
        [elemName: string]: Partial<UIProps & AdditionalProps>;
    }

    interface ElementAttributesProperty {

        /**
         * specify the property name to use
         */
        __props: any,
    }

    interface IntrinsicClassAttributes<T> extends Partial<ElementClassProps<T>> {}
}
