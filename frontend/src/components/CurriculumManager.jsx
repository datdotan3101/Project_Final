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

  const [addingQuizTo, setAddingQuizTo] = useState(null);
  const [quizData, setQuizData] = useState({
    title: "",
    questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: 0 }],
  });

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

  const handleAddQuiz = async (sectionId) => {
    if (!quizData.title.trim()) return alert("Vui lòng nhập tiêu đề bài test!");
    if (quizData.questions.some(q => !q.question_text.trim())) {
      return alert("Vui lòng nhập đầy đủ câu hỏi!");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/courses/sections/${sectionId}/quizzes`,
        {
          title: quizData.title,
          order_index: 0, // Tạm thời để 0
          questions: quizData.questions
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setAddingQuizTo(null);
      setQuizData({
        title: "",
        questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: 0 }],
      });
      fetchCurriculum();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi thêm bài test!");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Xóa bài test này?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/courses/quizzes/${quizId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchCurriculum();
    } catch (err) {
      alert("Lỗi xóa bài test!");
    }
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question_text: "", options: ["", "", "", ""], correct_answer: 0 }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const newQuestions = [...quizData.questions];
    const newOptions = [...newQuestions[qIdx].options];
    newOptions[oIdx] = value;
    newQuestions[qIdx] = { ...newQuestions[qIdx], options: newOptions };
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length === 1) return;
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQuestions });
  };

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

              {/* Lesson & Quiz List */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) =>
                  handleDrop(
                    e,
                    section.lessons ? section.lessons.length : 0,
                    section.id,
                  )
                }
                className="p-5 space-y-4 min-h-[50px] transition-colors"
              >
                {/* Render Lessons */}
                {section.lessons?.map((lesson, lIdx) => (
                  <div
                    key={`lesson-${lesson.id}`}
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

                {/* Render Quizzes */}
                {section.quizzes?.map((quiz, qIdx) => (
                  <div
                    key={`quiz-${quiz.id}`}
                    className="bg-[#0f172a] border border-blue-900/40 p-4 rounded flex justify-between items-center group hover:border-blue-500/50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-blue-900/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                        Q
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-sm">
                          {quiz.title}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span>📝 Bài Test</span>
                          <span>•</span>
                          <span>{quiz.questions?.length || 0} câu hỏi</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}

                {/* --- ADD CURRICULUM ACTIONS --- */}
                <div className="flex gap-4 ml-8 pt-2">
                  {!addingLessonTo && !addingQuizTo && (
                    <>
                      <button
                        onClick={() => setAddingLessonTo(section.id)}
                        className="text-sm font-bold text-blue-500 flex items-center gap-2 hover:text-blue-400 transition"
                      >
                        <span className="text-lg">+</span> Add Lesson
                      </button>
                      <button
                        onClick={() => setAddingQuizTo(section.id)}
                        className="text-sm font-bold text-green-500 flex items-center gap-2 hover:text-green-400 transition"
                      >
                        <span className="text-lg">+</span> Add Test
                      </button>
                    </>
                  )}
                </div>

                {/* Form Add Lesson */}
                {addingLessonTo === section.id && (
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

                {/* Form Add Quiz */}
                {addingQuizTo === section.id && (
                  <div className="bg-[#0f172a] border border-green-500/50 p-6 rounded mt-3 ml-8 space-y-6">
                    <h3 className="text-lg font-bold text-white">Tạo bài test mới</h3>
                    <input
                      type="text"
                      placeholder="Tiêu đề bài test"
                      value={quizData.title}
                      onChange={(e) =>
                        setQuizData({ ...quizData, title: e.target.value })
                      }
                      className="w-full bg-[#1e293b] border border-slate-700 rounded p-3 text-white text-sm focus:border-green-500 outline-none"
                    />

                    <div className="space-y-6">
                      {quizData.questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-4 bg-[#1e293b] rounded-lg border border-slate-700 relative">
                          <button
                            onClick={() => removeQuestion(qIdx)}
                            className="absolute top-2 right-2 text-slate-500 hover:text-red-500"
                          >
                            ✕
                          </button>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Câu hỏi {qIdx + 1}</label>
                          <input
                            type="text"
                            placeholder="Nhập nội dung câu hỏi..."
                            value={q.question_text}
                            onChange={(e) => updateQuestion(qIdx, "question_text", e.target.value)}
                            className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm mb-4 outline-none focus:border-green-500"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIdx}`}
                                  checked={q.correct_answer === oIdx}
                                  onChange={() => updateQuestion(qIdx, "correct_answer", oIdx)}
                                  className="accent-green-500"
                                />
                                <input
                                  type="text"
                                  placeholder={`Đáp án ${oIdx + 1}`}
                                  value={opt}
                                  onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                  className="flex-1 bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-xs outline-none focus:border-green-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addQuestion}
                      className="w-full py-2 border border-dashed border-slate-600 text-slate-400 text-xs font-bold rounded hover:bg-slate-800 transition"
                    >
                      + Thêm câu hỏi
                    </button>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                      <button
                        onClick={() => setAddingQuizTo(null)}
                        className="text-slate-400 hover:text-white text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddQuiz(section.id)}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded shadow-lg shadow-green-900/20"
                      >
                        Lưu bài test
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
