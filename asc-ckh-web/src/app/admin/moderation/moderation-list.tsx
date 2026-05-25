'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { answerQuestion, rejectQuestion } from './actions'

type PendingQuestion = {
  id: string
  question: string
  created_at: string
  user_profiles: {
    first_name: string
    last_name: string
    title_prefix: string | null
  } | null
}

export function ModerationList({ questions }: { questions: PendingQuestion[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'answer' | 'reject' | null>(null)
  const [textInput, setTextInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAction = (id: string, type: 'answer' | 'reject') => {
    setActiveId(id)
    setActionType(type)
    setTextInput('')
    setError(null)
  }

  const handleSubmit = async () => {
    if (!activeId || !actionType) return

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('question_id', activeId)
    
    let result;

    if (actionType === 'answer') {
      formData.append('answer', textInput)
      result = await answerQuestion(formData)
    } else {
      formData.append('reason', textInput)
      result = await rejectQuestion(formData)
    }

    setIsSubmitting(false)

    if (result?.error) {
      setError(result.error)
    } else {
      // Reset state on success. The server action called revalidatePath, so the list will update.
      setActiveId(null)
      setActionType(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-4 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20 mb-4">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {questions.map((q) => {
        const author = q.user_profiles
        const authorName = author 
          ? `${author.title_prefix ? author.title_prefix + ' ' : ''}${author.first_name} ${author.last_name}`
          : 'Unknown Member'

        const isEditing = activeId === q.id

        return (
          <Card key={q.id} className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Submitted by <span className="font-medium text-foreground">{authorName}</span> • {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                </p>
                <p className="text-lg font-medium">{q.question}</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="flex gap-2 justify-end mt-2">
                <Button 
                  variant="outline" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleAction(q.id, 'reject')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  onClick={() => handleAction(q.id, 'answer')}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Answer
                </Button>
              </div>
            ) : (
              <div className="bg-muted/30 p-4 rounded-md mt-2 space-y-4 border">
                <div className="space-y-2">
                  <Label>
                    {actionType === 'answer' ? 'Provide an Expert Answer' : 'Reason for Rejection (sent to user)'}
                  </Label>
                  <Textarea 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={actionType === 'answer' ? 'Type your answer here...' : 'e.g. This question violates community guidelines because...'}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setActiveId(null)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button 
                    variant={actionType === 'reject' ? 'destructive' : 'default'}
                    onClick={handleSubmit}
                    disabled={isSubmitting || (actionType === 'answer' && textInput.length < 5)}
                  >
                    {isSubmitting ? 'Saving...' : 'Confirm'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
