export function isAdmin(user) {
  return user?.rol === 'Administrador';
}

export function isSuperAdmin(user) {
  return user?.rol === 'SuperAdministrador';
}

export function homePathForUser(user) {
  if (isSuperAdmin(user)) return '/super-admin';
  if (isAdmin(user)) return '/admin';
  return '/';
}
