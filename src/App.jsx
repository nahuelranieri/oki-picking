import { useState, useEffect } from 'react'
import './App.css'
import { postApi, getApi } from './hooks/api';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarFilterButton  } from '@mui/x-data-grid';
import Button
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <button>PRINT</button>
    </GridToolbarContainer>
  );
}

function App() {
  

  return (
    <>
      <DataGrid
      rows={data}
      columns={[
        { field: 'origen', headerName: 'origen', width: 100 },
        { field: 'tienda', headerName: 'tienda', width: 200 },
        { field: 'orden', headerName: 'orden', width: 200,  },
        { field: 'transporte', headerName: 'transporte', width: 200 },
        { field: 'modalidad', headerName: 'modalidad', width: 200 },
        { field: 'product', headerName: 'product', width: 200 },
        { field: 'cantidad', headerName: 'cantidad', width: 200 },
        { field: 'id', headerName: 'id', width: 200 },
      ]}
      checkboxSelection
      slots={{ toolbar: CustomToolbar }}
      
      />
    </>
  )
}

export default App
