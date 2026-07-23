import Swal from 'sweetalert2';

export function toastSuccess(message) {
  return Swal.fire({
    icon: 'success',
    title: message,
    timer: 1800,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
}

export function toastError(message) {
  return Swal.fire({
    icon: 'error',
    title: message,
    confirmButtonColor: '#1f57c8'
  });
}

export async function confirmAction({
  title = '¿Confirmar?',
  text = 'Esta acción no se puede deshacer fácilmente.',
  confirmText = 'Sí, continuar'
}) {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar'
  });
  return result.isConfirmed;
}
