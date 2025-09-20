import React, { useState, useEffect } from 'react';
import ClientNavbar from '../../components/client/ClientNavbar';
import { 
  FiSearch, 
  FiMapPin, 
  FiBriefcase
} from 'react-icons/fi';

const HireHubHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    companies: 0,
    candidates: 0
  });

  useEffect(() => {
    // Animation des statistiques
    const animateStats = () => {
      setTimeout(() => setJobStats({ totalJobs: 1247, companies: 89, candidates: 3456 }), 500);
    };
    animateStats();
  }, []);


  return (
    <div style={styles.container}>
      <ClientNavbar />
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Trouvez votre <span style={styles.highlight}>emploi idéal</span> à Madagascar
            </h1>
            <p style={styles.heroSubtitle}>
              Découvrez des milliers d'opportunités professionnelles et donnez un nouvel élan à votre carrière
            </p>
            
            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <div style={styles.searchBar}>
                <div style={styles.searchInput}>
                  <FiSearch style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Poste, mot-clé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.locationInput}>
                  <FiMapPin style={styles.locationIcon} />
                  <input
                    type="text"
                    placeholder="Ville, région..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <button style={styles.searchButton}>
                  <FiSearch size={20} />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={styles.quickStats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{jobStats.totalJobs.toLocaleString()}</span>
                <span style={styles.statLabel}>Annonces actives</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{jobStats.companies}</span>
                <span style={styles.statLabel}>Entreprises</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{jobStats.candidates.toLocaleString()}</span>
                <span style={styles.statLabel}>Candidats</span>
              </div>
            </div>
          </div>
          
          <div style={styles.heroImage}>
            <div style={styles.heroImageContainer}>
              <svg viewBox="0 0 400 300" style={styles.heroSvg}>
                {/* Background */}
                <rect width="400" height="300" fill="url(#gradient1)" />
                
                {/* Buildings */}
                <rect x="50" y="180" width="60" height="120" fill="#1e3a8a" opacity="0.8" />
                <rect x="120" y="150" width="50" height="150" fill="#0ea5e9" opacity="0.9" />
                <rect x="180" y="170" width="70" height="130" fill="#1e3a8a" opacity="0.7" />
                <rect x="260" y="140" width="55" height="160" fill="#0ea5e9" opacity="0.8" />
                <rect x="325" y="160" width="45" height="140" fill="#1e3a8a" opacity="0.6" />
                
                {/* Windows */}
                <rect x="60" y="190" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="75" y="190" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="90" y="190" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="60" y="210" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="75" y="210" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="90" y="210" width="8" height="8" fill="#ffffff" opacity="0.8" />
                
                <rect x="130" y="160" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="145" y="160" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="130" y="180" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="145" y="180" width="8" height="8" fill="#ffffff" opacity="0.8" />
                
                <rect x="190" y="180" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="210" y="180" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="230" y="180" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="190" y="200" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="210" y="200" width="8" height="8" fill="#ffffff" opacity="0.8" />
                <rect x="230" y="200" width="8" height="8" fill="#ffffff" opacity="0.8" />
                
                {/* People silhouettes */}
                <circle cx="150" cy="280" r="8" fill="#ffffff" opacity="0.6" />
                <rect x="145" y="285" width="10" height="15" fill="#ffffff" opacity="0.6" />
                
                <circle cx="200" cy="285" r="6" fill="#ffffff" opacity="0.5" />
                <rect x="197" y="290" width="6" height="10" fill="#ffffff" opacity="0.5" />
                
                <circle cx="280" cy="282" r="7" fill="#ffffff" opacity="0.4" />
                <rect x="276" y="287" width="8" height="13" fill="#ffffff" opacity="0.4" />
                
                {/* Floating elements */}
                <circle cx="80" cy="80" r="15" fill="#0ea5e9" opacity="0.3" />
                <circle cx="320" cy="60" r="12" fill="#1e3a8a" opacity="0.3" />
                <circle cx="300" cy="90" r="8" fill="#0ea5e9" opacity="0.4" />
                
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff'
  },
  hero: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
    padding: '100px 0',
    color: '#ffffff'
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '60px'
  },
  heroText: {
    flex: 1
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '20px'
  },
  highlight: {
    color: '#0ea5e9'
  },
  heroSubtitle: {
    fontSize: '20px',
    lineHeight: '1.6',
    marginBottom: '40px',
    opacity: 0.9
  },
  searchContainer: {
    marginBottom: '40px'
  },
  searchBar: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    gap: '8px'
  },
  searchInput: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px'
  },
  locationInput: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px',
    borderLeft: '1px solid #e5e7eb'
  },
  searchIcon: {
    color: '#6b7280',
    fontSize: '20px'
  },
  locationIcon: {
    color: '#6b7280',
    fontSize: '20px'
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: '#1f2937',
    backgroundColor: 'transparent',
    width: '100%'
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  quickStats: {
    display: 'flex',
    gap: '40px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0ea5e9'
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.8
  },
  heroImage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  heroImageContainer: {
    width: '400px',
    height: '300px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    overflow: 'hidden'
  },
  heroSvg: {
    width: '100%',
    height: '100%',
    borderRadius: '20px'
  },
  categoriesSection: {
    padding: '80px 0',
    backgroundColor: '#f9fafb'
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '16px',
    color: '#1f2937'
  },
  sectionSubtitle: {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '60px',
    color: '#6b7280'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    textAlign: 'center',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  categoryIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px'
  },
  categoryEmoji: {
    fontSize: '32px'
  },
  categoryName: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1f2937'
  },
  categoryCount: {
    fontSize: '16px',
    color: '#6b7280'
  },
  jobsSection: {
    padding: '80px 0'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '60px'
  },
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px'
  },
  jobCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  jobLogo: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  jobType: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  jobTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1f2937'
  },
  jobCompany: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '20px'
  },
  jobDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  jobLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6b7280',
    fontSize: '14px'
  },
  jobSalary: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#059669'
  },
  applyButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  howItWorksSection: {
    padding: '80px 0',
    backgroundColor: '#f9fafb'
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px'
  },
  step: {
    textAlign: 'center'
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 auto 24px'
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1f2937'
  },
  stepDescription: {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.6'
  },
  testimonialsSection: {
    padding: '80px 0'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '32px'
  },
  testimonialCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  testimonialRating: {
    display: 'flex',
    gap: '4px',
    marginBottom: '20px'
  },
  testimonialContent: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#374151',
    marginBottom: '24px',
    fontStyle: 'italic'
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  authorAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600'
  },
  authorName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937'
  },
  authorRole: {
    fontSize: '14px',
    color: '#6b7280'
  },
  ctaSection: {
    padding: '80px 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff'
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center'
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '20px'
  },
  ctaSubtitle: {
    fontSize: '18px',
    marginBottom: '40px',
    opacity: 0.9
  },
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
  },
  ctaPrimaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fbbf24',
    color: '#1f2937',
    border: 'none',
    borderRadius: '8px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  ctaSecondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '8px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  footer: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '60px 0 20px'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '60px'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  footerDescription: {
    fontSize: '16px',
    color: '#9ca3af',
    lineHeight: '1.6'
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px'
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  footerColumnTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px'
  },
  footerLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    marginBottom: '12px',
    fontSize: '16px',
    transition: 'color 0.2s ease'
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '40px auto 0',
    padding: '20px 20px 0',
    borderTop: '1px solid #374151',
    textAlign: 'center'
  },
  footerCopyright: {
    color: '#9ca3af',
    fontSize: '14px'
  }
};

export default HireHubHome;
