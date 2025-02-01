import React, { useState,useEffect } from 'react'
import { CoursesArray } from './CoursesArray'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { TagInput } from '@/components/ui/tag-input';
import { Search, SearchIcon } from 'lucide-react';
import axios from 'axios';
function Recommend() {
  const [desiredRecs,setdesiredRecs] = useState(null);
  const [recs,setRecs] = useState(null);
  const [explicitRecs,setExplicitRecs] = useState(null);
  const [explictLoading,setExplicitLoading] = useState(false);
  // const [skills,setSkills] = useState([]);
  const [skills,setSkills] = useState('');
  function searchHandler(){
    if(!skills){
      toast.error('Please enter some skills to get recommendations');
      return;
    }
    const fetchRecommendations = async () => {
      setExplicitLoading(true);
      const response = await axios.post('/api/recommendations/explicit', { text:skills });
      return response.data;
    };

    fetchRecommendations()
      .then(data => {
        const res = data.recs;
        setExplicitLoading(false);
        if (res) {
          setExplicitRecs(Object.keys(res.url).map(key => ({
            url: res.url[key],
            title: res.course_title[key],
            popularity: res.popularity_score[key]
          })));
        }
      })
      .catch(error => {
        console.error('Failed to fetch recommendations:', error);
        toast.error(`Failed to fetch recommendations: ${error.message}`);
      });
    }
  const {data,isPending,error}=useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const response=await fetch('/api/recommendations');
      const data=await response.json();
      if(!response.ok){
        throw new Error(data.error || 'Failed to fetch recommendations');
      }
      const res1=data.recs;
      const res2=data.drecs;
      if(res1){
        setRecs(Object.keys(res1.url).map(key => ({
          url: res1.url[key],
          title: res1.course_title[key],
          popularity: res1.popularity_score[key]
        })))
      }
      if(res2){
        setdesiredRecs(Object.keys(res2.url).map(key => ({
          url: res2.url[key],
          title: res2.course_title[key],
          popularity: res2.popularity_score[key]
        }))
        )
      }
      return data;
    },
    onError: (error) => {
      console.error('Failed to fetch recommendations:', error);
      toast.error(`Failed to fetch recommendations: ${error.message}`);
    },
  });
  return (
    <div className='mt-20 ml-0 scale-90'>
        {/* <TagInput
          tags={skills}
          className='w-1/3 absolute right-32'
          setTags={newTags => setSkills(newTags)}
          maxTags={4}
          placeholder="Got something you want to learn? Get explicit recommendations"
          /> */}
          <Input
          className='w-1/3 absolute right-32'
          placeholder='Got something you want to learn? Get explicit recommendations'
          onChange={(e) => setSkills(e.target.value)}
          ></Input>
          <div 
          className='absolute right-20 top-0 w-10 h-10 border rounded-sm flex items-center justify-center'
          onClick={searchHandler}
          >
            <SearchIcon className=''/>
          </div>
      {(!explicitRecs && !explictLoading)?
      <div className='p-10 mt-10 pb-0'>
        <h1 className='text-4xl pl-10 -mb-3 font-thin'>Recommendations based on your <b className='text-violet-600'>desired skills</b></h1>
          <CoursesArray cards={desiredRecs} isLoading={isPending}/>
        <h1 className='text-4xl pl-10 -mb-3 font-thin'>Get better at what you <b className='text-emerald-300'>already know</b></h1>
          <CoursesArray cards={recs} isLoading={isPending}/>
      </div>
      :
      <div className='p-10 mt-10 pb-0'>
        <h1 className='text-4xl pl-10 -mb-3 font-thin'>Recommendations based on your <b className='text-red-500'>Search</b></h1>
          <CoursesArray cards={explicitRecs} isLoading={explictLoading}/>
      </div>
      }
    </div>
  )
}

export default Recommend
