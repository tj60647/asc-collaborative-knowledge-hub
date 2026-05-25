import { updatePassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  return (
    <div className="flex-1 flex w-full h-full items-center justify-center px-4 mt-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-geist-sans">Update Password</CardTitle>
          <CardDescription>
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={updatePassword} className="grid gap-4">
            
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <PasswordInput id="password" name="password" required minLength={8} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <PasswordInput id="confirm_password" name="confirm_password" required minLength={8} />
            </div>

            <Button type="submit" className="w-full mt-2">
              Save New Password
            </Button>
            
            {params?.message && (
              <p className="mt-2 p-3 bg-destructive/10 text-destructive text-center text-sm rounded-md border border-destructive/20">
                {params.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
