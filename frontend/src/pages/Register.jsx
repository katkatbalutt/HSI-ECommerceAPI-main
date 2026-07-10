import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();

    const [form, setForm] = useState({

        name: "",

        email: "",

        password: ""

    });

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        const success = register(form);

        if (success) {

            alert("Registration Successful!");

            navigate("/");

        } else {

            setError("Email already exists.");

        }

    };

    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">

                                Register

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

                                        Full Name

                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label>

                                        Email

                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-4">

                                    <label>

                                        Password

                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <button
                                    className="btn btn-success w-100"
                                >

                                    Register

                                </button>

                            </form>

                            <hr />

                            <p className="text-center">

                                Already have an account?

                            </p>

                            <Link
                                to="/login"
                                className="btn btn-primary w-100"
                            >

                                Login

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}