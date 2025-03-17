import React, { useState } from "react";
import { Table, Button, Modal, Input, Select, Form, ConfigProvider } from "antd";
import GradientButton from "../common/GradiantButton";

const { Option } = Select;

const LoyalityProgramTable = () => {
  const [isAddTierModalOpen, setIsAddTierModalOpen] = useState(false);
  const [isManageEligibilityModalOpen, setIsManageEligibilityModalOpen] =
    useState(false);
  const [form] = Form.useForm();

  
  const data = [
    {
      key: "1",
      rank: 1,
      retailer: "Retailer A",
      email: "retailerA@example.com",
      totalSales: "$50,000",
      tier: "Gold",
      eligibility: "Yes",
    },
    {
      key: "2",
      rank: 2,
      retailer: "Retailer B",
      email: "retailerB@example.com",
      totalSales: "$30,000",
      tier: "Silver",
      eligibility: "No",
    },
    {
      key: "3",
      rank: 3,
      retailer: "Retailer C",
      email: "retailerC@example.com",
      totalSales: "$70,000",
      tier: "Platinum",
      eligibility: "Yes",
    },
    {
      key: "4",
      rank: 4,
      retailer: "Retailer D",
      email: "retailerD@example.com",
      totalSales: "$20,000",
      tier: "Bronze",
      eligibility: "No",
    },
    {
      key: "5",
      rank: 5,
      retailer: "Retailer E",
      email: "retailerE@example.com",
      totalSales: "$40,000",
      tier: "Gold",
      eligibility: "Yes",
    },
    {
      key: "6",
      rank: 6,
      retailer: "Retailer F",
      email: "retailerF@example.com",
      totalSales: "$90,000",
      tier: "Platinum",
      eligibility: "Yes",
    },
    {
      key: "7",
      rank: 7,
      retailer: "Retailer G",
      email: "retailerG@example.com",
      totalSales: "$35,000",
      tier: "Silver",
      eligibility: "No",
    },
    {
      key: "8",
      rank: 8,
      retailer: "Retailer H",
      email: "retailerH@example.com",
      totalSales: "$55,000",
      tier: "Gold",
      eligibility: "Yes",
    },
    {
      key: "9",
      rank: 9,
      retailer: "Retailer I",
      email: "retailerI@example.com",
      totalSales: "$65,000",
      tier: "Gold",
      eligibility: "Yes",
    },
    {
      key: "10",
      rank: 10,
      retailer: "Retailer J",
      email: "retailerJ@example.com",
      totalSales: "$45,000",
      tier: "Silver",
      eligibility: "No",
    },
    {
      key: "11",
      rank: 11,
      retailer: "Retailer K",
      email: "retailerK@example.com",
      totalSales: "$80,000",
      tier: "Platinum",
      eligibility: "Yes",
    },
    {
      key: "12",
      rank: 12,
      retailer: "Retailer L",
      email: "retailerL@example.com",
      totalSales: "$28,000",
      tier: "Bronze",
      eligibility: "No",
    },
    {
      key: "13",
      rank: 13,
      retailer: "Retailer M",
      email: "retailerM@example.com",
      totalSales: "$75,000",
      tier: "Platinum",
      eligibility: "Yes",
    },
    {
      key: "14",
      rank: 14,
      retailer: "Retailer N",
      email: "retailerN@example.com",
      totalSales: "$38,000",
      tier: "Silver",
      eligibility: "No",
    },
    {
      key: "15",
      rank: 15,
      retailer: "Retailer O",
      email: "retailerO@example.com",
      totalSales: "$42,000",
      tier: "Gold",
      eligibility: "Yes",
    },
    {
      key: "16",
      rank: 16,
      retailer: "Retailer P",
      email: "retailerP@example.com",
      totalSales: "$95,000",
      tier: "Platinum",
      eligibility: "Yes",
    },
    {
      key: "17",
      rank: 17,
      retailer: "Retailer Q",
      email: "retailerQ@example.com",
      totalSales: "$22,000",
      tier: "Bronze",
      eligibility: "No",
    },
    {
      key: "18",
      rank: 18,
      retailer: "Retailer R",
      email: "retailerR@example.com",
      totalSales: "$60,000",
      tier: "Gold",
      eligibility: "Yes",
    },
  ];

  const columns = [
    { title: "Rank", dataIndex: "rank", key: "rank", align: "center" },
    {
      title: "Retailer Name",
      dataIndex: "retailer",
      key: "retailer",
      align: "center",
    },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      align: "center",
    },
    { title: "Tier", dataIndex: "tier", key: "tier", align: "center" },
    {
      title: "Eligibility",
      dataIndex: "eligibility",
      key: "eligibility",
      align: "center",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">LeaderBoard</h2>
        <div>
          <GradientButton onClick={() => setIsAddTierModalOpen(true)}>
            Add Tier
          </GradientButton>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#0090B9",
                colorPrimaryHover: "#336C79",
              },
            }}
          >
            <GradientButton
              onClick={() => setIsManageEligibilityModalOpen(true)}
            >
              Manage Tier & Eligibility
            </GradientButton>
          </ConfigProvider>
        </div>
      </div>
      <div className="bg-gradient-to-r from-primary  to-secondary px-6 pt-6  rounded-xl">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="middle"
          rowClassName="custom-row"
        />
      </div>

      {/* Add Tier Modal */}
      <Modal
        title="Add Tier"
        open={isAddTierModalOpen}
        onCancel={() => setIsAddTierModalOpen(false)}
        onOk={() => form.submit()}
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #4E9DAB, #336C79)",
            border: "none",
            color: "white",
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tier Name"
            name="tierName"
            rules={[{ required: true, message: "Enter Tier Name" }]}
          >
            <Input placeholder="Enter tier name" />
          </Form.Item>
          <Form.Item
            label="Tier Threshold ($)"
            name="tierThreshold"
            rules={[{ required: true, message: "Enter threshold amount" }]}
          >
            <Input placeholder="Enter threshold amount" type="number" />
          </Form.Item>
          <Form.Item
            label="Eligibility"
            name="eligibility"
            rules={[{ required: true, message: "Select eligibility" }]}
          >
            <Select>
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Manage Eligibility Modal */}
      <Modal
        title="Manage Eligibility"
        open={isManageEligibilityModalOpen}
        onCancel={() => setIsManageEligibilityModalOpen(false)}
        onOk={() => form.submit()}
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #4E9DAB, #336C79)",
            border: "none",
            color: "white",
          },
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Bronze Tier Threshold ($)" name="bronzeThreshold">
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item label="Silver Tier Threshold ($)" name="silverThreshold">
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item label="Gold Tier Threshold ($)" name="goldThreshold">
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item
            label="Platinum Tier Threshold ($)"
            name="platinumThreshold"
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item label="Eligibility Tiers" name="eligibilityTiers">
            <Select mode="multiple" placeholder="Select eligibility tiers">
              <Option value="Bronze">Bronze</Option>
              <Option value="Silver">Silver</Option>
              <Option value="Gold">Gold</Option>
              <Option value="Platinum">Platinum</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoyalityProgramTable;
