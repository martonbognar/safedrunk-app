import Svg, {
    Circle,
    Text,
    Line
} from 'react-native-svg';
import React, { Component } from 'react';
import { ebacSteps } from './utils/ebac';

export default class SVGGraph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            circles: [],
            labels: [],
            lines: [],
            lineLabels: [],
        };

        this.updateGraph = this.updateGraph.bind(this);
    }

    updateGraph() {
        const data = ebacSteps(this.props.drinks, this.props.userData);
        const keys = [].concat(...data.output.map((obj) => Object.keys(obj)));
        if (data.comeDown.length === 2) {
            keys.push(Object.keys(data.comeDown[1])[0]);
        }
        const regular = [].concat(...data.output.map((obj) => Object.values(obj)));
        const comeDownBase = regular.length > 1 ? Array(regular.length - 1).fill(null) : [];
        const comeDown = comeDownBase.concat(...data.comeDown.map((obj) => Object.values(obj)));

        const maxValue = Math.max(...regular.map(parseFloat));

        this.setState({
            circles: keys.map((val, idx) => {
                const cx = idx * 100 / keys.length + 2;
                const cy = 100 - (parseFloat(regular[idx]) * 100 / maxValue) + 2;
                return <Circle cx={`${cx}%`} cy={`${cy}%`} r="2" fill="red" />;
            })
        });

        this.setState({
            labels: keys.map((val, idx) => {
                const x = idx * 100 / keys.length + 2;
                return <Text stroke="black" x={`${x}%`} y='90%'>{val}</Text>;
            }),
        });

        const lines = [];
        const lineLabels = [];

        for (let i = 0; i <= maxValue + 0.05; i += 0.05) {
            const y = 100 - (i * 100 / maxValue) + 2;
            lines.push(<Line stroke='black' x1='0' x2='100%' y1={`${y}%`} y2={`${y}%`} />);
            lineLabels.push(<Text stroke="black" x='0' y={`${y - 2}%`}>{i}</Text>);
        }

        this.setState({
            lines: lines,
            lineLabels: lineLabels,
        });
    }

    componentDidMount() {
        this.updateGraph();
        setInterval(this.updateGraph, 5000); // TODO: not this
    }

    render() {
        return (
            <Svg width='100%' height="30%">
                {this.state.circles}
                {this.state.labels}
                {this.state.lines}
                {this.state.lineLabels}
            </Svg>
        );
    }
};
