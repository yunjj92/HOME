import { rootRoute, index, route } from '@tanstack/virtual-file-routes'

export const routes = rootRoute('__root.tsx', [
  index('auth/register.tsx'),
  route('/home', 'main/mainHome.tsx'),
  route('/account', 'management/accountManagement.tsx'),
  route('/bank', 'management/bankManagement.tsx'),
  route('/login', 'auth/login.tsx'),
])

