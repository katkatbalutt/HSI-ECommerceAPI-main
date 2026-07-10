import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        const success = login(email, password);

        if (success) {

            alert("Login Successful!");

            navigate("/");

        } else {

            setError("Invalid email or password.");

        }

    };

    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">

                                Login

                            </h2>

                            {

                                error &&

                                <div className="alert alert-danger">

                                    {error}

                                </div>

                            }

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label>

                                        Email

                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />

                                </div>

                                <div className="mb-4">

                                    <label>

                                        Password

                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                >

                                    Login

                                </button>

                            </form>

                            <hr />

                            <p className="text-center">

                                Don't have an account?

                            </p>

                            <Link
                                to="/register"
                                className="btn btn-success w-100"
                            >

                                Register Here

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}