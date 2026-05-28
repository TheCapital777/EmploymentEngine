"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Target, BookOpen, Briefcase, Zap, Award, Users, ChevronRight, ChevronLeft, Check, Sparkles, Loader2, Plus, Trash2, Download, CheckCircle, LayoutTemplate } from "lucide-react";
import { enhanceObjective } from "../actions";
import { CVTemplate, CVData } from "../../components/CVTemplate";
import { useReactToPrint } from "react-to-print";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase/config";
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

type Step = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  { id: "template", title: "Template", icon: <LayoutTemplate className="w-5 h-5" /> },
  { id: "personal", title: "Personal Info", icon: <User className="w-5 h-5" /> },
  { id: "objective", title: "Career Objective", icon: <Target className="w-5 h-5" /> },
  { id: "education", title: "Education", icon: <BookOpen className="w-5 h-5" /> },
  { id: "experience", title: "Experience", icon: <Briefcase className="w-5 h-5" /> },
  { id: "skills", title: "Skills", icon: <Zap className="w-5 h-5" /> },
  { id: "certifications", title: "Certifications", icon: <Award className="w-5 h-5" /> },
  { id: "referees", title: "Referees", icon: <Users className="w-5 h-5" /> },
];

function CVBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("id");
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [formData, setFormData] = useState<CVData>({
    templateId: "modern",
    personal: { fullName: "", email: "", phone: "", location: "", linkedin: "" },
    objective: "",
    education: [],
    experience: [],
    skills: "",
    certifications: "",
    referees: []
  });

  const [isEnhancing, setIsEnhancing] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  import("react").then((React) => {
    React.useEffect(() => {
      if (editId && user) {
        const fetchCV = async () => {
          try {
            const docRef = doc(db, "cvs", editId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().userId === user.uid) {
              setFormData(docSnap.data().data);
            } else {
              alert("CV not found or unauthorized.");
            }
          } catch (e) {
            console.error("Error fetching CV:", e);
          } finally {
            setIsLoading(false);
          }
        };
        fetchCV();
      } else if (editId && !user) {
        setIsLoading(false); // Wait for auth
      }
    }, [editId, user]);
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${formData.personal.fullName || "My"}_CV`,
  });

  // Array Adders
  const addEducation = () => setFormData(prev => ({ ...prev, education: [...prev.education, { id: Date.now().toString(), institution: "", degree: "", year: "", gpa: "" }] }));
  const addExperience = () => setFormData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now().toString(), company: "", role: "", startDate: "", endDate: "", description: "" }] }));
  const addReferee = () => setFormData(prev => ({ ...prev, referees: [...prev.referees, { id: Date.now().toString(), name: "", position: "", contact: "", organization: "" }] }));
  
  // Array Removers
  const removeEducation = (id: string) => setFormData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  const removeExperience = (id: string) => setFormData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  const removeReferee = (id: string) => setFormData(prev => ({ ...prev, referees: prev.referees.filter(e => e.id !== id) }));

  // Array Updaters
  const updateEducation = (id: string, field: string, value: string) => setFormData(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const updateExperience = (id: string, field: string, value: string) => setFormData(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const updateReferee = (id: string, field: string, value: string) => setFormData(prev => ({ ...prev, referees: prev.referees.map(e => e.id === id ? { ...e, [field]: value } : e) }));

  const handleEnhance = async () => {
    if (!formData.objective) {
      toast.error("Please write a draft objective first.");
      return;
    }
    setIsEnhancing(true);
    const toastId = toast.loading("Enhancing with AI...");
    try {
      const res = await enhanceObjective(formData.objective);
      if (res.success && res.text) {
        setFormData(prev => ({ ...prev, objective: res.text }));
        toast.success("Objective enhanced successfully!", { id: toastId });
      } else {
        toast.error(res.error || "Failed to enhance.", { id: toastId });
      }
    } catch (e) {
      toast.error("Enhancement failed.", { id: toastId });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFinish = async () => {
    if (!user) {
      toast.error("Please sign in to save your CV to your dashboard.");
      router.push("/login");
      return;
    }
    
    setIsSaving(true);
    const toastId = toast.loading("Saving CV...");
    try {
      if (editId) {
        const docRef = doc(db, "cvs", editId);
        await updateDoc(docRef, {
          data: formData,
          title: `${formData.personal.fullName || "My"} CV`,
        });
      } else {
        await addDoc(collection(db, "cvs"), {
          userId: user.uid,
          data: formData,
          createdAt: serverTimestamp(),
          title: `${formData.personal.fullName || "My"} CV`,
        });
      }
      toast.success("CV saved successfully!", { id: toastId });
      router.push('/dashboard');
    } catch (e) {
      console.error("Error saving CV: ", e);
      toast.error("Failed to save CV. Please try downloading it instead.", { id: toastId });
      setIsSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const currentStep = steps[currentStepIndex];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header & Progress */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Smart CV Builder</h1>
          <p className="text-slate-600 dark:text-slate-400">Complete the sections below to generate your ATS-optimized CV.</p>
          
          <div className="mt-8 flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted ? 'bg-primary border-primary text-white' : 
                    isCurrent ? 'bg-white dark:bg-slate-900 border-primary text-primary' : 
                    'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className={`hidden md:block text-xs font-medium absolute -bottom-6 whitespace-nowrap ${
                    isCurrent ? 'text-primary' : 'text-slate-500'
                  }`}>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-10 min-h-[400px] flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              {currentStep.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentStep.title}</h2>
              <p className="text-sm text-slate-500">Step {currentStepIndex + 1} of {steps.length}</p>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* 0. TEMPLATE SELECTION */}
                {currentStep.id === "template" && (
                  <div className="space-y-6">
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Select a design template for your CV. You can change this later.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Modern Template */}
                      <div 
                        onClick={() => setFormData(p => ({ ...p, templateId: "modern" }))}
                        className={`cursor-pointer rounded-2xl border-2 transition-all overflow-hidden ${formData.templateId === "modern" || !formData.templateId ? 'border-primary shadow-md shadow-primary/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                      >
                        <div className="h-32 bg-slate-100 flex items-center justify-center p-4">
                           <div className="w-full h-full bg-white shadow-sm flex flex-col p-2 gap-2">
                             <div className="w-1/2 h-2 bg-green-700 rounded-sm mx-auto"></div>
                             <div className="w-8 h-0.5 bg-green-600"></div>
                             <div className="w-full h-1 bg-slate-200 rounded-sm"></div>
                             <div className="w-3/4 h-1 bg-slate-200 rounded-sm"></div>
                           </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Modern</h3>
                            <p className="text-xs text-slate-500">Green accents, standard</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.templateId === "modern" || !formData.templateId ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-transparent'}`}>
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Executive Template */}
                      <div 
                        onClick={() => setFormData(p => ({ ...p, templateId: "executive" }))}
                        className={`cursor-pointer rounded-2xl border-2 transition-all overflow-hidden ${formData.templateId === "executive" ? 'border-primary shadow-md shadow-primary/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                      >
                        <div className="h-32 bg-slate-100 flex items-center justify-center p-4">
                           <div className="w-full h-full bg-white shadow-sm flex flex-col p-2 gap-2 items-center">
                             <div className="w-3/4 h-2 bg-slate-900 rounded-sm mx-auto mb-1"></div>
                             <div className="w-full h-px bg-slate-900 mb-1"></div>
                             <div className="w-full h-1 bg-slate-300 rounded-sm self-start"></div>
                             <div className="w-5/6 h-1 bg-slate-300 rounded-sm self-start"></div>
                           </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Executive</h3>
                            <p className="text-xs text-slate-500">Traditional, serif, navy</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.templateId === "executive" ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-transparent'}`}>
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Minimalist Template */}
                      <div 
                        onClick={() => setFormData(p => ({ ...p, templateId: "minimalist" }))}
                        className={`cursor-pointer rounded-2xl border-2 transition-all overflow-hidden ${formData.templateId === "minimalist" ? 'border-primary shadow-md shadow-primary/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                      >
                        <div className="h-32 bg-slate-100 flex items-center justify-center p-4">
                           <div className="w-full h-full bg-white shadow-sm flex p-2 gap-2">
                             <div className="w-1/3 h-full flex flex-col gap-2">
                               <div className="w-full h-1 bg-slate-300 rounded-sm"></div>
                               <div className="w-full h-1 bg-slate-300 rounded-sm"></div>
                             </div>
                             <div className="w-2/3 h-full flex flex-col gap-2">
                               <div className="w-full h-2 bg-slate-800 rounded-sm mb-2"></div>
                               <div className="w-full h-1 bg-slate-200 rounded-sm"></div>
                               <div className="w-3/4 h-1 bg-slate-200 rounded-sm"></div>
                             </div>
                           </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Minimalist</h3>
                            <p className="text-xs text-slate-500">Clean, 2-column, whitespace</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.templateId === "minimalist" ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-transparent'}`}>
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 1. PERSONAL INFO */}
                {currentStep.id === "personal" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                      <input type="text" value={formData.personal.fullName} onChange={(e) => setFormData(p => ({...p, personal: {...p.personal, fullName: e.target.value}}))} placeholder="e.g. John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                      <input type="email" value={formData.personal.email} onChange={(e) => setFormData(p => ({...p, personal: {...p.personal, email: e.target.value}}))} placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input type="tel" value={formData.personal.phone} onChange={(e) => setFormData(p => ({...p, personal: {...p.personal, phone: e.target.value}}))} placeholder="+255 700 000 000" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location (City, Country)</label>
                      <input type="text" value={formData.personal.location} onChange={(e) => setFormData(p => ({...p, personal: {...p.personal, location: e.target.value}}))} placeholder="Dar es Salaam, Tanzania" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn URL</label>
                      <input type="text" value={formData.personal.linkedin} onChange={(e) => setFormData(p => ({...p, personal: {...p.personal, linkedin: e.target.value}}))} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>
                )}

                {/* 2. OBJECTIVE */}
                {currentStep.id === "objective" && (
                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
                      <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <strong>AI Assistant:</strong> I can help you write a powerful career objective. Just enter a few keywords about your goals and experience, and I'll generate a professional summary tailored for Tanzanian HR standards.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Career Objective / Professional Summary</label>
                      <textarea 
                        rows={5} 
                        placeholder="I am a recent graduate seeking a position in..." 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        value={formData.objective}
                        onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                      />
                    </div>
                    <button 
                      onClick={handleEnhance}
                      disabled={isEnhancing || !formData.objective}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                      {isEnhancing ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <Sparkles className="w-4 h-4 text-primary" />}
                      {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                    </button>
                  </div>
                )}

                {/* 3. EDUCATION */}
                {currentStep.id === "education" && (
                  <div className="space-y-6">
                    {formData.education.map((edu, idx) => (
                      <div key={edu.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                        <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="text-xs font-medium mb-1 block">Institution</label><input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="University of Dar es Salaam" /></div>
                          <div><label className="text-xs font-medium mb-1 block">Degree</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="BSc Computer Science" /></div>
                          <div><label className="text-xs font-medium mb-1 block">Year (Start - End)</label><input type="text" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="2018 - 2022" /></div>
                          <div><label className="text-xs font-medium mb-1 block">GPA (Optional)</label><input type="text" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="3.8/4.0" /></div>
                        </div>
                      </div>
                    ))}
                    <button onClick={addEducation} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"><Plus className="w-4 h-4" /> Add Education</button>
                  </div>
                )}

                {/* 4. EXPERIENCE */}
                {currentStep.id === "experience" && (
                  <div className="space-y-6">
                    {formData.experience.map((exp, idx) => (
                      <div key={exp.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                        <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="text-xs font-medium mb-1 block">Company / Org</label><input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="NMB Bank" /></div>
                          <div><label className="text-xs font-medium mb-1 block">Role / Title</label><input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="Financial Analyst" /></div>
                          <div><label className="text-xs font-medium mb-1 block">Start Date</label><input type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="Jan 2021" /></div>
                          <div><label className="text-xs font-medium mb-1 block">End Date (or Present)</label><input type="text" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="Present" /></div>
                          <div className="md:col-span-2"><label className="text-xs font-medium mb-1 block">Responsibilities & Achievements</label><textarea rows={3} value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="- Increased revenue by 20%..." /></div>
                        </div>
                      </div>
                    ))}
                    <button onClick={addExperience} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"><Plus className="w-4 h-4" /> Add Experience</button>
                  </div>
                )}

                {/* 5. SKILLS */}
                {currentStep.id === "skills" && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">List your core skills, separated by commas (e.g., Data Analysis, Project Management, Microsoft Excel).</p>
                    <textarea 
                      rows={5} 
                      value={formData.skills} 
                      onChange={(e) => setFormData(p => ({...p, skills: e.target.value}))} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" 
                      placeholder="React, Node.js, Leadership..."
                    />
                  </div>
                )}

                {/* 6. CERTIFICATIONS */}
                {currentStep.id === "certifications" && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">List any relevant certifications or awards, one per line.</p>
                    <textarea 
                      rows={5} 
                      value={formData.certifications} 
                      onChange={(e) => setFormData(p => ({...p, certifications: e.target.value}))} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" 
                      placeholder="Cisco Certified Network Associate (CCNA) - 2023..."
                    />
                  </div>
                )}

                {/* 7. REFEREES */}
                {currentStep.id === "referees" && (
                  <div className="space-y-6">
                    {formData.referees.map((ref, idx) => (
                      <div key={ref.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                        <button onClick={() => removeReferee(ref.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="text-xs font-medium mb-1 block">Full Name</label><input type="text" value={ref.name} onChange={(e) => updateReferee(ref.id, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="Dr. Jane Doe" /></div>
                          <div><label className="text-xs font-medium mb-1 block">Position / Title</label><input type="text" value={ref.position} onChange={(e) => updateReferee(ref.id, 'position', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="Professor" /></div>
                          <div><label className="text-xs font-medium mb-1 block">Organization</label><input type="text" value={ref.organization} onChange={(e) => updateReferee(ref.id, 'organization', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="University of Dar es Salaam" /></div>
                          <div><label className="text-xs font-medium mb-1 block">Contact (Email/Phone)</label><input type="text" value={ref.contact} onChange={(e) => updateReferee(ref.id, 'contact', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" placeholder="jane.doe@udsm.ac.tz" /></div>
                        </div>
                      </div>
                    ))}
                    <button onClick={addReferee} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"><Plus className="w-4 h-4" /> Add Referee</button>
                    
                    {/* The final submit/print preview section on Step 7 */}
                    <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-xl text-center">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready to generate?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Make sure you've filled out all relevant sections. Click below to download your ATS-ready PDF.</p>
                      <button 
                        onClick={() => handlePrint()}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                      >
                        <Download className="w-5 h-5" /> Download PDF CV
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            {currentStepIndex === steps.length - 1 ? (
              <button 
                onClick={handleFinish}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-green-600 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {isSaving ? "Saving..." : "Finish"}
              </button>
            ) : (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden PDF Template Container */}
      <div className="hidden">
        <CVTemplate ref={printRef} data={formData} />
      </div>
    </div>
  );
}

export default function CVBuilder() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center py-32 text-slate-500">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p>Loading builder...</p>
      </div>
    }>
      <CVBuilderContent />
    </Suspense>
  );
}
