import React from 'react';
import { Typography } from '@mui/material';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      500
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (<Typography variant="h6" component="h6" fontFamily={"Times New Roman"}>
      <b>{ this.state.date.toLocaleString().replaceAll('/', '-') }</b>
    </Typography>);
  }
}

export default Clock;