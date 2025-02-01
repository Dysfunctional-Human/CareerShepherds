import { BentoCard } from '@/components/ui/bento-grid'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Heading, ScanText,SquarePen,PencilLine } from 'lucide-react'
import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useUser } from '@/context/userContext'
function Upload() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const {userData, setUserData} = useUser();
    const {mutate,isError,error,isPending} = useMutation({
        mutationFn:async (selectedFile) => {
            const formData = new FormData();
            formData.append('filename', "resume");
            formData.append('pdf_file', selectedFile);

            const response1 = await axios.post('/api/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // if(!response1.ok){
            //     throw new Error(response1.data.error || "Failed to upload file");
            // }
            const response2 = await axios.get('/api/resume/parse');
            // if(!response2.ok){
            //     throw new Error(response2.data.error || "Failed to parse file");
            // }
            const data=await response2.data;
            return {res1:response1.data, res2:response2.data};
        },
        onSuccess: (data) => {
            console.log('File uploaded and parsed successfully:', data);
            
            // Extract parsed resume details
            const parsedData = data.res2;  // response2.data
            const updatedUserData = {
                name: parsedData.Name,
                contactInfo: parsedData["Contact Information"],
                skills: parsedData.Skills,
                educationDetails: parsedData.Education,
                workExperience: parsedData["Work Experience"],
                projects: parsedData.Projects,
                desiredSkills: parsedData.desiredSkills || [], // Handle missing field gracefully
            };
        
            // Update user state
            setUserData(updatedUserData);
        
            console.log('Updated userData:', updatedUserData);
            toast.success('Uploaded successfully');
            navigate('/onboarding/profile');
        }
        ,
            onError: (error) => {
                console.error('Upload failed:', error);
                toast.error(`Upload failed ${error.message}`);
            }
        });

    function handleFileUpload(file) {
        setFile(file);
        mutate(file);
    }
    return (
    <div className='bg-black w-screen h-screen flex flex-col items-center justify-center'>
        <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{duration:0.8}}
            className='w-5/6 h-5/6 flex flex-col items-center justify-center p-3 '>
        <Card className='w-3/4 h-3/4 flex flex-col items-center justify-center bg-black p-3'>
        <div className='text-4xl mb-10'>Choose a way to build your profile</div>
        <div className='flex items-center justify-center'>
            <Card className='w-72 h-72 flex flex-col items-center justify-center text-center m-6'>
                <CardContent className='flex flex-col items-center justify-center text-center '>
                <ScanText size="80" style={{marginBottom:"10",opacity:"60%"}} strokeWidth={1}/>
                <div className='text-xl font-medium mb-3'>Upload your resume</div>
                
                <CardDescription>use our resume parsing service to fill in details for you!</CardDescription>
                <input
                type="file"
                style={{ display: 'none' }}
                id="file-upload"
                name='pdf_file'
                onChange={(e) =>{if(e.target.files[0]) {
                    handleFileUpload(e.target.files[0])
                  }}}
                />
                <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center justify-center w-72 h-72 absolute "
                ></label>
                </CardContent>
            </Card>
            <Link to='/onboarding/profile'>
            <Card className='w-72 h-72 flex flex-col items-center justify-center text-center m-6'>
                <CardContent className='flex flex-col items-center justify-center text-center '>
                <PencilLine size="80" style={{marginBottom:"10",opacity:"60%"}} strokeWidth={1}/>
                <div className='text-xl font-medium mb-3'>Fill in Manually</div>
                
                <CardDescription>manually fill in your details to build your profile</CardDescription>
                </CardContent>

            </Card>
            </Link>
        </div>
        {isPending?<div className='text-white'>File is being uploaded please wait..</div>:null}
        </Card>
        </motion.div>
        </div>
        
    )
}

export default Upload
