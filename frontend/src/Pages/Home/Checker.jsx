import React,{useState,useEffect,Fragment} from 'react'
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
function Checker() {
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState('');
    const [checkerResult, setCheckerResult] = useState(null);
    const {mutate,isError,error,isPending} = useMutation({
        mutationFn:async ({selectedFile,jd}) => {
            const formData = new FormData();
            formData.append('filename', "resume");
            formData.append('pdf_file', selectedFile);

            const response1 = await axios.post('/api/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const response2 = await axios.post('/api/resume/check',{jd});
            // if(!response2.ok){
            //     throw new Error(response2.data.error || "Failed to parse file");
            // }
            const data= response2.data.data;
            setCheckerResult(data);
            return {res1:response1.data,res2:response2.data};
        },
            onSuccess: (data) => {
                console.log('File uploaded and and checked successfully:', data);
                toast.success('uploaded successfully');
                 // Redirect after success
            },
            onError: (error) => {
                console.error('Upload failed:', error);
                toast.error(`Upload failed ${error.message}`);
            }
        });
    const handleSubmit = async () => {
        if(!file){
            toast.error('Please upload a file');
            return;
        }
        if(!jd){
            toast.error('Please enter a job description');
            return;
        }
        mutate({selectedFile:file,jd});
    }
    function handleFileUpload(file) {
        setFile(file);
        // mutate(file);
    }
  return (
        <Card className="w-full mt-24 min-h-[600px] shadow-inner">
        <div className="flex h-full" style={{ minHeight: "inherit" }}>
          <div className="flex-1 p-6 min-w-[50%] border-r">
            <h3 className='text-2xl font-semibold mb-6'>Optimize your resume based on a Job Description</h3>
                <div className="text-muted-foreground flex mt-2 whitespace-pre-wrap">
                    <div className='text-base text-zinc-200 '>Upload resume: </div>
                            <input
                        type="file"
                        id="file-upload"
                        className="ml-4"
                        name='pdf_file'
                        onChange={(e) =>{if(e.target.files[0]) {
                            handleFileUpload(e.target.files[0])
                        }}}
                        />
                        <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex items-center justify-center"
                        ></label>
                </div>
                <div className="text-muted-foreground text-base whitespace-pre-wrap">
                    <div className='text-zinc-200'>Job Description: </div>
                    <Textarea
                       onChange={(e) => setJd(e.target.value)}
                          value={jd}
                            placeholder="Enter Job Description"
                            className="w-full h-40"
                            name="jd"
                        />
                </div>
                <Button className="mt-4" onClick={handleSubmit}>Check Resume</Button>
                {isPending?<div className='text-white'>File is being uploaded please wait..</div>:null}
          </div>
          <div className="flex-1 p-6 min-w-[50%]">
            <h3 className='font-semibold mb-4 text-2xl'>Output:</h3>
            <p className="text-muted-foreground">
                {checkerResult&& Object.keys(checkerResult)?.map((key) => (
                <Fragment key={key}>
                <div className='flex gap-2' >
                {key==="Fitment Score"?<>
                <h4 className='text-zinc-200'>{key} :</h4><p>{checkerResult[key] !== null ? checkerResult[key].toString()+" / 10" : null}</p></>:
                <div className='flex flex-col'>
                <h4 className='text-zinc-200'>{key} :</h4>
                <div>
                {Array.isArray(checkerResult[key]) ? (
                <ul>
                    {checkerResult[key].map((item, index) => (
                        <li className='m-1 ml-0' key={index}>{item}</li>
                    ))}
                </ul>
                ) : (
                <p>{checkerResult[key] !== null ? checkerResult[key].toString() : null}</p>
                )}
                </div>
                </div>}
                </div>

                </Fragment>
                ))}

            </p>
          </div>
        </div>
      </Card>
    );

}

export default Checker
