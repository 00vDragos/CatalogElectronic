import { useState } from 'react';

import { useTeacherAssignments } from '../../hooks/useTeacherAssignments';
import { useClassStudents } from '../../hooks/useClassStudents';

import type { TeachingAssignment } from '../../types/teacher';

import AssignmentList from './AssignmentList';
import StudentsTable from './StudentsTable';

import StudentGrades from './StudentsGrades.tsx';
import type { Student } from '../../types/teacher';

import './TeacherDashboard.css';

type TeacherDashboardProps = {
    token: string;
};

export default function TeacherDashboard({
    token,
}: TeacherDashboardProps) {
    const { teacher, loading, error } = useTeacherAssignments(token);

    const [selectedAssignment, setSelectedAssignment] = useState<TeachingAssignment | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const classId = selectedAssignment?.schoolClass.id ?? null;

    const { students, loadingStudents, studentsError } =
        useClassStudents(token, classId);

    if (loading) {
        return <p>Se încarcă repartizările...</p>;
    }

    if (error) {
        return <p className="login-error">{error}</p>;
    }

    return (
        <section className="teacher-dashboard">
            <h2>
                Bine ai venit, {teacher?.firstName} {teacher?.lastName}!
            </h2>

            <div className="teacher-workspace">
                <aside className="teacher-sidebar">
                    <h3>Clasele și materiile mele</h3>

                    <AssignmentList
                        assignments={teacher?.assignments ?? []}
                        selectedAssignment={selectedAssignment}
                        onSelect={(assignment) => {
                            setSelectedAssignment(assignment);
                            setSelectedStudent(null);
                        }}
                    />
                </aside>

                <div className="teacher-content">
                    {selectedAssignment ? (
                        <>
                            <h3>
                                {selectedAssignment.schoolClass.name} —{' '}
                                {selectedAssignment.subject.name}
                            </h3>

                            {selectedStudent ? (
                                <StudentGrades
                                    key={`${selectedStudent.id}-${selectedAssignment.id}`}
                                    student={selectedStudent}
                                    subjectId={selectedAssignment.subject.id}
                                    assignmentId={selectedAssignment.id}
                                    token={token}
                                    onClose={() => setSelectedStudent(null)}
                                />
                            ) : (
                                <StudentsTable
                                    students={students}
                                    loading={loadingStudents}
                                    error={studentsError}
                                    onSelectStudent={setSelectedStudent}
                                />
                            )}
                        </>
                    ) : (
                        <div className="dashboard-placeholder">
                            <h3>Selectează o clasă</h3>
                            <p>
                                Alege o clasă și o materie din stânga
                                pentru a deschide catalogul.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}