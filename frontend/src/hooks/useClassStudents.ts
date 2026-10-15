import { useEffect, useState } from 'react';

import { getClassStudents } from '../services/teacherService';
import type { Student } from '../types/teacher';

export function useClassStudents(
    token: string,
    classId: number | null,
) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [studentsError, setStudentsError] = useState('');

    useEffect(() => {
        if (classId === null) {
            return;
        }

        const controller = new AbortController();

        async function loadStudents() {
            setLoadingStudents(true);
            setStudentsError('');
            setStudents([]);

            try {
                const data = await getClassStudents(
                    classId!,
                    token,
                    controller.signal,
                );

                if (!controller.signal.aborted) {
                    setStudents(data.students);
                }
            } catch (error) {
                if (controller.signal.aborted) return;

                setStudentsError(
                    error instanceof Error
                        ? error.message
                        : 'A apărut o eroare.',
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingStudents(false);
                }
            }
        }

        void loadStudents();

        return () => controller.abort();
    }, [classId, token]);

    return { students, loadingStudents, studentsError };
}