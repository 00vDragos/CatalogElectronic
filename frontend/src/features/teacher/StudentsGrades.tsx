import { useCallback, useEffect, useState } from 'react';

import {
    getStudentGrades,
    createGrade,
    updateGrade,
    deleteGrade,
} from '../../services/gradeService';

import type { StudentGradesResponse } from '../../services/gradeService';
import type { Student } from '../../types/teacher';

type StudentGradesProps = {
    student: Student;
    subjectId: number;
    assignmentId: number;
    token: string;
    onClose: () => void;
};

export default function StudentGrades({
    student,
    subjectId,
    assignmentId,
    token,
    onClose,
}: StudentGradesProps) {
    const [data, setData] = useState<StudentGradesResponse | null>(null);
    const [value, setValue] = useState(10);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadGrades = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const result = await getStudentGrades(student.id, token);
            setData(result);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Eroare necunoscută.',
            );
        } finally {
            setLoading(false);
        }
    }, [student.id, token]);

    useEffect(() => {
        void loadGrades();
    }, [loadGrades]);

    const subject = data?.subjects.find(
        (item) => item.subjectId === subjectId,
    );

    async function handleAddGrade() {
        setSaving(true);
        setError('');

        try {
            await createGrade(student.id, assignmentId, value, token);
            await loadGrades();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Eroare.');
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdateGrade(gradeId: number, currentValue: number) {
        const input = window.prompt('Noua notă (1-10):', String(currentValue));
        if (input === null) return;

        const newValue = Number(input);

        if (!Number.isInteger(newValue) || newValue < 1 || newValue > 10) {
            setError('Nota trebuie să fie un număr întreg între 1 și 10.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            await updateGrade(gradeId, newValue, token);
            await loadGrades();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Eroare.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteGrade(gradeId: number) {
        if (!window.confirm('Sigur vrei să ștergi această notă?')) return;

        setSaving(true);
        setError('');

        try {
            await deleteGrade(gradeId, token);
            await loadGrades();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Eroare.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="student-grades">
            <button type="button" onClick={onClose}>
                ← Înapoi la elevi
            </button>

            <h3>{student.lastName} {student.firstName}</h3>

            {loading && <p>Se încarcă notele...</p>}
            {error && <p className="login-error" role="alert">{error}</p>}

            {!loading && (
                <>
                    <h4>Note la materia selectată</h4>

                    {subject && subject.grades.length > 0 ? (
                        <>
                            <div className="grades-list">
                                {subject.grades.map((grade) => (
                                    <div className="grade-item" key={grade.id}>
                                        <strong>{grade.value}</strong>

                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={() =>
                                                void handleUpdateGrade(
                                                    grade.id,
                                                    grade.value,
                                                )
                                            }
                                        >
                                            Modifică
                                        </button>

                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={() =>
                                                void handleDeleteGrade(grade.id)
                                            }
                                        >
                                            Șterge
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <p><strong>Media materiei: {subject.average}</strong></p>
                        </>
                    ) : (
                        <p>Elevul nu are note la această materie.</p>
                    )}

                    <div className="add-grade">
                        <label htmlFor="grade-value">Notă nouă:</label>

                        <select
                            id="grade-value"
                            value={value}
                            onChange={(event) =>
                                setValue(Number(event.target.value))
                            }
                        >
                            {Array.from({ length: 10 }, (_, index) => index + 1)
                                .map((grade) => (
                                    <option key={grade} value={grade}>
                                        {grade}
                                    </option>
                                ))}
                        </select>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => void handleAddGrade()}
                        >
                            {saving ? 'Se salvează...' : 'Adaugă nota'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}