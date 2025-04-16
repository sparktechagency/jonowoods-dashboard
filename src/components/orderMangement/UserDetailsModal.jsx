import React from "react";
import { Modal, Typography, Divider, Row, Col } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UserDetailsModal = ({ visible, onClose, userDetails }) => {
  if (!userDetails) return null;

  const modalTitleStyle = {
    color: "#f5222d",
    marginBottom: 0,
    fontWeight: 500,
  };

  const labelStyle = {
    fontWeight: 500,
  };

  const valueStyle = {
    marginBottom: 8,
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={modalTitleStyle}>
            User Information
          </Title>
         
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      bodyStyle={{ padding: "24px" }}
      style={{ top: 20 }}
    >
      <div
        style={{
          border: "1px solid #f5222d",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <div>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Text style={labelStyle}>User Name:</Text>{" "}
              <Text style={valueStyle}>{userDetails.name}</Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Email:</Text>{" "}
              <Text style={valueStyle}>{userDetails.email}</Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Phone Number:</Text>{" "}
              <Text style={valueStyle}>{userDetails.phone}</Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Streak:</Text>{" "}
              <Text style={valueStyle}>{userDetails.streak}</Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Sessions:</Text>{" "}
              <Text style={valueStyle}>{userDetails.sessions}</Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Total Time:</Text>{" "}
              <Text style={valueStyle}>{userDetails.totalTime}</Text>
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div>
          <Title level={5} style={modalTitleStyle}>
            Subscription Information
          </Title>
          <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Text style={labelStyle}>Subscription:</Text>{" "}
              <Text style={valueStyle}>
                {userDetails.subscriptionInfo.subscription}
              </Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Subscription Plan:</Text>{" "}
              <Text style={valueStyle}>
                {userDetails.subscriptionInfo.plan}
              </Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Amount:</Text>{" "}
              <Text style={valueStyle}>
                {userDetails.subscriptionInfo.amount}
              </Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Date:</Text>{" "}
              <Text style={valueStyle}>
                {userDetails.subscriptionInfo.date}
              </Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Subscription Day Remaining:</Text>{" "}
              <Text style={valueStyle}>
                {userDetails.subscriptionInfo.remaining}
              </Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Transaction ID:</Text>{" "}
              <Text style={valueStyle}>
                {userDetails.subscriptionInfo.transactionId}
              </Text>
            </Col>
            <Col span={24}>
              <Text style={labelStyle}>Payment By:</Text>{" "}
              <Text style={valueStyle}>
                {userDetails.subscriptionInfo.paymentBy}
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
