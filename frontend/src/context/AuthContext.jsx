import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (savedUser) {

            setUser(savedUser);

        }

    }, []);

    const login = (email, password) => {

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const foundUser = users.find(

            user =>

                user.email === email &&

                user.password === password

        );

        if (!foundUser) {

            return false;

        }

        localStorage.setItem(

            "user",

            JSON.stringify(foundUser)

        );

        setUser(foundUser);

        return true;

    };

    const register = (newUser) => {

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const exists = users.find(

            user => user.email === newUser.email

        );

        if (exists) {

            return false;

        }

        users.push(newUser);

        localStorage.setItem(

            "users",

            JSON.stringify(users)

        );

        localStorage.setItem(

            "user",

            JSON.stringify(newUser)

        );

        setUser(newUser);

        return true;

    };

    const logout = () => {

        localStorage.removeItem("user");

        setUser(null);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                login,

                register,

                logout

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}