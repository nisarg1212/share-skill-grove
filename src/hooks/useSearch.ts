
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface SearchResult {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  location: string | null;
  skills_offered: string[];
  skills_wanted: string[];
}

export const useSearch = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${debouncedQuery}%,bio.ilike.%${debouncedQuery}%,location.ilike.%${debouncedQuery}%`)
        .limit(10);

      if (error) throw error;

      // Also search by skills
      const { data: skillMatches, error: skillError } = await supabase
        .from('profiles')
        .select('*')
        .or(`skills_offered.cs.{${debouncedQuery}},skills_wanted.cs.{${debouncedQuery}}`)
        .limit(10);

      if (skillError) throw skillError;

      // Combine and deduplicate results
      const allResults = [...(data || []), ...(skillMatches || [])];
      const uniqueResults = allResults.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );

      return uniqueResults as SearchResult[];
    },
    enabled: !!debouncedQuery.trim(),
  });
};
