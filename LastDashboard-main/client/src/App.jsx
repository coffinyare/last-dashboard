import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from './components/DashboardLayout';
import Login from './pages/login';
import ProductsPage from './pages/PropertyPage'; // Ensure this is the correct import
import AnalyticsPage from './pages/AnalyticsPage';
import EditProperty from './components/property/EditProperty';
import AddTenant from './components/Tenant/AddTenant';
import EditTenant from './components/Tenant/EditTenant';
import Contactors from './pages/Contactors';
import EditContractorForm from './components/Contractors/EditContractor';
import AddContractor from './components/Contractors/AddContractor';
import Dashboard from './pages/Dashbord';
import MaintenanceTable from './components/maintenance/MaintenanceTable';
import AddMaintenance from './components/maintenance/AddMaintenance';
import TenantsPage from './pages/Tenants';


import AddPropertyModal from './components/property/AddProperty';
import Property from './pages/PropertyPage';
import ContractorTableWithActions from './components/Contractors/ContractorsTable';
import TenantTable from './components/Tenant/TenantTable';

function App() {
  return (
    <>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/property" element={<Property/>}/>
          <Route path="/EditProperty/:id" element={<EditProperty />} />
          <Route path='/Add-propery' element={<AddPropertyModal/>}/>
          <Route path="/AddTenant" element={<AddTenant />} />
          <Route path="/EditTenant/:id" element={<EditTenant />} />
          <Route path="/Tenants" element={<TenantsPage />} />
          <Route path='/TenantTable' element={<TenantTable/>}/>
          <Route path="/Contactors" element={<Contactors />} />
          <Route path="/EditContactor/:id" element={<EditContractorForm />} />
          <Route path="/AddContactor" element={<AddContractor />} />
          <Route path='/contactorsTable' element={<ContractorTableWithActions/>}/>
          <Route path="/maintenance" element={<MaintenanceTable />} />
          <Route path="/Addmaintenance" element={<AddMaintenance />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;