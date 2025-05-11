/* eslint-disable no-unused-vars */
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
import UserBoking from '../../user/user-booking';
import UserData from '../../user/user-data';
import User from '../Admin/User';
import AdminShowData from '../DashBoard/admin-data';
// import AdminDashboard from '../Admin/Admin-Dashboard';
// import Setting from '../Admin/Setting';
// import User from '../Admin/User';
// import AllShowData from '../Admin/All-User-Data';

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
      <Route element={<PrivateRoutes />}>
        {userRole !== 'admin' && <>
          {/* <Route path="/add" element={<AddRider />} />
           <Route path='/boking' element={<Boking />} />
          <Route path='/booking' element={<AddShipment />} />
          <Route path="/showData" element={<ShowData />} />
          <Route path="/make-delivery" element={<RunSheet />} />
          <Route path="/view-sheet" element={<ViewSheet />} /> */}
          {/* <Route path="/track-shipment" element={<TrackShipment />} /> */}
          <Route path='/user-booking' element={<UserBoking/>} /> 
          <Route path='/user-data' element={<UserData/>} /> 
        </>
        }
        <Route element={<AdminRoutes />}>
          <Route path="/admin/add" element={<AddRider />} />
          <Route path="/admin/boking" element={<Boking />} />
          <Route path="/admin/booking" element={<AddShipment />} />
          <Route path="/admin/showData" element={<ShowData />} />
          <Route path="/admin/make-delivery" element={<RunSheet />} />
          <Route path="/admin/track-shipment" element={<TrackShipment />} />
          <Route path="/admin/view-sheet" element={<ViewSheet />} />
          <Route path="/admin/user" element={<User />} />
          <Route path='/admin/admin-data' element={<AdminShowData/>} /> 
        </Route>
      </Route>
      <Route path="*" element={<div > Page not found </div>} />
    </Routes>
  );
};

export default FrontEnd;