import React, { useState, useEffect } from "react";
import axios from "axios";

const CurriculumManager = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // States
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingLessonTo, setAddingLessonTo] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: "",
    content_type: "VIDEO",
    text_content: "",
  });
  const [lessonFile, setLessonFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Lấy dữ liệu (Giữ nguyên logic API)
  const fetchCurriculum = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${courseId}`,
      );
      setSections(res.data.sections || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);
  const getToken = () => localStorage.getItem("token");

  // ... (GIỮ NGUYÊN TOÀN BỘ CÁC HÀM handleAddSection, handleEditSection, handleDeleteSection, handleAddLesson, handleDeleteLesson NHƯ CŨ, MÌNH CHỈ SỬA UI Ở DƯỚI) ...

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return alert("Vui lòng nhập tên chương!");
    try {
      // Lưu ý: Đảm bảo URL này khớp với Backend của bạn.
      // Nếu Backend dùng params (/:courseId/sections), hãy đổi URL bên dưới.
      await axios.post(
        "http://localhost:5000/api/courses/sections",
        {
          course_id: parseInt(courseId),
          title: newSectionTitle,
          order_index: sections.length,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      setNewSectionTitle("");
      setIsAddingSection(false);
      fetchCurriculum();
    } catch (err) {
      console.error("Lỗi BE trả về:", err.response?.data || err);
      // Hiển thị chính xác lỗi từ Backend gửi về
      alert(
        `Lỗi: ${err.response?.data?.message || err.message || "Không xác định"}`,
      );
    }
  };

  const handleAddLesson = async (sectionId) => {
    if (!lessonData.title.trim() || isUploading) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("section_id", sectionId);
      formData.append("title", lessonData.title);
      formData.append("content_type", lessonData.content_type);

      const currentSection = sections.find((s) => s.id === sectionId);
      formData.append(
        "order_index",
        currentSection.lessons ? currentSection.lessons.length : 0,
      );

      if (lessonData.content_type === "VIDEO") {
        formData.append("video", lessonFile);
      } else {
        formData.append("text_content", lessonData.text_content);
      }

      await axios.post("http://localhost:5000/api/courses/lessons", formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAddingLessonTo(null);
      setLessonData({ title: "", content_type: "VIDEO", text_content: "" });
      setLessonFile(null);
      fetchCurriculum();
    } catch (err) {
      console.error("Lỗi BE trả về:", err.response?.data || err);
      alert(
        `Lỗi: ${err.response?.data?.message || err.message || "Không xác định"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    /* Giữ nguyên code cũ */
    if (!window.confirm("Xóa chương này?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/courses/sections/${sectionId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      fetchCurriculum();
    } catch (err) {
      alert("Lỗi!");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    /* Giữ nguyên code cũ */
    if (!window.confirm("Xóa bài học?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/courses/lessons/${lessonId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      fetchCurriculum();
    } catch (err) {
      alert("Lỗi!");
    }
  };

  if (loading)
    return <div className="text-slate-500">Đang tải giáo trình...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Curriculum</h1>
        <p className="text-slate-400">
          Start putting together your course by creating sections, lectures and
          quizzes.
        </p>
      </div>

      {/* DANH SÁCH SECTION */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden"
          >
            {/* Header của Section */}
            <div className="bg-[#0f172a]/50 p-4 border-b border-slate-700 flex justify-between items-center text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 cursor-move">⣿</span>
                <span className="font-bold text-sm uppercase tracking-wider">
                  Section {index + 1}:{" "}
                  <span className="text-white ml-1">{section.title}</span>
                </span>
                <button className="text-slate-500 hover:text-white">✎</button>
              </div>
              <button
                onClick={() => handleDeleteSection(section.id)}
                className="text-slate-500 hover:text-red-400 transition"
              >
                🗑
              </button>
            </div>

            {/* Danh sách Lesson của Section */}
            <div className="p-5 space-y-3">
              {section.lessons &&
                section.lessons.length > 0 &&
                section.lessons.map((lesson, lIdx) => (
                  <div
                    key={lesson.id}
                    className="bg-[#0f172a] border border-slate-700 p-4 rounded flex justify-between items-center group hover:border-slate-500 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-slate-600 opacity-0 group-hover:opacity-100 transition cursor-move">
                        ⣿
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                        {lessonData.content_type === "VIDEO" ? (
                          <div className="border border-dashed border-slate-600 rounded p-6 flex flex-col items-center justify-center bg-[#1e293b] gap-3">
                            <label className="cursor-pointer bg-[#334155] hover:bg-[#475569] text-white text-sm font-semibold py-2 px-5 rounded-md transition shadow-sm border border-slate-600">
                              Choose Video File
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                  setLessonFile(e.target.files[0])
                                }
                                className="hidden"
                              />
                            </label>

                            {/* Hiển thị tên file Video nổi bật */}
                            {lessonFile ? (
                              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-md max-w-full">
                                <span className="text-green-400">🎥</span>
                                <span className="text-sm text-green-400 font-bold truncate">
                                  {lessonFile.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-slate-500 font-medium">
                                No video chosen
                              </span>
                            )}
                          </div>
                        ) : (
                          <textarea
                            placeholder="Article content..."
                            rows="4"
                            value={lessonData.text_content}
                            onChange={(e) =>
                              setLessonData({
                                ...lessonData,
                                text_content: e.target.value,
                              })
                            }
                            className="w-full bg-[#1e293b] border border-slate-700 rounded p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-sm">
                          {lIdx + 1}. {lesson.title}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span>
                            {lesson.content_type === "VIDEO"
                              ? "Video"
                              : "Article"}
                          </span>
                          <span>•</span>
                          <span>--:--</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                      <button className="text-slate-400 hover:text-white">
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}

              {/* NÚT / FORM THÊM BÀI HỌC */}
              {addingLessonTo !== section.id ? (
                <button
                  onClick={() => setAddingLessonTo(section.id)}
                  className="mt-2 text-sm font-bold text-blue-500 flex items-center gap-2 hover:text-blue-400 transition ml-8"
                >
                  <span className="text-lg leading-none">+</span> Add Curriculum
                  Item
                </button>
              ) : (
                <div className="bg-[#0f172a] border border-blue-500/50 p-5 rounded mt-3 ml-8">
                  <div className="flex items-center gap-4 mb-4 border-b border-slate-700 pb-3">
                    <button
                      onClick={() =>
                        setLessonData({ ...lessonData, content_type: "VIDEO" })
                      }
                      className={`text-sm font-bold pb-3 border-b-2 -mb-[13px] ${lessonData.content_type === "VIDEO" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
                    >
                      + Video
                    </button>
                    <button
                      onClick={() =>
                        setLessonData({ ...lessonData, content_type: "TEXT" })
                      }
                      className={`text-sm font-bold pb-3 border-b-2 -mb-[13px] ${lessonData.content_type === "TEXT" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
                    >
                      + Article
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="New Lecture Title"
                      value={lessonData.title}
                      onChange={(e) =>
                        setLessonData({ ...lessonData, title: e.target.value })
                      }
                      className="w-full bg-[#1e293b] border border-slate-700 rounded p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    />

                    {lessonData.content_type === "VIDEO" ? (
                      <div className="border border-dashed border-slate-600 rounded p-6 text-center bg-[#1e293b]">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setLessonFile(e.target.files[0])}
                          className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-slate-700 file:text-white"
                        />
                      </div>
                    ) : (
                      <textarea
                        placeholder="Article content..."
                        rows="4"
                        value={lessonData.text_content}
                        onChange={(e) =>
                          setLessonData({
                            ...lessonData,
                            text_content: e.target.value,
                          })
                        }
                        className="w-full bg-[#1e293b] border border-slate-700 rounded p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setAddingLessonTo(null)}
                        className="px-4 py-2 text-slate-400 hover:text-white text-sm font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddLesson(section.id)}
                        disabled={isUploading}
                        className={`px-5 py-2 text-white text-sm font-bold rounded ${isUploading ? "bg-slate-600" : "bg-blue-600 hover:bg-blue-700"}`}
                      >
                        {isUploading ? "Uploading..." : "Add Item"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* NÚT / FORM THÊM SECTION */}
        {!isAddingSection ? (
          <button
            onClick={() => setIsAddingSection(true)}
            className="w-full py-5 border-2 border-dashed border-slate-700 text-slate-400 font-bold rounded-lg hover:border-blue-500 hover:text-blue-500 transition bg-[#1e293b]/50"
          >
            + Add New Section
          </button>
        ) : (
          <div className="bg-[#1e293b] border border-blue-500/50 p-5 rounded-lg">
            <p className="text-sm font-bold text-slate-300 mb-3">
              New Section Title
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. Introduction"
                autoFocus
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="flex-1 bg-[#0f172a] border border-slate-700 rounded p-3 text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddSection}
                className="bg-blue-600 text-white px-6 font-bold rounded hover:bg-blue-700 text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingSection(false)}
                className="text-slate-400 hover:text-white px-4 font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumManager;
