import React from 'react';
import { Link } from 'react-router';
import { Wrench, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1E40AF] rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                By<span className="text-[#10B981]">Me</span>
              </span>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
              Conectamos profesionales locales con vecinos de Popayán que necesitan servicios de calidad.
            </p>
            <div className="flex items-center gap-2 text-[#9CA3AF] text-sm mb-2">
              <MapPin className="w-4 h-4 flex-shrink-0 text-[#10B981]" />
              <span>Popayán, Cauca, Colombia</span>
            </div>
            <div className="flex items-center gap-2 text-[#9CA3AF] text-sm mb-2">
              <Phone className="w-4 h-4 flex-shrink-0 text-[#10B981]" />
              <span>+57 (602) 820 0000</span>
            </div>
            <div className="flex items-center gap-2 text-[#9CA3AF] text-sm">
              <Mail className="w-4 h-4 flex-shrink-0 text-[#10B981]" />
              <span>hola@byme.co</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Servicios</h4>
            <ul className="space-y-3">
              {['Plomería', 'Electricidad', 'Pintura', 'Carpintería', 'Limpieza', 'Cerrajería', 'Jardinería'].map(s => (
                <li key={s}>
                  <Link to="/buscar" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-3">
              {[
                { label: 'Acerca de ByMe', href: '#' },
                { label: 'Cómo funciona', href: '/#como-funciona' },
                { label: 'Sé un Profesional', href: '/registro/profesional' },
                { label: 'Blog', href: '#' },
                { label: 'Prensa', href: '#' },
                { label: 'Trabaja con nosotros', href: '#' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Soporte</h4>
            <ul className="space-y-3">
              {[
                { label: 'Centro de ayuda', href: '#' },
                { label: 'Términos y condiciones', href: '#' },
                { label: 'Política de privacidad', href: '#' },
                { label: 'Política de reembolsos', href: '#' },
                { label: 'Contacto', href: '#' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-3">Síguenos</p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 bg-[#1F2937] rounded-lg flex items-center justify-center hover:bg-[#1E40AF] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#9CA3AF] hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B7280]">
            © 2025 ByMe Technologies S.A.S. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
            <span>Popayán, Cauca · Colombia 🇨🇴</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
