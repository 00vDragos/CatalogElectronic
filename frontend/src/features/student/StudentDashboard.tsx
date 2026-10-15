import { useMyGrades } from '../../hooks/useMyGrades';

import './StudentDashboard.css';

type StudentDashboardProps = {
    token: string;
};

export default function StudentDashboard({
    token,
}: StudentDashboardProps) {
    const { data, loading, error } = useMyGrades(token);

    if (loading) {
        return <p>Se încarcă notele...</p>;
    }

    if (error) {
        return <p className="student-error" role="alert">{error}</p>;
    }

    if (!data) {
        return <p>Nu există informații disponibile.</p>;
    }

    return (
        <section className="student-dashboard">
            <div className="student-heading">
                <div>
                    <h2>
                        Bine ai venit, {data.student.firstName}{' '}
                        {data.student.lastName}!
                    </h2>
                    <p>Catalogul tău școlar</p>
                </div>

                <div className="general-average-card">
                    <span>Media generală</span>
                    <strong>
                        {data.generalAverage !== null
                            ? data.generalAverage.toFixed(2)
                            : '—'}
                    </strong>
                </div>
            </div>

            <h3>Materiile mele</h3>

            {data.subjects.length === 0 ? (
                <div className="student-empty">
                    Nu ai încă note înregistrate.
                </div>
            ) : (
                <div className="subjects-grid">
                    {data.subjects.map((subject) => (
                        <article
                            className="subject-card"
                            key={subject.subjectId}
                        >
                            <div className="subject-card-header">
                                <h4>{subject.subjectName}</h4>

                                <div className="subject-average">
                                    {subject.average.toFixed(2)}
                                </div>
                            </div>

                            <p>Notele tale:</p>

                            <div className="student-grades-list">
                                {subject.grades.map((grade) => (
                                    <span
                                        className="student-grade"
                                        key={grade.id}
                                    >
                                        {grade.value}
                                    </span>
                                ))}
                            </div>

                            <span className="grades-count">
                                {subject.grades.length}{' '}
                                {subject.grades.length === 1
                                    ? 'notă'
                                    : 'note'}
                            </span>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}