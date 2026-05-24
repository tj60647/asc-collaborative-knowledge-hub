import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export default function NewMemberPage() {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Manual Provisioning</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Member</CardTitle>
          <CardDescription>
            Bypass the Stripe automated workflow to manually provision a legacy or complimentary account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Stafford" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Beer" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="cyberneticist@example.com" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Organizational Role</Label>
            <Select defaultValue="member">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">General Member</SelectItem>
                <SelectItem value="moderator">Moderator (Glossary Reviewer)</SelectItem>
                <SelectItem value="manager">Manager (Chapter Lead)</SelectItem>
                <SelectItem value="admin">Administrator (Treasury/Full Access)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="billing">Billing Exemption</Label>
            <Select defaultValue="standard">
              <SelectTrigger id="billing">
                <SelectValue placeholder="Select billing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (Requires Stripe Subscription)</SelectItem>
                <SelectItem value="lifetime">Legacy Lifetime (Exempt)</SelectItem>
                <SelectItem value="complimentary">Complimentary Grant (Exempt)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Selecting an exempt status will decouple this account from automated subscription suspensions.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/members">Cancel</Link>
          </Button>
          <Button>Provision Account</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
