import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import products from "../data/products";

export default function ProductDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();

    const product = products.find(
        item => item.id === Number(id)
    );

    if (!product) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger">

                    Product not found.

                </div>

                <Link
                    to="/products"
                    className="btn btn-primary"
                >

                    Back to Products

                </Link>

            </div>

        );

    }

    const addToCart = () => {

        if (!user) {

            alert("Please login or register before shopping.");

            navigate("/login");

            return;

        }

        let cart = JSON.parse(
            localStorage.getItem("cart")
        ) || [];

        const existing = cart.find(
            item => item.id === product.id
        );

        if (existing) {

            existing.quantity++;

        } else {

            cart.push({

                ...product,

                quantity: 1

            });

        }

        localStorage.setItem(

            "cart",

            JSON.stringify(cart)

        );

        alert(`${product.name} added to cart!`);

    };

    return (

        <div className="container py-5">

            <div className="row">

                <div className="col-lg-6">

                    <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid rounded shadow"
                    />

                </div>

                <div className="col-lg-6">

                    <h2 className="mb-3">

                        {product.name}

                    </h2>

                    <h3 className="text-success mb-3">

                        ${product.price}

                    </h3>

                    <p>

                        ⭐⭐⭐⭐⭐

                        <span className="ms-2 text-muted">

                            (4.9/5)

                        </span>

                    </p>

                    <hr />

                    <p>

                        <strong>

                            Category:

                        </strong>

                        {" "}

                        {product.category}

                    </p>

                    <p>

                        <strong>

                            Stock:

                        </strong>

                        {" "}

                        {product.stock}

                    </p>

                    <p>

                        {product.description}

                    </p>

                    <div className="mt-4">

                        <button
                            className="btn btn-success me-3"
                            onClick={addToCart}
                        >

                            Add To Cart

                        </button>

                        <Link
                            to="/products"
                            className="btn btn-outline-primary"
                        >

                            Back to Products

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}