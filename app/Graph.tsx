import Svg, {Line, Circle, Path, Text} from 'react-native-svg';
import React, {Component} from 'react';
import {ebacSteps} from './utils/BloodAlcohol';

import {View, ToastAndroid} from 'react-native';
import BasicData from './data/BasicData';
import Drink from './data/Drink';

interface GraphProps {
  userData: BasicData;
  drinks: Drink[];
}

interface GraphState {
  data: {
    values: number[];
    labels: string[];
  };
  graph: {}
}

interface Point {
  x: number;
  y: number;
  hLabel: string;
  vLabel: number;
}

export default class SVGGraph extends Component<GraphProps, GraphState> {
  constructor(props: Readonly<GraphProps>) {
    super(props);

    this.state = {
      // dimensions: null,
      data: {
        values: [],
        labels: [],
      },
      graph: {
        // circles: [],
        // path: <Path d="" fill="none" stroke="red" />, // don't store JSX in state
        // lines: [],
        // horizontalLabels: [],
        // verticalLabels: [],
      },
    };

    this.updateGraph = this.updateGraph.bind(this);
    this.updateSessionData = this.updateSessionData.bind(this);
  }

  updateSessionData() {
    const data = ebacSteps(this.props.drinks, this.props.userData);

    if (data.comeDown !== null) {
      data.points.push(data.comeDown);
    }

    this.setState({
      data: {
        values: data.points,
        labels: data.labels,
      },
    });
  }

  calculatePath(coords: Point[]): string {
    let pathData = `M ${coords[0].x} ${coords[0].y} `;
    for (let i = 1; i < coords.length; ++i) {
      pathData = pathData.concat(
        `L ${Math.round(coords[i].x)} ${Math.round(coords[i].y)} `,
      );
    }
    pathData = pathData.concat('z');
    return pathData;
  }

  updateGraph() {
    // TODO: update upon some event outside of component
    this.updateSessionData();

    const {values} = this.state.data;
    const {labels} = this.state.data;

    const maxValue = Math.max(...values);
    //const bottomLabelHeight = 90;    // percent
    const headerSize = 10;
    const canvasSize = 100 - headerSize;

    if (labels.length == 0) {
      return;
    }

    const points = labels.map((val, idx) => {
      const cx = headerSize + (idx * canvasSize) / labels.length;
      const cy =
        headerSize +
        canvasSize -
        (values[idx] * canvasSize) / maxValue;
      return {
        x: cx,
        y: cy,
        hLabel: val,
        vLabel: values[idx],
      };
    });

    const lines = [];
    const lineLabels = [];

    const dt = maxValue / 5;
    for (let i = 0; i <= maxValue + dt; i += dt) {
      const y = headerSize + canvasSize - (i * canvasSize) / maxValue + 2;
      lines.push(
        <Line stroke="black" x1="0" x2="100%" y1={`${y}%`} y2={`${y}%`} />,
      );
      lineLabels.push(
        <Text stroke="black" x="0" y={`${y - 2}%`}>
          {Math.round((i + Number.EPSILON) * 100) / 100}
        </Text>,
      );
    }

    if (points.length < 2) {
      this.setState({
        graph: {
          lines: lines,
          verticalLabels: lineLabels,
        },
      });
      return;
    }

    //console.log(JSON.stringify(dimensions));

    const pathData = this.calculatePath(points);

    this.setState({
      graph: {
        circles: points.map((val, idx) => {
          return <Circle cx={`${val.x}%`} cy={`${val.y}%`} r="2" fill="red" />;
        }),

        //path: <Path d="M 10 10 L 55 10 z" fill="none" stroke="red" vector-effect="non-scaling-stroke"/>,

        horizontalLabels: points.map((val, idx) => {
          return (
            <Text stroke="black" x={`${val.x}%`} y="100%">
              {val.hLabel}
            </Text>
          );
        }),

        lines: lines,
        verticalLabels: lineLabels,
      },
    });
  }

  componentDidMount() {
    this.updateGraph();
    setInterval(this.updateGraph, 5000); // TODO: not this
  }

  render() {
    return (
      // <View width='100%' height="30%">
      // <Svg width='100%' height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      //     {this.state.graph.lines}
      //     {this.state.graph.circles}
      //     {this.state.graph.path}
      //     {this.state.graph.horizontalLabels}
      //     {this.state.graph.verticalLabels}
      // </Svg>
      // </View>

      <Svg width="100%" height="30%">
        {this.state.graph.lines}
        {this.state.graph.circles}
        {/* {this.state.graph.path} */}
        {this.state.graph.horizontalLabels}
        {this.state.graph.verticalLabels}
      </Svg>
    );
  }
}
