import React, { useState } from "react";
import { Table, Button, Input, Space, ConfigProvider } from "antd";
import Swal from "sweetalert2";
import UpdateModal from "../common/UpdateModal";
import GradientButton from "../common/GradiantButton";

const retailersData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Retailer ${i + 1}`,
  email: `retailer${i + 1}@gmail.com`,
  phone: `+23191633389${i + 1}`,
  totalOrder: Math.floor(Math.random() * 100),
  totalSales: `$${(Math.random() * 1000).toFixed(2)}`,
  accountStatus: i % 2 === 0 ? "Active" : "Inactive",
  image: `https://img.freepik.com/free-photo/portrait-handsome-young-man-with-arms-crossed-holding-white-headphone-around-his-neck_23-2148096439.jpg?semt=ais_hybrid/50?text=R${
    i + 1
  }`,
}));

const RetailerManageTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [retailers, setRetailers] = useState(retailersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

 const columns = [
   {
     title: "#",
     dataIndex: "id",
     key: "id",
     align: "center",
     render: (text, record, index) => index + 1,
   },
   {
     title: "Retailer Name",
     dataIndex: "name",
     key: "name",
     align: "center",
     render: (text, record) => (
       <div className="flex items-center justify-center">
         {/* <img
           src={record.image}
           alt={record.name}
           className="w-10 h-10 rounded-full mr-3"
         /> */}
         {record.name}
       </div>
     ),
   },
   {
     title: "Email",
     dataIndex: "email",
     key: "email",
     align: "center",
   },
   {
     title: "Assigned Sales Rep",
     dataIndex: "phone",
     key: "phone",
     align: "center",
   },
   {
     title: "Total Order",
     dataIndex: "totalOrder",
     key: "totalOrder",
     align: "center",
   },
   {
     title: "Total Sales",
     dataIndex: "totalSales",
     key: "totalSales",
     align: "center",
   },
   {
     title: "Account Status",
     dataIndex: "accountStatus",
     key: "accountStatus",
     align: "center",
    
   },
   {
     title: "Action",
     key: "action",
     align: "center",
     render: (_, record) => (
       <Space>
           <GradientButton
             onClick={() => handleEdit(record)}
           >
             Edit
           </GradientButton>
         
         <ConfigProvider
           theme={{
             token: {
               colorPrimary: "#FF4D4F",
               colorPrimaryHover: "#FF7875",
             },
           }}
         >
           <Button
             onClick={() => handleDelete(record.id)}
             type="primary"
             danger
             size="large"
           >
             Delete
           </Button>
         </ConfigProvider>
       </Space>
     ),
   },
 ];


  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setRetailers(retailers.filter((retailer) => retailer.id !== id));
        Swal.fire("Deleted!", "Retailer has been deleted.", "success");
      }
    });
  };

  const handleSave = (updatedUserData) => {
    if (selectedUser) {
      // Update existing retailer
      setRetailers(
        retailers.map((retailer) =>
          retailer.id === updatedUserData.id ? updatedUserData : retailer
        )
      );
    } else {
      // Add new retailer
      const newRetailer = {
        ...updatedUserData,
        id: retailers.length + 1,
        image:
          "https://img.freepik.com/free-photo/portrait-handsome-young-man-with-arms-crossed-holding-white-headphone-around-his-neck_23-2148096439.jpg",
      };
      setRetailers([...retailers, newRetailer]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold">
            Retailer List{" "}
            <span className="text-secondary">{retailersData.length}</span>{" "}
          </h2>
        </div>
        {/* Search and Add Retailer Button */}
        <div className="flex gap-5 items-center ">
          <Input
            placeholder="Search Retailers Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
            className="py-2.5"
          />
          <GradientButton
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
          >
            Add Retailer
          </GradientButton>
        </div>
      </div>
      {/* Table */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-xl">
        <Table
          dataSource={retailers.filter(
            (retailer) =>
              retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              retailer.email.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          className="custom-table"
        />
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <UpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          userData={selectedUser}
          editingId={selectedUser ? selectedUser.id : null}
        />
      )}
    </div>
  );
};

export default RetailerManageTable;
