import type { Student } from '../../types/teacher';

type StudentsTableProps = {
    students: Student[];
    loading: boolean;
    error: string;
    onSelectStudent: (student: Student) => void;
};

export default function StudentsTable({
    students,
    loading,
    error,
    onSelectStudent,
}: StudentsTableProps) {
    if (loading) {
        return <p>Se încarcă elevii...</p>;
    }

    if (error) {
        return <p className="login-error">{error}</p>;
    }

    if (students.length === 0) {
        return <p>Nu există elevi în această clasă.</p>;
    }

    return (
        <table className="students-table">
            <thead>
                <tr>
                    <th>Nr.</th>
                    <th>Nume elev</th>
                    <th>Acțiune</th>
                </tr>
            </thead>

            <tbody>
                {students.map((student, index) => (
                    <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>{student.lastName} {student.firstName}</td>
                        <td>
                            <button
                                type="button"
                                onClick={() => onSelectStudent(student)}
                            >
                                Vezi notele
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}