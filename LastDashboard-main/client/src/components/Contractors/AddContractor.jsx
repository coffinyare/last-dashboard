import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup'; // Import Yup for validation

export function AddContractor() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: '',
        available: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Define Yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string()
            .matches(/^[A-Za-z][A-Za-z0-9\s]*$/, 'Name must start with a letter')
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone must be a 10-digit number')
            .required('Phone number is required'),
        skills: Yup.string()
            .matches(/^[A-Za-z][A-Za-z0-9\s]*$/, 'invalid skill ')
            .required('Skills are required'),
        available: Yup.boolean().required('Availability is required'),
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Navigate to next step
    const nextStep = () => setStep((prev) => prev + 1);
    // Navigate to previous step
    const prevStep = () => setStep((prev) => prev - 1);

    // Validate form data using Yup
    const validateForm = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            return true;
        } catch (error) {
            error.inner.forEach((err) => toast.error(err.message)); // Display validation errors
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (!isValid) return; // Stop submission if validation fails

        setIsLoading(true);
        try {
            await axios.post('http://localhost:3000/api/contractors', { ...formData });
            toast.success('Contractor registered successfully');
            navigate('/contactorsTable');
        } catch (error) {
            console.error('Error registering contractor:', error);
            toast.error('There was an error submitting the contractor. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Add New Contractor" />
            <section className="py-4 bg-gray-900">
                <div className="px-4 mx-auto max-w-7xl">
                    <div className="relative max-w-6xl mx-auto">
                        <div className="overflow-hidden bg-gray-800 rounded-md shadow-lg p-6">
                            <div className="text-center text-white mb-4">
                                Step {step} of 2
                            </div>

                            {/* Step 1: Basic Information */}
                            {step === 1 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300">Basic Information</h3>
                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <label className="text-gray-300">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                                                placeholder="Contractor name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-300">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                                                placeholder="Contractor email"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-300">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                                                placeholder="Contractor phone"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Skills and Availability */}
                            {step === 2 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300">Skills and Availability</h3>
                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <label className="text-gray-300">Skills</label>
                                            <input
                                                type="text"
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                                                placeholder="Contractor skills (e.g., plumbing, electrical)"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-300">Availability</label>
                                            <select
                                                name="available"
                                                value={formData.available}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.value === 'true' }))}
                                                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                                            >
                                                <option value="true">Available</option>
                                                <option value="false">Not Available</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-6">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Back
                                    </button>
                                )}
                                {step < 2 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className={`ml-auto px-4 py-2 ${isLoading ? 'bg-gray-600' : 'bg-blue-600'} text-white rounded-md hover:bg-blue-700`}
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer /> {/* Add ToastContainer here */}
        </div>
    );
}

export default AddContractor;
