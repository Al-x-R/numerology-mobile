import { Interpretation } from '@/lib/types/calculation';

type CellKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

// Cell titles (without the number in parentheses)
export const cellTitles: Record<CellKey, string> = {
  '1': 'Character',
  '2': 'Energy',
  '3': 'Interest',
  '4': 'Health',
  '5': 'Logic',
  '6': 'Labor',
  '7': 'Luck',
  '8': 'Duty',
  '9': 'Memory',
};

// All interpretations – from “—” up to six digits
export const interpretations: Record<CellKey, Record<string, string>> = {
  '1': {
    '—': 'No 1s. Soft, compliant character. The person finds it hard to make decisions and often seeks support from others. May be a follower.',
    '1': 'Self-centered but weak-willed character. Focused on themselves, yet lacks the inner strength to achieve big goals alone.',
    '11': 'Golden mean. Soft yet not spineless. Good at compromise, diplomatic, praises others while not forgetting themselves.',
    '111': 'Strong, determined character. Has a “core”. Can lead, make decisions, and is hard to persuade in arguments. Balanced.',
    '1111': 'Very strong, “golden” character. Determined, goal-oriented, but can be overly harsh and blunt.',
    '11111': 'Dictator. Extremely rigid, domineering character. Tolerates no objections and strives for absolute power. Impossible to convince.',
    '111111': 'Overload. Despotic, often difficult to live with. The person struggles with themselves; outbursts or withdrawal are possible.',
  },
  '2': {
    '—': 'No energy. An “energy vampire” (usually unconsciously). Tires quickly, needs recharge from others, loves crowds. Requires active rest.',
    '2': 'Low energy. A modest donor. Prone to laziness, weather-sensitive. Needs sport and fresh air to replenish.',
    '22': 'Normal energy level. Can share energy, a good donor. Active, cheerful. Enough for family and work.',
    '222': 'Sign of a psychic. Very strong energy. Can heal with hands or words. Must release excess (sport, hobbies) to avoid conflicts.',
    '2222': 'Super-strong energy. A donor for everyone. People are drawn to recharge. Must learn to replenish own resources.',
    '22222': 'Energy overflow. Hyperactive, restless. Risk of burnout. Direct energy into creation.',
    '222222': 'Energy overload. May become uncontrollable, aggressive. Needs strict self-discipline and meditation.',
  },
  '3': {
    '—': 'No 3s. A “techie”. Struggles with humanities. Very tidy, perfectionist, picky about details.',
    '3': 'Interest in sciences comes in waves. One day a humanist, the next a techie – depends on mood.',
    '33': 'Clear aptitude for exact sciences (physics, math). A true techie to the core. Logical.',
    '333': 'Very strong scientific interest. Potential great scientist. If unrealized, turns into criticism and stinginess.',
    '3333': 'Genius in science. May discover something new, but risks detachment from reality.',
    '33333': 'Super-genius. Sees the world as a system. May be misunderstood by contemporaries.',
    '333333': 'Overload. May live in a world of ideas, detached from life. Risk of mental disorders.',
  },
  '4': {
    '—': 'Very weak natural health. Sickly since childhood. Must constantly strengthen the body – hardening, sport.',
    '4': 'Health exists but not heroic. Take care, especially after 40-50. Serious illnesses unlikely, chronic ones possible.',
    '44': 'Naturally strong, “heroic” health. High pain threshold, endurance. Suitable for professional sports.',
    '444': 'Super-strong health. Very robust immunity. Almost never sick. Huge physical reserve.',
    '4444': 'Invincible health. Can withstand any stress. Top-level regeneration.',
    '44444': 'Superhuman stamina. Can survive extreme conditions. Risk of ignoring fatigue.',
    '444444': 'Overload. Body may rebel from excess strength. Risk of injury due to carelessness.',
  },
  '5': {
    '—': 'No logic or intuition. Builds castles in the air, lives in illusions. Hard to plan. Decisions are emotional, often wrong.',
    '5': 'Logic present. Can analyze, but intuition weak. Relies on facts more than on “sixth sense”.',
    '55': 'Very strong intuition. “Sixth sense” works perfectly. Sees prophetic dreams, predicts events. Just knows.',
    '555': 'Clairvoyant. Intuition borders on super-ability. Always knows what to say or do. Cannot be deceived.',
    '5555': 'Overload. Intuition is so strong it interferes with life. Feels too much, suffers, often withdrawn.',
    '55555': 'Absolute clairvoyance. Can see past and future. Risk of losing touch with reality.',
    '555555': 'Overload. May be “outside this world”. Risk of mental disorders or deep mysticism.',
  },
  '6': {
    '—': 'Not grounded. Dislikes physical labor, prefers mental work. Needs a hands-on hobby to ground.',
    '6': 'Golden hands, but works only when in the mood. Resists if forced.',
    '66': 'Master with golden hands. Loves physical work, does everything at home. Best rest is garage or garden.',
    '666': 'Sign of the beast or temperament. Very attractive to the opposite sex, but highly conflict-prone. Must channel energy into labor.',
    '6666': 'Workhorse. Ready to work 24/7, often at the expense of self and family. Sees only work.',
    '66666': 'Extreme workaholic. Works to exhaustion. Risk of burnout and health issues.',
    '666666': 'Overload. May become a slave to labor. Risk of losing family, health, meaning of life.',
  },
  '7': {
    '—': 'No luck. Must achieve everything by own effort and intellect. No freebies. Develop talent.',
    '7': 'Little luck. Wins small things. Success requires great effort.',
    '77': 'Lucky one. Angelic luck sign. Often gets lucky, escapes trouble. Should take risks.',
    '777': 'Very strong luck. Can control luck, but it’s a responsibility – misuse may turn it away.',
    '7777': 'Absolute luck. Golden child of fate. Everything works out effortlessly. Risk of arrogance.',
    '77777': 'Cosmic luck. Can change destinies. Risk of pride and detachment.',
    '777777': 'Overload. Luck may burn out. Risk of tragedy to balance karma.',
  },
  '8': {
    '—': 'No sense of duty. Everyone owes me. Lives for self, ignores others. Needs to learn responsibility.',
    '8': 'Developed sense of duty. Responsible, honest, decent. May neglect own interests while helping others.',
    '88': 'Very strong sense of duty. Hyper-responsible. Sacrifices everything for family/friends.',
    '888': 'Truth-teller sign. Absolute duty and justice. Serves people and truth. Suitable for politics, judiciary.',
    '8888': 'Saintly duty. Lives for others. May become a spiritual leader. Risk of depletion.',
    '88888': 'Absolute self-sacrifice. May give life for an idea. Risk of fanaticism.',
    '888888': 'Overload. May burn out for others. Risk of losing self.',
  },
  '9': {
    '—': 'Very weak memory. Goldfish. Holds grudges long. Needs to learn forgiveness.',
    '9': 'Good but selective memory. Remembers what interests them. Can forgive grudges if desired.',
    '99': 'Photographic memory. Intelligent, quick learner. Never forgives offenses.',
    '999': 'Very strong memory and foresight. Prophet. Sees patterns others miss. Words tend to come true – be careful.',
    '9999': 'Absolute memory. Remembers everything. Potential genius scientist or mystic.',
    '99999': 'Cosmic memory. May recall past lives. Risk of deep esoteric immersion.',
    '999999': 'Overload. May be stuck in the past. Risk of depression and loneliness.',
  },
};

// Helper – same signature as the Russian version
export function getInterpretation(
  cellId: string,
  cellValue: string
): Interpretation {
  const id = cellId as CellKey;
  const value = (cellValue === '—' || cellValue === '') ? '—' : cellValue;
  const title = cellTitles[id] || 'Description';
  const cellInterpretations = interpretations[id];

  if (!cellInterpretations) {
    return { title, description: 'Description not found.', type: 'matrix' };
  }

  let description = cellInterpretations[value];

  if (!description && value !== '—') {
    let maxKey = '';
    for (const key in cellInterpretations) {
      if (key !== '—' && key.length > maxKey.length) {
        maxKey = key;
      }
    }

    description = cellInterpretations[maxKey];
  }

  if (!description) {
    description = 'Detailed description for this value is not yet available.';
  }

  return { title, description, type: 'matrix' };
}
