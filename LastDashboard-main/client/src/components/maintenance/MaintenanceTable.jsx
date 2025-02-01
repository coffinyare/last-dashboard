import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignContractorModal from './AssignContractorForm';
import EditMaintenanceModal from './EditMaintenance';

const MaintenanceTable = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/maintenance');
      const requestData = response.data.data;
      setMaintenanceRequests(requestData);
      setFilteredRequests(requestData);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast.error('Failed to fetch maintenance requests.');
    }
  };

  const openAssignModal = (requestId) => {
    setSelectedRequestId(requestId);
    setShowAssignModal(true);
  };

  const openEditModal = (requestId) => {
    setSelectedRequestId(requestId);
    setShowEditModal(true);
  };

  const openAddModal = () => {
    navigate('/Addmaintenance');
  };

  const closeModals = () => {
    setShowAssignModal(false);
    setShowEditModal(false);
    setSelectedRequestId(null);
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this maintenance request?")) {
      try {
        await axios.delete(`http://localhost:3000/api/maintenance/${requestId}`);
        fetchMaintenanceRequests();
        toast.success("Maintenance request deleted successfully");
      } catch (error) {
        console.error("Error deleting maintenance request:", error);
        toast.error("Failed to delete the maintenance request.");
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = maintenanceRequests.filter(
      (request) =>
        request.tenantId?.name.toLowerCase().includes(term) ||
        request.propertyId?.name.toLowerCase().includes(term) ||
        request.description.toLowerCase().includes(term) ||
        request.priority.toLowerCase().includes(term) ||
        request.status.toLowerCase().includes(term)
    );
    setFilteredRequests(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Maintenance Requests</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search requests..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-4"
          onClick={openAddModal}
        >
          Add New Request
        </button>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="max-h-80 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredRequests.map((request) => (
                  <motion.tr
                    key={request._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">{request.tenantId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{request.propertyId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{request.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{request.priority}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{request.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{request.contractorId?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="text-green-400 hover:text-green-300"
                        onClick={() => openAssignModal(request._id)}
                      >
                        Assign
                      </button>
                      <button
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => openEditModal(request._id)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteRequest(request._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No maintenance requests to display.</p>
      )}

      {/* Modals */}
      <AssignContractorModal
        show={showAssignModal}
        closeModal={closeModals}
        requestId={selectedRequestId}
        refreshData={fetchMaintenanceRequests}
      />

      <EditMaintenanceModal
        show={showEditModal}
        closeModal={closeModals}
        requestId={selectedRequestId}
        refreshData={fetchMaintenanceRequests}
      />
      <ToastContainer />
    </motion.div>
  );
};

export default MaintenanceTable;
