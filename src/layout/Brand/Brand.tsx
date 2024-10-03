import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../../components/icon/Icon';
import Logo from '../../assets/logo/logo_yellow.png';

interface IBrandProps {
	asideStatus: boolean;
	setAsideStatus(...args: unknown[]): unknown;
}
const Brand: FC<IBrandProps> = ({ asideStatus, setAsideStatus }) => {
	return (
		<div className='brand'>
			<div className='brand-logo'>
				<Link to='/' aria-label='Logo' className='row items-center justify-content-center mt-3'>
					<img 
						src={Logo}
						style={{height:'70%', width:'70%', objectFit: 'contain'}}
					/>
				</Link>
			</div>
			<button
				type='button'
				className='btn brand-aside-toggle'
				aria-label='Toggle Aside'
				onClick={() => setAsideStatus(!asideStatus)}>
				<Icon icon='FirstPage' className='brand-aside-toggle-close' style={{ color: '#ffee07' }} />
				<Icon icon='LastPage' className='brand-aside-toggle-open'   style={{ color: '#ffee07' }} />
			</button>
		</div>
	);
};
Brand.propTypes = {
	asideStatus: PropTypes.bool.isRequired,
	setAsideStatus: PropTypes.func.isRequired,
};

export default Brand;
