import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "../../../utils/cn";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

// Internal Components
import AdminFormContainer from "./AdminFormContainer";
import ProgramConfigPanel from "./ProgramConfigPanel";
import DynamicListEditor from "../../../components/common/DynamicListEditor";
import Input from "../../../components/common/Input";
import FormSection from "../../../components/common/FormSection";

// Extracted Sections
import ScholarshipIdentitySection from "./form-sections/ScholarshipIdentitySection";
import ScholarshipRequirementsSection from "./form-sections/ScholarshipRequirementsSection";
import ScholarshipFeesSection from "./form-sections/ScholarshipFeesSection";
import ScholarshipProgramDetailsSection from "./form-sections/ScholarshipProgramDetailsSection";

// ─────────────────────────────────────────────
// Zod Schema
// ─────────────────────────────────────────────
const scholarshipSchema = z.object({
  title: z.string().min(2, "Title is required"),
  titleInChinese: z.string().optional(),
  description: z.string().min(10, "Description is too short"),
  universities: z.array(z.string()).default([]),
  scholarshipCategory: z.string().default("Partial"),
  status: z.string().default("published"),
  isRecommended: z.boolean().default(false),
  isHot: z.boolean().default(false),
  isTop: z.boolean().default(false),
  applicationDeadline: z.string().min(1, "Deadline is required"),
  coverImage: z.string().optional(),

  // Basic & Scholarship Info
  programName: z.string().min(1, "Program Name is required"),
  field: z.string().optional(),
  degree: z.string().default("Bachelor"),
  intake: z.string().default("Autumn 2024"),
  scholarshipDurationText: z.string().optional(),
  scholarshipPolicy: z.string().optional(),

  // Requirements
  ageMin: z.coerce.number().default(18),
  ageMax: z.coerce.number().default(28),
  chinaVisitPolicy: z.string().default("Accept"),
  acceptMinors: z.boolean().default(true),
  currentLocationPolicy: z.string().default("Unlimited"),
  gpaMin: z.coerce.number().default(0),
  ieltsScore: z.coerce.number().default(0),
  toeflScore: z.coerce.number().default(0),
  duolingoScore: z.coerce.number().default(0),
  hskLevel: z.coerce.number().default(0),
  scoreRequirementsEnglish: z.string().optional(),
  scoreRequirementsChinese: z.string().optional(),

  // Fees
  originalTuitionFee: z.coerce.number().default(0),
  tuitionFeeAfterScholarship: z.coerce.number().default(0),
  accommodationFeeQuad: z.coerce.number().default(0),
  accommodationFeeAfterScholarship: z.coerce.number().default(0),
  registrationFee: z.string().optional(),
  universityFeeCurrency: z.string().default("RMB"),
  nadoumiApplicationFee: z.coerce.number().default(400),
  nadoumiServiceFee: z.coerce.number().default(0),
  nadoumiFeeCurrency: z.string().default("USD"),

  // Arrays
  programs: z.array(z.any()).default([]),
  applicantRequirements: z.array(z.object({
    category: z.string().optional(),
    requirement: z.string().optional(),
  })).default([]),
  applicationDocuments: z.array(z.object({
    name: z.string().min(1, "Document name is required"),
    required: z.boolean().default(true),
    notes: z.string().optional(),
  })).default([]),
});

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const ScholarshipForm = ({
  initialData = {},
  onSubmit,
  isLoading,
  universities = [],
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      ...initialData,
      applicationDeadline: initialData.applicationDeadline
        ? new Date(initialData.applicationDeadline).toISOString().split("T")[0]
        : "",
      programs: initialData.programs?.length > 0 ? initialData.programs : [
        {
          category: "Bachelor",
          programName: "",
          majors: [],
          fields: [],
          teachingLanguage: "English",
          duration: 4,
          intake: "Autumn 2024",
          stipendEnabled: false,
          stipendAmount: 0,
          applicationFee: 400,
          serviceFee: 0,
          tuitionFee: 0,
          tuitionFeeAfter: 0,
          currency: "RMB",
          accommodations: [],
        }
      ],
      applicationDocuments: initialData.applicationDocuments || [
        { name: "Passport Copy", required: true, notes: "" },
        { name: "Highest Degree Certificate", required: true, notes: "" },
        { name: "Transcripts", required: true, notes: "" },
      ],
      applicantRequirements: initialData.applicantRequirements || [],
    },
  });

  const { fields: programFields, append: appendProgram, remove: removeProgram } = useFieldArray({ control, name: "programs" });
  const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({ control, name: "applicationDocuments" });
  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({ control, name: "applicantRequirements" });

  const handleFormSubmit = (data) => {
    const programCategories = [...new Set(data.programs.map((p) => p.category))];
    onSubmit({ ...data, programCategories });
  };

  const programs = watch("programs") || [];

  return (
    <AdminFormContainer
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoading={isLoading}
      submitLabel="Save Scholarship Profile"
    >
      <ScholarshipIdentitySection
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        universities={universities}
      />

      {/* Program Levels Quick Select */}
      <div className="md:col-span-2 space-y-4 px-8 py-6 bg-gray-50/50 rounded-[40px] border border-gray-100 mb-8">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
          Available Program levels
        </label>
        <div className="flex flex-wrap gap-3">
          {["Language", "Bachelor", "Master", "PhD"].map((level) => {
            const isActive = programs.some((p) => p.category === level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => {
                  if (isActive) {
                    setValue("programs", programs.filter((p) => p.category !== level));
                  } else {
                    appendProgram({
                      category: level,
                      programName: "",
                      field: "",
                      teachingLanguage: "English",
                      duration: level === "Language" ? 1 : 4,
                      intake: "Autumn 2024",
                      stipendEnabled: false,
                      applicationFee: 400,
                      serviceFee: 0,
                      tuitionFee: 0,
                      tuitionFeeAfter: 0,
                      currency: "RMB",
                    });
                  }
                }}
                className={cn(
                  "px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
                  isActive
                    ? "bg-gray-900 text-white border-gray-900 shadow-xl"
                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300",
                )}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      <ScholarshipProgramDetailsSection register={register} errors={errors} />
      <ScholarshipRequirementsSection register={register} errors={errors} />
      <ScholarshipFeesSection register={register} errors={errors} />

      {/* Program Config Panels */}
      <div className="space-y-12">
        {programFields.map((field, index) => (
          <ProgramConfigPanel
            key={field.id}
            program={watch(`programs.${index}`)}
            onChange={(updated) => setValue(`programs.${index}`, updated)}
            onRemove={() => removeProgram(index)}
          />
        ))}
      </div>

      <FormSection
        title="Compliance & Requirements"
        description="Required documentation and applicant eligibility criteria."
        icon={ClipboardDocumentCheckIcon}
      >
        <div className="space-y-12">
          <DynamicListEditor
            title="Official Documentation Requirements"
            items={docFields}
            onAdd={() => appendDoc({ name: "", required: true, notes: "" })}
            onRemove={(idx) => removeDoc(idx)}
            renderItem={(doc, idx) => (
              <div key={doc.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 transition-all hover:bg-white hover:shadow-xl group">
                <div className="md:col-span-11 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Document Nomenclature"
                    placeholder="e.g. HSK Certificate"
                    error={errors.applicationDocuments?.[idx]?.name?.message}
                    {...register(`applicationDocuments.${idx}.name`)}
                  />
                  <div className="flex gap-4">
                    <Input
                      label="Instructional Notes"
                      className="flex-1"
                      placeholder="e.g. Must be Level 4 or higher"
                      {...register(`applicationDocuments.${idx}.notes`)}
                    />
                    <Input
                      type="checkbox"
                      label="Mandatory"
                      className="mt-6"
                      {...register(`applicationDocuments.${idx}.required`)}
                    />
                  </div>
                </div>
              </div>
            )}
          />

          <DynamicListEditor
            title="Applicant Eligibility Standards"
            items={reqFields}
            onAdd={() => appendReq({ category: "", requirement: "" })}
            onRemove={(idx) => removeReq(idx)}
            renderItem={(req, idx) => (
              <div key={req.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 transition-all hover:bg-white hover:shadow-xl">
                <Input
                  label="Requirement Category"
                  placeholder="e.g. Language Proficiency"
                  error={errors.applicantRequirements?.[idx]?.category?.message}
                  {...register(`applicantRequirements.${idx}.category`)}
                />
                <Input
                  label="Specific Criteria Detail"
                  placeholder="e.g. IELTS 6.0 or TOEFL 80"
                  error={errors.applicantRequirements?.[idx]?.requirement?.message}
                  {...register(`applicantRequirements.${idx}.requirement`)}
                />
              </div>
            )}
          />
        </div>
      </FormSection>
    </AdminFormContainer>
  );
};

export default ScholarshipForm;
