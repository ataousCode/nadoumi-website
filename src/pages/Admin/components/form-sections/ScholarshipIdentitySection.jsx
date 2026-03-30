import React from "react";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import FormSection from "../../../../components/common/FormSection";
import Input from "../../../../components/common/Input";
import MediaUpload from "../../../../components/common/MediaUpload";
import UniversitySelector from "../UniversitySelector";

const ScholarshipIdentitySection = ({
  register,
  errors,
  watch,
  setValue,
  universities,
}) => {
  const coverImage = watch("coverImage");
  const selectedUniversities = watch("universities") || [];

  return (
    <FormSection
      title="Core Scholarship Identity"
      description="Basic information and university affiliations."
      icon={AcademicCapIcon}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          type="checkbox"
          label="Recommended Spotlight"
          {...register("isRecommended")}
        />
        <Input
          type="checkbox"
          label="Hot / Trending"
          {...register("isHot")}
        />
        <Input
          type="checkbox"
          label="Top Global Scholarship"
          {...register("isTop")}
        />
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="Title (English)"
            required
            placeholder="e.g. Sichuan Province Scholarship"
            error={errors.title?.message}
            {...register("title")}
          />
          <Input
            label="Title (Chinese)"
            placeholder="e.g. 四川省政府奖学金"
            error={errors.titleInChinese?.message}
            {...register("titleInChinese")}
          />
        </div>
        <div className="md:col-span-2">
          <Input
            type="textarea"
            label="Description & Overview"
            required
            placeholder="e.g. Full tuition waiver and monthly stipend..."
            error={errors.description?.message}
            {...register("description")}
            rows={5}
          />
        </div>
        <div className="md:col-span-2">
          <MediaUpload
            label="Scholarship Cover Image"
            value={coverImage}
            onChange={(val) => setValue("coverImage", val)}
            folder="nadoumi/scholarships"
            containerClassName="max-w-xl aspect-[3/1] max-h-44 mx-auto"
          />
        </div>
        <div className="md:col-span-2">
          <UniversitySelector
            selectedIds={selectedUniversities}
            universities={universities}
            onChange={(ids) => setValue("universities", ids)}
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <Input
            type="select"
            label="Scholarship Type"
            error={errors.scholarshipCategory?.message}
            {...register("scholarshipCategory")}
            options={[
              { value: "Self_funded", label: "Self-funded (Shows in 'Recommended Programs' on Home)" },
              { value: "Partial", label: "Partial Fee Coverage" },
              { value: "CSC", label: "CSC (Full Scholarship)" },
              { value: "Province", label: "Provincial Fund" },
              { value: "Universities", label: "University Scholarship" },
              { value: "HSK", label: "HSK Scholarship" },
              { value: "Type_A", label: "Type A Scholarship" },
              { value: "Type_B", label: "Type B Scholarship" },
              { value: "Type_C", label: "Type C Scholarship" },
              { value: "Other", label: "Other / Specialized" },
            ]}
          />
          <Input
            type="select"
            label="Teaching Language"
            error={errors.teachingLanguage?.message}
            {...register("teachingLanguage")}
            options={[
              { value: "English", label: "English Only" },
              { value: "Chinese", label: "Chinese Only" },
              { value: "Both", label: "Bilingual (EN/CN)" },
            ]}
          />
          <Input
            type="select"
            label="Publishing Status"
            error={errors.status?.message}
            {...register("status")}
            options={[
              { value: "published", label: "Publicly Visible" },
              { value: "draft", label: "Save as Draft" },
              { value: "closed", label: "Applications Closed" },
              { value: "limited", label: "Limited Slots" },
            ]}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default ScholarshipIdentitySection;
