import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create FoodPartners
  const foodPartners = [
    { 
      name: 'Puttu', 
      category: 'Breakfast Classic',
      description: 'A traditional steamed cylinder of ground rice layered with coconut.',
      culinaryHistory: 'Dates back centuries in Kerala cuisine, representing comfort and sustenance.',
      imageIcon: '🍚',
      personalityType: 'Steamed & Reliable',
      relationshipStatus: 'OPEN_FOR_MATCHING',
      greenFlags: JSON.stringify(['Soft texture', 'Absorbs flavors', 'Traditional classic']),
      redFlags: JSON.stringify(['Can be dry if not steamed well']),
      whatItSeeks: 'A sweet, moist companion',
      compatibilityAttributes: JSON.stringify(['Sweetness', 'Moisture', 'Mashing potential'])
    },
    { 
      name: 'Kadala Curry', 
      category: 'Spicy Gravy',
      description: 'A robust, spicy black chickpea curry with deep roasted coconut flavors.',
      culinaryHistory: 'The eternal soulmate of Puttu, known for its fiery temper.',
      imageIcon: '🍛',
      personalityType: 'Spicy & Complex',
      relationshipStatus: 'OPEN_FOR_MATCHING',
      greenFlags: JSON.stringify(['High protein', 'Rich gravy', 'Warming spices']),
      redFlags: JSON.stringify(['Too spicy for delicate palates']),
      whatItSeeks: 'Something to balance the heat',
      compatibilityAttributes: JSON.stringify(['Contrast', 'Cooling effect'])
    },
    { 
      name: 'Upma', 
      category: 'Savoury Porridge',
      description: 'A thick, savory semolina dish cooked with vegetables and mild spices.',
      culinaryHistory: 'A quick breakfast staple often viewed with mixed feelings.',
      imageIcon: '🥣',
      personalityType: 'Quick & Practical',
      relationshipStatus: 'OPEN_FOR_MATCHING',
      greenFlags: JSON.stringify(['Fast preparation', 'Savoury comfort']),
      redFlags: JSON.stringify(['Controversial texture']),
      whatItSeeks: 'A sweet contrast',
      compatibilityAttributes: JSON.stringify(['Sweet-salty balance', 'Texture contrast'])
    },
    { 
      name: 'Ghee', 
      category: 'Clarified Butter',
      description: 'Liquid gold. Pure, aromatic, and rich.',
      culinaryHistory: 'An ancient luxury ingredient that elevates any dish it touches.',
      imageIcon: '🧈',
      personalityType: 'Rich & Comforting',
      relationshipStatus: 'OPEN_FOR_MATCHING',
      greenFlags: JSON.stringify(['Luxurious mouthfeel', 'Aromatic']),
      redFlags: JSON.stringify(['High calorie']),
      whatItSeeks: 'Something that melts into it',
      compatibilityAttributes: JSON.stringify(['Fat-soluble flavors', 'Warmth'])
    },
    { 
      name: 'Beef Curry', 
      category: 'Meat Dish',
      description: 'Slow-cooked, intensely spiced, and deeply savory.',
      culinaryHistory: 'A beloved celebratory dish with deep cultural significance.',
      imageIcon: '🥩',
      personalityType: 'Bold & Traditional',
      relationshipStatus: 'OPEN_FOR_MATCHING',
      greenFlags: JSON.stringify(['Hearty', 'Umami-rich', 'Celebratory']),
      redFlags: JSON.stringify(['Heavy']),
      whatItSeeks: 'A surprising sweet contrast',
      compatibilityAttributes: JSON.stringify(['Umami-sweet contrast', 'Acidity balance'])
    },
  ];

  for (const fp of foodPartners) {
    // Upsert based on name since we don't have a unique ID yet, actually let's just clear first or we can findFirst
    const existing = await prisma.foodPartner.findFirst({ where: { name: fp.name } });
    if (existing) {
      await prisma.foodPartner.update({ where: { id: existing.id }, data: fp });
    } else {
      await prisma.foodPartner.create({ data: fp });
    }
  }

  // Upsert Official Demo Banana
  const demoBanana = await prisma.banana.upsert({
    where: { registrationNumber: 'BNR-KL-2026-004821' },
    update: {
      district: 'Palakkad',
      state: 'Kerala',
      description: 'A beautiful specimen known for its intense sweetness and vibrant color. Perfect for dating.',
      datingAvailability: 'OPEN_FOR_MATCHING',
      verificationCode: 'VRFY-RAMU-001',
    },
    create: {
      registrationNumber: 'BNR-KL-2026-004821',
      officialName: 'Ramapan Morisu Pazham',
      nickname: 'Ramu',
      origin: 'Kerala',
      district: 'Palakkad',
      state: 'Kerala',
      description: 'A beautiful specimen known for its intense sweetness and vibrant color. Perfect for dating.',
      scientificClassification: 'Musa paradisiaca',
      registryStatus: 'ACTIVE',
      datingAvailability: 'OPEN_FOR_MATCHING',
      verificationCode: 'VRFY-RAMU-001',
    },
  });

  // Log audit event
  await prisma.auditEvent.create({
    data: {
      bananaId: demoBanana.id,
      eventType: 'BANANA_REGISTERED',
      description: 'Official Demo Banana registered via seed.',
      source: 'SEED_SCRIPT',
    },
  });

  console.log('Seeding complete. Demo banana ID:', demoBanana.registrationNumber);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
