
import { useCallback, useEffect, useState } from 'react';

import { getAdminData } from '../../../services/adminService';

import type {
    AdminData,
    AdminSection,
    SchoolClass,
    Teacher,
    Subject,
} from '../../../types/admin';

export function useAdminData(section: AdminSection, token: string) {
    const [records, setRecords] =
        useState<AdminData[AdminSection]>([]);

    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = useCallback(() => {
        setRefreshKey((previous) => previous + 1);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function loadRecords() {
            setLoading(true);
            setError('');
            setRecords([]);

            try {
                const result = await getAdminData(
                    section,
                    token,
                    controller.signal,
                );

                if (!controller.signal.aborted) {
                    setRecords(result);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Eroare la încărcarea datelor.',
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadRecords();

        return () => controller.abort();
    }, [section, token, refreshKey]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadOptions() {
            try {
                const [classData, teacherData, subjectData] =
                    await Promise.all([
                        getAdminData('classes', token, controller.signal),
                        getAdminData('teachers', token, controller.signal),
                        getAdminData('subjects', token, controller.signal),
                    ]);

                if (!controller.signal.aborted) {
                    setClasses(classData);
                    setTeachers(teacherData);
                    setSubjects(subjectData);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Nu am putut încărca opțiunile formularelor.',
                    );
                }
            }
        }

        void loadOptions();

        return () => controller.abort();
    }, [token, refreshKey]);

    return {
        records,
        classes,
        teachers,
        subjects,
        loading,
        error,
        refresh,
    };
}
