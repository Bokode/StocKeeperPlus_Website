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
            const errorBody = await response.json().catch(() => ({ 
                // Message de secours si le corps n'est pas JSON
                message: `Erreur réseau ${response.status} sur ${endpoint}` 
            }));

            throw new Error(JSON.stringify(errorBody));
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

export function errorMessageHandling(errorObj) {
    let finalMessage = errorObj.message || "Une erreur est survenue";
    const details = errorObj.details;

    if (details && Array.isArray(details) && details.length > 0) {
        
        finalMessage += "\n\nDétails :\n";

        details.forEach(element => {
            finalMessage += `- ${element.message}\n`;
        });
    }

    return finalMessage;
}