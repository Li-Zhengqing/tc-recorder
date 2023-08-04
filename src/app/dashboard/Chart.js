import * as echarts from 'echarts';
// import { Box } from '@mui/system';
import { Box } from '@mui/material';
import React from 'react';

class Chart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Temporary Option

    this.chart = echarts.init(document.getElementById(this.props.chartId));
    this.renderChart();
    // this.chart.setOption(this.option);
  }

  renderChart() {
    // init option
    this.option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '100%'];
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          // restore: {},
          saveAsImage: {}
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      animation: false,
      xAxis: {
        type: 'category',
        data: this.props.data.x
      },
      yAxis: {
        type: 'value',
      },
      /*
      legend: {
        // orient: 'vertical',
        // right: 10,
        // top: 'center',
        data: this.props.data.y.map((item) => (item.name))
      },
      */
      title: {
        left: 'center',
        text: this.props.title
      },
      /* series: [
        {
          data: this.props.data.y,
          type: 'line',
          color: this.props.color
        }
      ] */
      series: this.props.data.y.map((item) => ({
        data: item.data,
        symbol: 'none',
        type: 'line',
        color: item.color
      }))
    };

    // TODO: Area chart option begin
    /*
    this.option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'center',
        text: 'Large Area Chart'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 70, 131)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)'
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }
            ])
          },
          data: data
        }
      ]
    }
    */
    // TODO: Area chart option end

    // FIXME: Not so elegant, maybe can be solve by using a timer
    if (this.chart !== undefined) {
      this.chart.setOption(this.option);
    }
    // return this.option;
  }

  render() {
    this.renderChart();
    return (
      // <div id={this.props.chartId} style={{width: 500, height: 300}}></div>
      // <div id={this.props.chartId} style={{width: this.props.size.width, height: this.props.size.height}}></div>
      <Box component="div" sx={{
        width: this.props.size.width, 
        height: this.props.size.height
      }} id={this.props.chartId}></Box>
    );
  }
}

export default Chart;
