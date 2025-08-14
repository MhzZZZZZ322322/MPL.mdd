import NeonBorder from "@/components/animations/NeonBorder";
import MissionCard from "@/components/ui/mission-card";
import {
  Trophy,
  Users,
  Medal,
  LucideTerminal,
  History,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/lib/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  
  const missions = [
    {
      icon: <Trophy size={30} />,
      title: t('about.mission1.title'),
      description: t('about.mission1.description'),
      iconColor: "text-secondary",
    },
    {
      icon: <Users size={30} />,
      title: t('about.mission2.title'),
      description: t('about.mission2.description'),
      iconColor: "text-accent",
    },
    {
      icon: <Medal size={30} />,
      title: t('about.mission3.title'),
      description: t('about.mission3.description'),
      iconColor: "text-blue-500",
    },
  ];

  const timeline = [
    {
      year: t('about.timeline.event1.date'),
      title: t('about.timeline.event1.title'),
      description: t('about.timeline.event1.description'),
      icon: <Trophy />,
      link: "/events/mpl-pilot-cup"
    },
    {
      year: t('about.timeline.event2.date'),
      title: t('about.timeline.event2.title'),
      description: t('about.timeline.event2.description'),
      icon: <Medal />,
      link: "/events/hator-cs-league"
    },
    {
      year: "23-24 August 2025",
      title: "HATOR CUP - ROPL x MPL",
      description: "Primul turneu de colaborare ROPL x MPL. Super turneu CS2 powered by HATOR și SkinBaron cu prize pool 5500 RON.",
      icon: <LucideTerminal />,
      link: "/events/hator-cup-ropl-mpl"
    },
    {
      year: "15 August - 28 Septembrie 2025",
      title: "Kingston x HyperX - Supercup Season 1",
      description: "Primul turneu major cu 32 echipe și premii în valoare de 100,000 LEI. Format: Calificare → Grupe → Playoff.",
      icon: <Sparkles />,
      link: "/events/kingston-hyperx-supercup",
      isActive: true
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
              {t('about.title')} <span className="text-secondary">{t('about.mpl')}</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div data-aos="fade-right" data-aos-delay="100">
              <h3 className="font-orbitron text-2xl mb-4 text-white">
                {t('about.story.title')}
              </h3>
              <p className="mb-4">
                {t('about.story.p1')}
              </p>
              <p className="mb-4">
                {t('about.story.p2')}
              </p>
              <p className="mb-4">
                {t('about.story.p3')}
              </p>
              <p>
                {t('about.story.p4')}
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
                {t('about.timeline')}
              </h3>
            </div>

            <div className="relative">
              {/* Timeline Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex md:justify-center text-center"
                    data-aos="fade-up"
                    data-aos-delay={100 * (index + 1)}
                  >
                    <div className={`flex-1 md:max-w-sm p-6 rounded-lg border transition-all ${
                      item.isActive 
                        ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary shadow-[0_0_20px_rgba(139,92,246,0.4)]' 
                        : 'bg-darkGray/50 border-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                    }`}>
                      <div className={`mx-auto mb-4 w-12 h-12 rounded-full z-10 flex items-center justify-center ${
                        item.isActive ? 'bg-primary text-white' : 'bg-darkBg border-2 border-primary text-primary'
                      }`}>
                        {item.icon}
                      </div>
                      <div className={`mb-2 font-bold ${item.isActive ? 'text-primary' : 'text-secondary'}`}>
                        {item.year}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 mb-4">{item.description}</p>
                      <div>
                        <Link href={item.link}>
                          <Button 
                            variant={item.isActive ? "default" : "outline"} 
                            size="sm" 
                            className={item.isActive 
                              ? "bg-primary hover:bg-primary/90 text-white" 
                              : "text-primary border-primary hover:bg-primary/10"
                            }
                          >
                            {item.isActive ? "ÎNSCRIE-TE ACUM" : t('about.event.details')} 
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
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
                {t('about.mission')}
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
                  {t('about.join.community')}
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
