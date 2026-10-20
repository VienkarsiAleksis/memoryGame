import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.scss';

const LoginPage = () => {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    let color = "yellow";

    if (Cookies.get('theam')) {
        color = Cookies.get('theam');
    }


    const navigateToMain = () => {
        navigate('/');
    };

    const login = async (e) => {
        e.preventDefault();
    
        // Initialize errors object
        const newErrors = {};
    
        // Perform client-side validation
        if (!name.trim()) {
            newErrors.name = ['Name is empty'];
        }
        
        if (!password.trim()) {
            newErrors.password = ['Password is empty'];
        }
    
        if (Object.keys(newErrors).length > 0) {
            // Update errors state if there are validation errors
            setErrors(newErrors);
        } else {
            try {
                const nameCheckResponse = await axios.get(`http://localhost:8000/api/check-username-exists/${name}`);
    
                if (!nameCheckResponse.data.message) {
                    // Name doesn't exist, update errors state
                    setErrors({ name: ['Name doesn\'t exist'] });
                } else {
                    // Name exists, proceed with password check
                    const passwordCheckResponse = await axios.post('http://localhost:8000/api/check-password', {
                        name: name,
                        password: password
                    });
                    
                    console.log(passwordCheckResponse);
                    // Password is correct, proceed with login
                    if (passwordCheckResponse.data.message) {
                        Cookies.set('name', name);
                        navigateToMain();
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setErrors({ password: [error.response.data.error] });
            }
        }
    };
    
    
    return(
       <div className={`loginPage ${color}`}>
            <div className="black-capacity2">
                <a href="/" className='back'><span className="material-symbols-outlined">arrow_back</span></a>
                <div className={`login-border ${color}`}>
                    <h1>Login</h1>
                    <form onSubmit={login}>
                        <div className="input">
                            <label htmlFor='username' value='username'>Username</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="styled-input"
                            />
                            <p>{errors.name}</p>
                        </div>
                        <div className="input">
                            <label htmlFor='password' value='password'>Password</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="styled-input"
                            />
                            <p>{errors.password}</p>
                        </div>
                        <button>Login</button>
                        <a href="/register">don't have an account?</a>
                    </form>
                </div>
            </div>
       </div>
    );
};

export default LoginPage;