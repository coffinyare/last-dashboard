import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContractorTableWithActions = () => {
  const [contractors, setContractors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContractors, setFilteredContractors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/contractors');
        const contractorData = response.data.data;
        setContractors(contractorData);
        setFilteredContractors(contractorData);
      } catch (error) {
        console.error('Error fetching contractors:', error);
        toast.error('Failed to load contractors.');
      }
    };
    fetchContractors();
  }, []);

  const handleAddNew = () => {
    navigate("/AddContactor");
  };
  
  const handleEditClick = (contractor) => {
    navigate(`/EditContactor/${contractor._id}`);
  };
  
  const handleDelete = async (id) => {
    if (!id) return;
    const isConfirmed = window.confirm("Are you sure you want to delete this contractor?");
    if (!isConfirmed) return;
    try {
      await axios.delete(`http://localhost:3000/api/contractors/${id}`);
      setContractors((prev) => prev.filter((contractor) => contractor._id !== id));
      setFilteredContractors((prev) => prev.filter((contractor) => contractor._id !== id));
      toast.success('Contractor deleted successfully');
    } catch (error) {
      console.error('Error deleting contractor:', error);
      toast.error('Failed to delete the contractor.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = contractors.filter(
      (contractor) =>
        contractor.name.toLowerCase().includes(term) ||
        contractor.email.toLowerCase().includes(term) ||
        contractor.skills.join(', ').toLowerCase().includes(term)
    );
    setFilteredContractors(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 scroll-smooth backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Contractor List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search contractors..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-4"
          onClick={handleAddNew}
        >
          Add New Contractor
        </button>
      </div>

      {filteredContractors.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="max-h-80 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredContractors.map((contractor) => (
                  <motion.tr
                    key={contractor._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">{contractor.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{contractor.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{contractor.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{contractor.skills.join(', ')}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{contractor.available ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="text-indigo-400 hover:text-indigo-300"
                        onClick={() => handleEditClick(contractor)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(contractor._id)}
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
        <p className="text-center text-gray-500">No available contractors to display.</p>
      )}
      
      <ToastContainer />
    </motion.div>
  );
};

export default ContractorTableWithActions;
