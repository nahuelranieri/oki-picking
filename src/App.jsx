import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { postApi, getApi } from './hooks/api';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import datita from './MOCK_DATA(1).json'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { FileDownload } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';

function App() {

  const columns = useMemo(
    () => [
      {
        header: 'origen',
        accessorKey: 'origen',
      },
      {
        header: 'tienda',
        accessorKey: 'tienda',
      },
      {
        header: 'orden',
        accessorKey: 'orden',
      },
      {
        header: 'transporte',
        accessorKey: 'transporte',
      },
      {
        header: 'modalidad',
        accessorKey: 'modalidad',
      },
      {
        header: 'product',
        accessorKey: 'product',
      },
      {
        header: 'cantidad',
        accessorKey: 'cantidad',
      },
      {
        header: 'id',
        accessorKey: 'id',
        size: 50,
      },
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
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };
  
  const table = useMaterialReactTable({
    columns,
    data:datita,
    initialState: { showColumnFilters: false, density: 'compact' },
    enableRowSelection: true,
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
