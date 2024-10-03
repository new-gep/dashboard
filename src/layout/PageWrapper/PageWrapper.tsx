import React, { useLayoutEffect, forwardRef, ReactElement, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { ISubHeaderProps } from '../SubHeader/SubHeader';
import { IPageProps } from '../Page/Page';
import AuthContext from '../../contexts/authContext';
import { demoPagesMenu } from '../../menu';

interface IPageWrapperProps {
	isProtected?: boolean;
	title?: string;
	description?: string;
	children:
		| ReactElement<ISubHeaderProps>[]
		| ReactElement<IPageProps>
		| ReactElement<IPageProps>[];
	className?: string;
}
const PageWrapper = forwardRef<HTMLDivElement, IPageWrapperProps>(
	({ isProtected, title, description, className, children }, ref) => {
		useLayoutEffect(() => {
			// @ts-ignore
			document.getElementsByTagName('TITLE')[0].text = `${title ? `${title} | ` : ''}${
				process.env.REACT_APP_SITE_NAME
			}`;
			// @ts-ignore
			document
				?.querySelector('meta[name="description"]')
				.setAttribute('content', description || process.env.REACT_APP_META_DESC || '');
		});

		// Acessando o token e o estado de autenticação do AuthContext
		const { token, isAuthenticated } = useContext(AuthContext);

		const navigate = useNavigate();
		
		useEffect(() => {
			// Verifica se a página é protegida e se o usuário não está autenticado (token inválido)
			if (isProtected && !isAuthenticated) {
				navigate(`../${demoPagesMenu.login.path}`); // Redireciona para a página de login se o token for inválido
			}
		}, [isProtected, isAuthenticated, navigate]);

		return (
			<div ref={ref} className={classNames('page-wrapper', 'container-fluid', className)}>
				{children}
			</div>
		);
	},
);

PageWrapper.displayName = 'PageWrapper';

PageWrapper.propTypes = {
	isProtected: PropTypes.bool,
	title: PropTypes.string,
	description: PropTypes.string,
	// @ts-ignore
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

PageWrapper.defaultProps = {
	isProtected: true,
	title: undefined,
	description: undefined,
	className: undefined,
};

export default PageWrapper;
