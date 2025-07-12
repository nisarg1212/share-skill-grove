
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Star } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

interface SearchResultsProps {
  query: string;
  onConnect: (userId: string) => void;
}

export const SearchResults = ({ query, onConnect }: SearchResultsProps) => {
  const { data: results, isLoading, error } = useSearch(query);

  if (!query.trim()) return null;

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-center">Searching...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error searching profiles</div>
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">No results found for "{query}"</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Search Results ({results.length})</h3>
        <div className="space-y-4">
          {results.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{profile.username}</h4>
                  {profile.bio && (
                    <p className="text-sm text-gray-600 truncate max-w-xs">{profile.bio}</p>
                  )}
                  {profile.location && (
                    <div className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.skills_offered?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {profile.skills_offered?.length > 3 && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                        +{profile.skills_offered.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => onConnect(profile.id)}>
                Connect
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
