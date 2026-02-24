import { PrismaClient, UserRole, Gender, AppointmentType, AppointmentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const firstNames = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth",
  "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
  "Christopher", "Lisa", "Daniel", "Nancy", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
  "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Timothy", "Deborah",
  "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon", "Jeffrey", "Laura", "Ryan", "Cynthia"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
];

const streets = [
  "Oak Street", "Maple Avenue", "Cedar Lane", "Pine Road", "Elm Street", "Washington Blvd",
  "Park Avenue", "Lake Drive", "Hill Street", "River Road", "Forest Lane", "Sunset Boulevard"
];

const cities = [
  { city: "Los Angeles", state: "CA", zip: "90001" },
  { city: "San Francisco", state: "CA", zip: "94102" },
  { city: "San Diego", state: "CA", zip: "92101" },
  { city: "Sacramento", state: "CA", zip: "95814" },
  { city: "Oakland", state: "CA", zip: "94601" },
  { city: "San Jose", state: "CA", zip: "95101" }
];

const insuranceProviders = [
  "Blue Cross Blue Shield", "Aetna", "United Healthcare", "Cigna", "Kaiser Permanente",
  "Humana", "Medicare", "Medicaid", "Anthem", "Health Net"
];

const allergies = [
  "None", "Penicillin", "Sulfa drugs", "Aspirin", "Ibuprofen", "Latex", "Shellfish",
  "Peanuts", "Bee stings", "Codeine"
];

const medications = [
  "None", "Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg", "Amlodipine 5mg",
  "Omeprazole 20mg", "Levothyroxine 50mcg", "Metoprolol 25mg", "Gabapentin 300mg"
];

const appointmentReasons = [
  "Annual physical exam", "Follow-up for hypertension", "Blood pressure check",
  "Diabetes management", "Chest pain evaluation", "Back pain", "Headache",
  "Fatigue and weakness", "Respiratory symptoms", "Skin rash",
  "Joint pain", "Digestive issues", "Anxiety symptoms", "Sleep problems",
  "Medication refill", "Lab results review", "Pre-operative clearance"
];

const doctors = [
  { firstName: "Sarah", lastName: "Chen", specialty: "Internal Medicine", email: "sarah.chen@medportal.com", phone: "(555) 101-0001", licenseNo: "MD-CA-12345" },
  { firstName: "Michael", lastName: "Roberts", specialty: "Family Medicine", email: "michael.roberts@medportal.com", phone: "(555) 101-0002", licenseNo: "MD-CA-12346" },
  { firstName: "Emily", lastName: "Patel", specialty: "Cardiology", email: "emily.patel@medportal.com", phone: "(555) 101-0003", licenseNo: "MD-CA-12347" },
  { firstName: "David", lastName: "Kim", specialty: "Pulmonology", email: "david.kim@medportal.com", phone: "(555) 101-0004", licenseNo: "MD-CA-12348" },
  { firstName: "Jessica", lastName: "Thompson", specialty: "Endocrinology", email: "jessica.thompson@medportal.com", phone: "(555) 101-0005", licenseNo: "MD-CA-12349" },
  { firstName: "Robert", lastName: "Garcia", specialty: "Gastroenterology", email: "robert.garcia@medportal.com", phone: "(555) 101-0006", licenseNo: "MD-CA-12350" }
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhone(): string {
  return `(555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
}

function generateDOB(): Date {
  const now = new Date();
  const minAge = 18;
  const maxAge = 85;
  const age = randomInt(minAge, maxAge);
  const year = now.getFullYear() - age;
  const month = randomInt(0, 11);
  const day = randomInt(1, 28);
  return new Date(year, month, day);
}

function generateInsuranceId(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < 3; i++) id += letters[randomInt(0, 25)];
  id += randomInt(100000000, 999999999).toString();
  return id;
}

async function main() {
  console.log("Cleaning existing data...");
  await prisma.clinicalNote.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.doctor.deleteMany();

  console.log("Creating doctors...");
  const createdDoctors = [];
  for (const doc of doctors) {
    const doctor = await prisma.doctor.create({ data: doc });
    createdDoctors.push(doctor);
  }

  console.log("Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  const hashedAdminPassword = await bcrypt.hash("johndoe123", 10);

  // Admin user (hidden test account)
  await prisma.user.create({
    data: {
      email: "john@doe.com",
      name: "System Admin",
      password: hashedAdminPassword,
      role: UserRole.ADMIN
    }
  });

  // Demo Admin
  await prisma.user.create({
    data: {
      email: "admin@medportal.com",
      name: "Admin User",
      password: hashedPassword,
      role: UserRole.ADMIN
    }
  });

  // Demo Doctor users linked to doctor profiles
  await prisma.user.create({
    data: {
      email: "sarah.chen@medportal.com",
      name: "Dr. Sarah Chen",
      password: hashedPassword,
      role: UserRole.DOCTOR,
      doctorId: createdDoctors[0].id
    }
  });

  await prisma.user.create({
    data: {
      email: "michael.roberts@medportal.com",
      name: "Dr. Michael Roberts",
      password: hashedPassword,
      role: UserRole.DOCTOR,
      doctorId: createdDoctors[1].id
    }
  });

  // Demo Receptionist
  await prisma.user.create({
    data: {
      email: "reception@medportal.com",
      name: "Front Desk",
      password: hashedPassword,
      role: UserRole.RECEPTIONIST
    }
  });

  console.log("Creating patients...");
  const usedEmails = new Set<string>();
  const patients = [];
  
  for (let i = 0; i < 60; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 999)}@email.com`;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 9999)}@email.com`;
    }
    usedEmails.add(email);

    const location = randomElement(cities);
    const genders: Gender[] = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
    const genderWeights = [0.48, 0.48, 0.04];
    const rand = Math.random();
    let cumulative = 0;
    let gender: Gender = Gender.MALE;
    for (let g = 0; g < genders.length; g++) {
      cumulative += genderWeights[g];
      if (rand < cumulative) {
        gender = genders[g] as Gender;
        break;
      }
    }

    patients.push({
      firstName,
      lastName,
      dateOfBirth: generateDOB(),
      gender,
      email: Math.random() > 0.1 ? email : null,
      phone: generatePhone(),
      address: `${randomInt(100, 9999)} ${randomElement(streets)}`,
      city: location.city,
      state: location.state,
      zipCode: location.zip,
      insuranceProvider: Math.random() > 0.05 ? randomElement(insuranceProviders) : null,
      insuranceId: Math.random() > 0.05 ? generateInsuranceId() : null,
      emergencyContact: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      emergencyPhone: generatePhone(),
      medicalHistory: Math.random() > 0.3 ? "See chart for full history" : null,
      allergies: randomElement(allergies),
      medications: randomElement(medications)
    });
  }

  const createdPatients = [];
  for (const p of patients) {
    const patient = await prisma.patient.create({ data: p });
    createdPatients.push(patient);
  }

  console.log("Creating appointments...");
  const appointmentTypes: AppointmentType[] = [
    AppointmentType.CHECKUP, AppointmentType.FOLLOW_UP, AppointmentType.CONSULTATION, 
    AppointmentType.URGENT, AppointmentType.NEW_PATIENT
  ];
  const typeWeights = [0.35, 0.30, 0.20, 0.05, 0.10];

  const now = new Date();
  const appointments = [];

  // Generate appointments for past 4 months and next 2 weeks
  for (let dayOffset = -120; dayOffset <= 14; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Each doctor has 4-8 appointments per day
    for (const doctor of createdDoctors) {
      const numAppointments = randomInt(4, 8);
      const usedSlots = new Set<number>();

      for (let a = 0; a < numAppointments; a++) {
        let hour = randomInt(8, 16);
        while (usedSlots.has(hour)) {
          hour = randomInt(8, 16);
        }
        usedSlots.add(hour);

        const startTime = new Date(date);
        startTime.setHours(hour, randomInt(0, 1) * 30, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);

        // Determine type
        const rand = Math.random();
        let cumulative = 0;
        let type: AppointmentType = AppointmentType.CHECKUP;
        for (let t = 0; t < appointmentTypes.length; t++) {
          cumulative += typeWeights[t];
          if (rand < cumulative) {
            type = appointmentTypes[t] as AppointmentType;
            break;
          }
        }

        // Determine status
        let status: AppointmentStatus;
        if (startTime > now) {
          status = AppointmentStatus.SCHEDULED;
        } else {
          // Past appointments: 75% completed, 18% no-show, 7% cancelled
          const statusRand = Math.random();
          if (statusRand < 0.75) status = AppointmentStatus.COMPLETED;
          else if (statusRand < 0.93) status = AppointmentStatus.NO_SHOW;
          else status = AppointmentStatus.CANCELLED;
        }

        appointments.push({
          patientId: randomElement(createdPatients).id,
          doctorId: doctor.id,
          dateTime: startTime,
          endTime,
          type,
          status,
          reason: randomElement(appointmentReasons),
          waitTime: status === AppointmentStatus.COMPLETED ? randomInt(0, 25) : null
        });
      }
    }
  }

  // Batch create appointments
  const batchSize = 50;
  for (let i = 0; i < appointments.length; i += batchSize) {
    const batch = appointments.slice(i, i + batchSize);
    await prisma.appointment.createMany({ data: batch });
  }

  console.log(`Created ${appointments.length} appointments`);

  // Create clinical notes for completed appointments
  console.log("Creating clinical notes...");
  const completedAppointments = await prisma.appointment.findMany({
    where: { status: AppointmentStatus.COMPLETED },
    take: 100
  });

  const notes = completedAppointments.map(apt => ({
    appointmentId: apt.id,
    patientId: apt.patientId,
    doctorId: apt.doctorId,
    subjective: "Patient presents with " + randomElement(["mild symptoms", "moderate discomfort", "ongoing concerns", "routine follow-up needs"]) + ". Reports " + randomElement(["improving", "stable", "fluctuating", "worsening"]) + " condition since last visit.",
    objective: `Vitals: BP ${randomInt(110, 140)}/${randomInt(70, 90)} mmHg, HR ${randomInt(60, 100)} bpm, Temp ${(97 + Math.random() * 2).toFixed(1)}°F, SpO2 ${randomInt(95, 100)}%. General appearance: ${randomElement(["well-appearing", "mild distress", "alert and oriented"])}.`,
    assessment: randomElement(["Hypertension, well-controlled", "Type 2 Diabetes, stable", "Upper respiratory infection", "Anxiety disorder", "Chronic pain syndrome", "Routine wellness exam - normal findings"]),
    plan: randomElement(["Continue current medications. Follow up in 3 months.", "Adjust medication dosage. Labs ordered. Return in 2 weeks.", "Prescribed new medication. Lifestyle modifications discussed.", "Referral to specialist. Continue monitoring symptoms."])
  }));

  await prisma.clinicalNote.createMany({ data: notes });

  console.log("Seed completed successfully!");
  console.log(`\nDemo Credentials:\n- Admin: admin@medportal.com / password123\n- Doctor: sarah.chen@medportal.com / password123\n- Receptionist: reception@medportal.com / password123`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
