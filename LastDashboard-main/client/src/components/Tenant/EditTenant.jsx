import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../common/Header';
import { toast } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z][A-Za-z0-9\s]*$/, 'Name must start with a letter')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be a 10-digit number')
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
});

export function EditTenant() {
  const [formState, setFormState] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    property: '',
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/tenants/${id}`)
        .then(response => {
          const data = response.data;
          setFormState({
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email,
            address: data.address || '',
            property: data.property?._id || data.property,
          });
        })
        .catch(error => {
          console.error('Error fetching tenant:', error);
        });
    }
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:3000/api/tenants/${id}`, values);
      toast.success('Tenant updated successfully');
      navigate('/tenants');
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast.error('Failed to update the tenant.');
    }
  };

  return (
    <div className="flex-1 relative z-10 h-screen overflow-y-auto">
      <Header title="Edit Tenant" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-4xl mx-auto mt-4 bg-gray-800 rounded-md shadow-md p-8">
            <Formik
              initialValues={formState}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Name', name: 'name', type: 'text', placeholder: 'Tenant name' },
                    { label: 'Phone Number', name: 'phoneNumber', type: 'text', placeholder: 'Phone number' },
                    { label: 'Email', name: 'email', type: 'email', placeholder: 'Email address' },
                    { label: 'Address', name: 'address', type: 'text', placeholder: 'Address' },
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name} className="col-span-1">
                      <label className="text-sm font-medium text-gray-400 mb-2 block">{label}</label>
                      <Field
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                      />
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Update Tenant
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EditTenant;
