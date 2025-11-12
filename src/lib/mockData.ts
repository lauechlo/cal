/**
 * Mock event data for prototyping HoagieCalendar
 * This will be replaced with real database data later
 */

export type Category = 'social' | 'academic' | 'food' | 'arts' | 'sports' | 'career' | 'housing' | 'other';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: Category;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string;
  location: string;
  senderName: string;
  senderEmail: string;
  emailContent?: string;
  interestedCount: number;
}

// Sample events for November 2025
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Free Bagels at Frist',
    description: 'Start your Saturday morning right with complimentary bagels, cream cheese, and coffee at Frist Campus Center!',
    category: 'food',
    date: '2025-11-01',
    startTime: '08:00',
    endTime: '10:00',
    location: 'Frist Campus Center',
    senderName: 'First Year Class Council',
    senderEmail: 'fycc@princeton.edu',
    emailContent: 'Hey Tigers! 🐯\n\nCome grab FREE BAGELS this Saturday morning! We\'ll have everything bagels, plain, sesame, and more, plus a variety of spreads.\n\nLocation: Frist Campus Center, Main Lounge\nTime: 8:00 AM - 10:00 AM\nSponsored by: First Year Class Council\n\nSee you there!',
    interestedCount: 47,
  },
  {
    id: '2',
    title: 'Fall Festival',
    description: 'Celebrate fall with games, food, and music! Open to all Princeton students.',
    category: 'social',
    date: '2025-11-02',
    startTime: '12:00',
    endTime: '16:00',
    location: 'Cannon Green',
    senderName: 'Student Activities',
    senderEmail: 'studentactivities@princeton.edu',
    interestedCount: 152,
  },
  {
    id: '3',
    title: 'ML Guest Lecture',
    description: 'Distinguished researcher Dr. Sarah Chen from MIT will discuss recent advances in neural architecture search and AutoML.',
    category: 'academic',
    date: '2025-11-03',
    startTime: '10:30',
    endTime: '12:00',
    location: 'CS Building, Room 105',
    senderName: 'Prof. Thomas Anderson',
    senderEmail: 'tanderson@cs.princeton.edu',
    interestedCount: 89,
  },
  {
    id: '4',
    title: 'Tower Lunch',
    description: 'Free lunch for engineering students at the Tower Room.',
    category: 'food',
    date: '2025-11-03',
    startTime: '12:00',
    endTime: '13:30',
    location: 'Tower Room',
    senderName: 'Engineering Council',
    senderEmail: 'engcouncil@princeton.edu',
    interestedCount: 34,
  },
  {
    id: '5',
    title: 'Google Tech Talk',
    description: 'Software engineers from Google will discuss their work on large-scale distributed systems and internship opportunities.',
    category: 'career',
    date: '2025-11-04',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Friend Center 101',
    senderName: 'Career Services',
    senderEmail: 'careerservices@princeton.edu',
    interestedCount: 234,
  },
  {
    id: '6',
    title: 'Election Watch Party',
    description: 'Join us to watch the election results come in. Pizza and drinks provided!',
    category: 'social',
    date: '2025-11-04',
    startTime: '19:00',
    endTime: '23:00',
    location: 'Frist Campus Center',
    senderName: 'Politics Club',
    senderEmail: 'politics@princeton.edu',
    interestedCount: 187,
  },
  {
    id: '7',
    title: 'Jazz at Richardson',
    description: 'Join us for an evening of smooth jazz featuring the Princeton University Jazz Ensemble. Free admission for students!',
    category: 'arts',
    date: '2025-11-05',
    startTime: '19:00',
    endTime: '21:00',
    location: 'Richardson Auditorium',
    senderName: 'PU Jazz Ensemble',
    senderEmail: 'pujazz@princeton.edu',
    interestedCount: 156,
  },
  {
    id: '8',
    title: 'PSY Study Session',
    description: 'Group study session for Quiz 4 covering measurement theory and validity. Bring your notes and questions!',
    category: 'academic',
    date: '2025-11-05',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Frist Campus Center, Multipurpose Room',
    senderName: 'Alex Kim (TA)',
    senderEmail: 'akim@princeton.edu',
    interestedCount: 67,
  },
  {
    id: '9',
    title: 'Food Truck Wednesday',
    description: 'Variety of food trucks on campus! This week featuring Korean BBQ, Tacos, Mediterranean, and Ice Cream.',
    category: 'food',
    date: '2025-11-05',
    startTime: '12:00',
    endTime: '14:00',
    location: 'McCosh Courtyard',
    senderName: 'Undergraduate Student Government',
    senderEmail: 'usg@princeton.edu',
    interestedCount: 312,
  },
  {
    id: '10',
    title: 'IM Basketball',
    description: 'Intramural basketball game - Team Orange vs Team Blue.',
    category: 'sports',
    date: '2025-11-06',
    startTime: '17:30',
    endTime: '19:00',
    location: 'Dillon Gym',
    senderName: 'Intramural Sports',
    senderEmail: 'imsports@princeton.edu',
    interestedCount: 45,
  },
  {
    id: '11',
    title: 'Terrace Dinner',
    description: 'Casual dinner at Terrace Club. All members welcome!',
    category: 'social',
    date: '2025-11-06',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Terrace Club',
    senderName: 'Terrace Club',
    senderEmail: 'terrace@princeton.edu',
    interestedCount: 78,
  },
  {
    id: '12',
    title: 'Sublet Fair',
    description: 'Looking for summer housing? Come to the sublet fair to connect with students offering sublets.',
    category: 'housing',
    date: '2025-11-07',
    startTime: '16:00',
    endTime: '18:00',
    location: 'Frist Gallery',
    senderName: 'Off-Campus Housing',
    senderEmail: 'housing@princeton.edu',
    interestedCount: 234,
  },
  {
    id: '13',
    title: 'Late Meal @ Rocky',
    description: 'Free late meal at Rockefeller College. Come hang out and grab some food!',
    category: 'food',
    date: '2025-11-07',
    startTime: '21:00',
    endTime: '23:00',
    location: 'Rockefeller College',
    senderName: 'Rocky College Council',
    senderEmail: 'rocky@princeton.edu',
    interestedCount: 123,
  },
  {
    id: '14',
    title: 'Symphony Concert',
    description: 'Princeton University Symphony Orchestra performs works by Brahms and Dvořák.',
    category: 'arts',
    date: '2025-11-08',
    startTime: '20:00',
    endTime: '22:00',
    location: 'Richardson Auditorium',
    senderName: 'University Orchestra',
    senderEmail: 'orchestra@princeton.edu',
    interestedCount: 201,
  },
  {
    id: '15',
    title: 'Resume Workshop',
    description: 'Get your resume reviewed by career advisors. Drop in anytime!',
    category: 'career',
    date: '2025-11-09',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Career Services',
    senderName: 'Career Services',
    senderEmail: 'careerservices@princeton.edu',
    interestedCount: 156,
  },
  {
    id: '16',
    title: 'Study Break',
    description: 'Take a break from studying! Free snacks and board games.',
    category: 'social',
    date: '2025-11-10',
    startTime: '21:00',
    endTime: '23:00',
    location: 'Butler College',
    senderName: 'Butler RCA',
    senderEmail: 'butler@princeton.edu',
    interestedCount: 89,
  },
  {
    id: '17',
    title: 'Pancake Breakfast',
    description: 'All-you-can-eat pancake breakfast with toppings galore!',
    category: 'food',
    date: '2025-11-11',
    startTime: '08:00',
    endTime: '11:00',
    location: 'Mathey College',
    senderName: 'Mathey College Council',
    senderEmail: 'mathey@princeton.edu',
    interestedCount: 167,
  },
  {
    id: '18',
    title: 'Yoga in Dillon',
    description: 'Free yoga class for all skill levels. Bring your own mat!',
    category: 'sports',
    date: '2025-11-12',
    startTime: '18:00',
    endTime: '19:00',
    location: 'Dillon Gym',
    senderName: 'Wellness Center',
    senderEmail: 'wellness@princeton.edu',
    interestedCount: 43,
  },
  {
    id: '19',
    title: 'Trivia Night',
    description: 'Test your knowledge at trivia night! Prizes for the winning team.',
    category: 'social',
    date: '2025-11-13',
    startTime: '20:00',
    endTime: '22:00',
    location: 'Tiger Inn',
    senderEmail: 'tigerinn@princeton.edu',
    senderName: 'Tiger Inn',
    interestedCount: 134,
  },
  {
    id: '20',
    title: 'Theater Preview',
    description: 'Preview performance of the fall play "Hamlet". Free for students!',
    category: 'arts',
    date: '2025-11-14',
    startTime: '19:30',
    endTime: '22:00',
    location: 'Matthews Theater',
    senderName: 'Princeton Triangle Club',
    senderEmail: 'triangle@princeton.edu',
    interestedCount: 98,
  },
];

// Helper function to get events for a specific date
export function getEventsForDate(date: string): Event[] {
  return mockEvents.filter(event => event.date === date);
}

// Helper function to get events for a month
export function getEventsForMonth(year: number, month: number): Event[] {
  const monthStr = month.toString().padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  return mockEvents.filter(event => event.date.startsWith(prefix));
}

// Helper function to get event count by category
export function getEventCountByCategory(): Record<Category, number> {
  const counts: Record<Category, number> = {
    social: 0,
    academic: 0,
    food: 0,
    arts: 0,
    sports: 0,
    career: 0,
    housing: 0,
    other: 0,
  };

  mockEvents.forEach(event => {
    counts[event.category]++;
  });

  return counts;
}
