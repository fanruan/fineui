declare const React: any;

interface UIProps {
    width: number | string;
    height: number | string;
    top: number;
    left: number | JSX.Element;
    bottom: number;
    right: number | JSX.Element;
    rgap: number;
    lgap: number;
    tgap: number;
    bgap: number;
    vgap: number;
    hgap: number;
    inset: number | string;
}

// 一些布局的附加属性
interface AdditionalProps {
    column: number;
    row: number;
    innerVgap: number;
    innerHgap: number;
}

interface ElementClassProps<T> extends UIProps {
    cls: string | ((context: any) => string);
    extraCls: string;
    ref: (ref: T) => void;
    listeners: {
        eventName: string;
        action: (...args: any[]) => any;
        once?: boolean;
    }[];
    disabled: boolean | ((context: any) => boolean);
    invisible: boolean | ((context: any) => boolean);
    invalid: boolean | ((context: any) => boolean);
    attributes: {
        [key: string]: any;
    };
    css: {
        [key: string]: any;
    } | (() => any);
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

type Widget = import('./index').Widget;
type Props<T extends Widget = any> = Partial<ElementClassProps<T> & AdditionalProps & Record<string, any>>;

declare namespace JSX {
    interface Element extends Props {
        type: string;
    }
    interface ElementClass extends Widget {}
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
