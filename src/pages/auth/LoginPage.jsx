import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'officer', label: 'Officer' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Email or mobile number is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setApiError('');

        try {
            // BACKEND INTEGRATION: Replace with actual Login API
            // Endpoint: POST /api/auth/login
            // Body: { username, password, role }
            // Response: { success: boolean, requiresOTP: boolean, userId: string, token?: string }

            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate successful login
            const mockResponse = {
                success: true,
                requiresOTP: true,
                userId: 'user_' + Date.now(),
            };

            if (mockResponse.success && mockResponse.requiresOTP) {
                // Navigate to OTP page with userId and role
                navigate('/auth/otp', {
                    state: {
                        userId: mockResponse.userId,
                        role: formData.role,
                        username: formData.username,
                    }
                });
            }

            // BACKEND INTEGRATION: Handle error responses
            // if (!response.success) {
            //   setApiError(response.message || 'Invalid credentials');
            // }

        } catch (error) {
            setApiError('An error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Secure Login"
            subtitle="Access your government portal account"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {apiError && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
                    </div>
                )}

                <Input
                    type="text"
                    name="username"
                    label="Email or Mobile Number"
                    placeholder="Enter your email or mobile number"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    required
                    disabled={loading}
                    icon={(props) => (
                        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                />

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                    disabled={loading}
                    icon={(props) => (
                        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    )}
                />

                <Select
                    name="role"
                    label="Select Role"
                    placeholder="Choose your role"
                    value={formData.role}
                    onChange={handleChange}
                    options={roleOptions}
                    error={errors.role}
                    required
                    disabled={loading}
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
