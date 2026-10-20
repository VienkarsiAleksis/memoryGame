import './index.scss';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LevelPage = () => {

    const numLevels = 20;
    const levels = Array.from({ length: numLevels }, (_, index) => index + 1);
    const navigate = useNavigate();
    const token = Cookies.get('name');
    const userID = Cookies.get('id');
    const [levelDB, setLevelDB] = useState([]);

    const userName = Cookies.get('name');
    const color = Cookies.get('theam');

    const handleLogout = () => {
        Cookies.remove('name');
        Cookies.remove('id');
        navigate('/');
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchHighestScores = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/user/${userID}/highest-scores`);
                setLevelDB(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching highest scores:', error);
                setLevelDB([]);
            }
        };

        fetchHighestScores();
    }, [userID]);

    console.log(levelDB);

    return (
        <div className={`levelPage ${color}`}>
            <div className='black-capacity'>
                <div className={`border ${color}`}>
                    <div className="navbar">
                        <a href="/">Home</a>
                        {userName && <button onClick={handleLogout}>Logout</button>}
                        {!userName && <a href="/login">Login</a>}
                        {userName && <a href={`/profile/${userID}`}>Profile</a>}
                        {userName && <a href="/shop">Shop</a>}
                        <h1>mind`F`er</h1>
                    </div>
                    <div className="level-grid">
                        {levels.map((level, index) => {
                            const levelDataExists = levelDB.find(levelData => levelData.level === String(level));
                            return (
                                <div className='level' key={level}>
                                    <a href={`level/${level}`} className='level'>{level}.</a>
                                    {levelDataExists && (
                                        <p key={levelDataExists.id}>({levelDataExists.highest_score})</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelPage;
