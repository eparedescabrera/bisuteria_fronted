import { useState } from 'react';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import Button from '../common/Button';
import { exportarReporte } from '../../api/reportApi';
import { toastError, toastSuccess } from '../feedback/alerts';
import { getApiErrorMessage } from '../../utils/formatters';

export default function ExportButtons({ reporte, params = {} }) {
  const [loading, setLoading] = useState(null);

  async function handleExport(formato) {
    setLoading(formato);
    try {
      const result = await exportarReporte({
        ...params,
        reporte,
        formato
      });
      toastSuccess(`Archivo generado: ${result.filename}`);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        toastError('La sesión expiró. Inicie sesión nuevamente.');
      } else {
        toastError(
          getApiErrorMessage(error, 'No se pudo generar el archivo solicitado.')
        );
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="secondary"
        loading={loading === 'xlsx'}
        onClick={() => handleExport('xlsx')}
      >
        <FileSpreadsheet className="h-4 w-4" aria-hidden />
        Excel
      </Button>
      <Button
        type="button"
        variant="secondary"
        loading={loading === 'pdf'}
        onClick={() => handleExport('pdf')}
      >
        <FileDown className="h-4 w-4" aria-hidden />
        PDF
      </Button>
    </div>
  );
}
