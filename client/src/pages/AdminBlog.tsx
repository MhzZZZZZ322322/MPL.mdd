import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import BlogManager from '@/components/admin/BlogManager';

export default function AdminBlog() {
  return (
    <>
      <Helmet>
        <title>Blog Manager | Moldova Pro League</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-darkBg">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Înapoi la Admin
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-rajdhani font-bold text-white">
                    Manager Blog & Știri
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mt-2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Manager Component */}
          <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
            <BlogManager />
          </div>
        </div>
      </div>
    </>
  );
}