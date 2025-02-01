import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function AddMaintenance() {
  const [formData, setFormData] = useState({
    tenantId: '',
    propertyId: '',
    description: '',
    priority: 'Medium',
    contractorId: '',
  });
  const [tenants, setTenants] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantResponse = await axios.get('http://localhost:3000/api/tenants');
        const contractorResponse = await axios.get('http://localhost:3000/api/contractors');
        setTenants(tenantResponse.data || []);
        setContractors(contractorResponse.data.data || contractorResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleTenantChange = (e) => {
    const tenantId = e.target.value;
    const selectedTenant = tenants.find((tenant) => tenant._id === tenantId);
    const associatedPropertyId = selectedTenant?.property?._id || '';
    const associatedPropertyName = selectedTenant?.property?.name || 'Select Property';

    setFormData((prevData) => ({
      ...prevData,
      tenantId,
      propertyId: associatedPropertyId,
      propertyName: associatedPropertyName,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('http://localhost:3000/api/maintenance', {
        ...formData,
      });

      toast.success('Maintenance request submitted successfully');
      navigate('/maintenance');
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      toast.error('There was an error submitting the maintenance request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header title="Add Maintenance Request" />
      <section className="py-2 px-2 bg-gray-900 min-h-screen "style={{ filter: 'none', position: 'relative', zIndex: 10 }}>
        <div className="max-w-4xl">
          <div className="bg-gray-800 rounded-md shadow-md p-4">
            <form onSubmit={handleSubmit} method="POST">
              <div className="mb-4">
                <label className="text-base font-medium text-gray-300">Tenant</label>
                <select
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleTenantChange}
                  className="block w-full py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant._id} value={tenant._id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="text-base font-medium text-gray-300">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-base font-medium text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the maintenance issue"
                  className="block w-full py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-4 py-2 text-base font-semibold text-white ${isLoading ? 'bg-gray-600' : 'bg-blue-600'} rounded-md focus:outline-none hover:bg-blue-700`}
                >
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}

export default AddMaintenance;
