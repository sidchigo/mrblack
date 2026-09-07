import { Pack } from '@/types/game';

export const BUILT_IN_PACKS: Pack[] = [
  {
    id: 'desi-food',
    name: 'Food',
    description: 'Crispy samosas, chai tapri, spicy chaat and midnight hunger busters',
    category: 'Food',
    isBuiltIn: true,
    pairs: [
      { a: 'Samosa', b: 'Kachori' },
      { a: 'Pani Puri', b: 'Sev Puri' },
      { a: 'Masala Dosa', b: 'Uttapam' },
      { a: 'Gulab Jamun', b: 'Rasgulla' },
      { a: 'Vada Pav', b: 'Pav Bhaji' },
      { a: 'Adrak Wali Chai', b: 'Filter Coffee' },
      { a: 'Biryani', b: 'Pulao' },
      { a: 'Jalebi', b: 'Imarti' },
      { a: 'Chole Bhature', b: 'Poori Bhaji' },
      { a: 'Lassi', b: 'Chaas' },
      { a: 'Momos', b: 'Spring Rolls' },
      { a: 'Maggi', b: 'Top Ramen' },
    ],
  },
  {
    id: 'bollywood',
    name: 'Bollywood',
    description: 'Iconic movies, masala characters, drama queens and Bollywood blockbusters',
    category: 'Entertainment',
    isBuiltIn: true,
    pairs: [
      { a: 'Shah Rukh Khan', b: 'Salman Khan' },
      { a: 'Dilwale Dulhania Le Jayenge', b: 'Kuch Kuch Hota Hai' },
      { a: 'Amitabh Bachchan', b: 'Dharmendra' },
      { a: 'Sholay', b: 'Deewaar' },
      { a: '3 Idiots', b: 'Taare Zameen Par' },
      { a: 'Gabbar Singh', b: 'Mogambo' },
      { a: 'Deepika Padukone', b: 'Alia Bhatt' },
      { a: 'Kabir Singh', b: 'Animal' },
      { a: 'Bahubali', b: 'RRR' },
      { a: 'Munna Bhai M.B.B.S.', b: 'Lage Raho Munna Bhai' },
      { a: 'Karan Johar', b: 'Sanjay Leela Bhansali' },
      { a: 'Hera Pheri', b: 'Welcome' },
    ],
  },
  {
    id: 'cricket',
    name: 'Cricket',
    description: 'IPL rivalry, legendary knocks, umpire dramas and gully cricket memories',
    category: 'Sports',
    isBuiltIn: true,
    pairs: [
      { a: 'Virat Kohli', b: 'Rohit Sharma' },
      { a: 'MS Dhoni', b: 'Sachin Tendulkar' },
      { a: 'Chennai Super Kings', b: 'Mumbai Indians' },
      { a: 'Wankhede Stadium', b: 'Eden Gardens' },
      { a: 'Boundary 4', b: 'Sixer 6' },
      { a: 'LBW', b: 'Run Out' },
      { a: 'Fast Bowler', b: 'Spin Bowler' },
      { a: 'Jasprit Bumrah', b: 'Mohammed Shami' },
      { a: 'Hardik Pandya', b: 'Ravindra Jadeja' },
      { a: 'Gully Cricket', b: 'IPL Match' },
      { a: 'Yorker', b: 'Bouncer' },
      { a: 'World Cup Final', b: 'Super Over' },
    ],
  },
  {
    id: 'shaadi',
    name: 'Shaadi',
    description: 'Baraat dance, nagin beats, Diwali sweets, and relatives gossip',
    category: 'Culture',
    isBuiltIn: true,
    pairs: [
      { a: 'Sangeet Night', b: 'Mehendi Ceremony' },
      { a: 'Baraat Dance', b: 'Reception Party' },
      { a: 'Diwali', b: 'Holi' },
      { a: 'Sherwani', b: 'Kurta Pajama' },
      { a: 'Lehenga', b: 'Saree' },
      { a: 'Raksha Bandhan', b: 'Bhai Dooj' },
      { a: 'Kaju Katli', b: 'Soan Papdi' },
      { a: 'Nagin Dance', b: 'Bhangra' },
      { a: 'Ghar Ke Rishtedaar', b: 'Mohalle Ki Aunty' },
      { a: 'Haldi Ceremony', b: 'Roka Ceremony' },
    ],
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Standups, client escalations, Bangalore traffic, CTC and appraisal drama',
    category: 'Tech',
    isBuiltIn: true,
    pairs: [
      { a: 'Work From Home', b: 'Work From Office' },
      { a: 'Daily Standup', b: 'Sprint Retrospective' },
      { a: 'Bangalore Techie', b: 'Gurgaon Corporate' },
      { a: 'Salary Hike', b: 'Diwali Bonus' },
      { a: 'Slack Ping', b: 'Teams Call' },
      { a: 'Frontend Developer', b: 'Backend Developer' },
      { a: 'Notice Period', b: 'Probation Period' },
      { a: 'Client Escalation', b: 'Production Bug' },
      { a: 'Coffee Break', b: 'Chai Sutte Ki Tapri' },
      { a: 'Swiggy Delivery', b: 'Zomato Gold' },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Goa plans that get cancelled, hill stations, monuments and local trains',
    category: 'Travel',
    isBuiltIn: true,
    pairs: [
      { a: 'Goa Beach Trip', b: 'Manali Road Trip' },
      { a: 'Mumbai Local Train', b: 'Delhi Metro' },
      { a: 'Taj Mahal (Agra)', b: 'Qutub Minar (Delhi)' },
      { a: 'Jaipur Pink City', b: 'Udaipur City of Lakes' },
      { a: 'Varanasi Ghats', b: 'Rishikesh Rafting' },
      { a: 'Ladakh Bike Trip', b: 'Spiti Valley Expedition' },
      { a: 'Auto Rickshaw Meter', b: 'Ola/Uber Surge' },
      { a: 'IRCTC Tatkal Ticket', b: 'General Dabba Seat' },
    ],
  },
];

export function getRandomPairFromPacks(packs: Pack[]): { pair: { a: string; b: string }; pack: Pack } {
  if (!packs || packs.length === 0) {
    packs = [BUILT_IN_PACKS[0]];
  }
  const chosenPack = packs[Math.floor(Math.random() * packs.length)];
  const index = Math.floor(Math.random() * chosenPack.pairs.length);
  const pair = chosenPack.pairs[index];

  // Randomly swap a and b so civilians and undercovers aren't predictable
  const finalPair =
    Math.random() > 0.5
      ? { a: pair.a, b: pair.b }
      : { a: pair.b, b: pair.a };

  return { pair: finalPair, pack: chosenPack };
}

export function getRandomPairFromPack(pack: Pack): { a: string; b: string } {
  return getRandomPairFromPacks([pack]).pair;
}
