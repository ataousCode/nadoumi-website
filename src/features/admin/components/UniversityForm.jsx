import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

// Common Components
import Input from "../../../components/common/Input";
import FormSection from "../../../components/common/FormSection";
import DynamicListEditor from "../../../components/common/DynamicListEditor";
import AdminFormContainer from "./AdminFormContainer";
import MajorsEditor from "./MajorsEditor";

// Extracted Sections
import UniversityIdentitySection from "./form-sections/UniversityIdentitySection";
import UniversityMediaSection from "./form-sections/UniversityMediaSection";
import {
  UniversityHistorySection,
  UniversityOpportunitiesSection,
  UniversityScholarshipSection,
} from "./form-sections/UniversitySections";

// ─────────────────────────────────────────────
// Zod Schema
// ─────────────────────────────────────────────
const accommodationSchema = z.object({
  type: z.string().min(1, "Accommodation type is required"),
  pricePerYear: z.string().optional(),
  notes: z.string().optional(),
});

const universitySchema = z.object({
  name: z.string().min(2, "Institution name is required"),
  nameInChinese: z.string().optional(),
  universityId: z.string().min(1, "Registry ID is required"),
  city: z.string().optional(),
  province: z.string().optional(),
  type: z.enum(["Public", "Private"]).default("Public"),
  qsRank: z.coerce.number().int().optional().or(z.literal("")),
  isRecommended: z.boolean().default(false),
  isPartner: z.boolean().default(false),
  isTop: z.boolean().default(false),
  recommendationNotes: z.string().optional(),
  totalStudents: z.coerce.number().int().optional().or(z.literal("")),
  internationalStudents: z.coerce.number().int().optional().or(z.literal("")),
  facultyCount: z.coerce.number().int().optional().or(z.literal("")),
  status: z.enum(["active", "draft", "closed"]).default("active"),
  logo: z.string().optional(),
  bannerImage: z.string().optional(),
  albums: z.array(z.string()).optional(),
  introduction: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  foundedYear: z.coerce.number().int().optional().or(z.literal("")),
  history: z.string().optional(),
  opportunities: z.array(z.string()).optional(),
  partnershipCountries: z.array(z.string()).optional(),
  searchTags: z.array(z.string()).optional(),
  searchKeywords: z.string().optional(),
  scholarshipAvailability: z.enum(["Available", "Limited", "Not Available"]).default("Available"),
  scholarshipNotes: z.array(z.object({
    name: z.string().min(1, "Scholarship name is required"),
    notes: z.string().optional(),
  })).optional(),
  majors: z.array(z.any()).optional(),
  accommodation: z.array(accommodationSchema).optional(),
});

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const UniversityForm = ({ initialData = {}, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      ...initialData,
      highlights: initialData.highlights || [""],
      opportunities: initialData.opportunities || [""],
      partnershipCountries: initialData.partnershipCountries || [""],
      searchTags: initialData.searchTags || [""],
      scholarshipNotes: initialData.scholarshipNotes || [{ name: "", notes: "" }],
      accommodation: initialData.accommodation || [{ type: "", pricePerYear: "", notes: "" }],
    },
  });

  const { fields: accommodationFields, append: appendAccommodation, remove: removeAccommodation } = useFieldArray({ control, name: "accommodation" });
  const { fields: scholarshipNoteFields, append: appendScholarshipNote, remove: removeScholarshipNote } = useFieldArray({ control, name: "scholarshipNotes" });

  const highlights = watch("highlights") || [];
  const searchTags = watch("searchTags") || [];
  const majors = watch("majors") || [];

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      highlights: (data.highlights || []).filter(Boolean),
      opportunities: (data.opportunities || []).filter(Boolean),
      partnershipCountries: (data.partnershipCountries || []).filter(Boolean),
      searchTags: (data.searchTags || []).filter(Boolean),
    });
  };

  return (
    <AdminFormContainer
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoading={isLoading}
      submitLabel="Save University Profile"
    >
      <UniversityIdentitySection register={register} errors={errors} />

      <FormSection title="Introduction & Overview" description="Short intro and detailed description." icon={BookOpenIcon}>
        <div className="space-y-8">
          <Input type="textarea" label="Short Introduction" rows={3} {...register("introduction")} />
          <Input type="textarea" label="Full Description" rows={6} {...register("description")} />
          <DynamicListEditor
            title="Key Highlights"
            items={highlights}
            onAdd={() => setValue("highlights", [...highlights, ""])}
            onRemove={(idx) => setValue("highlights", highlights.filter((_, i) => i !== idx))}
            renderItem={(item, idx) => (
              <Input key={idx} value={item} onChange={(e) => {
                const n = [...highlights]; n[idx] = e.target.value; setValue("highlights", n);
              }} />
            )}
          />
        </div>
      </FormSection>

      <UniversityHistorySection register={register} errors={errors} />
      <UniversityOpportunitiesSection register={register} errors={errors} watch={watch} setValue={setValue} />
      <UniversityScholarshipSection register={register} errors={errors} fields={scholarshipNoteFields} append={appendScholarshipNote} remove={removeScholarshipNote} />

      <FormSection title="Search & Discoverability" description="Tags and keywords." icon={MagnifyingGlassIcon}>
        <div className="space-y-8">
          <Input label="Search Keywords" {...register("searchKeywords")} />
          <DynamicListEditor
            title="Tags"
            items={searchTags}
            onAdd={() => setValue("searchTags", [...searchTags, ""])}
            onRemove={(idx) => setValue("searchTags", searchTags.filter((_, i) => i !== idx))}
            renderItem={(item, idx) => (
              <Input key={idx} value={item} onChange={(e) => {
                const n = [...searchTags]; n[idx] = e.target.value; setValue("searchTags", n);
              }} />
            )}
          />
        </div>
      </FormSection>

      <UniversityMediaSection watch={watch} setValue={setValue} />

      <FormSection title="Academic Programs" description="Faculties and majors." icon={AcademicCapIcon}>
        <MajorsEditor majors={majors} onChange={(next) => setValue("majors", next)} />
      </FormSection>

      <FormSection title="Student Living & Housing" description="Dormitory options." icon={MapPinIcon}>
        <DynamicListEditor
          items={accommodationFields}
          onAdd={() => appendAccommodation({ type: "", pricePerYear: "", notes: "" })}
          onRemove={(idx) => removeAccommodation(idx)}
          renderItem={(item, idx) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-gray-50/30 rounded-[48px] border border-gray-100 transition-all hover:bg-white">
              <Input label="Accommodation Type" error={errors.accommodation?.[idx]?.type?.message} {...register(`accommodation.${idx}.type`)} />
              <Input label="Price (¥ per Year)" {...register(`accommodation.${idx}.pricePerYear`)} />
              <div className="md:col-span-2">
                <Input type="textarea" label="Facilities Details" rows={3} {...register(`accommodation.${idx}.notes`)} />
              </div>
            </div>
          )}
        />
      </FormSection>
    </AdminFormContainer>
  );
};

export default UniversityForm;
