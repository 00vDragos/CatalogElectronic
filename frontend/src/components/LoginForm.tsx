import { useState, type FormEvent, } from 'react';
import './LoginForm.css';

type LoginFormProps = {
    onLogin: (token: string) => void;
};

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Email sau parolă incorectă.');
            }

            const data: { accessToken: string } = await response.json();
            onLogin(data.accessToken);


        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'A apărut o eroare.',
            );
        } finally {
            setLoading(false);
        }
    }
    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Bine ai venit!</h2>
            <p className="login-subtitle">
                Introdu datele contului pentru a continua.
            </p>

            <div className="form-group">
                <label htmlFor="email">Adresă de email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="profesor@school.ro"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Parolă</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Introdu parola"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button
                type="submit"
                className="login-button"
                disabled={loading}
            >
                {loading ? 'Se autentifică...' : 'Autentificare →'}
            </button>
        </form>
    );
}