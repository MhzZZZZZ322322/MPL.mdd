import { motion } from 'framer-motion';
import NeonBorder from '@/components/animations/NeonBorder';
import MissionCard from '@/components/ui/mission-card';
import { Trophy, Users, Medal } from 'lucide-react';

const About = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const missions = [
    {
      icon: <Trophy size={30} />,
      title: "Dezvoltare",
      description: "Să creăm o scenă esports vibrantă și recunoscută în Republica Moldova.",
      iconColor: "text-secondary"
    },
    {
      icon: <Users size={30} />,
      title: "Comunitate",
      description: "Să construim un spațiu inclusiv pentru gameri de toate nivelurile.",
      iconColor: "text-accent"
    },
    {
      icon: <Medal size={30} />,
      title: "Excelență",
      description: "Să promovăm competiția de calitate și fair-play în mediul digital.",
      iconColor: "text-blue-500"
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 relative">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-4">
              Despre <span className="text-secondary">Moldova Pro League</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-10 items-center"
            variants={itemVariants}
          >
            <div>
              <h3 className="font-orbitron text-2xl mb-4 text-white">Povestea noastră</h3>
              <p className="mb-4">MPL (Moldova Pro League) este o comunitate independentă, născută din pasiune pură pentru gaming și dorința de a construi un ecosistem de cybersport autentic în Republica Moldova.</p>
              <p className="mb-4">Suntem o organizație fără bugete, fără sponsori și fără promisiuni goale – dar cu o echipă de oameni dedicați care cred că e-sportul merită un loc de cinste și recunoaștere în Moldova. Tot ce am făcut până acum – am făcut din proprie inițiativă, în timpul nostru liber, cu resurse minime, dar cu un scop clar: să aducem jucătorii împreună și să punem Moldova pe harta internațională a e-sportului.</p>
              <p className="mb-4">Organizăm turnee, ligă proprie și evenimente online, susținem creatorii locali și ne implicăm activ în creșterea comunității – de la casual players la profesioniști. MPL nu este doar despre competiție. Este despre comunitate, prietenie și oportunități reale.</p>
              <p>Dacă și tu visezi la o Moldovă unde gamingul este luat în serios – alătură-te nouă. MPL e deschisă tuturor: jucători, streameri, voluntari, sau pur și simplu fani ai e-sportului. Împreună putem construi ceva măreț. Chiar de la zero.</p>
            </div>
            
            <NeonBorder className="rounded-lg overflow-hidden">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="MPL Community Event" 
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </NeonBorder>
          </motion.div>
          
          <motion.div className="mt-16" variants={itemVariants}>
            <h3 className="font-orbitron text-2xl mb-6 text-white text-center">Misiunea noastră</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {missions.map((mission, index) => (
                <MissionCard
                  key={index}
                  icon={mission.icon}
                  title={mission.title}
                  description={mission.description}
                  iconColor={mission.iconColor}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
