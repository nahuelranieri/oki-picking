import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { postApi, getApi } from './hooks/api';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import datita from './MOCK_DATA(1).json'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { FileDownload, PictureAsPdf } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';


function App() {

  const [apiData, setApiData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApi();
        setApiData(data);
        // console.log(data);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };

    fetchData();
  }, []);

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
      // {
      //   header: 'product',
      //   accessorKey: 'product',
      //   enableColumnFilterModes: false,
      //   enableColumnFilter: false,

      // },
      {
        header: 'cantidad',
        accessorKey: 'cantidad',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan', 'equals'],
        filterFn: 'equals',
        size: 200,


      },
      // {
      //   header: 'id',
      //   accessorKey: 'id',
      //   size: 100,
      // },
    ],
    [],
  );

  const csvConfig = mkConfig({
    fieldSeparator: ';',
    useKeysAsHeaders: true,
    filename: 'OkiPickingData',
    useBom: true,
  });

  // const handleExportRows = (rows) => {
  //   const rowData = rows.map((row) => row.original);
  //   const csv = generateCsv(csvConfig)(rowData);
  //   download(csvConfig)(csv);
  // };

  const handlePrintPdfRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const ordenColumn = rowData.map((data) => data.orden).slice(0, 30);
    console.log(ordenColumn);
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        {/* <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => {
            if (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) {
              handleExportRows(table.getSelectedRowModel().rows)
            } else {
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
          }}
          startIcon={<FileDownload />}
        >
          Export
        </Button> */}
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
      </Box>
    )
  });

  return (
    <>
      <MaterialReactTable
        table={table}
        state={{ isLoading: true }}
        muiCircularProgressProps={{
          color: 'secondary',
          thickness: 5,
          size: 55,
        }}
        muiSkeletonProps={{
          animation: 'pulse',
          height: 28,
        }}
      />
    </>
  )
}

export default App
