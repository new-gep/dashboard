import React, { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export interface IAuthContextProps {
	token: string;
	setToken: (token: string) => void;
	isAuthenticated: boolean;
	userData: any;
}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
	children: ReactNode;
}

// Função para verificar o token na API
const verifyTokenWithAPI = async (token: string) => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API}user/verifyToken/${token}`);
		
		if (response.status === 200) {
			return response.data; // Retorna os dados do usuário se o token for válido
		} else {
			return null; // Token inválido
		}
	} catch (error) {
		console.error('Erro ao verificar token:', error);
		return null; // Em caso de erro na verificação
	}
};

export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	const navigate = useNavigate();
	const handleLogin = useCallback(() => 
		navigate('/auth-pages/login'), [navigate]
	);
	// Gerencia o estado do token
	const [token, setToken] = useState<string>(localStorage.getItem('gep_authToken') || '');
	const [userData, setUserData] = useState<any>({});
	const isAuthenticated = !!token; // Verifica se o token existe para validar o login

	// Efeito para salvar o token no localStorage quando ele muda
	useEffect(() => {
		if (token) {
			localStorage.setItem('gep_authToken', token);
		} else {
			localStorage.removeItem('gep_authToken');
		}
	}, [token]);

	// Efeito para buscar os dados do usuário na API quando o token é definido
	useEffect(() => {
		const fetchUserData = async () => {
			try{
				if (token !== '') {
					const userData = await verifyTokenWithAPI(token);
					switch (userData.status) {
						case 400:
							setUserData({});
							setToken('')
							localStorage.removeItem('gep_authToken');
							handleLogin()
							break;
						case 200:
							setUserData(userData.dates);
							break;
						default:
							localStorage.removeItem('gep_authToken');
							setUserData({});
							setToken(''); // Limpa o token se for inválido
							handleLogin()
							break;
					}
				} else {
					setUserData({});
					console.log('go login 2')
					handleLogin()
				}
			}catch(e){
				console.log('erro Context:', e)
				setUserData({});
				setToken(''); // Limpa o token se for inválido
				handleLogin()
			}
		};
		fetchUserData();
	}, [token]);

	// Memoize para evitar re-renderizações desnecessárias
	const value = useMemo(
		() => ({
			token,
			setToken,
			isAuthenticated,
			userData,
		}),
		[token, isAuthenticated, userData],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthContext;
