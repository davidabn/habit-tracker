import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-footnote font-medium text-label-secondary mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full min-h-44 px-4 py-3
            bg-bg-secondary rounded-md
            text-body text-label-primary placeholder:text-label-tertiary
            border-none outline-none
            transition-shadow duration-fast ease-apple
            focus:ring-4 focus:ring-[rgba(0,122,255,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'ring-2 ring-apple-red' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-2 text-footnote text-apple-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
