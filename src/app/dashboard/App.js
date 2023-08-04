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
import { Button } from '@mui/material';

// User Defined Components
import Chart from './Chart';
import Panel from './Panel';
import VarList from './VarList';
// import Clock from './Clock';

import { useRouter } from 'next/navigation';

import { invoke } from '@tauri-apps/api';

class App extends React.Component {
  /**
   * TODO: 
   * 1. Connection to backend server
   * 2. Refine application interface
   * 3. Download data file from server
   */
  constructor(props) {
    super(props);
    this.updateRate = 250;
    this.setChartSize();
    this.state = {
      connected: false,
      running: false,
      recording: false,
      t: [],
      fc: [],
      ff: [],
      fp: [],
      fileFormat: "csv",
      varList: [],
      selectedVarList: [],
      visual_data: [],
      target_ams_id: "127.0.0.1.1.1"
    }
    this.startMonitor = this.startMonitor.bind(this);
    this.stopMonitor = this.stopMonitor.bind(this);
    this.clearRecord = this.clearRecord.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.fileFormatSelect = this.fileFormatSelect.bind(this);
    this.queryVarList = this.queryVarList.bind(this);
    this.syncMonitorVarList = this.syncMonitorVarList.bind(this);
    this.handleTargetAmsIdChange = this.handleTargetAmsIdChange.bind(this);
    this.connectPLC = this.connectPLC.bind(this);
    this.disconnectPLC = this.disconnectPLC.bind(this);
  }

  componentDidMount() {
    // FIXME: It seems that the update rate cannot be reach if set too high.
    this.setState({
      connected: false,
      running: false,
      recording: false,
    });
    this.timerID = setInterval(
      () => this.tick(),
      this.updateRate
    );
  }

  componentWillUnmount() {
    this.setState({
      connected: false,
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
      width: 1500 * this.scaleFactor,
      // width: 500,
      // height: 300 * this.scaleFactor
      // height: 300
      height: 200
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

  queryVarList() {
    // TODO: Test tauri api
    let var_list = [];
    invoke("query_variable_list", {}).then(res => {
      console.log(res);
      // alert(var_list);
      for(let id in res) {
        var_list.push({id: id, name: res[id]});
      }
      // var_list = res.map(name => ({"id": 0, "name": name}));
      console.log(var_list);
      this.setState({
        varList: var_list
      });
    });
    console.log(var_list);
    // return var_list;
  }

  syncMonitorVarList(rowSelectionModel) {
    this.setState({
      selectedVarList: rowSelectionModel,
    });
    console.log(rowSelectionModel);
  }

  handleTargetAmsIdChange(target) {
    this.setState({
      target_ams_id: target,
    });
  }

  connectPLC() {
    // TODO: Connect to PLC action.
    this.setState({
      connected: true,
    });
    console.log(`Connected with PLC: ${this.state.target_ams_id}.`);
  }

  disconnectPLC() {
    // TODO: Action for disconnect with PLC.
    if (this.state.running) {
      this.stopMonitor();
    }
    // Clear variable list
    this.setState({
      connected: false,
      varList: [],
    });
    console.log('Disconnected with PLC.');
  }
  
  startMonitor() {
    // NOTE: Start Monitor
    if (!this.state.running) {
      this.setState({
        running: true
      })
      this.timerID = setInterval(
        // () => this.tick(),
        () => this.updateData(),
        this.updateRate
      );
      console.log("Started!");
      // TODO: Clear old record

      // TODO: To PLC
      invoke("start_record", {varList: this.state.selectedVarList}).then(res => {
        console.log(`Start Record: ${res ? "success" : "failed"}`);
      })
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

      invoke("stop_record", {}).then(res => {
        console.log(`Stop Record: ${res ? "success" : "failed"}`);
      });
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
      // alert(`[Test]: ${this.recordStartTime.toLocaleString()} - ${this.recordEndTime.toLocaleString()} (${this.recordEndTime - this.recordStartTime}): Record Length = ${this.recordEndIndex - this.recordStartIndex}`);
    }
  }

  fileFormatSelect(value) {
    this.setState({
      fileFormat: value
    });
  }

  tick() {
    // note: update data here!
    this.setState((state, props) => {
      const old_t = state.t[state.t.length - 1];
      let new_t = old_t + 1;
      if (isNaN(new_t)) {
        new_t = 0;
      }
      // console.log(this.state);
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

  updateData() {
    let new_data = null;
    invoke('get_visualization_data', {}).then(res => {
      new_data = res;
      console.log(`new data: ${new_data}`);
      this.setState({
        visual_data: new_data,
      });
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
            <Typography variant="h5" component="div" flex={ 1 }><b>TC Recorder</b></Typography>
            {
              // <Clock />
            }
            <Button variant='contained' color='info'>Home</Button>
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
        {/*
        <Chart chartId="test" data={{
          x: [1, 2, 3, 4, 5],
          y: [{
            name: 'test',
            color: "#fc0000",
            data: [10, 0, 15, 7, 8],
          }],
        }} title="test" size={this.chartSize}/>
      */}
        { /*
          this.state.running ? (this.state.selectedVarList.map((var_index, i) => {
            // console.log(this.state.varList);
            let variable = this.state.varList[var_index].name;
            console.log(this.state.visual_data);
            // console.log(this.state.visual_data[0]);
            // console.log(this.state.visual_data[1]);
            return (<Chart chartId={variable} data={{
              x: this.state.visual_data[0],
              y: [{
                name: variable,
                color: "#fc0000",
                data: this.state.visual_data[i + 1],
              }],
            }} title={variable} size={this.chartSize}/>);
          }) ) : <div></div>
          */
        }
        <Container maxWidth="xl">
          {
            // <Grid container spacing={1}>
          }
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
                connected={this.state.connected}
                targetAmsIdChangeHandler={this.handleTargetAmsIdChange}
                connectHandler={this.connectPLC}
                disconnectHandler={this.disconnectPLC}
                />
              </Card>
              {
              this.state.running ? <div></div> : (<VarList 
              connected={this.state.connected}
              var_list_rows={this.state.varList} 
              refreshVarList={this.queryVarList}
              syncMonitorVarListHandler={this.syncMonitorVarList}
              />)
              }
            {
            // </Grid>
            }
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

            {/*
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
            */}
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
