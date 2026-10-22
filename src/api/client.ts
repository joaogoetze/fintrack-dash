import { toast } from "sonner";
import { z } from "zod";

import { useAuthStore } from "../stores/authStore";
import { SessionExpiredError } from "../utils/errors";

const API_BASE = "https://api-fintrack.joaogoetze.com.br";
//const API_BASE = "http://localhost:3001";

async function request(
    path: string,
    options: RequestInit = {}
) {
    const { token, activeWorkspaceId } = useAuthStore.getState();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (activeWorkspaceId) {
        headers["x-workspace-id"] = String(activeWorkspaceId);
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });


    const data = await response.json();

    if (response.status === 401 && token) {
        if (useAuthStore.getState().token) {
            useAuthStore.getState().logout();
            toast.error("Sessão expirada. Faça login novamente.");
        }
        throw new SessionExpiredError();
    }

    if (!response.ok) {
        const message =
            (typeof data?.message === "string" && data.message) ||
            (typeof data?.error === "string" && data.error) ||
            "Erro inesperado";
        throw new Error(message);
    }

    return data;
}

function validate<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        console.error("Erro de validação Zod:", result.error.issues);

        throw new Error(
            result.error.issues
                .map(issue => `${issue.path.join(".")}: ${issue.message}`)
                .join(", ")
        );
    }

    return result.data;
}

export const api = {
    get<T>(
        path: string,
        responseSchema?: z.ZodSchema<T>
    ) {
        return request(path).then(data =>
            responseSchema
                ? validate(responseSchema, data)
                : data as T
        );
    },

    post<T>(
        path: string,
        body: unknown,
        requestSchema?: z.ZodSchema,
        responseSchema?: z.ZodSchema<T>
    ) {
        const validatedBody = requestSchema
            ? validate(requestSchema, body)
            : body;

        return request(path, {
            method: "POST",
            body: JSON.stringify(validatedBody),
        }).then(data =>
            responseSchema
                ? validate(responseSchema, data)
                : data as T
        );
    },

    put<T>(
        path: string,
        body: unknown,
        requestSchema?: z.ZodSchema,
        responseSchema?: z.ZodSchema<T>
    ) {
        const validatedBody = requestSchema
            ? validate(requestSchema, body)
            : body;

        return request(path, {
            method: "PUT",
            body: JSON.stringify(validatedBody),
        }).then(data =>
            responseSchema
                ? validate(responseSchema, data)
                : data as T
        );
    },

    delete<T>(
        path: string,
        responseSchema?: z.ZodSchema<T>
    ) {
        return request(path, {
            method: "DELETE",
        }).then(data =>
            responseSchema
                ? validate(responseSchema, data)
                : data as T
        );
    },
};