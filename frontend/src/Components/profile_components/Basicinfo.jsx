import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BasicInfo({ profile, handleChange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            value={profile.firstName}
            onChange={e => handleChange(e, "firstName")}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={profile.lastName}
            onChange={e => handleChange(e, "lastName")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email*</Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          onChange={e => handleChange(e, "email")}
          required
        />
      </div>

      <div>
        <Label htmlFor="username">Username*</Label>
        <Input
          id="username"
          value={profile.username}
          onChange={e => handleChange(e, "username")}
          required
        />
      </div>

      {/* <div>
        <Label htmlFor="password">Password*</Label>
        <Input
          id="password"
          type="password"
          value={profile.password}
          onChange={e => handleChange(e, "password")}
          required
        />
      </div> */}

      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={profile.phoneNumber}
          onChange={e => handleChange(e, "phoneNumber")}
        />
      </div>
      <div className="grid gap-2">
        <Label>Social Links</Label>
        <Input
          placeholder="LinkedIn"
          value={profile.socialLinks.linkedIn}
          onChange={e => handleChange(e, "socialLinks", undefined, "linkedIn")}
        />
        <Input
          placeholder="GitHub"
          value={profile.socialLinks.gitHub}
          onChange={e => handleChange(e, "socialLinks", undefined, "gitHub")}
        />
      </div>
    </div>
  )
}
