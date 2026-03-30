import React from "react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import FormSection from "../../../../components/common/FormSection";
import Input from "../../../../components/common/Input";

const UniversityIdentitySection = ({ register, errors }) => {
  return (
    <FormSection
      title="General Information"
      description="Basic structural data and geographical location."
      icon={BuildingOfficeIcon}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="Institution Name (English)"
            required
            placeholder="e.g. Peking University"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Institution Name (Chinese)"
            placeholder="e.g. 北京大学"
            error={errors.nameInChinese?.message}
            {...register("nameInChinese")}
          />
        </div>
        <Input
          label="Registry ID / Code"
          required
          placeholder="e.g. PKU-12345"
          error={errors.universityId?.message}
          {...register("universityId")}
        />
        <Input
          type="select"
          label="Establishment Type"
          error={errors.type?.message}
          options={[
            { value: "Public", label: "Public Institution" },
            { value: "Private", label: "Private Institution" },
          ]}
          {...register("type")}
        />
        <Input
          label="Campus City"
          placeholder="e.g. Beijing"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="Region / Province"
          placeholder="e.g. Beijing Municipality"
          error={errors.province?.message}
          {...register("province")}
        />
        <Input
          label="Global QS Ranking"
          type="number"
          placeholder="e.g. 150"
          error={errors.qsRank?.message}
          {...register("qsRank", { valueAsNumber: true })}
        />
        <Input
          label="Year Founded"
          type="number"
          placeholder="e.g. 1958"
          error={errors.foundedYear?.message}
          {...register("foundedYear", { valueAsNumber: true })}
        />
        <Input
          label="Total Students"
          type="number"
          placeholder="e.g. 25000"
          error={errors.totalStudents?.message}
          {...register("totalStudents", { valueAsNumber: true })}
        />
        <Input
          label="International Students"
          type="number"
          placeholder="e.g. 3500"
          error={errors.internationalStudents?.message}
          {...register("internationalStudents", { valueAsNumber: true })}
        />
        <Input
          label="Faculty Count"
          type="number"
          placeholder="e.g. 1200"
          error={errors.facultyCount?.message}
          {...register("facultyCount", { valueAsNumber: true })}
        />
        <Input
          type="checkbox"
          label="Featured / Recommended Institution"
          {...register("isRecommended")}
        />
        <Input
          type="checkbox"
          label="Partner University"
          {...register("isPartner")}
        />
        <Input
          type="checkbox"
          label="Top University in China"
          {...register("isTop")}
        />
        <Input
          label="Recommendation Note"
          placeholder="e.g. Top Engineering School"
          error={errors.recommendationNotes?.message}
          {...register("recommendationNotes")}
        />
        <Input
          type="select"
          label="Institutional Visibility Status"
          error={errors.status?.message}
          options={[
            { value: "active", label: "✅ Published (Publicly Visible)" },
            { value: "draft", label: "📝 Draft (Hidden)" },
            { value: "closed", label: "🔒 Applications Closed" },
          ]}
          {...register("status")}
        />
      </div>
    </FormSection>
  );
};

export default UniversityIdentitySection;
