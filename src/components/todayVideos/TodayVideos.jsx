import {
  useCreateComingSoonMutation,
  useDeleteComingSoonMutation,
  useGetAllComingSoonQuery,
  useUpdateComingSoonMutation,
} from "../../redux/apiSlices/comingSoonApi";
import VideoUploadSystem from "../common/VideoUploade";

const TodayVideos= () => {
  const [createComingSoon] = useCreateComingSoonMutation();
  const [updateComingSoon] = useUpdateComingSoonMutation();
  const [deleteComingSoon] = useDeleteComingSoonMutation();

  // Define categories for coming soon videos
  const categories = [
    "Video/Picture",
    "Fitness",
    "Yoga",
    "Meditation",
    "Workout",
  ];

  // Pass API hooks as props to VideoUploadSystem
  const apiHooks = {
    useGetAllQuery: useGetAllComingSoonQuery,
    deleteItem: deleteComingSoon,
    updateItemStatus: updateComingSoon, 
    createItem: createComingSoon,
    updateItem: updateComingSoon,
    categories, 
  };

  return (
    <div>
      <VideoUploadSystem pageType="today-video" apiHooks={apiHooks} />
    </div>
  );
};

export default TodayVideos;
