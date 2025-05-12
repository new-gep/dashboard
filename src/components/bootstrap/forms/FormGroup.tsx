import React, { cloneElement, FC, HTMLAttributes, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TagWrapper from '../../TagWrapper';
import Label from './Label';
import FormText from './FormText';

interface IFormGroupProps extends HTMLAttributes<HTMLElement> {
	children: ReactElement | ReactElement[];
	className?: string;
	labelClassName?: string;
	childWrapperClassName?: string;
	tag?: 'div' | 'section';
	isFloating?: boolean;
	id?: string;
	label?: string;
	size?: 'lg' | 'sm' | null;
	isHiddenLabel?: boolean;
	isColForLabel?: boolean;
	formText?: ReactNode;
}

const FormGroup: FC<IFormGroupProps> = ({
	children,
	tag,
	className,
	labelClassName,
	childWrapperClassName,
	label,
	id,
	isFloating,
	size,
	isColForLabel,
	isHiddenLabel,
	formText,
	...props
}) => {
	const LABEL = (
		<Label
			className={labelClassName}
			htmlFor={id}
			isHidden={isHiddenLabel}
			isColForLabel={isColForLabel}
			size={size}>
			{label}
		</Label>
	);

	const CHILDREN =
		id && !Array.isArray(children)
			? cloneElement(children, {
				//@ts-ignore
					id,
					//@ts-ignore
					size: size || children?.props.size,
					//@ts-ignore
					placeholder: isFloating ? label : children.props.placeholder,
					'aria-describedby': formText ? `${id}-text` : null,
					//@ts-ignore
					mask: children?.props.mask || undefined, // Passa a máscara se estiver usando InputMask
					//@ts-ignore
					alwaysShowMask: children?.props.alwaysShowMask || false, // Caso esteja configurado no InputMask
				})
			: children;

	const FORM_TEXT = formText && <FormText id={`${id}-text`}>{formText}</FormText>;

	return (
		<TagWrapper
			tag={tag}
			className={classNames({ 'form-floating': isFloating, row: isColForLabel }, className)}
			{...props}>
			{label && !isFloating && LABEL}

			{childWrapperClassName ? (
				<div className={childWrapperClassName}>
					{CHILDREN}
					{FORM_TEXT}
				</div>
			) : (
				CHILDREN
			)}

			{label && isFloating && LABEL}

			{!childWrapperClassName && FORM_TEXT}
		</TagWrapper>
	);
};

FormGroup.propTypes = {
	// @ts-ignore
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	labelClassName: PropTypes.string,
	childWrapperClassName: PropTypes.string,
	tag: PropTypes.oneOf(['div', 'section']),
	isFloating: PropTypes.bool,
	id: PropTypes.string,
	label: PropTypes.string,
	size: PropTypes.oneOf([null, 'lg', 'sm']),
	isHiddenLabel: PropTypes.bool,
	isColForLabel: PropTypes.bool,
	// @ts-ignore
	// eslint-disable-next-line react/require-default-props
	formText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
//@ts-ignore
FormGroup.defaultProps = {
	className: undefined,
	labelClassName: undefined,
	childWrapperClassName: undefined,
	tag: 'div',
	isFloating: false,
	id: undefined,
	label: undefined,
	size: null,
	isHiddenLabel: false,
	isColForLabel: false,
	formText: undefined,
};

export default FormGroup;
