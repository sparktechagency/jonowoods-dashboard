import { api } from "../api/baseApi";

const comingSoonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Create a new Coming Soon entry
    createComingSoon: builder.mutation({
      query: (data) => {
        return {
          url: "/admin/comingSoon/create",
          method: "POST",
          body: data,
        };
      },
    }),

    // GET: Retrieve all Coming Soon entries
    getAllComingSoon: builder.query({
      query: () => {
        return {
          url: "/admin/comingSoon/all",
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),

    // PATCH: Update a Coming Soon entry
    updateComingSoon: builder.mutation({
      query: ({ id, comingSoonData }) => {
        return {
          url: `/admin/comingSoon/update/${id}`,
          method: "PUT",
          body: comingSoonData,
        };
      },
    }),

    // DELETE: Delete a Coming Soon entry
    deleteComingSoon: builder.mutation({
      query: (id) => {
        return {
          url: `/admin/comingSoon/delete/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useCreateComingSoonMutation,
  useGetAllComingSoonQuery,
  useUpdateComingSoonMutation,
  useDeleteComingSoonMutation,
} = comingSoonApi;
