export const brand = {
  bg: "#fdfbf7",
  sidebar: "#234a4a",
  primary: "#008080",
  orange: "#da8f48",
  white: "#ffffff",
  border: "#ece9e0",
  text: "#2d3436",
  muted: "#808e9b",
  success: "#2ecc71",
  danger: "#e74c3c",
  accent: "#f39c12",
  panel: "#f8f6f0"
};

export const adminStyles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    backgroundColor: brand.bg,
    fontFamily: '"Outfit", "Inter", sans-serif',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    position: 'fixed',
    top: 0,
    left: 0
  },
  sidebar: {
    width: '280px',
    backgroundColor: brand.sidebar,
    color: brand.white,
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 24px',
    height: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
    boxShadow: '10px 0 30px rgba(35, 74, 74, 0.05)'
  },
  navContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '40px'
  },
  main: {
    flex: 1,
    height: '100%',
    overflowY: 'auto',
    padding: '40px 50px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    scrollBehavior: 'smooth'
  },
  navButton: (active) => ({
    width: '100%',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
    border: 'none',
    borderRadius: '18px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: active ? '700' : '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left'
  }),
  card: {
    backgroundColor: brand.white,
    borderRadius: '30px',
    padding: '30px',
    boxShadow: '0 15px 40px rgba(35, 74, 74, 0.04)',
    border: `1px solid ${brand.border}`,
    transition: 'transform 0.3s ease'
  },
  statsCard: {
    backgroundColor: brand.white,
    borderRadius: '28px',
    padding: '25px 30px',
    boxShadow: '0 10px 30px rgba(35, 74, 74, 0.03)',
    border: `1px solid ${brand.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  tableWrapper: {
    backgroundColor: brand.white,
    borderRadius: '32px',
    padding: '35px',
    border: `1px solid ${brand.border}`,
    boxShadow: '0 20px 50px rgba(35, 74, 74, 0.05)'
  },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
  th: { textAlign: 'left', padding: '15px 20px', color: brand.muted, fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' },
  td: { padding: '20px', fontSize: '14px', backgroundColor: '#fff', borderBottom: `1px solid ${brand.panel}`, color: brand.text },
  badge: (status) => {
    const colors = { 'delivered': '#27ae60', 'pending': '#ed7f1a', 'cancelled': '#e74c3c', 'shipping': '#3498db', 'processing': '#3498db' };
    const color = colors[status] || '#666';
    return {
      backgroundColor: `${color}12`,
      color: color,
      padding: '8px 14px',
      borderRadius: '12px',
      fontWeight: '800',
      fontSize: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    };
  }
};
