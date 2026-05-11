import { Badge } from "@/components/ui/badge";

interface SkillTagsProps {
  skills: string[];
}

export function SkillTags({ skills }: SkillTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge key={skill} variant="secondary">
          {skill}
        </Badge>
      ))}
    </div>
  );
}
