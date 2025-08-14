import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import TeamRegistrationPublic from "@/components/TeamRegistrationPublic";

export default function TeamRegistration() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <Link href="/events/kingston-hyperx-supercup" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Înapoi la turneu
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Înregistrare Echipă
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Alătură-te celei mai mari competiții CS2 din Moldova
          </p>
        </div>

        <TeamRegistrationPublic />
      </div>
    </div>
  );
}