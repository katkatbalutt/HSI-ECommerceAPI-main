import { useEffect, useState } from "react";

export default function Cart() {

    const [cart, setCart] = useState([]);

    useEffect(() => {

        loadCart();

    }, []);

    const loadCart = () => {

        const savedCart = JSON.parse(
            localStorage.getItem("cart")
        ) || [];

        setCart(savedCart);

    };

    const saveCart = (updatedCart) => {

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        setCart(updatedCart);

    };

    const increaseQuantity = (id) => {

        const updatedCart = cart.map(item =>

            item.id === id

                ? {
                    ...item,
                    quantity: item.quantity + 1
                }

                : item

        );

        saveCart(updatedCart);

    };

    const decreaseQuantity = (id) => {

        const updatedCart = cart
            .map(item =>

                item.id === id

                    ? {
                        ...item,
                        quantity: item.quantity - 1
                    }

                    : item

            )
            .filter(item => item.quantity > 0);

        saveCart(updatedCart);

    };

    const removeItem = (id) => {

        const updatedCart = cart.filter(

            item => item.id !== id

        );

        saveCart(updatedCart);

    };

    const clearCart = () => {

        localStorage.removeItem("cart");

        setCart([]);

    };

    const total = cart.reduce(

        (sum, item) =>

            sum + item.price * item.quantity,

        0

    );

    return (

        <div className="container py-5">

            <h2 className="mb-4">

                Shopping Cart

            </h2>

            {

                cart.length === 0

                    ?

                    (

                        <div className="alert alert-info">

                            Your cart is empty.

                        </div>

                    )

                    :

                    (

                        <>

                            <div className="table-responsive">

                                <table className="table table-bordered align-middle">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>Product</th>

                                            <th>Price</th>

                                            <th>Quantity</th>

                                            <th>Total</th>

                                            <th>Action</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            cart.map(item => (

                                                <tr key={item.id}>

                                                    <td>

                                                        {item.name}

                                                    </td>

                                                    <td>

                                                        ${item.price.toFixed(2)}

                                                    </td>

                                                    <td>

                                                        <button
                                                            className="btn btn-sm btn-danger me-2"
                                                            onClick={() => decreaseQuantity(item.id)}
                                                        >

                                                            -

                                                        </button>

                                                        {item.quantity}

                                                        <button
                                                            className="btn btn-sm btn-success ms-2"
                                                            onClick={() => increaseQuantity(item.id)}
                                                        >

                                                            +

                                                        </button>

                                                    </td>

                                                    <td>

                                                        $

                                                        {

                                                            (
                                                                item.price *
                                                                item.quantity
                                                            ).toFixed(2)

                                                        }

                                                    </td>

                                                    <td>

                                                        <button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => removeItem(item.id)}
                                                        >

                                                            Remove

                                                        </button>

                                                    </td>

                                                </tr>

                                            ))

                                        }

                                    </tbody>

                                </table>

                            </div>

                            <div className="text-end">

                                <h3>

                                    Grand Total:

                                    {" "}

                                    ${total.toFixed(2)}

                                </h3>

                                <button
                                    className="btn btn-danger me-2"
                                    onClick={clearCart}
                                >

                                    Clear Cart

                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={() => {

                                        const orders = JSON.parse(
                                            localStorage.getItem("orders")
                                        ) || [];

                                        orders.push({

                                            id: Date.now(),

                                            items: cart,

                                            total,

                                            date: new Date().toLocaleString()

                                        });

                                        localStorage.setItem(
                                            "orders",
                                            JSON.stringify(orders)
                                        );

                                        localStorage.removeItem("cart");

                                        setCart([]);

                                        alert("Order placed successfully!");

                                    }}
                                >

                                    Checkout

                                </button>

                            </div>

                        </>

                    )

            }

        </div>

    );

}