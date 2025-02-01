import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignContractorModal = ({ show, closeModal, requestId, tenantId, refreshData }) => {
  const [contractors, setContractors] = useState([]);
  const [contractorId, setContractorId] = useState('');
  const [tenant, setTenant] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isContractorLoading, setIsContractorLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const fetchContractors = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/contractors');
          setContractors(response.data.data || []);
        } catch (error) {
          console.error('Error fetching contractors:', error);
        }
      };

      // const fetchTenant = async () => {
      //   try {
      //     const response = await axios.get(`http://localhost:3000/api/tenants/${tenantId}`);
      //     if (response.data) {
      //       setTenant(response.data);
      //       console.log('Fetched tenant data:', response.data);
      //     } else {
      //       throw new Error('No tenant data found');
      //     }
      //   } catch (error) {
      //     console.error('Error fetching tenant details:', error);
      //     toast.error('Error fetching tenant details.');
      //   }
      // };
      const fetchTenant = async () => {
        console.log('tenantId:', tenantId); // Log tenantId
        try {
          const response = await axios.get(`http://localhost:3000/api/tenants/${tenantId}`);
          if (response.data) {
            setTenant(response.data);
            console.log('Fetched tenant data:', response.data);
          } else {
            throw new Error('No tenant data found');
          }
        } catch (error) {
          console.error('Error fetching tenant details:', error);
          // toast.error('Error fetching tenant details.');
        }
      };
      
      

      fetchContractors();
      fetchTenant();
      setContractorId('');
    }
  }, [show, tenantId]);

  const handleContractorChange = (e) => {
    setContractorId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractorId) {
      toast.error("Please select a contractor.");
      return;
    }

    setIsLoading(true);

    try {
      // Assign contractor
      await axios.put(`http://localhost:3000/api/maintenance/${requestId}/assign`, {
        contractorId,
        assignmentDate: new Date(),
      });

      toast.success("Contractor assigned successfully");
      closeModal();
      refreshData();
    } catch (error) {
      console.error("Error assigning contractor:", error.message);
      toast.error("Failed to assign contractor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 min-h-screen">
        <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg p-6 w-full max-w-sm mx-4 relative border border-gray-700">
          <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-300 text-xl" aria-label="Close Modal">
            &times;
          </button>
          <h2 className="text-xl font-semibold text-center mb-4">Assign Contractor</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 font-medium mb-2">Select Contractor</label>
              <select
                value={contractorId}
                onChange={handleContractorChange}
                className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a Contractor</option>
                {isContractorLoading ? (
                  <option disabled>Loading contractors...</option>
                ) : (
                  contractors.map((contractor) => (
                    <option key={contractor._id} value={contractor._id}>
                      {contractor.name} - {contractor.skills ? contractor.skills.join(', ') : 'No skills listed'}
                    </option>
                  ))
                )}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading || !contractorId}
              className={`w-full px-4 py-2 mt-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {isLoading ? 'Assigning...' : 'Assign Contractor'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AssignContractorModal;
