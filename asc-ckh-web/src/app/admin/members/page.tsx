import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"

const mockMembers = [
  { id: "1", name: "Alice Cyberneticist", email: "alice@example.com", role: "admin", joinDate: "2023-01-15", discoverable: true, stripeStatus: "Active" },
  { id: "2", name: "Bob System", email: "bob@example.com", role: "member", joinDate: "2023-06-22", discoverable: false, stripeStatus: "Lapsed" },
  { id: "3", name: "Charlie Feedback", email: "charlie@example.com", role: "moderator", joinDate: "2024-02-10", discoverable: true, stripeStatus: "Active" }
];

export default function MembersReportPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Membership Roster</h2>
        <Link href="/admin/members/new" className={buttonVariants()}>
          Add Member
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
          <CardDescription>
            Manage the organization's members, roles, and view subscription statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Directory Status</TableHead>
                <TableHead className="text-right">Dues Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>
                    {member.discoverable ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Opted-In</span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Private</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {member.stripeStatus === 'Active' ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Active</span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Lapsed</span>
                    )}
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
