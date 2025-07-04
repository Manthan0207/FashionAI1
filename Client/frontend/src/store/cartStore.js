import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],


            addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),

            removeFromCart: (_id) => set(
                (state) => ({ cart: state.cart.filter((val) => _id != val._id) })
            ),
            updateQuantity: (_id, newQuantity) => set(
                (state) => ({
                    cart: state.cart.map((val) =>
                        val._id === _id ? { ...val, quantity: newQuantity } : val
                    )
                })),

            clearCart: () => set((state) => ({ cart: [] })),

            getCartTotal: () => {
                const { cart } = get();
                return cart.reduce((prev, next) => prev + (next.discountedPrice * (next.quantity ? next.quantity : 1)), 0)
            },

            getCartCount: () => {
                const { cart } = get()
                return cart.length
            }



        }),
        {
            name: 'cart'
        }
    )
)