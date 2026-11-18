
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";


export const getInfrastructureOverview = async () => {

    const response = await fetch(
        `${API_BASE_URL}/api/v1/overview`
    );

    if (!response.ok) {

        throw new Error(
            `API request failed: ${response.status}`
        );

    }

    return await response.json();

};
