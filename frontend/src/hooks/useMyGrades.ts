import { useEffect, useState } from 'react';

import { getMyGrades } from '../services/gradeService';
import type { StudentGradesResponse } from '../services/gradeService';

export function useMyGrades(token: string) {
    const [data, setData] = useState<StudentGradesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadGrades() {
            setLoading(true);
            setError('');

            try {
                const result = await getMyGrades(
                    token,
                    controller.signal,
                );

                if (!controller.signal.aborted) {
                    setData(result);
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

        void loadGrades();

        return () => controller.abort();
    }, [token]);

    return { data, loading, error };
}