export interface Fixture {
  id: string;
  group?: string;
  stage: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  country: string;
  result?: string;
}

// Flag emoji helper
const flags: Record<string, string> = {
  USA: "🇺🇸", Mexico: "🇲🇽", Canada: "🇨🇦", Argentina: "🇦🇷",
  Brazil: "🇧🇷", France: "🇫🇷", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Spain: "🇪🇸",
  Germany: "🇩🇪", Portugal: "🇵🇹", Netherlands: "🇳🇱", Belgium: "🇧🇪",
  Italy: "🇮🇹", Japan: "🇯🇵", "South Korea": "🇰🇷", Australia: "🇦🇺",
  Morocco: "🇲🇦", Senegal: "🇸🇳", Nigeria: "🇳🇬", Cameroon: "🇨🇲",
  "Ivory Coast": "🇨🇮", Egypt: "🇪🇬", Ghana: "🇬🇭", Tunisia: "🇹🇳",
  "Saudi Arabia": "🇸🇦", Iran: "🇮🇷", Qatar: "🇶🇦",
  Poland: "🇵🇱", Croatia: "🇭🇷", Serbia: "🇷🇸", Switzerland: "🇨🇭",
  Denmark: "🇩🇰", Uruguay: "🇺🇾", Ecuador: "🇪🇨", Chile: "🇨🇱",
  Colombia: "🇨🇴", Venezuela: "🇻🇪", Peru: "🇵🇪", Bolivia: "🇧🇴",
  Paraguay: "🇵🇾", Panama: "🇵🇦", Honduras: "🇭🇳", "Costa Rica": "🇨🇷",
  Jamaica: "🇯🇲", "New Zealand": "🇳🇿", Indonesia: "🇮🇩", Iraq: "🇮🇶",
  Jordan: "🇯🇴", Uzbekistan: "🇺🇿", Ukraine: "🇺🇦", Slovakia: "🇸🇰",
};

function f(team: string) {
  return flags[team] || "🏳️";
}

export const FIXTURES: Fixture[] = [
  // ─── GROUP A ───
  { id: "A1", group: "A", stage: "Group Stage", homeTeam: "USA", homeFlag: f("USA"), awayTeam: "Bolivia", awayFlag: f("Bolivia"), date: "2026-06-11", time: "17:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "A2", group: "A", stage: "Group Stage", homeTeam: "Panama", homeFlag: f("Panama"), awayTeam: "Uruguay", awayFlag: f("Uruguay"), date: "2026-06-12", time: "20:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "A3", group: "A", stage: "Group Stage", homeTeam: "USA", homeFlag: f("USA"), awayTeam: "Panama", awayFlag: f("Panama"), date: "2026-06-16", time: "17:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "A4", group: "A", stage: "Group Stage", homeTeam: "Bolivia", homeFlag: f("Bolivia"), awayTeam: "Uruguay", awayFlag: f("Uruguay"), date: "2026-06-16", time: "20:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "A5", group: "A", stage: "Group Stage", homeTeam: "USA", homeFlag: f("USA"), awayTeam: "Uruguay", awayFlag: f("Uruguay"), date: "2026-06-21", time: "20:00", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },
  { id: "A6", group: "A", stage: "Group Stage", homeTeam: "Panama", homeFlag: f("Panama"), awayTeam: "Bolivia", awayFlag: f("Bolivia"), date: "2026-06-21", time: "20:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA" },

  // ─── GROUP B ───
  { id: "B1", group: "B", stage: "Group Stage", homeTeam: "Argentina", homeFlag: f("Argentina"), awayTeam: "Ecuador", awayFlag: f("Ecuador"), date: "2026-06-12", time: "14:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "B2", group: "B", stage: "Group Stage", homeTeam: "Chile", homeFlag: f("Chile"), awayTeam: "Cameroon", awayFlag: f("Cameroon"), date: "2026-06-12", time: "17:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "B3", group: "B", stage: "Group Stage", homeTeam: "Argentina", homeFlag: f("Argentina"), awayTeam: "Chile", awayFlag: f("Chile"), date: "2026-06-17", time: "17:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "B4", group: "B", stage: "Group Stage", homeTeam: "Ecuador", homeFlag: f("Ecuador"), awayTeam: "Cameroon", awayFlag: f("Cameroon"), date: "2026-06-17", time: "20:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "B5", group: "B", stage: "Group Stage", homeTeam: "Argentina", homeFlag: f("Argentina"), awayTeam: "Cameroon", awayFlag: f("Cameroon"), date: "2026-06-22", time: "20:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "B6", group: "B", stage: "Group Stage", homeTeam: "Chile", homeFlag: f("Chile"), awayTeam: "Ecuador", awayFlag: f("Ecuador"), date: "2026-06-22", time: "20:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA" },

  // ─── GROUP C ───
  { id: "C1", group: "C", stage: "Group Stage", homeTeam: "Mexico", homeFlag: f("Mexico"), awayTeam: "Venezuela", awayFlag: f("Venezuela"), date: "2026-06-13", time: "14:00", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: "C2", group: "C", stage: "Group Stage", homeTeam: "Poland", homeFlag: f("Poland"), awayTeam: "Saudi Arabia", awayFlag: f("Saudi Arabia"), date: "2026-06-13", time: "17:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "C3", group: "C", stage: "Group Stage", homeTeam: "Mexico", homeFlag: f("Mexico"), awayTeam: "Poland", awayFlag: f("Poland"), date: "2026-06-18", time: "17:00", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: "C4", group: "C", stage: "Group Stage", homeTeam: "Venezuela", homeFlag: f("Venezuela"), awayTeam: "Saudi Arabia", awayFlag: f("Saudi Arabia"), date: "2026-06-18", time: "20:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "C5", group: "C", stage: "Group Stage", homeTeam: "Mexico", homeFlag: f("Mexico"), awayTeam: "Saudi Arabia", awayFlag: f("Saudi Arabia"), date: "2026-06-23", time: "20:00", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: "C6", group: "C", stage: "Group Stage", homeTeam: "Poland", homeFlag: f("Poland"), awayTeam: "Venezuela", awayFlag: f("Venezuela"), date: "2026-06-23", time: "20:00", venue: "MetLife Stadium", city: "New York", country: "USA" },

  // ─── GROUP D ───
  { id: "D1", group: "D", stage: "Group Stage", homeTeam: "Canada", homeFlag: f("Canada"), awayTeam: "Morocco", awayFlag: f("Morocco"), date: "2026-06-13", time: "20:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "D2", group: "D", stage: "Group Stage", homeTeam: "Belgium", homeFlag: f("Belgium"), awayTeam: "Ukraine", awayFlag: f("Ukraine"), date: "2026-06-14", time: "14:00", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: "D3", group: "D", stage: "Group Stage", homeTeam: "Canada", homeFlag: f("Canada"), awayTeam: "Belgium", awayFlag: f("Belgium"), date: "2026-06-18", time: "14:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "D4", group: "D", stage: "Group Stage", homeTeam: "Morocco", homeFlag: f("Morocco"), awayTeam: "Ukraine", awayFlag: f("Ukraine"), date: "2026-06-19", time: "14:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "D5", group: "D", stage: "Group Stage", homeTeam: "Canada", homeFlag: f("Canada"), awayTeam: "Ukraine", awayFlag: f("Ukraine"), date: "2026-06-23", time: "14:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "D6", group: "D", stage: "Group Stage", homeTeam: "Belgium", homeFlag: f("Belgium"), awayTeam: "Morocco", awayFlag: f("Morocco"), date: "2026-06-23", time: "14:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },

  // ─── GROUP E ───
  { id: "E1", group: "E", stage: "Group Stage", homeTeam: "Spain", homeFlag: f("Spain"), awayTeam: "Denmark", awayFlag: f("Denmark"), date: "2026-06-14", time: "17:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "E2", group: "E", stage: "Group Stage", homeTeam: "Jamaica", homeFlag: f("Jamaica"), awayTeam: "Japan", awayFlag: f("Japan"), date: "2026-06-14", time: "20:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "E3", group: "E", stage: "Group Stage", homeTeam: "Spain", homeFlag: f("Spain"), awayTeam: "Jamaica", awayFlag: f("Jamaica"), date: "2026-06-19", time: "17:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "E4", group: "E", stage: "Group Stage", homeTeam: "Denmark", homeFlag: f("Denmark"), awayTeam: "Japan", awayFlag: f("Japan"), date: "2026-06-19", time: "20:00", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: "E5", group: "E", stage: "Group Stage", homeTeam: "Spain", homeFlag: f("Spain"), awayTeam: "Japan", awayFlag: f("Japan"), date: "2026-06-24", time: "20:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "E6", group: "E", stage: "Group Stage", homeTeam: "Jamaica", homeFlag: f("Jamaica"), awayTeam: "Denmark", awayFlag: f("Denmark"), date: "2026-06-24", time: "20:00", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },

  // ─── GROUP F ───
  { id: "F1", group: "F", stage: "Group Stage", homeTeam: "Brazil", homeFlag: f("Brazil"), awayTeam: "Costa Rica", awayFlag: f("Costa Rica"), date: "2026-06-15", time: "14:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "F2", group: "F", stage: "Group Stage", homeTeam: "Serbia", homeFlag: f("Serbia"), awayTeam: "Australia", awayFlag: f("Australia"), date: "2026-06-15", time: "17:00", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: "F3", group: "F", stage: "Group Stage", homeTeam: "Brazil", homeFlag: f("Brazil"), awayTeam: "Serbia", awayFlag: f("Serbia"), date: "2026-06-20", time: "17:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "F4", group: "F", stage: "Group Stage", homeTeam: "Costa Rica", homeFlag: f("Costa Rica"), awayTeam: "Australia", awayFlag: f("Australia"), date: "2026-06-20", time: "20:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "F5", group: "F", stage: "Group Stage", homeTeam: "Brazil", homeFlag: f("Brazil"), awayTeam: "Australia", awayFlag: f("Australia"), date: "2026-06-25", time: "20:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "F6", group: "F", stage: "Group Stage", homeTeam: "Serbia", homeFlag: f("Serbia"), awayTeam: "Costa Rica", awayFlag: f("Costa Rica"), date: "2026-06-25", time: "20:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA" },

  // ─── GROUP G ───
  { id: "G1", group: "G", stage: "Group Stage", homeTeam: "England", homeFlag: f("England"), awayTeam: "Senegal", awayFlag: f("Senegal"), date: "2026-06-15", time: "20:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "G2", group: "G", stage: "Group Stage", homeTeam: "Netherlands", homeFlag: f("Netherlands"), awayTeam: "Indonesia", awayFlag: f("Indonesia"), date: "2026-06-16", time: "14:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "G3", group: "G", stage: "Group Stage", homeTeam: "England", homeFlag: f("England"), awayTeam: "Netherlands", awayFlag: f("Netherlands"), date: "2026-06-20", time: "14:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "G4", group: "G", stage: "Group Stage", homeTeam: "Senegal", homeFlag: f("Senegal"), awayTeam: "Indonesia", awayFlag: f("Indonesia"), date: "2026-06-20", time: "17:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "G5", group: "G", stage: "Group Stage", homeTeam: "England", homeFlag: f("England"), awayTeam: "Indonesia", awayFlag: f("Indonesia"), date: "2026-06-25", time: "14:00", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: "G6", group: "G", stage: "Group Stage", homeTeam: "Netherlands", homeFlag: f("Netherlands"), awayTeam: "Senegal", awayFlag: f("Senegal"), date: "2026-06-25", time: "14:00", venue: "MetLife Stadium", city: "New York", country: "USA" },

  // ─── GROUP H ───
  { id: "H1", group: "H", stage: "Group Stage", homeTeam: "France", homeFlag: f("France"), awayTeam: "Nigeria", awayFlag: f("Nigeria"), date: "2026-06-16", time: "17:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "H2", group: "H", stage: "Group Stage", homeTeam: "Switzerland", homeFlag: f("Switzerland"), awayTeam: "Paraguay", awayFlag: f("Paraguay"), date: "2026-06-17", time: "14:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "H3", group: "H", stage: "Group Stage", homeTeam: "France", homeFlag: f("France"), awayTeam: "Switzerland", awayFlag: f("Switzerland"), date: "2026-06-21", time: "14:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "H4", group: "H", stage: "Group Stage", homeTeam: "Nigeria", homeFlag: f("Nigeria"), awayTeam: "Paraguay", awayFlag: f("Paraguay"), date: "2026-06-21", time: "17:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "H5", group: "H", stage: "Group Stage", homeTeam: "France", homeFlag: f("France"), awayTeam: "Paraguay", awayFlag: f("Paraguay"), date: "2026-06-26", time: "20:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "H6", group: "H", stage: "Group Stage", homeTeam: "Switzerland", homeFlag: f("Switzerland"), awayTeam: "Nigeria", awayFlag: f("Nigeria"), date: "2026-06-26", time: "20:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA" },

  // ─── GROUP I ───
  { id: "I1", group: "I", stage: "Group Stage", homeTeam: "Portugal", homeFlag: f("Portugal"), awayTeam: "Colombia", awayFlag: f("Colombia"), date: "2026-06-17", time: "17:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "I2", group: "I", stage: "Group Stage", homeTeam: "Croatia", homeFlag: f("Croatia"), awayTeam: "Ghana", awayFlag: f("Ghana"), date: "2026-06-17", time: "20:00", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },
  { id: "I3", group: "I", stage: "Group Stage", homeTeam: "Portugal", homeFlag: f("Portugal"), awayTeam: "Croatia", awayFlag: f("Croatia"), date: "2026-06-22", time: "14:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "I4", group: "I", stage: "Group Stage", homeTeam: "Colombia", homeFlag: f("Colombia"), awayTeam: "Ghana", awayFlag: f("Ghana"), date: "2026-06-22", time: "17:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "I5", group: "I", stage: "Group Stage", homeTeam: "Portugal", homeFlag: f("Portugal"), awayTeam: "Ghana", awayFlag: f("Ghana"), date: "2026-06-26", time: "14:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "I6", group: "I", stage: "Group Stage", homeTeam: "Croatia", homeFlag: f("Croatia"), awayTeam: "Colombia", awayFlag: f("Colombia"), date: "2026-06-26", time: "14:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },

  // ─── GROUP J ───
  { id: "J1", group: "J", stage: "Group Stage", homeTeam: "Germany", homeFlag: f("Germany"), awayTeam: "Honduras", awayFlag: f("Honduras"), date: "2026-06-18", time: "20:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "J2", group: "J", stage: "Group Stage", homeTeam: "South Korea", homeFlag: f("South Korea"), awayTeam: "Iraq", awayFlag: f("Iraq"), date: "2026-06-19", time: "20:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA" },
  { id: "J3", group: "J", stage: "Group Stage", homeTeam: "Germany", homeFlag: f("Germany"), awayTeam: "South Korea", awayFlag: f("South Korea"), date: "2026-06-23", time: "17:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "J4", group: "J", stage: "Group Stage", homeTeam: "Honduras", homeFlag: f("Honduras"), awayTeam: "Iraq", awayFlag: f("Iraq"), date: "2026-06-23", time: "20:00", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: "J5", group: "J", stage: "Group Stage", homeTeam: "Germany", homeFlag: f("Germany"), awayTeam: "Iraq", awayFlag: f("Iraq"), date: "2026-06-27", time: "20:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "J6", group: "J", stage: "Group Stage", homeTeam: "South Korea", homeFlag: f("South Korea"), awayTeam: "Honduras", awayFlag: f("Honduras"), date: "2026-06-27", time: "20:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },

  // ─── GROUP K ───
  { id: "K1", group: "K", stage: "Group Stage", homeTeam: "Italy", homeFlag: f("Italy"), awayTeam: "Slovakia", awayFlag: f("Slovakia"), date: "2026-06-19", time: "14:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "K2", group: "K", stage: "Group Stage", homeTeam: "Iran", homeFlag: f("Iran"), awayTeam: "New Zealand", awayFlag: f("New Zealand"), date: "2026-06-19", time: "17:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "K3", group: "K", stage: "Group Stage", homeTeam: "Italy", homeFlag: f("Italy"), awayTeam: "Iran", awayFlag: f("Iran"), date: "2026-06-24", time: "14:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "K4", group: "K", stage: "Group Stage", homeTeam: "Slovakia", homeFlag: f("Slovakia"), awayTeam: "New Zealand", awayFlag: f("New Zealand"), date: "2026-06-24", time: "17:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA" },
  { id: "K5", group: "K", stage: "Group Stage", homeTeam: "Italy", homeFlag: f("Italy"), awayTeam: "New Zealand", awayFlag: f("New Zealand"), date: "2026-06-28", time: "20:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "K6", group: "K", stage: "Group Stage", homeTeam: "Iran", homeFlag: f("Iran"), awayTeam: "Slovakia", awayFlag: f("Slovakia"), date: "2026-06-28", time: "20:00", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },

  // ─── GROUP L ───
  { id: "L1", group: "L", stage: "Group Stage", homeTeam: "Morocco", homeFlag: f("Morocco"), awayTeam: "Egypt", awayFlag: f("Egypt"), date: "2026-06-20", time: "20:00", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: "L2", group: "L", stage: "Group Stage", homeTeam: "Ivory Coast", homeFlag: f("Ivory Coast"), awayTeam: "Uzbekistan", awayFlag: f("Uzbekistan"), date: "2026-06-21", time: "20:00", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: "L3", group: "L", stage: "Group Stage", homeTeam: "Morocco", homeFlag: f("Morocco"), awayTeam: "Ivory Coast", awayFlag: f("Ivory Coast"), date: "2026-06-25", time: "17:00", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: "L4", group: "L", stage: "Group Stage", homeTeam: "Egypt", homeFlag: f("Egypt"), awayTeam: "Uzbekistan", awayFlag: f("Uzbekistan"), date: "2026-06-25", time: "20:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "L5", group: "L", stage: "Group Stage", homeTeam: "Morocco", homeFlag: f("Morocco"), awayTeam: "Uzbekistan", awayFlag: f("Uzbekistan"), date: "2026-06-29", time: "20:00", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: "L6", group: "L", stage: "Group Stage", homeTeam: "Ivory Coast", homeFlag: f("Ivory Coast"), awayTeam: "Egypt", awayFlag: f("Egypt"), date: "2026-06-29", time: "20:00", venue: "MetLife Stadium", city: "New York", country: "USA" },

  // ─── ROUND OF 32 (16 matches) ───
  { id: "R32-1", stage: "Round of 32", homeTeam: "1A", homeFlag: "🏆", awayTeam: "3D/E/F", awayFlag: "🏆", date: "2026-07-01", time: "14:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "R32-2", stage: "Round of 32", homeTeam: "1B", homeFlag: "🏆", awayTeam: "3A/C/D", awayFlag: "🏆", date: "2026-07-01", time: "18:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "R32-3", stage: "Round of 32", homeTeam: "1C", homeFlag: "🏆", awayTeam: "3G/H/I", awayFlag: "🏆", date: "2026-07-02", time: "14:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "R32-4", stage: "Round of 32", homeTeam: "1D", homeFlag: "🏆", awayTeam: "3J/K/L", awayFlag: "🏆", date: "2026-07-02", time: "18:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "R32-5", stage: "Round of 32", homeTeam: "1E", homeFlag: "🏆", awayTeam: "2H", awayFlag: "🏆", date: "2026-07-03", time: "14:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "R32-6", stage: "Round of 32", homeTeam: "1F", homeFlag: "🏆", awayTeam: "2G", awayFlag: "🏆", date: "2026-07-03", time: "18:00", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: "R32-7", stage: "Round of 32", homeTeam: "1G", homeFlag: "🏆", awayTeam: "2F", awayFlag: "🏆", date: "2026-07-04", time: "14:00", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },
  { id: "R32-8", stage: "Round of 32", homeTeam: "1H", homeFlag: "🏆", awayTeam: "2E", awayFlag: "🏆", date: "2026-07-04", time: "18:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "R32-9", stage: "Round of 32", homeTeam: "1I", homeFlag: "🏆", awayTeam: "2L", awayFlag: "🏆", date: "2026-07-05", time: "14:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA" },
  { id: "R32-10", stage: "Round of 32", homeTeam: "1J", homeFlag: "🏆", awayTeam: "2K", awayFlag: "🏆", date: "2026-07-05", time: "18:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "R32-11", stage: "Round of 32", homeTeam: "1K", homeFlag: "🏆", awayTeam: "2J", awayFlag: "🏆", date: "2026-07-06", time: "14:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "R32-12", stage: "Round of 32", homeTeam: "1L", homeFlag: "🏆", awayTeam: "2I", awayFlag: "🏆", date: "2026-07-06", time: "18:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "R32-13", stage: "Round of 32", homeTeam: "2A", homeFlag: "🏆", awayTeam: "2C", awayFlag: "🏆", date: "2026-07-07", time: "14:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "R32-14", stage: "Round of 32", homeTeam: "2B", homeFlag: "🏆", awayTeam: "2D", awayFlag: "🏆", date: "2026-07-07", time: "18:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "R32-15", stage: "Round of 32", homeTeam: "3A/B/C", homeFlag: "🏆", awayTeam: "3I/J/K", awayFlag: "🏆", date: "2026-07-08", time: "14:00", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },
  { id: "R32-16", stage: "Round of 32", homeTeam: "3B/C/D", homeFlag: "🏆", awayTeam: "3E/F/G", awayFlag: "🏆", date: "2026-07-08", time: "18:00", venue: "BC Place", city: "Vancouver", country: "Canada" },

  // ─── ROUND OF 16 (8 matches) ───
  { id: "R16-1", stage: "Round of 16", homeTeam: "Winner R32-1", homeFlag: "🏆", awayTeam: "Winner R32-2", awayFlag: "🏆", date: "2026-07-10", time: "18:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "R16-2", stage: "Round of 16", homeTeam: "Winner R32-3", homeFlag: "🏆", awayTeam: "Winner R32-4", awayFlag: "🏆", date: "2026-07-10", time: "22:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "R16-3", stage: "Round of 16", homeTeam: "Winner R32-5", homeFlag: "🏆", awayTeam: "Winner R32-6", awayFlag: "🏆", date: "2026-07-11", time: "18:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "R16-4", stage: "Round of 16", homeTeam: "Winner R32-7", homeFlag: "🏆", awayTeam: "Winner R32-8", awayFlag: "🏆", date: "2026-07-11", time: "22:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: "R16-5", stage: "Round of 16", homeTeam: "Winner R32-9", homeFlag: "🏆", awayTeam: "Winner R32-10", awayFlag: "🏆", date: "2026-07-12", time: "18:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },
  { id: "R16-6", stage: "Round of 16", homeTeam: "Winner R32-11", homeFlag: "🏆", awayTeam: "Winner R32-12", awayFlag: "🏆", date: "2026-07-12", time: "22:00", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: "R16-7", stage: "Round of 16", homeTeam: "Winner R32-13", homeFlag: "🏆", awayTeam: "Winner R32-14", awayFlag: "🏆", date: "2026-07-13", time: "18:00", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: "R16-8", stage: "Round of 16", homeTeam: "Winner R32-15", homeFlag: "🏆", awayTeam: "Winner R32-16", awayFlag: "🏆", date: "2026-07-13", time: "22:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA" },

  // ─── QUARTER-FINALS (4 matches) ───
  { id: "QF-1", stage: "Quarter-final", homeTeam: "Winner R16-1", homeFlag: "🏆", awayTeam: "Winner R16-2", awayFlag: "🏆", date: "2026-07-16", time: "18:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
  { id: "QF-2", stage: "Quarter-final", homeTeam: "Winner R16-3", homeFlag: "🏆", awayTeam: "Winner R16-4", awayFlag: "🏆", date: "2026-07-17", time: "18:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "QF-3", stage: "Quarter-final", homeTeam: "Winner R16-5", homeFlag: "🏆", awayTeam: "Winner R16-6", awayFlag: "🏆", date: "2026-07-18", time: "18:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: "QF-4", stage: "Quarter-final", homeTeam: "Winner R16-7", homeFlag: "🏆", awayTeam: "Winner R16-8", awayFlag: "🏆", date: "2026-07-19", time: "18:00", venue: "Rose Bowl", city: "Pasadena", country: "USA" },

  // ─── SEMI-FINALS (2 matches) ───
  { id: "SF-1", stage: "Semi-final", homeTeam: "Winner QF-1", homeFlag: "🏆", awayTeam: "Winner QF-2", awayFlag: "🏆", date: "2026-07-22", time: "20:00", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: "SF-2", stage: "Semi-final", homeTeam: "Winner QF-3", homeFlag: "🏆", awayTeam: "Winner QF-4", awayFlag: "🏆", date: "2026-07-23", time: "20:00", venue: "MetLife Stadium", city: "New York", country: "USA" },

  // ─── THIRD PLACE ───
  { id: "3RD", stage: "Third Place", homeTeam: "Loser SF-1", homeFlag: "🏆", awayTeam: "Loser SF-2", awayFlag: "🏆", date: "2026-07-25", time: "18:00", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },

  // ─── FINAL ───
  { id: "FINAL", stage: "Final", homeTeam: "Winner SF-1", homeFlag: "🏆", awayTeam: "Winner SF-2", awayFlag: "🏆", date: "2026-07-19", time: "19:00", venue: "MetLife Stadium", city: "New York", country: "USA" },
];

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
export const STAGES = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarter-final",
  "Semi-final",
  "Third Place",
  "Final",
];
