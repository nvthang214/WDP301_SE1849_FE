import { useState } from "react";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import { JobService } from "../../../services/JobService";
import { notifySuccess, notifyWarning, notifyError } from "../../Notification";
import { Tooltip } from "antd";

const JobToggleFavorite = ({ jobId, isFavorite }) => {
  const [fav, setFav] = useState(!!isFavorite);
  const handleToggleFavorite = async () => {
    setFav((prev) => !prev);
    try {
      const res = await JobService.toggleFavoriteJob(jobId);
      // if API returns actual status, sync it:
      if (res && typeof res.data?.isFavorite !== "undefined") {
        setFav(!!res.data.isFavorite);
      }
      notifySuccess(fav ? "Removed from favorites" : "Added to favorites");
    } catch (err) {
      // rollback on error
      setFav((prev) => !prev);
      console.error("Toggle favorite failed:", err);

      const status = err?.response?.status;

      if (status === 401 || status === 403) {
        // unauthorized / forbidden
        notifyWarning("Please log in to manage your favorite jobs.");
        // optional: redirect to login
        // window.location.href = "/login";
      } else if (!err?.response) {
        // network / no response
        notifyError("Network error. Please check your connection and try again.");
      } else {
        // other server errors
        const msg =
          err?.response?.data?.message || "Failed to update favorite status. Please try again.";
        notifyError(msg);
      }
    }
  };

  return (
    <button onClick={handleToggleFavorite} className="focus:outline-none">
      <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
        {fav ? <BookmarkCheck style={{ color: "var(--color-primary-500)" }} /> : <BookmarkPlus />}
      </Tooltip>
    </button>
  );
};

export default JobToggleFavorite;
