
export type Student = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    cnp?: string;
    phone?: string | null;
    classId: number | null;
};

export type Teacher = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userId?: number | null;
};

export type SchoolClass = {
    id: number;
    name: string;
    schoolYear: string;
    _count?: {
        students: number;
    };
};

export type Subject = {
    id: number;
    name: string;
};

export type Assignment = {
    id: number;

    teacherId: number;
    classId: number;
    subjectId: number;

    teacher?: Teacher;
    schoolClass?: SchoolClass;
    subject?: Subject;
};

export type AdminSection =
    | 'students'
    | 'teachers'
    | 'classes'
    | 'subjects'
    | 'assignments';

export type AdminData = {
    students: Student[];
    teachers: Teacher[];
    classes: SchoolClass[];
    subjects: Subject[];
    assignments: Assignment[];
};

export type AdminFormData = {
    firstName: string;
    lastName: string;
    email: string;
    cnp: string;
    phone: string;
    classId: string;
    name: string;
    schoolYear: string;
    teacherId: string;
    subjectId: string;
};

export const emptyAdminForm: AdminFormData = {
    firstName: '',
    lastName: '',
    email: '',
    cnp: '',
    phone: '',
    classId: '',
    name: '',
    schoolYear: '2026-2027',
    teacherId: '',
    subjectId: '',
};
