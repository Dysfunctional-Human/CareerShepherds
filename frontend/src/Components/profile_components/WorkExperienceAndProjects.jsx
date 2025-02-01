import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle } from "lucide-react"
import { TagInput } from "../ui/tag-input"

export function WorkExperienceAndProjects({
  profile,
  handleChange,
  addArrayField,
  removeArrayField,
  setProfile
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Work Experience</Label>
        {profile.workExperience.map((exp, index) => (
          <div key={index} className="mb-4 p-4 grid gap-2 border border-border rounded">
            <Input
              placeholder="Job Title"
              value={exp.jobTitle}
              onChange={e =>
                handleChange(e, "workExperience", index, "jobTitle")
              }
            />
            <Input
              placeholder="Company"
              value={exp.company}
              onChange={e =>
                handleChange(e, "workExperience", index, "company")
              }
            />
            <Label className='text-xs opacity-75'>Start Year</Label>
            <Input
              placeholder="Start Year"
              value={exp.startYear}
              type="month"
              min="1950-01"
              className="w-full"
              onChange={e =>
                handleChange(e, "workExperience", index, "startYear")
              }
            />
            <Label className='text-xs opacity-75'>End Year</Label>
            <Input
              placeholder="End Year"
              value={exp.endYear}
              type="month"
              min="1950-01"
              className="w-full"
              onChange={e =>
                handleChange(e, "workExperience", index, "endYear")
              }
            />
            <Textarea
              placeholder="Responsibilities"
              value={exp.responsibilities}
              onChange={e =>
                handleChange(e, "workExperience", index, "responsibilities")
              }
            />
            {index > 0 && (
              <Button
                type="button"
                onClick={() => removeArrayField("workExperience", index)}
                variant="destructive"
              >
                <MinusCircle className="mr-2 h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        ))}
        {profile.workExperience.length < 3 && (
          <Button type="button" onClick={() => addArrayField("workExperience")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Work Experience
          </Button>
        )}
      </div>

      <div>
        <Label>Projects</Label>
        {profile.projects.map((project, index) => (
          <div key={index} className="mb-4 p-4 border grid gap-2 border-border rounded">
            <Input
              placeholder="Project Name"
              value={project.name}
              onChange={e => handleChange(e, "projects", index, "name")}
            />
            <Textarea
              placeholder="Description"
              value={project.description}
              onChange={e => handleChange(e, "projects", index, "description")}
            />
            <div>
              <Label>Technologies Used</Label>
              <TagInput
                tags={project.technologiesUsed}
                setTags={newTags => {
                  const newProjects = [...profile.projects]
                  newProjects[index].technologiesUsed = newTags
                  setProfile(prev => ({ ...prev, projects: newProjects }))
                }}
                placeholder="Add a technology"
                suggestions={[
                  { id: "react", label: "React" },
                  { id: "nextjs", label: "Next.js" },
                  { id: "nodejs", label: "Node.js" },
                  { id: "express", label: "Express" },
                  { id: "mongodb", label: "MongoDB" }
                ]}
              />
            </div>
            {index > 0 && (
              <Button
                type="button"
                onClick={() => removeArrayField("projects", index)}
                variant="destructive"
              >
                <MinusCircle className="mr-2 h-4 w-4" /> Remove Project
              </Button>
            )}
          </div>
        ))}
        {profile.projects.length < 3 && (
          <Button type="button" onClick={() => addArrayField("projects")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Button>
        )}
      </div>
    </div>
  )
}
