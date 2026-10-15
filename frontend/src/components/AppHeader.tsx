import './AppHeader.css';

type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

type AppHeaderProps = {
    role: UserRole;
    onLogout: () => void;
};

const roleLabels: Record<UserRole, string> = {
    ADMIN: 'Administrator',
    TEACHER: 'Profesor',
    STUDENT: 'Elev',
};

export default function AppHeader({
    role,
    onLogout,
}: AppHeaderProps) {
    return (
        <header className="app-header">
            <div className="app-header-inner">
                <div className="app-brand">
                    <div className="app-brand-icon" aria-hidden="true">
                        🎓
                    </div>

                    <div className="app-brand-text">
                        <h1>Catalog Electronic</h1>
                        <span>Platformă de management școlar</span>
                    </div>
                </div>

                <div className="app-header-actions">
                    <span className="app-role">
                        {roleLabels[role]}
                    </span>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={onLogout}
                    >
                        <span aria-hidden="true">↪</span>
                        Deconectare
                    </button>
                </div>
            </div>
        </header>
    );
}