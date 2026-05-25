"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, ShieldAlert, Tag as TagIcon, Save, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Mock profile state
  const [profile, setProfile] = useState({
    firstName: "Aris",
    lastName: "Scholar",
    bio: "Associate Professor of Systems Science in Vienna.",
    discoverabilityOptIn: true,
  })

  // Mock declared interests (tags)
  const [declaredTags, setDeclaredTags] = useState(["Cybernetics", "Systems Theory", "Enactivism"])
  const [newTag, setNewTag] = useState("")

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleToggleDiscoverability = (checked: boolean) => {
    setProfile(prev => ({ ...prev, discoverabilityOptIn: checked }))
  }

  const addTag = () => {
    if (newTag.trim() && !declaredTags.includes(newTag.trim())) {
      setDeclaredTags(prev => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setDeclaredTags(prev => prev.filter(t => t !== tagToRemove))
  }

  const handleSave = () => {
    setIsSaving(true)
    setIsSaved(false)
    // Simulate API call to update public.profiles and insert into public.relationships (provenance = 'declared')
    setTimeout(() => {
      setIsSaving(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Scholar Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your public identity and discoverability settings.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Personal Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleProfileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleProfileChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <textarea 
              id="bio" 
              name="bio"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={profile.bio}
              onChange={handleProfileChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-primary" />
              <CardTitle>Declared Interests (Similarity Matching)</CardTitle>
            </div>
          </div>
          <CardDescription>
            These tags are used to match you with peers. Modifying these tags updates the <code>relationships</code> graph with a <code>declared</code> provenance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {declaredTags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-primary/70 hover:text-primary">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="e.g., Constructivism" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              className="max-w-sm"
            />
            <Button variant="outline" onClick={addTag}>Add Tag</Button>
          </div>
        </CardContent>
      </Card>

      <Card className={profile.discoverabilityOptIn ? "border-primary/20" : "border-amber-200 bg-amber-50/30"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className={profile.discoverabilityOptIn ? "h-5 w-5 text-primary" : "h-5 w-5 text-amber-500"} />
              <CardTitle>Discoverability & Privacy</CardTitle>
            </div>
            <Switch 
              checked={profile.discoverabilityOptIn} 
              onCheckedChange={handleToggleDiscoverability}
              aria-label="Toggle discoverability"
            />
          </div>
          <CardDescription>
            {profile.discoverabilityOptIn 
              ? "Your profile is PUBLIC. You will appear in the Member Directory and can be matched with collaborators."
              : "Your profile is PRIVATE. You are hidden from the directory and matching engine. You can still access the hub."}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-end items-center gap-4 pt-4">
        {isSaved && <span className="text-sm font-medium text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Profile Updated</span>}
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? "Saving..." : "Save Profile Settings"}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>

    </div>
  )
}
