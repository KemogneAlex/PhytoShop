import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Categories
categories = [
    {
        "id": "herbicides",
        "name": "Herbicides",
        "slug": "herbicides",
        "icon": "Leaf",
        "description": "Élimination des mauvaises herbes et adventices"
    },
    {
        "id": "insecticides",
        "name": "Insecticides",
        "slug": "insecticides",
        "icon": "Bug",
        "description": "Protection contre les insectes nuisibles"
    },
    {
        "id": "fongicides",
        "name": "Fongicides",
        "slug": "fongicides",
        "icon": "Shield",
        "description": "Traitement préventif et curatif des maladies fongiques"
    },
    {
        "id": "engrais",
        "name": "Engrais & Amendements",
        "slug": "engrais",
        "icon": "Sprout",
        "description": "Nutrition et fertilisation des cultures"
    },
    {
        "id": "biocontrole",
        "name": "Biocontrôle",
        "slug": "biocontrole",
        "icon": "Flower2",
        "description": "Solutions biologiques et naturelles"
    },
    {
        "id": "semences",
        "name": "Semences",
        "slug": "semences",
        "icon": "Sparkles",
        "description": "Semences certifiées conventionnelles et biologiques"
    },
    {
        "id": "epi",
        "name": "Équipements de Protection (EPI)",
        "slug": "epi",
        "icon": "ShieldCheck",
        "description": "Protection individuelle pour manipulation sécurisée"
    },
    {
        "id": "materiel",
        "name": "Matériel d'Application",
        "slug": "materiel",
        "icon": "Wrench",
        "description": "Pulvérisateurs et équipements d'épandage"
    },
    {
        "id": "regulateurs",
        "name": "Régulateurs & Biostimulants",
        "slug": "regulateurs",
        "icon": "TrendingUp",
        "description": "Régulateurs de croissance et stimulants biologiques"
    },
    {
        "id": "molluscicides",
        "name": "Molluscicides & Rodenticides",
        "slug": "molluscicides",
        "icon": "AlertTriangle",
        "description": "Lutte contre limaces, escargots et rongeurs"
    }
]

# Products
products = [
    # Herbicides
    {
        "id": "prod-001",
        "name": "Glyphos Pro 360",
        "slug": "glyphos-pro-360",
        "category": "herbicides",
        "subcategory": "Grandes cultures",
        "brand": "AgriChem",
        "price": 89.90,
        "amm_number": "AMM-2021-0456",
        "description": "Herbicide systémique non sélectif à base de glyphosate. Action rapide sur adventices annuelles et vivaces.",
        "composition": "Glyphosate 360 g/L",
        "dosage": "3-6 L/ha selon cibles",
        "dangers_ghs": ["GHS05", "GHS09"],
        "images": [
            "https://images.unsplash.com/photo-1557505482-fb5252df1d67",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 150,
        "is_bio": False,
        "is_professional_only": True,
        "featured": True,
        "rating": 4.5,
        "reviews_count": 24
    },
    {
        "id": "prod-002",
        "name": "HerbiSelect Céréales",
        "slug": "herbiselect-cereales",
        "category": "herbicides",
        "subcategory": "Grandes cultures",
        "brand": "CropGuard",
        "price": 125.00,
        "amm_number": "AMM-2022-1123",
        "description": "Herbicide sélectif post-levée pour céréales à paille. Excellent contrôle des dicotylédones.",
        "composition": "Metsulfuron-methyl 20% + Tribenuron-methyl 10%",
        "dosage": "0.4-0.6 kg/ha",
        "dangers_ghs": ["GHS07", "GHS09"],
        "images": [
            "https://images.unsplash.com/photo-1670880255064-c184d0c911d0",
            "https://images.unsplash.com/photo-1557505482-fb5252df1d67"
        ],
        "stock": 200,
        "is_bio": False,
        "is_professional_only": True,
        "featured": True,
        "rating": 4.7,
        "reviews_count": 18
    },
    {
        "id": "prod-003",
        "name": "BioWeed Garden",
        "slug": "bioweed-garden",
        "category": "herbicides",
        "subcategory": "Jardin",
        "brand": "NaturalCare",
        "price": 24.90,
        "amm_number": "AMM-2023-0089",
        "description": "Désherbant biologique à base d'acide pélargonique. Utilisable en agriculture biologique.",
        "composition": "Acide pélargonique 680 g/L",
        "dosage": "100-150 mL pour 5L d'eau",
        "dangers_ghs": ["GHS05"],
        "images": [
            "https://images.unsplash.com/photo-1581578017306-7334b15283df",
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa"
        ],
        "stock": 300,
        "is_bio": True,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.2,
        "reviews_count": 45
    },
    # Insecticides
    {
        "id": "prod-004",
        "name": "Pyretech Ultra",
        "slug": "pyretech-ultra",
        "category": "insecticides",
        "subcategory": "Arboriculture",
        "brand": "InsectShield",
        "price": 165.00,
        "amm_number": "AMM-2021-2345",
        "description": "Insecticide pyréthrinoïde à large spectre. Efficace contre pucerons, chenilles et coléoptères.",
        "composition": "Lambda-cyhalothrine 100 g/L",
        "dosage": "0.15-0.2 L/ha",
        "dangers_ghs": ["GHS06", "GHS09"],
        "images": [
            "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7",
            "https://images.unsplash.com/photo-1664377957561-26c79a899af8"
        ],
        "stock": 80,
        "is_bio": False,
        "is_professional_only": True,
        "featured": True,
        "rating": 4.6,
        "reviews_count": 31
    },
    {
        "id": "prod-005",
        "name": "Aphid Control Pro",
        "slug": "aphid-control-pro",
        "category": "insecticides",
        "subcategory": "Maraîchage",
        "brand": "VegeProtect",
        "price": 78.50,
        "amm_number": "AMM-2022-3456",
        "description": "Insecticide systémique spécifique anti-pucerons. Longue rémanence.",
        "composition": "Imidaclopride 200 g/L",
        "dosage": "0.5-0.75 L/ha",
        "dangers_ghs": ["GHS08", "GHS09"],
        "images": [
            "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7",
            "https://images.unsplash.com/photo-1670880255064-c184d0c911d0"
        ],
        "stock": 120,
        "is_bio": False,
        "is_professional_only": True,
        "featured": False,
        "rating": 4.3,
        "reviews_count": 22
    },
    {
        "id": "prod-006",
        "name": "BioInsect Spray",
        "slug": "bioinsect-spray",
        "category": "insecticides",
        "subcategory": "Jardin",
        "brand": "NaturalCare",
        "price": 19.90,
        "amm_number": "AMM-2023-0234",
        "description": "Insecticide biologique au pyrèthre naturel. Utilisable en agriculture biologique.",
        "composition": "Pyrèthre végétal 4 g/L",
        "dosage": "7.5 mL/L d'eau",
        "dangers_ghs": ["GHS09"],
        "images": [
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa",
            "https://images.unsplash.com/photo-1700412222589-471db05a287b"
        ],
        "stock": 250,
        "is_bio": True,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.4,
        "reviews_count": 67
    },
    # Fongicides
    {
        "id": "prod-007",
        "name": "FungiFree Max",
        "slug": "fungifree-max",
        "category": "fongicides",
        "subcategory": "Viticulture",
        "brand": "VineProtect",
        "price": 195.00,
        "amm_number": "AMM-2021-4567",
        "description": "Fongicide systémique et de contact contre mildiou et oïdium de la vigne.",
        "composition": "Mancozèbe 640 g/kg + Métalaxyl-M 40 g/kg",
        "dosage": "2-2.5 kg/ha",
        "dangers_ghs": ["GHS08", "GHS09"],
        "images": [
            "https://images.unsplash.com/photo-1664377957561-26c79a899af8",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 90,
        "is_bio": False,
        "is_professional_only": True,
        "featured": True,
        "rating": 4.8,
        "reviews_count": 15
    },
    {
        "id": "prod-008",
        "name": "Septoria Bloc",
        "slug": "septoria-bloc",
        "category": "fongicides",
        "subcategory": "Grandes cultures",
        "brand": "CropGuard",
        "price": 145.00,
        "amm_number": "AMM-2022-5678",
        "description": "Fongicide triazole contre septoriose et rouille des céréales.",
        "composition": "Tébuconazole 250 g/L + Prothioconazole 125 g/L",
        "dosage": "0.8-1.0 L/ha",
        "dangers_ghs": ["GHS07", "GHS08"],
        "images": [
            "https://images.unsplash.com/photo-1670880255064-c184d0c911d0",
            "https://images.unsplash.com/photo-1557505482-fb5252df1d67"
        ],
        "stock": 110,
        "is_bio": False,
        "is_professional_only": True,
        "featured": False,
        "rating": 4.5,
        "reviews_count": 19
    },
    {
        "id": "prod-009",
        "name": "Cuivre Bio+",
        "slug": "cuivre-bio-plus",
        "category": "fongicides",
        "subcategory": "Bio",
        "brand": "BioAgri",
        "price": 52.00,
        "amm_number": "AMM-2023-0345",
        "description": "Fongicide cuivrique utilisable en agriculture biologique. Préventif large spectre.",
        "composition": "Oxychlorure de cuivre 500 g/kg",
        "dosage": "3-4 kg/ha",
        "dangers_ghs": ["GHS07", "GHS09"],
        "images": [
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 180,
        "is_bio": True,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.1,
        "reviews_count": 38
    },
    # Engrais
    {
        "id": "prod-010",
        "name": "NPK Pro 15-15-15",
        "slug": "npk-pro-15-15-15",
        "category": "engrais",
        "subcategory": "Grandes cultures",
        "brand": "FertiMax",
        "price": 42.00,
        "amm_number": "AMM-2021-6789",
        "description": "Engrais complexe NPK équilibré. Idéal croissance végétative.",
        "composition": "Azote 15% - Phosphore 15% - Potasse 15%",
        "dosage": "300-400 kg/ha",
        "dangers_ghs": ["GHS07"],
        "images": [
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3",
            "https://images.unsplash.com/photo-1557505482-fb5252df1d67"
        ],
        "stock": 500,
        "is_bio": False,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.6,
        "reviews_count": 89
    },
    {
        "id": "prod-011",
        "name": "Urée Perlée 46%",
        "slug": "uree-perlee-46",
        "category": "engrais",
        "subcategory": "Grandes cultures",
        "brand": "AgroNitro",
        "price": 38.50,
        "amm_number": "AMM-2022-7890",
        "description": "Engrais azoté haute concentration. Apport d'azote rapide.",
        "composition": "Azote total 46%",
        "dosage": "150-200 kg/ha",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1670880255064-c184d0c911d0",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 600,
        "is_bio": False,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.7,
        "reviews_count": 102
    },
    {
        "id": "prod-012",
        "name": "Compost Organique Bio",
        "slug": "compost-organique-bio",
        "category": "engrais",
        "subcategory": "Bio",
        "brand": "TerraVerde",
        "price": 18.90,
        "amm_number": "AMM-2023-0456",
        "description": "Amendement organique 100% naturel. Utilisable en agriculture biologique.",
        "composition": "Matière organique >50%, NPK 3-2-2",
        "dosage": "500-1000 kg/ha",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1581578017306-7334b15283df",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 400,
        "is_bio": True,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.8,
        "reviews_count": 156
    },
    {
        "id": "prod-013",
        "name": "Engrais Tomates & Légumes",
        "slug": "engrais-tomates-legumes",
        "category": "engrais",
        "subcategory": "Jardin",
        "brand": "GardenPro",
        "price": 12.50,
        "amm_number": "AMM-2023-0567",
        "description": "Engrais spécial potager. Riche en potasse pour la fructification.",
        "composition": "NPK 6-8-12 + Mg",
        "dosage": "50 g/m²",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1581578017306-7334b15283df",
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa"
        ],
        "stock": 350,
        "is_bio": False,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.5,
        "reviews_count": 73
    },
    # Biocontrôle
    {
        "id": "prod-014",
        "name": "Bacillus BT Pro",
        "slug": "bacillus-bt-pro",
        "category": "biocontrole",
        "subcategory": "Bio",
        "brand": "BioShield",
        "price": 68.00,
        "amm_number": "AMM-2022-8901",
        "description": "Insecticide biologique à base de Bacillus thuringiensis. Contre chenilles.",
        "composition": "Bacillus thuringiensis kurstaki 32 000 UI/mg",
        "dosage": "0.5-1 kg/ha",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa",
            "https://images.unsplash.com/photo-1700412222589-471db05a287b"
        ],
        "stock": 140,
        "is_bio": True,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.7,
        "reviews_count": 28
    },
    {
        "id": "prod-015",
        "name": "Nématodes Anti-Limaces",
        "slug": "nematodes-anti-limaces",
        "category": "biocontrole",
        "subcategory": "Jardin",
        "brand": "NaturalCare",
        "price": 29.90,
        "amm_number": "AMM-2023-0678",
        "description": "Solution biologique contre limaces et escargots. Utilisable en agriculture biologique.",
        "composition": "Nématodes Phasmarhabditis hermaphrodita",
        "dosage": "50 millions/100 m²",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa",
            "https://images.unsplash.com/photo-1581578017306-7334b15283df"
        ],
        "stock": 100,
        "is_bio": True,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.3,
        "reviews_count": 41
    },
    {
        "id": "prod-016",
        "name": "Soufre Micronisé",
        "slug": "soufre-micronise",
        "category": "biocontrole",
        "subcategory": "Viticulture",
        "brand": "BioAgri",
        "price": 34.00,
        "amm_number": "AMM-2022-9012",
        "description": "Fongicide préventif naturel contre oïdium. Utilisable en agriculture biologique.",
        "composition": "Soufre 800 g/kg",
        "dosage": "5-8 kg/ha",
        "dangers_ghs": ["GHS07"],
        "images": [
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3",
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa"
        ],
        "stock": 220,
        "is_bio": True,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.4,
        "reviews_count": 34
    },
    {
        "id": "prod-017",
        "name": "Pièges Phéromones Carpocapse",
        "slug": "pieges-pheromones-carpocapse",
        "category": "biocontrole",
        "subcategory": "Arboriculture",
        "brand": "TrapControl",
        "price": 45.00,
        "amm_number": "AMM-2023-0789",
        "description": "Kit de confusion sexuelle contre carpocapse des pommes et poires.",
        "composition": "Phéromones synthétiques Cydia pomonella",
        "dosage": "500 diffuseurs/ha",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa",
            "https://images.unsplash.com/photo-1664377957561-26c79a899af8"
        ],
        "stock": 75,
        "is_bio": True,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.6,
        "reviews_count": 17
    },
    {
        "id": "prod-018",
        "name": "Auxiliaires Coccinelles",
        "slug": "auxiliaires-coccinelles",
        "category": "biocontrole",
        "subcategory": "Jardin",
        "brand": "InsectFriend",
        "price": 22.50,
        "amm_number": "AMM-2023-0890",
        "description": "Larves de coccinelles contre pucerons. Lutte biologique naturelle.",
        "composition": "Adalia bipunctata (larves)",
        "dosage": "50-100 larves/10 m²",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa",
            "https://images.unsplash.com/photo-1700412222589-471db05a287b"
        ],
        "stock": 60,
        "is_bio": True,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.9,
        "reviews_count": 92
    },
    {
        "id": "prod-019",
        "name": "Huile Blanche Insecticide",
        "slug": "huile-blanche-insecticide",
        "category": "biocontrole",
        "subcategory": "Arboriculture",
        "brand": "NaturalCare",
        "price": 32.00,
        "amm_number": "AMM-2022-9123",
        "description": "Huile minérale paraffinique contre cochenilles et acariens. Bio compatible.",
        "composition": "Huile paraffinique 830 g/L",
        "dosage": "1.5-2 L/hL d'eau",
        "dangers_ghs": ["GHS07"],
        "images": [
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3",
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa"
        ],
        "stock": 190,
        "is_bio": True,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.2,
        "reviews_count": 26
    },
    {
        "id": "prod-020",
        "name": "Argile Kaolinite Protectrice",
        "slug": "argile-kaolinite-protectrice",
        "category": "biocontrole",
        "subcategory": "Arboriculture",
        "brand": "ClayProtect",
        "price": 56.00,
        "amm_number": "AMM-2023-0901",
        "description": "Argile blanche protectrice contre mouche de l'olive et stress thermique.",
        "composition": "Kaolinite 950 g/kg",
        "dosage": "30-50 kg/ha",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1664377957561-26c79a899af8",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 85,
        "is_bio": True,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.5,
        "reviews_count": 19
    },
    # Semences
    {
        "id": "prod-021",
        "name": "Semences Blé Tendre Hybride",
        "slug": "semences-ble-tendre",
        "category": "semences",
        "subcategory": "Céréales",
        "brand": "SeedTech",
        "price": 85.00,
        "amm_number": "CERT-SEM-2024-001",
        "description": "Semences certifiées de blé tendre hybride. Rendement optimisé et résistance aux maladies.",
        "composition": "Triticum aestivum - Variété certifiée",
        "dosage": "180-200 kg/ha",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
        ],
        "stock": 500,
        "is_bio": False,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.8,
        "reviews_count": 45
    },
    {
        "id": "prod-022",
        "name": "Semences Maïs Grain Bio",
        "slug": "semences-mais-grain-bio",
        "category": "semences",
        "subcategory": "Céréales",
        "brand": "BioSeed",
        "price": 120.00,
        "amm_number": "CERT-SEM-BIO-2024-045",
        "description": "Semences de maïs grain certifiées agriculture biologique. Excellente vigueur.",
        "composition": "Zea mays - Variété bio certifiée",
        "dosage": "25-30 kg/ha",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
            "https://images.unsplash.com/photo-1574943320219-553eb213f72d"
        ],
        "stock": 300,
        "is_bio": True,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.7,
        "reviews_count": 38
    },
    # EPI - Équipements de Protection
    {
        "id": "prod-023",
        "name": "Combinaison Phyto Jetable Type 5/6",
        "slug": "combinaison-phyto-jetable",
        "category": "epi",
        "subcategory": "Vêtements",
        "brand": "SafetyPro",
        "price": 12.50,
        "amm_number": "CE-EPI-2024-789",
        "description": "Combinaison de protection jetable pour manipulation de produits phytosanitaires. Norme EN 13034.",
        "composition": "Polypropylène laminé imperméable",
        "dosage": "Taille: S, M, L, XL, XXL disponibles",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1582719471384-894fbb16e074",
            "https://images.unsplash.com/photo-1584467541268-b040f83be3fd"
        ],
        "stock": 250,
        "is_bio": False,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.6,
        "reviews_count": 89
    },
    {
        "id": "prod-024",
        "name": "Gants Nitrile Phytosanitaires",
        "slug": "gants-nitrile-phyto",
        "category": "epi",
        "subcategory": "Mains",
        "brand": "ProTech",
        "price": 8.90,
        "amm_number": "CE-EPI-2024-456",
        "description": "Gants nitrile résistants aux produits chimiques. Norme EN 374. Lot de 10 paires.",
        "composition": "Nitrile 100%, épaisseur 0.4mm",
        "dosage": "Tailles disponibles: 7, 8, 9, 10",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1584467541268-b040f83be3fd",
            "https://images.unsplash.com/photo-1582719471384-894fbb16e074"
        ],
        "stock": 400,
        "is_bio": False,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.8,
        "reviews_count": 156
    },
    {
        "id": "prod-025",
        "name": "Masque Respiratoire A2P3",
        "slug": "masque-respiratoire-a2p3",
        "category": "epi",
        "subcategory": "Protection respiratoire",
        "brand": "RespirSafe",
        "price": 45.00,
        "amm_number": "CE-EPI-2024-123",
        "description": "Masque demi-visage avec filtres A2P3 pour vapeurs et particules. Réutilisable.",
        "composition": "Silicone médical + filtres remplaçables",
        "dosage": "Filtres à remplacer toutes les 40h d'utilisation",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1584467541268-b040f83be3fd",
            "https://images.unsplash.com/photo-1603481546534-19e6d1fc49e2"
        ],
        "stock": 120,
        "is_bio": False,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.9,
        "reviews_count": 67
    },
    {
        "id": "prod-026",
        "name": "Bottes Agriculture Nitrile",
        "slug": "bottes-agriculture-nitrile",
        "category": "epi",
        "subcategory": "Pieds",
        "brand": "AgriBoot",
        "price": 35.00,
        "amm_number": "CE-EPI-2024-890",
        "description": "Bottes en nitrile résistantes aux produits chimiques. Semelle anti-dérapante.",
        "composition": "Nitrile vulcanisé, doublure textile",
        "dosage": "Pointures: 39 à 47",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1608256246200-53e635b5b65f",
            "https://images.unsplash.com/photo-1582719471384-894fbb16e074"
        ],
        "stock": 180,
        "is_bio": False,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.5,
        "reviews_count": 94
    },
    # Matériel d'Application
    {
        "id": "prod-027",
        "name": "Pulvérisateur à Dos 16L Pro",
        "slug": "pulverisateur-dos-16l",
        "category": "materiel",
        "subcategory": "Pulvérisateurs",
        "brand": "SprayTech",
        "price": 89.00,
        "amm_number": "EQUIP-2024-567",
        "description": "Pulvérisateur professionnel 16L à pression entretenue. Pompe laiton, cuve polyéthylène.",
        "composition": "Cuve PE-HD 16L + lance inox",
        "dosage": "Pression max: 4 bars, débit: 1-2 L/min",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1581578017306-7334b15283df",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 75,
        "is_bio": False,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.7,
        "reviews_count": 52
    },
    {
        "id": "prod-028",
        "name": "Buses Anti-Dérive Céramique",
        "slug": "buses-anti-derive",
        "category": "materiel",
        "subcategory": "Accessoires",
        "brand": "PrecisionSpray",
        "price": 24.50,
        "amm_number": "EQUIP-2024-789",
        "description": "Lot 5 buses céramique anti-dérive. Réduction 90% dérive, homologuées ZNT.",
        "composition": "Céramique haute résistance",
        "dosage": "Débit 1.2 L/min à 3 bars",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3",
            "https://images.unsplash.com/photo-1581578017306-7334b15283df"
        ],
        "stock": 200,
        "is_bio": False,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.6,
        "reviews_count": 31
    },
    # Régulateurs & Biostimulants
    {
        "id": "prod-029",
        "name": "Biostimulant Algues Marines",
        "slug": "biostimulant-algues",
        "category": "regulateurs",
        "subcategory": "Biostimulants",
        "brand": "OceanGrow",
        "price": 38.00,
        "amm_number": "STIM-BIO-2024-345",
        "description": "Biostimulant à base d'extraits d'algues marines. Renforce la résistance au stress.",
        "composition": "Ascophyllum nodosum 25% + oligo-éléments",
        "dosage": "2-3 L/ha en pulvérisation foliaire",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3",
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa"
        ],
        "stock": 140,
        "is_bio": True,
        "is_professional_only": False,
        "featured": True,
        "rating": 4.7,
        "reviews_count": 48
    },
    {
        "id": "prod-030",
        "name": "Régulateur Croissance Céréales",
        "slug": "regulateur-croissance-cereales",
        "category": "regulateurs",
        "subcategory": "Régulateurs",
        "brand": "CropControl",
        "price": 65.00,
        "amm_number": "AMM-2023-8901",
        "description": "Régulateur de croissance pour céréales. Limite la verse, améliore la tenue.",
        "composition": "Chlorméquat 460 g/L + Mépiquat 305 g/L",
        "dosage": "1-1.5 L/ha stade épi 1cm",
        "dangers_ghs": ["GHS07"],
        "images": [
            "https://images.unsplash.com/photo-1557505482-fb5252df1d67",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 95,
        "is_bio": False,
        "is_professional_only": True,
        "featured": False,
        "rating": 4.4,
        "reviews_count": 29
    },
    # Molluscicides & Rodenticides
    {
        "id": "prod-031",
        "name": "Anti-Limaces Phosphate Ferrique Bio",
        "slug": "anti-limaces-bio",
        "category": "molluscicides",
        "subcategory": "Molluscicides",
        "brand": "SlugStop",
        "price": 18.90,
        "amm_number": "AMM-2024-1234",
        "description": "Granulés anti-limaces au phosphate ferrique. Utilisable en agriculture biologique.",
        "composition": "Phosphate ferrique 30 g/kg",
        "dosage": "5-7 kg/ha, épandage au sol",
        "dangers_ghs": [],
        "images": [
            "https://images.unsplash.com/photo-1680033352144-6122ab7494fa",
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
        ],
        "stock": 220,
        "is_bio": True,
        "is_professional_only": False,
        "featured": False,
        "rating": 4.5,
        "reviews_count": 78
    },
    {
        "id": "prod-032",
        "name": "Rodenticide Blocs Extérieurs",
        "slug": "rodenticide-blocs",
        "category": "molluscicides",
        "subcategory": "Rodenticides",
        "brand": "RodentControl",
        "price": 32.00,
        "amm_number": "AMM-2023-5678",
        "description": "Blocs rodenticides pour usage extérieur. Efficace rats et souris. Réservé professionnels.",
        "composition": "Bromadiolone 0.005%",
        "dosage": "1-2 blocs par poste d'appâtage",
        "dangers_ghs": ["GHS06", "GHS08"],
        "images": [
            "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3",
            "https://images.unsplash.com/photo-1581578017306-7334b15283df"
        ],
        "stock": 150,
        "is_bio": False,
        "is_professional_only": True,
        "featured": False,
        "rating": 4.3,
        "reviews_count": 41
    }
]

async def seed_database():
    print("Seeding database...")
    
    # Clear existing data
    await db.categories.delete_many({})
    await db.products.delete_many({})
    
    # Insert categories
    await db.categories.insert_many(categories)
    print(f"Inserted {len(categories)} categories")
    
    # Insert products
    await db.products.insert_many(products)
    print(f"Inserted {len(products)} products")
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
