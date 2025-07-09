import { create } from 'zustand'; //zustand : state management lib
import axios from 'axios';
import { persist } from 'zustand/middleware'


const API_URL = "http://localhost:3000"

axios.defaults.withCredentials = true // to just put cookies to the req header
export const useAuthStore = create(
    persist(
        (set) => (
            {
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
                isCheckingAuth: true,
                message: null,
                prods: [],



                signup: async (email, password, name) => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/signup`, { email, password, name })
                        set({ user: response.data.user, isAuthenticated: true, isLoading: false })
                    } catch (error) {
                        set({ error: error.response.data.message || "Error Signing Up", isLoading: false })
                        throw error;
                    }
                },

                login: async (email, password) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/login`, { email, password })
                        set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null })
                    } catch (error) {
                        set({ error: error.response?.data?.message || "Error logging in", isLoading: false })
                        throw error
                    }
                },

                logout: async () => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/logout`)
                        set({ user: null, isAuthenticated: false, error: null, isLoading: false })
                    } catch (error) {
                        set({ error: "Error logging out", isLoading: false })
                        throw error
                    }
                },



                verifyEmail: async (code) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/verify-email`, { code });
                        set({ user: response.data.user, isAuthenticated: true, isLoading: false })
                        return response.data
                    } catch (error) {
                        set({ error: error.response.data.message || "Error Verifying Email", isLoading: false })
                        throw error;
                    }
                },


                checkingAuth: async () => {
                    set({ isCheckingAuth: true, error: null })
                    try {
                        const response = await axios.get(`${API_URL}/api/auth/check-auth`);
                        set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false })
                    } catch (error) {
                        set({ error: null, isCheckingAuth: false, isAuthenticated: false })
                    }
                },

                forgotPassword: async (email) => {
                    set({ isLoading: true, error: null, message: null });

                    try {
                        const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
                        set({ message: response.data.message, isLoading: false })
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response.data.message || "Error sending reset password email"
                        })
                        throw error
                    }
                },

                resetPassword: async (token, password) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password })
                        set({ message: response.data.message, isLoading: false })
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response.data.message || "Error resetting password"
                        })
                        throw error
                    }
                },

                uploadUserImage: async (data) => {
                    set({ isLoading: true, error: null })
                    try {

                        const response = await axios.put(`${API_URL}/api/auth/save-user-image`, data);
                        set({ message: response.data.message, isLoading: false, user: response.data.user });
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error saving user image"
                        });
                        throw error;
                    }
                },

                saveOnboardData: async (data) => {
                    set({ isLoading: true, error: null })
                    try {

                        const response = await axios.put(`${API_URL}/api/auth/save-onboarding-data`, data);
                        set({ message: response.data.message, isLoading: false, user: response.data.user });
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error saving on board data"
                        });
                        throw error;
                    }
                },

                becomeSeller: async (data) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/seller/become-seller`, data)
                        set({ message: response.data.message, isLoading: false, user: response.data.user })
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error in process if becoming user"
                        });
                        throw error;

                    }
                },

                addProduct: async (data) => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/seller/add-product`, data)
                        set({ message: response.data.message, isLoading: false, user: response.data.user })
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error in process if becoming user"
                        });
                        throw error;

                    }
                },

                getProducts: async (data) => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.get(`${API_URL}/api/product/get-products`);
                        set({
                            message: response.data.message, isLoading: false, prods: response.data.products

                        })
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error in process if becoming user"
                        });
                        throw error;
                    }
                },

                getSingleProduct: async (id) => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.get(`${API_URL}/api/seller/product/${id}`)


                        set({
                            message: response.data.message, isLoading: false
                        })
                        return response.data.product
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error in fetching single product"
                        });
                        throw error;
                    }
                },
                updateProduct: async (id, data) => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.patch(`${API_URL}/api/seller/update-product/${id}`, data)
                        set({ isLoading: false, message: response.data.message, prods: response.data.prods })
                        return response.data.updated_prod
                    } catch (error) {
                        console.log(error);
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error in updating the product"
                        })
                        throw error;

                    }
                },

                getSalesDetails: async () => {

                }

            }
        ),
        {
            name: "auth-store",
            partialize: (state) => ({ prods: state.prods, user: state.user })
        }
    )
)
