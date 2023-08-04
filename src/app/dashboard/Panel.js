import './App.css';
import { Button, Stack, TextField } from '@mui/material';
// import { Button, Card, AppBar, Toolbar, Typography, Stack, Grid } from '@mui/material';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Stack from '@mui/material/Stack';
// import Icon from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import DeleteIcon from '@mui/icons-material/Delete';      
import React from 'react';
import { Container } from '@mui/system';

import Clock from './Clock';
import CustomizedRadios from './CustomizedButtonGroup';
import { Lan } from '@mui/icons-material';

class Panel extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
        <Container maxWidth="sm">
        { /*<Stack direction="column" spacing={2}>*/ }
        <Stack direction="column" spacing={2}>

          <div></div>
          <Clock />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" 
            color={this.props.connected ? "success" : "action"}
            onClick={this.props.connected ? this.props.disconnectHandler : this.props.connectHandler}>
              <Lan></Lan> { /*Connect PLC*/ }
            </Button>
            <TextField 
            id="target_ams_id" 
            variant='outlined'
            onChange={(event) => {
              this.props.targetAmsIdChangeHandler(event.target.value);
              }}/>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" color={this.props.running ? "success" : "action"} size="large" disabled={!this.props.connected} onClick={this.props.startMonitor}>
              { /*Start */ }
              <PlayArrowIcon></PlayArrowIcon>  
            </Button>

            <Button variant="contained" color={this.props.running ? "action" : "error"} size="large" disabled={!this.props.connected} onClick={this.props.stopMonitor}>
              { /*Stop*/ }
              <StopIcon></StopIcon>
            </Button>

            <Button variant="contained" color="action" size="large" disabled={!this.props.connected} onClick={this.props.clearRecord}>
              { /*Clear*/ }
              <DeleteIcon></DeleteIcon>
            </Button>

            <Button variant="contained" color={this.props.recording ? "info" : "action"} size="large" disabled={!this.props.connected} onClick={this.props.recording ? this.props.stopRecord : this.props.startRecord}>
              { /*Record*/ }
              { this.props.recording ? 
                <FiberSmartRecordIcon /> : <FiberManualRecordIcon />
                // <FiberManualRecordIcon></FiberManualRecordIcon>
              }
            </Button>
            
          </Stack>

          <CustomizedRadios handleChange={this.props.fileFormatSelect}></CustomizedRadios>
          <div></div>

        </Stack>
        </Container>
    );
  }
}

export default Panel;