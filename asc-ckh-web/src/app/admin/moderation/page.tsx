import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockQueue = [
  {
    id: "PUB-1029",
    type: "Publication",
    title: "Cybernetics and the Origins of Information",
    author: "Alice Scholar",
    status: "Pending_Review",
    date: "2026-05-24",
  },
  {
    id: "REP-4011",
    type: "Report",
    title: "Inappropriate Comment on Graph Node",
    author: "System Auto-Flag",
    status: "Action_Required",
    date: "2026-05-23",
  }
]

export default function ModerationQueuePage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Moderation Queue</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Review member-submitted publications and investigate community safety reports.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Needs Attention</CardTitle>
          <CardDescription>
            You have {mockQueue.length} items requiring review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="w-[400px]">Item</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockQueue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Badge variant={item.type === 'Report' ? 'destructive' : 'secondary'}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">{item.title}</div>
                    <div className="text-xs text-zinc-500">{item.id}</div>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400">
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
