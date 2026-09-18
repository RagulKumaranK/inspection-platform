import React, { useRef, useEffect } from 'react';

const OTPInput = ({
    length = 6,
    value = '',
    onChange,
    disabled = false,
    error = false,
}) => {
    const inputRefs = useRef([]);

    useEffect(() => {
        // Auto-focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, e) => {
        const val = e.target.value;

        // Only allow numbers
        if (val && !/^\d+$/.test(val)) return;

        const newValue = value.split('');
        newValue[index] = val.slice(-1); // Take only the last character
        const newOTP = newValue.join('');

        onChange(newOTP);

        // Auto-advance to next input
        if (val && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                // If current input is empty, move to previous input
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newValue = value.split('');
                newValue[index] = '';
                onChange(newValue.join(''));
            }
        }
        // Handle left arrow
        else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Handle right arrow
        else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, length);

        // Only allow numbers
        if (!/^\d+$/.test(pastedData)) return;

        onChange(pastedData);

        // Focus the next empty input or the last input
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    return (
        <div className="flex gap-2 tablet8:gap-3 justify-center">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`
            w-12 h-12 tablet8:w-14 tablet8:h-14
            text-center text-xl tablet8:text-2xl font-semibold
            rounded-lg border-2
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-all duration-200
            disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
            ${error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-primary-500'
                        }
          `}
                />
            ))}
        </div>
    );
};

export default OTPInput;
