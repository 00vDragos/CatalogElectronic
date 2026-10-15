
import { useState, type FormEvent } from 'react';

import { createAdminRecord } from '../../../services/adminService';

import {
    emptyAdminForm,
    type AdminFormData,
    type AdminSection,
    type SchoolClass,
    type Teacher,
    type Subject,
} from '../../../types/admin';

type AdminFormProps = {
    section: AdminSection;
    token: string;
    classes: SchoolClass[];
    teachers: Teacher[];
    subjects: Subject[];
    onSuccess: () => void;
    onCancel: () => void;
};

export default function AdminForm({
    section,
    token,
    classes,
    teachers,
    subjects,
    onSuccess,
    onCancel,
}: AdminFormProps) {
    const [form, setForm] = useState<AdminFormData>({
        ...emptyAdminForm,
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    function updateField(field: keyof AdminFormData, value: string) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function textField(
        label: string,
        field: keyof AdminFormData,
        type = 'text',
        required = true,
    ) {
        return (
            <label className="admin-field" key={field}>
                <span>{label}</span>

                <input
                    type={type}
                    value={form[field]}
                    onChange={(event) =>
                        updateField(field, event.target.value)
                    }
                    required={required}
                />
            </label>
        );
    }

    function selectField(
        label: string,
        field: 'classId' | 'teacherId' | 'subjectId',
        options: { id: number; label: string }[],
    ) {
        return (
            <label className="admin-field" key={field}>
                <span>{label}</span>

                <select
                    value={form[field]}
                    onChange={(event) =>
                        updateField(field, event.target.value)
                    }
                    required
                >
                    <option value="">Selectează...</option>

                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    const classOptions = classes.map((item) => ({
        id: item.id,
        label: `${item.name} (${item.schoolYear})`,
    }));

    const teacherOptions = teachers.map((item) => ({
        id: item.id,
        label: `${item.firstName} ${item.lastName}`,
    }));

    const subjectOptions = subjects.map((item) => ({
        id: item.id,
        label: item.name,
    }));

    function renderFields() {
        switch (section) {
            case 'students':
                return (
                    <>
                        {textField('Prenume', 'firstName')}
                        {textField('Nume', 'lastName')}
                        {textField('Email', 'email', 'email')}
                        {textField('CNP / Identificator', 'cnp')}
                        {textField('Telefon (opțional)', 'phone', 'tel', false)}
                        {selectField('Clasă', 'classId', classOptions)}
                    </>
                );

            case 'teachers':
                return (
                    <>
                        {textField('Prenume', 'firstName')}
                        {textField('Nume', 'lastName')}
                        {textField('Email', 'email', 'email')}
                    </>
                );

            case 'classes':
                return (
                    <>
                        {textField('Denumirea clasei', 'name')}
                        {textField('An școlar', 'schoolYear')}
                    </>
                );

            case 'subjects':
                return textField('Denumirea materiei', 'name');

            case 'assignments':
                return (
                    <>
                        {selectField('Profesor', 'teacherId', teacherOptions)}
                        {selectField('Clasă', 'classId', classOptions)}
                        {selectField('Materie', 'subjectId', subjectOptions)}
                    </>
                );
        }
    }

    function buildPayload(): object {
        switch (section) {
            case 'students':
                return {
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    cnp: form.cnp.trim(),
                    ...(form.phone.trim()
                        ? { phone: form.phone.trim() }
                        : {}),
                    classId: Number(form.classId),
                };

            case 'teachers':
                return {
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                };

            case 'classes':
                return {
                    name: form.name.trim(),
                    schoolYear: form.schoolYear.trim(),
                };

            case 'subjects':
                return {
                    name: form.name.trim(),
                };

            case 'assignments':
                return {
                    teacherId: Number(form.teacherId),
                    classId: Number(form.classId),
                    subjectId: Number(form.subjectId),
                };
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (saving) return;

        setSaving(true);
        setError('');

        try {
            await createAdminRecord(section, buildPayload(), token);
            onSuccess();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'A apărut o eroare la salvare.',
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <h4>Adaugă înregistrare</h4>

            <div className="admin-form-grid">
                {renderFields()}
            </div>

            {error && (
                <p className="admin-error" role="alert">
                    {error}
                </p>
            )}

            <div className="admin-form-actions">
                <button
                    type="submit"
                    className="admin-primary-button"
                    disabled={saving}
                >
                    {saving ? 'Se salvează...' : 'Salvează'}
                </button>

                <button
                    type="button"
                    className="admin-cancel-button"
                    onClick={onCancel}
                    disabled={saving}
                >
                    Anulează
                </button>
            </div>
        </form>
    );
}
