import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/authSlice';
import './AuthForm.css';

const AuthForm = ({ isLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(loginFailure(null));
	}, [isLogin, dispatch]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(loginStart());

		const url = isLogin ? '/api/login' : '/api/register';
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Invalid credentials');
			}

			dispatch(loginSuccess({ token: data.token, user: { email } }));
			navigate('/dashboard');
		} catch (error) {
			console.error('An error occurred:', error);
			dispatch(loginFailure(error.message));
		}
	};

	if (loading) {
		return <div className="auth-form-container"><div className="auth-form">Loading...</div></div>;
	}

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="auth-form-container">
			<form className="auth-form" onSubmit={handleSubmit}>
				<h2>{isLogin ? 'Login' : 'Register'}</h2>
				{error && <div className="error-message">{error}</div>}
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">{isLogin ? 'Login' : 'Register'}</button>
				<p className="switch-auth">
					{isLogin ? "Don't have an account? " : "Already have an account? "}
					<Link to={isLogin ? "/register" : "/login"}>
						{isLogin ? 'Register' : 'Login'}
					</Link>
				</p>
			</form>
		</div>
	);
};

export default AuthForm;
