import { statusOptions, typeOptions } from "../../utils/constants";
import Input from "./input";
import "./form.scss";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useDispatch } from "react-redux";
import { createJob, updateJob } from "../../redux/slices/jopSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getJob } from "../../utils/service";

const Form = () => {
  const [editItem, setEditItem] = useState(null);
  const [status, setStatus] = useState(editItem?.status || "Mülakat");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useParams();

  useEffect(() => {
    if (mode === "create") return setEditItem(null);

    getJob(mode).then((data) => {
      setEditItem(data);
      setStatus(data.status);
    });
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData.entries());

    if (!editItem) {
      api
        .post("/jobs", jobData)
        .then((res) => {
          dispatch(createJob(res.data));
          navigate("/");
          toast.success("Başvuru oluşturuldu");
        })
        .catch((err) => {
          toast.error("Başvuru oluşturma başarısız");
        });
    } else {
      api
        .patch(`/jobs/${editItem.id}`, jobData)
        .then((res) => {
          dispatch(updateJob(res.data));

          navigate("/");

          toast.success("Güncelleme başarılı");
        })
        .catch((err) => {
          toast.error("Güncelleme başarısız");
        });
    }
  };

  const dateName =
    editItem?.status === "Mülakat"
      ? "interview_date"
      : editItem?.status === "Reddedildi"
      ? "rejection_date"
      : "date";

  const dateValue =
    editItem &&
    new Date(editItem[dateName])
      .toISOString()
      .slice(0, editItem.status === "Mülakat" ? 16 : 10);

  return (
    <div className="create-page">
      <section>
        <h2>{editItem ? "Başvuruyu Güncelle" : "Yeni Başvuru Oluştur"}</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Position" name="position" value={editItem?.position} />

          <Input label="Şirket" name="company" value={editItem?.company} />

          <Input label="Lokasyon" name="location" value={editItem?.location} />

          <Input
            label="Durum"
            name="status"
            options={statusOptions}
            handleChange={(e) => setStatus(e.target.value)}
            value={editItem?.status}
          />

          <Input
            label="Tür"
            name="type"
            options={typeOptions}
            value={editItem?.type}
          />

          <Input
            label={
              status === "Mülakat"
                ? "Mülakat Tarihi"
                : status === "Reddedildi"
                ? "Reddedilme Tarihi"
                : "Tarih"
            }
            name={
              status === "Mülakat"
                ? "interview_date"
                : status === "Reddedildi"
                ? "rejection_date"
                : "date"
            }
            type={status == "Mülakat" ? "datetime-local" : "date"}
            value={dateValue}
          />

          <div className="btn-wrapper">
            <button>{editItem ? "Güncelle" : "Oluştur"}</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Form;
