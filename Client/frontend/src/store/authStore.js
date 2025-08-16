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

                verify2FAEmail: async (code) => {

                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/verify-2FA-email`, { code });
                        set({ user: response.data.updatedUser, isAuthenticated: true, isLoading: false })
                        return response.data
                    } catch (error) {
                        set({ error: error.response.data.message || "Error Verifying Email", isLoading: false })
                        throw error;
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

                deleteAccount: async () => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/delete-account`)
                        set({ user: null, isAuthenticated: false, error: null, isLoading: false })
                    } catch (error) {
                        set({ error: "Error in Delete Account", isLoading: false })
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
                        set({ message: response.data.message, isLoading: false })
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error in add product"
                        });
                        throw error;

                    }
                },

                deleteProduct: async (prodId) => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.delete(`${API_URL}/api/seller/delete-product`,
                            {
                                data: { prodId }
                            }
                        )
                        set({ message: response.data.message, isLoading: false })
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || "Error in deleting product"
                        });
                        throw error;

                    }
                },

                getProducts: async (data) => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        // console.log("Hola Amigo");

                        const response = await axios.get(`${API_URL}/api/product/get-products`);
                        set({
                            message: response.data.message, isLoading: false, prods: response.data.products

                        })
                        return response.data.products
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

                },


                toggleProductActiveStatus: async (prodId) => {
                    set({ isLoading: true, error: null, message: null });

                    try {
                        const response = await axios.put(`${API_URL}/api/product/change-product-status`, { prodId });

                        set({ isLoading: false, error: null, message: response.data.message, prods: response.data.allProds });
                        console.log("All Prods : ", response.data.allProds);

                        return response.data.updatedProd;
                    } catch (error) {
                        console.log("error in auth store toggleProductActiveStatus");
                        set({ isLoading: false, error: error.response.data.message });
                        throw error;
                    }
                },

                reviewProduct: async (data) => {

                    set({ isLoading: true, error: null, message: null });

                    try {
                        const response = await axios.put(`${API_URL}/api/product/review-product`, data);

                        set({ isLoading: false, error: null, message: response.data.message, prods: response.data.allProd });

                        return response.data.product;
                    } catch (error) {
                        console.log("error in auth store reviewProduct ");
                        set({ isLoading: false, error: error.response.data.message });
                        throw error;
                    }
                },
                toggleWishlist: async (id) => {
                    set({ error: null, message: null });
                    try {
                        console.log(id);

                        const response = await axios.put(`${API_URL}/api/product/toggle-wishlist`, { prodId: id });

                        set({ error: null, message: response.data.message, user: response.data.updatedUser });
                    } catch (error) {
                        console.log("error in auth store toggleWishlist ", error.message);
                        set({ error: error?.response?.data?.message || "Something went wrong while toggling wishlist" });
                        throw error;
                    }


                },
                markNotificationRead: async () => {
                    set({ isLoading: true, error: null, message: null });
                    try {
                        const response = await axios.put(`${API_URL}/api/auth/mark-notification-read`);

                        set({ isLoading: false, error: null, message: response.data.message, user: response.data.updateUser });
                    } catch (error) {
                        set({ isLoading: false, error: error?.response?.data?.message || "Something went wrong while making notification read" });
                        throw error;
                    }

                },

                updateUserProfile: async (data) => {
                    // /update-profile
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.put(`${API_URL}/api/auth/update-profile`, data);
                        set({ isLoading: false, error: null, message: response.data.message, user: response.data.user });
                    } catch (error) {
                        set({ isLoading: false, error: error?.response?.data?.message || "Something went wrong while Updating Profile" });
                        throw error;
                    }
                },
                changePassword: async (data) => {
                    set({ isLoading: true, error: null, message: null });
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/change-password`, data);
                        set({
                            isLoading: false,
                            error: null,
                            message: response.data.message
                        });

                        return {
                            successInProcess: response.data.success,
                            message: response.data.message
                        };
                    } catch (error) {
                        const errorMessage = error?.response?.data?.message || "Error in change Password";
                        set({
                            isLoading: false,
                            error: errorMessage,
                            message: null
                        });

                        return {
                            successInProcess: false,
                            message: errorMessage
                        };
                    }
                },
                toggle2FA: async () => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/toggle-2FA`);
                        set({ isLoading: false, message: response.data.message, user: response.data.updatedUser })
                        return { isSuccess: response.data.success, message: response.data.message, twoFAStatus: response.data.updatedUser.is2FA };
                    } catch (error) {
                        const errorMessage = error?.response?.data?.message || "Error in toggle 2FA";
                        set({
                            isLoading: false,
                            error: null,
                            message: errorMessage
                        });
                        return { isSuccess: false, message: errorMessage, twoFAStatus: error.response.data.updatedUser.is2FA };

                    }
                },
                checkLoginCredentials: async (data) => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/check-login-credentials`, data);
                        set({ isLoading: false, message: response.data.message, user: response.data.user })
                        return { isSuccess: response.data.success, message: response.data.message, user: response.data.user };
                    } catch (error) {
                        const errorMessage = error?.response?.data?.message || "Error in checking Login Credentials";
                        set({
                            isLoading: false,
                            error: null,
                            message: errorMessage
                        });
                        return { isSuccess: false, message: errorMessage };

                    }

                },

                changeEmailPasswordvalidation: async (data) => {
                    set({ isLoading: true, error: null, message: null });
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/change-email-validation`, data);
                        set({ isLoading: false, message: response.data.message })
                        return { isSuccess: response.data.success, message: response.data.message };
                    } catch (error) {
                        const errorMessage = error?.response?.data?.message || "Error in checking Change Mail check validations";
                        set({
                            isLoading: false,
                            error: errorMessage,
                            message: errorMessage
                        });
                        return { isSuccess: false, message: errorMessage };

                    }

                },
                verifyNewEmail: async (code, newEmail) => {
                    set({ isLoading: true, error: null, message: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/auth/new-email-verification`, { code, newEmail });
                        set({ user: response.data.updatedUser, isAuthenticated: true, isLoading: false })
                        return response.data
                    } catch (error) {
                        set({ error: error.response.data.message || "Error Verifying Email", isLoading: false })
                        throw error;
                    }
                }

            }
        ),
        {
            name: "auth-store",
            partialize: (state) => ({ user: state.user })
        }
    )
)
