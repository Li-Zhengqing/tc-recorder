import './App.css';
import React from 'react';
import { Refresh } from "@mui/icons-material";

import { Button, Stack, List, ListItem, Container } from '@mui/material';

import DataTable from './DataTable';

class VarList extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Stack direction="column">
          <Button variant="contained" disabled={!this.props.connected} onClick={this.props.refreshVarList}>
            <Refresh/> Refresh PLC Variable List
          </Button>
          <DataTable 
          rows={this.props.var_list_rows}
          connected={this.props.connected}
          syncMonitorVarListHandler={this.props.syncMonitorVarListHandler}>
          </DataTable>
        </Stack>
      </Container>
    )
  }
}

export default VarList;
