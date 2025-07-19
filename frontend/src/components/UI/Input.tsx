import clsx from "clsx";
import { cloneElement, type FormEvent, type ReactElement } from "react";

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  size?: string;
  inputClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
  inputWrapperClassName?: string;

  leftIcon?: ReactElement<any>;
  rightIcon?: ReactElement<any>;
  onRightIconClick?: () => void;
}

const sizeStyles: Record<string, string> = {
  sm: "text-sm px-2 py-1",
  md: "text-md px-3 py-2",
  lg: "text-lg px-4 py-3",
};

const Input: React.FC<InputProps> = ({
  label = "",
  type = "text",
  placeholder = "",
  value = "",
  name = "",
  onChange = () => {},
  size = "md",
  inputClassName = "",
  labelClassName = "",
  containerClassName = "",
  inputWrapperClassName = "",
  leftIcon,
  rightIcon,
  onRightIconClick,
}) => {
  const leftPadding = leftIcon ? "pl-10" : "";

  return (
    <div
      className={clsx(
        "flex justify-center flex-col w-full gap-1",
        containerClassName
      )}
    >
      {label && (
        <label htmlFor="customInput" className={clsx(labelClassName)}>
          {label}
        </label>
      )}
      <div className={clsx("relative w-full", inputWrapperClassName)}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {cloneElement(leftIcon, {
              className: "h-5 w-5 text-slate-400",
            })}
          </div>
        )}
        <input
          className={clsx(
            "w-full",
            leftPadding,
            inputClassName,
            sizeStyles[size]
          )}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          maxLength={100}
        />
        {rightIcon && (
          <button
            className={clsx(
              "absolute inset-y-0 right-0 flex items-center pr-3"
            )}
            onClick={(e: FormEvent) => {
              e.preventDefault();
              onRightIconClick?.();
            }}
          >
            {cloneElement(rightIcon, {
              className: "h-5 w-5 text-slate-500 cursor-pointer",
            })}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
