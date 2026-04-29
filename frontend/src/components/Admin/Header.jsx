import React from "react";
import { Sparkles, User } from "lucide-react";
import { brand } from "./AdminStyles";

export default function Header() {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '50px',
      flexShrink: 0,
      animation: 'fadeIn 1s ease-out'
    }}>
      {/* Khu vực Slogan với Animation Chữ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: '900',
            color: brand.sidebar,
            letterSpacing: '0.2px',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            lineHeight: 1.1,
            display: 'flex',
            gap: '8px',
            overflow: 'hidden'
          }}>
            {/* Tách chữ để tạo hiệu ứng reveal từng từ hoặc cụm */}
            <span style={{ animation: 'textReveal 0.8s cubic-bezier(0.77,0,0.175,1) forwards' }}>Hometic:</span>
            <span style={{
              color: brand.orange,
              animation: 'textReveal 0.8s 0.2s cubic-bezier(0.77,0,0.175,1) forwards',
              opacity: 0,
              backgroundImage: `linear-gradient(90deg, ${brand.orange}, #ffb366, ${brand.orange})`,
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              animationName: 'textReveal, shimmer',
              animationDuration: '0.8s, 3s',
              animationDelay: '0.2s, 0s',
              animationIterationCount: '1, infinite'
            }}>Nâng tầm</span>
            <span style={{ animation: 'textReveal 0.8s 0.3s cubic-bezier(0.77,0,0.175,1) forwards', opacity: 0 }}>không gian</span>
          </h2>

          <p style={{
            margin: '4px 0 0 0',
            fontSize: '14px',
            color: brand.muted,
            fontWeight: '600',
            letterSpacing: '0.5px',
            animation: 'fadeInBlur 1.2s 0.5s forwards',
            opacity: 0
          }}>
            Quản trị thông minh cho ngôi nhà hiện đại
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <div style={{ height: '35px', width: '1.5px', backgroundColor: brand.border, opacity: 0.6 }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: brand.sidebar }}>Hometic Store</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulseStatus 2s infinite'
              }}></div>
              <div style={{ fontSize: '12px', color: brand.muted, fontWeight: '700' }}>Hệ thống ổn định</div>
            </div>
          </div>

          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            backgroundColor: brand.white,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: `1px solid ${brand.border}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: '0.3s'
          }}
            className="admin-avatar"
          >
            <User size={26} color={brand.sidebar} />
          </div>
        </div>
      </div>

      <style>{`
        /* Hiệu ứng hiện chữ từ dưới lên chuyên nghiệp */
        @keyframes textReveal {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Hiện dần và mờ nhòe nhẹ khi bắt đầu */
        @keyframes fadeInBlur {
          from { opacity: 0; filter: blur(4px); transform: translateX(-10px); }
          to { opacity: 0.8; filter: blur(0); transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Hiệu ứng ánh sáng lướt qua chữ Orange */
        @keyframes shimmer {
          to { background-position: 200% center; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes rotateSparkle {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          75% { transform: rotate(-10deg) scale(0.9); }
          100% { transform: rotate(0deg) scale(1); }
        }

        @keyframes pulseStatus {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); transform: scale(1); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); transform: scale(1.1); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); transform: scale(1); }
        }

        .admin-avatar:hover {
          transform: translateY(-3px) scale(1.05);
          border-color: ${brand.orange};
          box-shadow: 0 10px 25px rgba(218, 143, 72, 0.2);
        }
      `}</style>
    </header>
  );
}