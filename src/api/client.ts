//const API_BASE = 'https://api-fintrack.joaogoetze.com.br';
const API_BASE = 'http://localhost:3001';

async function request(
    path: string,
    options: RequestInit = {}
) {
    //const token = await getToken();

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            // Authorization: token ? `Bearer ${token}` : "",
            // ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export const api = {
    get(path: string) {
        return request(path);
    },

    post(path: string, body: unknown) {
        return request(path, {
            method: "POST",
            body: JSON.stringify(body),
        });
    },

    put(path: string, body: unknown) {
        return request(path, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    },

    delete(path: string) {
        return request(path, {
            method: "DELETE",
        });
    },
};