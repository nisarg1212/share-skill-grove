import { supabase } from '../integrations/supabase/client';

interface SampleProfile {
  id: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  skills_offered: string[];
  skills_wanted: string[];
}

const sampleProfiles: SampleProfile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    username: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    bio: 'Passionate web developer and UI/UX designer with 5 years of experience. I love creating beautiful, user-friendly interfaces and am always eager to learn new technologies.',
    location: 'San Francisco, CA',
    skills_offered: ['React', 'JavaScript', 'UI/UX Design', 'CSS', 'HTML'],
    skills_wanted: ['Python', 'Machine Learning', 'Data Science', 'Node.js']
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'Michael Chen',
    email: 'michael.chen@example.com',
    bio: 'Data scientist and machine learning enthusiast. I help businesses extract insights from their data and build predictive models.',
    location: 'New York, NY',
    skills_offered: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'TensorFlow'],
    skills_wanted: ['React', 'JavaScript', 'Web Development', 'CSS']
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    username: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    bio: 'Full-stack developer with expertise in both frontend and backend technologies. I enjoy building scalable applications and mentoring junior developers.',
    location: 'Austin, TX',
    skills_offered: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'React'],
    skills_wanted: ['Docker', 'Kubernetes', 'DevOps', 'AWS']
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    username: 'David Kim',
    email: 'david.kim@example.com',
    bio: 'DevOps engineer specializing in cloud infrastructure and containerization. I help teams deploy and scale applications efficiently.',
    location: 'Seattle, WA',
    skills_offered: ['Docker', 'Kubernetes', 'AWS', 'DevOps', 'Linux'],
    skills_wanted: ['Node.js', 'React', 'JavaScript', 'MongoDB']
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    username: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    bio: 'Creative graphic designer and brand strategist. I help businesses create compelling visual identities and marketing materials.',
    location: 'Los Angeles, CA',
    skills_offered: ['Graphic Design', 'Adobe Creative Suite', 'Branding', 'Marketing', 'Photography'],
    skills_wanted: ['UI/UX Design', 'Web Design', 'CSS', 'HTML']
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    username: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    bio: 'Product manager with a technical background. I bridge the gap between business requirements and technical implementation.',
    location: 'Chicago, IL',
    skills_offered: ['Product Management', 'Agile', 'Scrum', 'Business Analysis', 'Strategy'],
    skills_wanted: ['Python', 'SQL', 'Data Analysis', 'Machine Learning']
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    username: 'Rachel Green',
    email: 'rachel.green@example.com',
    bio: 'Mobile app developer focused on creating intuitive iOS and Android applications. I love working with the latest mobile technologies.',
    location: 'San Francisco, CA',
    skills_offered: ['Swift', 'iOS Development', 'Android', 'Mobile Development', 'Flutter'],
    skills_wanted: ['React Native', 'JavaScript', 'Node.js', 'API Development']
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    username: 'James Wilson',
    email: 'james.wilson@example.com',
    bio: 'Backend engineer with expertise in scalable system design. I enjoy solving complex technical challenges and optimizing performance.',
    location: 'New York, NY',
    skills_offered: ['Java', 'Spring Boot', 'Microservices', 'API Development', 'PostgreSQL'],
    skills_wanted: ['React', 'TypeScript', 'Frontend Development', 'UI/UX Design']
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    username: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    bio: 'Digital marketing specialist and content creator. I help brands grow their online presence through strategic marketing campaigns.',
    location: 'Miami, FL',
    skills_offered: ['Digital Marketing', 'SEO', 'Content Marketing', 'Social Media', 'Analytics'],
    skills_wanted: ['Web Development', 'HTML', 'CSS', 'JavaScript']
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    username: 'Tom Anderson',
    email: 'tom.anderson@example.com',
    bio: 'Cybersecurity expert with a focus on application security and penetration testing. I help organizations protect their digital assets.',
    location: 'Washington, DC',
    skills_offered: ['Cybersecurity', 'Penetration Testing', 'Security Auditing', 'Network Security', 'Ethical Hacking'],
    skills_wanted: ['Cloud Security', 'Docker', 'Kubernetes', 'DevOps']
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    username: 'Maya Patel',
    email: 'maya.patel@example.com',
    bio: 'AI researcher and machine learning engineer working on computer vision and natural language processing. Passionate about making AI accessible to everyone.',
    location: 'Boston, MA',
    skills_offered: ['Machine Learning', 'AI', 'Computer Vision', 'NLP', 'PyTorch'],
    skills_wanted: ['Web Development', 'React', 'API Development', 'Cloud Computing']
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    username: 'Carlos Mendez',
    email: 'carlos.mendez@example.com',
    bio: 'Blockchain developer and cryptocurrency enthusiast. I build decentralized applications and smart contracts on various blockchain platforms.',
    location: 'Denver, CO',
    skills_offered: ['Blockchain', 'Solidity', 'Smart Contracts', 'Web3', 'Cryptocurrency'],
    skills_wanted: ['React', 'JavaScript', 'UI/UX Design', 'Mobile Development']
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    username: 'Nina Kowalski',
    email: 'nina.kowalski@example.com',
    bio: 'Game developer and 3D artist creating immersive gaming experiences. I specialize in Unity and Unreal Engine development.',
    location: 'Portland, OR',
    skills_offered: ['Game Development', 'Unity', 'Unreal Engine', '3D Modeling', 'C#'],
    skills_wanted: ['VR Development', 'AR Development', 'Blender', 'Animation']
  },
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    username: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    bio: 'Data engineer specializing in big data processing and analytics pipelines. I help organizations make sense of large datasets.',
    location: 'Atlanta, GA',
    skills_offered: ['Data Engineering', 'Apache Spark', 'Hadoop', 'ETL', 'Big Data'],
    skills_wanted: ['Machine Learning', 'Python', 'Cloud Computing', 'Docker']
  },
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    username: 'Isabella Ferrari',
    email: 'isabella.ferrari@example.com',
    bio: 'UX researcher and interaction designer. I conduct user research and create intuitive digital experiences based on human behavior.',
    location: 'San Diego, CA',
    skills_offered: ['UX Research', 'User Testing', 'Interaction Design', 'Prototyping', 'Figma'],
    skills_wanted: ['Front-end Development', 'HTML', 'CSS', 'JavaScript']
  },
  {
    id: '10101010-1010-1010-1010-101010101010',
    username: 'Kevin O\'Brien',
    email: 'kevin.obrien@example.com',
    bio: 'Cloud architect and infrastructure specialist. I design and implement scalable cloud solutions for enterprise applications.',
    location: 'Phoenix, AZ',
    skills_offered: ['Cloud Architecture', 'Azure', 'AWS', 'Terraform', 'Infrastructure as Code'],
    skills_wanted: ['Kubernetes', 'Docker', 'Microservices', 'DevOps']
  },
  {
    id: '20202020-2020-2020-2020-202020202020',
    username: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    bio: 'QA engineer and test automation specialist. I ensure software quality through comprehensive testing strategies and automated test suites.',
    location: 'Houston, TX',
    skills_offered: ['QA Testing', 'Test Automation', 'Selenium', 'API Testing', 'Quality Assurance'],
    skills_wanted: ['Performance Testing', 'Load Testing', 'CI/CD', 'Jenkins']
  },
  {
    id: '30303030-3030-3030-3030-303030303030',
    username: 'Marcus Johnson',
    email: 'marcus.johnson@example.com',
    bio: 'Technical writer and documentation specialist. I create clear, comprehensive documentation for complex technical products.',
    location: 'Nashville, TN',
    skills_offered: ['Technical Writing', 'Documentation', 'API Documentation', 'Content Strategy', 'Markdown'],
    skills_wanted: ['Web Development', 'Static Site Generators', 'Git', 'Version Control']
  },
  {
    id: '40404040-4040-4040-4040-404040404040',
    username: 'Anna Larsson',
    email: 'anna.larsson@example.com',
    bio: 'Database administrator and data architect. I design and maintain robust database systems for high-performance applications.',
    location: 'Minneapolis, MN',
    skills_offered: ['Database Administration', 'MySQL', 'PostgreSQL', 'Data Modeling', 'Performance Tuning'],
    skills_wanted: ['NoSQL', 'MongoDB', 'Redis', 'Data Science']
  },
  {
    id: '50505050-5050-5050-5050-505050505050',
    username: 'Jordan Martinez',
    email: 'jordan.martinez@example.com',
    bio: 'Startup founder and entrepreneur with experience in product development and business strategy. I love helping others build their ideas into successful products.',
    location: 'Austin, TX',
    skills_offered: ['Entrepreneurship', 'Product Strategy', 'Business Development', 'Fundraising', 'Leadership'],
    skills_wanted: ['Web Development', 'Mobile Development', 'Marketing', 'Sales']
  },
  {
    id: '60606060-6060-6060-6060-606060606060',
    username: 'Chen Wei',
    email: 'chen.wei@example.com',
    bio: 'IoT developer and embedded systems engineer. I create connected devices and smart solutions for home automation and industrial applications.',
    location: 'San Jose, CA',
    skills_offered: ['IoT Development', 'Embedded Systems', 'Arduino', 'Raspberry Pi', 'C++'],
    skills_wanted: ['Mobile Development', 'React Native', 'Flutter', 'API Development']
  },
  {
    id: '70707070-7070-7070-7070-707070707070',
    username: 'Amanda Clarke',
    email: 'amanda.clarke@example.com',
    bio: 'Social media manager and content creator. I help brands build engaging online communities and create viral content across platforms.',
    location: 'Las Vegas, NV',
    skills_offered: ['Social Media Management', 'Content Creation', 'Instagram Marketing', 'TikTok', 'Video Editing'],
    skills_wanted: ['Photography', 'Graphic Design', 'Web Design', 'SEO']
  },
  {
    id: '80808080-8080-8080-8080-808080808080',
    username: 'Dmitri Volkov',
    email: 'dmitri.volkov@example.com',
    bio: 'Systems administrator and network engineer. I maintain and optimize IT infrastructure for organizations of all sizes.',
    location: 'Salt Lake City, UT',
    skills_offered: ['System Administration', 'Network Engineering', 'Linux', 'Windows Server', 'Virtualization'],
    skills_wanted: ['Cloud Computing', 'Docker', 'Kubernetes', 'Automation']
  },
  {
    id: '90909090-9090-9090-9090-909090909090',
    username: 'Olivia Brown',
    email: 'olivia.brown@example.com',
    bio: 'Digital artist and creative director. I create stunning visual content for brands, games, and digital media using cutting-edge design tools.',
    location: 'Charleston, SC',
    skills_offered: ['Digital Art', 'Creative Direction', 'Illustration', 'Motion Graphics', 'After Effects'],
    skills_wanted: ['3D Modeling', 'Blender', 'Animation', 'VR Art']
  },
  {
    id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    username: 'Hassan Ali',
    email: 'hassan.ali@example.com',
    bio: 'Full-stack developer specializing in e-commerce solutions. I build robust online stores and payment systems for businesses.',
    location: 'Detroit, MI',
    skills_offered: ['E-commerce Development', 'PHP', 'Laravel', 'WooCommerce', 'Payment Integration'],
    skills_wanted: ['React', 'Vue.js', 'Node.js', 'Modern JavaScript']
  }
];

export const populateSampleProfiles = async () => {
  try {
    console.log('Starting to populate sample profiles...');
    
    // Check if profiles already exist
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .in('id', sampleProfiles.map(p => p.id));

    const existingIds = existingProfiles?.map(p => p.id) || [];
    const newProfiles = sampleProfiles.filter(p => !existingIds.includes(p.id));

    if (newProfiles.length === 0) {
      console.log('All sample profiles already exist!');
      return;
    }

    // Insert new profiles
    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfiles);

    if (error) {
      console.error('Error inserting sample profiles:', error);
      throw error;
    }

    console.log(`Successfully added ${newProfiles.length} sample profiles!`);
    return data;
  } catch (error) {
    console.error('Failed to populate sample profiles:', error);
    throw error;
  }
};

// Run this function to populate the database
// populateSampleProfiles().then(() => console.log('Done!'));
