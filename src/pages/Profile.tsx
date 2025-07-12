
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, MapPin, Star, Plus, X, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Profile {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  location: string | null;
  skills_offered: string[];
  skills_wanted: string[];
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    skills_offered: [] as string[],
    skills_wanted: [] as string[]
  });

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<Profile>) => {
      if (!user) throw new Error('No user');
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        location: profile.location || '',
        skills_offered: profile.skills_offered || [],
        skills_wanted: profile.skills_wanted || []
      });
    }
  }, [profile]);

  const handleProfileUpdate = () => {
    updateProfileMutation.mutate({
      username: formData.username,
      bio: formData.bio,
      location: formData.location,
      skills_offered: formData.skills_offered,
      skills_wanted: formData.skills_wanted
    });
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setFormData(prev => ({
        ...prev,
        skills_offered: [...prev.skills_offered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setFormData(prev => ({
        ...prev,
        skills_wanted: [...prev.skills_wanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills_offered: prev.skills_offered.filter(skill => skill !== skillToRemove)
    }));
  };

  const removeSkillWanted = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills_wanted: prev.skills_wanted.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600">There was an error loading your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your profile and skills</p>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">
                      {profile.username.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{profile.username}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                  
                  {profile.location && (
                    <div className="flex items-center justify-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">New User</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-sm text-gray-600">{profile.bio || 'No bio yet'}</p>
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
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={handleProfileUpdate} 
                    className="bg-gradient-to-r from-blue-600 to-green-600"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
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
                  {formData.skills_offered.map((skill, index) => (
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
                  {formData.skills_offered.length === 0 && (
                    <p className="text-gray-500 text-sm">No skills offered yet</p>
                  )}
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
                  {formData.skills_wanted.map((skill, index) => (
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
                  {formData.skills_wanted.length === 0 && (
                    <p className="text-gray-500 text-sm">No skills wanted yet</p>
                  )}
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
