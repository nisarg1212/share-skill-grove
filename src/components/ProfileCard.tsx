import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, MapPin, Star, MessageSquare, Heart, Eye } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  location: string | null;
  skills_offered: string[];
  skills_wanted: string[];
  rating?: number;
  matches?: number;
  created_at?: string;
}

interface ProfileCardProps {
  profile: UserProfile;
  onConnect: (userId: string) => void;
  onViewProfile: (userId: string) => void;
  onMessage: (userId: string) => void;
  currentUserId?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onConnect,
  onViewProfile,
  onMessage,
  currentUserId
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const calculateMatchPercentage = () => {
    if (!profile.skills_offered || !profile.skills_wanted) return 0;
    const totalSkills = profile.skills_offered.length + profile.skills_wanted.length;
    const matchingSkills = profile.matches || 0;
    return totalSkills > 0 ? Math.round((matchingSkills / totalSkills) * 100) : 0;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-16 h-16 border-2 border-gradient-to-r from-blue-400 to-green-400">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg font-semibold">
                {getInitials(profile.username || profile.email)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {profile.username}
              </h3>
              {profile.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Location */}
            {profile.location && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.location}
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {profile.bio}
              </p>
            )}

            {/* Skills Offered */}
            {profile.skills_offered && profile.skills_offered.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Offers
                </h4>
                <div className="flex flex-wrap gap-1">
                  {profile.skills_offered.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills_offered.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills_offered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Skills Wanted */}
            {profile.skills_wanted && profile.skills_wanted.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Wants to Learn
                </h4>
                <div className="flex flex-wrap gap-1">
                  {profile.skills_wanted.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills_wanted.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills_wanted.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Match Percentage */}
            {profile.matches && profile.matches > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Skill Match</span>
                  <span className="font-medium text-blue-600">
                    {calculateMatchPercentage()}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateMatchPercentage()}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={() => onViewProfile(profile.id)}
                variant="outline"
                className="flex-1 text-xs"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
              <Button 
                size="sm" 
                onClick={() => onMessage(profile.id)}
                variant="outline"
                className="flex-1 text-xs"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Button 
                size="sm" 
                onClick={() => onConnect(profile.id)}
                className="flex-1 text-xs bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                <Heart className="h-4 w-4 mr-1" />
                Connect
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
