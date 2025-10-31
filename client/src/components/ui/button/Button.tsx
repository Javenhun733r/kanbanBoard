import React, { type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'submit';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	variant?: ButtonVariant;
	isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'primary',
	isLoading = false,
	className = '',
	disabled,
	...rest
}) => {
	const baseStyles =
		'px-3 py-1 rounded text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed';

	const variantStyles = {
		primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
		secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
		ghost:
			'text-gray-500 hover:text-gray-700 bg-transparent px-0 py-0 font-normal',
		submit: isLoading
			? 'bg-gray-400 text-white'
			: 'bg-indigo-600 text-white hover:bg-indigo-700',
	};

	const finalClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

	return (
		<button
			className={finalClassName}
			disabled={disabled || isLoading}
			{...rest}
		>
			{isLoading && variant === 'submit' ? 'Creating...' : children}
		</button>
	);
};

export default React.memo(Button);
