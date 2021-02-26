import { shortcut } from "../../core/decorator/decorator";

@shortcut()
export class BasicButtonWrapper extends BI.BasicButton {
    public static xtype = 'bi.component.basic_button_wrapper';

    public props: {
        render(): any;
        doClick(): void;
    }

    public render() {
        return this.options.render();
    }

    public doClick() {
        this.options.doClick();
    }
}
