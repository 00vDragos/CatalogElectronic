import type { TeachingAssignment } from '../../types/teacher';

type AssignmentListProps = {
    assignments: TeachingAssignment[];
    selectedAssignment: TeachingAssignment | null;
    onSelect: (assignment: TeachingAssignment) => void;
};

export default function AssignmentList({
    assignments,
    selectedAssignment,
    onSelect,
}: AssignmentListProps) {
    return (
        <div className="assignments-grid">
            {assignments.map((assignment) => (
                <button
                    type="button"
                    key={assignment.id}
                    className={`assignment-card ${selectedAssignment?.id === assignment.id
                            ? 'selected'
                            : ''
                        }`}
                    onClick={() => onSelect(assignment)}
                    aria-pressed={selectedAssignment?.id === assignment.id}
                >
                    <h3>{assignment.schoolClass.name}</h3>
                    <p>{assignment.subject.name}</p>
                    <span>{assignment.schoolClass.schoolYear}</span>
                </button>
            ))}
        </div>
    );
}