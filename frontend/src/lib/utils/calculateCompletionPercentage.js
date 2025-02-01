

const calculateCompletionPercentage = (profile) => {
    const fields = [
        profile.firstName,
        profile.lastName,
        profile.email,
        profile.username,
        profile.phoneNumber,
        profile.socialLinks.linkedIn,
        profile.socialLinks.gitHub,
        ...profile.workExperience.flatMap((exp) => Object.values(exp)),
        ...profile.educationDetails.flatMap((edu) => Object.values(edu)),
        ...profile.skills,
        ...profile.desiredSkills,
        ...profile.projects.flatMap((proj) => [proj.name, proj.description, ...proj.technologiesUsed]),
    ]

    const filledFields = fields.filter((field) => field !== "").length
    const totalFields = fields.length

    return Math.round((filledFields / totalFields) * 100)
    }
export default calculateCompletionPercentage