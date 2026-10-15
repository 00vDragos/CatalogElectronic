export type TeachingAssignment = {
    id: number;
    schoolClass: {
        id: number;
        name: string;
        schoolYear: string;
    };
    subject: {
        id: number;
        name: string;
    };
};

export type TeacherData = {
    id: number;
    firstName: string;
    lastName: string;
    assignments: TeachingAssignment[];
};

export type Student = {
    id: number;
    firstName: string;
    lastName: string;
};

export type ClassStudentsResponse = {
    students: Student[];
};