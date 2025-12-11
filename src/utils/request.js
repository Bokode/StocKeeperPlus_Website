export async function authFetch(endpoint, option = {}) {
    const config = {
        ...option,
        headers: {
            'Content-Type': 'application/json',
            ...option.headers
        },
        credentials: 'include',
    };

    try 
    {
        const response = await fetch(endpoint, config);

        if (response.status === 401 || response.status === 403)
        {
            handleSessionExpiry();
            throw new Error('Session expirée');
        }
        if (!response.ok) 
        {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || 'Erreur réseau');
        }
        return response;
    }
    catch (error)
    {
        throw error;
    }
}

function handleSessionExpiry()
{
    window.location.href = `/login?redirect${encodeURIComponent(window.location.pathname)}`;
}
