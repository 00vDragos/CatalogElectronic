
import type {
    AdminData,
    AdminSection,
    SchoolClass,
    Teacher,
    Subject,
} from '../../../types/admin';

type AdminTableProps = {
    section: AdminSection;
    records: AdminData[AdminSection];
    classes: SchoolClass[];
    teachers: Teacher[];
    subjects: Subject[];
};

const headers: Record<AdminSection, string[]> = {
    students: ['ID', 'Elev', 'Email', 'Clasă'],
    teachers: ['ID', 'Profesor', 'Email'],
    classes: ['ID', 'Clasă', 'An școlar', 'Elevi'],
    subjects: ['ID', 'Materie'],
    assignments: ['ID', 'Profesor', 'Clasă', 'Materie'],
};

export default function AdminTable({
    section,
    records,
    classes,
    teachers,
    subjects,
}: AdminTableProps) {
    function renderRows() {
        switch (section) {
            case 'students':
                return (records as AdminData['students']).map((student) => (
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>
                            {student.lastName} {student.firstName}
                        </td>
                        <td>{student.email}</td>
                        <td>
                            {classes.find(
                                (schoolClass) =>
                                    schoolClass.id === student.classId,
                            )?.name ?? 'Neatribuit'}
                        </td>
                    </tr>
                ));

            case 'teachers':
                return (records as AdminData['teachers']).map((teacher) => (
                    <tr key={teacher.id}>
                        <td>{teacher.id}</td>
                        <td>
                            {teacher.lastName} {teacher.firstName}
                        </td>
                        <td>{teacher.email}</td>
                    </tr>
                ));

            case 'classes':
                return (records as AdminData['classes']).map((schoolClass) => (
                    <tr key={schoolClass.id}>
                        <td>{schoolClass.id}</td>
                        <td>{schoolClass.name}</td>
                        <td>{schoolClass.schoolYear}</td>
                        <td>{schoolClass._count?.students ?? '—'}</td>
                    </tr>
                ));

            case 'subjects':
                return (records as AdminData['subjects']).map((subject) => (
                    <tr key={subject.id}>
                        <td>{subject.id}</td>
                        <td>{subject.name}</td>
                    </tr>
                ));

            case 'assignments':
                return (records as AdminData['assignments']).map((assignment) => {
                    const teacher =
                        assignment.teacher ??
                        teachers.find(
                            (item) => item.id === assignment.teacherId,
                        );

                    const schoolClass =
                        assignment.schoolClass ??
                        classes.find(
                            (item) => item.id === assignment.classId,
                        );

                    const subject =
                        assignment.subject ??
                        subjects.find(
                            (item) => item.id === assignment.subjectId,
                        );

                    return (
                        <tr key={assignment.id}>
                            <td>{assignment.id}</td>
                            <td>
                                {teacher
                                    ? `${teacher.firstName} ${teacher.lastName}`
                                    : 'Profesor indisponibil'}
                            </td>
                            <td>
                                {schoolClass?.name ?? 'Clasă indisponibilă'}
                            </td>
                            <td>
                                {subject?.name ?? 'Materie indisponibilă'}
                            </td>
                        </tr>
                    );
                });
        }
    }

    return (
        <div className="admin-table-wrapper">
            <table className="admin-table">
                <thead>
                    <tr>
                        {headers[section].map((heading) => (
                            <th key={heading} scope="col">
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>{renderRows()}</tbody>
            </table>

            {records.length === 0 && (
                <p className="admin-empty">
                    Nu există înregistrări.
                </p>
            )}
        </div>
    );
}
