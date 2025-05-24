import { api } from "../api/baseApi";

const loginCredentialApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBackUpAdmin: builder.mutation({
      query: (subCategoryData) => {
        return {
          url: "/admin/managment/create-admin",
          method: "POST",
          body: subCategoryData,
        };
      },
      invalidatesTags: ["Admin"],
    }),
    updateBackUpAdmin: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/admin/subcategory/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["SubCategories"],
    }),
    deleteBackUpAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `/admin/managment/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["SubCategories"],
    }),
    getLoginCredentials: builder.query({
      query: () => {
        return {
          url: "/admin/managment/get-admin",
          method: "GET",
        };
      },
      providesTags: ["SubCategories"],
    }),
    getSingleSubCategory: builder.query({
      query: (selectedCategoryId) => {
        return {
          url: `/admin/subcategory/${selectedCategoryId}`,
          method: "GET",
        };
      },
      providesTags: ["SubCategories"],
    }),
    toggleBackUpAdminStatus: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/admin/subcategory/${id}`,
          method: "PUT",
          body: { status },
        };
      },
      invalidatesTags: ["SubCategories"],
    }),
  }),
});

export const {
  useGetLoginCredentialsQuery,
  useCreateBackUpAdminMutation,
  useUpdateBackUpAdminMutation,
  useDeleteBackUpAdminMutation,
  useGetSingleSubCategoryQuery,
  useToggleBackUpAdminStatusMutation,
} = loginCredentialApi;
