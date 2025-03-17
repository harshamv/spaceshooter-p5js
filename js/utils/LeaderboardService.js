// Leaderboard service using Supabase

class LeaderboardService {
  constructor() {
    this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  
  // Submit a score to the leaderboard
  async submitScore(name, email, score, playTime) {
    try {
      // Validate inputs
      if (!name || !email || score === undefined || playTime === undefined) {
        throw new Error('Missing required fields');
      }
      
      // Ensure score and time are numbers
      const numericScore = Number(score);
      const numericPlayTime = Number(playTime);
      
      if (isNaN(numericScore) || isNaN(numericPlayTime)) {
        throw new Error('Score and play time must be numbers');
      }
      
      const { data, error } = await this.supabase
        .from('leaderboard')
        .insert([
          { 
            player_name: name, 
            email: email, 
            score: numericScore, 
            time_survived: numericPlayTime, // Match the column name in the database
            created_at: new Date().toISOString()
          }
        ]);
        
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting score:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get leaderboard data with optional time filter
  async getLeaderboard(timeFilter = 'all') {
    try {
      let query = this.supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);
      
      // Apply time filter if needed
      const now = new Date();
      
      if (timeFilter === 'daily') {
        // Get scores from the last 24 hours
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        query = query.gte('created_at', yesterday.toISOString());
      } else if (timeFilter === 'weekly') {
        // Get scores from the last 7 days
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        query = query.gte('created_at', lastWeek.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get a player's rank
  async getPlayerRank(email) {
    try {
      // First get the player's highest score
      const { data: playerData, error: playerError } = await this.supabase
        .from('leaderboard')
        .select('score')
        .eq('email', email)
        .order('score', { ascending: false })
        .limit(1);
        
      if (playerError) throw playerError;
      if (!playerData || playerData.length === 0) {
        return { success: false, error: 'Player not found' };
      }
      
      const playerScore = playerData[0].score;
      
      // Then count how many players have a higher score
      const { count, error: countError } = await this.supabase
        .from('leaderboard')
        .select('id', { count: 'exact', head: true })
        .gt('score', playerScore);
        
      if (countError) throw countError;
      
      // Rank is count + 1 (1-indexed)
      return { success: true, rank: count + 1 };
    } catch (error) {
      console.error('Error getting player rank:', error);
      return { success: false, error: error.message };
    }
  }
}
