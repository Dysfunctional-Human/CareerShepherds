
import userModel from "../models/userModel.js";
export const getUserProfile = async (req, res) => {
    const user=req.user;
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
};
export async function updateUser(req, res){
    const { firstName,lastName,username, email,phoneNumber, socialLinks,workExperience,educationDetails,skills,desiredSkills,projects} = req.body;
    const user =req.user;
    if (user) {
        if(firstName)user.firstName = firstName;
        if(lastName)user.lastName = lastName;
        if(username)user.username = username;
        if(email)user.email = email;
        if(phoneNumber)user.phoneNumber = phoneNumber;
        if(socialLinks)user.socialLinks = socialLinks;
        if(workExperience)user.workExperience = workExperience;
        if(educationDetails)user.educationDetails = educationDetails;
        if(skills)user.skills = skills;
        if(desiredSkills)user.desiredSkills = desiredSkills;
        if(projects)user.projects = projects;
        await user.save();
        res.send(user);
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}