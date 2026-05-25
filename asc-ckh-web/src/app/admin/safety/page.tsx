"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShieldAlert, CheckCircle2, Ban, EyeOff } from "lucide-react"

// Mock data representing public.moderation_reports joined with resources
const mockReports = [
  { id: "1", resourceTitle: "Obscure Cybernetics Theory", reason: "Plagiarism from published paper without citation", reporter: "Alice M.", status: "pending", reportedAt: "2024-03-20" },
  { id: "2", resourceTitle: "Event: Unofficial Meetup", reason: "Spam / Unrelated promotional content", reporter: "System", status: "pending", reportedAt: "2024-03-21" },
]

export default function TrustAndSafetyPage() {
  const [queue, setQueue] = useState(mockReports)

  const handleAction = (id: string, action: 'dismiss' | 'unpublish' | 'ban') => {
    // Simulate updating public.moderation_reports status -> 'resolved' or 'dismissed'
    // And if 'unpublish', update public.resources status -> 'draft'
    setQueue(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Trust & Safety Queue</h2>
      </div>
      
      <div className="rounded-md bg-amber-50 p-4 border border-amber-200 mb-2">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Operational Policy</h3>
            <div className="mt-1 text-sm text-amber-700">
              <p>Reported resources <strong>remain live</strong> until a moderator explicitly takes action to unpublish them. Review reports carefully before issuing strikes.</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Moderation Flags</CardTitle>
          <CardDescription>
            Review community safety reports and take administrative action to protect the hub's integrity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border rounded-md bg-muted/20 flex flex-col items-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
              All reports have been resolved. The queue is empty.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target Resource</TableHead>
                  <TableHead>Report Reason</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.resourceTitle}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={item.reason}>{item.reason}</TableCell>
                    <TableCell>{item.reporter}</TableCell>
                    <TableCell>{item.reportedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAction(item.id, 'dismiss')}
                          title="Dismiss Report (Keep Live)"
                        >
                          Dismiss
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => handleAction(item.id, 'unpublish')}
                          title="Unpublish Resource"
                        >
                          <EyeOff className="h-4 w-4 mr-1" /> Unpublish
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleAction(item.id, 'ban')}
                          title="Unpublish & Ban Author"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
