export type TeamMember = {
  name: string;
  position: string;
  bio: string;
  image: string;
};

export type Milestone = {
  year: string;
  title: string;
  description: string;
};

export type CoreValue = {
  icon: string;
  title: string;
  description: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: 'John Williams',
    position: 'Founder & CEO',
    bio: 'John founded ProTech HVAC in 2005 with over 15 years of industry experience. His commitment to quality service has helped the company grow throughout Northeast Ohio.',
    image: '/team-ceo-placeholder.jpg',
  },
  {
    name: 'Maria Rodriguez',
    position: 'Service Manager',
    bio: 'Maria oversees all service operations, ensuring every customer receives the highest level of professional care and attention to detail.',
    image: '/team-manager-placeholder.jpg',
  },
  {
    name: 'David Chen',
    position: 'Lead Technician',
    bio: 'With NATE certification and 10+ years of experience, David leads our team of skilled technicians and provides ongoing technical training.',
    image: '/team-tech-placeholder.jpg',
  },
];

export const milestones: Milestone[] = [
  {
    year: '2005',
    title: 'Company Founded',
    description: 'ProTech HVAC was established with a small team of 3 technicians serving Akron, OH.'
  },
  {
    year: '2010',
    title: 'Expanded Service Area',
    description: 'Added Cleveland and Canton to our service areas, increasing our customer base by 200%.'
  },
  {
    year: '2015',
    title: 'Commercial Division Launch',
    description: 'Launched our commercial HVAC division to serve businesses throughout Northeast Ohio.'
  },
  {
    year: '2020',
    title: 'Smart Home Integration',
    description: 'Introduced smart home integration services and advanced energy-efficient solutions.'
  },
  {
    year: '2025',
    title: 'Today',
    description: 'Now with 25+ certified technicians, we proudly serve thousands of customers across Northeast Ohio.'
  },
];

export const coreValues: CoreValue[] = [
  { icon: '🤝', title: 'Integrity', description: 'We do what we say, when we say we will do it' },
  { icon: '⭐', title: 'Excellence', description: 'We maintain the highest standards in every job' },
  { icon: '💯', title: 'Reliability', description: 'Consistent quality service you can count on' },
  { icon: '🔄', title: 'Innovation', description: 'Embracing new technologies and methods' }
];
