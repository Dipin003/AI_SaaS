"use client"

import { deleteCoverLetter } from '@/actions/cover-letter';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';

import { Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';


const CoverLetterList = ({ coverLetters }) => {

  const router = useRouter()

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id)
      toast.success("Cover letter deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter")
    }
  }

  if (!coverLetters?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Cover Letters Yet</CardTitle>
          <CardDescription>
            Create your first cover letter to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {coverLetters.map((letter) => (
        <Card key={letter.id} className="group relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl gradient-title">
                  {letter.job} at {letter.companyName}
                </CardTitle>
                <CardDescription>
                  Created {format(new Date(letter.createdAt), "PPP")}
                </CardDescription>
              </div>

              <div className="flex space-x-2">
                <AlertDialog>
                  <Button variant='outline' size='icon'
                    onClick={() => router.push(`ai-cover-letter/${letter.id}`)}
                  >
                    <Eye className='size-4' />
                  </Button>
                  <AlertDialogTrigger>
                    <Button variant='outline' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your cover letter for {letter.jobTitle} at{" "}
                        {letter.companyName}
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlterDialogFooter>
                      <AlertDialogCancel>
                        Cancle
                      </AlertDialogCancel>

                      <AlertDialogAction onClick={() => handleDelete(letter.id)}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      >
                        Delete
                      </AlertDialogAction>

                    </AlterDialogFooter>

                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm line-clamp-3">
              {letter.jobDescription}
            </div>
          </CardContent>
        </Card>
      ))}

    </div>
  )
}
export default CoverLetterList