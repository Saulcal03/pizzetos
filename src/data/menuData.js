// src/data/menuData.js - Base de datos de productos
export const menuItems = [
  // --- 1. PIZZAS REGULARES (Precios Estandarizados) ---
  {
    id: "hawaiana",
    name: "Hawaiana",
    description: "Jamón y Piña",
    category: "Pizzas",
    image: "/img/hawaina.webp", 
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "hawaiana-especial",
    name: "Hawaiana Especial",
    description: "Jamón, Piña y Cereza",
    category: "Pizzas",
    image: "/img/hawaianaespecial.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "combinada-especial",
    name: "Combinada Especial",
    description: "Champiñón, Cebolla, Pimiento V., Salami, Jamón y Chorizo",
    category: "Pizzas",
    image: "/img/combinadaespecial.webp", // CORREGIDO: En tu log salía 'combinada.webp'
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "pizzeto-especial",
    name: "Pizzeto Especial",
    description: "Champiñón, Cebolla, Pimiento V., Salami, Peperoni y Chorizo",
    category: "Pizzas",
    image: "/img/pizzetaespecial.webp", // CORREGIDO: En tu log salía 'pizzeto.webp'
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "atun-especial",
    name: "Atún Especial",
    description: "Atún, Champiñón, Aguacate y Rajas de Habanero",
    category: "Pizzas",
    image: "/img/atun especial.webp", // CORREGIDO
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    description: "Peperoni y Queso",
    category: "Pizzas",
    image: "/img/peperoni.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "mexicana",
    name: "Mexicana",
    description: "Pierna, Pollo, Jalapeño y Aguacate",
    category: "Pizzas",
    image: "/img/mexicana.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "carnes-frias",
    name: "Carnes Frías",
    description: "Pierna, Salchicha, Peperoni y Tocino",
    category: "Pizzas",
    image: "/img/carnes%20frias.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "azteca",
    name: "Azteca",
    description: "Chorizo, Jalapeño, Frijoles y Aguacate",
    category: "Pizzas",
    image: "/img/azteca.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "mafiosa",
    name: "Mafiosa",
    description: "Champiñón, Jalapeño, Salami y Tocino",
    category: "Pizzas",
    image: "/img/Mafiosa.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "cubana",
    name: "Cubana",
    description: "Pierna, Aguacate, Jalapeño, Jitomate y Atún",
    category: "Pizzas",
    image: "/img/cubana.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "pastor",
    name: "Pastor",
    description: "Carne al Pastor, Cebolla, Piña y Jalapeño o Chipotle",
    category: "Pizzas",
    image: "/img/Pastor.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "vegetariana",
    name: "Vegetariana",
    description: "Champiñón, Cebolla, Pimiento V. y Aceituna Verde",
    category: "Pizzas",
    image: "/img/vegetariana..webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "chistorra",
    name: "Chistorra",
    description: "Chistorra y Champiñón",
    category: "Pizzas",
    image: "/img/chistorra.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "clasica",
    name: "Clásica",
    description: "Champiñón, Peperoni y Pimiento V.",
    category: "Pizzas",
    image: "/img/clasica..webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "campestre",
    name: "Campestre",
    description: "Granos de elote, Jalapeño, Pollo y Chorizo",
    category: "Pizzas",
    image: "/img/campestre.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "costilla-bbq",
    name: "Costilla BBQ",
    description: "Costilla Ahumada, Salsa BBQ o Mango Habanero",
    category: "Pizzas",
    image: "/img/costilla.webp", // CORREGIDO: Usamos la misma de snacks si no tienes otra específica
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "pirata",
    name: "Pirata",
    description: "Atún, Chipotle, Cebolla y Aceitunas Verdes",
    category: "Pizzas",
    image: "/img/pirata..webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "italiana",
    name: "Italiana",
    description: "Carne Molida de Res, Champiñón y Pimiento V.",
    category: "Pizzas",
    image: "/img/italiana.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },
  {
    id: "fugazza",
    name: "Fugazza",
    description: "Palomitas de pollo, Salsa BBQ y Salsa Buffalo",
    category: "Pizzas",
    image: "/img/fugazza.webp",
    prices: { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 },
    type: "personalizable"
  },

  // --- 2. ESPECIALIDADES DEL MAR (Precios Específicos) ---
  {
    id: "camaron",
    name: "Camarón",
    description: "Camarón",
    category: "Especialidades del Mar",
    image: "/img/camaron..webp",
    prices: { "Chica": 200, "Mediana": 280, "Grande": 380, "Familiar": 480 },
    type: "personalizable"
  },
  {
    id: "pizza-del-mar",
    name: "Pizza Del Mar",
    description: "Camarón, mejillón, pulpo, atún, aceitunas y cebolla",
    category: "Especialidades del Mar",
    image: "/img/del mar..webp", // CORREGIDO
    prices: { "Chica": 250, "Mediana": 320, "Grande": 450, "Familiar": 540 },
    type: "personalizable"
  },

  // --- 3. PAQUETES ---
  {
    id: "paquete-1",
    name: "Paquete 1",
    description: "Pizza Hawaiana y Pepperoni (2x1) + 1 Refresco Jarrito",
    price: 295,
    category: "Paquetes",
    image: "/img/paquete1.webp",
    type: "fijo"
  },
  {
    id: "paquete-2",
    name: "Paquete 2",
    description: "1 Pizza grande de especialidad a elegir + 1 Refresco Jarrito + Hamburguesa o Alitas",
    price: 265,
    category: "Paquetes",
    image: "/img/paquete2.webp",
    type: "personalizable"
  },
  {
    id: "paquete-3",
    name: "Paquete 3",
    description: "3 Pizzas grandes de especialidad a elegir + 1 Refresco Jarrito",
    price: 395,
    category: "Paquetes",
    image: "/img/paquete3.webp",
    type: "personalizable"
  },
  {
    id: "promo-magno",
    name: "Promo Magno",
    description: "1 Pizza Familiar (1 o 2 especialidades) + 1 Refresco Jarrito",
    price: 230,
    category: "Paquetes",
    image: "/img/promo%20magno..webp",
    type: "personalizable"
  },
  {
    id: "pizza-rectangular",
    name: "Pizza Rectangular",
    description: "4 especialidades a elegir + 1 Refresco (2Lts)",
    price: 365,
    category: "Paquetes",
    image: "/img/rectangular..webp",
    type: "personalizable"
  },
  {
    id: "pizza-barra",
    name: "Pizza Barra",
    description: "2 especialidades a elegir + 1 Refresco (2Lts)",
    price: 260,
    category: "Paquetes",
    image: "/img/barra.webp", // Necesitas tener barra.webp, si no usa rectangular.webp temporalmente
    type: "personalizable"
  },

  // --- 4. SNACKS ---
  {
    id: "hamburguesa-sencilla",
    name: "Hamburguesa Sencilla",
    description: "Acompañadas de papas y refresco de 355ml",
    price: 80,
    category: "Snacks",
    image: "/img/hamburguesa%20sencilla.webp", // CORREGIDO
    type: "personalizable"
  },
  {
    id: "hamburguesa-doble",
    name: "Hamburguesa Doble",
    description: "Acompañadas de papas y refresco de 355ml",
    price: 95,
    category: "Snacks",
    image: "/img/hamburguesa%20doble.webp", // CORREGIDO
    type: "personalizable"
  },
  {
    id: "costillas-paquete",
    name: "Costillas",
    description: "Acompañadas de papas y refresco de 355ml",
    price: 120,
    category: "Snacks",
    image: "/img/costillabbq.webp",
    type: "personalizable"
  },
  {
    id: "alitas-paquete",
    name: "Alitas",
    description: "Acompañadas de papas y refresco de 355ml",
    price: 95,
    category: "Snacks",
    image: "/img/alitasbbq.webp",
    type: "personalizable"
  },
  {
    id: "papas-francesas",
    name: "Orden de papas a la francesa",
    description: "Crujientes y doradas",
    price: 55,
    category: "Snacks",
    image: "/img/papas..webp",
    type: "fijo"
  },
  {
    id: "spaghetti-jamon",
    name: "Spaguetty Jamón, queso y Tocino",
    description: "Orden para 2 personas",
    price: 95,
    category: "Snacks",
    image: "/img/spaguetty%20jamon,queso%20y%20tocino.webp",
    type: "fijo"
  },
  {
    id: "spaghetti-camaron",
    name: "Spaghetti Camarón",
    description: "Orden para 2 personas",
    price: 180,
    category: "Snacks",
    image: "/img/spaguetty%20camaron.webp",
    type: "fijo"
  },
  {
    id: "refresco-2lts",
    name: "Refresco 2 Lts",
    description: "Sabores: Pepsi, Manzanita, Sangría, 7UP, Mirinda",
    price: 45,
    category: "Bebidas",
    image: "/img/refresco2l.webp",
    type: "personalizable",
    opciones: ["Pepsi", "Manzanita", "Sangría", "7UP", "Mirinda"]
  },
  {
    id: "refresco-600ml",
    name: "Refresco 600ml",
    description: "Sabores: Pepsi, Manzanita, Sangría, 7UP, Mirinda, Jumex Fresh",
    price: 22,
    category: "Bebidas",
    image: "/img/refresco600ml.webp",
    type: "personalizable",
    opciones: ["Pepsi", "Manzanita", "Sangría", "7UP", "Mirinda", "Jumex Fresh"]
  },
  {
    id: "refresco-355ml",
    name: "Refresco 355ml",
    description: "Sabores: Fanta, Sprite, Fresca, Mundet",
    price: 17,
    category: "Bebidas",
    image: "/img/refresco355ml.webp",
    type: "personalizable",
    opciones: ["Fanta", "Sprite", "Fresca", "Mundet"]
  }
];


export const opcionesRefrescos = {
  refrescos_2l: ["Pepsi", "Manzanita", "Sangría", "7UP", "Mirinda"],
  refrescos_600ml: ["Pepsi", "Manzanita", "Sangría", "7UP", "Mirinda", "Jumex Fresh"],
  refrescos_355ml: ["Fanta", "Sprite", "Fresca", "Mundet"]
};