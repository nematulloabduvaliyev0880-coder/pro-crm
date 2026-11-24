import { useEffect, useState } from 'react';
import { AlertCircle, Save } from 'lucide-react';
import Modal from './Modal';

// Reusable form dialog. Every page describes its fields as data.
export default function FormModal({
  open, title, subtitle, fields = [], initialValues = {}, onSubmit, onClose,
  submitLabel = 'Saqlash', size = 'max-w-2xl',
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setErrors({});
    }
    // initialValues is intentionally read only when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    fields.forEach((field) => {
      const value = values[field.name];
      if (field.required && (value === undefined || value === null || String(value).trim() === '')) {
        next[field.name] = `${field.label} to‘ldirilishi shart`;
      } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        next[field.name] = 'To‘g‘ri email manzil kiriting';
      } else if (field.type === 'number' && value !== '' && value !== undefined && Number(value) < 0) {
        next[field.name] = 'Manfiy qiymat kiritib bo‘lmaydi';
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = {};
    fields.forEach((field) => {
      let value = values[field.name];
      if (field.type === 'number') value = value === '' || value === undefined ? 0 : Number(value);
      if (typeof value === 'string') value = value.trim();
      payload[field.name] = value;
    });
    onSubmit(payload);
  };

  return (
    <Modal open={open} title={title} subtitle={subtitle} onClose={onClose} size={size}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
              <label className="label" htmlFor={`field-${field.name}`}>
                {field.label}{field.required && <span className="ml-0.5 text-rose-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  id={`field-${field.name}`}
                  className="input"
                  value={values[field.name] ?? ''}
                  onChange={(event) => setValue(field.name, event.target.value)}
                >
                  <option value="">Tanlang...</option>
                  {(field.options || []).map((option) => {
                    const val = typeof option === 'string' ? option : option.value;
                    const label = typeof option === 'string' ? option : option.label;
                    return <option key={val} value={val}>{label}</option>;
                  })}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={`field-${field.name}`}
                  className="input min-h-[90px] resize-y"
                  rows={field.rows || 3}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(event) => setValue(field.name, event.target.value)}
                />
              ) : (
                <input
                  id={`field-${field.name}`}
                  className="input"
                  type={field.type || 'text'}
                  min={field.min}
                  step={field.step}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(event) => setValue(field.name, event.target.value)}
                />
              )}
              {errors[field.name] && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                  <AlertCircle size={12} /> {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Bekor qilish</button>
          <button type="submit" className="btn-primary"><Save size={16} /> {submitLabel}</button>
        </div>
      </form>
    </Modal>
  );
}
