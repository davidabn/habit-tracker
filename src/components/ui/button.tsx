import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold
      rounded-full transition-all duration-fast ease-apple
      focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(0,122,255,0.3)]
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `;

    const variants = {
      primary: 'bg-apple-blue text-white hover:opacity-90',
      secondary: 'bg-[rgba(0,122,255,0.1)] text-apple-blue hover:bg-[rgba(0,122,255,0.15)]',
      ghost: 'text-apple-blue hover:bg-gray-6',
      danger: 'bg-apple-red text-white hover:opacity-90',
    };

    const sizes = {
      sm: 'min-h-[36px] px-4 text-subhead',
      md: 'min-h-44 px-6 text-body',
      lg: 'min-h-[50px] px-8 text-body',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Carregando...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
