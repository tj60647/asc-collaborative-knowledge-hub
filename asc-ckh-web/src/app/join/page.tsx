"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, CreditCard, User, Info, ArrowRight } from "lucide-react"

export default function JoinPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    tier: "regular",
    acceptedTerms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleNext = () => setStep(2)
  const handleBack = () => setStep(1)

  const handleCheckout = async () => {
    if (!formData.acceptedTerms) {
      setError("You must accept the community guidelines to proceed.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session')

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Join the Society</h1>
          <p className="text-muted-foreground mt-2">Become a member of the American Society for Cybernetics.</p>
        </div>

        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              {step === 1 ? <User className="h-5 w-5 text-primary" /> : <CreditCard className="h-5 w-5 text-primary" />}
              <CardTitle>{step === 1 ? "1. Your Profile" : "2. Membership Tier & Payment"}</CardTitle>
            </div>
            <CardDescription>
              {step === 1 
                ? "Enter your details to create your Hub profile." 
                : "Select your membership level. Payments are processed securely via Stripe."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Brief Bio (Optional)</Label>
                  <textarea 
                    id="bio" 
                    name="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Affiliations, interests, etc."
                    value={formData.bio}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" /> Note: Discoverability is opted-out by default for privacy.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid gap-4">
                  <label className={`cursor-pointer rounded-lg border-2 p-4 flex justify-between items-center transition-colors ${formData.tier === 'regular' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="tier" value="regular" checked={formData.tier === 'regular'} onChange={handleChange} className="h-4 w-4 text-primary" />
                      <div>
                        <h4 className="font-medium">Regular Membership</h4>
                        <p className="text-sm text-muted-foreground">Full access to the Hub and Taylor & Francis journal discounts.</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">$100<span className="text-sm font-normal text-muted-foreground">/yr</span></div>
                  </label>

                  <label className={`cursor-pointer rounded-lg border-2 p-4 flex justify-between items-center transition-colors ${formData.tier === 'student' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="tier" value="student" checked={formData.tier === 'student'} onChange={handleChange} className="h-4 w-4 text-primary" />
                      <div>
                        <h4 className="font-medium">Student / Affiliate</h4>
                        <p className="text-sm text-muted-foreground">Discounted access for students and affiliates.</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">$40<span className="text-sm font-normal text-muted-foreground">/yr</span></div>
                  </label>

                  <label className={`cursor-pointer rounded-lg border-2 p-4 flex justify-between items-center transition-colors ${formData.tier === 'lifetime' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="tier" value="lifetime" checked={formData.tier === 'lifetime'} onChange={handleChange} className="h-4 w-4 text-primary" />
                      <div>
                        <h4 className="font-medium">Lifetime Fellowship</h4>
                        <p className="text-sm text-muted-foreground">Permanent membership without annual renewal.</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">$750<span className="text-sm font-normal text-muted-foreground"> one-time</span></div>
                  </label>
                </div>

                <div className="flex items-start space-x-2 bg-muted/30 p-4 rounded-lg">
                  <input type="checkbox" id="acceptedTerms" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="acceptedTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Accept Community Guidelines
                    </label>
                    <p className="text-sm text-muted-foreground">
                      I agree to the ASC code of conduct and understand my data is protected under GDPR/CCPA.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
            {step === 1 ? (
              <>
                <Button variant="ghost" disabled>Cancel</Button>
                <Button onClick={handleNext} disabled={!formData.firstName || !formData.lastName || !formData.email}>
                  Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={handleBack} disabled={isLoading}>Back</Button>
                <Button onClick={handleCheckout} disabled={isLoading || !formData.acceptedTerms} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? "Preparing Checkout..." : "Proceed to Checkout"}
                  {!isLoading && <CreditCard className="ml-2 h-4 w-4" />}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
