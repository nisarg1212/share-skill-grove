
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, MapPin, Star, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: 'john_doe',
    email: 'john@example.com',
    bio: 'Passionate about technology and learning new skills. Love to share knowledge with others!',
    location: 'San Francisco, CA',
    skillsOffered: ['Web Development', 'Photography', 'JavaScript'],
    skillsWanted: ['Cooking', 'Guitar', 'Spanish']
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleProfileUpdate = () => {
    // Simulate profile update
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setProfile(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setProfile(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(skill => skill !== skillToRemove)
    }));
  };

  const removeSkillWanted = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your profile and skills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">JD</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{profile.username}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                  
                  <div className="flex items-center justify-center mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8 (23 reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-sm text-gray-600">{profile.bio}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleProfileUpdate} className="bg-gradient-to-r from-blue-600 to-green-600">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {/* Skills Offered */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Skills I Offer
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new skill"
                        value={newSkillOffered}
                        onChange={(e) => setNewSkillOffered(e.target.value)}
                        className="w-40"
                      />
                      <Button size="sm" onClick={addSkillOffered}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 relative">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillOffered(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Wanted */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Skills I Want to Learn
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new skill"
                        value={newSkillWanted}
                        onChange={(e) => setNewSkillWanted(e.target.value)}
                        className="w-40"
                      />
                      <Button size="sm" onClick={addSkillWanted}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 relative">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillWanted(skill)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
