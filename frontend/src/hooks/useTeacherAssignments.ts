import { useEffect, useState } from 'react';

import { getTeacherAssignments } from '../services/teacherService';
import type { TeacherData } from '../types/teacher';

export function useTeacherAssignments(token: string) {
    const [teacher, setTeacher] = useState<TeacherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadAssignments() {
            setLoading(true);
            setError('');

            try {
                const data = await getTeacherAssignments(
                    token,
                    controller.signal,
                );

                if (!controller.signal.aborted) {
                    setTeacher(data);
                }
            } catch (error) {
                if (controller.signal.aborted) return;

                setError(
                    error instanceof Error
                        ? error.message
                        : 'A apărut o eroare.',
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadAssignments();

        return () => controller.abort();
    }, [token]);

    return { teacher, loading, error };
}