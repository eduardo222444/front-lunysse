import { CheckCircle } from "lucide-react";

export const About = () => {
  const qualities = [
    {
      bg: "bg-medium text-background",
      items: [
        "Acolhimento humano – atendimento pensado para valorizar o cuidado e a empatia.",
        "Segurança de dados – conformidade com a LGPD, garantindo privacidade e confidencialidade.",
        "Organização eficiente – sistema centralizado que facilita agendamentos e evita conflitos de horários."
      ]
    },
    {
      bg: "bg-background text-dark",
      items: [
        "Acessibilidade – interface simples e inclusiva, pensada para todos os públicos.",
        "Agilidade – marcação de consultas em poucos cliques, sem burocracia.",
        "Confiabilidade – profissionais verificados e sistema transparente."
      ]
    },
    {
      bg: "bg-light text-background",
      items: [
        "Suporte personalizado – acompanhamento próximo para instituições, pacientes e profissionais.",
        "Inovação – uso de inteligência artificial para otimizar triagem e identificar padrões de risco.",
        "Flexibilidade – solução adaptada para clínicas, ONGs, universidades e projetos sociais.",
        "Impacto social – democratização do acesso a cuidados em saúde mental."
      ]
    }
  ];

  return (
    <div className="py-12 space-y-16">

      

      {/* Seção Qualidades */}
      <section className="py-12 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-dark text-center mb-10">Qualidades</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {qualities.map((quality, index) => (
              <div
                key={index}
                className={`${quality.bg} rounded-3xl p-6 shadow-lg leading-relaxed text-sm font-medium`}
              >
                <ul className="space-y-4">
                  {quality.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};