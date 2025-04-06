import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: '',
    position: '',
    salary: '',
    joiningDate: new Date(),
    status: 'active',
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    },
    bankDetails: {
      accountNumber: '',
      bankName: '',
      branch: '',
      ifscCode: ''
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.user?.name || '',
        email: employee.user?.email || '',
        phone: employee.user?.phone || '',
        password: '',
        confirmPassword: '',
        employeeId: employee.employeeId || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || '',
        joiningDate: new Date(employee.joiningDate) || new Date(),
        status: employee.status || 'active',
        emergencyContact: employee.emergencyContact || {
          name: '',
          relation: '',
          phone: ''
        },
        bankDetails: employee.bankDetails || {
          accountNumber: '',
          bankName: '',
          branch: '',
          ifscCode: ''
        }
      });
    }
  }, [employee]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!employee && !formData.password) newErrors.password = 'Password is required';
    if (!employee && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ...(employee ? {} : { password: formData.password }),
        employeeId: formData.employeeId,
        department: formData.department,
        position: formData.position,
        salary: formData.salary,
        joiningDate: formData.joiningDate,
        status: formData.status,
        emergencyContact: formData.emergencyContact,
        bankDetails: formData.bankDetails
      };
      
      onSubmit(submissionData);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Form fields as shown in previous example */}
          {/* ... */}
          
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button onClick={onCancel} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {employee ? 'Update' : 'Register'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default EmployeeForm;