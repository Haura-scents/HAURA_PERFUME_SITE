import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useId } from "react";

const FIELD_CLASSES =
  "w-full rounded-sm border border-ink-mute bg-ink-soft px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-mute focus:border-gold focus:outline-none transition-colors";

type LabelledProps = {
  label: string;
  error?: string;
  className?: string;
};

function FieldWrapper({
  label,
  error,
  htmlFor,
  className = "",
  children,
}: LabelledProps & { htmlFor: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-eyebrow mb-2 block text-on-dark-mute">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Input({
  label,
  error,
  className,
  ...rest
}: LabelledProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <FieldWrapper label={label} error={error} htmlFor={id} className={className}>
      <input
        id={id}
        className={`${FIELD_CLASSES} ${error ? "border-danger" : ""}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  error,
  className,
  ...rest
}: LabelledProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <FieldWrapper label={label} error={error} htmlFor={id} className={className}>
      <textarea
        id={id}
        rows={4}
        className={`${FIELD_CLASSES} resize-y ${error ? "border-danger" : ""}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function Select({
  label,
  error,
  className,
  children,
  ...rest
}: LabelledProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <FieldWrapper label={label} error={error} htmlFor={id} className={className}>
      <select
        id={id}
        className={`${FIELD_CLASSES} ${error ? "border-danger" : ""}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}
