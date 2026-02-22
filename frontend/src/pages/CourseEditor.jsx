import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CurriculumManager from "../components/CurriculumManager";

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    category: "Development",
    difficulty: "all",
    description: "",
    price: 0,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // State mới để lưu link ảnh preview

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/courses/${id}`,
          );
          setFormData({
            title: res.data.title,
            category: res.data.category || "Development",
            description: res.data.description,
            price: res.data.price,
          });

          // Nếu khóa học đã có ảnh bìa, hiển thị nó lên
          if (res.data.thumbnail_url) {
            setPreviewUrl(`http://localhost:5000${res.data.thumbnail_url}`);
          }

          setLoading(false);
        } catch (err) {
          alert("Không thể tải thông tin khóa học!");
          navigate("/lecturer/dashboard");
        }
      };
      fetchCourse();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Hàm xử lý khi chọn file mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Tạo một URL tạm thời để hiển thị ảnh ngay lập tức mà chưa cần up lên server
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveAndContinue = async () => {
    if (!formData.title) return alert("Vui lòng nhập tên khóa học");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (thumbnailFile) data.append("thumbnail", thumbnailFile);

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/courses/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setStep(2);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/courses",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        navigate(`/lecturer/course/edit/${response.data.course.id}`, {
          replace: true,
        });
        setStep(2);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      // Gửi yêu cầu cập nhật để đảm bảo status là PENDING (hoặc do BE tự xử lý)
      await axios.put(
        `http://localhost:5000/api/courses/${id}`,
        { status: "PENDING" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowPublishModal(false);
      navigate("/lecturer/dashboard");
    } catch (err) {
      alert("Lỗi khi gửi yêu cầu duyệt khóa học!");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Đang tải...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pb-20 font-sans">
      {/* --- HEADER & PROGRESS BAR --- */}
      <div className="bg-[#1e293b] border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-bold text-white text-lg">Course Builder</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/lecturer/dashboard")}
              className="px-4 py-2 border border-slate-600 rounded text-sm hover:bg-slate-800 transition"
            >
              Exit
            </button>
            <button className="px-4 py-2 border border-slate-600 rounded text-sm bg-slate-800 hover:bg-slate-700 transition">
              Save Draft
            </button>
          </div>
        </div>

        {/* Trục Step */}
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center text-sm font-semibold text-slate-500">
          <div
            className={`flex flex-col gap-2 w-1/2 ${step >= 1 ? "text-blue-500" : ""}`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step > 1 ? "bg-green-500 text-white" : "border-2 border-current"}`}
              >
                {step > 1 && "✓"}
              </span>
              STEP 1
            </span>
            <span className={`text-base ${step >= 1 ? "text-white" : ""}`}>
              Course Planning
            </span>
            <div
              className={`h-1 w-full rounded mt-1 ${step >= 1 ? "bg-blue-600" : "bg-slate-700"}`}
            ></div>
          </div>

          <div
            className={`flex flex-col gap-2 w-1/2 text-right items-end ${step >= 2 ? "text-blue-500" : ""}`}
          >
            <span>STEP 2</span>
            <span className={`text-base ${step >= 2 ? "text-white" : ""}`}>
              Content Upload
            </span>
            <div
              className={`h-1 w-full rounded mt-1 ${step >= 2 ? "bg-blue-600" : "bg-slate-700"}`}
            ></div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Plan your new course
                </h1>
                <p className="text-slate-400">
                  Start with the basics to help students discover your content.
                </p>
              </div>

              {/* Box: Course Title & Category */}
              <div className="bg-[#1e293b] p-6 rounded-lg border border-slate-700 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Complete Python Bootcamp..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Giá tiền (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Development">Development</option>
                      <option value="Business">Business</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="IT & Software">IT & Software</option>
                      <option value="Photography">Photography</option>
                      <option value="Music">Music</option>
                      <option value="Personal Development">
                        Personal Development
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Difficulty Level
                    </label>
                    <select className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-blue-500">
                      <option>All Levels</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Box: Description */}
              <div className="bg-[#1e293b] p-6 rounded-lg border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-300">
                    Course Description
                  </label>
                  <button className="text-blue-500 text-xs font-bold flex items-center gap-1">
                    <span className="text-lg">✨</span> AI Generate
                  </button>
                </div>
                <div className="bg-[#0f172a] border border-slate-600 rounded-t p-2 flex gap-3 text-slate-400 border-b-0">
                  <button className="hover:text-white font-bold">B</button>
                  <button className="hover:text-white italic">I</button>
                  <button className="hover:text-white underline">U</button>
                  <button className="hover:text-white ml-2">🔗</button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-b p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Describe what students will learn in your course..."
                />
              </div>

              {/* ================= THUMBNAIL BOX NÂNG CẤP ================= */}
              <div className="bg-[#1e293b] p-6 rounded-lg border border-slate-700 flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Khu vực hiển thị ảnh hoặc Icon Cloud */}
                <div className="w-40 h-24 bg-[#0f172a] border border-dashed border-slate-600 rounded flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 opacity-70"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                      <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                    </svg>
                  )}
                </div>

                {/* Khu vực nút bấm và Text */}
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">
                    Course Thumbnail
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Upload your course image here. Important guidelines: 750x422
                    pixels; .jpg, .jpeg, .gif, or .png. no text on the image.
                  </p>
                  <div className="flex items-center gap-4">
                    {/* Nút Chọn File */}
                    <label className="cursor-pointer bg-[#334155] hover:bg-[#475569] text-white text-sm font-semibold py-2.5 px-5 rounded-md transition duration-200 shadow-sm border border-slate-600">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {/* Hiển thị tên file NỔI BẬT */}
                    {thumbnailFile ? (
                      <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-2 rounded-md max-w-[250px] shadow-inner">
                        <span className="text-blue-400">🖼️</span>
                        <span className="text-sm text-blue-400 font-bold truncate">
                          {thumbnailFile.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500 font-medium">
                        No file chosen
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* ========================================================= */}
            </>
          )}

          {step === 2 && <CurriculumManager courseId={id} />}
        </div>

        {/* Cột phải: Sidebar Tips */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-6 rounded-lg border border-blue-900/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600/20 text-blue-400 rounded flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  Course Assistant
                </h3>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  AI Powered Tips
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              {step === 1
                ? "Great titles are short and descriptive. Try to include 1-2 keywords that students might search for."
                : "Micro-learning is trending! Try keeping video lectures under 6 minutes to maximize student retention."}
            </p>
            <div className="bg-[#0f172a] border border-slate-700 rounded p-4 mb-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">
                Suggestion
              </p>
              <p className="text-sm text-white italic">
                {step === 1
                  ? `"Mastering Python: From Beginner to Pro"`
                  : "Start with a strong 'Hook'. Include a quiz every 3 videos."}
              </p>
            </div>
            <button className="w-full py-2 border border-blue-600/50 text-blue-400 text-sm font-bold rounded hover:bg-blue-600/10 transition">
              {step === 1 ? "Generate More Ideas" : "Analyze My Structure"}
            </button>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-green-500">✓</span> Creation Checklist
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="text-slate-500 line-through">Create account</li>
              <li
                className={
                  step === 1
                    ? "text-white font-bold"
                    : "text-slate-500 line-through"
                }
              >
                Plan curriculum
              </li>
              <li
                className={
                  step === 2
                    ? 'text-white font-bold relative pl-4 before:content-["•"] before:text-blue-500 before:absolute before:left-0'
                    : "text-slate-500"
                }
              >
                Upload Content
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-[#1e293b] border-t border-slate-800 p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() =>
              step > 1 ? setStep(step - 1) : navigate("/lecturer/dashboard")
            }
            className="text-slate-400 hover:text-white font-bold text-sm flex items-center gap-2"
          >
            ← Back {step === 1 ? "to Dashboard" : "to Planning"}
          </button>

          <button
            onClick={
              step === 1
                ? handleSaveAndContinue
                : () => setShowPublishModal(true)
            }
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {saving ? "Saving..." : step === 1 ? "Save & Continue" : "Publish"}{" "}
            →
          </button>
        </div>
      </div>

      {/* PUBLISH CONFIRMATION MODAL */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-8 max-w-sm w-full shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              🚀
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-3">
              Sẵn sàng xuất bản?
            </h2>
            <p className="text-slate-400 text-center mb-8">
              Khóa học của bạn sẽ được gửi đến Admin để phê duyệt. Bạn vẫn có
              thể chỉnh sửa sau khi xuất bản.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePublish}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                {saving ? "Đang xử lý..." : "Xác nhận & Gửi duyệt"}
              </button>
              <button
                onClick={() => setShowPublishModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEditor;
