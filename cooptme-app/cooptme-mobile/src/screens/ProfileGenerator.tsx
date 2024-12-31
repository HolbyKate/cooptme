import _ from 'lodash';

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  function: string;
  meetingPlace: string;
  photo: string;
  category: string;
  gender: 'male' | 'female';
  photoId: number;
};

export type CategoryTitle = 'IT' | 'Marketing' | 'RH' | 'Finance' | 'Communication' | 
                          'Students' | 'Project Manager' | 'Product Owner' | 
                          'Customer Care Manager' | 'Other';

type JobTitlesType = {
  [K in CategoryTitle]: string[];
};

export const categories: Array<{ id: string; title: CategoryTitle; count: number }> = [
  { id: "1", title: "IT", count: 145 },
  { id: "2", title: "Marketing", count: 89 },
  { id: "3", title: "RH", count: 67 },
  { id: "4", title: "Finance", count: 54 },
  { id: "5", title: "Communication", count: 78 },
  { id: "6", title: "Students", count: 234 },
  { id: "7", title: "Project Manager", count: 45 },
  { id: "8", title: "Product Owner", count: 32 },
  { id: "9", title: "Customer Care Manager", count: 28 },
  { id: "10", title: "Other", count: 28 }
];

const jobTitles: JobTitlesType = {
  "IT": [
    "Développeur Full Stack", "Frontend Developer", "Backend Developer",
    "DevOps Engineer", "Software Architect", "Data Engineer", "Mobile Developer",
    "CTO", "Lead Developer", "System Administrator", "Security Engineer",
    "Cloud Architect", "Database Administrator", "QA Engineer"
  ],
  "Marketing": [
    "Marketing Manager", "Digital Marketing Specialist", "Growth Hacker",
    "SEO Specialist", "Content Manager", "Brand Manager", "Marketing Director",
    "Social Media Manager", "Marketing Analyst", "Email Marketing Specialist",
    "Performance Marketing Manager", "Marketing Coordinator"
  ],
  "RH": [
    "HR Manager", "Talent Acquisition Specialist", "HR Business Partner",
    "Recruitment Coordinator", "HR Development Manager", "HR Director",
    "Training Manager", "Compensation & Benefits Specialist",
    "Employee Relations Manager", "HR Analytics Specialist"
  ],
  "Finance": [
    "Financial Analyst", "Account Manager", "Financial Controller",
    "Risk Analyst", "Investment Manager", "CFO", "Financial Director",
    "Treasury Manager", "Audit Manager", "Credit Analyst",
    "Financial Planning Manager"
  ],
  "Communication": [
    "Communication Manager", "PR Specialist", "Community Manager",
    "Media Relations Manager", "Internal Communications Manager",
    "Communications Director", "Content Strategist", "Press Relations Manager",
    "Corporate Communications Manager", "Digital Communications Specialist"
  ],
  "Students": [
    "Étudiant en Informatique", "Étudiant en Marketing", "Étudiant en Finance",
    "Étudiant en Communication", "Étudiant en Management",
    "Étudiant en Data Science", "Étudiant en Design",
    "Étudiant en Commerce International", "Étudiant en RH",
    "Étudiant en Développement Web"
  ],
  "Project Manager": [
    "Project Manager", "Scrum Master", "Agile Coach",
    "Program Manager", "Project Coordinator", "Technical Project Manager",
    "Digital Project Manager", "IT Project Manager", "Senior Project Manager",
    "Project Management Officer"
  ],
  "Product Owner": [
    "Product Owner", "Product Manager", "Product Strategist",
    "Product Development Manager", "Senior Product Owner",
    "Technical Product Owner", "Digital Product Owner",
    "Product Marketing Manager"
  ],
  "Customer Care Manager": [
    "Customer Care Manager", "Customer Success Manager",
    "Customer Experience Manager", "Support Team Lead",
    "Customer Service Director", "Client Relations Manager",
    "Customer Operations Manager", "Customer Support Manager"
  ],
  "Other": [
    "Consultant", "Freelance", "Entrepreneur",
    "Business Developer", "Innovation Manager", "Strategy Consultant",
    "Business Analyst", "Operations Manager", "Quality Manager",
    "Research & Development Manager"
  ]
};

const meetingPlaces = [
  "LinkedIn", "Meetup Tech", "Conférence Web", "Holberton School",
  "42 School", "Wild Code School", "OpenClassrooms", "Hackathon Paris",
  "Tech Conference", "Startup Weekend", "Networking Event", "Job Fair",
  "Professional Workshop", "Digital Campus", "Innovation Hub",
  "Web Summit", "VivaTech", "Le Wagon", "Station F", "La French Tech",
  "Paris Tech", "Digital First", "Tech for Good", "AI Conference",
  "DevFest", "Paris Web", "Big Data Paris", "React Europe"
];

const prenoms = [
  'Thomas', 'Marie', 'Sophie', 'Lucas', 'Emma', 'Jules', 'Léa', 'Hugo',
  'Antoine', 'Sarah', 'Nicolas', 'Julie', 'Alexandre', 'Laura', 'Maxime',
  'Paul', 'Lucie', 'Pierre', 'Alice', 'David', 'Émilie', 'Guillaume',
  'Camille', 'Victor', 'Charlotte', 'Louis', 'Mathilde', 'Arthur',
  'Chloé', 'Gabriel', 'Eva', 'Raphaël', 'Louise', 'Adam', 'Juliette'
];

const noms = [
  'Martin', 'Bernard', 'Dubois', 'Robert', 'Richard', 'Petit', 'Durand',
  'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux',
  'Girard', 'Andre', 'Lefevre', 'Mercier', 'Dupont', 'Lambert',
  'Bonnet', 'Francois', 'Martinez', 'Legrand', 'Garnier', 'Faure',
  'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Morel'
];

const femaleNames: string[] = [
  'Marie', 'Sophie', 'Emma', 'Léa', 'Sarah', 'Julie', 'Laura',
  'Lucie', 'Alice', 'Émilie', 'Camille', 'Charlotte', 'Mathilde',
  'Chloé', 'Eva', 'Louise', 'Juliette'
];

export const generateContact = (): Contact => {
  const totalWeight = categories.reduce((sum, cat) => sum + cat.count, 0);
  const randomWeight = Math.random() * totalWeight;
  let weightSum = 0;
  let selectedCategory = categories[0];

  for (const category of categories) {
    weightSum += category.count;
    if (randomWeight <= weightSum) {
      selectedCategory = category;
      break;
    }
  }

  const firstName = _.sample(prenoms);
  const lastName = _.sample(noms);
  const titles = jobTitles[selectedCategory.title];
  const randomTitle = _.sample(titles) || "Other";

  if (!firstName) {
    throw new Error('firstName cannot be undefined');
  }

  const gender: 'male' | 'female' = femaleNames.includes(firstName) ? 'female' : 'male';
  const photoId = Math.floor(Math.random() * 100);

  return {
    id: Math.random().toString(36).substr(2, 9),
    firstName,
    lastName: lastName || '',
    function: randomTitle,
    meetingPlace: _.sample(meetingPlaces) || '',
    photo: `https://randomuser.me/api/portraits/${gender}/${photoId}.jpg`,
    category: selectedCategory.title,
    gender,
    photoId
  };
};

export const generateContacts = (number: number): Contact[] => {
  return Array(number).fill(null).map(() => generateContact());
};