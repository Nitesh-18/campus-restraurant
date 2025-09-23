'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Zap, Users } from 'lucide-react';

export default function AboutPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-extrabold text-red-600">
            About Campus Eats
          </CardTitle>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Delicious food, delivered fast — crafted just for students.
          </p>
        </CardHeader>

        <CardContent className="space-y-10 text-gray-700 text-lg">
          {/* Intro */}
          <div className="space-y-4 text-center">
            <p>
              Welcome to <span className="font-semibold text-red-600">Campus Eats</span>! 
              We’re dedicated to bringing you the freshest meals, prepared with local 
              ingredients by passionate chefs who care about flavor and quality.
            </p>
            <p>
              From quick bites between lectures to full meals that fuel your study 
              sessions, our mission is to make campus dining easy, tasty, and fun.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <Utensils className="h-10 w-10 text-red-600" />
              <h3 className="font-semibold text-xl">Fresh & Local</h3>
              <p className="text-gray-600 text-base">
                Handpicked ingredients and chef-curated meals to keep you energized.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <Zap className="h-10 w-10 text-red-600" />
              <h3 className="font-semibold text-xl">Fast & Reliable</h3>
              <p className="text-gray-600 text-base">
                Real-time order tracking and quick delivery across campus.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <Users className="h-10 w-10 text-red-600" />
              <h3 className="font-semibold text-xl">For Students</h3>
              <p className="text-gray-600 text-base">
                Affordable meals and an app designed with students in mind.
              </p>
            </div>
          </div>

          {/* Closing line */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">
              Join the <span className="text-red-600">Campus Eats</span> community today and 
              experience dining reimagined for student life.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
