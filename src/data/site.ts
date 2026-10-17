// PLACEHOLDER CONTENT — replace with the real details from the parish office.

export const site = {
  name: "St. Thomas Mar Thoma Youths Union",
  place: "Pattor",
  tagline: "A youth fellowship growing together in Christ",
  address: "St. Thomas Mar Thoma Church, Pattor, Kerala — PIN 695024", // PLACEHOLDER
  phone: "+91 8921283787", // PLACEHOLDER
  email: "youthsunion@gmail.com", // PLACEHOLDER
  instagram: "https://www.instagram.com/stmys_pattoor?obrf=MXczaGduN2tsMHI5aA==",
  whatsapp: "https://wa.me/918921283787",
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
  photo?: string;
};

// PLACEHOLDER execom — send us the real names and we'll update them.
export const execom: ExecomMember[] = [
  { name: "Rev. A T Thomas", role: "President", note: "Vicar of the parish", photo: "/execom/at-thomas.jpg" },
  { name: "Rev. Jithin Raju", role: "Assistant Vicar", photo: "/execom/jithin-raju.jpg" },
  { name: "Jis Thomas", role: "Vice President", photo: "/execom/jis.jpg" },
  { name: "Rohan George John", role: "Secretary", photo: "/execom/rohan.jpg" },
  { name: "Shifa Mariam Sojan", role: "Joint Secretary", photo: "/execom/shifa.jpg" },
  { name: "Dany John Solomon", role: "Treasurer", photo: "/execom/dany.jpg" },
  { name: "Aneeta Achu Joju", role: "Kaisthana Samithy Representative", photo: "/execom/aneeta.jpg" },
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
