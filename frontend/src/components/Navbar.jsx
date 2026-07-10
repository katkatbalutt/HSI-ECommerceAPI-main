import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

    const { user, logout } = useAuth();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">

            <div className="container">

                <Link
                    className="navbar-brand fw-bold"
                    to="/"
                >
                    🛒 HSI Shop
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbar"
                >

                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/"
                            >
                                Home
                            </Link>

                        </li>

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/products"
                            >
                                Products
                            </Link>

                        </li>

                    </ul>

                    <ul className="navbar-nav ms-auto align-items-center">

                        <li className="nav-item me-3">

                            <Link
                                className="nav-link position-relative"
                                to="/cart"
                            >

                                🛒 Cart

                                {totalItems > 0 && (

                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    >
                                        {totalItems}
                                    </span>

                                )}

                            </Link>

                        </li>

                        {user ? (

                            <li className="nav-item dropdown">

                                <a
                                    href="#"
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                >
                                    👤 {user.name}
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end">

                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/profile"
                                        >
                                            My Profile
                                        </Link>

                                    </li>

                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/orders"
                                        >
                                            My Orders
                                        </Link>

                                    </li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    <li>

                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={logout}
                                        >
                                            Logout
                                        </button>

                                    </li>

                                </ul>

                            </li>

                        ) : (

                            <>

                                <li className="nav-item">

                                    <Link
                                        className="nav-link"
                                        to="/login"
                                    >
                                        Login
                                    </Link>

                                </li>

                                <li className="nav-item">

                                    <Link
                                        className="nav-link"
                                        to="/register"
                                    >
                                        Register
                                    </Link>

                                </li>

                            </>

                        )}

                    </ul>

                </div>

            </div>

        </nav>

    );

}