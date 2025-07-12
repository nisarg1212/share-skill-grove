import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from './ProfileCard';
import { Users, Filter, MapPin, Star, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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

interface SuggestedMatchesProps {
  onConnect: (userId: string) => void;
}

export const SuggestedMatches: React.FC<SuggestedMatchesProps> = ({ onConnect }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterSkill, setFilterSkill] = useState<string | null>(null);
  const profilesPerPage = 6;

  // Fetch suggested matches with enhanced algorithm
  const { data: suggestedMatches, isLoading, refetch } = useQuery({
    queryKey: ['enhanced-suggested-matches', user?.id, filterLocation, filterSkill],
    queryFn: async () => {
      if (!user) return [];

      // Get current user's profile
      const { data: currentUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!currentUser) return [];

      // Build query for potential matches
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      // Apply location filter if specified
      if (filterLocation) {
        query = query.eq('location', filterLocation);
      }

      // Fetch all potential matches
      const { data: allProfiles, error } = await query;

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      if (!allProfiles) return [];

      // Enhanced matching algorithm
      const enhancedMatches = allProfiles.map(profile => {
        let score = 0;
        let matchDetails = {
          skillsOfferedMatch: 0,
          skillsWantedMatch: 0,
          mutualSkills: 0,
          locationMatch: false,
          bioSimilarity: 0
        };

        // Score based on skills the current user wants that this profile offers
        if (currentUser.skills_wanted && profile.skills_offered) {
          const wantedSkillsMatch = currentUser.skills_wanted.filter(skill => 
            profile.skills_offered.includes(skill)
          );
          matchDetails.skillsOfferedMatch = wantedSkillsMatch.length;
          score += wantedSkillsMatch.length * 3; // High weight for direct skill match
        }

        // Score based on skills the current user offers that this profile wants
        if (currentUser.skills_offered && profile.skills_wanted) {
          const offeredSkillsMatch = currentUser.skills_offered.filter(skill => 
            profile.skills_wanted.includes(skill)
          );
          matchDetails.skillsWantedMatch = offeredSkillsMatch.length;
          score += offeredSkillsMatch.length * 2; // Medium weight for complementary skills
        }

        // Score for mutual skills (both want to learn the same thing)
        if (currentUser.skills_wanted && profile.skills_wanted) {
          const mutualWantedSkills = currentUser.skills_wanted.filter(skill => 
            profile.skills_wanted.includes(skill)
          );
          matchDetails.mutualSkills = mutualWantedSkills.length;
          score += mutualWantedSkills.length * 1; // Low weight for mutual learning
        }

        // Location bonus
        if (currentUser.location && profile.location && 
            currentUser.location.toLowerCase() === profile.location.toLowerCase()) {
          matchDetails.locationMatch = true;
          score += 2;
        }

        // Bio similarity bonus (simple keyword matching)
        if (currentUser.bio && profile.bio) {
          const currentUserWords = currentUser.bio.toLowerCase().split(' ');
          const profileWords = profile.bio.toLowerCase().split(' ');
          const commonWords = currentUserWords.filter(word => 
            profileWords.includes(word) && word.length > 3
          );
          matchDetails.bioSimilarity = commonWords.length;
          score += commonWords.length * 0.5;
        }

        // Add randomness to prevent always showing the same matches
        const randomBonus = Math.random() * 0.5;
        score += randomBonus;

        return {
          ...profile,
          matchScore: score,
          matchDetails,
          rating: 4.0 + Math.random() * 1.0, // Simulated rating
          matches: matchDetails.skillsOfferedMatch + matchDetails.skillsWantedMatch + matchDetails.mutualSkills
        };
      });

      // Filter by skill if specified
      let filteredMatches = enhancedMatches;
      if (filterSkill) {
        filteredMatches = enhancedMatches.filter(profile => 
          profile.skills_offered?.some(skill => 
            skill.toLowerCase().includes(filterSkill.toLowerCase())
          ) ||
          profile.skills_wanted?.some(skill => 
            skill.toLowerCase().includes(filterSkill.toLowerCase())
          )
        );
      }

      // Sort by match score and return top matches
      return filteredMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20); // Return top 20 matches
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
        .single();

      if (existingConversation) {
        return existingConversation;
      }

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user1_id: user.id,
          user2_id: otherUserId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Connection request sent!');
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast.error('Failed to connect');
      console.error('Connection error:', error);
    },
  });

  const handleConnect = (userId: string) => {
    onConnect(userId);
  };

  const handleViewProfile = (userId: string) => {
    // Navigate to profile page or open modal
    window.open(`/profile/${userId}`, '_blank');
  };

  const handleMessage = (userId: string) => {
    createConversationMutation.mutate(userId);
  };

  const handleShuffle = () => {
    refetch();
    setCurrentPage(0);
  };

  // Get unique locations for filter
  const availableLocations = React.useMemo(() => {
    if (!suggestedMatches) return [];
    const locations = suggestedMatches
      .map(profile => profile.location)
      .filter((location, index, self) => location && self.indexOf(location) === index);
    return locations;
  }, [suggestedMatches]);

  // Get unique skills for filter
  const availableSkills = React.useMemo(() => {
    if (!suggestedMatches) return [];
    const skills = suggestedMatches
      .flatMap(profile => [...(profile.skills_offered || []), ...(profile.skills_wanted || [])])
      .filter((skill, index, self) => skill && self.indexOf(skill) === index);
    return skills.slice(0, 20); // Show top 20 skills
  }, [suggestedMatches]);

  // Paginate matches
  const paginatedMatches = React.useMemo(() => {
    if (!suggestedMatches) return [];
    const start = currentPage * profilesPerPage;
    const end = start + profilesPerPage;
    return suggestedMatches.slice(start, end);
  }, [suggestedMatches, currentPage]);

  const totalPages = Math.ceil((suggestedMatches?.length || 0) / profilesPerPage);

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Suggested Matches
            {suggestedMatches && (
              <Badge variant="secondary" className="ml-2">
                {suggestedMatches.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShuffle}
              className="flex items-center"
            >
              <Shuffle className="h-4 w-4 mr-1" />
              Shuffle
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>
          
          {/* Location Filter */}
          {availableLocations.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {availableLocations.slice(0, 5).map(location => (
                <Badge
                  key={location}
                  variant={filterLocation === location ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setFilterLocation(filterLocation === location ? null : location)}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Clear Filters */}
          {(filterLocation || filterSkill) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterLocation(null);
                setFilterSkill(null);
              }}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="h-64 bg-gray-200" />
              </div>
            ))}
          </div>
        ) : paginatedMatches.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedMatches.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onConnect={handleConnect}
                  onViewProfile={handleViewProfile}
                  onMessage={handleMessage}
                  currentUserId={user?.id}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(index)}
                      className="w-8 h-8 p-0"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No matches found</h3>
            <p className="text-sm mb-4">
              {filterLocation || filterSkill
                ? 'Try adjusting your filters or add more skills to your profile.'
                : 'Add skills to your profile to find skill-sharing connections!'}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilterLocation(null);
                setFilterSkill(null);
                refetch();
              }}
            >
              Refresh Matches
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
