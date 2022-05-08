import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface RequireAuthProps {
  allowedRoles: number[]
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { auth } = useAuth()
  const location = useLocation()

  return auth?.roles?.find((role) => allowedRoles?.includes(parseInt(role))) ? (
    <Outlet />
  ) : auth?.accessToken ? ( //changed from user to accessToken to persist login after refresh
    <Navigate to="/auth/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/auth/signin" state={{ from: location }} replace />
  )
}
