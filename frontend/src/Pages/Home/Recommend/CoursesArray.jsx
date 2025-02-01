"use client";;
import React from "react";
import { LinkPreview } from "@/components/ui/link-preview";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Ratings } from "@/components/ui/Rating";
import { Skeleton } from "@/components/ui/skeleton";

export function CoursesArray({cards,isLoading}) {
  return (
    (<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-8">
        {!isLoading?<>
        {cards?.map((item, index) => (
        <LinkPreview url={item.url} className="">
          <Card className='text-wrap flex flex-col justify-between h-60 w-60'>
            <CardHeader className=''>{item.title}</CardHeader>
            <CardDescription className='pl-7 font-thin' >
                Popularity Score:
                <Ratings rating={item.popularity} className=' flex mb-20' variant="yellow" />
                </CardDescription>
          </Card>
        </LinkPreview>
          ))}</>
        :
        <>
        <Skeleton className='h-60 w-60 rounded-xl' />
        <Skeleton className='h-60 w-60 rounded-xl' />
        <Skeleton className='h-60 w-60 rounded-xl' />
        <Skeleton className='h-60 w-60 rounded-xl' />
        <Skeleton className='h-60 w-60 rounded-xl' />
        </>}
    </div>)
  );
}
