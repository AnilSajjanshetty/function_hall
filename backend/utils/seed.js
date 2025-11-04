const mongoose = require('mongoose');
const Message = require('../models/Message'); // Adjust path to your models
const Announcement = require('../models/Announcement');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Role = require('../models/Role');
const crypto = require('crypto');
require('dotenv').config({ path: '../.env' });
// Your MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI 

// Seed data
const seedData = {
  messages: [
    {
      to: "john.doe@example.com",
      subject: "Event Confirmation Required",
      body: "Hi John, we need confirmation for your wedding event scheduled on March 15th. Please respond at your earliest convenience.",
      timestamp: new Date("2024-10-20T09:30:00Z"),
      read: false
    },
    {
      to: "sarah.smith@example.com",
      subject: "Payment Reminder",
      body: "Dear Sarah, this is a friendly reminder about the pending payment for your birthday party booking. The amount due is $500.",
      timestamp: new Date("2024-10-18T14:20:00Z"),
      read: true
    },
    {
      to: "michael.brown@example.com",
      subject: "Venue Update",
      body: "Hello Michael, great news! We've secured the premium hall for your corporate event. Please check the updated floor plan attached.",
      timestamp: new Date("2024-10-15T11:45:00Z"),
      read: true
    },
    {
      to: "emily.johnson@example.com",
      subject: "Menu Selection Deadline",
      body: "Hi Emily, please finalize your menu selection for the anniversary party by October 25th. Our catering team is ready to accommodate your preferences.",
      timestamp: new Date("2024-10-22T16:00:00Z"),
      read: false
    },
    {
      to: "david.wilson@example.com",
      subject: "Thank You for Your Booking",
      body: "Thank you for choosing our services for your graduation party! We're excited to make your celebration memorable. Our team will contact you soon.",
      timestamp: new Date("2024-10-19T10:15:00Z"),
      read: true
    },
    {
      to: "lisa.martinez@example.com",
      subject: "Special Discount Offer",
      body: "Dear Lisa, as a valued customer, we're offering you a 15% discount on your next event booking. Valid until the end of the month!",
      timestamp: new Date("2024-10-21T13:30:00Z"),
      read: false
    },
    {
      to: "robert.taylor@example.com",
      subject: "Event Photography Package",
      body: "Hi Robert, we have an amazing photography package available for your baby shower event. Professional photographers and instant prints included!",
      timestamp: new Date("2024-10-17T08:45:00Z"),
      read: true
    },
    {
      to: "amanda.white@example.com",
      subject: "Engagement Ceremony Details",
      body: "Dear Amanda, your engagement ceremony planning is progressing well. We've finalized the floral arrangements and catering menu as discussed.",
      timestamp: new Date("2024-10-23T11:20:00Z"),
      read: false
    }
  ],
  announcements: [
    {
      title: "New Venue Opening",
      message: "We're thrilled to announce the opening of our newest premium venue in downtown! With capacity for 500+ guests and state-of-the-art facilities, it's perfect for large celebrations.",
      date: new Date("2024-10-15T12:00:00Z")
    },
    {
      title: "Holiday Season Discounts",
      message: "Book your holiday events now and save up to 20%! Special packages available for Christmas and New Year celebrations. Limited slots available.",
      date: new Date("2024-10-18T09:00:00Z")
    },
    {
      title: "Award Recognition",
      message: "We're honored to receive the 'Best Event Management Company 2024' award! Thank you to all our clients for your trust and support.",
      date: new Date("2024-10-10T14:30:00Z")
    },
    {
      title: "COVID-19 Safety Measures",
      message: "Your safety is our priority. We've implemented enhanced cleaning protocols and flexible cancellation policies for all events.",
      date: new Date("2024-10-05T11:00:00Z")
    },
    {
      title: "New Catering Menu",
      message: "Explore our expanded catering menu featuring international cuisines, vegan options, and dietary-friendly choices. Sample menus available upon request.",
      date: new Date("2024-10-12T15:45:00Z")
    },
    {
      title: "Virtual Event Planning",
      message: "Introducing our new virtual consultation service! Plan your perfect event from the comfort of your home with our expert planners via video call.",
      date: new Date("2024-10-20T10:30:00Z")
    },
    {
      title: "Summer Wedding Packages",
      message: "Check out our exclusive summer wedding packages with outdoor venue options, beach themes, and tropical decorations. Book early for best dates!",
      date: new Date("2024-10-25T14:00:00Z")
    }
  ],
  bookings: [
    {
      name: "Jennifer Anderson",
      email: "jennifer.anderson@example.com",
      phone: "+1-555-0101",
      eventType: "Wedding",
      date: "2024-12-15",
      guests: 150,
      message: "We'd like a traditional wedding ceremony with outdoor setup. Garden theme preferred.",
      status: "approved",
      submittedAt: new Date("2024-10-01T10:30:00Z")
    },
    {
      name: "Thomas Wright",
      email: "thomas.wright@example.com",
      phone: "+1-555-0102",
      eventType: "Birthday Party",
      date: "2024-11-08",
      guests: 50,
      message: "Birthday party for my daughter's 10th birthday. Unicorn theme with face painting and magic show.",
      status: "pending",
      submittedAt: new Date("2024-10-18T14:20:00Z")
    },
    {
      name: "Sophia Martinez",
      email: "sophia.martinez@example.com",
      phone: "+1-555-0103",
      eventType: "Office Event",
      date: "2024-11-22",
      guests: 200,
      message: "Annual corporate gala dinner. Need AV equipment, stage setup, and professional photography.",
      status: "approved",
      submittedAt: new Date("2024-10-10T09:15:00Z")
    },
    {
      name: "James Thompson",
      email: "james.thompson@example.com",
      phone: "+1-555-0104",
      eventType: "Anniversary",
      date: "2024-12-01",
      guests: 75,
      message: "25th wedding anniversary celebration. Looking for elegant decor and live music.",
      status: "approved",
      submittedAt: new Date("2024-10-12T16:45:00Z")
    },
    {
      name: "Olivia Davis",
      email: "olivia.davis@example.com",
      phone: "+1-555-0105",
      eventType: "Baby Shower",
      date: "2024-11-15",
      guests: 40,
      message: "Baby shower for first child. Would love a pastel color theme with games and refreshments.",
      status: "pending",
      submittedAt: new Date("2024-10-20T11:30:00Z")
    },
    {
      name: "Ethan Rodriguez",
      email: "ethan.rodriguez@example.com",
      phone: "+1-555-0106",
      eventType: "Birthday Party",
      date: "2024-11-30",
      guests: 100,
      message: "High school graduation party. Need DJ, photo booth, and catering for teenagers.",
      status: "pending",
      submittedAt: new Date("2024-10-22T13:00:00Z")
    },
    {
      name: "Isabella Clark",
      email: "isabella.clark@example.com",
      phone: "+1-555-0107",
      eventType: "Engagement",
      date: "2024-12-20",
      guests: 80,
      message: "Engagement ceremony with traditional decorations. Need vegetarian catering options.",
      status: "approved",
      submittedAt: new Date("2024-10-08T15:20:00Z")
    },
    {
      name: "William Lee",
      email: "william.lee@example.com",
      phone: "+1-555-0108",
      eventType: "Birthday Party",
      date: "2024-11-25",
      guests: 60,
      message: "50th birthday surprise party. Need help with coordination and keeping it secret!",
      status: "rejected",
      submittedAt: new Date("2024-10-19T10:45:00Z")
    },
    {
      name: "Charlotte Green",
      email: "charlotte.green@example.com",
      phone: "+1-555-0109",
      eventType: "Wedding",
      date: "2024-12-28",
      guests: 180,
      message: "Destination wedding at beach resort. Need complete package including accommodation coordination.",
      status: "approved",
      submittedAt: new Date("2024-10-14T13:45:00Z")
    },
    {
      name: "Daniel Harris",
      email: "daniel.harris@example.com",
      phone: "+1-555-0110",
      eventType: "Office Event",
      date: "2024-11-18",
      guests: 120,
      message: "Company holiday party with awards ceremony. Need stage, sound system, and buffet dinner.",
      status: "pending",
      submittedAt: new Date("2024-10-21T09:30:00Z")
    },
    {
      name: "Rebecca Foster",
      email: "rebecca.foster@example.com",
      phone: "+1-555-0111",
      eventType: "Bridal Shower",
      date: "2024-12-05",
      guests: 35,
      message: "Elegant bridal shower with tea party theme. Need vintage decorations and catering.",
      status: "approved",
      submittedAt: new Date("2024-10-23T15:10:00Z")
    },
    {
      name: "George Phillips",
      email: "george.phillips@example.com",
      phone: "+1-555-0112",
      eventType: "Retirement Party",
      date: "2024-11-28",
      guests: 90,
      message: "Retirement celebration for 30 years of service. Looking for professional setup with slideshow presentation.",
      status: "pending",
      submittedAt: new Date("2024-10-24T10:20:00Z")
    }
  ],
  events: [
    {
      title: "Sharma-Patel Wedding Extravaganza",
      type: "Wedding",
      date: "2024-09-15",
      guests: 300,
      description: "A grand traditional Indian wedding with three days of celebrations including Mehendi, Sangeet, and wedding ceremony. Beautiful floral decorations and traditional music.",
      images: [
        "/images/events/wedding1-1.jpg",
        "/images/events/wedding1-2.jpg",
        "/images/events/wedding1-3.jpg"
      ],
      videos: [
        "/videos/events/wedding1-highlight.mp4"
      ]
    },
    {
      title: "TechCorp Annual Conference 2024",
      type: "Office Event",
      date: "2024-09-22",
      guests: 500,
      description: "A successful corporate conference featuring keynote speakers, networking sessions, and product launches. State-of-the-art AV setup and professional catering.",
      images: [
        "/images/events/corporate1-1.jpg",
        "/images/events/corporate1-2.jpg"
      ],
      videos: [
        "/videos/events/corporate1-recap.mp4"
      ]
    },
    {
      title: "Emma's Magical 5th Birthday",
      type: "Birthday Party",
      date: "2024-09-10",
      guests: 45,
      description: "Enchanting princess-themed birthday party with castle decorations, face painting, magic show, and character appearances. All children had a wonderful time!",
      images: [
        "/images/events/birthday1-1.jpg",
        "/images/events/birthday1-2.jpg",
        "/images/events/birthday1-3.jpg"
      ],
      videos: []
    },
    {
      title: "Golden Anniversary Celebration",
      type: "Anniversary",
      date: "2024-09-05",
      guests: 120,
      description: "Elegant 50th wedding anniversary celebration with gold-themed decor, live band, and emotional speeches. A beautiful tribute to 50 years of love.",
      images: [
        "/images/events/anniversary1-1.jpg",
        "/images/events/anniversary1-2.jpg"
      ],
      videos: [
        "/videos/events/anniversary1-speeches.mp4"
      ]
    },
    {
      title: "Sarah's Surprise Baby Shower",
      type: "Baby Shower",
      date: "2024-09-28",
      guests: 35,
      description: "Charming baby shower with pastel decorations, fun games, delicious refreshments, and lots of love. The mom-to-be was genuinely surprised and delighted!",
      images: [
        "/images/events/babyshower1-1.jpg",
        "/images/events/babyshower1-2.jpg"
      ],
      videos: []
    },
    {
      title: "Class of 2024 Graduation Bash",
      type: "Graduation Party",
      date: "2024-08-30",
      guests: 150,
      description: "Epic graduation party with professional DJ, photo booth, catering, and yearbook signing station. Celebrating the achievements of the graduating class!",
      images: [
        "/images/events/graduation1-1.jpg",
        "/images/events/graduation1-2.jpg",
        "/images/events/graduation1-3.jpg"
      ],
      videos: [
        "/videos/events/graduation1-party.mp4"
      ]
    },
    {
      title: "Rajesh & Priya Engagement Ceremony",
      type: "Engagement",
      date: "2024-09-18",
      guests: 100,
      description: "Traditional engagement ceremony with beautiful mandap setup, traditional music, and authentic Indian catering. A perfect beginning to their journey together.",
      images: [
        "/images/events/engagement1-1.jpg",
        "/images/events/engagement1-2.jpg"
      ],
      videos: []
    },
    {
      title: "Johnson Family Reunion BBQ",
      type: "Other Event",
      date: "2024-09-12",
      guests: 80,
      description: "Outdoor family reunion with BBQ, lawn games, and live acoustic music. Three generations came together for a memorable day of fun and laughter.",
      images: [
        "/images/events/family1-1.jpg",
        "/images/events/family1-2.jpg"
      ],
      videos: []
    },
    {
      title: "Martinez Beach Wedding",
      type: "Wedding",
      date: "2024-09-25",
      guests: 120,
      description: "Beautiful beach wedding at sunset with white and blue color theme. Intimate ceremony followed by beachside reception with seafood buffet.",
      images: [
        "/images/events/wedding2-1.jpg",
        "/images/events/wedding2-2.jpg"
      ],
      videos: [
        "/videos/events/wedding2-ceremony.mp4"
      ]
    },
    {
      title: "StartUp Hub Launch Party",
      type: "Product Launch",
      date: "2024-09-20",
      guests: 250,
      description: "Grand opening celebration for new co-working space with networking, live music, food trucks, and tours. Great success with many new memberships signed!",
      images: [
        "/images/events/office1-1.jpg",
        "/images/events/office1-2.jpg",
        "/images/events/office1-3.jpg"
      ],
      videos: []
    },
    {
      title: "Annual Diwali Celebration",
      type: "Festival Celebration",
      date: "2024-10-24",
      guests: 300,
      description: "Grand Diwali celebration with traditional decorations, fireworks display, cultural performances, and authentic Indian cuisine. A night of lights and festivities!",
      images: [
        "/images/events/diwali1-1.jpg",
        "/images/events/diwali1-2.jpg"
      ],
      videos: [
        "/videos/events/diwali1-fireworks.mp4"
      ]
    },
    {
      title: "Emma's Elegant Bridal Shower",
      type: "Bridal Shower",
      date: "2024-09-08",
      guests: 40,
      description: "Sophisticated bridal shower with champagne brunch, gift games, and beautiful floral centerpieces. The bride-to-be was showered with love and best wishes!",
      images: [
        "/images/events/bridalshower1-1.jpg",
        "/images/events/bridalshower1-2.jpg"
      ],
      videos: []
    },
    {
      title: "Tech Innovators Networking Mixer",
      type: "Networking Event",
      date: "2024-09-14",
      guests: 150,
      description: "Professional networking event for tech entrepreneurs and investors. Speed networking sessions, panel discussions, and cocktail reception.",
      images: [
        "/images/events/networking1-1.jpg",
        "/images/events/networking1-2.jpg"
      ],
      videos: []
    },
    {
      title: "Community Charity Fundraiser Gala",
      type: "Charity Event",
      date: "2024-10-05",
      guests: 200,
      description: "Black-tie charity gala with silent auction, live entertainment, and dinner. Successfully raised over $50,000 for local children's education programs.",
      images: [
        "/images/events/charity1-1.jpg",
        "/images/events/charity1-2.jpg",
        "/images/events/charity1-3.jpg"
      ],
      videos: [
        "/videos/events/charity1-highlights.mp4"
      ]
    }
  ]
};

// ✅ Helper function to seed roles
async function seedRoles() {
  const roles = ['admin', 'user'];

  for (const name of roles) {
    const existingRole = await Role.findOne({ name });
    if (!existingRole) {
      const code = crypto.randomBytes(16).toString('hex');
      await Role.create({ name, code });
      console.log(`✅ Role "${name}" created`);
    } else {
      console.log(`⚠️ Role "${name}" already exists`);
    }
  }
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear old data
    await Message.deleteMany({});
    await Announcement.deleteMany({});
    await Booking.deleteMany({});
    await Event.deleteMany({});
    console.log('🧹 Cleared existing data');

    // ✅ Ensure roles are seeded
    await seedRoles();

    // Insert seed data
    await Message.insertMany(seedData.messages);
    console.log(`✓ Added ${seedData.messages.length} messages`);

    await Announcement.insertMany(seedData.announcements);
    console.log(`✓ Added ${seedData.announcements.length} announcements`);

    await Booking.insertMany(seedData.bookings);
    console.log(`✓ Added ${seedData.bookings.length} bookings`);

    await Event.insertMany(seedData.events);
    console.log(`✓ Added ${seedData.events.length} events`);

    console.log('\n🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
}

// Run seeding
seedDatabase();