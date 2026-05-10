import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import getData from "../services/useContext";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    API,
    setCart
  } = getData();

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const updatedCartItems = await Promise.all(
          cart.map(async (item) => {

            try {
              const imageResponse = await API.get(
                `/product/${item.id}/image`,
                {
                  responseType: "blob",
                }
              );

              const imageUrl = URL.createObjectURL(imageResponse.data);

              return { ...item, imageUrl, };
            } catch (error) {
              console.log("Image fetch failed", error);
              return {
                ...item,
                imageUrl:
                  "https://placehold.co/400x300?text=No+Image",
              };
            }
          })
        );

        setCartItems(updatedCartItems);
      } catch (error) {
        console.log("Cart fetch error", error);
      }
    };

    if (cart?.length > 0) {
      fetchCartProducts();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.cartQuantity,
      0
    );

    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.cartQuantity < item.quantity) {
          return {
            ...item,
            cartQuantity: item.cartQuantity + 1,
          };
        }
        alert("No more stock available");
      }

      return item;
    });

    setCart(updatedCart);
    setCartItems(updatedCart);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId
        ? {
          ...item,
          cartQuantity: Math.max(item.cartQuantity - 1, 1),
        }
        : item
    );

    setCart(updatedCart);
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    const updatedCart = cartItems.filter(
      (item) => item.id !== itemId
    );

    setCartItems(updatedCart);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const updatedProduct = {
          ...item,
          quantity: item.quantity - item.cartQuantity,
        };

        const formData = new FormData();
        formData.append(
          "product",
          new Blob(
            [JSON.stringify(updatedProduct)],
            {
              type: "application/json",
            }
          )
        );

        const imageBlob = await fetch(item.imageUrl).then((res) =>
          res.blob()
        );

        formData.append(
          "imageFile",
          imageBlob,
          item.imageName || "product.jpg"
        );

        await API.put(
          `/product/${item.id}`,
          formData
        );
      }

      alert("Checkout Successful");

      clearCart();
      setCartItems([]);
      setShowModal(false);

    } catch (error) {
      console.log(error);
      alert("Checkout Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-100">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-300">
              Your cart is empty
            </h2>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300"
                >
                  {/* Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-40 h-40 object-cover rounded-xl"
                  />

                  {/* Info */}
                  <div className="flex-1 dark:text-gray-300">
                    <h2 className="text-xl font-bold">
                      {item.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {item.brand}
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      ₹ {item.price}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleDecreaseQuantity(item.id)
                      }
                      className="w-10 h-10 bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-xl transition-colors duration-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {item.cartQuantity}
                    </span>
                    <button
                      onClick={() =>
                        handleIncreaseQuantity(item.id)
                      }
                      className="w-10 h-10 bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-xl transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    ₹ {item.price * item.cartQuantity}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      handleRemoveItem(item.id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-5">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Total: ₹ {totalPrice.toFixed(2)}
              </h2>
              <Button
                onClick={handleCheckout}
                className="px-10 py-3 rounded-2xl text-lg bg-indigo-600 hover:bg-indigo-700 border-none cursor-pointer"
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
