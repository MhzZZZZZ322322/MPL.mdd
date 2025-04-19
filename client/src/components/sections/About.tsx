import NeonBorder from "@/components/animations/NeonBorder";
import MissionCard from "@/components/ui/mission-card";
import {
  Trophy,
  Users,
  Medal,
  LucideTerminal,
  History,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const About = () => {
  const missions = [
    {
      icon: <Trophy size={30} />,
      title: "Dezvoltare",
      description:
        "Să creăm o scenă esports vibrantă și recunoscută în Republica Moldova.",
      iconColor: "text-secondary",
    },
    {
      icon: <Users size={30} />,
      title: "Comunitate",
      description:
        "Să construim un spațiu inclusiv pentru gameri de toate nivelurile.",
      iconColor: "text-accent",
    },
    {
      icon: <Medal size={30} />,
      title: "Excelență",
      description:
        "Să promovăm competiția de calitate și fair-play în mediul digital.",
      iconColor: "text-blue-500",
    },
  ];

  const timeline = [
    {
      year: "22-23 Martie 2025",
      title: "MPL Pilot Cup",
      description: "Turneul inaugural dedicat jucătorilor din Moldova și România cu susținerea oferită de Darwin și HATOR.",
      icon: <Trophy />,
    },
    {
      year: "Mai-Iunie 2025",
      title: "HATOR CS2 LEAGUE MOLDOVA",
      description:
        "Un turneu major sponsorizat de HATOR cu premii substanțiale, marcând un moment cheie pentru scena competitivă  din Moldova.",
      icon: <Medal />,
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern
            id="pattern-circles"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
            patternContentUnits="userSpaceOnUse"
          >
            <circle
              id="pattern-circle"
              cx="10"
              cy="10"
              r="1.6257413380501518"
              fill="#a855f7"
            ></circle>
          </pattern>
          <rect
            id="rect"
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#pattern-circles)"
          ></rect>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-4">
              Despre <span className="text-secondary">Moldova Pro League</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div data-aos="fade-right" data-aos-delay="100">
              <h3 className="font-orbitron text-2xl mb-4 text-white">
                Povestea noastră
              </h3>
              <p className="mb-4">
                MPL (Moldova Pro League) este o comunitate independentă, născută
                din pasiune pură pentru gaming și dorința de a construi un
                ecosistem de cybersport autentic în Republica Moldova.
              </p>
              <p className="mb-4">
                Suntem o organizație fără bugete, fără sponsori și fără
                promisiuni goale – dar cu o echipă de oameni dedicați care cred
                că e-sportul merită un loc de cinste și recunoaștere în Moldova.
                Tot ce am făcut până acum – am făcut din proprie inițiativă, în
                timpul nostru liber, cu resurse minime, dar cu un scop clar: să
                aducem jucătorii împreună și să punem Moldova pe harta
                internațională a e-sportului.
              </p>
              <p className="mb-4">
                Organizăm turnee, ligă proprie și evenimente online, susținem
                creatorii locali și ne implicăm activ în creșterea comunității –
                de la casual players la profesioniști. MPL nu este doar despre
                competiție. Este despre comunitate, prietenie și oportunități
                reale.
              </p>
              <p>
                Dacă și tu visezi la o Moldovă unde gamingul este luat în serios
                – alătură-te nouă. MPL e deschisă tuturor: jucători, streameri,
                voluntari, sau pur și simplu fani ai e-sportului. Împreună putem
                construi ceva măreț. Chiar de la zero.
              </p>
            </div>

            <div data-aos="fade-left" data-aos-delay="200">
              <NeonBorder className="rounded-lg overflow-hidden">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                    alt="MPL Community Event"
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>
              </NeonBorder>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-16">
            <div data-aos="fade-up">
              <h3 className="font-orbitron text-2xl mb-8 text-white text-center">
                Cronologia MPL
              </h3>
            </div>

            <div className="relative">
              {/* Timeline Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"} ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                    data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                    data-aos-delay={100 * (index + 1)}
                  >
                    <div className="flex-1 md:max-w-sm bg-darkGray/50 p-6 rounded-lg border border-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-darkBg border-2 border-primary rounded-full z-10 flex items-center justify-center text-primary">
                        {item.icon}
                      </div>
                      <div className="mb-2 text-secondary font-bold">
                        {item.year}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div>
            <div data-aos="fade-up">
              <h3 className="font-orbitron text-2xl mb-8 text-white text-center">
                Misiunea noastră
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {missions.map((mission, index) => (
                <div
                  key={index}
                  data-aos="zoom-in"
                  data-aos-delay={100 * (index + 1)}
                >
                  <MissionCard
                    icon={mission.icon}
                    title={mission.title}
                    description={mission.description}
                    iconColor={mission.iconColor}
                  />
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Link href="/#contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                >
                  Alătură-te comunității
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
