import { resetPassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  return (
    <div className="flex-1 flex w-full h-full items-center justify-center px-4 mt-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-geist-sans">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we'll send a recovery link
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={resetPassword} className="grid gap-4">
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>

            <Button type="submit" className="w-full mt-2">
              Send Reset Link
            </Button>
            
            {params?.message && (
              <p className="mt-2 p-3 bg-secondary text-secondary-foreground text-center text-sm rounded-md border border-border">
                {params.message}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
