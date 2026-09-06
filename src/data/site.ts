// PLACEHOLDER CONTENT — replace with the real details from the parish office.

export const site = {
  name: "St. Thomas Mar Thoma Yuvajana Sakhyam",
  place: "Pattor",
  tagline: "A youth fellowship growing together in Christ",
  address: "St. Thomas Mar Thoma Church, Pattor, Kerala — PIN 000000", // PLACEHOLDER
  phone: "+91 00000 00000", // PLACEHOLDER
  email: "yuvajanasakhyam.pattor@example.com", // PLACEHOLDER
  instagram: "https://instagram.com/", // PLACEHOLDER
  whatsapp: "https://wa.me/910000000000", // PLACEHOLDER
};

export const weeklyRhythm = [
  {
    day: "Sunday",
    time: "8:30 AM",
    title: "Holy Communion Service",
    detail: "Worship together with the parish in the main sanctuary.",
  },
  {
    day: "Sunday",
    time: "11:00 AM",
    title: "Yuvajana Sakhyam Meeting",
    detail: "Bible study, discussion and planning right after the service.",
  },
  {
    day: "Wednesday",
    time: "7:00 PM",
    title: "Prayer & Song Practice",
    detail: "Choir practice and intercessory prayer at the parish hall.",
  },
];

export type CommunityEvent = {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  place: string;
  description: string;
};

// PLACEHOLDER events
export const events: CommunityEvent[] = [
  {
    id: "youth-sunday",
    title: "Youth Sunday",
    date: "2026-09-20",
    time: "8:30 AM",
    place: "St. Thomas Mar Thoma Church, Pattor",
    description:
      "The whole Sunday service led by the Yuvajana Sakhyam — readings, choir and message by our members.",
  },
  {
    id: "bible-quiz",
    title: "Parish Bible Quiz",
    date: "2026-10-04",
    time: "11:30 AM",
    place: "Parish Hall",
    description:
      "Team quiz on the Gospel of Luke, open to all members. Register at the Sunday meeting.",
  },
  {
    id: "charity-drive",
    title: "Onam Charity Drive",
    date: "2026-10-18",
    time: "9:00 AM",
    place: "Meet at the church gate",
    description:
      "Collecting and distributing provision kits to families around Pattor.",
  },
  {
    id: "carol-round",
    title: "Christmas Carol Rounds",
    date: "2026-12-14",
    time: "6:00 PM",
    place: "Across Pattor ward",
    description: "Nightly carol visits to member homes through the week.",
  },
];

// PLACEHOLDER past events
export const pastEvents: CommunityEvent[] = [
  {
    id: "camp-2026",
    title: "Annual Youth Camp",
    date: "2026-05-10",
    time: "Two days",
    place: "Retreat centre, Kumbanad",
    description: "Two days of teaching, worship and games with 60 participants.",
  },
  {
    id: "blood-donation",
    title: "Blood Donation Camp",
    date: "2026-03-22",
    time: "9:00 AM",
    place: "Parish Hall",
    description: "Joint camp with the local hospital — 42 donors from the parish.",
  },
  {
    id: "sports-day",
    title: "Sakhyam Sports Day",
    date: "2026-01-26",
    time: "8:00 AM",
    place: "Church ground",
    description: "Friendly matches and races for all age groups.",
  },
];

export type ExecomMember = {
  name: string;
  role: string;
  note?: string;
};

// PLACEHOLDER execom — send us the real names and we'll update them.
export const execom: ExecomMember[] = [
  { name: "Member Name", role: "President", note: "Vicar of the parish" },
  { name: "Member Name", role: "Vice President" },
  { name: "Member Name", role: "Secretary" },
  { name: "Member Name", role: "Joint Secretary" },
  { name: "Member Name", role: "Treasurer" },
  { name: "Member Name", role: "Choir Coordinator" },
  { name: "Member Name", role: "Outreach Coordinator" },
  { name: "Member Name", role: "Committee Member" },
];

export function formatEventDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
