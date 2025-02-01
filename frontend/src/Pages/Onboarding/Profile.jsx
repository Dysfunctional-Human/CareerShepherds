
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import ProgressBar from "@/components/profile_components/ProgressBar"
import { BasicInfo } from "@/components/profile_components/Basicinfo"
import { EducationAndSkills } from "@/components/profile_components/EducationAndSkills"
import { WorkExperienceAndProjects } from "@/components/profile_components/WorkExperienceAndProjects"
import { FormNavigation } from "@/components/profile_components/FormNavigation"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useUser } from "@/context/userContext"
import { useMutation,useQuery } from "@tanstack/react-query"
const formSteps = [
  { title: "Basic Information", component: BasicInfo },
  { title: "Education and Skills", component: EducationAndSkills },
  {
    title: "Work Experience and Projects",
    component: WorkExperienceAndProjects
  }
]

export default function ProfileBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({});
  const navigate=useNavigate();
  const {userData, setUserData} = useUser();
  const location = useLocation();
  const data=location.state;
  const [profile, setProfile] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    username: userData?.username || "",
    phoneNumber: "",
    socialLinks: { linkedIn: "", gitHub: "" },
    workExperience: userData?.workExperience?.map(
      exp => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        startYear: "",
        endYear: "",
        responsibilities: exp.responsibilities
      })
    ) || [
      {
      jobTitle: "",
      company: "",
      startYear: "",
      endYear: "",
      responsibilities: ""
      }
    ],
    educationDetails: userData?.educationDetails || [
      { schoolName: "", degree: "", startYear: "", endYear: "", major: "" }
    ],
    skills: userData?.skills?.map(skill => ({ id: skill, label: skill })) || [],
    desiredSkills: userData?.desiredSkills?.map(skill => ({ id: skill, label: skill })) || [],
    projects: userData?.projects?.map(project =>({
      name: project.name,
      description: project.description,
      technologiesUsed: project.technologiesUsed?.map(technology => ({ id: technology, label: technology }))||[]
    })) || [{ name: "", description: "", technologiesUsed: [] }]
    })

  const handleChange = (e, field, index, subfield) => {
    if (index !== undefined && subfield) {
      setProfile(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) =>
          i === index ? { ...item, [subfield]: e.target.value } : item
        )
      }))
    } else if (field === "socialLinks") {
      setProfile(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [subfield]: e.target.value }
      }))
    } else {
      setProfile(prev => ({ ...prev, [field]: e.target.value }))
    }
  }

  const addArrayField = field => {
    setProfile(prev => {
      if (
        (field === "workExperience" && prev.workExperience.length >= 3) ||
        (field === "educationDetails" && prev.educationDetails.length >= 2) ||
        (field === "projects" && prev.projects.length >= 3)
      ) {
        return prev
      }
      return {
        ...prev,
        [field]: [
          ...prev[field],
          field === "workExperience"
            ? {
                jobTitle: "",
                company: "",
                startYear: "",
                endYear: "",
                responsibilities: ""
              }
            : field === "educationDetails"
            ? {
                schoolName: "",
                degree: "",
                startYear: "",
                endYear: "",
                major: ""
              }
            : field === "projects"
            ? { name: "", description: "", technologiesUsed: [] }
            : ""
        ]
      }
    })
  }

  const removeArrayField = (field, index) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }
  const { data: da, isLoading, error :er} = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/me"); // Replace with your API endpoint
      return response.data;
    }
  });
  useEffect(()=>{
    if(da){
      setProfile(prev => ({
        ...prev,
        firstName: da.firstName,
        lastName: da.lastName,
        email: da.email,
        username: da.username,
      }));
    }
  },[da]);
  const{mutate,isError,isPending,error}=useMutation({
    mutationFn:async({firstName,lastName,email,username,phoneNumber,socialLinks,workExperience,educationDetails,skills,desiredSkills,projects})=>{
        // if(!firstName){
        //   setCurrentStep(0);
        //   throw new Error("First Name is required");
        // };
        // if(!email){
        //   setCurrentStep(0);
        //   throw new Error("Email is required");
        // };
        // if(!username){
        //   setCurrentStep(0);
        //   throw new Error("Username is required");
        // };
        skills=skills.map(
            (skill) => {
                return skill.label;
            }
        )
        desiredSkills=desiredSkills.map(
            (skill) => {
                return skill.label;
            }
        )
        projects=projects.map(
            (project) => {
                return {
                    name: project.name,
                    description: project.description,
                    technologiesUsed: project.technologiesUsed.map(
                        (technology) => {
                            return technology.label;
                        }
                    )
                }
            }
        )
        console.log({firstName,lastName,email,username,phoneNumber,socialLinks,workExperience,educationDetails,skills,desiredSkills,projects});
        const res=await axios.put('/api/user/update',{firstName,lastName,email,username,phoneNumber,socialLinks,workExperience,educationDetails,skills,desiredSkills,projects},
        {
            headers:{
                'Content-Type':'application/json'
            }
        });
      },
      onSuccess:()=>{
        toast.success("Profile built successfully");
        navigate('/app/recommendations');
      },
      onError:(error)=>{
        toast.error(error.message);
      }
        
});
  const handleSubmit = e => {
    e.preventDefault();
    console.log(profile);
    mutate(profile);
  }

  const calculateCompletionPercentage = () => {
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.username,
      profile.phoneNumber,
      profile.socialLinks.linkedIn,
      profile.socialLinks.gitHub,
      ...profile.workExperience.flatMap(exp => Object.values(exp)),
      ...profile.educationDetails.flatMap(edu => Object.values(edu)),
      ...profile.skills,
      ...profile.desiredSkills,
      ...profile.projects.flatMap(proj => [
        proj.name,
        proj.description,
        ...proj.technologiesUsed
      ])
    ]

    const filledFields = fields.filter(field => field !== "").length
    const totalFields = fields.length

    return Math.round((filledFields / totalFields) * 100)
  }

  const CurrentStepComponent = formSteps[currentStep].component

  return (
    <div className="bg-black w-screen h-screen flex flex-col items-center justify-center">
    <Card className=' w-2/3 h-10/12 overflow-y-auto no-scrollbar m-10 p-10'>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
            {formSteps[currentStep].title}
        </h1>
        <ProgressBar percentage={calculateCompletionPercentage()} />
        <CurrentStepComponent
          profile={profile}
          handleChange={handleChange}
          addArrayField={addArrayField}
          removeArrayField={removeArrayField}
          setProfile={setProfile}
        />
        <FormNavigation
          currentStep={currentStep}
          totalSteps={formSteps.length}
          onPrevious={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          onNext={() =>
            setCurrentStep(prev => Math.min(formSteps.length - 1, prev + 1))
          }
        />
        {currentStep === formSteps.length - 1 && (
          <Button type="submit" className="w-full">
            Submit Profile
          </Button>
        )}
      </form>
      </Card>
    </div>
  )
}

