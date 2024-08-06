"use client";

import axios from "axios";
import styles from "./loginForm.module.css";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const navigate = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget); 

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await axios.post("/api/login", JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      window.localStorage.setItem("accessToken", response.data.accessToken);
      
      if(response.status === 200) {
        navigate.push('/dashboard');
        window.location.reload();
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input type="email" placeholder="email" name="email" />
      <input type="password" placeholder="password" name="password" />
      <button>Login</button>
    </form>
  );
};

export default LoginForm;