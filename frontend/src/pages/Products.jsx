import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import products from "../data/products";

export default function Products() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    const [sort, setSort] = useState("");

    const addToCart = (product) => {

        if (!user) {

            alert("Please login or register before shopping.");

            navigate("/login");

            return;

        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item => item.id === product.id);

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

        alert(product.name + " added to cart!");

    };

    let filteredProducts = products.filter(product => {

        const matchSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =

            category === "All"

                ? true

                : product.category === category;

        return matchSearch && matchCategory;

    });

    if (sort === "low") {

        filteredProducts.sort(

            (a, b) => a.price - b.price

        );

    }

    if (sort === "high") {

        filteredProducts.sort(

            (a, b) => b.price - a.price

        );

    }

    return (

        <div className="container py-5">

            <h2 className="mb-4">

                Products

            </h2>

            <div className="row mb-4">

                <div className="col-md-4">

                    <input
                        className="form-control"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div className="col-md-4">

                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >

                        <option>

                            All

                        </option>

                        <option>

                            Electronics

                        </option>

                        <option>

                            Fashion

                        </option>

                        <option>

                            Home

                        </option>

                        <option>

                            Sports

                        </option>

                    </select>

                </div>

                <div className="col-md-4">

                    <select
                        className="form-select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >

                        <option value="">

                            Sort By

                        </option>

                        <option value="low">

                            Price: Low to High

                        </option>

                        <option value="high">

                            Price: High to Low

                        </option>

                    </select>

                </div>

            </div>

            <p className="text-muted">

                Showing

                {" "}

                <strong>

                    {filteredProducts.length}

                </strong>

                {" "}

                products

            </p>

            <div className="row g-4">

                {

                    filteredProducts.map(product => (

                        <div
                            key={product.id}
                            className="col-lg-4 col-md-6"
                        >

                            <div className="card h-100 shadow">

                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{
                                        height: "230px",
                                        objectFit: "cover"
                                    }}
                                />

                                <div className="card-body d-flex flex-column">

                                    <h5>

                                        {product.name}

                                    </h5>

                                    <p className="text-muted">

                                        {product.category}

                                    </p>

                                    <h4 className="text-success">

                                        ${product.price}

                                    </h4>

                                    <p>

                                        Stock:

                                        {" "}

                                        {product.stock}

                                    </p>

                                    <div className="mt-auto">

                                        <Link
                                            to={`/products/${product.id}`}
                                            className="btn btn-outline-primary me-2"
                                        >

                                            View

                                        </Link>

                                        <button
                                            className="btn btn-success"
                                            onClick={() => addToCart(product)}
                                        >

                                            Add To Cart

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}