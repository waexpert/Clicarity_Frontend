import React from 'react'
import Card from '../components/Card'
import "../css/Home.css"

const Home = () => {
  return (
    <div className='homeWrapper'>
      <Card
        title="Channels"
        description="One stop solution to manage your channels."
        icon="https://img.icons8.com/ios/50/000000/module.png"
        buttonText="Channels"
      />

      <Card
        title="Channels"
        description="One stop solution to manage your channels."
        icon="https://img.icons8.com/ios/50/000000/module.png"
        buttonText="Channels"
      />

      <Card
        title="Channels"
        description="One stop solution to manage your channels."
        icon="https://img.icons8.com/ios/50/000000/module.png"
        buttonText="Channels"
      />
    </div>
  )
}

export default Home