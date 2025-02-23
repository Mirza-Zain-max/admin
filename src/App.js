import React from 'react'
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Route from './Pages/Routes/Route'
import { useLocation } from 'react-router-dom';
import Header1 from './Components/Header/Header';
import SideBar from './Pages/layouts/SideBar';

const App = () => {
  const location = useLocation()
  const validPath = ['/auth/', '/admin/register', '/admin/login', '/admin/setting', '/admin/user', '/admin/dashboard']
  const aPath = ['/auth/']
  const userROle = localStorage.getItem('user-role')
  return (
    <>
      {(userROle !== 'admin' && !validPath.some(item => location.pathname.startsWith(item))) && <Header1 />}
      {(userROle === 'admin' && !aPath.some(item => location.pathname.startsWith(item))) ?
        <SideBar >
          <Route />
        </SideBar> : <Route />}
    </>
  )
}

export default App