import { api } from "../api/baseApi";

const dailyInspirationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Create a new Daily Inspiration entry
    createDailyInspiration: builder.mutation({
      query: (data) => ({
        url: "/admin/dailyInspiration/create",
        method: "POST",
        body: data,
      }),
    }),

    // GET: Retrieve all Daily Inspiration entries
    getAllDailyInspiration: builder.query({
      query: () => ({
        url: "/admin/dailyInspiration",
        method: "GET",
      }),
    }),

    // GET: Retrieve single Daily Inspiration by id
    getDailyInspirationById: builder.query({
      query: (id) => `/admin/dailyInspiration/${id}`,
      method: "GET",
    }),

    // PATCH: Update a Daily Inspiration entry
    updateDailyInspiration: builder.mutation({
      query: ({ id, dailyInspirationData }) => ({
        url: `/admin/dailyInspiration/${id}`,
        method: "PATCH",
        body: dailyInspirationData,
      }),
    }),

    // DELETE: Delete a Daily Inspiration entry
    deleteDailyInspiration: builder.mutation({
      query: (id) => ({
        url: `/admin/dailyInspiration/${id}`,
        method: "DELETE",
      }),
    }),

    // Optionally update status only
    updateDailyInspirationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/dailyInspiration/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useCreateDailyInspirationMutation,
  useGetAllDailyInspirationQuery,
  useGetDailyInspirationByIdQuery,
  useUpdateDailyInspirationMutation,
  useDeleteDailyInspirationMutation,
  useUpdateDailyInspirationStatusMutation,
} = dailyInspirationApi;
