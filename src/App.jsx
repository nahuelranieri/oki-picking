import { useState, useEffect } from 'react'
import './App.css'
import { postApi, getApi } from './hooks/api';
import { DataGrid } from '@mui/x-data-grid';

function App() {
  const [textareaValue, setTextareaValue] = useState('')
  const [datosApi, setDatosApi] = useState([]);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    handleActualizarClick();
    const intervalo = setInterval(() => {
      handleActualizarClick();
    }, 20000);
    return () => clearInterval(intervalo);
  }, []);


  const handleTextareaChange = (event) => {
    const value = event.target.value;
    setTextareaValue(value);
    console.log(value);
  };

  const formatDate = (fecha) => {
    if (fecha === null) {
      return 'null';
    }
    const dateFormat = new Date(fecha);
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return dateFormat.toLocaleDateString('es-AR', opciones);
  };

  const handleIngresarClick = async () => {
    setLoading(true)
    const nuevosCodigos = textareaValue.split(/\s+/).filter(Boolean);
    for (const codigo of nuevosCodigos) {
      try {
        const response = await postApi({ client_product_code: codigo });
      } catch (error) {
        console.log(`Error para ${codigo}:`, error);
      }
    }
    setLoading(false)
    handleActualizarClick();
    setTextareaValue('');
  };

  const handleActualizarClick = async () => {
    try {
      const datos = await getApi();
      datos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setDatosApi(datos);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  return (
    <>
      <div className='container'>
        <h1>Ingrese el/los codigos a forzar</h1>
        <textarea
          name="codigos"
          value={textareaValue}
          onChange={handleTextareaChange}
          cols="30"
          rows="5"></textarea>
        <button type="button" onClick={handleIngresarClick}>
          {loading ? ('Cargando...') : ('Ingresar')}
        </button>
        <button type="button" onClick={handleActualizarClick}>
          Actualizar Manualmente
        </button>
        <div>
          <h3>Estado codigos cargados</h3>
          {datosApi.length > 0 ? (
            <>
              <DataGrid
                
                rows={datosApi}
                columns={[
                  { field: 'client_product_code', headerName: 'Código', width: 300 },
                  { field: 'created_at', headerName: 'Creado', width: 200, valueFormatter: (params) => formatDate(params.value) },
                  { field: 'process_at', headerName: 'Procesado', width: 200, valueFormatter: (params) => formatDate(params.value) },
                ]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
              
              />
            </>
          ) : (
            <p>Cargando Datos...</p>
          )}
        </div>
      </div>
    </>
  )
}

export default App
