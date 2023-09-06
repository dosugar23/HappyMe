import './App.css';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from "./screens/Home"
import Profile from './screens/Profile';
import ChangePassWord from './screens/ChangePassWord';
import ListJob from './screens/ListJob';
import CreateJob from './screens/CreateJob';
import UpdateJob from './screens/UpdateJob';
import FindJob from './screens/FindJob';
import DetailJob from './screens/DetailJob';
import PersonApply from './screens/PersonApply';
import Message from './screens/Message';
import PayPal from './screens/PayPal';
import ListHistoryDraw from './screens/ListHistoryDraw';
import FilterJob from './screens/FilterJob';
import EmployeeDetail from './screens/EmployeeDetail';
import ListPostManagement from './screens/ListPostManagement';
import ManagementUser from './screens/ManagementUser';
import DetailUser from './screens/DetailUser';


const ProtectedRoute = ({ children, auth=false }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;

  if(!isLoggedIn && auth) {
    return <Navigate to={'/users/sign_in'} />
  }else if(isLoggedIn && ['/users/sign_in', '/users/sign_up'].includes(window.location.pathname)){
    console.log('object :>> ');
    return <Navigate to={'/'} />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
          <Home/>
      } />
      <Route path='/profile' element={
        <ProtectedRoute auth={true}>
          <PayPal>
          <Profile/>
          </PayPal>
        </ProtectedRoute>
      } />
      <Route path='/jobs' element={
        <ProtectedRoute auth={true}>
          <ListJob/>
        </ProtectedRoute>
      } />
      <Route path='/list-post-management' element={
        <ProtectedRoute auth={true}>
          <ListPostManagement/>
        </ProtectedRoute>
      } />
      <Route path='/list-users' element={
        <ProtectedRoute auth={true}>
          <ManagementUser/>
        </ProtectedRoute>
      } />
      <Route path='/find-job' element={
        <ProtectedRoute auth={true}>
          <FindJob/>
        </ProtectedRoute>
      } />
       <Route path='/detail-filter/:name/:category' element={
        <ProtectedRoute auth={true}>
          <FilterJob/>
        </ProtectedRoute>
      } />
      <Route path='/create-job' element={
        <ProtectedRoute auth={true}>
          <CreateJob/>
        </ProtectedRoute>
      } />
      <Route path='/detail-job/:id' element={
        <ProtectedRoute auth={true}>
          <DetailJob/>
        </ProtectedRoute>
      } />
      <Route path='/detail-user/:id/:role' element={
        <ProtectedRoute auth={true}>
          <DetailUser/>
        </ProtectedRoute>
      } />
      <Route path='/person-apply/:id' element={
        <ProtectedRoute auth={true}>
          <PersonApply/>
        </ProtectedRoute>
      } />
       <Route path='/list-message' element={
        <ProtectedRoute auth={true}>
          <Message/>
        </ProtectedRoute>
      } />
       <Route path='/list-history-draw' element={
        <ProtectedRoute auth={true}>
          <ListHistoryDraw/>
        </ProtectedRoute>
      } />
      <Route exact path='/update-job/:idPost' element={
        <ProtectedRoute auth={true}>
          <UpdateJob/>
        </ProtectedRoute>
      } />
       <Route path='/change-password' element={
        <ProtectedRoute auth={true}>
          <ChangePassWord/>
        </ProtectedRoute>
      } />
       <Route path='/employee-detail/:id' element={
        <ProtectedRoute auth={true}>
          <EmployeeDetail/>
        </ProtectedRoute>
      } />
      <Route path='/users/sign_in' element={
      <ProtectedRoute>
        <Form isSignInPage={true}/>
      </ProtectedRoute>
      } />
      <Route path='/users/sign_up' element={
        <ProtectedRoute>
        <Form isSignInPage={false}/>
      </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
