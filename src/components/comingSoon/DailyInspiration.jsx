import { useCreateDailyInspirationMutation, useDeleteDailyInspirationMutation, useGetAllDailyInspirationQuery, useGetDailyInspirationByIdQuery, useUpdateDailyInspirationMutation, useUpdateDailyInspirationStatusMutation } from "../../redux/apiSlices/dailyInspiraton";
import VideoUploadSystem from "../common/VideoUploade";


const DailyInspirationPage = () => {
  const [createDailyInspiration] = useCreateDailyInspirationMutation();
  const [updateDailyInspiration] = useUpdateDailyInspirationMutation();
  const [deleteDailyInspiration] = useDeleteDailyInspirationMutation();

  const categories = ["Daily Inspiration"];

  const apiHooks = {
    useGetAllQuery: useGetAllDailyInspirationQuery,
    useGetByIdQuery: useGetDailyInspirationByIdQuery,
    deleteItem: deleteDailyInspiration,
    updateItemStatus: updateDailyInspiration,
    createItem: createDailyInspiration,
    updateItem: useUpdateDailyInspirationStatusMutation,
    categories,
  };

  return (
    <div>
      <VideoUploadSystem pageType="daily-inspiration" apiHooks={apiHooks} />
    </div>
  );
};

export default DailyInspirationPage;
