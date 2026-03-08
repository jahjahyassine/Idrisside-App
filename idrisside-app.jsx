/**
 * Application interactive : Parcours historique des Idrissides
 * Fondateurs de l'État idrisside au Maroc (786-828)
 * 
 * Technologies utilisées :
 * - React (interface utilisateur)
 * - React-Leaflet (carte interactive)
 * - CSS-in-JS via objets de style inline
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// =============================================================
// DONNÉES HISTORIQUES (équivalent d'un fichier JSON externe)
// Chaque événement possède : id, lieu, année, lat, lng, texte,
// personnage (Idris I ou Idris II), type d'événement
// =============================================================
const EVENEMENTS_HISTORIQUES = [
  {
    id: 1,
    lieu: "Fakhkh (près de La Mecque)",
    annee: 786,
    lat: 21.4,
    lng: 39.8,
    personnage: "Idris I",
    type: "fuite",
    couleur: "#C0392B",
    titre: "Bataille de Fakhkh",
    texte:
      "En 786, la bataille de Fakhkh marque la défaite des Alides face aux Abbassides. Idris ibn Abdallah, descendant direct du Prophète, est contraint de fuir après que son cousin et ses partisans ont été massacrés. Il entame alors un long voyage vers l'ouest pour échapper aux persécutions.",
  },
  {
    id: 2,
    lieu: "Médine → Égypte",
    annee: 787,
    lat: 27.0,
    lng: 30.0,
    personnage: "Idris I",
    type: "voyage",
    couleur: "#E67E22",
    titre: "Traversée de l'Égypte",
    texte:
      "Après sa fuite d'Arabie, Idris Ier traverse l'Égypte avec discrétion, aidé par des fidèles. Il évite les agents abbassides lancés à sa poursuite et poursuit son chemin vers le Maghreb, guidé par sa foi et sa détermination à construire un refuge pour les Alides.",
  },
  {
    id: 3,
    lieu: "Tripolitaine (Libye)",
    annee: 787,
    lat: 32.9,
    lng: 13.2,
    personnage: "Idris I",
    type: "voyage",
    couleur: "#E67E22",
    titre: "Passage par la Tripolitaine",
    texte:
      "En traversant la Tripolitaine (actuelle Libye), Idris Ier gagne progressivement la confiance des tribus amazighes locales. Son statut de Chérif — descendant du Prophète — lui confère une légitimité religieuse précieuse qui facilite son accueil partout où il passe.",
  },
  {
    id: 4,
    lieu: "Tlemcen (Algérie)",
    annee: 787,
    lat: 34.88,
    lng: -1.32,
    personnage: "Idris I",
    type: "voyage",
    couleur: "#E67E22",
    titre: "Étape à Tlemcen",
    texte:
      "Idris Ier fait halte à Tlemcen, important carrefour commercial et culturel du Maghreb central. Il y rencontre des notables amazighes qui reconnaissent en lui un chef potentiel. Cette étape consolide son réseau d'alliances avant son arrivée au Maroc.",
  },
  {
    id: 5,
    lieu: "Volubilis (Walili), Maroc",
    annee: 788,
    lat: 34.07,
    lng: -5.55,
    personnage: "Idris I",
    type: "fondation",
    couleur: "#27AE60",
    titre: "Accueil par les Awraba",
    texte:
      "En 788, Idris Ier arrive à Volubilis (Walili), ancienne cité romaine au nord du Maroc. La tribu amazighe des Awraba, sous l'autorité d'Ishaq ibn Muhammad, le reconnaît comme imam et chef légitime. Cet accueil est le point de départ de la fondation de l'État idrisside.",
  },
  {
    id: 6,
    lieu: "Walili / Moulay Idriss Zerhoun",
    annee: 788,
    lat: 34.06,
    lng: -5.53,
    personnage: "Idris I",
    type: "fondation",
    couleur: "#1A8B3C",
    titre: "Fondation de l'État idrisside",
    texte:
      "En 788, Idris Ier est officiellement proclamé imam et prince par les tribus amazighes. Il fonde ainsi le premier État arabo-amazighe du Maghreb al-Aqsa, indépendant du califat abbasside. Son règne instaure une administration islamisée et unifie progressivement les tribus de la région.",
  },
  {
    id: 7,
    lieu: "Région de Taza",
    annee: 789,
    lat: 34.21,
    lng: -4.01,
    personnage: "Idris I",
    type: "expansion",
    couleur: "#2980B9",
    titre: "Expansion vers l'Est",
    texte:
      "Après sa proclamation, Idris Ier entreprend l'unification des tribus de la région. Il étend son autorité vers l'est, notamment dans la région de Taza, corridor stratégique entre le Maroc et l'Algérie. Cette expansion consolide les frontières du nouvel État idrisside.",
  },
  {
    id: 8,
    lieu: "Moulay Idriss Zerhoun",
    annee: 791,
    lat: 34.06,
    lng: -5.53,
    personnage: "Idris I",
    type: "mort",
    couleur: "#8E44AD",
    titre: "Assassinat d'Idris Ier",
    texte:
      "En 791, le calife abbasside Haroun al-Rachid envoie un émissaire qui empoisonne Idris Ier. Sa mort prématurée est un coup dur pour le jeune État, mais son œuvre se poursuivra grâce à son fils Idris II, né peu après sa disparition de son épouse amazighe Kenza al-Awrabiya.",
  },
  {
    id: 9,
    lieu: "Walili (Volubilis)",
    annee: 793,
    lat: 34.07,
    lng: -5.55,
    personnage: "Idris II",
    type: "naissance",
    couleur: "#16A085",
    titre: "Naissance et tutelle d'Idris II",
    texte:
      "Idris II naît en 791 à titre posthume. Élevé sous la tutelle du fidèle ministre Rachid al-Khatim, il grandit à Volubilis dans la tradition de son père. En 793, âgé seulement de 11 ans, il est reconnu comme imam légitime par les tribus alliées, assurant la continuité dynastique.",
  },
  {
    id: 10,
    lieu: "Fès — Rive des Andalous",
    annee: 808,
    lat: 34.065,
    lng: -5.005,
    personnage: "Idris II",
    type: "fondation",
    couleur: "#D4A017",
    titre: "Fondation de Fès — Rive des Andalous",
    texte:
      "En 808, Idris II fonde une nouvelle cité sur les rives de l'oued Fès. Il accueille d'abord des familles arabes expulsées d'Andalousie (Cordoue), qui s'installent sur la rive gauche. Ce quartier devient le 'Adwat al-Andalus', donnant naissance à la ville de Fès.",
  },
  {
    id: 11,
    lieu: "Fès — Rive des Kairouanais",
    annee: 818,
    lat: 34.063,
    lng: -5.01,
    personnage: "Idris II",
    type: "fondation",
    couleur: "#C9A227",
    titre: "Arrivée des Kairouanais à Fès",
    texte:
      "En 818, Idris II accueille des milliers de familles venues de Kairouan (Tunisie), qui s'installent sur la rive droite de l'oued Fès. Les deux communautés développent chacune leur quartier, transformant Fès en métropole cosmopolite et centre intellectuel rayonnant de tout le Maghreb.",
  },
  {
    id: 12,
    lieu: "Fès — Université al-Qarawiyyin",
    annee: 820,
    lat: 34.064,
    lng: -5.008,
    personnage: "Idris II",
    type: "culture",
    couleur: "#C0392B",
    titre: "Fès, capitale de l'État idrisside",
    texte:
      "Sous Idris II, Fès devient la véritable capitale politique et culturelle de l'État idrisside. La ville connaît un essor remarquable : artisanat, commerce, enseignement coranique. Les bases de ce qui deviendra la mosquée al-Qarawiyyin — future université — y sont posées durant cette période.",
  },
  {
    id: 13,
    lieu: "Tanger",
    annee: 810,
    lat: 35.76,
    lng: -5.8,
    personnage: "Idris II",
    type: "expansion",
    couleur: "#2980B9",
    titre: "Contrôle de Tanger",
    texte:
      "Idris II étend son autorité jusqu'à Tanger, port stratégique sur le détroit de Gibraltar. Le contrôle de cette ville renforce la puissance commerciale et militaire de l'État idrisside et lui permet de surveiller les échanges entre l'Afrique du Nord et la péninsule ibérique.",
  },
  {
    id: 14,
    lieu: "Sijilmassa (Tafilalt)",
    annee: 812,
    lat: 31.7,
    lng: -4.0,
    personnage: "Idris II",
    type: "expansion",
    couleur: "#2471A3",
    titre: "Expansion vers le Sud",
    texte:
      "L'État idrisside étend progressivement son influence vers le sud jusqu'à la région du Tafilalt (Sijilmassa). Cette expansion permet le contrôle des routes caravanières trans-sahariennes, source importante de revenus en or et en sel, renforçant ainsi la puissance économique de la dynastie.",
  },
  {
    id: 15,
    lieu: "Fès",
    annee: 828,
    lat: 34.065,
    lng: -5.005,
    personnage: "Idris II",
    type: "mort",
    couleur: "#8E44AD",
    titre: "Mort d'Idris II et division de l'État",
    texte:
      "À la mort d'Idris II en 828, l'État idrisside est divisé entre ses nombreux fils, selon la tradition arabe. Cette fragmentation affaiblit progressivement la dynastie, rendant le Maroc vulnérable aux ambitions des Fatimides et des Omeyyades d'Espagne, conduisant au déclin final des Idrissides.",
  },
];

// =============================================================
// ICÔNES PERSONNALISÉES POUR LES MARQUEURS
// =============================================================
const creerIconeMarqueur = (couleur, taille = 36) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${taille}" height="${taille}" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="${couleur}" opacity="0.95" stroke="white" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="6" fill="white" opacity="0.9"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [taille, taille],
    iconAnchor: [taille / 2, taille / 2],
    popupAnchor: [0, -(taille / 2)],
  });
};

// =============================================================
// COMPOSANT : Animateur de carte (déplace la vue vers un point)
// =============================================================
function AnimateurCarte({ centre, zoom }) {
  const carte = useMap();
  useEffect(() => {
    if (centre) {
      carte.flyTo(centre, zoom, { duration: 1.5 });
    }
  }, [centre, zoom, carte]);
  return null;
}

// =============================================================
// COMPOSANT PRINCIPAL : Application historique Idrissides
// =============================================================
export default function AppIdrissides() {
  // --- États de l'application ---
  const [evenementActif, setEvenementActif] = useState(null);
  const [modeAnimation, setModeAnimation] = useState(false);
  const [etapeAnimation, setEtapeAnimation] = useState(0);
  const [filtreAnnee, setFiltreAnnee] = useState([786, 828]);
  const [filtrePersonnage, setFiltrePersonnage] = useState("tous");
  const [centreCarte, setCentreCarte] = useState([28.0, 0.0]);
  const [zoomCarte, setZoomCarte] = useState(4);
  const intervalRef = useRef(null);

  // Trier les événements par année
  const evenementsTries = [...EVENEMENTS_HISTORIQUES].sort((a, b) => a.annee - b.annee);

  // Filtrer les événements selon les critères actifs
  const evenementsFiltres = evenementsTries.filter(
    (e) =>
      e.annee >= filtreAnnee[0] &&
      e.annee <= filtreAnnee[1] &&
      (filtrePersonnage === "tous" || e.personnage === filtrePersonnage)
  );

  // Coordonnées pour tracer les lignes de parcours
  const lignesIdris1 = evenementsTries
    .filter((e) => e.personnage === "Idris I")
    .map((e) => [e.lat, e.lng]);

  const lignesIdris2 = evenementsTries
    .filter((e) => e.personnage === "Idris II")
    .map((e) => [e.lat, e.lng]);

  // --- Gestion de l'animation pas à pas ---
  const demarrerAnimation = useCallback(() => {
    setModeAnimation(true);
    setEtapeAnimation(0);
    setFiltrePersonnage("tous");
  }, []);

  const arreterAnimation = useCallback(() => {
    setModeAnimation(false);
    clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (modeAnimation) {
      intervalRef.current = setInterval(() => {
        setEtapeAnimation((prev) => {
          if (prev >= evenementsTries.length - 1) {
            clearInterval(intervalRef.current);
            setModeAnimation(false);
            return prev;
          }
          const prochainEvenement = evenementsTries[prev + 1];
          setCentreCarte([prochainEvenement.lat, prochainEvenement.lng]);
          setZoomCarte(6);
          setEvenementActif(prochainEvenement);
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(intervalRef.current);
  }, [modeAnimation, evenementsTries]);

  // --- Couleurs de personnages ---
  const couleurPersonnage = {
    "Idris I": "#C0392B",
    "Idris II": "#1A6B9A",
  };

  // --- Styles ---
  const styles = {
    app: {
      fontFamily: "'Crimson Text', 'Georgia', serif",
      background: "linear-gradient(135deg, #F5F0E8 0%, #EDE0C4 50%, #E8D5A3 100%)",
      minHeight: "100vh",
      color: "#2C1810",
    },
    header: {
      background: "linear-gradient(135deg, #1A2744 0%, #0D1B35 100%)",
      color: "#F5F0E8",
      padding: "24px 32px",
      borderBottom: "3px solid #C9A227",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    },
    headerTitre: {
      fontSize: "clamp(20px, 3vw, 32px)",
      fontWeight: "700",
      margin: "0 0 6px",
      letterSpacing: "0.02em",
      color: "#F5E6C8",
    },
    headerSousTitre: {
      fontSize: "clamp(13px, 1.5vw, 16px)",
      color: "#C9A227",
      margin: 0,
      fontStyle: "italic",
      letterSpacing: "0.05em",
    },
    layout: {
      display: "grid",
      gridTemplateColumns: "minmax(280px, 340px) 1fr",
      gridTemplateRows: "1fr",
      height: "calc(100vh - 100px)",
      gap: 0,
    },
    panneau: {
      background: "rgba(245, 240, 232, 0.97)",
      borderRight: "2px solid #C9A227",
      overflowY: "auto",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    section: {
      background: "white",
      borderRadius: "8px",
      padding: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      border: "1px solid #E8D5A3",
    },
    sectionTitre: {
      fontSize: "11px",
      fontFamily: "'Georgia', serif",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: "#8B6914",
      marginBottom: "10px",
      fontWeight: "700",
      borderBottom: "1px solid #E8D5A3",
      paddingBottom: "6px",
    },
    btnPrimaire: {
      background: "linear-gradient(135deg, #1A2744, #2C3E6B)",
      color: "#F5E6C8",
      border: "none",
      borderRadius: "6px",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "14px",
      fontFamily: "inherit",
      fontWeight: "600",
      width: "100%",
      transition: "all 0.2s",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      letterSpacing: "0.02em",
    },
    btnDanger: {
      background: "linear-gradient(135deg, #7B241C, #C0392B)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "14px",
      fontFamily: "inherit",
      fontWeight: "600",
      width: "100%",
      transition: "all 0.2s",
    },
    evenementItem: (actif, couleur) => ({
      padding: "10px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      border: `2px solid ${actif ? couleur : "transparent"}`,
      background: actif ? `${couleur}15` : "transparent",
      transition: "all 0.2s",
      marginBottom: "4px",
    }),
    evenementAnnee: (couleur) => ({
      fontSize: "11px",
      fontWeight: "700",
      color: couleur,
      fontFamily: "monospace",
      letterSpacing: "0.05em",
    }),
    evenementLieu: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#2C1810",
      lineHeight: 1.3,
    },
    badge: (couleur) => ({
      display: "inline-block",
      fontSize: "10px",
      padding: "2px 7px",
      borderRadius: "10px",
      background: `${couleur}20`,
      color: couleur,
      fontWeight: "700",
      border: `1px solid ${couleur}40`,
      marginTop: "2px",
    }),
    carteContainer: {
      flex: 1,
      position: "relative",
    },
    popupDetail: {
      position: "absolute",
      bottom: "20px",
      right: "20px",
      background: "rgba(26, 39, 68, 0.97)",
      color: "#F5E6C8",
      padding: "20px 22px",
      borderRadius: "10px",
      maxWidth: "340px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      border: "2px solid #C9A227",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
    },
    popupTitre: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#C9A227",
      margin: "0 0 4px",
      lineHeight: 1.3,
    },
    popupMeta: {
      fontSize: "12px",
      color: "#A89060",
      marginBottom: "10px",
      fontStyle: "italic",
    },
    popupTexte: {
      fontSize: "13px",
      lineHeight: "1.65",
      color: "#E8D5A3",
    },
    fermerBtn: {
      position: "absolute",
      top: "10px",
      right: "12px",
      background: "none",
      border: "none",
      color: "#C9A227",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      lineHeight: 1,
    },
    legende: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    legendeItem: (couleur) => ({
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      color: "#2C1810",
    }),
    legendePoint: (couleur) => ({
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: couleur,
      border: "2px solid white",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    }),
    progressBar: {
      height: "4px",
      background: "#E8D5A3",
      borderRadius: "2px",
      overflow: "hidden",
      marginTop: "8px",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #C0392B, #C9A227)",
      borderRadius: "2px",
      transition: "width 0.5s ease",
      width: `${((etapeAnimation + 1) / evenementsTries.length) * 100}%`,
    },
    select: {
      width: "100%",
      padding: "8px 10px",
      borderRadius: "6px",
      border: "1px solid #C9A227",
      background: "white",
      fontSize: "13px",
      fontFamily: "inherit",
      color: "#2C1810",
      cursor: "pointer",
    },
    rangeContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    rangeLabels: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "12px",
      color: "#8B6914",
      fontWeight: "600",
    },
  };

  // Types d'événements avec leurs libellés
  const typeLabels = {
    fuite: "Fuite",
    voyage: "Voyage",
    fondation: "Fondation",
    expansion: "Expansion",
    mort: "Décès",
    naissance: "Naissance/Règne",
    culture: "Culture",
  };

  return (
    <div style={styles.app}>
      {/* En-tête */}
      <header style={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={styles.headerTitre}>⚜ Les Idrissides — Fondateurs du Maroc</h1>
            <p style={styles.headerSousTitre}>
              Parcours historique interactif d'Idris Ier et Idris II · 786 – 828
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["Idris I", "Idris II"].map((p) => (
              <div
                key={p}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: `${couleurPersonnage[p]}25`,
                  border: `2px solid ${couleurPersonnage[p]}`,
                  color: "#F5E6C8",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Corps principal */}
      <div style={styles.layout}>
        {/* Panneau latéral gauche */}
        <aside style={styles.panneau}>
          {/* Section : Animation */}
          <div style={styles.section}>
            <div style={styles.sectionTitre}>🎬 Parcours animé</div>
            {!modeAnimation ? (
              <button style={styles.btnPrimaire} onClick={demarrerAnimation}>
                ▶ Lancer l'animation
              </button>
            ) : (
              <>
                <button style={styles.btnDanger} onClick={arreterAnimation}>
                  ⏹ Arrêter l'animation
                </button>
                <div style={styles.progressBar}>
                  <div style={styles.progressFill} />
                </div>
                <div style={{ fontSize: "11px", color: "#8B6914", marginTop: "4px", textAlign: "center" }}>
                  Étape {etapeAnimation + 1} / {evenementsTries.length}
                </div>
              </>
            )}
          </div>

          {/* Section : Filtres */}
          <div style={styles.section}>
            <div style={styles.sectionTitre}>🔍 Filtres</div>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "12px", color: "#8B6914", marginBottom: "5px", fontWeight: "600" }}>
                Personnage
              </div>
              <select
                style={styles.select}
                value={filtrePersonnage}
                onChange={(e) => setFiltrePersonnage(e.target.value)}
              >
                <option value="tous">Tous les personnages</option>
                <option value="Idris I">Idris Ier uniquement</option>
                <option value="Idris II">Idris II uniquement</option>
              </select>
            </div>
            <div style={styles.rangeContainer}>
              <div style={{ fontSize: "12px", color: "#8B6914", fontWeight: "600" }}>
                Période : {filtreAnnee[0]} – {filtreAnnee[1]}
              </div>
              <input
                type="range"
                min={786}
                max={828}
                value={filtreAnnee[0]}
                onChange={(e) => setFiltreAnnee([+e.target.value, filtreAnnee[1]])}
                style={{ width: "100%", accentColor: "#C0392B" }}
              />
              <input
                type="range"
                min={786}
                max={828}
                value={filtreAnnee[1]}
                onChange={(e) => setFiltreAnnee([filtreAnnee[0], +e.target.value])}
                style={{ width: "100%", accentColor: "#1A6B9A" }}
              />
              <div style={styles.rangeLabels}>
                <span>786</span>
                <span>807</span>
                <span>828</span>
              </div>
            </div>
          </div>

          {/* Section : Légende */}
          <div style={styles.section}>
            <div style={styles.sectionTitre}>📍 Légende</div>
            <div style={styles.legende}>
              {Object.entries({
                fuite: "#C0392B",
                fondation: "#27AE60",
                expansion: "#2980B9",
                voyage: "#E67E22",
                mort: "#8E44AD",
                culture: "#D4A017",
              }).map(([type, couleur]) => (
                <div key={type} style={styles.legendeItem(couleur)}>
                  <div style={styles.legendePoint(couleur)} />
                  <span>{typeLabels[type]}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "10px", borderTop: "1px solid #E8D5A3", paddingTop: "10px" }}>
              <div style={styles.legende}>
                <div style={styles.legendeItem("#C0392B")}>
                  <div style={{ width: "24px", height: "3px", background: "#C0392B", opacity: 0.6 }} />
                  <span>Parcours Idris I</span>
                </div>
                <div style={styles.legendeItem("#1A6B9A")}>
                  <div style={{ width: "24px", height: "3px", background: "#1A6B9A", opacity: 0.6 }} />
                  <span>Parcours Idris II</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section : Timeline des événements */}
          <div style={styles.section}>
            <div style={styles.sectionTitre}>
              📅 Chronologie ({evenementsFiltres.length} événements)
            </div>
            <div>
              {evenementsFiltres.map((evt) => (
                <div
                  key={evt.id}
                  style={styles.evenementItem(evenementActif?.id === evt.id, evt.couleur)}
                  onClick={() => {
                    setEvenementActif(evt);
                    setCentreCarte([evt.lat, evt.lng]);
                    setZoomCarte(7);
                  }}
                >
                  <div style={styles.evenementAnnee(evt.couleur)}>{evt.annee}</div>
                  <div style={styles.evenementLieu}>{evt.titre}</div>
                  <div style={{ display: "flex", gap: "5px", marginTop: "3px", flexWrap: "wrap" }}>
                    <span style={styles.badge(couleurPersonnage[evt.personnage])}>
                      {evt.personnage}
                    </span>
                    <span style={styles.badge(evt.couleur)}>{typeLabels[evt.type]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Carte interactive */}
        <div style={styles.carteContainer}>
          <MapContainer
            center={[30.0, -2.0]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            {/* Tuiles de la carte (style sobre) */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {/* Animateur de vue (déplace la carte vers le point actif) */}
            <AnimateurCarte centre={centreCarte} zoom={zoomCarte} />

            {/* Tracé du parcours d'Idris Ier */}
            {(filtrePersonnage === "tous" || filtrePersonnage === "Idris I") && (
              <Polyline
                positions={lignesIdris1}
                color="#C0392B"
                weight={3}
                opacity={0.55}
                dashArray="8, 6"
              />
            )}

            {/* Tracé du parcours d'Idris II */}
            {(filtrePersonnage === "tous" || filtrePersonnage === "Idris II") && (
              <Polyline
                positions={lignesIdris2}
                color="#1A6B9A"
                weight={3}
                opacity={0.55}
                dashArray="8, 6"
              />
            )}

            {/* Marqueurs des événements filtrés */}
            {evenementsFiltres.map((evt) => (
              <Marker
                key={evt.id}
                position={[evt.lat, evt.lng]}
                icon={creerIconeMarqueur(
                  evt.couleur,
                  evenementActif?.id === evt.id ? 44 : 34
                )}
                eventHandlers={{
                  click: () => {
                    setEvenementActif(evt);
                    setCentreCarte([evt.lat, evt.lng]);
                    setZoomCarte(7);
                  },
                }}
              >
                <Popup>
                  {/* Popup Leaflet standard */}
                  <div
                    style={{
                      fontFamily: "'Crimson Text', Georgia, serif",
                      maxWidth: "240px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: evt.couleur,
                        marginBottom: "4px",
                      }}
                    >
                      {evt.titre}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        marginBottom: "6px",
                        fontStyle: "italic",
                      }}
                    >
                      {evt.lieu} · {evt.annee} · {evt.personnage}
                    </div>
                    <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#333" }}>
                      {evt.texte}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Panneau d'information détaillé (coin bas-droite) */}
          {evenementActif && (
            <div style={styles.popupDetail}>
              <button
                style={styles.fermerBtn}
                onClick={() => setEvenementActif(null)}
                title="Fermer"
              >
                ×
              </button>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: "#A89060",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                  fontFamily: "Georgia, serif",
                }}
              >
                {evenementActif.personnage} · {typeLabels[evenementActif.type]}
              </div>
              <h3 style={styles.popupTitre}>{evenementActif.titre}</h3>
              <div style={styles.popupMeta}>
                📍 {evenementActif.lieu} &nbsp;·&nbsp; 🗓 {evenementActif.annee}
              </div>
              <p style={styles.popupTexte}>{evenementActif.texte}</p>
              <div
                style={{
                  marginTop: "12px",
                  borderTop: "1px solid #C9A22740",
                  paddingTop: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "1px solid #C9A227",
                    color: "#C9A227",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontFamily: "inherit",
                  }}
                  onClick={() => {
                    const idx = evenementsTries.findIndex((e) => e.id === evenementActif.id);
                    if (idx > 0) {
                      const prev = evenementsTries[idx - 1];
                      setEvenementActif(prev);
                      setCentreCarte([prev.lat, prev.lng]);
                    }
                  }}
                >
                  ← Précédent
                </button>
                <span style={{ fontSize: "11px", color: "#A89060" }}>
                  {evenementsTries.findIndex((e) => e.id === evenementActif.id) + 1} /{" "}
                  {evenementsTries.length}
                </span>
                <button
                  style={{
                    background: "none",
                    border: "1px solid #C9A227",
                    color: "#C9A227",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontFamily: "inherit",
                  }}
                  onClick={() => {
                    const idx = evenementsTries.findIndex((e) => e.id === evenementActif.id);
                    if (idx < evenementsTries.length - 1) {
                      const next = evenementsTries[idx + 1];
                      setEvenementActif(next);
                      setCentreCarte([next.lat, next.lng]);
                    }
                  }}
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
