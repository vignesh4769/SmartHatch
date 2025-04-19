const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || 
        !formData.phone || !formData.address || !formData.position || !formData.department || 
        !formData.salary || !formData.emergencyContact.name || !formData.emergencyContact.relation || 
        !formData.emergencyContact.phone) {
      throw new Error('All fields are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      throw new Error('Please enter a valid phone number');
    }

    // Validate salary
    if (isNaN(formData.salary) || formData.salary <= 0) {
      throw new Error('Please enter a valid salary amount');
    }

    const response = await createEmployee(formData);
    setSuccess('Employee registered successfully!');
    setFormData(initialFormState);
    // Optionally redirect or show success message
  } catch (err) {
    console.error('Registration error:', err);
    setError(err.message || 'Failed to register employee. Please try again.');
  } finally {
    setLoading(false);
  }
}; 