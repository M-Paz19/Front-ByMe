export interface Professional {
  id: string;
  name: string;
  specialty: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  hourlyRate: number;
  distance: string;
  available: boolean;
  photo: string;
  services: Service[];
  reviews: Review[];
  mapX: number;
  mapY: number;
  badge?: string;
  phone: string;
  email: string;
  address: string;
  yearsExp: number;
  completedJobs: number;
  responseTime: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export interface Review {
  id: string;
  userName: string;
  userPhoto: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  count: number;
  color: string;
  bgColor: string;
}

export const IMGS = {
  hero: 'https://images.unsplash.com/photo-1663169871268-d2ca5f3fc5e1?w=1400&q=80',
  service: 'https://images.unsplash.com/photo-1768321911908-01c691fcc5a0?w=800&q=80',
  woman1: 'https://images.unsplash.com/photo-1600696444233-20accba67df3?w=400&q=80',
  man1: 'https://images.unsplash.com/photo-1606384682764-c3065dbcaf85?w=400&q=80',
  woman2: 'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?w=400&q=80',
  man2: 'https://images.unsplash.com/photo-1664101606938-e664f5852fac?w=400&q=80',
  city: 'https://images.unsplash.com/photo-1598886247299-3b71da134afb?w=1200&q=80',
  painting: 'https://images.unsplash.com/photo-1768839725085-829e6ac7ac26?w=800&q=80',
};

const SAMPLE_REVIEWS: Review[] = [
  { id: 'r1', userName: 'Daniela Torres', userPhoto: IMGS.woman2, rating: 5, date: '15 Feb 2025', comment: 'Excelente trabajo, muy profesional y puntual. Lo recomiendo totalmente. Quedé muy satisfecha con el resultado.' },
  { id: 'r2', userName: 'Sebastián Ruiz', userPhoto: IMGS.man2, rating: 5, date: '10 Feb 2025', comment: 'Resolvió el problema rápidamente y dejó todo limpio. Muy buen servicio, volvería a contratarlo.' },
  { id: 'r3', userName: 'Patricia Mora', userPhoto: IMGS.woman1, rating: 4, date: '2 Feb 2025', comment: 'Buen profesional, puntual y amable. El trabajo quedó bien hecho y al precio acordado.' },
  { id: 'r4', userName: 'Jorge Hernández', userPhoto: IMGS.man1, rating: 5, date: '25 Ene 2025', comment: 'Super recomendado. Llegó a tiempo, trabajó de forma ordenada y el resultado fue perfecto.' },
];

export const professionals: Professional[] = [
  {
    id: '1',
    name: 'Carlos Ramírez',
    specialty: 'Plomero Certificado',
    category: 'plomeria',
    rating: 4.9,
    reviewCount: 47,
    description: 'Especialista en plomería residencial y comercial con más de 10 años de experiencia en Popayán. Ofrezco soluciones rápidas y duraderas para todos los problemas de fontanería. Trabajo garantizado y materiales de primera calidad. Atención de urgencias las 24 horas.',
    shortDescription: 'Plomería residencial y comercial, reparaciones urgentes disponibles.',
    hourlyRate: 35000,
    distance: '1.2 km',
    available: true,
    photo: IMGS.man1,
    services: [
      { id: 's1', name: 'Reparación de tuberías', price: 50000, duration: '1-2 horas', description: 'Detección y reparación de fugas en tuberías de agua potable y residual.' },
      { id: 's2', name: 'Instalación de grifos', price: 40000, duration: '45 min', description: 'Instalación y cambio de llaves, grifos y mezcladores.' },
      { id: 's3', name: 'Destape de cañerías', price: 35000, duration: '30-60 min', description: 'Limpieza y destape profesional de desagües y sifones.' },
      { id: 's4', name: 'Instalación sanitaria', price: 120000, duration: '3-4 horas', description: 'Instalación completa de sanitarios, lavamanos y duchas.' },
    ],
    reviews: SAMPLE_REVIEWS,
    mapX: 38, mapY: 42,
    badge: 'Top Profesional',
    phone: '+57 310 456 7890',
    email: 'carlos.ramirez@byme.co',
    address: 'Barrio Bolívar, Popayán',
    yearsExp: 10,
    completedJobs: 283,
    responseTime: '< 30 min',
  },
  {
    id: '2',
    name: 'María González',
    specialty: 'Electricista Certificada',
    category: 'electricidad',
    rating: 4.8,
    reviewCount: 62,
    description: 'Ingeniera electricista con certificación RETIE. Especializada en instalaciones eléctricas residenciales y mantenimiento preventivo. Trabajo seguro y con garantía escrita. Certificaciones y permisos al día.',
    shortDescription: 'Instalaciones eléctricas, mantenimiento y certificación RETIE.',
    hourlyRate: 40000,
    distance: '0.8 km',
    available: true,
    photo: IMGS.woman1,
    services: [
      { id: 's5', name: 'Instalación eléctrica', price: 80000, duration: '2-3 horas', description: 'Instalación de circuitos, tomacorrientes e interruptores.' },
      { id: 's6', name: 'Cambio de breakers', price: 45000, duration: '1 hora', description: 'Revisión y cambio de protecciones eléctricas y tablero.' },
      { id: 's7', name: 'Mantenimiento preventivo', price: 60000, duration: '1-2 horas', description: 'Revisión completa del sistema eléctrico del inmueble.' },
      { id: 's8', name: 'Certificación RETIE', price: 150000, duration: '4-6 horas', description: 'Certificación eléctrica reglamentaria para predios.' },
    ],
    reviews: SAMPLE_REVIEWS,
    mapX: 57, mapY: 28,
    badge: 'Verificada',
    phone: '+57 315 234 5678',
    email: 'maria.gonzalez@byme.co',
    address: 'La Esmeralda, Popayán',
    yearsExp: 8,
    completedJobs: 341,
    responseTime: '< 1 hora',
  },
  {
    id: '3',
    name: 'Sofía Muñoz',
    specialty: 'Pintora Profesional',
    category: 'pintura',
    rating: 4.7,
    reviewCount: 35,
    description: 'Pintora con más de 6 años de experiencia en pintura decorativa, estucos y acabados. Uso materiales Corona y Sherwin-Williams de alta calidad. Garantizo acabados perfectos y limpieza total del área de trabajo.',
    shortDescription: 'Pintura interior y exterior, estucos y acabados decorativos.',
    hourlyRate: 30000,
    distance: '2.1 km',
    available: false,
    photo: IMGS.woman2,
    services: [
      { id: 's9', name: 'Pintura de alcoba', price: 180000, duration: '1 día', description: 'Pintura completa de habitación con dos manos de acabado.' },
      { id: 's10', name: 'Pintura exterior', price: 350000, duration: '2-3 días', description: 'Pintura de fachada y exteriores con pintura vinilo.' },
      { id: 's11', name: 'Estuco y pintura', price: 250000, duration: '2 días', description: 'Aplicación de estuco plástico y pintura de acabado.' },
      { id: 's12', name: 'Pintura decorativa', price: 200000, duration: '1-2 días', description: 'Texturas y efectos decorativos especiales.' },
    ],
    reviews: SAMPLE_REVIEWS,
    mapX: 72, mapY: 58,
    phone: '+57 318 789 0123',
    email: 'sofia.munoz@byme.co',
    address: 'Villa del Norte, Popayán',
    yearsExp: 6,
    completedJobs: 198,
    responseTime: '< 2 horas',
  },
  {
    id: '4',
    name: 'Andrés Torres',
    specialty: 'Carpintero Experto',
    category: 'carpinteria',
    rating: 4.6,
    reviewCount: 28,
    description: 'Carpintero artesanal con especialidad en muebles a medida, closets y reparaciones. Trabajo con maderas finas nacionales e importadas. Cada pieza es única y fabricada con atención al detalle.',
    shortDescription: 'Muebles a medida, closets, reparaciones y carpintería general.',
    hourlyRate: 32000,
    distance: '3.4 km',
    available: true,
    photo: IMGS.man2,
    services: [
      { id: 's13', name: 'Muebles a medida', price: 500000, duration: '5-7 días', description: 'Diseño y fabricación de muebles personalizados.' },
      { id: 's14', name: 'Reparación de puertas', price: 60000, duration: '1-2 horas', description: 'Ajuste, reparación y pintura de puertas.' },
      { id: 's15', name: 'Instalación de closets', price: 300000, duration: '1-2 días', description: 'Armado e instalación de closets modulares.' },
    ],
    reviews: SAMPLE_REVIEWS,
    mapX: 24, mapY: 66,
    phone: '+57 312 345 6789',
    email: 'andres.torres@byme.co',
    address: 'La Paz, Popayán',
    yearsExp: 12,
    completedJobs: 156,
    responseTime: '< 3 horas',
  },
  {
    id: '5',
    name: 'Laura Medina',
    specialty: 'Especialista en Limpieza',
    category: 'limpieza',
    rating: 4.9,
    reviewCount: 89,
    description: 'Servicio profesional de limpieza del hogar y oficinas con productos ecológicos certificados y técnicas especializadas. Meticulosa, confiable y con más de 420 trabajos completados exitosamente.',
    shortDescription: 'Limpieza del hogar y oficinas con productos ecológicos certificados.',
    hourlyRate: 25000,
    distance: '0.5 km',
    available: true,
    photo: IMGS.woman1,
    services: [
      { id: 's16', name: 'Limpieza general', price: 100000, duration: '3-4 horas', description: 'Limpieza completa del hogar.' },
      { id: 's17', name: 'Limpieza profunda', price: 180000, duration: '6-8 horas', description: 'Limpieza exhaustiva incluyendo armarios y electrodomésticos.' },
      { id: 's18', name: 'Limpieza de oficinas', price: 120000, duration: '2-3 horas', description: 'Aseo completo de espacios empresariales.' },
    ],
    reviews: SAMPLE_REVIEWS,
    mapX: 46, mapY: 72,
    badge: 'Más Popular',
    phone: '+57 316 890 1234',
    email: 'laura.medina@byme.co',
    address: 'Centro, Popayán',
    yearsExp: 5,
    completedJobs: 421,
    responseTime: '< 30 min',
  },
  {
    id: '6',
    name: 'Roberto Cabrera',
    specialty: 'Cerrajero Profesional',
    category: 'cerrajeria',
    rating: 4.5,
    reviewCount: 41,
    description: 'Cerrajero con 15 años de experiencia. Apertura de puertas de emergencia, instalación de cerraduras de alta seguridad y duplicado de llaves. Servicio disponible 24 horas, 7 días a la semana.',
    shortDescription: 'Apertura de puertas, cerraduras de seguridad, servicio 24/7.',
    hourlyRate: 45000,
    distance: '1.8 km',
    available: true,
    photo: IMGS.man1,
    services: [
      { id: 's19', name: 'Apertura de puerta', price: 60000, duration: '30 min', description: 'Apertura de emergencia sin daños en la puerta.' },
      { id: 's20', name: 'Cambio de cerradura', price: 80000, duration: '45 min', description: 'Instalación de cerraduras de alta seguridad.' },
      { id: 's21', name: 'Duplicado de llaves', price: 15000, duration: '15 min', description: 'Copia de llaves estándar y de seguridad.' },
    ],
    reviews: SAMPLE_REVIEWS,
    mapX: 62, mapY: 38,
    phone: '+57 313 567 8901',
    email: 'roberto.cabrera@byme.co',
    address: 'El Recuerdo, Popayán',
    yearsExp: 15,
    completedJobs: 267,
    responseTime: '< 30 min',
  },
];

export const categories: Category[] = [
  { id: 'plomeria', name: 'Plomería', iconName: 'Droplets', count: 24, color: '#1E40AF', bgColor: '#EFF6FF' },
  { id: 'electricidad', name: 'Electricidad', iconName: 'Zap', count: 31, color: '#D97706', bgColor: '#FFFBEB' },
  { id: 'pintura', name: 'Pintura', iconName: 'Paintbrush2', count: 18, color: '#7C3AED', bgColor: '#F5F3FF' },
  { id: 'carpinteria', name: 'Carpintería', iconName: 'Hammer', count: 15, color: '#92400E', bgColor: '#FEF3C7' },
  { id: 'limpieza', name: 'Limpieza', iconName: 'Sparkles', count: 42, color: '#10B981', bgColor: '#ECFDF5' },
  { id: 'cerrajeria', name: 'Cerrajería', iconName: 'KeyRound', count: 12, color: '#0F766E', bgColor: '#F0FDFA' },
  { id: 'jardineria', name: 'Jardinería', iconName: 'Leaf', count: 9, color: '#15803D', bgColor: '#F0FDF4' },
  { id: 'climatizacion', name: 'Climatización', iconName: 'Wind', count: 7, color: '#0369A1', bgColor: '#F0F9FF' },
  { id: 'mudanzas', name: 'Mudanzas', iconName: 'Truck', count: 11, color: '#9333EA', bgColor: '#FAF5FF' },
  { id: 'fumigacion', name: 'Fumigación', iconName: 'Bug', count: 6, color: '#BE185D', bgColor: '#FDF2F8' },
];

export const userBookings = [
  {
    id: 'b1',
    professionalId: '1',
    professionalName: 'Carlos Ramírez',
    professionalPhoto: IMGS.man1,
    specialty: 'Plomería',
    service: 'Reparación de tuberías',
    date: '28 Feb 2025',
    time: '10:00 AM',
    status: 'confirmed',
    price: 50000,
    address: 'Cra 5 #8-45, Centro',
    reviewed: false,
  },
  {
    id: 'b2',
    professionalId: '2',
    professionalName: 'María González',
    professionalPhoto: IMGS.woman1,
    specialty: 'Electricidad',
    service: 'Mantenimiento preventivo',
    date: '5 Mar 2025',
    time: '2:00 PM',
    status: 'pending',
    price: 60000,
    address: 'Calle 5 #3-20, La Esmeralda',
    reviewed: false,
  },
  {
    id: 'b3',
    professionalId: '5',
    professionalName: 'Laura Medina',
    professionalPhoto: IMGS.woman1,
    specialty: 'Limpieza',
    service: 'Limpieza general',
    date: '15 Ene 2025',
    time: '9:00 AM',
    status: 'completed',
    price: 100000,
    address: 'Cra 5 #8-45, Centro',
    reviewed: false,
  },
  {
    id: 'b4',
    professionalId: '3',
    professionalName: 'Sofía Muñoz',
    professionalPhoto: IMGS.woman2,
    specialty: 'Pintura',
    service: 'Pintura de alcoba',
    date: '3 Ene 2025',
    time: '8:00 AM',
    status: 'completed',
    price: 180000,
    address: 'Cra 5 #8-45, Centro',
    reviewed: true,
  },
];

export const proBookingRequests = [
  {
    id: 'pr1',
    clientName: 'Felipe Arango',
    clientPhoto: IMGS.man2,
    service: 'Reparación de tuberías',
    date: '28 Feb 2025',
    time: '10:00 AM',
    address: 'Cra 5 #8-45, Centro',
    status: 'pending',
    price: 50000,
    notes: 'Hay una fuga en el baño principal, es urgente. Por favor confirmar disponibilidad.',
  },
  {
    id: 'pr2',
    clientName: 'Andrea Ospina',
    clientPhoto: IMGS.woman2,
    service: 'Destape de cañerías',
    date: '1 Mar 2025',
    time: '3:00 PM',
    address: 'Calle 12 #4-50, Los Andes',
    status: 'confirmed',
    price: 35000,
    notes: 'El desagüe de la cocina está tapado desde hace dos días.',
  },
  {
    id: 'pr3',
    clientName: 'Camilo Martínez',
    clientPhoto: IMGS.man1,
    service: 'Instalación sanitaria',
    date: '3 Mar 2025',
    time: '9:00 AM',
    address: 'Carrera 8 #15-30, El Recuerdo',
    status: 'pending',
    price: 120000,
    notes: 'Necesito instalar sanitario y lavamanos nuevos en el baño principal.',
  },
  {
    id: 'pr4',
    clientName: 'Valentina Cruz',
    clientPhoto: IMGS.woman1,
    service: 'Reparación de tuberías',
    date: '5 Mar 2025',
    time: '11:00 AM',
    address: 'Av. Panamericana #45-80',
    status: 'completed',
    price: 50000,
    notes: 'Goteo en tubería debajo del lavaplatos.',
  },
];

export const adminUsers = [
  { id: 'u1', name: 'Felipe Arango', email: 'felipe@email.com', phone: '+57 310 123 4567', joined: '15 Ene 2025', bookings: 5, status: 'active', avatar: IMGS.man2 },
  { id: 'u2', name: 'Andrea Ospina', email: 'andrea@email.com', phone: '+57 315 234 5678', joined: '20 Ene 2025', bookings: 3, status: 'active', avatar: IMGS.woman2 },
  { id: 'u3', name: 'Camilo Martínez', email: 'camilo@email.com', phone: '+57 318 345 6789', joined: '5 Feb 2025', bookings: 1, status: 'active', avatar: IMGS.man1 },
  { id: 'u4', name: 'Valentina Cruz', email: 'valentina@email.com', phone: '+57 312 456 7890', joined: '10 Feb 2025', bookings: 0, status: 'inactive', avatar: IMGS.woman1 },
  { id: 'u5', name: 'Juan Peñaloza', email: 'juan@email.com', phone: '+57 316 567 8901', joined: '18 Feb 2025', bookings: 2, status: 'active', avatar: IMGS.man2 },
  { id: 'u6', name: 'Natalia Bermúdez', email: 'natalia@email.com', phone: '+57 320 678 9012', joined: '22 Feb 2025', bookings: 1, status: 'active', avatar: IMGS.woman2 },
];

export const adminReviews = [
  { id: 'rev1', reviewer: 'Felipe Arango', reviewerPhoto: IMGS.man2, professional: 'Carlos Ramírez', proPhoto: IMGS.man1, rating: 5, comment: 'Excelente trabajo, muy recomendado. Llegó a tiempo y resolvió todo en una hora.', date: '20 Feb 2025', status: 'approved' },
  { id: 'rev2', reviewer: 'Andrea Ospina', reviewerPhoto: IMGS.woman2, professional: 'María González', proPhoto: IMGS.woman1, rating: 1, comment: 'Pésimo servicio, llegó tarde y cobró más de lo acordado. Muy decepcionante.', date: '22 Feb 2025', status: 'pending' },
  { id: 'rev3', reviewer: 'Camilo Martínez', reviewerPhoto: IMGS.man1, professional: 'Laura Medina', proPhoto: IMGS.woman1, rating: 4, comment: 'Buen trabajo, lo recomiendo. La casa quedó impecable.', date: '23 Feb 2025', status: 'approved' },
  { id: 'rev4', reviewer: 'Valentina Cruz', reviewerPhoto: IMGS.woman1, professional: 'Andrés Torres', proPhoto: IMGS.man2, rating: 5, comment: 'Increíble mueble, muy profesional y creativo. El closet quedó mejor de lo esperado.', date: '24 Feb 2025', status: 'pending' },
  { id: 'rev5', reviewer: 'Juan Peñaloza', reviewerPhoto: IMGS.man2, professional: 'Sofía Muñoz', proPhoto: IMGS.woman2, rating: 3, comment: 'El trabajo quedó bien pero tardó más de lo prometido. Precio justo.', date: '25 Feb 2025', status: 'pending' },
];
