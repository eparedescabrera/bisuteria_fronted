import api from './axiosClient';

export async function getReporteInventario(params = {}) {
  const { data } = await api.get('/admin/reportes/inventario', { params });
  return data;
}

export async function getReporteKardex(params = {}) {
  const { data } = await api.get('/admin/reportes/kardex', { params });
  return data;
}

export async function getReporteRotacion(params = {}) {
  const { data } = await api.get('/admin/reportes/rotacion', { params });
  return data;
}

export async function getReporteValoracion() {
  const { data } = await api.get('/admin/reportes/valoracion');
  return data;
}

export async function getReporteAjustes(params = {}) {
  const { data } = await api.get('/admin/reportes/ajustes', { params });
  return data;
}

export async function getReportePorCategoria() {
  const { data } = await api.get('/admin/reportes/por-categoria');
  return data;
}

/**
 * Descarga Excel/PDF generado en backend.
 */
export async function exportarReporte(params = {}) {
  const response = await api.get('/admin/reportes/exportar', {
    params,
    responseType: 'blob',
    timeout: 60000
  });

  const disposition = response.headers['content-disposition'] || '';
  const match = disposition.match(/filename="?([^"]+)"?/i);
  const filename =
    match?.[1] ||
    `reporte_${params.reporte || 'inventario'}_${params.hasta || 'export'}.${params.formato === 'pdf' ? 'pdf' : 'xlsx'}`;

  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'application/octet-stream'
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);

  return { filename };
}
