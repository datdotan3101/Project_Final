import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const CourseEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [activeTab, setActiveTab] = useState("curriculum");
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE: BASIC INFO & PRICING ---
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Development",
    price: "",
    thumbnail: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // --- STATE: CURRICULUM BUILDER ---
  const [curriculum, setCurriculum] = useState([]);

  // STATE MỚI: Quản lý xem bài học nào đang được mở ra để up video
  const [expandedLessonId, setExpandedLessonId] = useState(null);

  // --- STATE: DRAG & DROP LESSONS ---
  const [dragItem, setDragItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchedData = {
        title: "2024 Complete Python Bootcamp: From Zero to Hero",
        subtitle: "Learn Python like a Professional...",
        description: "Đây là mô tả chi tiết...",
        category: "Development",
        price: "12.99",
        thumbnail:
          "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80",
      };
      setFormData(fetchedData);
      setImagePreview(fetchedData.thumbnail);

      // Thêm trường videoName để lưu tên video đã upload
      setCurriculum([
        {
          id: "sec-1",
          title: "Course Overview",
          lessons: [
            {
              id: "les-1",
              title: "Introduction to the course",
              videoFile: null,
              videoName: "intro-video.mp4",
            },
            {
              id: "les-2",
              title: "Course FAQs",
              videoFile: null,
              videoName: "",
            },
            {
              id: "les-3",
              title: "Setup Environment",
              videoFile: null,
              videoName: "",
            },
          ],
        },
        {
          id: "sec-2",
          title: "Python Basics",
          lessons: [
            {
              id: "les-4",
              title: "Variables and Data Types",
              videoFile: null,
              videoName: "",
            },
            {
              id: "les-5",
              title: "Numbers and Math",
              videoFile: null,
              videoName: "",
            },
          ],
        },
      ]);
    } else {
      setCurriculum([
        { id: `sec-${Date.now()}`, title: "Section 1", lessons: [] },
      ]);
    }
  }, [id, isEditMode]);

  // ==========================================
  // HÀM XỬ LÝ: BASIC INFO
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // ==========================================
  // HÀM XỬ LÝ: DRAG AND DROP (KÉO THẢ)
  // ==========================================
  const handleDragStart = (e, sectionId, lessonIndex) => {
    setDragItem({ sectionId, lessonIndex });
    setExpandedLessonId(null); // Đóng khung upload khi bắt đầu kéo
    setTimeout(() => {
      e.target.classList.add("opacity-30");
    }, 0);
  };

  const handleDragEnter = (e, sectionId, lessonIndex) => {
    e.preventDefault();
    setDragOverItem({ sectionId, lessonIndex });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("opacity-30");

    if (!dragItem || !dragOverItem) {
      setDragItem(null);
      setDragOverItem(null);
      return;
    }

    const newCurriculum = [...curriculum];
    const sourceSectionIdx = newCurriculum.findIndex(
      (s) => s.id === dragItem.sectionId,
    );
    const targetSectionIdx = newCurriculum.findIndex(
      (s) => s.id === dragOverItem.sectionId,
    );

    const sourceLessons = [...newCurriculum[sourceSectionIdx].lessons];
    const targetLessons =
      sourceSectionIdx === targetSectionIdx
        ? sourceLessons
        : [...newCurriculum[targetSectionIdx].lessons];

    const [draggedLesson] = sourceLessons.splice(dragItem.lessonIndex, 1);
    targetLessons.splice(dragOverItem.lessonIndex, 0, draggedLesson);

    newCurriculum[sourceSectionIdx].lessons = sourceLessons;
    if (sourceSectionIdx !== targetSectionIdx) {
      newCurriculum[targetSectionIdx].lessons = targetLessons;
    }

    setCurriculum(newCurriculum);
    setDragItem(null);
    setDragOverItem(null);
  };

  // ==========================================
  // HÀM XỬ LÝ: CURRICULUM BUILDER (THÊM/SỬA/XÓA)
  // ==========================================
  const handleAddSection = () => {
    const newSection = {
      id: `sec-${Date.now()}`,
      title: `New Section`,
      lessons: [],
    };
    setCurriculum([...curriculum, newSection]);
  };

  const handleSectionTitleChange = (sectionId, newTitle) => {
    setCurriculum(
      curriculum.map((sec) =>
        sec.id === sectionId ? { ...sec, title: newTitle } : sec,
      ),
    );
  };

  const handleDeleteSection = (sectionId) => {
    if (window.confirm("Xóa Section này và toàn bộ bài học bên trong?")) {
      setCurriculum(curriculum.filter((sec) => sec.id !== sectionId));
    }
  };

  const handleAddLesson = (sectionId) => {
    const newLesson = {
      id: `les-${Date.now()}`,
      title: `New Lesson`,
      videoFile: null,
      videoName: "",
    };
    setCurriculum(
      curriculum.map((sec) =>
        sec.id === sectionId
          ? { ...sec, lessons: [...sec.lessons, newLesson] }
          : sec,
      ),
    );
  };

  const handleLessonTitleChange = (sectionId, lessonId, newTitle) => {
    setCurriculum(
      curriculum.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lessons: sec.lessons.map((les) =>
              les.id === lessonId ? { ...les, title: newTitle } : les,
            ),
          };
        }
        return sec;
      }),
    );
  };

  const handleDeleteLesson = (sectionId, lessonId) => {
    setCurriculum(
      curriculum.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lessons: sec.lessons.filter((les) => les.id !== lessonId),
          };
        }
        return sec;
      }),
    );
  };

  // ==========================================
  // HÀM XỬ LÝ: UPLOAD VIDEO CHO BÀI HỌC
  // ==========================================
  const handleVideoUpload = (e, sectionId, lessonId) => {
    const file = e.target.files[0];
    if (file) {
      setCurriculum(
        curriculum.map((sec) => {
          if (sec.id === sectionId) {
            return {
              ...sec,
              lessons: sec.lessons.map((les) =>
                les.id === lessonId
                  ? { ...les, videoFile: file, videoName: file.name }
                  : les,
              ),
            };
          }
          return sec;
        }),
      );
    }
  };

  const handleRemoveVideo = (sectionId, lessonId) => {
    setCurriculum(
      curriculum.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lessons: sec.lessons.map((les) =>
              les.id === lessonId
                ? { ...les, videoFile: null, videoName: "" }
                : les,
            ),
          };
        }
        return sec;
      }),
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...formData, curriculum: curriculum };
    setTimeout(() => {
      console.log("Saving data:", payload);
      setIsSaving(false);
      alert(isEditMode ? "Cập nhật thành công!" : "Tạo khóa học thành công!");
      navigate("/instructor/dashboard");
    }, 1000);
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 h-16 bg-white dark:bg-[#111722] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-2 text-slate-500 hover:text-[#135bec] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
          <h1 className="text-xl font-bold line-clamp-1">
            {isEditMode
              ? `Edit Course: ${formData.title}`
              : "Create New Course"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:block px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            Save Draft
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#135bec] hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#135bec]/20 disabled:opacity-70"
          >
            {isSaving ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
            ) : null}
            {isEditMode ? "Update Course" : "Publish Course"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === "basic" ? "border-[#135bec] text-[#135bec]" : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <span className="material-symbols-outlined text-[18px]">info</span>{" "}
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === "curriculum" ? "border-[#135bec] text-[#135bec]" : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              menu_book
            </span>{" "}
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === "pricing" ? "border-[#135bec] text-[#135bec]" : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              payments
            </span>{" "}
            Pricing & Publish
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 lg:p-8">
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Learn React from Scratch"
                  style={{ caretColor: "#135bec" }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#101622] focus:bg-white dark:focus:bg-[#151e2e] focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] outline-none transition-all text-slate-900 dark:text-white"
                />
              </div>

              {/* ... (Các thẻ Subtitle, Category, Description, Image giữ nguyên) ... */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                  Course Image
                </label>
                <div className="mt-1 relative flex justify-center border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl bg-slate-50 dark:bg-[#101622] hover:bg-slate-100 dark:hover:bg-[#151e2e] transition-colors group overflow-hidden h-64">
                  {imagePreview ? (
                    <div className="w-full h-full relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <label
                        htmlFor="file-upload"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm text-white"
                      >
                        <span className="material-symbols-outlined text-4xl mb-2">
                          change_circle
                        </span>
                        <span className="font-bold">Click to change image</span>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-[#135bec] transition-colors">
                        cloud_upload
                      </span>
                      <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-[#135bec] hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                        </label>
                      </div>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CURRICULUM DRAG & DROP & VIDEO UPLOAD */}
          {activeTab === "curriculum" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">Curriculum Builder</h3>
                  <p className="text-sm text-slate-500">
                    Hold the dots icon to drag and reorder lessons.
                  </p>
                </div>
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2 border border-[#135bec] text-[#135bec] font-bold rounded-lg hover:bg-[#135bec]/10 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>{" "}
                  Add Section
                </button>
              </div>

              {curriculum.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500">
                  Chưa có nội dung nào. Hãy bấm "Add Section" để bắt đầu.
                </div>
              ) : (
                <div className="space-y-6">
                  {curriculum.map((section, sectionIndex) => (
                    <div
                      key={section.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#151e2e] overflow-hidden group"
                    >
                      {/* Section Header */}
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">
                          folder
                        </span>
                        <span className="font-bold text-sm whitespace-nowrap">
                          Section {sectionIndex + 1}:
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            handleSectionTitleChange(section.id, e.target.value)
                          }
                          placeholder="Enter section title..."
                          style={{ caretColor: "#135bec" }}
                          className="flex-1 bg-transparent border-none focus:bg-white dark:focus:bg-[#1e293b] focus:ring-1 focus:ring-[#135bec] px-2 py-1 text-sm font-bold outline-none rounded transition-colors text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Delete Section"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>

                      {/* Lessons List (Vùng kéo thả) */}
                      <div className="p-4 space-y-3">
                        {section.lessons.map((lesson, lessonIndex) => {
                          const isDragOver =
                            dragOverItem?.sectionId === section.id &&
                            dragOverItem?.lessonIndex === lessonIndex;
                          const isExpanded = expandedLessonId === lesson.id;

                          return (
                            <div
                              key={lesson.id}
                              draggable
                              onDragStart={(e) =>
                                handleDragStart(e, section.id, lessonIndex)
                              }
                              onDragEnter={(e) =>
                                handleDragEnter(e, section.id, lessonIndex)
                              }
                              onDragOver={handleDragOver}
                              onDragEnd={handleDragEnd}
                              className={`flex flex-col bg-white dark:bg-[#1e293b] border rounded-lg transition-all select-none
                                ${isDragOver ? "border-[#135bec] border-t-4 shadow-md transform -translate-y-1" : "border-slate-200 dark:border-slate-700"}
                                ${isExpanded ? "ring-1 ring-[#135bec]" : "hover:border-[#135bec]/30"}
                              `}
                            >
                              {/* Thanh bài học chính */}
                              <div className="flex items-center gap-3 p-2 group/lesson">
                                <span className="material-symbols-outlined text-slate-400 group-hover/lesson:text-[#135bec] transition-colors text-[18px] ml-1 cursor-grab active:cursor-grabbing">
                                  drag_indicator
                                </span>

                                <span className="material-symbols-outlined text-[#135bec] text-[18px]">
                                  play_circle
                                </span>

                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) =>
                                    handleLessonTitleChange(
                                      section.id,
                                      lesson.id,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter lesson title..."
                                  style={{ caretColor: "#135bec" }}
                                  className="flex-1 bg-transparent border-none focus:bg-slate-50 dark:focus:bg-[#101622] focus:ring-1 focus:ring-[#135bec] px-2 py-1 text-sm outline-none rounded transition-colors text-slate-900 dark:text-white"
                                />

                                {/* Nút bật/tắt khung Add Video */}
                                <button
                                  onClick={() =>
                                    setExpandedLessonId(
                                      isExpanded ? null : lesson.id,
                                    )
                                  }
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${lesson.videoName ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    {lesson.videoName ? "check_circle" : "add"}
                                  </span>
                                  {lesson.videoName
                                    ? "Video Added"
                                    : "Add Video"}
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteLesson(section.id, lesson.id)
                                  }
                                  className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover/lesson:opacity-100 transition-all ml-2"
                                  title="Delete Lesson"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    delete
                                  </span>
                                </button>
                              </div>

                              {/* Khu vực Upload Video Xổ Xuống */}
                              {isExpanded && (
                                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101622] rounded-b-lg ml-8 mr-2 mb-2">
                                  <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                                    Upload Video
                                  </label>

                                  {lesson.videoName ? (
                                    // Đã có video
                                    <div className="flex items-center justify-between bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                                      <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-[#135bec]/10 rounded-lg text-[#135bec] flex items-center justify-center">
                                          <span className="material-symbols-outlined text-[20px]">
                                            movie
                                          </span>
                                        </div>
                                        <span className="text-sm font-medium truncate text-slate-900 dark:text-white">
                                          {lesson.videoName}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleRemoveVideo(
                                            section.id,
                                            lesson.id,
                                          )
                                        }
                                        className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">
                                          delete
                                        </span>
                                      </button>
                                    </div>
                                  ) : (
                                    // Chưa có video -> Hiện khung upload
                                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#151e2e] transition-colors relative">
                                      <div className="space-y-1 text-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-400">
                                          video_file
                                        </span>
                                        <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                                          <label className="relative cursor-pointer rounded-md font-medium text-[#135bec] hover:text-blue-500 focus-within:outline-none">
                                            <span>Click to select a video</span>
                                            <input
                                              type="file"
                                              accept="video/mp4,video/x-m4v,video/*"
                                              className="sr-only"
                                              onChange={(e) =>
                                                handleVideoUpload(
                                                  e,
                                                  section.id,
                                                  lesson.id,
                                                )
                                              }
                                            />
                                          </label>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                          MP4, WebM format (Max 2GB)
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Vùng thả cuối cùng nếu Section đang rỗng hoặc thả xuống cuối danh sách */}
                        <div
                          className={`h-4 rounded-lg mt-2 transition-colors ${dragOverItem?.sectionId === section.id && dragOverItem?.lessonIndex === section.lessons.length ? "bg-[#135bec]/20 border-2 border-dashed border-[#135bec]" : "bg-transparent"}`}
                          onDragEnter={(e) =>
                            handleDragEnter(
                              e,
                              section.id,
                              section.lessons.length,
                            )
                          }
                          onDragOver={handleDragOver}
                        ></div>

                        {/* Add Lesson Button */}
                        <button
                          onClick={() => handleAddLesson(section.id)}
                          className="flex items-center gap-2 text-sm font-bold text-[#135bec] hover:bg-[#135bec]/10 p-2 rounded transition-colors w-max mt-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>{" "}
                          Add Lesson
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRICING */}
          {activeTab === "pricing" && (
            <div className="space-y-6 animate-fade-in max-w-md">
              <h3 className="font-bold text-lg mb-2">Pricing Settings</h3>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                  Course Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    style={{ caretColor: "#135bec" }}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#101622] focus:bg-white dark:focus:bg-[#151e2e] focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] outline-none transition-all text-lg font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default CourseEditor;
