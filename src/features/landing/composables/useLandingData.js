/**
 * Composable for landing page static data
 * Keeps the data separate from components for better maintainability
 */
export function useLandingData() {
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Sermons', href: '#sermons' },
    { name: 'Events', href: '#events' },
    { name: 'Contact', href: '#contact' }
  ]

  const services = [
    { day: 'Sunday', time: '7:00 AM', name: 'English Service', icon: 'sun' },
    { day: 'Sunday', time: '10:00 AM', name: 'Twi Service', icon: 'cross' },
    { day: 'Tuesday', time: '7:00 PM', name: 'Bible Study', icon: 'book' }
  ]

  const ministries = [
    {
      title: "Women's Ministry",
      description: 'Empowering women to discover their faith and purpose.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'
    },
    {
      title: "Men's Ministry",
      description: 'Building godly men through fellowship and discipleship.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'
    },
    {
      title: 'JOY Fellowship',
      description: 'Jesus, Others, Yourself - Senior citizens fellowship.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'
    },
    {
      title: 'Youth Ministry',
      description: 'Empowering the next generation to discover their faith and purpose.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'
    },
    {
      title: "Children's Ministry",
      description: 'Empowering children to discover their faith and purpose.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'
    },
    {
      title: 'Royal Rangers',
      description: 'Building godly men through fellowship and discipleship.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'
    },
    {
      title: 'Missionettes',
      description: 'Building godly men through fellowship and discipleship.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'
    },
    {
      title: 'Prayer Ministry',
      description: 'Interceding for our church family and community.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'
    }
  ]

  const news = [
    {
      date: 'December 20, 2025',
      title: 'Community Outreach Program Reaches New Milestone',
      excerpt: 'Our community outreach program has successfully served over 500 families this holiday season, providing meals and essential supplies.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80'
    },
    {
      date: 'December 18, 2025',
      title: 'Youth Ministry Hosts Annual Winter Retreat',
      excerpt: 'Over 100 young people gathered for a weekend of fellowship, worship, and spiritual growth at our annual winter retreat.',
      image: 'https://images.unsplash.com/photo-1523803326055-13f69d67b7b4?w=600&q=80'
    },
    {
      date: 'December 17, 2025',
      title: 'New Worship Center Expansion Announced',
      excerpt: 'The church leadership has announced plans for a new worship center expansion to accommodate our growing congregation.',
      image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&q=80'
    }
  ]

  return {
    navLinks,
    services,
    ministries,
    news
  }
}
