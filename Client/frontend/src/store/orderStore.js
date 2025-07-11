import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const API_URL = "http://localhost:3000"

export const useOrderStore = create(
    persist(
        (set) => (
            {
                userOrder: null,
                isLoading: false,
                error: null,
                message: null,
                allOrders: null,

                placeOrder: async (data) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.post(`${API_URL}/api/product/place-order`, data)
                        set({ isLoading: false, userOrder: response.data.orders, message: response.data.message })
                        console.log("Hi");

                    } catch (error) {
                        console.log("Error in placeOrder in useOrderStore");
                        set({
                            isLoading: false, error: error.response?.data?.message || error.message || "Something went wrong"
                        })
                        throw error;

                    }
                },

                clearUserOrder: async () => {
                    set({ userOrder: null })
                },

                getAllOrders: async () => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await axios.get(`${API_URL}/api/product/get-all-orders`);
                        set({ isLoading: false, allOrders: response.data.orders, message: response.data.message })
                    } catch (error) {
                        console.log("Error in getAllOrders in order store");
                        set({ isLoading: false, message: error.response.data.message })


                    }
                },

                geSalesDetails: async () => {
                    set({ isLoading: true, message: null, error: null })
                    try {
                        const response = await axios.get("http://localhost:3000/api/auth/seller-data");
                        set({ isLoading: false, message: response.data.message })


                        return response.data.sellerSalesItems;

                    } catch (error) {
                        console.log("Error in geSalesDetails in orderStore");
                        set({ isLoading: false, error: error.response.data.message })
                        throw error;

                    }
                }
            }
        ),
        {
            name: "order-store"
        }
    )
)