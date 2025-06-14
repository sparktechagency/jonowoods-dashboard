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
      invalidatesTags: ["DailyInspiration"],
    }),

    // GET: Retrieve all Daily Inspiration entries
    getAllDailyInspiration: builder.query({
      query: () => ({
        url: "/admin/dailyInspiration",
        method: "GET",
      }),
      providesTags: ["DailyInspiration"],
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
      invalidatesTags: ["DailyInspiration"],
    }),

    // DELETE: Delete a Daily Inspiration entry
    deleteDailyInspiration: builder.mutation({
      query: (id) => ({
        url: `/admin/dailyInspiration/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DailyInspiration"],
    }),

    // Optionally update status only
    updateDailyInspirationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/dailyInspiration/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["DailyInspiration"],
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
