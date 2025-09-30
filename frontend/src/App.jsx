import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import LandingPage from './pages/LandingPage/LandingPage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import { Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Allinvoice from './pages/Invoices/Allinvoice'
import CreateInvoice from './pages/Invoices/CreateInvoice'
import InvoiceDetail from './pages/Invoices/InvoiceDetail'
import ProfilePage from './pages/Profile/ProfilePage'
import ProtectedRoute from './components/auth/ProtectedRoute'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>


          <Route path='/' element={<ProtectedRoute/>}>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='invoices' element={<Allinvoice/>}/>
            <Route path='invoices/new' element={<CreateInvoice/>}/>
            <Route path='invoices/:id' element={<InvoiceDetail/>}/>
            <Route path='profile' element={<ProfilePage/>}/>
          </Route>

          <Route path="*" element={<Navigate to ="/" replace />}/>
        </Routes>
      </Router>
      <Toaster>
        toastOptions={{
          className:"",
          style:{
            fontSize:"13px",
          },
        }}
      </Toaster>
    </div>
  )
}

export default App  