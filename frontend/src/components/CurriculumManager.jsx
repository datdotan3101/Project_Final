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
  });
  const [lessonFile, setLessonFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Edit states
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editLessonData, setEditLessonData] = useState({ title: "" });
  const [editLessonFile, setEditLessonFile] = useState(null);

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

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return alert("Vui lòng nhập tên chương!");
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/sections`,
        { title: newSectionTitle, order_index: sections.length },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      setNewSectionTitle("");
      setIsAddingSection(false);
      fetchCurriculum();
    } catch (err) {
      alert("Lỗi thêm chương!");
    }
  };

  const handleAddLesson = async (sectionId) => {
    if (!lessonData.title.trim() || isUploading || !lessonFile) {
      return alert("Vui lòng nhập tiêu đề và chọn file video!");
    }
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", lessonData.title);
      formData.append("content_type", lessonData.content_type);
      const currentSection = sections.find((s) => s.id === sectionId);
      formData.append(
        "order_index",
        currentSection.lessons ? currentSection.lessons.length : 0,
      );
      formData.append("video", lessonFile);

      await axios.post(
        `http://localhost:5000/api/courses/sections/${sectionId}/lessons`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setAddingLessonTo(null);
      setLessonData({ title: "", content_type: "VIDEO" });
      setLessonFile(null);
      fetchCurriculum();
    } catch (err) {
      console.error(err);
      alert("Lỗi upload bài học!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Xóa chương này?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/courses/sections/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      fetchCurriculum();
    } catch (err) {
      alert("Lỗi!");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Xóa bài học?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/courses/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      fetchCurriculum();
    } catch (err) {
      alert("Lỗi!");
    }
  };

  const handleUpdateLesson = async (lessonId) => {
    if (!editLessonData.title.trim() || isUploading) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", editLessonData.title);
      if (editLessonFile) {
        formData.append("video", editLessonFile);
      }

      await axios.put(
        `http://localhost:5000/api/courses/lessons/${lessonId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setEditingLessonId(null);
      setEditLessonFile(null);
      fetchCurriculum();
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật bài học!");
    } finally {
      setIsUploading(false);
    }
  };

  const startEditing = (lesson) => {
    setEditingLessonId(lesson.id);
    setEditLessonData({ title: lesson.title });
    setEditLessonFile(null);
  };

  // --- DRAG & DROP LOGIC ---
  const handleDragStart = (e, index, sectionId) => {
    e.dataTransfer.setData("lessonIndex", index);
    e.dataTransfer.setData("sectionId", sectionId);
    e.target.style.opacity = "0.4";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetIndex, targetSectionId) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("lessonIndex"));
    const sourceSectionId = parseInt(e.dataTransfer.getData("sectionId"));

    if (sourceSectionId === targetSectionId && sourceIndex === targetIndex)
      return;

    const newSections = [...sections];
    const sourceSectionIdx = newSections.findIndex(
      (s) => s.id === sourceSectionId,
    );
    const targetSectionIdx = newSections.findIndex(
      (s) => s.id === targetSectionId,
    );

    const sourceLessons = [...newSections[sourceSectionIdx].lessons];
    const [movedLesson] = sourceLessons.splice(sourceIndex, 1);

    let lessonsToUpdate = [];

    if (sourceSectionId === targetSectionId) {
      // Reorder trong cùng section
      sourceLessons.splice(targetIndex, 0, movedLesson);
      const updated = sourceLessons.map((l, idx) => ({
        ...l,
        order_index: idx,
      }));
      newSections[sourceSectionIdx].lessons = updated;
      lessonsToUpdate = updated.map((l) => ({
        id: l.id,
        order_index: l.order_index,
      }));
    } else {
      // Di chuyển sang section khác
      const targetLessons = [...newSections[targetSectionIdx].lessons];
      targetLessons.splice(targetIndex, 0, movedLesson);

      const updatedSource = sourceLessons.map((l, idx) => ({
        ...l,
        order_index: idx,
      }));
      const updatedTarget = targetLessons.map((l, idx) => ({
        ...l,
        order_index: idx,
        section_id: targetSectionId,
      }));

      newSections[sourceSectionIdx].lessons = updatedSource;
      newSections[targetSectionIdx].lessons = updatedTarget;

      lessonsToUpdate = [
        ...updatedSource.map((l) => ({ id: l.id, order_index: l.order_index })),
        ...updatedTarget.map((l) => ({
          id: l.id,
          order_index: l.order_index,
          section_id: targetSectionId,
        })),
      ];
    }

    setSections(newSections);

    try {
      await axios.put(
        "http://localhost:5000/api/courses/lessons/reorder",
        { lessons: lessonsToUpdate },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
    } catch (err) {
      console.error("Lỗi khi sắp xếp bài học:", err);
      fetchCurriculum();
    }
  };

  if (loading)
    return <div className="text-slate-500 p-10">Đang tải giáo trình...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Curriculum</h1>
        <p className="text-slate-400">
          Manage your course sections and lessons.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-[#0f172a]/50 p-4 border-b border-slate-700 flex justify-between items-center text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">⣿</span>
                <span className="font-bold text-sm uppercase tracking-wider">
                  Section {index + 1}:{" "}
                  <span className="text-white ml-1">{section.title}</span>
                </span>
              </div>
              <button
                onClick={() => handleDeleteSection(section.id)}
                className="text-slate-500 hover:text-red-400"
              >
                🗑
              </button>
            </div>

            {/* Lesson List */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) =>
                handleDrop(
                  e,
                  section.lessons ? section.lessons.length : 0,
                  section.id,
                )
              }
              className="p-5 space-y-3 min-h-[50px] transition-colors"
            >
              {section.lessons?.map((lesson, lIdx) => (
                <div
                  key={lesson.id}
                  className="space-y-3"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleDrop(e, lIdx, section.id);
                  }}
                >
                  {editingLessonId === lesson.id ? (
                    /* Edit Lesson Form */
                    <div className="bg-[#0f172a] border border-blue-500/50 p-5 rounded space-y-4">
                      <input
                        type="text"
                        value={editLessonData.title}
                        onChange={(e) =>
                          setEditLessonData({
                            ...editLessonData,
                            title: e.target.value,
                          })
                        }
                        className="w-full bg-[#1e293b] border border-slate-700 rounded p-3 text-white text-sm focus:border-blue-500 outline-none"
                      />

                      <div className="border border-dashed border-slate-600 rounded p-6 text-center bg-[#1e293b] relative">
                        <input
                          type="file"
                          id={`edit-file-${lesson.id}`}
                          accept="video/*"
                          onChange={(e) => setEditLessonFile(e.target.files[0])}
                          className="hidden"
                        />
                        <label
                          htmlFor={`edit-file-${lesson.id}`}
                          className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-xs font-semibold inline-block mb-2"
                        >
                          {editLessonFile
                            ? "Change Video"
                            : "Replace Video (Optional)"}
                        </label>

                        {editLessonFile ? (
                          <p className="text-green-400 text-xs font-medium mt-2 truncate max-w-xs mx-auto">
                            ✅ Mới: {editLessonFile.name}
                          </p>
                        ) : lesson.content_url_or_text ? (
                          <div className="mt-2 text-blue-400 text-xs font-medium space-y-1">
                            <p>🎞️ Video hiện tại:</p>
                            <p className="bg-[#0f172a] p-1.5 rounded truncate max-w-xs mx-auto border border-blue-500/20">
                              {lesson.content_url_or_text.split("/").pop()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-xs mt-2 italic">
                            Chưa có video
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingLessonId(null)}
                          className="text-slate-400 hover:text-white text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateLesson(lesson.id)}
                          disabled={isUploading}
                          className={`px-5 py-2 text-white text-sm font-bold rounded ${isUploading ? "bg-slate-600" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                          {isUploading ? "Updating..." : "Update Lesson"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Lesson Item Display */
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, lIdx, section.id)}
                      onDragEnd={handleDragEnd}
                      className="bg-[#0f172a] border border-slate-700 p-4 rounded flex justify-between items-center group hover:border-slate-500 transition cursor-move"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 opacity-60 group-hover:opacity-100">
                          ⣿
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 text-xs font-bold">
                          {lIdx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 text-sm">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                            <span>🎥 Video</span>
                            <span>•</span>
                            <span>--:--</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => startEditing(lesson)}
                          className="text-slate-400 hover:text-white"
                        >
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
                  )}
                </div>
              ))}

              {/* Form Add Lesson */}
              {addingLessonTo !== section.id ? (
                <button
                  onClick={() => setAddingLessonTo(section.id)}
                  className="mt-2 text-sm font-bold text-blue-500 flex items-center gap-2 hover:text-blue-400 transition ml-8"
                >
                  <span className="text-lg">+</span> Add Curriculum Item
                </button>
              ) : (
                <div className="bg-[#0f172a] border border-blue-500/50 p-5 rounded mt-3 ml-8 space-y-4">
                  <input
                    type="text"
                    placeholder="New Lecture Title"
                    value={lessonData.title}
                    onChange={(e) =>
                      setLessonData({ ...lessonData, title: e.target.value })
                    }
                    className="w-full bg-[#1e293b] border border-slate-700 rounded p-3 text-white text-sm focus:border-blue-500 outline-none"
                  />

                  <div className="border border-dashed border-slate-600 rounded p-6 text-center bg-[#1e293b] relative">
                    <input
                      type="file"
                      id={`file-${section.id}`}
                      accept="video/*"
                      onChange={(e) => setLessonFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor={`file-${section.id}`}
                      className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-xs font-semibold inline-block mb-2"
                    >
                      {lessonFile ? "Change Video" : "Choose Video File"}
                    </label>
                    {lessonFile && (
                      <p className="text-green-400 text-xs font-medium mt-2 truncate max-w-xs mx-auto">
                        ✅ {lessonFile.name}
                      </p>
                    )}
                    {!lessonFile && (
                      <p className="text-slate-500 text-xs">No video chosen</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setAddingLessonTo(null);
                        setLessonFile(null);
                      }}
                      className="text-slate-400 hover:text-white text-sm"
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
              )}
            </div>
          </div>
        ))}

        {/* Add Section Button */}
        {!isAddingSection ? (
          <button
            onClick={() => setIsAddingSection(true)}
            className="w-full py-4 border-2 border-dashed border-slate-700 text-slate-400 font-bold rounded-lg hover:border-blue-500 hover:text-blue-500 transition bg-[#1e293b]/50"
          >
            + Add New Section
          </button>
        ) : (
          <div className="bg-[#1e293b] border border-blue-500/50 p-5 rounded-lg flex gap-3">
            <input
              type="text"
              placeholder="e.g. Introduction"
              autoFocus
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="flex-1 bg-[#0f172a] border border-slate-700 rounded p-3 text-white text-sm focus:border-blue-500 outline-none"
            />
            <button
              onClick={handleAddSection}
              className="bg-blue-600 text-white px-6 rounded font-bold hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingSection(false)}
              className="text-slate-400 hover:text-white px-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumManager;
