import axios from "axios";
const FAST_API_URL = 'http://localhost:8000';
function selectSkill(skills){
    if(skills.length>0)return skills[Math.floor(Math.random()*skills.length)];
    else return null;
}
export async function getRecommendations(req, res) {
    try{
        const user=req.user;
        const skills = user.skills;
        const desiredSkills = user.desiredSkills;
        if(skills.length==0){
            res.status(404).send({ message: 'No Skills Found' ,user});
            return;
        }
        let selectedSkill=selectSkill(skills);
        const response1=await axios.post(`${FAST_API_URL}/api/recommend-courses`,{text:selectedSkill});
        selectedSkill=selectSkill(desiredSkills);
        let response2=[];
        if(selectedSkill)response2=await axios.post(`${FAST_API_URL}/api/recommend-courses`,{text:selectedSkill});
        res.status(200).send({recs:response1.data,drecs:response2.data});
    }catch(err){
        console.log("Error in recommendation controller", err.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export async function getExplicitRecommendations(req, res) {
    try{
        const text=req.body.text;
        if(!text){
            res.status(404).send({ message: 'Please provide explicit skills' });
            return;
        }
        const response1=await axios.post(`${FAST_API_URL}/api/recommend-courses`,{text:text});
        res.status(200).send({recs:response1.data});
    }catch(err){
        console.log("Error in recommendation controller", err.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}
