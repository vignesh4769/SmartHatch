import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { updateEmployee, getEmployeeDetails } from '../../api/employeeAPI';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditEmployee = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(state?.employee || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
    salary: '',
    role: 'employee',
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!state?.employee) {
      const fetchEmployee = async () => {
        try {
          setLoading(true);
          const data = await getEmployeeDetails(id);
          setEmployee(data);
        } catch (error) {
          toast.error(error.message);
          navigate('/admin/employees');
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id, state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
    if (formErrors[`emergencyContact.${name}`]) {
      setFormErrors(prev => ({ ...prev, [`emergencyContact.${name}`]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

  
    if (!employee.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    if (!employee.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!employee.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    if (!employee.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    }
    if (!employee.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    if (!employee.position.trim()) {
      errors.position = 'Position is required';
      isValid = false;
    }
    if (!employee.department.trim()) {
      errors.department = 'Department is required';
      isValid = false;
    }
    if (!employee.salary) {
      errors.salary = 'Salary is required';
      isValid = false;
    }

    if (!employee.emergencyContact.name.trim()) {
      errors['emergencyContact.name'] = 'Emergency contact name is required';
      isValid = false;
    }
    if (!employee.emergencyContact.relation.trim()) {
      errors['emergencyContact.relation'] = 'Emergency contact relation is required';
      isValid = false;
    }
    if (!employee.emergencyContact.phone.trim()) {
      errors['emergencyContact.phone'] = 'Emergency contact phone is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await updateEmployee(id, employee);
      toast.success('Employee updated successfully');
      navigate('/admin/employees');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="ml-64 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
         
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
              <div>
                <label className="block text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={employee.firstName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formErrors.firstName ? 'border-red-500' : ''}`}
                />
                {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
              </div>

         
              <div>
                <label className="block text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={employee.lastName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formErrors.lastName ? 'border-red-500' : ''}`}
                />
                {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
              </div>

            
              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

           
              <div>
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formErrors.phone ? 'border-red-500' : ''}`}
                />
                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
              </div>

          
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={employee.address}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formErrors.address ? 'border-red-500' : ''}`}
                />
                {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Employment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
              <div>
                <label className="block text-gray-700 mb-2">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={employee.position}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formErrors.position ? 'border-red-500' : ''}`}
                />
                {formErrors.position && <p className="text-red-500 text-sm mt-1">{formErrors.position}</p>}
              </div>

             
              <div>
                <label className="block text-gray-700 mb-2">Department *</label>
                <input
                  type="text"
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formErrors.department ? 'border-red-500' : ''}`}
                />
                {formErrors.department && <p className="text-red-500 text-sm mt-1">{formErrors.department}</p>}
              </div>

            
              <div>
                <label className="block text-gray-700 mb-2">Salary *</label>
                <input
                  type="number"
                  name="salary"
                  value={employee.salary}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formErrors.salary ? 'border-red-500' : ''}`}
                />
                {formErrors.salary && <p className="text-red-500 text-sm mt-1">{formErrors.salary}</p>}
              </div>

            
              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={employee.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

         
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Emergency Contact *</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={employee.emergencyContact?.name || ''}
                  onChange={handleEmergencyContactChange}
                  className={`w-full p-2 border rounded ${formErrors['emergencyContact.name'] ? 'border-red-500' : ''}`}
                />
                {formErrors['emergencyContact.name'] && <p className="text-red-500 text-sm mt-1">{formErrors['emergencyContact.name']}</p>}
              </div>

        
              <div>
                <label className="block text-gray-700 mb-2">Relation *</label>
                <input
                  type="text"
                  name="relation"
                  value={employee.emergencyContact?.relation || ''}
                  onChange={handleEmergencyContactChange}
                  className={`w-full p-2 border rounded ${formErrors['emergencyContact.relation'] ? 'border-red-500' : ''}`}
                />
                {formErrors['emergencyContact.relation'] && <p className="text-red-500 text-sm mt-1">{formErrors['emergencyContact.relation']}</p>}
              </div>

              
              <div>
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={employee.emergencyContact?.phone || ''}
                  onChange={handleEmergencyContactChange}
                  className={`w-full p-2 border rounded ${formErrors['emergencyContact.phone'] ? 'border-red-500' : ''}`}
                />
                {formErrors['emergencyContact.phone'] && <p className="text-red-500 text-sm mt-1">{formErrors['emergencyContact.phone']}</p>}
              </div>
            </div>
          </div>

          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/employees')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;