import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        uniqueID: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('formDataLogin', formData);
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                formData
            });
            if (response.data.success) {
                setMessage('Login successful!');
                console.log('This is the login',response.data.userInfo)
                localStorage.setItem('user', JSON.stringify(response.data.userInfo));
                navigate(`/dashboard`);
            } else {
                setMessage(response.data.message || 'Login failed');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    name="uniqueID"
                    placeholder="Unique ID"
                    value={formData.uniqueID}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Login
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default Login; 