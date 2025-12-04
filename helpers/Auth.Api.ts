import axiosInstance from "@/lib/axiosIntance";


export const handleSignIn = async (data: { username: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/login/', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Sign in failed');
    }
}

export const handleSignup = async (data: { username: string; email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/register/', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Sign up failed');
    }
}
    
