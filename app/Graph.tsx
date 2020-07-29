import Svg, {Line, Circle, Path, Text} from 'react-native-svg';
import React, {Component} from 'react';
import {ebacSteps} from './utils/BloodAlcohol';

import {IBasicData} from './data/BasicData';
import {IDrink} from './data/Drink';
import {View} from 'react-native';

interface GraphProps {
  basicData: IBasicData;
  drinks: IDrink[];
  currentTime: Date;
}

interface MyDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IPoint {
  x: number;
  y: number;
  hLabel: string;
  vLabel: number;
}

interface GraphData {
  lines: Element[];
  verticalLabels: Element[];
  circles: Element[];
  horizontalLabels: Element[];
  path: Element[];
}

interface MyState {
  dimensions: MyDimensions;
  graphData: GraphData;
}

export default class SVGGraph extends Component<GraphProps, MyState> {
  constructor(props: Readonly<GraphProps>) {
    super(props);

    var graphData: GraphData = {} as any;

    this.state = {
      graphData: {
        lines: [],
        verticalLabels: [],
        circles: [],
        horizontalLabels: [],
        path: [],
      },
    };

    this.updateGraph = this.updateGraph.bind(this);
    this.getData = this.getData.bind(this);
  }

  getData(): {values: number[]; labels: string[]} {
    // console.log(this.props.basicData);
    const data = ebacSteps(this.props.drinks, this.props.basicData);

    if (data.comeDown !== null) {
      data.points.push(data.comeDown);
    }

    return {
      values: data.points,
      labels: data.labels,
    };
  }

  mapValueX(x: number): number {
    return 450 * (x / 100);
  }

  mapValueY(x: number): number {
    return 135 * (x / 100);
  }

  calculatePath(coords: IPoint[]): string {
    const firstX = Math.round(this.mapValueX(coords[0].x));
    const firstY = Math.round(this.mapValueY(coords[0].y));

    let pathData = `M ${firstX} ${firstY} `;
    for (let i = 1; i < coords.length; ++i) {
      const X = Math.round(this.mapValueX(coords[i].x));
      const Y = Math.round(this.mapValueX(coords[i].y));
      pathData = pathData.concat(`L ${X} ${Y} `);
    }
    return pathData;
  }

  updateGraph(): GraphData {
    // console.log('dimshere: ');
    // console.log(JSON.stringify(this.state.dimensions));

    const {values, labels} = this.getData();

    const maxValue = Math.max(...values);

    const leftPadding = 30;
    const bottomPadding = 10;

    const canvasWidth = 100 - leftPadding;
    const canvasHeight = 100 - bottomPadding;

    if (labels.length == 0) {
      return {
        lines: [],
        verticalLabels: [],
        circles: [],
        horizontalLabels: [],
        path: [],
      };
    }

    const points = labels.map((val, idx) => {
      const cx = leftPadding + (idx * canvasWidth) / labels.length;
      const cy =
        bottomPadding + canvasHeight - (values[idx] * canvasHeight) / maxValue;
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
      const y =
        bottomPadding + canvasHeight - (i * canvasHeight) / maxValue + 2;
      lines.push(
        <Line
          stroke="black"
          x1={leftPadding}
          x2="100%"
          y1={`${y - 5}%`}
          y2={`${y - 5}%`}
          key={"line" + y}
        />,
      );
      lineLabels.push(
        <Text stroke="black" x="1" y={`${y - 2}%`}>
          {Math.round((i + Number.EPSILON) * 100) / 100}
        </Text>,
      );
    }

    if (points.length < 2) {
      return {
        lines: lines,
        verticalLabels: lineLabels,
        circles: [],
        horizontalLabels: [],
        path: [],
      };
    }

    //console.log(JSON.stringify(dimensions));

    const pathData = this.calculatePath(points);

    //console.log(pathData);

    return {
      circles: points.map((val, idx) => (
        <Circle cx={`${val.x}%`} cy={`${val.y}%`} r="2" fill="red" key={"circle" + val.x + val.y} />
      )),
      horizontalLabels: points.map((val, idx) => (
        <Text textAnchor="middle" stroke="black" x={`${val.x}%`} y="92%">
          {val.hLabel}
        </Text>
      )),
      lines: lines,
      verticalLabels: lineLabels,
      path: [
        <Path
          d={pathData}
          fill="none"
          stroke="red"
          vector-effect="non-scaling-stroke"
        />,
      ],
    };
  }

  render() {
    //const { lines, verticalLabels, circles, horizontalLabels, path } = this.updateGraph();

    // const viewWidth = 100;
    // const viewHeight = 30;

    // const width = viewWidth * 4.5;
    // const height = width * (viewHeight / viewWidth);

    // const viewBoxData = `0 0 ${width} ${height}`;

    // console.log ('wfdafs');
    // console.log (JSON.stringify (this.props.myDimensions));

    //var dims : MyDimensions = {} as any;
    //var graphData : GraphData = {} as any;

    return (
      <View
        style={{borderColor: 'red', borderWidth: 1}}
        onLayout={event => {
          var {x, y, width, height} = event.nativeEvent.layout;
          this.setState({
            dimensions: {x: x, y: y, width: width, height: height},
            graphData: this.updateGraph(),
          });
        }}>
        <Svg width="100%" height="100%">
          {this.state.graphData.lines}
          {this.state.graphData.circles}
          {this.state.graphData.horizontalLabels}
          {this.state.graphData.verticalLabels}
          {this.state.graphData.path}
        </Svg>
      </View>
    );
  }
}
