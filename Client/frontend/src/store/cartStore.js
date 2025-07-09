import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],


            addToCart: (item) => set((state) => {
                // console.log("item", item);

                const exists = state.cart ? state.cart.find((itm) => itm && itm._id === item._id && itm.color === item.color) : false;

                if (exists) {
                    const updatedCart = state.cart.map((val) => {
                        if (val._id === item._id) {
                            const quantity = typeof val.quantity === 'number' ? val.quantity : 0;
                            return { ...val, quantity: quantity + 1 };
                        }
                        return val;
                    });
                    return { cart: updatedCart };
                }

                else {
                    // console.log("Item added to cart", item);

                    return (
                        { cart: [...state.cart, { ...item, quantity: 1 }] }
                    )
                }
            })
            ,

            removeFromCart: (_id, item) => {
                const { cart } = get()

                set(
                    (state) => ({ cart: state.cart.filter((val) => !(_id == val._id && (val.color == item.color))) })
                )
            },
            updateQuantity: (_id, item, newQuantity) => set(
                (state) => ({
                    cart: state.cart.map((val) =>
                        (val._id === _id && val.color === item.color) ? { ...val, quantity: newQuantity } : val
                    )
                })),

            clearCart: () => set((state) => ({ cart: [] })),

            getCartTotal: () => {
                const { cart } = get();


                return cart.reduce((prev, next) => prev + (next.discountedPrice * next.quantity), 0)
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