const API_URL = 'http://localhost:3000';

export type Grade = {
    id: number;
    value: number;
    createdAt: string;
};

export type SubjectGrades = {
    subjectId: number;
    subjectName: string;
    grades: Grade[];
    average: number;
};

export type StudentGradesResponse = {
    student: {
        id: number;
        firstName: string;
        lastName: string;
    };
    subjects: SubjectGrades[];
    generalAverage: number | null;
};

function authHeaders(token: string) {
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

export async function getStudentGrades(studentId: number, token: string) {
    const response = await fetch(
        `${API_URL}/students/${studentId}/grades`,
        { headers: authHeaders(token) },
    );

    if (!response.ok) {
        throw new Error('Nu am putut încărca notele.');
    }

    return (await response.json()) as StudentGradesResponse;
}

export async function createGrade(
    studentId: number,
    assignmentId: number,
    value: number,
    token: string,
) {
    const response = await fetch(`${API_URL}/grades`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ studentId, assignmentId, value }),
    });

    if (!response.ok) {
        throw new Error('Nu am putut adăuga nota.');
    }
}

export async function updateGrade(
    gradeId: number,
    value: number,
    token: string,
) {
    const response = await fetch(`${API_URL}/grades/${gradeId}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ value }),
    });

    if (!response.ok) {
        throw new Error('Nu am putut modifica nota.');
    }
}

export async function deleteGrade(gradeId: number, token: string) {
    const response = await fetch(`${API_URL}/grades/${gradeId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });

    if (!response.ok) {
        throw new Error('Nu am putut șterge nota.');
    }
}

export async function getMyGrades(
    token: string,
    signal?: AbortSignal,
): Promise<StudentGradesResponse> {
    const response = await fetch(`${API_URL}/grades/me`, {
        headers: authHeaders(token),
        signal,
    });

    if (!response.ok) {
        throw new Error('Nu am putut încărca notele tale.');
    }

    return response.json();
}