export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (
    typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api/v1'
        : '/api/v1'
);

async function parseResponse(response: Response) {
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || result.message || 'Something went wrong.');
    return result;
}

export const companyApi = {
    registerCompany: async (data: { companyName: string; email: string; contactNumber: string }) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        return parseResponse(response);
    },
    requestLoginOtp: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email })
        });
        return parseResponse(response);
    },
    verifyOtp: async (email: string, otp: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, otp })
        });
        return parseResponse(response);
    }
};

export interface EventCompanyRegistration {
    companyName: string;
    email: string;
}

export interface EventCompanyDetails {
    email: string;
    designation: string;
    institute: string;
    phoneNumber: string;
}

// Companies attending the meet, brought by an institute — separate from the
// legacy recruiter/JAF flow in `companyApi` above.
export const eventCompanyApi = {
    register: async (data: EventCompanyRegistration) => {
        const response = await fetch(`${API_BASE_URL}/companies/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return parseResponse(response);
    },
    verifyOtp: async (email: string, otp: string) => {
        const response = await fetch(`${API_BASE_URL}/companies/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        return parseResponse(response);
    },
    complete: async (data: EventCompanyDetails) => {
        const response = await fetch(`${API_BASE_URL}/companies/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return parseResponse(response);
    }
};
