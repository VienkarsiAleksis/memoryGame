import './index.scss';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {

    const { userID } = useParams();
    const userName = Cookies.get('name');
    const [errors, setError] = useState({});
    const navigate = useNavigate();
    const [password, setPassword] = useState(true);
    const [game, setGame] = useState(false);
    const [profile, setProfile] = useState(false);
    const [shopData, setShopData] = useState([]);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState({});

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const color = Cookies.get('theam');


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                await axios.get(`http://localhost:8000/api/users/${userID}`);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchUserData();
    }, [userID]);


    const handleLogout = () => {
        Cookies.remove('name');
        Cookies.remove('id');
        Cookies.remove('theam');
        navigate('/');
    };

    const handleProfileSettings = () => {
        setProfile(true);
        setPassword(false);
        setGame(false);
    };

    const handlePasswordChange = () => {
        setProfile(false);
        setPassword(true);
        setGame(false);
    };

    const handleGameSettings = () => {
        setProfile(false);
        setPassword(false);
        setGame(true);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post(`http://localhost:8000/api/users/${userID}/change-password`, {
                current_password: currentPassword,
                new_password: newPassword
            });

            setMsg({ success: 'Password changed successfully.' });
            setError({});

        } catch (error) {
            setMsg({});
            setError(error.response.data.error || {});
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`http://localhost:8000/api/user/${userID}/update`, {
                name: name,
                email: email
            });

            if (response.status === 200) {
                setMsg({ success: response.data });
                setError({});
            } else {
                setMsg({});
                setError(response.data.errors || {});
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors);
            } else {
                // setError({ message: 'An error occurred while updating user data.' });
            }
            console.error('Error updating user:', error.response.data);
            setError(errors => ({ ...errors, message: error.response.data.message }));
        }

        console.log( errors );
    };

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/shop/${userID}`);
                setShopData(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching shop data:', error);
                setShopData([]);
            }
        };
        fetchShopData();
    }, [userID]);

    const changeBackground = async (color) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/users/${userID}/theme`, { theam: color });
            console.log(response.data); 
            Cookies.set('theam', color);
            window.location.reload();
        } catch (error) {
            throw new Error(error.response.data.error || 'Failed to update theme');
        }
    };

    return (
        <div className={`profile ${color}`}>
            <div className="black-capacity">
                <div className={`border ${color}`}>
                    <div className="navbar">
                        <a href="/levels">Play now</a>
                        {!userName && <a href="/login">Login</a>}
                        {userName && <button onClick={handleLogout}>Logout</button>}
                        {userName && <a href={`/profile/${userID}`} style={{ color: "black" }}>Profile</a>}
                        {userName && <a href={`/shop`}>Shop</a>}
                        <h1>mind`F`er</h1>
                    </div>
                    <div className='profile-cont'>
                        <div className= 'options'>
                            <button className={`${color}-btn`} onClick={handleProfileSettings}>Profile settings</button>
                            <button className={`${color}-btn`} onClick={handlePasswordChange}>Password change</button>
                            <button className={`${color}-btn`} onClick={handleGameSettings}>Game Settings</button>
                        </div>
                        <div className="input-field">
                            {password && (
                                <form className= "password" onSubmit={handleChangePassword}>
                                    <div className="input">
                                        <label htmlFor='password' value='password'>Current password</label>
                                        <input 
                                            type="password"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            className="styled-input"
                                        />
                                        {errors.current_password && <p>{errors.current_password}</p>}
                                    </div>
                                    <div className="input">
                                        <label htmlFor='newPassword' value='newPassword'>New password</label>
                                        <input 
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="styled-input"
                                        />
                                        {errors.new_password && <p>{errors.new_password}</p>}
                                        {msg.success && <p>{msg.success}</p>}

                                    </div>
                                    <button type="submit">Save</button>
                                </form>
                            )}
                            {profile && (
                                <form className='profile' onSubmit={updateUser}>
                                     <div className="input">
                                        <label htmlFor='username'>new Username</label>
                                        <input 
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="styled-input"
                                        />
                                        {errors && errors.username && <p className="error">{errors.username}</p>}
                                    </div>

                                    <div className="input">
                                          <label htmlFor='email'>new Email</label>
                                        <input 
                                            type="text"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="styled-input"
                                        />
                                        {errors && errors.email && <p className="error">{errors.email}</p>} 
                                        {errors && errors.message && <p className="error">{errors.message}</p>}
                                    </div>
                                    <button type="submit">Save</button>
                                </form>
                            )}
                           {game && (
                            <div className="theam">
                                    <button onClick={() => changeBackground('yellow')}>
                                        <img src="https://images.squarespace-cdn.com/content/v1/6136fa570fcb4430259d7153/35ba01f2-b1ab-499d-ae68-feb6be481354/website+background.jpg" alt="Red Waves" />
                                    </button>
                                {shopData.some(item => item.color === 'red') && (
                                    <button onClick={() => changeBackground('red')}>
                                        <img src="https://t4.ftcdn.net/jpg/04/68/86/79/360_F_468867953_3BZvMPjAjY0k9KVtJJ8S0wm571MeVTd2.jpg" alt="Red Waves" />
                                    </button>
                                )}
                                {shopData.some(item => item.color === 'blue') && (
                                    <button onClick={() => changeBackground('blue')}>
                                        <img src="https://preview.redd.it/desktop-wallpaper-4k-wave-v0-0i5uvw692wu81.png?width=640&crop=smart&auto=webp&s=66f97abe7e1518266b0cf13e37761871a3fd900b" alt="Blue Waves" />
                                    </button>
                                )}
                                {shopData.some(item => item.color === 'green') && (
                                    <button onClick={() => changeBackground('green')}>
                                        <img src="https://wallpapercave.com/wp/wp9716264.jpg" alt="Green Waves" />
                                    </button>
                                )}
                                {shopData.some(item => item.color === 'pink') && (
                                    <button onClick={() => changeBackground('pink')}>
                                        <img src="https://www.bhmpics.com/downloads/pink-wave-wallpaper/51.aesthetic-minimalist-pink-waves-fdnoccjuijf7wkix.jpg" alt="Pink Waves" />
                                    </button>
                                )}
                            </div>
                        )}
                        </div>
                        {/* {userData ? (
                            <div>
                                <p>ID: {userData.id}</p>
                                <p>Name: {userData.name}</p>
                                <p>Email: {userData.email}</p>
                            </div>
                        ) : (
                            <p>Loading user data...</p>
                        )}
                        {error && <p>Error: {error}</p>} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;