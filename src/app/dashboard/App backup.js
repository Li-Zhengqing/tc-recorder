// import logo from './logo.svg';
import './App.css';
import { Card, AppBar, Toolbar, Typography, Stack, Grid, Paper } from '@mui/material';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Stack from '@mui/material/Stack';
// import Icon from '@mui/material';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import StopIcon from '@mui/icons-material/Stop';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
// import DeleteIcon from '@mui/icons-material/Delete';      
import React from 'react';
// import { render } from '@testing-library/react';
// import { type } from '@testing-library/user-event/dist/type';
import { Container } from '@mui/system';

// User Defined Components
import ForceChart from './ForceChart';
import Panel from './Panel';
// import Clock from './Clock';

class App extends React.Component {
  /**
   * TODO: 
   * 1. Connection to backend server
   * 2. Refine application interface
   * 3. Download data file from server
   */
  constructor(props) {
    super(props);
    this.updateRate = 200;
    this.setChartSize();
    this.state = {
      running: true,
      recording: false,
      t: [],
      fc: [],
      ff: [],
      fp: [],
      fileFormat: "csv"
    }
    this.startMonitor = this.startMonitor.bind(this);
    this.stopMonitor = this.stopMonitor.bind(this);
    this.clearRecord = this.clearRecord.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.fileFormatSelect = this.fileFormatSelect.bind(this);
  }

  componentDidMount() {
    // FIXME: It seems that the update rate cannot be reach if set too high.
    this.setState({
      running: true,
      recording: false,
    });
    this.timerID = setInterval(
      () => this.tick(),
      this.updateRate
    );
  }

  componentWillUnmount() {
    this.setState({
      running: false,
      recording: false
    });
    clearInterval(this.timerID);
  }
  
  // User defined methods
  setChartSize() {
    // FIXME: something seems wrong makes auto-resizing not available, for charts resizing, forced-refresh the page is needed
    this.pageSize = {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    };
    this.scaleFactor = this.pageSize.width / 1536;
    // alert(`Page Size: ${this.pageSize.width} x ${this.pageSize.height}`);
    this.chartSize = {
      width: 485 * this.scaleFactor,
      // width: 500,
      // height: 300 * this.scaleFactor
      // height: 300
      height: 280
    };
    this.mainChartSize = {
      width: 1100 * this.scaleFactor,
      // height: 600
      // height: 400 * this.scaleFactor
      // height: 400
      height: 380
    };
    // alert(`chartSize = ${this.chartSize.width}x${this.chartSize.height}}`);
  }
  
  startMonitor() {
    // NOTE: Start Monitor
    if (!this.state.running) {
      this.setState({
        running: true
      })
      this.timerID = setInterval(
        () => this.tick(),
        this.updateRate
      );
      console.log("Started!");
      // TODO: Clear old record
    }
  }

  stopMonitor() {
    // NOTE: Stop Monitor
    if (this.state.recording) {
      this.stopRecord();
    }
    if (this.state.running) {
      this.setState({
        running: false
      });
      clearInterval(this.timerID);
      console.log("Stopped!");
    }
  }

  clearRecord() {
    this.setState({
      t: [],
      fc: [],
      ff: [],
      fp: []
    });
  }

  startRecord() {
    // NOTE: Start Recording
    if (!this.state.running) {
      this.startMonitor();
    }
    this.setState({
      recording: true
    });
    this.recordStartTime = new Date();
    this.recordStartIndex = this.state.t.length;
  }

  stopRecord() {
    // NOTE: Stop Recording
    if (this.state.running && this.state.recording) {
      this.setState({
        recording: false
      });
      this.recordEndTime = new Date();
      this.recordEndIndex = this.state.t.length;
      alert(`[Test]: ${this.recordStartTime.toLocaleString()} - ${this.recordEndTime.toLocaleString()} (${this.recordEndTime - this.recordStartTime}): Record Length = ${this.recordEndIndex - this.recordStartIndex}`);
    }
  }

  fileFormatSelect(value) {
    this.setState({
      fileFormat: value
    });
  }

  tick() {
    // NOTE: Update data here!
    this.setState((state, props) => {
      const old_t = state.t[state.t.length - 1];
      let new_t = old_t + 1;
      if (isNaN(new_t)) {
        new_t = 0;
      }
      console.log(this.state);
      return {
        running: state.running,
        recording: state.recording,
        t: state.t.concat([new_t]),
        fc: state.fc.concat([new_t]),
        ff: state.ff.concat([0.5 * new_t]),
        fp: state.fp.concat([0.2 * new_t]),
        fileFormat: state.fileFormat
      };
    });
  }

  // Render the component
  render() {
    return (
      <div className="App">
        { /* Generated by create-react-app */
        /* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */
        }
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="h5">Cutting Force Monitor</Typography>
            {
              // <Clock />
            }
          </Toolbar>
        </AppBar>
        <Paper>
        <Stack direction="column" spacing={2}>
        
        { /*
        <Container maxWidth="sm">
        <Stack direction="row" spacing={2}>
          <Clock />
          <Button variant="contained" color="success" size="large" onClick={this.startMonitor}>
            Start
            <PlayArrowIcon></PlayArrowIcon>  
          </Button>
          <Button variant="contained" color="error" size="large" onClick={this.stopMonitor}>
            Stop
            <StopIcon></StopIcon>
          </Button>
          <Button variant="contained" color="warning" size="large" onClick={this.clearRecord}>
            Clear
            <DeleteIcon></DeleteIcon>
          </Button>
          <Button variant="contained" color={this.state.recording ? "info" : "action"} size="large" onClick={this.state.recording ? this.stopRecord : this.startRecord}>
            Record
            { this.state.recording ? 
              <FiberSmartRecordIcon /> : <FiberManualRecordIcon />
              // <FiberManualRecordIcon></FiberManualRecordIcon>
            }
          </Button>
        </Stack>
        </Container>
          */ }

          { /*}
          <ForceChart chartId="Fc" data={{
            x: [1, 2, 3, 4, 5, 6, 7],
            y: [150, 230, 224, 218, 135, 147, 260]
          }} color="#ff0000"></ForceChart>
          <ForceChart chartId="Ff" data={{
            x: [1, 2, 3, 4, 5, 6, 7],
            y: [150, 230, 224, 218, 135, 147, 260]
          }} color="#0000ff"></ForceChart>
          <ForceChart chartId="Fp" data={{
            x: [1, 2, 3, 4, 5, 6, 7],
            y: [150, 230, 224, 218, 135, 147, 260]
          }} color="#00ff00"></ForceChart>
        */ }
        <Container maxWidth="xl">
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <Card>
                <ForceChart chartId="main" data={{
                  x: this.state.t,
                  y: [{
                    name: "fc",
                    data: this.state.fc,
                    color: "#ff0000"
                  }, {
                    name: "ff",
                    data: this.state.ff,
                    color: "#0000ff"
                  }, {
                    name: "fp",
                    data: this.state.fp,
                    color: "#00ff00"
                  }]
                }} title='Force' size={this.mainChartSize}></ForceChart>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <Panel 
                running={this.state.running}
                recording={this.state.recording}
                startMonitor={this.startMonitor}
                stopMonitor={this.stopMonitor}
                clearRecord={this.clearRecord}
                startRecord={this.startRecord}
                stopRecord={this.stopRecord}
                fileFormatSelect={this.fileFormatSelect}
                />
              </Card>
            </Grid>
          {
            // </Grid>
          }
          { /* <Stack direction="row" spacing={1}>
          <Card variant='outlined'>
            <ForceChart chartId="Fc" data={{
              x: this.state.t,
              y: this.state.fc
            }} color="#ff0000" title='Fc' size={this.chartSize}></ForceChart>
          </Card>
          <Card variant='outlined'>
            <ForceChart chartId="Ff" data={{
              x: this.state.t,
              y: this.state.ff
            }} color="#0000ff" title='Ff' size={this.chartSize}></ForceChart>
          </Card>
          <Card variant='outlined'>
            <ForceChart chartId="Fp" data={{
              x: this.state.t,
              y: this.state.fp
            }} color="#00ff00" title='Fp' size={this.chartSize}></ForceChart>
          </Card>
          </Stack> */}

          {
            // <Stack direction="row" spacing={1}>
          }
          {
            // <Grid container spacing={1}>
          }
            <Grid item xs={4}>
              <Card variant='outlined'>
                <ForceChart chartId="Fc" data={{
                  x: this.state.t,
                  y: [{
                    data: this.state.fc,
                    color: "#ff0000"
                  }]
                }} title='Fc' size={this.chartSize}></ForceChart>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant='outlined'>
                <ForceChart chartId="Ff" data={{
                  x: this.state.t,
                  y: [{
                    data: this.state.ff,
                    color: "#0000ff"
                  }]
                }} title='Ff' size={this.chartSize}></ForceChart>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant='outlined'>
                <ForceChart chartId="Fp" data={{
                  x: this.state.t,
                  y: [{
                    data: this.state.fp,
                    color: "#00ff00"
                  }]
                }} title='Fp' size={this.chartSize}></ForceChart>
              </Card>
            </Grid>
          </Grid>
          {
            // </Stack>
          }
        </Container>
        </Stack>
        </Paper>
      </div>
    );
  }
}

export default App;
