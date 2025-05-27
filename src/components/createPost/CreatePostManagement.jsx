import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  Switch,
 
  message,
  Tag,
  Card,
  Row,
  Col,
  Pagination,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";
import moment from "moment/moment";
import PostFormModal from "./PostFormModal";
import { getVideoAndThumbnail } from "../common/imageUrl";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useUpdatePostStatusMutation,
} from "../../redux/apiSlices/createPostApi";
import Spinner from "../common/Spinner";

const PostManagementSystem = () => {
  // State management
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtering and pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);



  // API calls
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    refetch,
  } = useGetAllPostsQuery();

  const { data: postDetails, isLoading: isLoadingDetails } =
    useGetPostByIdQuery(selectedItemId, { skip: !selectedItemId });
  console.log("Post Details:", postDetails);

  const [deletePost] = useDeletePostMutation();
  const [updatePostStatus] = useUpdatePostStatusMutation();
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  // Handle edit button click
  const handleEdit = async (id) => {
    setSelectedItemId(id);
    setEditingId(id);
    // Wait a moment to ensure the post details are fetched
    setTimeout(() => {
      setIsFormModalVisible(true);
    }, 100);
  };

  // Handle add new button click
  const showFormModal = () => {
    setSelectedItemId(null);
    setEditingId(null);
    setIsFormModalVisible(true);
  };

  // Show details modal
  const showDetailsModal = (record) => {
    setSelectedItemId(record._id);
    setIsDetailsModalVisible(true);
  };

  const posts = postsData?.data || [];
 
  // Get current editing post data
  const currentEditingPost = React.useMemo(() => {
    if (!editingId) return null;

    // First try to get from API response
    if (postDetails?.data) {
      return postDetails.data;
    }

    // Fallback to posts array
    return posts.find((post) => post._id === editingId) || null;
  }, [editingId, postDetails, posts]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter]);

  // Form submit handler
  const handleFormSubmit = useCallback(
    async (formData) => {
      setIsSubmitting(true);
      try {
        if (editingId) {
          await updatePost({
            id: editingId,
            postData: formData,
          });
          message.success("Post updated successfully");
        } else {
          await createPost(formData);
          message.success("Post created successfully");
        }

        setIsFormModalVisible(false);
        setEditingId(null);
        setSelectedItemId(null);
        await refetch();
      } catch (error) {
        console.error("Error in form submit:", error);
        message.error(
          `Failed to ${editingId ? "update" : "create"} post: ${
            error?.message || "Unknown error"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingId, createPost, updatePost, refetch]
  );

  // Delete handler
  const handleDeletePost = useCallback(
    (id) => {
      Modal.confirm({
        title: "Are you sure you want to delete this post?",
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await deletePost(id);
            message.success("Post deleted successfully");
            refetch();
          } catch (error) {
            message.error("Failed to delete post");
            console.error("Error deleting post:", error);
          }
        },
      });
    },
    [deletePost, refetch]
  );

 

  // Modal close handlers
  const handleFormModalClose = () => {
    setIsFormModalVisible(false);
    setEditingId(null);
    setSelectedItemId(null);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedItemId(null);
  };



  
 

  // Get post type icon
  const getPostTypeIcon = (type) => {
    switch (type) {
      case "text":
        return (
          <FileTextOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
        );
      case "image":
        return (
          <FileImageOutlined style={{ color: "#52c41a", fontSize: "18px" }} />
        );
      case "video":
        return (
          <VideoCameraOutlined style={{ color: "#ff4d4f", fontSize: "18px" }} />
        );
      default:
        return <FileTextOutlined style={{ fontSize: "18px" }} />;
    }
  };

  // Get post type color
  const getPostTypeColor = (type) => {
    switch (type) {
      case "text":
        return "blue";
      case "image":
        return "green";
      case "video":
        return "red";
      default:
        return "default";
    }
  };

 

  // Render post preview
  const renderPostPreview = (record) => {
    if (record.type === "text") {
      return (
        <div
          style={{
            height: "120px",
            padding: "12px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              textAlign: "center",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{
              __html: record.content
                ? record.content.substring(0, 100) + "..."
                : record.title
                ? record.title.substring(0, 100) + "..."
                : "No content",
            }}
          />
        </div>
      );
    } else if (record.type === "image" && record.thumbnailUrl) {
      return (
        <img
          src={getVideoAndThumbnail(record.thumbnailUrl)}
          alt="preview"
          style={{
            width: "100%",
            height: "120px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      );
    } else if (record.type === "video" && record.thumbnailUrl) {
      return (
        <div style={{ position: "relative" }}>
          <img
            src={getVideoAndThumbnail(record.thumbnailUrl)}
            alt="thumbnail"
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VideoCameraOutlined style={{ color: "white", fontSize: "18px" }} />
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          height: "120px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        No preview available
      </div>
    );
  };


  if (isLoadingPosts) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Header with filters and add button */}
      <div className="flex justify-end items-center mb-6">
     

        <GradientButton
          type="primary"
          onClick={showFormModal}
          className="py-5"
          icon={<PlusOutlined />}
        >
          Add New Post
        </GradientButton>
      </div>

      {/* Cards Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        {posts.map((post, index) => {
          const actualIndex = (currentPage - 1) * pageSize + index + 1;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={post._id}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                bodyStyle={{ padding: "16px" }}
                cover={renderPostPreview(post)}
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined style={{ color: "#f55" }} />}
                    onClick={() => handleEdit(post._id)}
                    title="Edit"
                  />,
                  <Button
                    type="text"
                    icon={<EyeOutlined style={{ color: "#55f" }} />}
                    onClick={() => showDetailsModal(post)}
                    title="View Details"
                  />,
                  <Switch
                    size="small"
                    checked={post.status === "active"}
                    onChange={(checked) => handleStatusChange(checked, post)}
                    style={{
                      backgroundColor:
                        post.status === "active" ? "red" : "gray",
                    }}
                    title="Toggle Status"
                  />,
                  <Button
                    type="text"
                    icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                    onClick={() => handleDeletePost(post._id)}
                    title="Delete"
                  />,
                ]}
              >
                {/* Card Header */}
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        fontWeight: "500",
                      }}
                    >
                      #{actualIndex}
                    </span>
                    <Tag
                      icon={getPostTypeIcon(post.type)}
                      color={getPostTypeColor(post.type)}
                      style={{ margin: 0 }}
                    >
                      {post.type?.toUpperCase()}
                    </Tag>
                  </div>

                  {/* Title */}
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                      lineHeight: "1.3",
                      height: "40px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: post.title || "Untitled Post",
                    }}
                  />
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <CalendarOutlined
                      style={{ color: "#999", fontSize: "12px" }}
                    />
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {moment(post.createdAt).format("MMM DD, YYYY")}
                    </span>
                  </div>

                  <Tag
                    color={post.status === "active" ? "success" : "error"}
                    style={{ margin: 0, fontSize: "11px" }}
                  >
                    {post.status === "active" ? "Active" : "Inactive"}
                  </Tag>
                </div>

                {/* Duration for video posts */}
                {post.type === "video" && post.duration && (
                  <div style={{ marginTop: "8px", textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        backgroundColor: "#f0f0f0",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      Duration: {post.duration}s
                    </span>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Empty State */}
      {posts.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#fafafa",
            borderRadius: "12px",
            border: "1px dashed #d9d9d9",
          }}
        >
          <FileTextOutlined
            style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "16px" }}
          />
          <h3 style={{ color: "#999", margin: 0 }}>No posts found</h3>
          <p style={{ color: "#999", marginTop: "8px" }}>
            Create your first post to get started
          </p>
        </div>
      )}



      {/* Post Form Modal */}
      <PostFormModal
        visible={isFormModalVisible}
        onClose={handleFormModalClose}
        onSubmit={handleFormSubmit}
        editingItem={currentEditingPost}
        loading={isSubmitting}
        postType={currentEditingPost?.type || null}
        isEditing={!!editingId}
      />

      {/* Post Details Modal */}
      {/* <PostDetailsModal
        visible={isDetailsModalVisible}
        onCancel={handleDetailsModalClose}
        currentPost={postDetails?.data}
        loading={isLoadingDetails}
      /> */}
    </div>
  );
};

export default PostManagementSystem;
