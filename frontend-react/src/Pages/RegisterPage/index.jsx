import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.scss';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState({});

    let color = "yellow";

    if (Cookies.get('theam')) {
        color = Cookies.get('theam');
    }


    const navigate = useNavigate();

    const Register = async (e) => {
        e.preventDefault();
    
        if (password !== repassword) {
            setErrors(errors => ({ ...errors, repassword: 'Passwords do not match' }));
            setErrors(errors => ({ ...errors, password: "" }));

            return; // Exit the function early if passwords don't match
        }
    
        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                name: name,
                email: email,
                password: password,
            });
            console.log(response);
            setMsg('Successfully registered');
            Cookies.set('name', name);
            navigate('/');
        } catch (error) {
            const responseBody = error.response?.data;
            const responseData = responseBody && typeof responseBody === 'object'
                ? responseBody
                : null;
            const fieldError = (field) => {
                const value = responseData?.[field];
                return Array.isArray(value) ? value[0] : value || '';
            };

            setErrors({
                name: fieldError('name'),
                email: fieldError('email'),
                password: fieldError('password'),
                repassword: !repassword.trim() ? 'The re-password field is required.' : '',
            });

            if (!error.response) {
                setMsg('Unable to reach the server. Check that the backend is running and try again.');
            } else if (!responseData || !Object.keys(responseData).length) {
                setMsg('Registration failed. Please try again.');
            }

            console.error('Error registering user:', error);
        }
    };
    
    // useEffect(() => {
    //     console.log('use effect');
    //     console.log(errors);
    // }, [errors]);
  
    return(
       <div className={`registerPage ${color}`}>
            <div className="black-capacity2">
            <a href="/" className='back'><span className="material-symbols-outlined">arrow_back</span></a>
                <div className={`register-border ${color}`}>
                    <h1>Register</h1>
                    <form onSubmit={Register}>
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
                            <label htmlFor='email' value='email'>E-mail</label>
                            <input 
                                type="text" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="styled-input"
                            />
                            <p>{errors.email}</p>
                        </div>

                        <div className="input">
                            <label htmlFor='password' value='password'>password</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="styled-input"
                            />
                            <p>{errors.password}</p>
                        </div>

                        <div className="input">
                            <label htmlFor='repassword' value='repassword'>re-password</label>
                            <input 
                                type="password"
                                value={repassword}
                                onChange={e => setRepassword(e.target.value)}
                                className="styled-input"
                            />
                            <p>{errors.repassword}</p>
                        </div>

                        <button>Register</button>
                        <p>{ msg }</p>
                        <a href="/login">already have an account?</a>
                    </form>
                </div>
            </div>
       </div>
    );
};

export default RegisterPage;