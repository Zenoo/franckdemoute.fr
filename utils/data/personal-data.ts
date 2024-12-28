const birthDate = new Date('1995-03-13');
const today = new Date();

let age = today.getFullYear() - birthDate.getFullYear();

const monthDifference = today.getMonth() - birthDate.getMonth();
if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
  age--;
}

export const personalData = {
  name: "Franck Demoute",
  profile: '/profile.jpg',
  designation: "Full-Stack Developer",
  description: `My name is Franck Demoute, developer by day, climber by night.
  I'm a ${age} year old Full-Stack Developer.
  I started coding at the age of 12, teaching myself with a book on XHTML.
  Looking back, it was very archaic, but it introduced me to the world of development.
  I very quickly moved on to HTML/CSS, which allowed me to create anything I could imagine.
  But that wasn't enough, I always wanted to learn more, so I moved towards Javascript and found what I was looking for.
  I haven't stopped coding since that day.`,
  more: `Throughout my education, I continued to develop small Javascript projects wherever I could.
  Is something bothering me on a particular site?
  No problem, a userscript allows me to adapt this site to my preferences.
  Little by little, the projects began to grow, and my first Javascript libraries were created.
  When I started looking for a place to publish them, I stumbled into the world of Open Source with Github & Stackoverflow.
  Since then, I try to participate in the Open Source community whenever I can, by answering questions on Stackoverflow and maintaining my projects on Github.
  Helping people solve their coding problems and teaching others coding concepts is something that has always made me happy.`,
  github: 'https://github.com/Zenoo',
  linkedIn: 'https://www.linkedin.com/in/franck-demoute/',
  stackOverflow: 'https://stackoverflow.com/users/3660134/zenoo',
  instagram: 'https://www.instagram.com/climbingfranck/',
  devUsername: "Zen",
  resume: "resume.pdf"
} as const;