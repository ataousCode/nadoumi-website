import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(function Input(
  {
    type = "text",
    label,
    id,
    name,
    value,
    onChange,
    error,
    required = false,
    placeholder,
    options = [],
    rows = 4,
    accept,
    multiple = false,
    className = "",
    disabled = false,
    icon,
    checked,
    ...props
  },
  ref
) {
  const inputId = id || name;
  const hasError = Boolean(error);

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (type === "date") return "YYYY-MM-DD";
    if (type === "email") return "example@email.com";
    if (type === "tel") return "+1234567890";
    if (type === "password") return "••••••••";
    return undefined;
  };

  const baseClasses = cn(
    "block w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:bg-white",
    icon && "pl-11",
    hasError
      ? "border-red-200 bg-red-50/10 focus:ring-red-500/10"
      : props.isValid
      ? "border-green-200 bg-green-50/10 focus:ring-green-500/10"
      : "border-gray-100 focus:ring-orange-500/5 focus:border-orange-500/20",
    disabled && "bg-gray-100 cursor-not-allowed opacity-50",
  );

  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (Array.isArray(error)) return error[0]?.message || error[0];
    if (typeof error === 'object') return error.message || JSON.stringify(error);
    return null;
  };

  const errorMessage = getErrorMessage();

  // ── Checkbox ─────────────────────────────────────────────────────────────
  if (type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          defaultChecked={props.defaultChecked}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {required && " *"}
          </label>
        )}
        {errorMessage && <p className="ml-2 text-sm text-red-600">{errorMessage}</p>}
      </div>
    );
  }

  // ── Textarea ──────────────────────────────────────────────────────────────
  if (type === "textarea") {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 font-sans">
            {label}
            {required && " *"}
          </label>
        )}
        <div className="mt-1 relative group">
          <textarea
            ref={ref}
            id={inputId}
            name={name}
            className={cn(baseClasses, className)}
            rows={rows}
            value={value !== undefined ? value : undefined}
            onChange={onChange}
            placeholder={getPlaceholder()}
            disabled={disabled}
            {...props}
          />
        </div>
        {errorMessage && <p className="mt-1.5 text-[11px] text-red-500 font-bold uppercase tracking-wider px-1">{errorMessage}</p>}
      </div>
    );
  }

  // ── Select ────────────────────────────────────────────────────────────────
  if (type === "select") {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 font-sans">
            {label}
            {required && " *"}
          </label>
        )}
        <div className="mt-1 relative group">
          <select
            ref={ref}
            id={inputId}
            name={name}
            className={cn(baseClasses, className)}
            value={value !== undefined ? value : undefined}
            onChange={onChange}
            disabled={disabled}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {errorMessage && <p className="mt-1.5 text-[11px] text-red-500 font-bold uppercase tracking-wider px-1">{errorMessage}</p>}
      </div>
    );
  }

  // ── File ──────────────────────────────────────────────────────────────────
  if (type === "file") {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 font-sans">
            {label}
            {required && " *"}
          </label>
        )}
        <div className="mt-1">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="file"
            className={cn(baseClasses, className)}
            accept={accept}
            multiple={multiple}
            onChange={onChange}
            disabled={disabled}
            {...props}
          />
        </div>
        {errorMessage && <p className="mt-1.5 text-[11px] text-red-500 font-bold uppercase tracking-wider px-1">{errorMessage}</p>}
      </div>
    );
  }

  // ── Default (text / email / number / date / password / tel) ──────────────
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 font-sans">
          {label}
          {required && " *"}
        </label>
      )}
      <div className="mt-1 relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors duration-300">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          className={cn(baseClasses, className)}
          value={value !== undefined ? value : undefined}
          onChange={onChange}
          placeholder={getPlaceholder()}
          disabled={disabled}
          {...props}
        />
        {props.isValid && !hasError && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none animate-in fade-in zoom-in duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {errorMessage && <p className="mt-1.5 text-[11px] text-red-500 font-bold uppercase tracking-wider px-1">{errorMessage}</p>}
    </div>
  );
});

export default Input;
