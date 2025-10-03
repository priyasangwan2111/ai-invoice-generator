
import {Navigate,Outlet} from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'
import {useAuth} from '../../context/AuthContext'
const ProtectedRoute = ({children}) => {
    const{isAuthenticated,loading}=useAuth()
   
    if(loading){
        return <div>loading..</div>
    }
    if(!isAuthenticated){
        return <Navigate to ="/login" replace />
    }
  return (
    <DashboardLayout>{children ?children:<Outlet/>}</DashboardLayout>
  )
}

export default ProtectedRoute