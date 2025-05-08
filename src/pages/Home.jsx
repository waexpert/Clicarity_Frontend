import React, { useEffect } from 'react'
import Card from '../components/Card'
import "../css/Home.css"
import { useSelector } from 'react-redux'
import ProfileHeader from '../components/profile/ProfileHeader'

const Home = () => {

  const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log('User data has changed:', user); // Log when user state changes
  }, [user]);

  console.log(user);
  return (
    <>
      <ProfileHeader />
      <div className='homeWrapper'>
        <Card
          title="Channels"
          description="One stop solution to manage your channels."
          icon="https://img.icons8.com/ios/50/000000/module.png"
          buttonText="Channels"
        />

      </div>
    </>
  )
}

export default Home