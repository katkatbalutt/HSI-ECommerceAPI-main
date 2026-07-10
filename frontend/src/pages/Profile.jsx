import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {

    const { user, logout } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-6">

                    <div className="card shadow">

                        <div className="card-body text-center">

                            <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    fontSize: "40px"
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <h2>{user.name}</h2>

                            <p className="text-muted">
                                {user.email}
                            </p>

                            <hr />

                            <div className="text-start">

                                <p>
                                    <strong>Name:</strong> {user.name}
                                </p>

                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>

                                <p>
                                    <strong>Status:</strong> Active Member
                                </p>

                            </div>

                            <button
                                className="btn btn-danger mt-3"
                                onClick={logout}
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}