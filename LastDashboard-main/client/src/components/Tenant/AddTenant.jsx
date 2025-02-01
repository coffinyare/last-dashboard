import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';

export function AddTenant() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/nonrentedProperties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z]/, 'Name must start with a letter')
      .matches(/^[a-zA-Z\s]*$/, 'Name must only contain letters and spaces')
      .required('Name is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    address: Yup.string().required('Address is required'),
    propertyId: Yup.string().required('Property is required'),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      await axios.post('http://localhost:3000/api/tenants', {
        name: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
        address: values.address,
        property: values.propertyId,
      });

      await axios.put(`http://localhost:3000/api/property/${values.propertyId}`, {
        isRented: true,
      });

      alert('Tenant registered successfully and property marked as rented.');
      navigate('/TenantTable');
    } catch (error) {
      console.error('Error registering tenant or updating property:', error);
      alert('There was an error submitting the tenant information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Lease Details' },
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <>
            <div>
              <label className="text-gray-300">Name</label>
              <Field
                type="text"
                name="name"
                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                placeholder="Tenant name"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className="text-gray-300">Phone Number</label>
              <Field
                type="text"
                name="phoneNumber"
                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                placeholder="Phone number"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className="text-gray-200">Select Property</label>
              <Field
                as="select"
                name="propertyId"
                className="block w-full py-3 px-4 text-white bg-gray-800 border border-gray-200 rounded-md focus:outline-none focus:border-blue-600"
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.name} {property.isRented ? '(Rented)' : ''}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="propertyId" component="div" className="text-red-500 text-sm" />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div>
              <label className="text-gray-300">Email</label>
              <Field
                type="email"
                name="email"
                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                placeholder="Email address"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className="text-gray-300">Address</label>
              <Field
                type="text"
                name="address"
                className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                placeholder="Enter address"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add New Tenant" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden bg-gray-800 rounded-md shadow-lg p-6">
              <Formik
                initialValues={{
                  name: '',
                  phoneNumber: '',
                  email: '',
                  address: '',
                  propertyId: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300">
                        {steps[currentStep - 1].title}
                      </h3>
                      <div className="space-y-4 mt-4">{renderStepContent(currentStep)}</div>
                    </div>
                    <div className="flex justify-between mt-6">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                          Back
                        </button>
                      )}
                      {currentStep < steps.length ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className={`ml-auto px-4 py-2 ${
                            isLoading || isSubmitting ? 'bg-gray-600' : 'bg-green-600'
                          } text-white rounded-md hover:bg-green-700`}
                        >
                          {isLoading || isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AddTenant;
