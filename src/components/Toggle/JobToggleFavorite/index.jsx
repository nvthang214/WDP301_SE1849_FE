import { useState } from "react";

import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import { JobService } from "../../../services/JobService";
import { notifySuccess, notifyWarning, notifyError } from "../../Notification";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import ROUTER from "../../../router/ROUTER";

const JobToggleFavorite = ({ jobId, isFavorite }) => {
  const [fav, setFav] = useState(isFavorite);
  const nav = useNavigate();
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
        nav(ROUTER.LOGIN);
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
    <div>
      <button type="button" onClick={handleToggleFavorite}>
        <div className="focus:outline-none">
          <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            {fav ? (
              <BookmarkCheck size={25} style={{ color: "var(--color-primary-500)" }} />
            ) : (
              <BookmarkPlus size={25} />
            )}
          </Tooltip>
        </div>
      </button>
    </div>
  );
};

export default JobToggleFavorite;
