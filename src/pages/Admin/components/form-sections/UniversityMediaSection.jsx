import React from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import FormSection from "../../../../components/common/FormSection";
import MediaUpload from "../../../../components/common/MediaUpload";
import DynamicListEditor from "../../../../components/common/DynamicListEditor";

const UniversityMediaSection = ({ watch, setValue }) => {
  const logo = watch("logo");
  const bannerImage = watch("bannerImage");
  const albums = watch("albums") || [];

  return (
    <FormSection
      title="Visual & Media Identity"
      description="High-resolution branding assets and campus photography."
      icon={PhotoIcon}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <MediaUpload
          label="Institutional Logo"
          value={logo}
          onChange={(val) => setValue("logo", val)}
          folder="nadoumi/logos"
          containerClassName="max-w-[120px] aspect-square mx-auto mb-4"
        />
        <MediaUpload
          label="Primary Banner / Hero Image"
          value={bannerImage}
          onChange={(val) => setValue("bannerImage", val)}
          folder="nadoumi/banners"
          containerClassName="max-w-xl aspect-[3/1] max-h-40 mx-auto"
        />
      </div>
      <DynamicListEditor
        title="Campus Gallery"
        addLabel="Add Photo"
        items={albums}
        onAdd={() => setValue("albums", [...albums, ""])}
        onRemove={(idx) => setValue("albums", albums.filter((_, i) => i !== idx))}
        renderItem={(url, idx) => (
          <MediaUpload
            key={idx}
            label={`Gallery Image #${idx + 1}`}
            value={url}
            onChange={(val) => {
              const next = [...albums];
              next[idx] = val;
              setValue("albums", next);
            }}
            folder="nadoumi/gallery"
          />
        )}
      />
    </FormSection>
  );
};

export default UniversityMediaSection;
