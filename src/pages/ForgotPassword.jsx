import React, { useState } from 'react';
import api from '../services/api'; // Assurez-vous que le chemin est correct

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitted(false);

        if (!email) {
            setError('Veuillez entrer votre adresse e-mail.');
            return;
        }

        try {
            // Remplacez l'URL par celle de votre backend
            const response = await api.post('/forgot-password', {
                email: email,
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur.', err);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
            <h2>Mot de passe oublié</h2>
            {submitted ? (
                <div style={{ color: 'green' }}>
                    Si cet e-mail existe, un lien de réinitialisation a été envoyé.
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label htmlFor="email">Adresse e-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ width: '100%', padding: 8, marginTop: 4 }}
                            required
                        />
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                    <button type="submit" style={{ padding: '8px 16px' }}>
                        Envoyer le lien de réinitialisation
                    </button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;