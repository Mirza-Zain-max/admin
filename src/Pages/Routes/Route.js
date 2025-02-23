import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import Forgot from '../Auth/Forgot';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import AdminRoutes from './AdminRoutes'; 
import AddRider from '../DashBoard/AddRider';
import ShowData from '../DashBoard/ShowData';
import RunSheet from '../DashBoard/RunSheet';
import ViewSheet from '../DashBoard/ViewSheet';
import TrackShipment from '../DashBoard/Tracking';
import AddShipment from '../DashBoard/AddShipment';
import Dashboard from '../DashBoard/Dashboard';
import Boking from '../DashBoard/Booking';
import AdminDashboard from '../Admin/Admin-Dashboard';
import Setting from '../Admin/Setting';
import User from '../Admin/User';

const FrontEnd = () => {
  const userRole = localStorage.getItem("user-role");
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot" element={<Forgot />} />
      </Route>
        <Route path='/' element={<Dashboard />} />
      {userRole !== 'admin' && <>
      </>}
      <Route element={<PrivateRoutes />}>
        {userRole !== 'admin' && <>
           <Route path='/boking' element={<Boking />} />m
          <Route path='/booking' element={<AddShipment />} />
          <Route path="/add" element={<AddRider />} />
          <Route path="/showData" element={<ShowData />} />
          <Route path="/make-delivery" element={<RunSheet />} />
          <Route path="/track-shipment" element={<TrackShipment />} />
          <Route path="/view-sheet" element={<ViewSheet />} />
        </>
        }
        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<User />} />
          <Route path="/admin/settings" element={<Setting />} />
        </Route>
      </Route>
      <Route path="*" element={<div > Page not found </div>} />
    </Routes>
  );
};

export default FrontEnd;