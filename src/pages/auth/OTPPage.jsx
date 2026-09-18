import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import OTPInput from '../../components/ui/OTPInput';
import Button from '../../components/ui/Button';

const OTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, role, username } = location.state || {};

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Redirect to login if no userId
    useEffect(() => {
        if (!userId) {
            navigate('/', { replace: true });
        }
    }, [userId, navigate]);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleOTPChange = (value) => {
        setOtp(value);
        setError('');
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // BACKEND INTEGRATION: Replace with actual Verify OTP API
            // Endpoint: POST /api/auth/verify
            // Body: { userId, otp }
            // Response: { success: boolean, role: string, token: string }

            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate successful verification
            const mockResponse = {
                success: true,
                role: role,
                token: 'mock_jwt_token_' + Date.now(),
            };

            if (mockResponse.success) {
                // BACKEND INTEGRATION: Store token in localStorage or secure storage
                localStorage.setItem('authToken', mockResponse.token);
                localStorage.setItem('userRole', mockResponse.role);

                // Redirect based on role
                if (mockResponse.role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else if (mockResponse.role === 'officer') {
                    navigate('/officer/dashboard', { replace: true });
                }
            }

            // BACKEND INTEGRATION: Handle error responses
            // if (!response.success) {
            //   setError(response.message || 'Invalid OTP');
            // }

        } catch (err) {
            setError('Verification failed. Please try again.');
            console.error('OTP verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setCanResend(false);
        setResendTimer(60);
        setError('');

        try {
            // BACKEND INTEGRATION: Replace with actual Resend OTP API
            // Endpoint: POST /api/auth/resend-otp
            // Body: { userId }
            // Response: { success: boolean }

            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message (optional)
            console.log('OTP resent successfully');

        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
            console.error('Resend OTP error:', err);
        }
    };

    return (
        <AuthLayout
            title="Verify OTP"
            subtitle={`Enter the code sent to ${username || 'your registered contact'}`}
        >
            <form onSubmit={handleVerify} className="space-y-6">
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                        Enter 6-digit OTP
                    </label>
                    <OTPInput
                        length={6}
                        value={otp}
                        onChange={handleOTPChange}
                        disabled={loading}
                        error={!!error}
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={loading}
                    disabled={loading || otp.length !== 6}
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={!canResend}
                        className={`
              text-sm font-medium
              ${canResend
                                ? 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'
                                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            }
              transition-colors duration-200
            `}
                    >
                        {canResend
                            ? 'Resend OTP'
                            : `Resend OTP in ${resendTimer}s`
                        }
                    </button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                    >
                        ← Back to Login
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default OTPPage;
