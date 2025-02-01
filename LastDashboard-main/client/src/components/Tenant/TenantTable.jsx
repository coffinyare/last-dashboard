import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TenantTable = () => {
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTenants, setFilteredTenants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tenants');
        setTenants(response.data);
        setFilteredTenants(response.data); 
      } catch (error) {
        console.error('Error fetching tenants:', error);
        toast.error('Failed to load tenants.');
      }
    };
    fetchTenants();
  }, []);

  const handleAddNew = () => {
    navigate("/AddTenant");
  };

  const handleEditClick = (tenant) => {
    navigate(`/EditTenant/${tenant._id}`);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this tenant?");
    if (!isConfirmed) return;
    try {
      await axios.delete(`http://localhost:3000/api/tenants/${id}`);
      // Update state and ensure toast fires only once
      setTenants((prevTenants) => prevTenants.filter((tenant) => tenant._id !== id));
      setFilteredTenants((prevTenants) => prevTenants.filter((tenant) => tenant._id !== id));
      toast.success('Tenant deleted successfully.', { toastId: id });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Failed to delete the tenant.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = tenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(term) ||
        tenant.email.toLowerCase().includes(term) ||
        tenant.property?.name.toLowerCase().includes(term)
    );
    setFilteredTenants(filtered);
  };

  const handleDeclineClick = async (tenant) => {
    const isConfirmed = window.confirm("Are you sure you want to decline this tenant's lease?");
    if (!isConfirmed) return;
    try {
      await axios.patch(`http://localhost:3000/api/tenants/${tenant._id}/decline`);
      setTenants((prevTenants) => 
        prevTenants.map((t) => (t._id === tenant._id ? { ...t, declined: true } : t))
      );
      setFilteredTenants((prevTenants) => 
        prevTenants.map((t) => (t._id === tenant._id ? { ...t, declined: true } : t))
      );
      toast.success('Lease declined successfully and SMS sent.');
    } catch (error) {
      console.error('Error declining tenant:', error);
      toast.error('Failed to decline the tenant lease.');
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md max-w-7xl shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Tenant List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tenants..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-4"
          onClick={handleAddNew}
        >
          Add New
        </button>
      </div>

      {filteredTenants.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Property Name</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="w-1/12 px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredTenants.map((tenant) => (
                  <motion.tr
                    key={tenant._id}
                    className="hover:bg-gray-700 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.property?.name || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.address}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.phoneNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 text-center flex gap-2">
                      <button
                        className="text-indigo-400 hover:text-indigo-300"
                        onClick={() => handleEditClick(tenant)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(tenant._id)} // Pass tenant._id directly
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
        <p className="text-center text-gray-500">No available tenants to display.</p>
      )}

      <ToastContainer />
    </motion.div>
  );
};

export default TenantTable;
