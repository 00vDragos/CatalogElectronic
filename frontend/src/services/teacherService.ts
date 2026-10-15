import type {
    TeacherData,
    ClassStudentsResponse,
} from '../types/teacher';

const API_URL = 'http://localhost:3000';

export async function getTeacherAssignments(
    token: string,
    signal?: AbortSignal,
): Promise<TeacherData> {
    const response = await fetch(
        `${API_URL}/teachers/me/assignments`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            signal,
        },
    );

    if (!response.ok) {
        throw new Error('Nu am putut încărca repartizările.');
    }

    return response.json();
}

export async function getClassStudents(
    classId: number,
    token: string,
    signal?: AbortSignal,
): Promise<ClassStudentsResponse> {
    const response = await fetch(
        `${API_URL}/classes/${classId}/students`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            signal,
        },
    );

    if (!response.ok) {
        throw new Error('Nu am putut încărca elevii.');
    }

    return response.json();
}