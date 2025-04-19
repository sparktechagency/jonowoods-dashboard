import { Button, Form, Input } from "antd";
import React from "react";
import GradientButton from "../../../components/common/GradiantButton";

const ChangePassword = () => {
  const [form] = Form.useForm();

  const handleChangePassword = (values) => {
    console.log(values);
  };

  return (
    <div className="flex gap-20 shadow-xl rounded-lg">
      <div className="w-1/2 mx-auto">
        <h2 className="text-2xl font-bold mb-5 text-center">Update Password</h2>
        <div>
          <Form
            form={form}
            layout="vertical"
            className="lg:ms-[50px] pe-[30px] mt-[30px]"
            initialValues={{
              remember: true,
            }}
            style={{
              width: "100%",
              height: "fit-content",
            }}
            onFinish={handleChangePassword}
          >
            <div className="mb-[20px] w-[100%]">
              <Form.Item
                style={{ marginBottom: 0 }}
                name="current_password"
                label={<p style={{ display: "block" }}>Current Password</p>}
                rules={[
                  {
                    required: true,
                    message: "Please input your current password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter Password"
                  type="password"
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "40px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-[20px] w-[100%]">
              <Form.Item
                name="new_password"
                label={<p style={{ display: "block" }}>New Password</p>}
                dependencies={["current_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue("current_password") === value
                      ) {
                        return Promise.reject(
                          new Error(
                            "The new password and current password do not match!"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter password"
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "40px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-[40px] w-[100%]">
              <Form.Item
                name="confirm_password"
                label={<p style={{ display: "block" }}>Re-Type Password</p>}
                style={{ marginBottom: 0 }}
                dependencies={["new_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter password"
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "40px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            {/* Center the Button using Flexbox */}
            <div
              className="flex justify-center mb-[20px]"
              style={{
                width: "100%",
              }}
            >
              <Form.Item>
                <GradientButton
                  type="primary"
                  htmlType="submit"
                  block
                  style={{
                    border: "none",
                    height: "40px",
                    background: "#1D75F2",
                    color: "white",
                    borderRadius: "8px",
                    outline: "none",
                    width: "150px",
                  }}
                >
                  Update your password
                </GradientButton>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
