declare const React: any;

interface UIProps {
    width: number;
    height: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
    rgap: number;
    lgap: number;
    tgap: number;
    bgap: number;
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
        [key: string]: any
    }
    tagName: string;
    element: any;

    beforeRender(callback: () => void): void;
    beforeInit(callback: () => void): void;
    render(): any;
}

declare namespace JSX {
    // for undefined
    interface IntrinsicElements {
        [elemName: string]: Partial<UIProps>;
    }

    type ElementAttributesProperty = {

        /**
         * specify the property name to use
         */
        __props: any;
    };

    interface IntrinsicClassAttributes<T> extends Partial<ElementClassProps<T>> {}
}
