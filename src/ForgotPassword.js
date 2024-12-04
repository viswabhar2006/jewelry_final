import React, { useState } from 'react';
import './ForgotPassword.css'; // Import the CSS file for styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        // Simulate sending an OTP
        console.log(`Sending OTP to ${email}`);
        alert('OTP has been sent to your email!'); // Replace this with actual email sending logic
        setIsOtpSent(true);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        // Simulate OTP verification
        // Replace '123456' with actual OTP verification logic
        if (otp === '123456') {
            alert('OTP verified successfully! Redirecting to reset password page...');
            // Redirect to the reset password page
            window.location.href = 'resetpassword.html'; // Change to your reset password page
        } else {
            alert('Invalid OTP. Please try again.');
        }
    };

    return (
        <div>
            <div className="container" id="email-container" style={{ display: isOtpSent ? 'none' : 'block' }}>
                <h1>Reset Password</h1>
                <form id="email-form" onSubmit={handleEmailSubmit}>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send OTP</button>
                </form>
            </div>

            <div className="container" id="otp-container" style={{ display: isOtpSent ? 'block' : 'none' }}>
                <h1>Verify OTP</h1>
                <form id="otp-form" onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        id="otp"
                        placeholder="Enter the OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit">Verify OTP</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;