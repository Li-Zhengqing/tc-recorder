import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
// import { Table } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Variable Name', width: 330 },
];

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RowSelectionModel: [],
    };
  }

  render() {
    return (
      <DataGrid
        rows={this.props.rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          console.log(newRowSelectionModel);
          this.setState({
            RowSelectionModel: newRowSelectionModel
          });
          this.props.syncMonitorVarListHandler(newRowSelectionModel);
        }}
        rowSelectionModel={this.state.RowSelectionModel}
      />
    )
  }
}

export default DataTable;