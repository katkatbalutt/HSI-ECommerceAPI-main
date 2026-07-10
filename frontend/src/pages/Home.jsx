import { Link } from "react-router-dom";
import products from "../data/products";

export default function Home() {


    return (

        <>

            {/* Hero */}
            

            <section className="bg-dark text-white py-5">

                <div className="container">

                    <div className="row align-items-center">

                        <div className="col-lg-6">

                            <h1 className="display-4 fw-bold">

                                Welcome to HSI E-Commerce

                            </h1>

                            <p className="lead">

                                Shop the latest gadgets, fashion,
                                sports, and home essentials.

                            </p>

                            <Link
                                to="/products"
                                className="btn btn-warning btn-lg mt-3"
                            >

                                Shop Now

                            </Link>

                        </div>

                        <div className="col-lg-6 text-center">

                            <img
                                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900"
                                className="img-fluid rounded shadow"
                                alt="Shopping"
                            />

                        </div>

                    </div>

                </div>

            </section>
            {/* Flash Sale */}

<section className="container py-5">

    <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="text-danger">

            🔥 Flash Sale

        </h2>

        <span className="badge bg-danger p-3">

            Limited Time Only

        </span>

    </div>

    <div className="row">

        {

            products.slice(0,4
            ).map(product => (

                <div
                    className="col-lg-3 col-md-6 mb-4"
                    key={product.id}
                >

                    <div className="card shadow h-100 border-danger">

                        <div
                            className="badge bg-danger position-absolute"
                            style={{
                                top:"10px",
                                right:"10px"
                            }}
                        >

                            -20%

                        </div>

                        <img
                            src={product.image}
                            className="card-img-top"
                            style={{
                                height:"220px",
                                objectFit:"cover"
                            }}
                            alt={product.name}
                        />

                        <div className="card-body">

                            <h5>

                                {product.name}

                            </h5>

                            <h4 className="text-danger">

                                $

                                {(product.price*0.8).toFixed(2)}

                            </h4>

                            <small
                                className="text-decoration-line-through text-muted"
                            >

                                ${product.price}

                            </small>

                            <Link
                                to={`/products/${product.id}`}
                                className="btn btn-danger w-100 mt-3"
                            >

                                Buy Now

                            </Link>

                        </div>

                    </div>

                </div>

            ))

        }

    </div>

</section>

            {/* Categories */}

            <section className="container py-5">

                <h2 className="text-center mb-4">

                    Shop by Category

                </h2>

                <div className="row text-center">

                    <div className="col-md-3">

                        <div className="card shadow p-4">

                            💻

                            <h5 className="mt-3">

                                Electronics

                            </h5>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow p-4">

                            👕
                            <h5 className="mt-3">

                                Fashion

                            </h5>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow p-4">

                            🏠

                            <h5 className="mt-3">

                                Home

                            </h5>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow p-4">

                            ⚽

                            <h5 className="mt-3">

                                Sports

                            </h5>

                        </div>

                    </div>

                </div>

            </section>

            {/* Customer Reviews */}

<section className="bg-light py-5">

    <div className="container">

        <h2 className="text-center mb-5">

            💬 Customer Reviews

        </h2>

        <div className="row">

            <div className="col-md-4">

                <div className="card shadow h-100">

                    <div className="card-body">

                        ⭐⭐⭐⭐⭐

                        <p className="mt-3">

                            "Fast delivery and great quality products."

                        </p>

                        <strong>

                            - Maria S.

                        </strong>

                    </div>

                </div>

            </div>

            <div className="col-md-4">

                <div className="card shadow h-100">

                    <div className="card-body">

                        ⭐⭐⭐⭐⭐

                        <p className="mt-3">

                            "Very easy to shop. Highly recommended!"

                        </p>

                        <strong>

                            - John D.

                        </strong>

                    </div>

                </div>

            </div>

            <div className="col-md-4">

                <div className="card shadow h-100">

                    <div className="card-body">

                        ⭐⭐⭐⭐⭐

                        <p className="mt-3">

                            "Affordable prices and excellent customer service."

                        </p>

                        <strong>

                            - Angela P.

                        </strong>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>

</>

    );

}