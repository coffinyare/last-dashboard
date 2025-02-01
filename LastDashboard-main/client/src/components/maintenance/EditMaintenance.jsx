import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditMaintenance = ({ show, closeModal, requestId, refreshData }) => {
  const [formData, setFormData] = useState({
    description: '',
    priority: 'Medium',
    status: 'Pending',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && requestId) {
      const fetchRequestDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/maintenance/${requestId}`);
          const data = response.data.data;
          if (data) {
            setFormData({
              description: data.description || '',
              priority: data.priority || 'Medium',
              status: data.status || 'Pending',
            });
          } else {
            console.error("Unexpected data structure:", response.data);
          }
        } catch (error) {
          console.error('Error fetching request details:', error);
        }
      };
      fetchRequestDetails();
    }
  }, [show, requestId]);

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
      await axios.put(`http://localhost:3000/api/maintenance/${requestId}`, formData);
      toast.success('Maintenance request updated successfully');
      closeModal();
      refreshData();
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      toast.error('Failed to update the maintenance request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4 min-h-screen">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
          <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200">
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-6 text-center">Edit Maintenance Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white"
                placeholder="Enter description"
                rows="4"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 font-semibold text-white ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {isLoading ? 'Updating...' : 'Update Request'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditMaintenance;
