import React from "react";
import {
  useCreateComingSoonMutation,
  useDeleteComingSoonMutation,
  useGetAllComingSoonQuery,
  useGetComingSoonByIdQuery,
  useUpdateComingSoonMutation,
} from "../../redux/apiSlices/comingSoonApi";
import {
  useDeleteDailyChallegeMutation,
  useGetDailyChallengeQuery,
  useGetSingleDailyChallengeQuery,
  useNewDailyChallengeMutation,
  useUpdateDailyChallengeMutation,
} from "../../redux/apiSlices/dailyChallangeApi";
import VideoUploadSystem from "../common/VideoUploade";

const TodayVideos = () => {
  // Initialize all the hooks at the component level
  const [createDailyChallenge] = useNewDailyChallengeMutation();
  const [updateDailyChallenge] = useUpdateDailyChallengeMutation();
  const [deleteDailyChallenge] = useDeleteDailyChallegeMutation();
  const [updateComingSoon] = useUpdateComingSoonMutation();

  // Define categories for today's videos
  const categories = [
    "Video/Picture",
    "Fitness",
    "Yoga",
    "Meditation",
    "Workout",
  ];

  // Pass the initialized mutation functions and query hooks
  const apiHooks = {
    useGetAllQuery: useGetDailyChallengeQuery,
    useGetByIdQuery: useGetSingleDailyChallengeQuery,
    deleteItem: deleteDailyChallenge, 
    updateItemStatus: updateDailyChallenge, 
    createItem: createDailyChallenge, 
    updateItem: updateComingSoon, 
    categories,
  };

  return (
    <div>
      <VideoUploadSystem pageType="daily-challenge" apiHooks={apiHooks} />
    </div>
  );
};

export default TodayVideos;
