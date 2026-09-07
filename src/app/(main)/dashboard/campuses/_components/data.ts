export interface ClassroomItem {
  id: string;
  code: string;
  name: string;
  type: "Computer Lab" | "Lecture Hall" | "Standard Classroom" | "Virtual Room" | "Collaborative Studio";
  capacity: number;
  campusId: string;
  floor: string;
  equipment: string[];
  status: "Available" | "In Session" | "Maintenance";
}

export interface CampusItem {
  id: string;
  code: string;
  name: string;
  type: "Physical" | "Virtual / Hybrid";
  address: string;
  city: string;
  country: string;
  manager: string;
  phone: string;
  totalCapacity: number;
  classroomsCount: number;
  activeCohortsCount: number;
  classrooms: ClassroomItem[];
}

export const ROOM_TYPES = [
  "Computer Lab",
  "Lecture Hall",
  "Standard Classroom",
  "Virtual Room",
  "Collaborative Studio",
] as const;

export const INITIAL_CAMPUSES: CampusItem[] = [
  {
    id: "camp-1",
    code: "PARIS-MAIN",
    name: "Paris Tech Campus - Central Hub",
    type: "Physical",
    address: "14 Rue du Faubourg Saint-Honoré",
    city: "Paris",
    country: "France",
    manager: "Antoine Lebrun",
    phone: "+33 1 45 67 89 00",
    totalCapacity: 340,
    classroomsCount: 6,
    activeCohortsCount: 5,
    classrooms: [
      {
        id: "room-101",
        code: "AMPHI-TURING",
        name: "Alan Turing Amphitheatre",
        type: "Lecture Hall",
        capacity: 120,
        campusId: "camp-1",
        floor: "Ground Floor",
        equipment: ["Dual Laser Projectors", "Surround Audio System", "Lecture Capture Cameras", "Fiber Wi-Fi 6"],
        status: "In Session",
      },
      {
        id: "room-102",
        code: "LAB-ADA",
        name: "Ada Lovelace GPU Lab",
        type: "Computer Lab",
        capacity: 35,
        campusId: "camp-1",
        floor: "1st Floor",
        equipment: ["35x RTX 4080 Workstations", "Gigabit LAN", "Dual Monitors", "Air Conditioning"],
        status: "Available",
      },
      {
        id: "room-103",
        code: "LAB-LINUS",
        name: "Linus Torvalds Cloud & DevOps Lab",
        type: "Computer Lab",
        capacity: 30,
        campusId: "camp-1",
        floor: "1st Floor",
        equipment: ["30x Linux Workstations", "Server Rack Access", "Interactive Smartboard"],
        status: "In Session",
      },
      {
        id: "room-104",
        code: "STUDIO-NEUMANN",
        name: "Von Neumann Design Studio",
        type: "Collaborative Studio",
        capacity: 25,
        campusId: "camp-1",
        floor: "2nd Floor",
        equipment: ["Apple Studio Displays", "Wacom Tablets", "Whiteboard Walls"],
        status: "Available",
      },
      {
        id: "room-105",
        code: "CLASS-201",
        name: "Classroom Euler",
        type: "Standard Classroom",
        capacity: 40,
        campusId: "camp-1",
        floor: "2nd Floor",
        equipment: ["HD Projector", "Whiteboard", "High-Density Wi-Fi"],
        status: "Available",
      },
      {
        id: "room-106",
        code: "CLASS-202",
        name: "Classroom Shannon",
        type: "Standard Classroom",
        capacity: 40,
        campusId: "camp-1",
        floor: "2nd Floor",
        equipment: ["HD Projector", "Soundbar", "Mobile Desks"],
        status: "Maintenance",
      },
    ],
  },
  {
    id: "camp-2",
    code: "LYON-INNO",
    name: "Lyon Confluence Digital Hub",
    type: "Physical",
    address: "28 Quai Rambaud",
    city: "Lyon",
    country: "France",
    manager: "Camille Bernard",
    phone: "+33 4 72 00 12 34",
    totalCapacity: 180,
    classroomsCount: 4,
    activeCohortsCount: 3,
    classrooms: [
      {
        id: "room-201",
        code: "AMPHI-LUMIERE",
        name: "Lumière Lecture Hall",
        type: "Lecture Hall",
        capacity: 80,
        campusId: "camp-2",
        floor: "Ground Floor",
        equipment: ["4K Projector", "Conference Mic System", "Wi-Fi 6"],
        status: "Available",
      },
      {
        id: "room-202",
        code: "LAB-RHONE",
        name: "Rhône Cybersecurity Lab",
        type: "Computer Lab",
        capacity: 30,
        campusId: "camp-2",
        floor: "1st Floor",
        equipment: ["Isolated Cyber Range Network", "Hardware Hacking Tools", "Smartboard"],
        status: "In Session",
      },
      {
        id: "room-203",
        code: "CLASS-LY-1",
        name: "Classroom Ampère",
        type: "Standard Classroom",
        capacity: 35,
        campusId: "camp-2",
        floor: "1st Floor",
        equipment: ["Short-throw Laser Projector", "Modular Tables"],
        status: "Available",
      },
      {
        id: "room-204",
        code: "CLASS-LY-2",
        name: "Classroom Jacquard",
        type: "Standard Classroom",
        capacity: 35,
        campusId: "camp-2",
        floor: "2nd Floor",
        equipment: ["Interactive Display", "Video Conferencing Kit"],
        status: "Available",
      },
    ],
  },
  {
    id: "camp-3",
    code: "VIRTUAL-CAMPUS",
    name: "Onixe Global Cloud Campus",
    type: "Virtual / Hybrid",
    address: "Cloud Platform (Interactive WebRTC & LMS)",
    city: "Global Remote",
    country: "Cloud Infrastructure",
    manager: "Nadine Touré",
    phone: "+33 1 45 67 89 30",
    totalCapacity: 600,
    classroomsCount: 3,
    activeCohortsCount: 4,
    classrooms: [
      {
        id: "room-301",
        code: "VIRTUAL-MAIN-A",
        name: "Cloud Auditorium Alpha",
        type: "Virtual Room",
        capacity: 250,
        campusId: "camp-3",
        floor: "Cloud Server EU-West",
        equipment: ["Live HD Streaming", "Breakout Rooms", "AI Live Captions", "Attendance Auto-logger"],
        status: "In Session",
      },
      {
        id: "room-302",
        code: "VIRTUAL-WORKSHOP-1",
        name: "Interactive Coding Workshop Room 1",
        type: "Virtual Room",
        capacity: 50,
        campusId: "camp-3",
        floor: "Cloud Server EU-West",
        equipment: ["Integrated Cloud IDE", "Screen Sharing", "Pair-Programming Sandbox"],
        status: "Available",
      },
      {
        id: "room-303",
        code: "VIRTUAL-WORKSHOP-2",
        name: "Interactive Coding Workshop Room 2",
        type: "Virtual Room",
        capacity: 50,
        campusId: "camp-3",
        floor: "Cloud Server EU-West",
        equipment: ["Integrated Cloud IDE", "Screen Sharing", "Pair-Programming Sandbox"],
        status: "Available",
      },
    ],
  },
];
