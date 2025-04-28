import { Button, Checkbox, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/common/FormItem";
import image4 from "../../assets/image4.png";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading, isSuccess, error, data }] = useLoginMutation();

  const onFinish = async (values) => {
    console.log(values);
    try {
      // Call the login mutation with email and password
      const response = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      // console.log(response.data.accessToken);
      if (response.success) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      // Error handling could be improved with user feedback
    }
  };

  // Optional: Handle success case with useEffect
  useEffect(() => {
    if (isSuccess && data?.token) {
      navigate("/");
    }
  }, [isSuccess, data, navigate]);

  return (
    <div>
      <div className="text-center mb-8">
        <img src={image4} alt="logo" className="h-40 w-60 mx-auto" />
        <h1 className="text-[25px] font-semibold mb-6">Login</h1>
        <p>Please enter your email and password to continue</p>
      </div>
      <Form onFinish={onFinish} layout="vertical">
        <FormItem name={"email"} label={"Email"} />

        <Form.Item
          name="password"
          label={<p>Password</p>}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Enter your password"
            style={{
              height: 45,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </Form.Item>

        <div className="flex items-center justify-end">
          <a
            className="login-form-forgot text-white hover:text-white"
            href="/auth/forgot-password"
          >
            Forgot password
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <button
            htmlType="submit"
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 30,
            }}
            className="flex items-center justify-center bg-gradient-to-r from-primary to-secondary border border-[#A92C2C] rounded-lg"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </Form.Item>

        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error.data?.message || "Login failed. Please try again."}
          </div>
        )}
      </Form>
    </div>
  );
};

export default Login;
