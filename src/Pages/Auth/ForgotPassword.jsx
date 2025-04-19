import { Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/common/FormItem";
import image4 from "../../assets/image4.png";
import { MdKeyboardBackspace } from "react-icons/md";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // Handle forgot password logic
    navigate("/auth/verify-otp");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <img src={image4} alt="logo" className="h-40 w-60 mx-auto" />
        <h1 className="text-[25px] font-semibold mb-6">Forgot Password</h1>
        <p>Please enter your email to receive a password reset link</p>
      </div>
      <Form onFinish={onFinish} layout="vertical">
        <FormItem name={"email"} label={"Email"} />

        <Form.Item style={{ marginBottom: 0 }}>
          <button
            htmlType="submit"
            type="submit"
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 20,
            }}
            className="flex items-center justify-center bg-gradient-to-r border border-[#A92C2C] from-primary to-secondary rounded-lg"
          >
            Send foR OTP
          </button>
          <div className="flex items-center justify-center mt-4">
            <a
              className="login-form-back   flex items-center justify-center gap-3 text-white"
              href="/auth/login"
            >
              <MdKeyboardBackspace className="W-10" size={28} />
              Back to login
            </a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
