const SEO_CATEGORIES: { title: string; tags: string[] }[] = [
  { title: "Véhicules", tags: ["Voitures", "Motos", "Caravaning", "Utilitaires", "Camions", "Nautisme", "Vélos", "Équipement auto", "Équipement moto"] },
  { title: "Loisirs", tags: ["Antiquités", "Collection", "DVD - Films", "CD - Musique", "Livres", "Modélisme", "Vins & Gastronomie", "Sport & Plein air", "Billetterie"] },
  { title: "Maison & jardin", tags: ["Ameublement", "Papeterie & Fournitures scolaires", "Électroménager", "Arts de la table", "Décoration", "Linge de maison", "Bricolage", "Jardin & Plantes"] },
  { title: "Électronique", tags: ["Ordinateurs", "Tablettes & Liseuses", "Photo, audio & vidéo", "Téléphones & Objets connectés", "Consoles", "Jeux vidéo"] },
  { title: "Matériel pro", tags: ["Tracteurs", "Matériel agricole", "BTP - Chantier gros-œuvre", "Poids lourds", "Équipements industriels", "Matériel médical"] },
  { title: "Famille", tags: ["Mobilier enfant", "Équipement bébé", "Vêtements bébé", "Vêtements enfants", "Jeux & Jouets", "Baby-Sitting"] },
  { title: "Immobilier", tags: ["Ventes immobilières", "Locations", "Colocations", "Bureaux & Commerces", "Services de déménagement"] },
  { title: "Services", tags: ["Covoiturage", "Cours particuliers", "Services à la personne", "Services de déménagement", "Évènements"] },
  { title: "Mode", tags: ["Vêtements", "Chaussures", "Accessoires & Bagagerie", "Montres & Bijoux"] },
  { title: "Locations de vacances", tags: ["Locations saisonnières", "Hôtels", "Ventes flash vacances"] },
  { title: "Animaux", tags: ["Animaux", "Accessoires animaux", "Services aux animaux"] },
  { title: "Emploi", tags: ["Offres d'emploi", "Formations professionnelles"] },
];

const SEO_REGIONS: { title: string; tags: string[] }[] = [
  { title: "Sud-Ouest", tags: ["Aquitaine", "Midi-Pyrénées"] },
  { title: "Centre", tags: ["Auvergne", "Centre", "Ile-de-France", "Limousin"] },
  { title: "Ouest", tags: ["Basse-Normandie", "Bretagne", "Haute-Normandie", "Pays de la Loire", "Poitou-Charentes"] },
  { title: "Dom-Tom", tags: ["Guadeloupe", "Guyane", "Martinique", "Nouvelle-Calédonie", "Réunion", "Saint-Martin - Saint-Barthélemy", "Tahiti"] },
  { title: "Sud", tags: ["Rhône-Alpes", "Provence-Alpes-Côte d'Azur", "Corse", "Languedoc-Roussillon"] },
  { title: "Est", tags: ["Alsace", "Lorraine", "Champagne-Ardenne", "Bourgogne", "Franche-Comté"] },
  { title: "Nord", tags: ["Nord-Pas-de-Calais", "Picardie"] },
];

export default function SeoLinks() {
  return (
    <section className="seo-links">
      <div className="wrap">
        <div className="seo-cats">
          {SEO_CATEGORIES.map((block) => (
            <div className="seo-block" key={block.title}>
              <h3>{block.title}</h3>
              <div className="seo-tags">
                {block.tags.map((tag) => (
                  <a href="#" key={tag}>
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="seo-regions">
          {SEO_REGIONS.map((zone) => (
            <div className="region-zone" key={zone.title}>
              <h4>{zone.title}</h4>
              <div className="seo-tags">
                {zone.tags.map((tag) => (
                  <a href="#" key={tag}>
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
