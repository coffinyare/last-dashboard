import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../common/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
    .matches(/^[A-Za-z][A-Za-z0-9\s]*$/, 'Invalid skill')
    .required('Skills are required'),
  available: Yup.boolean().required('Availability is required'),
});

export function EditContractorForm() {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    skills: '',
    available: 'true',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/contractors/${id}`)
        .then(response => {
          const data = response.data.data;
          setFormState({
            name: data.name,
            phone: data.phone,
            email: data.email,
            skills: data.skills ? data.skills.join(', ') : '',
            available: data.available ? 'true' : 'false',
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching contractor:', error);
          setError('Failed to load contractor details. Please try again later.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:3000/api/contractors/${id}`, {
        ...values,
        skills: values.skills.split(',').map(skill => skill.trim()),
      });
      toast.success('Contractor updated successfully');
      navigate('/Contactors');
    } catch (error) {
      console.error('Error updating contractor:', error);
      toast.error('Failed to update contractor.');
    }
  };

  if (loading) {
    return <p>Loading contractor details...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="flex-1 relative z-10 h-screen overflow-y-auto">
      <Header title="Edit Contractor" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-4xl mx-auto mt-4 bg-gray-800 rounded-md shadow-md p-8">
            <Formik
              initialValues={formState}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Name</label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Contractor name"
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Phone Number</label>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="Phone number"
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Email</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Contractor email"
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Skills</label>
                    <Field
                      type="text"
                      name="skills"
                      placeholder="Skills (comma-separated)"
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <ErrorMessage name="skills" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Available</label>
                    <Field as="select" name="available" className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500">
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Field>
                    <ErrorMessage name="available" component="div" className="text-red-600 text-sm" />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Update Contractor
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}

export default EditContractorForm;
