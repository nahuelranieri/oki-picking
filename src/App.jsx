import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { postApi, getApi } from './hooks/api';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import datita from './MOCK_DATA(1).json'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { FileDownload, PictureAsPdf, Refresh } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';


function App() {

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getApi();
        setApiData(data);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      } finally {
        setLoading(false);
      }
    };
    
      fetchData();
      setRefreshData(false);
    
  }, [refreshData]);

  const columns = useMemo(
    () => [
      {
        header: 'origen',
        accessorKey: 'origen',
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
      },
      {
        header: 'tienda',
        accessorKey: 'tienda',
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
      },
      {
        header: 'orden',
        accessorKey: 'orden',
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
        enableColumnFilter: false,
      },
      {
        header: 'transporte',
        accessorKey: 'transporte',
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
      },
      {
        header: 'modalidad',
        accessorKey: 'modalidad',
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
      },
      {
        header: 'fecha',
        accessorKey: 'fecha',
        filterVariant: 'date-range',
        enableColumnFilterModes: false,
      },
    ],
    [],
  );

  const handlePrintPdfRows = async(rows) => {
    const rowData = rows.map((row) => row.original);
    const ordenYOrigen = rowData.map((data) => ({ orden: data.orden, origen: data.origen })).slice(0, 30); 
    try {
      const response = await postApi(ordenYOrigen);
      const baseUrl = 'https://market.sevensport.com.ar/api/batchs';
      const url1 = `${baseUrl}/get/${response}/false`;
      const url2 = `${baseUrl}/get-meli-labels/${response}/`;
    
      window.open(url1, '_blank');
      window.open(url2, '_blank');


    } catch (error) {
      console.log('Error al crear el pdf:', error);
    }finally{
      setRefreshData(true);
      setRowSelection({})
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: apiData,
    initialState: { showColumnFilters: false, density: 'compact' },
    enableRowSelection: true,
    enableFacetedValues: true,
    enableColumnFilterModes: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnResizing: true,
    positionToolbarAlertBanner: 'bottom',
    onRowSelectionChange: setRowSelection,
    state: {
      showSkeletons: loading,
      rowSelection 
      
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={() => {
            if (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) {
              handlePrintPdfRows(table.getSelectedRowModel().rows)
            } else {
              handlePrintPdfRows(table.getPrePaginationRowModel().rows)
            }
          }}
          startIcon={<PictureAsPdf />}
        >
          Print PDF
        </Button>
        <Button
          startIcon={<Refresh />}
          onClick={()=> {setRefreshData(true)}}
        >
          Refresh
        </Button>
      </Box>
    )
  });

  return (
    <>
      <MaterialReactTable
        table={table}
        
      />
    </>
  )
}

export default App
