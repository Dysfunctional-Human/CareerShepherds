import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle } from "lucide-react"
import { TagInput } from "../ui/tag-input"

export function EducationAndSkills({
  profile,
  handleChange,
  addArrayField,
  removeArrayField,
  setProfile
}) {
  return (
    <div className="space-y-6">

      <div>
        <Label>Skills</Label>
        <TagInput
          tags={profile.skills}
          setTags={newTags =>
            setProfile(prev => ({ ...prev, skills: newTags }))
          }
          placeholder="Add a skill"
        />
      </div>

      <div>
        <Label>Desired Skills</Label>
        <TagInput
          tags={profile.desiredSkills}
          setTags={newTags =>
            setProfile(prev => ({ ...prev, desiredSkills: newTags }))
          }
          placeholder="Add a desired skill"
          suggestions={[
            { id: "python", label: "Python" },
            { id: "machinelearning", label: "Machine Learning" },
            { id: "aws", label: "AWS" },
            { id: "docker", label: "Docker" },
            { id: "kubernetes", label: "Kubernetes" }
          ]}
        />
      </div>
      <div >
        <Label>Education Details</Label>
        {profile.educationDetails.map((edu, index) => (
          <div key={index} className="mb-4 p-4 grid gap-2 border border-border rounded">
            <Input
              placeholder="School Name"
              value={edu.schoolName}
              onChange={e =>
                handleChange(e, "educationDetails", index, "schoolName")
              }
            />
            <Input
              placeholder="Degree"
              value={edu.degree}
              onChange={e =>
                handleChange(e, "educationDetails", index, "degree")
              }
            />
            <Label className='text-xs opacity-75'>Start Year</Label>
            <Input
              placeholder="Start Year"
              value={edu.startYear}
              type="month"
              onChange={e =>
                handleChange(e, "educationDetails", index, "startYear")
              }
            />
            <Label className='text-xs opacity-75'>End Year</Label>
            <Input
              placeholder="End Year"
              value={edu.endYear}
              type="month"
              onChange={e =>
                handleChange(e, "educationDetails", index, "endYear")
              }
            />
            <Input
              placeholder="Major"
              value={edu.major}
              onChange={e =>
                handleChange(e, "educationDetails", index, "major")
              }
            />
            {index > 0 && (
              <Button
                type="button"
                onClick={() => removeArrayField("educationDetails", index)}
                variant="destructive"
              >
                <MinusCircle className="mr-2 h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        ))}
        {profile.educationDetails.length < 2 && (
          <Button
            type="button"
            onClick={() => addArrayField("educationDetails")}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Education
          </Button>
        )}
      </div>
    </div>
  )
}
