import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import React from 'react';
import UserPool from '../utils/UserPool';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OTPComponent = (data) => {
    const [formData, setFormData] = React.useState({
        otp: ""
    });
    const navigate = useNavigate();
    const email = data.email;
    const name = data.name;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData.otp, data.email, data.password,data.name);

        const user = new CognitoUser({
            Username: data.email,
            Pool: UserPool,
        });

        // Confirm registration with OTP
        user.confirmRegistration(formData.otp, true, (err, result) => {
            if (err) {
                console.error('OTP confirmation failed:', err);
                toast.error("Invalid OTP. Please try again.");
                return;
            }
            console.log('OTP confirmed:', result);

            const authDetails = new AuthenticationDetails({
                Username: data.email,     
                Password: data.password
            });

            // Authenticate user after OTP confirmation
            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    console.log('Authentication successful:', data);
                    toast.success("OTP verified successfully");
                    console.log(data);
                    navigate('/securityquestions', { state: { email: email, name: name  } });
                },
                onFailure: (err) => {
                    console.error('Authentication failed:', err);
                    toast.error("Authentication failed. Please check your credentials.");
                },
                newPasswordRequired: (data) => {
                    console.log('New password required:', data);
                }
            });
        });
    };

    return (
        <div>
            <h2>Please enter the OTP</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="otp">OTP</label>
                <input
                    type="text"
                    id="otp"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    placeholder="Enter OTP"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default OTPComponent;
