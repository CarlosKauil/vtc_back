import { Check, Sparkles, Crown, Building2 } from 'lucide-react';

export default function PricingPlans() {
  const plans = [
    {
      name: 'Plan Básico',
      price: 'Gratis',
      badge: 'Plan actual',
      icon: <Sparkles className="w-6 h-6" />,
      commission: '35% de comisión',
      features: [
        { label: 'Exposición', value: 'Hasta 3 obras por área artística' },
        { label: 'Archivos', value: 'Tamaño limitado' },
        { label: 'Soporte', value: 'Básico' }
      ]
    },
    {
      name: 'Plan Pro',
      price: '$99',
      period: '/mes',
      icon: <Crown className="w-6 h-6" />,
      commission: '30% de comisión',
      features: [
        { label: 'Exposición', value: 'Hasta 10 obras por área artística' },
        { label: 'Archivos', value: 'Archivos más grandes' },
        { label: 'Soporte', value: 'Prioritario' },
        { label: 'Análisis', value: 'Estadísticas avanzadas' }
      ],
      highlighted: true
    },
    {
      name: 'Plan Galería',
      price: 'Personalizado',
      icon: <Building2 className="w-6 h-6" />,
      commission: 'Desde 25% de comisión',
      features: [
        { label: 'Exposición', value: 'Obras ilimitadas' },
        { label: 'Archivos', value: 'Sin restricciones' },
        { label: 'Metaverso', value: 'Museo/galería virtual exclusivo' },
        { label: 'Con Subasta', value: '$2,499 MXN/mes (25% comisión)' },
        { label: 'Solo Exhibición', value: '$4,999 MXN/mes (sin comisiones)' }
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-[#0f1117] text-gray-200">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-4 text-4xl font-bold">
            KreaVerse Plans
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Elige el plan perfecto para tu arte. Desde artistas emergentes hasta galerías profesionales.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`relative group ${plan.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}`}>
              
              {/* Card */}
              <div
                className={`relative h-full rounded-3xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 ${
                  plan.highlighted ? 'ring-2 ring-blue-500/50' : ''
                }`}
              >

                {plan.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs">
                    {plan.badge}
                  </div>
                )}

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white mb-6 shadow-lg">
                  {plan.icon}
                </div>

                {/* Name */}
                <h3 className="text-gray-100 mb-2 text-xl font-semibold">{plan.name}</h3>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-white text-2xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  )}
                </div>

                {/* Commission */}
                <p className="text-gray-400 text-sm mb-6">{plan.commission}</p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-6" />

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 group/feature">
                      <div
                        className="
                          w-5 h-5 rounded-full 
                          bg-gradient-to-br from-blue-600 to-cyan-500 
                          flex items-center justify-center mt-0.5 
                          transition-all duration-300
                          group-hover/feature:shadow-[0_0_10px_4px_rgba(56,189,248,0.6)]
                        "
                      >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>

                      <p className="text-gray-300 text-sm">
                        <span className="font-medium">{feature.label}:</span> {feature.value}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`w-full py-3 px-6 rounded-xl transition-all duration-300 font-medium ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                      : 'bg-white/20 text-gray-200 hover:bg-white/30 border border-gray-400/20'
                  }`}
                >
                  {plan.badge ? 'Plan Actual' : 'Seleccionar Plan'}
                </button>
              </div>

              {/* Glow */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 ${
                  plan.highlighted ? 'opacity-40' : ''
                }`}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
