import {
  useCreateComingSoonMutation,
  useDeleteComingSoonMutation,
  useGetAllComingSoonQuery,
  useUpdateComingSoonMutation,
} from "../../redux/apiSlices/comingSoonApi";
import VideoUploadSystem from "../common/VideoUploade";

const CommingSoonVideoPage = () => {
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
    updateItemStatus: updateComingSoon, // or null if you don't have a specific status update
    createItem: createComingSoon,
    updateItem: updateComingSoon,
    categories, // Pass categories array
  };

  return (
    <div>
      <VideoUploadSystem pageType="coming-soon" apiHooks={apiHooks} />
    </div>
  );
};

export default CommingSoonVideoPage;
