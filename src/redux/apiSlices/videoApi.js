import { api } from "../api/baseApi";

const videoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Create a new video
    addVideo: builder.mutation({
      query: (data) => {
        return {
          url: "/admin/videos/managment/upload-video",
          method: "POST",
          body: data,
        };
      },
    }),

    // Updated getAllVideos query with proper filtering and pagination
    getAllVideos: builder.query({
      query: (args) => {
       
          const params = new URLSearchParams();
  
          if (args) {
            args.forEach((arg) => {
              params.append(arg.name, arg.value);
            });
          }

        return {
          url: "/admin/videos/managment/videos",
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => {
        return {
          data: response.data || [],
          pagination: response.pagination || {
            total: 0,
            current: 1,
            pageSize: 10,
          },
        };
      },
      providesTags: ["Videos"],
    }),

    getVideoById: builder.query({
      query: (id) => {
        return {
          url: `/admin/videos/managment/videos/${id}`,
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),

    // PATCH: Update an existing video
    updateVideo: builder.mutation({
      query: ({ id, videoData }) => {
        return {
          url: `/admin/videos/managment/update-video/${id}`,
          method: "PUT",
          body: videoData,
        };
      },
    }),

    // DELETE: Delete a video
    deleteVideo: builder.mutation({
      query: (id) => {
        return {
          url: `/admin/videos/managment/video-delete/${id}`,
          method: "DELETE",
        };
      },
    }),

    // NEW: Toggle video status (active/inactive)
    updateVideoStatus: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/admin/videos/managment/video-status/${id}`,
          method: "PUT",
          body: { status },
        };
      },
    }),
  }),
});

export const {
  useAddVideoMutation,
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useUpdateVideoStatusMutation, 
} = videoApi;
