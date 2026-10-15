
import { useState } from 'react';

import { useAdminData } from './hooks/useAdminData';
import AdminTable from './components/AdminTable';
import AdminForm from './components/AdminForm';

import type { AdminSection } from '../../types/admin';

import './AdminDashboard.css';

type AdminDashboardProps = {
    token: string;
};

const sections: { id: AdminSection; label: string }[] = [
    { id: 'students', label: 'Elevi' },
    { id: 'teachers', label: 'Profesori' },
    { id: 'classes', label: 'Clase' },
    { id: 'subjects', label: 'Materii' },
    { id: 'assignments', label: 'Repartizări' },
];

export default function AdminDashboard({
    token,
}: AdminDashboardProps) {
    const [section, setSection] = useState<AdminSection>('students');
    const [showForm, setShowForm] = useState(false);

    const {
        records,
        classes,
        teachers,
        subjects,
        loading,
        error,
        refresh,
    } = useAdminData(section, token);

    const currentLabel =
        sections.find((item) => item.id === section)?.label ?? '';

    function handleSectionChange(nextSection: AdminSection) {
        setSection(nextSection);
        setShowForm(false);
    }

    function handleCreateSuccess() {
        setShowForm(false);
        refresh();
    }

    return (
        <section className="admin-dashboard">
            <div className="admin-heading">
                <h2>Panou de administrare</h2>
                <p>Gestionează datele catalogului electronic.</p>
            </div>

            <nav
                className="admin-navigation"
                aria-label="Secțiuni administrator"
            >
                {sections.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={section === item.id ? 'active' : ''}
                        aria-current={
                            section === item.id ? 'page' : undefined
                        }
                        onClick={() => handleSectionChange(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="admin-panel">
                <div className="admin-panel-heading">
                    <div>
                        <h3>{currentLabel}</h3>
                        <p>
                            Înregistrări existente:{' '}
                            {loading ? '...' : records.length}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-primary-button"
                        onClick={() => setShowForm((previous) => !previous)}
                    >
                        {showForm ? 'Închide formularul' : '+ Adaugă'}
                    </button>
                </div>

                {showForm && (
                    <AdminForm
                        key={section}
                        section={section}
                        token={token}
                        classes={classes}
                        teachers={teachers}
                        subjects={subjects}
                        onSuccess={handleCreateSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {loading ? (
                    <p>Se încarcă datele...</p>
                ) : error ? (
                    <p className="admin-error" role="alert">
                        {error}
                    </p>
                ) : (
                    <AdminTable
                        section={section}
                        records={records}
                        classes={classes}
                        teachers={teachers}
                        subjects={subjects}
                    />
                )}
            </div>
        </section>
    );
}
