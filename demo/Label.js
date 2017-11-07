import {shortcut} from "../src/h";
import {Component} from "../src/component";

class Label extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {count: 0}
        this._onClick = () => {
            this.setState({
                count: ++this.state.count
            })
        };
    }

    render() {
        return <div onClick={this._onClick}>{this.state.count}</div>;
    }
}
shortcut("bi-label", Label)