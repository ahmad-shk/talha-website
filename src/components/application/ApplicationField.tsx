"use client";

import type { ApplicationField as ApplicationFieldConfig } from "@/lib/services";

const controlClass = "h-11 w-full rounded-[var(--fm-radius-md)] border bg-[var(--fm-graphite-deep)] px-3 text-sm text-[var(--fm-text-primary)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--fm-motion-micro)] placeholder:text-[var(--fm-text-tertiary)] focus:border-[var(--fm-lime)] focus:ring-2 focus:ring-[var(--fm-lime-soft)]";
const optionClass = "flex w-full items-start gap-3 rounded-[var(--fm-radius-lg)] border p-4 text-left transition-[border-color,background-color,transform] duration-[var(--fm-motion-micro)]";

type ApplicationFieldProps = {
  field: ApplicationFieldConfig;
  value: unknown;
  answers?: Record<string, unknown>;
  onChange: (value: unknown) => void;
  error?: string;
};

function conditionMatches(field: ApplicationFieldConfig, answers: Record<string, unknown>) {
  if (!field.condition) return true;
  const actual = answers[field.condition.field];
  if (field.condition.equals !== undefined) return actual === field.condition.equals;
  if (field.condition.notEquals !== undefined) return actual !== field.condition.notEquals;
  return true;
}

function FieldControl({ field, value, onChange, error, answers }: ApplicationFieldProps) {
  const stringValue = typeof value === "string" ? value : "";
  const classes = `${controlClass} ${error ? "border-[var(--fm-danger)]" : "border-[var(--fm-border)]"}`;
  const renderOptions = () => field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>);

  if (!conditionMatches(field, answers ?? {})) return null;

  if (field.type === "repeatable") {
    const items = Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object") : [];
    const itemFields = field.itemFields ?? [];
    const updateItem = (index: number, key: string, nextValue: unknown) => {
      const next = items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: nextValue } : item);
      onChange(next);
    };
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[var(--fm-text-primary)]">Member {index + 1}</p>
              <button type="button" className="text-sm text-[var(--fm-text-tertiary)] hover:text-[var(--fm-danger)]" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
            </div>
            <div className="space-y-5">
              {itemFields.map((itemField) => (
                <FieldControl
                  key={itemField.key}
                  field={itemField}
                  value={item[itemField.key]}
                  answers={item}
                  onChange={(nextValue) => updateItem(index, itemField.key, nextValue)}
                />
              ))}
            </div>
          </div>
        ))}
        <button type="button" className="rounded-[var(--fm-radius-md)] border border-dashed border-[var(--fm-border-accent)] px-4 py-3 text-sm font-medium text-[var(--fm-lime-bright)] transition-colors hover:bg-[var(--fm-lime-soft)]" onClick={() => onChange([...items, {}])}>
          + Add member
        </button>
      </div>
    );
  }

  return (
    <>
      {field.type === "textarea" && <textarea value={stringValue} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} minLength={field.validation?.minLength} maxLength={field.validation?.maxLength} rows={5} className={`${classes} h-auto min-h-28 py-2.5`} />}
      {(field.type === "select" || field.type === "state") && <select value={stringValue} onChange={(e) => onChange(e.target.value)} className={`${classes} appearance-none`}><option value="">{field.type === "state" ? "Select a state" : "Select an option"}</option>{renderOptions()}</select>}
      {field.type === "country" && <input type="text" value={stringValue} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? "Enter your country"} className={classes} />}
      {field.type === "text" && <input type="text" value={stringValue} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} minLength={field.validation?.minLength} maxLength={field.validation?.maxLength} className={classes} />}
      {field.type === "number" && <input type="number" value={value === undefined || value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} min={field.validation?.min} max={field.validation?.max} className={classes} />}
      {field.type === "date" && <input type="date" value={stringValue} onChange={(e) => onChange(e.target.value)} className={classes} />}
      {field.type === "radio" && <div className="space-y-3">{field.options?.map((option) => { const selected = stringValue === option.value; return <button key={option.value} type="button" onClick={() => onChange(option.value)} className={`${optionClass} ${selected ? "border-[var(--fm-border-accent)] bg-[var(--fm-lime-soft)]" : "border-[var(--fm-border)] bg-[var(--fm-surface)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]"}`}><span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[var(--fm-lime)]" : "border-[var(--fm-border)]"}`}>{selected && <span className="size-2.5 rounded-full bg-[var(--fm-lime)]" />}</span><span><span className="block text-sm font-medium text-[var(--fm-text-primary)]">{option.label}</span>{option.description && <span className="mt-1 block text-sm leading-5 text-[var(--fm-text-tertiary)]">{option.description}</span>}</span></button> })}</div>}
      {field.type === "checkbox" && <div className="space-y-3">{field.options?.map((option) => { const selected = Array.isArray(value) && value.includes(option.value); return <button key={option.value} type="button" onClick={() => { const current = Array.isArray(value) ? value : []; onChange(selected ? current.filter((item) => item !== option.value) : [...current, option.value]); }} className={`${optionClass} items-center ${selected ? "border-[var(--fm-border-accent)] bg-[var(--fm-lime-soft)]" : "border-[var(--fm-border)] bg-[var(--fm-surface)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]"}`}><span className={`flex size-5 shrink-0 items-center justify-center rounded-[var(--fm-radius-sm)] border text-xs ${selected ? "border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]" : "border-[var(--fm-border)] text-transparent"}`}>✓</span><span className="text-sm font-medium text-[var(--fm-text-primary)]">{option.label}</span></button> })}</div>}
    </>
  );
}

export default function ApplicationField({ field, value, answers = {}, onChange, error }: ApplicationFieldProps) {
  if (!conditionMatches(field, answers)) return null;
  return (
    <div className="space-y-2.5">
      <label className="block">
        <span className="text-sm font-medium text-[var(--fm-text-primary)]">{field.label}{field.required && <span className="ml-1 text-[var(--fm-danger)]">*</span>}</span>
        {field.description && <span className="mt-1 block text-sm leading-6 text-[var(--fm-text-tertiary)]">{field.description}</span>}
      </label>
      <FieldControl field={field} value={value} answers={answers} onChange={onChange} error={error} />
      {error && <p className="text-sm text-[var(--fm-danger)]" role="alert">{error}</p>}
    </div>
  );
}
