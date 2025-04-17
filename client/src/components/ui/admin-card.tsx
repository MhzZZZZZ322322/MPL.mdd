import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'wouter';

interface AdminCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, description, icon: Icon, href }) => {
  return (
    <Link href={href}>
      <div className="bg-darkBg border border-primary/20 rounded-lg p-6 hover:border-primary/40 hover:shadow-glow transition-all cursor-pointer h-full">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-md w-fit">
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-rajdhani font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
          <div className="mt-4 text-primary text-sm font-medium">Accesează</div>
        </div>
      </div>
    </Link>
  );
};

export default AdminCard;