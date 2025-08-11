import React, { useEffect } from 'react'
import "../css/Home.css"
import { useSelector } from 'react-redux'
import ProfileHeader from '../components/profile/ProfileHeader'
import { Button } from "@/components/ui/button";

// Shadcn ui
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import dashboardCards, { getIconComponent } from '../data/dashboardCards';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate()

  useEffect(() => {
    console.log('User data has changed:', user); // Log when user state changes
  }, [user]);

  // This is the common accent color for all cards
  const accentColor = "#4285B4";

  return (
    <>
      {/* <ProfileHeader /> */}
      <div className='homeWrapper w-full px-6 py-6'>
        {/* Map over the dashboardCards array to render multiple cards */}
        {dashboardCards.map((card) => {
          // Get the proper icon component based on the icon name in the card data
          const IconComponent = getIconComponent(card.icon);
          
          return (
            <Card 
              key={card.id}
              className="w-[300px] overflow-hidden border border-slate-200 rounded-lg transition-all duration-300 hover:shadow-md group relative"
            >
              {/* Left accent border */}
              <div className="h-full w-1.5 bg-[#4285B4] absolute left-0 top-0"></div>

              <div className="p-6 pl-8">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-md flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: accentColor }}
                  >
                    {/* Use the dynamically determined icon component */}
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">{card.title}</h3>
                </div>

                <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <CardFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                <Button
                  className="w-full"
                  style={{ backgroundColor: accentColor, color: "white" }}
                  onClick={() => {
                    navigate(card.route)
                  }}
                >
                  View {card.title}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  )
}

export default Home