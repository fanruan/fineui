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
    baseCls: string;
    cls: string;
    ref: (ref: T) => void;
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
