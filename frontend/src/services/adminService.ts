
import type {
    AdminData,
    AdminSection,
} from '../types/admin';

const API_URL = 'http://localhost:3000';

export async function getAdminData<K extends AdminSection>(
    section: K,
    token: string,
    signal?: AbortSignal,
): Promise<AdminData[K]> {
    const endpoints: Record<AdminSection, string> = {
        students: '/students',
        teachers: '/teachers',
        classes: '/classes',
        subjects: '/subjects',
        assignments: '/assignments',
    };

    const response = await fetch(
        `${API_URL}${endpoints[section]}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            signal,
        },
    );

    if (!response.ok) {
        throw new Error('Nu am putut încărca informațiile.');
    }

    return response.json();
}

export async function createAdminRecord(
    section: AdminSection,
    data: object,
    token: string,
): Promise<void> {
    const endpoints: Record<AdminSection, string> = {
        students: '/students',
        teachers: '/teachers',
        classes: '/classes',
        subjects: '/subjects',
        assignments: '/assignments',
    };

    const response = await fetch(
        `${API_URL}${endpoints[section]}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message: unknown = result?.message;

        throw new Error(
            Array.isArray(message)
                ? message.join(', ')
                : typeof message === 'string'
                    ? message
                    : 'Nu am putut salva înregistrarea.',
        );
    }
}
