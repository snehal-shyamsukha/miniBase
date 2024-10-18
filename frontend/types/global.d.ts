type Game = {
  id: string;
  name: string;
  description: string;
  type: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  website: string;
};

interface Tournament {
  tournament_id: number;
  owner_wallet: string;
  name: string;
  description: string;
  deadline: string;
  total_pool?: number;
  settled?: boolean;
  winner_wallet?: string;
  created_at?: string;
  updated_at?: string;
  maxPlayer?: number;
  reward: string;
}

interface Participant {
  participant_id: number;
  user_wallet: string;
  total_bet_amount: number;
}
