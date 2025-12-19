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
                
                message: `Erreur réseau ${response.status}` 
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
    localStorage.removeItem('isAuthenticated');
    window.location.href = `/login?redirect${encodeURIComponent(window.location.pathname)}`;
}

export function errorMessageHandling(error) {
  
  if (typeof error === "string") {
    return {
      message: error,
      details: []
    };
  }

  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message);
      return errorMessageHandling(parsed);
    } catch {
      return {
        message: error.message || "Une erreur est survenue",
        details: []
      };
    }
  }

  if (error && typeof error === "object") {
    return {
      message: error.message || "Une erreur est survenue",
      details: Array.isArray(error.details) ? error.details : []
    };
  }
  return {
    message: "Une erreur est survenue",
    details: []
  };
}

