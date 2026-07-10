import { useEffect, useState } from "react";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        const savedOrders = JSON.parse(
            localStorage.getItem("orders")
        ) || [];

        setOrders(savedOrders);

    }, []);

    return (

        <div className="container py-5">

            <h2 className="mb-4">

                Order History

            </h2>

            {

                orders.length === 0

                    ?

                    (

                        <div className="alert alert-info">

                            You have no orders yet.

                        </div>

                    )

                    :

                    (

                        orders.map(order => (

                            <div
                                key={order.id}
                                className="card shadow mb-4"
                            >

                                <div className="card-header bg-success text-white">

                                    <div className="d-flex justify-content-between">

                                        <strong>

                                            Order #

                                            {order.id}

                                        </strong>

                                        <span>

                                            {order.date}

                                        </span>

                                    </div>

                                </div>

                                <div className="card-body">

                                    <table className="table">

                                        <thead>

                                            <tr>

                                                <th>Product</th>

                                                <th>Price</th>

                                                <th>Quantity</th>

                                                <th>Total</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {

                                                order.items.map(item => (

                                                    <tr key={item.id}>

                                                        <td>

                                                            {item.name}

                                                        </td>

                                                        <td>

                                                            ${item.price.toFixed(2)}

                                                        </td>

                                                        <td>

                                                            {item.quantity}

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

                                                    </tr>

                                                ))

                                            }

                                        </tbody>

                                    </table>

                                    <div className="text-end">

                                        <h4>

                                            Total Paid:

                                            {" "}

                                            <span className="text-success">

                                                $

                                                {order.total.toFixed(2)}

                                            </span>

                                        </h4>

                                    </div>

                                </div>

                            </div>

                        ))

                    )

            }

        </div>

    );

}